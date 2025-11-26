import google.generativeai as genai
import os
import json
import time
import asyncio
from typing import Dict, Any, List

# Cache for the selected model name to avoid API calls
_cached_model_name = None

def get_model():
    global _cached_model_name
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not configured")
    genai.configure(api_key=api_key)
    
    if _cached_model_name:
        return genai.GenerativeModel(_cached_model_name)

    # Priority list: 1.5 Flash (Stable & Fast) -> 2.0 Flash (Newer) -> Pro
    preferred_models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-2.0-flash", 
        "gemini-1.5-pro",
        "gemini-pro"
    ]
    
    try:
        # List available models dynamically
        available_models = [m.name.replace("models/", "") for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        
        for model in preferred_models:
            if model in available_models:
                print(f"Selected Gemini model: {model}")
                _cached_model_name = model
                return genai.GenerativeModel(model)
        
        # Fallback if specific aliases aren't found but we have a list
        if available_models:
             # Pick the first one that looks like gemini
             gemini_models = [m for m in available_models if "gemini" in m]
             if gemini_models:
                 print(f"Selected fallback Gemini model: {gemini_models[0]}")
                 _cached_model_name = gemini_models[0]
                 return genai.GenerativeModel(_cached_model_name)

        # Last resort fallback
        print("No preferred model found in list, forcing gemini-1.5-flash")
        _cached_model_name = "gemini-1.5-flash"
        return genai.GenerativeModel(_cached_model_name)
        
    except Exception as e:
        print(f"Error listing models: {e}. Falling back to gemini-1.5-flash")
        return genai.GenerativeModel('gemini-1.5-flash')

async def generate_content_with_retry(model, prompt, retries=3, delay=2, mime_type="application/json"):
    """
    Helper to handle rate limits with simple backoff.
    """
    for attempt in range(retries):
        try:
            # Configure generation options
            generation_config = {"response_mime_type": mime_type} if mime_type else {}
            
            # Run sync generation in thread pool to avoid blocking
            response = await asyncio.to_thread(
                model.generate_content, 
                prompt, 
                generation_config=generation_config
            )
            return response
        except Exception as e:
            if "429" in str(e) and attempt < retries - 1:
                print(f"Rate limit hit, retrying in {delay}s... (Attempt {attempt + 1}/{retries})")
                await asyncio.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                raise e

async def analyze_text(text: str, language: str = "en") -> Dict[str, Any]:
    """
    Analyze the provided text to extract key concepts, summary, and difficulty.
    """
    model = get_model()
    
    # Persona instruction
    persona = "Agis comme un professeur passionné et captivant. Utilise des analogies claires, sois vivant et encourageant, tout en restant précis. Évite le jargon robotique ou trop académique." if language == 'fr' else "Act as a passionate and engaging professor. Use clear analogies, be lively and encouraging, while remaining precise. Avoid robotic or overly academic jargon."

    prompt = f"""
    {persona}
    
    Language requirement: Respond strictly in {language} (e.g. French/Français if language='fr', Spanish/Español if language='es').

    Analyze the following course content and return a JSON object with these fields:
    - summary: A concise summary of the content (max 150 words).
    - key_concepts: A list of strings, representing the most important concepts.
    - difficulty: One of ["Beginner", "Intermediate", "Advanced"] (Translate these terms to target language if needed).
    - estimated_study_time: A string estimate (e.g., "2 hours").

    Text to analyze:
    {text[:500000]}
    """

    response = await generate_content_with_retry(model, prompt)
    return json.loads(response.text)

async def generate_quiz(text: str, language: str = "en", num_questions: int = 5) -> List[Dict[str, Any]]:
    """
    Generate a quiz based on the text.
    """
    model = get_model()
    
    persona = "Agis comme un professeur passionné et captivant." if language == 'fr' else "Act as a passionate and engaging professor."

    prompt = f"""
    {persona}
    
    Language requirement: Respond strictly in {language} (e.g. French/Français if language='fr', Spanish/Español if language='es').

    Generate a quiz with {num_questions} questions based on the following text.
    Mix different question types to make it engaging.
    
    Return a JSON array of objects. Each object should have:
    - id: A unique integer id.
    - type: One of "multiple_choice", "true_false".
    - question: The question text.
    - options: A list of possible answers (strings). For "true_false", use ["True", "False"] (translated).
    - correct_answer: The exact string of the correct answer from the options.
    - explanation: A detailed explanation of why it's correct and why others are wrong (in the target language).

    Text:
    {text[:500000]}
    """
    
    response = await generate_content_with_retry(model, prompt)
    return json.loads(response.text)

async def chat_with_document(context_text: str, user_message: str, history: List[Dict[str, str]], language: str = "en") -> str:
    """
    Chat with the document context.
    """
    model = get_model()
    
    prompt = f"""
    You are a helpful AI tutor.
    Context:
    {context_text[:500000]}
    
    Instructions:
    - Answer the user's question based on the context.
    - Be an engaging professor.
    - Language: {language}.
    
    Conversation History:
    {json.dumps(history)}
    
    User Question: {user_message}
    """
    
    # Use retry logic with text/plain for chat
    response = await generate_content_with_retry(model, prompt, mime_type="text/plain")
    
    # Response is not JSON here, it's text
    return response.text

async def generate_study_plan(topics: List[str], exam_date: str, hours_per_day: int, language: str = "en") -> List[Dict[str, str]]:
    """
    Generate a study plan based on topics and constraints.
    """
    model = get_model()
    
    prompt = f"""
    Act as an expert study planner.
    
    Language requirement: Respond strictly in {language}.
    
    Create a detailed study schedule up to the exam date: {exam_date}.
    Available study time per day: {hours_per_day} hours.
    Topics to cover: {', '.join(topics)}.
    
    Spread the topics intelligently. Include review sessions.
    
    Return a JSON array of objects. Each object representing a study session:
    - date: "YYYY-MM-DD"
    - topic: The specific topic or sub-topic.
    - activity: Type of activity (e.g., "Read", "Practice", "Review", "Quiz").
    - duration: Estimated duration (e.g., "1h", "30 min").
    - description: Short advice for this session.
    
    Ensure the plan covers all topics before the exam date.
    """
    
    response = await generate_content_with_retry(model, prompt)
    return json.loads(response.text)

async def generate_flashcards(text: str, num_cards: int = 10, language: str = "en") -> List[Dict[str, str]]:
    """
    Generate flashcards (Front/Back) from text.
    """
    model = get_model()
    
    prompt = f"""
    Act as an expert educator.
    
    Language requirement: Respond strictly in {language}.
    
    Create {num_cards} flashcards based on the key concepts of the following text.
    Focus on definitions, key dates, formulas, or core concepts.
    
    Return a JSON array of objects. Each object:
    - front: The question or concept (Recto).
    - back: The answer or definition (Verso).
    
    Text:
    {text[:500000]}
    """
    
    response = await generate_content_with_retry(model, prompt)
    return json.loads(response.text)
