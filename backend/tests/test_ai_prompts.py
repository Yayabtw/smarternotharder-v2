import pytest
from unittest.mock import MagicMock, patch
from app.services.ai_service import analyze_text, generate_quiz

# Mock Gemini response to avoid API calls during tests
@pytest.fixture
def mock_gemini():
    with patch('app.services.ai_service.get_model') as mock_get_model:
        mock_instance = MagicMock()
        mock_get_model.return_value = mock_instance
        
        # Setup default success response
        mock_response = MagicMock()
        mock_response.text = '{"summary": "Test summary", "key_concepts": ["Test"], "difficulty": "Beginner", "estimated_study_time": "1 hour"}'
        mock_instance.generate_content.return_value = mock_response
        
        yield mock_instance

@pytest.mark.asyncio
async def test_analyze_text_injects_language_and_persona(mock_gemini):
    """
    Test that the analyze_text function injects the correct language and persona into the prompt.
    """
    text = "Biology 101 content"
    language = "fr"
    
    await analyze_text(text, language=language)

    call_args = mock_gemini.generate_content.call_args
    if call_args:
        prompt = call_args[0][0]
        # Check for language instruction
        assert "fr" in prompt or "French" in prompt
        # Check for persona instruction
        assert "professeur passionné" in prompt
    else:
        pytest.fail("generate_content was not called")

@pytest.mark.asyncio
async def test_generate_quiz_injects_language_and_persona(mock_gemini):
    """
    Test that the generate_quiz function injects the correct language and persona into the prompt.
    """
    text = "Biology 101 content"
    language = "es" # Spanish
    
    mock_response = MagicMock()
    mock_response.text = '[{"id": 1, "question": "¿Qué es?", "options": ["A", "B"], "correct_answer": "A", "explanation": "Porque sí"}]'
    mock_gemini.generate_content.return_value = mock_response

    await generate_quiz(text, language=language)

    call_args = mock_gemini.generate_content.call_args
    if call_args:
        prompt = call_args[0][0]
        assert "es" in prompt or "Spanish" in prompt
        assert "engaging professor" in prompt or "passionné" in prompt or "apasionado" in prompt
    else:
        pytest.fail("generate_content was not called")
