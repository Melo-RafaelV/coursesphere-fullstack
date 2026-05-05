from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from database import Base
import enum

class LessonStatus(str, enum.Enum):
    draft = "draft"
    published = "published"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    
    courses = relationship("Course", back_populates="creator")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False) 
    description = Column(Text, nullable=True) 
    start_date = Column(Date, nullable=False) 
    end_date = Column(Date, nullable=False) 

   
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    creator = relationship("User", back_populates="courses")

 
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False) 
    status = Column(Enum(LessonStatus), default=LessonStatus.draft, nullable=False) 
    video_url = Column(String, nullable=True) 

    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    course = relationship("Course", back_populates="lessons")