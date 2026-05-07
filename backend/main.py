from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import engine, get_db
import models, schemas, security

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CourseSphere API")


class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado.")
    
    hashed_password = security.get_password_hash(user.password)
    new_user = models.User(name=user.name, email=user.email, password=hashed_password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@app.post("/login")
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    
    
    if not user or not security.verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}