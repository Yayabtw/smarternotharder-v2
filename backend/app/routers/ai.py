from fastapi import APIRouter, HTTPException
from app.services.ai_service import analyze_text, generate_quiz, chat_with_document, generate_study_plan, generate_flashcards
from app.schemas.ai import AnalyzeRequest, AnalyzeResponse, QuizRequest, QuizResponse, ChatRequest, ChatResponse, PlanRequest, PlanResponse, FlashcardRequest, FlashcardResponse

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
        result = await analyze_text(request.text, language=request.language)
        return AnalyzeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/quiz", response_model=QuizResponse)
async def create_quiz(request: QuizRequest):
    """
    Generate a quiz from course content using Gemini.
    """
    try:
        questions = await generate_quiz(request.text, language=request.language, num_questions=request.num_questions)
        return QuizResponse(questions=questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat with the document context.
    """
    try:
        # Convert Pydantic models to list of dicts
        history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.history]
        response_text = await chat_with_document(
            context_text=request.context,
            user_message=request.message,
            history=history_dicts,
            language=request.language
        )
        return ChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/plan", response_model=PlanResponse)
async def create_plan(request: PlanRequest):
    """
    Generate a study plan.
    """
    try:
        plan = await generate_study_plan(
            topics=request.topics,
            exam_date=request.exam_date,
            hours_per_day=request.hours_per_day,
            language=request.language
        )
        return PlanResponse(plan=plan)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/flashcards", response_model=FlashcardResponse)
async def create_flashcards(request: FlashcardRequest):
    """
    Generate flashcards.
    """
    try:
        cards = await generate_flashcards(
            text=request.text,
            num_cards=request.num_cards,
            language=request.language
        )
        return FlashcardResponse(flashcards=cards)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
