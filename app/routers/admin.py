from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.auth import get_db, get_current_admin
from fastapi import Header, Depends

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

# Create a project
@router.post("/projects", response_model=schemas.ProjectOut)
def create_project(project: schemas.ProjectBase, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    new_project = models.Project(**project.dict())
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

# Get all projects
@router.get("/projects", response_model=List[schemas.ProjectOut])
def get_projects(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(models.Project).all()

# Delete a project
@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}

# Assign task
@router.post("/tasks", response_model=schemas.TaskOut)
def assign_task(task: schemas.TaskBase, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    new_task = models.Task(**task.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# Get all tasks with optional status filter
@router.get("/tasks", response_model=List[schemas.TaskOut])
def get_tasks(status: Optional[str] = Query(None), db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    query = db.query(models.Task)
    if status:
        query = query.filter(models.Task.status == status)
    return query.all()

# Get all comments for a task
@router.get("/tasks/{task_id}/comments", response_model=List[schemas.CommentOut])
def get_comments(task_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(models.Comment).filter(models.Comment.task_id == task_id).all()
