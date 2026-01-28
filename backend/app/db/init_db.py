from motor.motor_asyncio import AsyncIOMotorDatabase
import pymongo

async def init_db(db: AsyncIOMotorDatabase):
    """
    Initialize the database collections and indexes.
    """
    print("DEBUG: Checking/Initializing database indexes...")
    
    try:
        # Users Collection
        await db.users.create_index([("email", pymongo.ASCENDING)], unique=True)
        print("SUCCESS: Unique index on users.email ensured.")
        
        # Ideas Collection
        await db.ideas.create_index([
            ("title", pymongo.TEXT),
            ("content", pymongo.TEXT),
            ("tags", pymongo.TEXT)
        ], name="idea_search_index")
        print("SUCCESS: Text index on ideas (title, content, tags) ensured.")
        
        # fast lookups by userId
        await db.ideas.create_index([("userId", pymongo.ASCENDING)])
        print("SUCCESS: Index on ideas.userId ensured.")

        # Index for sharing (isShared, authorDepartment) ensured.
        await db.ideas.create_index([
            ("isShared", pymongo.ASCENDING),
            ("authorDepartment", pymongo.ASCENDING)
        ])
        print("SUCCESS: Index on sharing (isShared, authorDepartment) ensured.")

        # Audit Logs Collection
        await db.audit_logs.create_index([("timestamp", pymongo.DESCENDING)])
        # TTL Index: Delete logs after 90 days (7776000 seconds)
        await db.audit_logs.create_index([("timestamp", pymongo.ASCENDING)], expireAfterSeconds=7776000)
        print("SUCCESS: Indexes and TTL on audit_logs ensured.")

    except Exception as e:
        print(f"WARNING: Error during database initialization: {e}")
       
