import os
import sys
import asyncio
from typing import List, Dict, Any
from dotenv import load_dotenv

# Add parent to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from scraper_service import scraper_service
from scripts.ingest_documents import DocumentIngestor

load_dotenv()

async def ingest_url(ingestor: DocumentIngestor, url: str, title: str):
    print(f"🌐 Ingesting Startup Data from URL: {url}")
    result = scraper_service.fetch_legal_text(url)
    
    if not result:
        print(f"❌ Failed to fetch: {url}")
        return
        
    text = result["text"]
    metadata = result["metadata"]
    
    # Enrich with Founder Persona tags
    metadata.update({
        "title": title,
        "persona": "founder",
        "audience_level": "founder",
        "topic": "startup_compliance",
        "source_url": url
    })
    
    # Temporary MD file for DocumentIngestor to pick up
    temp_dir = "./source-documents/temp_startup"
    os.makedirs(temp_dir, exist_ok=True)
    
    safe_title = "".join([c for c in title if c.isalnum() or c==' ']).rstrip().replace(' ', '_')
    temp_path = os.path.join(temp_dir, f"{safe_title}.md")
    
    import yaml
    with open(temp_path, "w", encoding="utf-8") as f:
        f.write("---\n")
        yaml.dump(metadata, f)
        f.write("---\n\n")
        f.write(text)
        
    num_chunks = await ingestor.ingest_single_file(temp_path)
    print(f"✅ Successfully ingested {num_chunks} chunks for {title}")
    
    # Cleanup
    # os.remove(temp_path)

async def main():
    ingestor = DocumentIngestor()
    
    targets = [
        ("https://indiankanoon.org/doc/1017213/", "The Trade Marks Act 1999"),
        ("https://indiankanoon.org/doc/161391573/", "The Limited Liability Partnership Act 2008"),
        ("https://indiankanoon.org/doc/1353758/", "The Companies Act 2013"), 
        ("https://indiankanoon.org/doc/789969/", "Income Tax Act - Section 56(2)(viib) (Angel Tax)"),
        ("https://indiankanoon.org/doc/175739916/", "The Digital Personal Data Protection Act 2023")
    ]
    
    for url, title in targets:
        await ingest_url(ingestor, url, title)
        await asyncio.sleep(2) # Prevent rate limiting

if __name__ == "__main__":
    asyncio.run(main())
