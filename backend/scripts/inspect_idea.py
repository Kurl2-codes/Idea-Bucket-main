import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import json

async def main():
    client = AsyncIOMotorClient("mongodb://127.0.0.1:27017")
    db = client["ideabucket"]
    
    # Try finding by string ID first, then by ObjectId
    idea_id = "6978100649bd659f4829a4c9"
    idea = await db.ideas.find_one({"_id": idea_id})
    if not idea:
        idea = await db.ideas.find_one({"_id": ObjectId(idea_id)})
        
    if idea:
        # Convert ObjectId and other non-serializable fields to strings
        idea["_id"] = str(idea["_id"])
        print(json.dumps(idea, indent=2))
    else:
        print(f"Idea {idea_id} not found in database.")

if __name__ == "__main__":
    asyncio.run(main())
