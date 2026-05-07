from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import models, schemas, security

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
    new_course = models.Course(**course.model_dump(), creator_id=current_user.id)
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.get("/", response_model=list[schemas.CourseResponse])
def list_courses(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Course).all()