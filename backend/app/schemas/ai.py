from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class AnalyzeRequest(BaseModel):
    text: str
    language: Optional[str] = "en"

class AnalyzeResponse(BaseModel):
    summary: str
    key_concepts: List[str]
    difficulty: str
    estimated_study_time: str

class QuizRequest(BaseModel):
    text: str
    num_questions: int = 5
    language: Optional[str] = "en"

class QuizQuestion(BaseModel):
    id: int
    type: str # "multiple_choice" | "true_false"
    question: str
    options: List[str]
    correct_answer: str
    explanation: str

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]

class ChatMessage(BaseModel):
    role: str # "user" | "ai"
    content: str

class ChatRequest(BaseModel):
    context: str
    message: str
    history: List[ChatMessage]
    language: Optional[str] = "en"

class ChatResponse(BaseModel):
    response: str

class PlanRequest(BaseModel):
    topics: List[str]
    exam_date: str
    hours_per_day: int
    language: Optional[str] = "en"

class StudySession(BaseModel):
    date: str
    topic: str
    activity: str
    duration: str
    description: str

class PlanResponse(BaseModel):
    plan: List[StudySession]

class FlashcardRequest(BaseModel):
    text: str
    num_cards: int = 10
    language: Optional[str] = "en"

class Flashcard(BaseModel):
    front: str
    back: str

class FlashcardResponse(BaseModel):
    flashcards: List[Flashcard]
