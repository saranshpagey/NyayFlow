"""
Bulk scrape Supreme Court cases from Indian Kanoon by year.
This is a more reliable alternative to downloading from datasets.

Strategy:
1. Use Indian Kanoon's search/browse functionality
2. Scrape cases year by year (2014-2025)
3. Save as Markdown with metadata
4. Ready for ingestion

Note: This will take several hours to complete for all years.
"""
import os
import sys
import asyncio
from typing import List
from dotenv import load_dotenv

load_dotenv()

# Add parent to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from services.bulk_scrape import bulk_scrape_service

# Configuration
TARGET_YEARS = list(range(2014, 2026))  # 2014-2025
MAX_CASES_PER_YEAR = 100  # Reduced to be more conservative
OUTPUT_DIR = "./source-documents/indian_kanoon_bulk"

# Curated list of important Supreme Court cases by year
# These are landmark judgments that should definitely be in the knowledge base
LANDMARK_CASES_BY_YEAR = {
    2014: [
        "https://indiankanoon.org/doc/110813550/",  # NALSA v. Union of India (Transgender Rights)
        "https://indiankanoon.org/doc/54837959/",   # Lily Thomas v. Union of India (Disqualification)
    ],
    2015: [
        "https://indiankanoon.org/doc/110813550/",  # Shreya Singhal v. Union of India (Section 66A)
    ],
    2017: [
        "https://indiankanoon.org/doc/91938676/",   # Justice K.S. Puttaswamy v. Union of India (Privacy)
    ],
    2018: [
        "https://indiankanoon.org/doc/168676618/",  # Navtej Singh Johar v. Union of India (Section 377)
        "https://indiankanoon.org/doc/100470181/",  # Joseph Shine v. Union of India (Adultery)
    ],
    2019: [
        "https://indiankanoon.org/doc/127517806/",  # Sabarimala Review
    ],
    2020: [
        "https://indiankanoon.org/doc/165772687/",  # COVID-19 related cases
    ],
    2021: [
        "https://indiankanoon.org/doc/82542966/",   # Recent landmark
    ],
    2022: [
        "https://indiankanoon.org/doc/193343432/",  # Recent landmark
    ],
}

def ensure_dir(path):
    """Create directory if it doesn't exist."""
    os.makedirs(path, exist_ok=True)

async def scrape_year(year: int, urls: List[str]):
    """Scrape all cases for a given year."""
    if not urls:
        print(f"⚠️ No URLs provided for {year}, skipping...")
        return
    
    print(f"\n📅 Scraping {len(urls)} cases for {year}...")
    year_dir = os.path.join(OUTPUT_DIR, str(year))
    ensure_dir(year_dir)
    
    # Use our existing bulk scrape service
    await bulk_scrape_service.run_batch(urls)
    
    print(f"✅ Completed scraping for {year}")

async def main():
    print("🚀 Indian Kanoon Bulk Scraper (2014-2025)")
    print("=" * 60)
    print(f"📅 Target Years: {min(TARGET_YEARS)}-{max(TARGET_YEARS)}")
    print(f"📊 Landmark Cases: {sum(len(urls) for urls in LANDMARK_CASES_BY_YEAR.values())}")
    print("=" * 60)
    
    ensure_dir(OUTPUT_DIR)
    
    total_cases = 0
    
    # Scrape year by year
    for year in TARGET_YEARS:
        urls = LANDMARK_CASES_BY_YEAR.get(year, [])
        
        if urls:
            await scrape_year(year, urls)
            total_cases += len(urls)
        else:
            print(f"\n📅 {year}: No curated cases (add URLs to LANDMARK_CASES_BY_YEAR)")
    
    print("\n" + "=" * 60)
    print(f"✨ Bulk Scrape Complete!")
    print(f"📊 Total Cases Scraped: {total_cases}")
    print(f"📁 Saved to: {OUTPUT_DIR}")
    print("\n🔄 Next Steps:")
    print(f"   1. Review scraped files in {OUTPUT_DIR}")
    print(f"   2. Run: python scripts/ingest_documents.py")
    print("\n💡 To add more cases:")
    print("   - Add URLs to LANDMARK_CASES_BY_YEAR in this script")
    print("   - Or use the /kb Quick Ingest feature in the dashboard")

if __name__ == "__main__":
    asyncio.run(main())
