from datetime import datetime
from typing import Any, Optional
from app.db.mongodb import get_database

class AuditService:
    async def log_action(
        self,
        action: str,
        user_id: str,
        user_name: str,
        target_id: Optional[str] = None,
        target_name: Optional[str] = None,
        details: Optional[dict[str, Any]] = None
    ):
        """
        Record an action in the audit_logs collection.
        This follows the 'Black Box' auditing standard.
        """
        db = await get_database()
        if db is None:
            print(f"WARNING: Audit log failed - DB not initialized. Action: {action}")
            return

        audit_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "action": action,
            "actor": {
                "id": user_id,
                "name": user_name
            },
            "target": {
                "id": target_id,
                "name": target_name
            },
            "details": details or {},
        }

        try:
            await db.audit_logs.insert_one(audit_entry)
            print(f"AUDIT: {user_name} performed {action} on {target_name or target_id}")
        except Exception as e:
            print(f"ERROR: Failed to write audit log: {e}")

audit_service = AuditService()
