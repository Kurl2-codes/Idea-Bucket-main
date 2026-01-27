from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_database(self):
        print(f"DEBUG: Connecting to MongoDB using URL: {settings.MONGODB_URL}")
        try:
            self.client = AsyncIOMotorClient(settings.MONGODB_URL)
            self.db = self.client[settings.DATABASE_NAME]
            print(f"SUCCESS: Connected to MongoDB at {settings.MONGODB_URL}")
        except Exception as e:
            print(f"ERROR: Failed to connect to MongoDB: {e}")
            raise e

    async def close_database_connection(self):
        if self.client:
            self.client.close()
            print("MongoDB connection closed")

db_instance = MongoDB()

async def get_database():
    return db_instance.db
