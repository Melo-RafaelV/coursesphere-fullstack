from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # 1. Importe isso
from database import engine
import models
from routers import auth, courses, lessons

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CourseSphere API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(lessons.router)

@app.get("/")
def health_check():
    return {"status": "online"}