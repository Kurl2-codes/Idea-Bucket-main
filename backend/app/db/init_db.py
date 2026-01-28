from motor.motor_asyncio import AsyncIOMotorDatabase
import pymongo

async def init_db(db: AsyncIOMotorDatabase):
    """
    Initialize the database collections and indexes.
    """
    print("DEBUG: Checking/Initializing database indexes...")
    
    try:
        # Users Collection
        # Ensure unique email index
        await db.users.create_index([("email", pymongo.ASCENDING)], unique=True)
        print("SUCCESS: Unique index on users.email ensured.")
        
        # Ideas Collection
        # Create a text index for title, content, and tags to support search
        # This is more efficient than regex for larger datasets
        await db.ideas.create_index([
            ("title", pymongo.TEXT),
            ("content", pymongo.TEXT),
            ("tags", pymongo.TEXT)
        ], name="idea_search_index")
        print("SUCCESS: Text index on ideas (title, content, tags) ensured.")
        
        # Also an index for fast lookups by userId
        await db.ideas.create_index([("userId", pymongo.ASCENDING)])
        print("SUCCESS: Index on ideas.userId ensured.")

        # Index for shared ideas within department
        await db.ideas.create_index([
            ("isShared", pymongo.ASCENDING),
            ("authorDepartment", pymongo.ASCENDING)
        ])
        print("SUCCESS: Index on sharing (isShared, authorDepartment) ensured.")

    except Exception as e:
        print(f"WARNING: Error during database initialization: {e}")
        # We don't necessarily want to crash the app if indexes fail (e.g. if they already exist with different params)
        # but we should log it.
