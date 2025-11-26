from fastapi import APIRouter, HTTPException
from app.services.ai_service import analyze_text, generate_quiz
from app.schemas.ai import AnalyzeRequest, AnalyzeResponse, QuizRequest, QuizResponse

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
)

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_content(request: AnalyzeRequest):
    """
    Analyze course content using Gemini.
    """
    try:
        result = await analyze_text(request.text)
        return AnalyzeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/quiz", response_model=QuizResponse)
async def create_quiz(request: QuizRequest):
    """
    Generate a quiz from course content using Gemini.
    """
    try:
        questions = await generate_quiz(request.text, request.num_questions)
        return QuizResponse(questions=questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

