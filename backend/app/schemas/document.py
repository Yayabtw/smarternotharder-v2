from pydantic import BaseModel
from typing import Optional

class DocumentResponse(BaseModel):
    filename: str
    content_length: int
    extracted_text: str
    message: str

