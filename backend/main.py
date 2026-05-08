from fastapi import FastAPI
from database import engine
import models
from routers import auth, courses, lessons


models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CourseSphere API")

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(lessons.router)

@app.get("/")
def health_check():
    return {"status": "online"}