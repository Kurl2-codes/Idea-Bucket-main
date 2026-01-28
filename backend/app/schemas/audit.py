from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class AuditActor(BaseModel):
    id: str
    name: str

class AuditTarget(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None

class AuditLogEntry(BaseModel):
    timestamp: str
    action: str
    actor: AuditActor
    target: AuditTarget
    details: Dict[str, Any] = {}

class AuditLogPagination(BaseModel):
    total: int
    page: int
    size: int
    pages: int
    has_next: bool
    has_prev: bool

class AuditLogResponse(BaseModel):
    items: List[AuditLogEntry]
    meta: AuditLogPagination

    class Config:
        json_schema_extra = {
            "example": {
                "items": [
                    {
                        "timestamp": "2024-01-28T12:00:00.000Z",
                        "action": "USER_REGISTERED",
                        "actor": {"id": "user@example.com", "name": "John Doe"},
                        "target": {"id": "user@example.com", "name": "user@example.com"},
                        "details": {"department": "Engineering"}
                    }
                ],
                "meta": {
                    "total": 50,
                    "page": 1,
                    "size": 20,
                    "pages": 3,
                    "has_next": True,
                    "has_prev": False
                }
            }
        }
