from fastapi import FastAPI
from dotenv import load_dotenv
import os

# Load environment variables before importing other modules that might rely on them
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import documents, ai

app = FastAPI(
    title="SmarterNotHarder API",
    description="Backend API for SmarterNotHarder learning platform",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Keep explicit strict origin if needed
    allow_origin_regex="http://localhost:.*", # Allow any local port for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router)
app.include_router(ai.router)

@app.get("/")
async def root():
    return {"message": "Welcome to SmarterNotHarder API"}

