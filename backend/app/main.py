from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import gemini, auth, images
from contextlib import asynccontextmanager
from app.db.mongodb import db_instance, get_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("DEBUG: Lifespan starting...")
    await db_instance.connect_to_database()
    yield
    await db_instance.close_database_connection()
    print("DEBUG: Lifespan ending...")

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# Set all CORS enabled origins
origins = settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS else ["*"]

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
