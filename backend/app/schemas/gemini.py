from pydantic import BaseModel
from typing import List, Optional

class IdeaAnalysisRequest(BaseModel):
    content: str
    image_datas: Optional[List[str]] = []
    # User Info
    userId: str
    authorName: str
    authorDepartment: str

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

class ShareLinkUpdate(BaseModel):
    shareLinkId: str
    sharePermission: str


