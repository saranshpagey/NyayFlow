import os
import json
import asyncio
from typing import Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

class LegalMetadata(BaseModel):
    title: str = Field(description="Title of the case or statute")
    date: str = Field(description="Date of judgment or enactment (YYYY-MM-DD format if possible)")
    court: str = Field(description="Court name (e.g., Supreme Court of India, Bombay High Court)")
    citation: str = Field(description="Official legal citation")
    verdict: str = Field(description="Final verdict (Allowed, Dismissed, Quashed, etc.) or 'N/A' for statutes")
    statutes: list[str] = Field(description="List of statutes/sections mentioned (e.g., ['IPC 302', 'Section 120B'])")
    summary: str = Field(description="A brief 2-sentence summary of the document")

class MetadataService:
    def __init__(self):
        api_key = os.environ.get("GOOGLE_API_KEY")
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash", 
            google_api_key=api_key,
            temperature=0.1
        )
        self.parser = PydanticOutputParser(pydantic_object=LegalMetadata)
        
        self.prompt = PromptTemplate(
            template="Extract structured legal metadata from the following text.\n{format_instructions}\n\nTEXT:\n{text}\n",
            input_variables=["text"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()},
        )

    async def extract_metadata(self, text: str) -> Dict[str, Any]:
        """Extract metadata from raw legal text using Gemini Flash."""
        try:
            # We only need the first part of the text for metadata (usually first 4000 chars)
            metadata_context = text[:8000]
            
            chain = self.prompt | self.llm | self.parser
            result = await chain.ainvoke({"text": metadata_context})
            return result.dict()
        except Exception as e:
            print(f"❌ Metadata Extraction Error: {e}")
            return {
                "title": "Unknown Document",
                "date": "Unknown",
                "court": "Unknown",
                "citation": "N/A",
                "verdict": "N/A",
                "statutes": [],
                "summary": "Full text extraction failed."
            }

# Singleton
metadata_service = MetadataService()
