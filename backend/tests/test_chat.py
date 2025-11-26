import pytest
from unittest.mock import MagicMock, patch
from app.services.ai_service import chat_with_document

# Mock Gemini response
@pytest.fixture
def mock_gemini_chat():
    with patch('app.services.ai_service.get_model') as mock_get_model:
        mock_instance = MagicMock()
        mock_get_model.return_value = mock_instance
        
        # Mock generate_content response (since we use stateless approach)
        mock_response = MagicMock()
        mock_response.text = "Réponse basée sur le contexte."
        
        # Mock the async generate_content_with_retry call in the service file
        # But wait, the service calls `generate_content_with_retry`, which calls `model.generate_content`
        # We are mocking `get_model` which returns `mock_instance`.
        # `generate_content_with_retry` calls `model.generate_content` via `asyncio.to_thread`
        
        mock_instance.generate_content.return_value = mock_response
        
        yield mock_instance

@pytest.mark.asyncio
async def test_chat_with_document_uses_context(mock_gemini_chat):
    """
    Test that the chat function calls generate_content with the correct prompt.
    """
    mock_model = mock_gemini_chat
    
    context_text = "Le mitochondrie est la centrale énergétique de la cellule."
    user_message = "Quel est le rôle de la mitochondrie ?"
    history = []
    language = "fr"
    
    await chat_with_document(context_text, user_message, history, language)

    # Verify generate_content was called
    assert mock_model.generate_content.called
    
    # Verify arguments
    call_args = mock_model.generate_content.call_args
    if call_args:
        sent_prompt = call_args[0][0]
        # Check if context and user message are in the prompt
        assert context_text in sent_prompt
        assert user_message in sent_prompt
        assert "language: fr" in sent_prompt.lower() or "français" in sent_prompt.lower() or "french" in sent_prompt.lower() or "strictly in fr" in sent_prompt
    else:
        pytest.fail("generate_content was not called")
