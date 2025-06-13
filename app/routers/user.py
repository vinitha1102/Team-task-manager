from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, auth
from app.auth import get_db, hash_password, verify_password, create_access_token, get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from typing import List

router = APIRouter(
    prefix="",
    tags=["Users"]
)

# Register
@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed = hash_password(user.password)
    new_user = models.User(username=user.username, password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Login
@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

# View assigned tasks
@router.get("/my-tasks", response_model=List[schemas.TaskOut])
def get_my_tasks(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Task).filter(models.Task.user_id == current_user.id).all()

# Update task status
@router.put("/tasks/{task_id}/status")
def update_status(task_id: int, status: str, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not assigned to you")
    task.status = status
    db.commit()           
    db.refresh(task)       
    return task

# Leave a comment on a task
@router.post("/tasks/{task_id}/comments", response_model=schemas.CommentOut)
def leave_comment(
    task_id: int,
    comment: schemas.CommentBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not assigned to you")

    new_comment = models.Comment(
        text=comment.text,
        task_id=task_id,
        user_id=current_user.id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment
