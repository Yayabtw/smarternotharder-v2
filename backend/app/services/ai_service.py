import google.generativeai as genai
import os
import json
from typing import Dict, Any, List

def get_model():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY not configured")
    genai.configure(api_key=api_key)
    # Updated to use an available model from your list
    return genai.GenerativeModel('gemini-2.0-flash')

async def analyze_text(text: str) -> Dict[str, Any]:
    """
    Analyze the provided text to extract key concepts, summary, and difficulty.
    """
    model = get_model()

    prompt = f"""
    Analyze the following course content and return a JSON object with these fields:
    - summary: A concise summary of the content (max 150 words).
    - key_concepts: A list of strings, representing the most important concepts.
    - difficulty: One of ["Beginner", "Intermediate", "Advanced"].
    - estimated_study_time: A string estimate (e.g., "2 hours").

    Text to analyze:
    {text[:30000]}  # Limit text to avoid token limits
    """

    response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
    return json.loads(response.text)

async def generate_quiz(text: str, num_questions: int = 5) -> List[Dict[str, Any]]:
    """
    Generate a quiz based on the text.
    """
    model = get_model()
        
    prompt = f"""
    Generate a quiz with {num_questions} questions based on the following text.
    Return a JSON array of objects. Each object should have:
    - id: A unique integer id.
    - question: The question text.
    - options: A list of 4 possible answers (strings).
    - correct_answer: The exact string of the correct answer from the options.
    - explanation: A brief explanation of why it's correct.

    Text:
    {text[:30000]}
    """
    
    response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
    return json.loads(response.text)
