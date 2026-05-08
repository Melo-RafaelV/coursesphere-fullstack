from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from database import get_db
import models, schemas, security

from services import course_service

router = APIRouter(prefix="/courses", tags=["Courses"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None: raise HTTPException(status_code=401)
    except JWTError: raise HTTPException(status_code=401)
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None: raise HTTPException(status_code=401)
    return user

@router.post("/", response_model=schemas.CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return course_service.create_course(db=db, course=course, user_id=current_user.id)

@router.get("/", response_model=list[schemas.CourseResponse])
def list_courses(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return course_service.get_all_courses(db=db)

@router.get("/{course_id}", response_model=schemas.CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return course_service.get_course_by_id(db=db, course_id=course_id)

@router.put("/{course_id}", response_model=schemas.CourseResponse)
def update_course(course_id: int, course_data: schemas.CourseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return course_service.update_course(db=db, course_id=course_id, course_data=course_data, user_id=current_user.id)

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    course_service.delete_course(db=db, course_id=course_id, user_id=current_user.id)
    return None