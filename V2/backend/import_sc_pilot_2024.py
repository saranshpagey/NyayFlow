import asyncio
from scraper_service import scraper_service
from ingest_folder import ingest_folder
import os
from pathlib import Path

# Verified links for landmark 2024 judgments
LANDMARK_2024 = [
    {"title": "Vijay Singh @ Vijay Kr. Sharma v. The State of Bihar", "url": "https://indiankanoon.org/doc/81232058"},
    {"title": "Arvind Kejriwal v. Directorate of Enforcement", "url": "https://indiankanoon.org/doc/68037672"},
    {"title": "National Eligibility cum Entrance Test (NEET UG) 2024", "url": "https://indiankanoon.org/doc/171501865"},
]

TEMP_DIR = Path("./data/sc_pilot_2024")
TEMP_DIR.mkdir(parents=True, exist_ok=True)

async def ingest_pilot_2024():
    print("🚀 Starting Phase 2: Pilot Full-Text Ingestion (2024 Landmark Subset)")
    
    for case in LANDMARK_2024:
        print(f"\n🌐 Fetching full text for: {case['title']}...")
        full_text = scraper_service.fetch_legal_text(case['url'])
        
        if full_text:
            file_path = TEMP_DIR / f"{case['title'].replace(' ', '_').lower()}.md"
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(f"# {case['title']}\n\n")
                f.write(f"**URL**: {case['url']}\n")
                f.write(f"**Category**: Landmark Judgment 2024\n\n")
                f.write(full_text)
            print(f"✅ Saved to {file_path}")
        else:
            print(f"❌ Failed to fetch: {case['title']}")

    print("\n📥 Starting Vector Indexing for Pilot Batch...")
    # Trigger ingestion
    ingest_folder(str(TEMP_DIR))
    print("\n✨ Phase 2 Pilot Complete!")

if __name__ == "__main__":
    asyncio.run(ingest_pilot_2024())
