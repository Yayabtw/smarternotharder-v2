import pytest
from unittest.mock import MagicMock, patch
from app.services.ai_service import generate_flashcards

@pytest.fixture
def mock_gemini_flashcards():
    with patch('app.services.ai_service.get_model') as mock_get_model:
        mock_instance = MagicMock()
        mock_get_model.return_value = mock_instance
        yield mock_instance

@pytest.mark.asyncio
async def test_generate_flashcards_structure(mock_gemini_flashcards):
    """
    Test that generate_flashcards returns a list of Q/A pairs.
    """
    mock_model = mock_gemini_flashcards
    
    # Mock response
    mock_response = MagicMock()
    mock_response.text = '''
    [
        {"front": "What is Mitochondria?", "back": "Powerhouse of the cell"},
        {"front": "Definition of ATP", "back": "Energy currency"}
    ]
    '''
    mock_model.generate_content.return_value = mock_response

    text = "Biology content about cells."
    num_cards = 5
    language = "en"

    # Call function (RED phase)
    try:
        cards = await generate_flashcards(text, num_cards, language)
        
        assert isinstance(cards, list)
        assert len(cards) == 2
        assert cards[0]["front"] == "What is Mitochondria?"
        assert cards[0]["back"] == "Powerhouse of the cell"
        
        # Verify prompt
        assert mock_model.generate_content.called
        call_args = mock_model.generate_content.call_args
        prompt = call_args[0][0]
        assert "flashcards" in prompt.lower()
        
    except NameError:
        pytest.fail("generate_flashcards function not defined")
    except Exception as e:
        raise e

