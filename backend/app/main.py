from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import gemini, auth, images
from contextlib import asynccontextmanager
from app.db.mongodb import db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure MongoDB indexes, etc could go here
    await db.connect_to_database()
    yield
    await db.close_database_connection()

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    return {"status": "healthy"}
