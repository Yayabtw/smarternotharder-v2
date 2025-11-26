import io
from pypdf import PdfReader
from fastapi import UploadFile, HTTPException

async def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Extract text from an uploaded PDF file.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF allowed.")

    try:
        content = await file.read()
        pdf_file = io.BytesIO(content)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        # Reset file cursor for other operations if needed, though we read it all
        await file.seek(0)
        
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

