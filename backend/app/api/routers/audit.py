from fastapi import APIRouter, Depends, HTTPException, Query
from app.db.mongodb import get_database
from app.api.routers.auth import get_current_user
from app.schemas.audit import AuditLogResponse, AuditLogEntry, AuditLogPagination, AuditActor, AuditTarget
import math

router = APIRouter()

@router.get(
    "/audit-logs",
    response_model=AuditLogResponse,
    summary="Get paginated audit logs",
    description="Retrieve system audit logs. Restricted to Super Admins (User Level 1)."
)
async def get_audit_logs(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: dict = Depends(get_current_user)
):
    # RBAC Check: Super Admin only
    if current_user.get("userLevel") != 1:
        raise HTTPException(status_code=403, detail="Not authorized. Super Admin privileges required.")

    db = await get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")

    # Count total documents
    total = await db.audit_logs.count_documents({})
    
    # Calculate skip
    skip = (page - 1) * size
    
    # Fetch logs (sorted by timestamp descending)
    cursor = db.audit_logs.find({}).sort("timestamp", -1).skip(skip).limit(size)
    logs = await cursor.to_list(length=size)
    
    # Prepare Items
    items = []
    for log in logs:
        # Sanitize ObjectId if present in _id (though we don't expose _id in schema)
        items.append(AuditLogEntry(
            timestamp=log["timestamp"] if isinstance(log["timestamp"], str) else log["timestamp"].isoformat(),
            action=log["action"],
            actor=AuditActor(**log["actor"]),
            target=AuditTarget(**log["target"]),
            details=log.get("details", {})
        ))

    # Prepare Meta
    total_pages = math.ceil(total / size)
    
    return AuditLogResponse(
        items=items,
        meta=AuditLogPagination(
            total=total,
            page=page,
            size=size,
            pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1
        )
    )
