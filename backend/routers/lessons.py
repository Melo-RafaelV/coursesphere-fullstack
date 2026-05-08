from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

from services import lesson_service
from routers.courses import get_current_user

router = APIRouter(tags=["Lessons"])

@router.post("/courses/{course_id}/lessons", response_model=schemas.LessonResponse, status_code=status.HTTP_201_CREATED)
def create_lesson(course_id: int, lesson: schemas.LessonCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return lesson_service.create_lesson(db=db, course_id=course_id, lesson_data=lesson, user_id=current_user.id)

@router.get("/courses/{course_id}/lessons", response_model=list[schemas.LessonResponse])
def get_lessons_by_course(course_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return lesson_service.get_lessons_by_course(db=db, course_id=course_id)

@router.delete("/lessons/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lesson(lesson_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    lesson_service.delete_lesson(db=db, lesson_id=lesson_id, user_id=current_user.id)
    return None

@router.put("/lessons/{lesson_id}", response_model=schemas.LessonResponse)
def update_lesson(lesson_id: int, lesson_data: schemas.LessonCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return lesson_service.update_lesson(db=db, lesson_id=lesson_id, lesson_data=lesson_data, user_id=current_user.id)