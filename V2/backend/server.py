from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="NyayaFlow API", version="0.1.0")

# Input allowed origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pydantic import BaseModel
from typing import List, Optional

class SearchQuery(BaseModel):
    query: str
    history: Optional[List[dict]] = None

@app.post("/api/research")
async def search_legal_cases(query: SearchQuery):
    from rag_engine import rag_engine
    # Call the RAG engine with history
    results = await rag_engine.analyze_query(query.query, query.history)
    
    return {"results": results}

@app.get("/")
def read_root():
    return {"message": "NyayaFlow AI Core is active", "status": "online"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
