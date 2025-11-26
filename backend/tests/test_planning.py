import pytest
from unittest.mock import MagicMock, patch
from app.services.ai_service import generate_study_plan

@pytest.fixture
def mock_gemini_plan():
    with patch('app.services.ai_service.get_model') as mock_get_model:
        mock_instance = MagicMock()
        mock_get_model.return_value = mock_instance
        
        mock_response = MagicMock()
        # Mock JSON response
        mock_response.text = '''
        [
            {"date": "2023-10-27", "topic": "Introduction", "activity": "Lecture", "duration": "30 min"},
            {"date": "2023-10-28", "topic": "Chapitre 1", "activity": "Exercice", "duration": "1h"}
        ]
        '''
        
        # Mock generate_content_with_retry which returns response object
        # But wait, generate_study_plan calls generate_content_with_retry
        # We need to mock the internal call inside generate_study_plan or mock generate_content_with_retry
        
        yield mock_instance

@pytest.mark.asyncio
async def test_generate_study_plan_structure(mock_gemini_plan):
    """
    Test that generate_study_plan calls the AI model and returns a list of study sessions.
    """
    mock_model = mock_gemini_plan
    
    # Mock the generate_content method on the model instance
    mock_response = MagicMock()
    mock_response.text = '''
    [
        {"date": "2023-10-27", "topic": "Introduction", "activity": "Lecture", "duration": "30 min"},
        {"date": "2023-10-28", "topic": "Chapitre 1", "activity": "Exercice", "duration": "1h"}
    ]
    '''
    mock_model.generate_content.return_value = mock_response

    topics = ["Introduction", "Chapitre 1", "Conclusion"]
    exam_date = "2023-11-01"
    hours_per_day = 2
    language = "fr"

    # Call function (RED phase)
    try:
        plan = await generate_study_plan(topics, exam_date, hours_per_day, language)
        
        assert isinstance(plan, list)
        assert len(plan) == 2
        assert plan[0]["topic"] == "Introduction"
        
        # Verify prompt content
        assert mock_model.generate_content.called
        call_args = mock_model.generate_content.call_args
        prompt = call_args[0][0]
        assert "Introduction" in prompt
        assert "2023-11-01" in prompt
        
    except NameError:
        pytest.fail("generate_study_plan function not defined")
    except Exception as e:
        # If it fails for other reasons
        raise e

