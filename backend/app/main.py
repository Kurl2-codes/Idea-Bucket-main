from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import gemini, auth, images
from contextlib import asynccontextmanager
from app.db.mongodb import db_instance, get_database
import redis.asyncio as redis
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_limiter import FastAPILimiter

@asynccontextmanager
async def lifespan(app: FastAPI):
    # print("DEBUG: Lifespan starting...")
    await db_instance.connect_to_database()
    
    # Initialize indexes and collections
    from app.db.init_db import init_db
    db = await get_database()
    if db is not None:
        await init_db(db)
    
    # Initialize Redis for Caching and Rate Limiting
    redis_client = redis.from_url(settings.REDIS_URL, encoding="utf8", decode_responses=True)
    FastAPICache.init(RedisBackend(redis_client), prefix="fastapi-cache")
    await FastAPILimiter.init(redis_client)
    
    print("SUCCESS: Redis Caching and Rate Limiting initialized.")
        
    yield
    await db_instance.close_database_connection()
    # print("DEBUG: Lifespan ending...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
    description="Professional API for Idea Management. Implements SWR caching, Redis-based rate limiting, and HttpOnly security standards.",
    version="1.0.0"
)

# Set all CORS enabled origins
origins = settings.CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gemini.router, prefix="/api/v1/gemini", tags=["gemini"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(images.router, prefix="/api/v1/images", tags=["images"])

@app.get("/")
async def root():
    return {"message": "Welcome to IdeaBucket Backend"}

@app.get("/health")
async def health_check():
    db = await get_database()
    return {
        "status": "healthy",
        "database": "connected" if db is not None else "disconnected",
        "project": settings.PROJECT_NAME
    }
