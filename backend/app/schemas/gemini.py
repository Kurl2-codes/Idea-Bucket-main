from pydantic import BaseModel
from typing import List, Optional

class IdeaAnalysisRequest(BaseModel):
    id: Optional[str] = None
    content: str
    image_datas: Optional[List[str]] = []
    # User Info
    userId: str
    authorName: str
    authorDepartment: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": "65b2f1...",
                "content": "A solar powered drone for agriculture.",
                "imageDatas": ["base64..."],
                "userId": "user@example.com",
                "authorName": "John Doe",
                "authorDepartment": "Engineering"
            }
        }

class IdeaAnalysisResponse(BaseModel):
    title: str
    category: str
    tags: List[str]
    # Echo back user info or DB id
    id: Optional[str] = None
    userId: Optional[str] = None
    authorName: Optional[str] = None
    authorDepartment: Optional[str] = None
    image_urls: Optional[List[str]] = []
    content: Optional[str] = None
    isShared: bool = False
    createdAt: float = 0.0
    comments: List['Comment'] = []
    shareLinkId: Optional[str] = None
    sharePermission: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Solar Ag-DRONE",
                "category": "Sustainability",
                "tags": ["solar", "agriculture"],
                "id": "65b2f1...",
                "userId": "user@example.com",
                "isShared": False,
                "createdAt": 1700000000
            }
        }

class Comment(BaseModel):
    id: str
    userId: str
    userName: str
    userDepartment: str
    text: str
    createdAt: float
    likes: List[str] = []
    replies: List['Comment'] = []

class CommentCreate(BaseModel):
    text: str

class IdeaUpdate(BaseModel):
    content: str
    title: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "content": "Updated content with more detail.",
                "title": "New Title",
                "category": "Tech",
                "tags": ["updated", "tags"]
            }
        }

class ShareLinkUpdate(BaseModel):
    shareLinkId: str
    sharePermission: str

    class Config:
        json_schema_extra = {
            "example": {
                "shareLinkId": "xyz-789",
                "sharePermission": "viewer"
            }
        }


