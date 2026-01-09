import os
import sys
import asyncio
import hashlib
from typing import List, Dict, Any

# Add parent directory to path to import other modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scraper_service import scraper_service
from services.metadata_service import metadata_service
from scripts.ingest_documents import DocumentIngestor

class BulkScrapeService:
    def __init__(self, output_dir="./source-documents/scraped"):
        self.output_dir = output_dir
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
        try:
            self.ingestor = DocumentIngestor()
            print("✅ Ingestor initialized")
        except Exception as e:
            print(f"⚠️ Failed to init ingestor: {e}")
            self.ingestor = None

    def slugify(self, text: str) -> str:
        import re
        text = text.lower()
        text = re.sub(r'[^a-z0-9]+', '_', text)
        return text.strip('_')[:50]

    async def process_url(self, url: str) -> Dict[str, Any]:
        """Scrape URL and extract high-fidelity metadata."""
        print(f"🛰️ Scraping: {url}")
        
        # 1. Fetch clean text
        raw_result = scraper_service.fetch_legal_text(url)
        if not raw_result or not raw_result.get('text'):
            return {"status": "error", "message": "Failed to fetch text"}
            
        text = raw_result['text']
        
        # 2. Extract Deep Metadata via Gemini
        print(f"🧠 Extracting Deep Metadata for: {url}")
        metadata = await metadata_service.extract_metadata(text)
        
        # 3. Format as Markdown
        slug = self.slugify(metadata.get('title', 'doc'))
        filename = f"{slug}.md"
        filepath = os.path.join(self.output_dir, filename)
        
        # Combine everything into frontmatter
        frontmatter = {
            **metadata,
            "source_url": url,
            "ingested_type": "scraped"
        }
        
        yaml_frontmatter = "---\n"
        for k, v in frontmatter.items():
            if isinstance(v, list):
                yaml_frontmatter += f"{k}: {v}\n"
            else:
                # Escape quotes in strings
                v_str = str(v).replace('"', '\\"')
                yaml_frontmatter += f"{k}: \"{v_str}\"\n"
        yaml_frontmatter += "---\n\n"
        
        content = f"{yaml_frontmatter}# {metadata.get('title')}\n\n{text}"
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
            
        print(f"✅ Saved: {filepath}")
        
        # 4. Trigger Ingestion (Real-time update)
        chunks_count = 0
        if self.ingestor:
            try:
                print(f"🧩 Triggering ingestion for: {filepath}")
                chunks_count = await self.ingestor.ingest_single_file(filepath)
            except Exception as e:
                print(f"❌ Ingestion trigger failed: {e}")
        
        return {"status": "success", "filepath": filepath, "metadata": metadata, "chunks_indexed": chunks_count}

    async def run_batch(self, urls: List[str]):
        """Run a batch of URLs with concurrency control."""
        # Limit concurrency to 3 at a time to avoid rate limits
        semaphore = asyncio.Semaphore(3)
        
        async def semi_process(url):
            async with semaphore:
                return await self.process_url(url)
        
        tasks = [semi_process(url) for url in urls]
        return await asyncio.gather(*tasks)

# Singleton
bulk_scrape_service = BulkScrapeService()
