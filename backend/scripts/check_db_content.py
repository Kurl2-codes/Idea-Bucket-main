import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

# Get mongo URL from env or default
MONGO_URL = os.getenv("MONGODB_URL", "mongodb://127.0.0.1:27017")
DB_NAME = "mindcanvas_new_db"

async def main():
    print(f"Connecting to {MONGO_URL}, DB: {DB_NAME}")
    try:
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        
        print("\n--- Users (Full) ---")
        async for user in db.users.find():
            print(f"DEBUG USER: {user}")

        print("\n--- Ideas (Raw) ---")
        count = 0
        async for idea in db.ideas.find():
            count += 1
            print(f"DEBUG IDEA: {idea}")
        
        if count == 0:
            print("No ideas found.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())

