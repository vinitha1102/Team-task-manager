from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    is_admin: bool
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ProjectBase(BaseModel):
    name: str
    description: str

class ProjectOut(ProjectBase):
    id: int
    class Config:
        orm_mode = True

class TaskBase(BaseModel):
    title: str
    description: str
    deadline: datetime
    priority: str
    status: Optional[str] = "not_started"
    project_id: int
    user_id: int

class TaskOut(TaskBase):
    id: int
    class Config:
        orm_mode = True

class CommentBase(BaseModel):
    text: str
    task_id: int

class CommentOut(CommentBase):
    id: int
    user_id: int
    timestamp: datetime
    class Config:
        orm_mode = True
