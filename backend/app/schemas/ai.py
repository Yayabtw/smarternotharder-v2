from pydantic import BaseModel
from typing import List, Dict, Any

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    summary: str
    key_concepts: List[str]
    difficulty: str
    estimated_study_time: str

class QuizRequest(BaseModel):
    text: str
    num_questions: int = 5

class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: str
    explanation: str

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]

