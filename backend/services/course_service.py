from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import models, schemas

def create_course(db: Session, course: schemas.CourseCreate, user_id: int):
    new_course = models.Course(**course.model_dump(), creator_id=user_id)
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

def get_courses_by_user(db: Session, user_id: int):
    return db.query(models.Course).filter(models.Course.creator_id == user_id).all()

def get_course_by_id(db: Session, course_id: int):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    return course

def update_course(db: Session, course_id: int, course_data: schemas.CourseCreate, user_id: int):
    course = get_course_by_id(db, course_id)
    
    if course.creator_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para editar este curso")
    
    course.name = course_data.name
    course.description = course_data.description
    course.start_date = course_data.start_date
    course.end_date = course_data.end_date
    
    db.commit()
    db.refresh(course)
    return course

def delete_course(db: Session, course_id: int, user_id: int):
    course = get_course_by_id(db, course_id)
    
    if course.creator_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para excluir este curso")
    
    db.delete(course)
    db.commit()