from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import models, schemas

def create_lesson(db: Session, course_id: int, lesson_data: schemas.LessonCreate, user_id: int):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    
    if course.creator_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Apenas o criador do curso pode adicionar aulas")

    data = lesson_data.model_dump()
    if data.get("video_url"):
        data["video_url"] = str(data["video_url"])

    new_lesson = models.Lesson(**data, course_id=course_id)
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)
    return new_lesson

def get_lessons_by_course(db: Session, course_id: int):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Curso não encontrado")
    
    return course.lessons

def get_lesson_by_id(db: Session, lesson_id: int):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    return lesson

def update_lesson(db: Session, lesson_id: int, lesson_data: schemas.LessonCreate, user_id: int):
    lesson = get_lesson_by_id(db, lesson_id)
    
    if lesson.course.creator_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Apenas o criador do curso pode editar esta aula")

    lesson.title = lesson_data.title
    lesson.status = lesson_data.status
    
    lesson.video_url = str(lesson_data.video_url) if lesson_data.video_url else None

    db.commit()
    db.refresh(lesson)
    return lesson

def delete_lesson(db: Session, lesson_id: int, user_id: int):
    lesson = get_lesson_by_id(db, lesson_id)
    
    if lesson.course.creator_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Apenas o criador do curso pode excluir esta aula")

    db.delete(lesson)
    db.commit()