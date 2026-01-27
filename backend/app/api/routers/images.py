from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.services.s3_service import s3_service

router = APIRouter()

@router.get("/{file_path:path}")
async def get_image(file_path: str):
    print(f"DEBUG: Received request for image: {file_path}")
    try:
        file_obj = s3_service.download_file(file_path)
        if not file_obj:
            print(f"ERROR: Image not found in S3: {file_path}")
            raise HTTPException(status_code=404, detail="Image not found")
        
        print(f"SUCCESS: Streaming image: {file_path}")
        # Simple mime type guess (assuming png as we save as png)
        return StreamingResponse(file_obj, media_type="image/png")
    except Exception as e:
        print(f"CRITICAL: Failed to serve image {file_path}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
