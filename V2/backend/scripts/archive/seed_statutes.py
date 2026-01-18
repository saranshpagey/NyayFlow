import os
import sys
import asyncio
from typing import List
from dotenv import load_dotenv

load_dotenv()

# Add parent to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from services.bulk_scrape import bulk_scrape_service

async def main():
    # Major Statutes URLs
    statutes = [
        "https://indiankanoon.org/doc/1569253/", # Indian Penal Code, 1860
        "https://indiankanoon.org/doc/445276/",  # Code of Criminal Procedure, 1973
        "https://indiankanoon.org/doc/1953529/", # Indian Evidence Act, 1872
        "https://indiankanoon.org/doc/1965344/", # Information Technology Act, 2000
        "https://indiankanoon.org/doc/171398/",  # Indian Contract Act, 1872
    ]
    
    print("📜 Seeding Major Statutes...")
    await bulk_scrape_service.run_batch(statutes)
    print("✨ Statute Seeding Complete.")

if __name__ == "__main__":
    asyncio.run(main())
