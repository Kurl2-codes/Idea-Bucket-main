import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys

async def promote_user(email):
    client = AsyncIOMotorClient("mongodb://127.0.0.1:27017")
    db = client["ideabucket"]

    
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"userLevel": 1}}
    )
    
    if result.matched_count > 0:
        print(f"SUCCESS: User {email} is now an Admin (Level 1).")
        print("Please log out and log back in on the website to see the User Management tab.")
    else:
        print(f"ERROR: User with email {email} not found.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python promote_admin.py <email>")
    else:
        asyncio.run(promote_user(sys.argv[1]))
