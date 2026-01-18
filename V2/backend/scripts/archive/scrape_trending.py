"""
Scrape the 50 most recent trending cases from Indian Kanoon.
This targets the "Most Viewed" and "Recent Judgments" sections.
"""
import os
import sys
import asyncio
from typing import List
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup

load_dotenv()

# Add parent to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from services.bulk_scrape import bulk_scrape_service

def scrape_trending_urls(limit: int = 50) -> List[str]:
    """
    Scrape trending case URLs from Indian Kanoon homepage.
    
    Strategy:
    1. Visit https://indiankanoon.org/
    2. Extract URLs from "Recent Supreme Court Judgments" section
    3. Extract URLs from "Most Viewed This Month" section
    4. Return up to `limit` unique URLs
    """
    print(f"🔍 Discovering trending cases from Indian Kanoon...")
    
    urls = []
    base_url = "https://indiankanoon.org"
    
    try:
        # Method 1: Recent Supreme Court Judgments
        print("📡 Fetching homepage...")
        response = requests.get(base_url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all case links (they typically have /doc/ in the URL)
        links = soup.find_all('a', href=True)
        for link in links:
            href = link['href']
            if '/doc/' in href and href not in urls:
                # Convert relative URLs to absolute
                if href.startswith('/'):
                    full_url = base_url + href
                else:
                    full_url = href
                
                # Clean up query parameters
                if '?' in full_url:
                    full_url = full_url.split('?')[0]
                
                urls.append(full_url)
                
                if len(urls) >= limit:
                    break
        
        # Method 2: Try browsing recent judgments page
        if len(urls) < limit:
            print("📡 Fetching recent judgments page...")
            recent_url = f"{base_url}/browse/"
            response = requests.get(recent_url, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            links = soup.find_all('a', href=True)
            for link in links:
                href = link['href']
                if '/doc/' in href and href not in urls:
                    if href.startswith('/'):
                        full_url = base_url + href
                    else:
                        full_url = href
                    
                    if '?' in full_url:
                        full_url = full_url.split('?')[0]
                    
                    urls.append(full_url)
                    
                    if len(urls) >= limit:
                        break
        
        if urls:
            print(f"✅ Discovered {len(urls)} unique case URLs")
            return urls[:limit]
        else:
            print("⚠️ No URLs found via automated discovery. Using curated list...")
            return get_fallback_cases(limit)
        
    except Exception as e:
        print(f"❌ Error discovering trending cases: {e}")
        # Fallback: Return a curated list of important recent cases
        print("⚠️ Falling back to curated important cases...")
        return get_fallback_cases(limit)

def get_fallback_cases(limit: int = 50) -> List[str]:
    """
    Fallback: Curated list of important Supreme Court cases.
    These are landmark judgments that should be in any legal database.
    """
    important_cases = [
        # Constitutional Law
        "https://indiankanoon.org/doc/1210757/",  # Kesavananda Bharati
        "https://indiankanoon.org/doc/919386/",   # Puttaswamy (Privacy)
        "https://indiankanoon.org/doc/1271834/",  # Maneka Gandhi
        "https://indiankanoon.org/doc/1930681/",  # Minerva Mills
        "https://indiankanoon.org/doc/1735815/",  # ADM Jabalpur
        
        # Criminal Law
        "https://indiankanoon.org/doc/1686715/",  # Navtej Johar (377)
        "https://indiankanoon.org/doc/60799/",    # Joseph Shine (Adultery)
        "https://indiankanoon.org/doc/1551554/",  # Shayara Bano (Triple Talaq)
        
        # IT & Media Law
        "https://indiankanoon.org/doc/1157148/",  # Shreya Singhal (66A)
        
        # Women's Rights
        "https://indiankanoon.org/doc/1656209/",  # Vishaka
        "https://indiankanoon.org/doc/1199306/",  # Shah Bano
        
        # Administrative Law
        "https://indiankanoon.org/doc/1569253/",  # S.R. Bommai
        
        # Add more recent 2023-2024 cases
        "https://indiankanoon.org/doc/82542966/",  # Recent case
        "https://indiankanoon.org/doc/193343432/", # Recent case
        "https://indiankanoon.org/doc/165772687/", # Recent case
    ]
    
    return important_cases[:limit]

async def main():
    print("🚀 Starting Trending Cases Scraper")
    print("=" * 60)
    
    # Discover trending URLs
    urls = scrape_trending_urls(limit=50)
    
    if not urls:
        print("❌ No URLs discovered. Exiting.")
        return
    
    print(f"\n📋 Will scrape {len(urls)} cases:")
    for i, url in enumerate(urls[:10], 1):
        print(f"   {i}. {url}")
    if len(urls) > 10:
        print(f"   ... and {len(urls) - 10} more")
    
    print("\n🛰️ Starting bulk scrape...")
    await bulk_scrape_service.run_batch(urls)
    
    print("\n✨ Trending scrape complete!")
    print(f"📁 Files saved to: ./source-documents/scraped/")
    print(f"📊 Next step: Run 'python scripts/ingest_documents.py' to index these cases")

if __name__ == "__main__":
    asyncio.run(main())
