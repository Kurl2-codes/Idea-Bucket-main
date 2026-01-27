from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.services.s3_service import s3_service

router = APIRouter()

@router.get("/{filename}")
async def get_image(filename: str):
    file_obj = s3_service.download_file(filename)
    if not file_obj:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Simple mime type guess (assuming png as we save as png)
    return StreamingResponse(file_obj, media_type="image/png")
