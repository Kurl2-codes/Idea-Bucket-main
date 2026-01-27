from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_database(self):
        self.client = AsyncIOMotorClient(settings.MONGODB_URL)
        self.db = self.client[settings.DATABASE_NAME]
        print(f"Connected to MongoDB at {settings.MONGODB_URL}")

    async def close_database_connection(self):
        if self.client:
            self.client.close()
            print("MongoDB connection closed")

db = MongoDB()

async def get_database():
    return db.db
