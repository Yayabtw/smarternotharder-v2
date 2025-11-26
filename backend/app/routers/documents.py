from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.extraction_service import extract_text_from_pdf
from app.schemas.document import DocumentResponse

router = APIRouter(
    prefix="/documents",
    tags=["documents"]
)

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a PDF document and extract its text content.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    text = await extract_text_from_pdf(file)
    
    return DocumentResponse(
        filename=file.filename,
        content_length=len(text),
        extracted_text=text,
        message="Document uploaded and processed successfully"
    )

