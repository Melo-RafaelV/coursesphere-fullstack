from pydantic import BaseModel, EmailStr, Field, model_validator, AnyHttpUrl
from typing import Optional, List
from datetime import date
from models import LessonStatus


class UserBase(BaseModel):
    name: str 
    email: EmailStr 

class UserCreate(UserBase):
    
    password: str = Field(min_length=6)

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True 

class LessonBase(BaseModel):
    title: str = Field(min_length=3)
    status: LessonStatus = LessonStatus.draft
    video_url: Optional[AnyHttpUrl] = None

class LessonCreate(LessonBase):
    pass

class LessonResponse(LessonBase):
    id: int
    course_id: int

    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    name: str = Field(min_length=3)
    description: Optional[str] = None
    start_date: date
    end_date: date

class CourseCreate(CourseBase):
    @model_validator(mode='after')
    def check_dates(self):
        if self.end_date < self.start_date:
            raise ValueError('A data de término não pode ser anterior à data de início.')
        return self

class CourseResponse(CourseBase):
    id: int
    creator_id: int
    lessons: List[LessonResponse] = [] 

    class Config:
        from_attributes = True