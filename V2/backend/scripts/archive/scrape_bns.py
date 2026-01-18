"""
Scrape Bharatiya Nyaya Sanhita (BNS) 2023 from Indian Kanoon.
BNS is the new criminal code that replaced IPC, effective July 1, 2024.
"""
import os
import sys
import asyncio
import requests
from bs4 import BeautifulSoup
from typing import Dict

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

OUTPUT_DIR = "./source-documents/statutes/bns"
BNS_URL = "https://indiankanoon.org/doc/105170890/"

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def fetch_page(url: str) -> BeautifulSoup:
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return BeautifulSoup(response.content, 'html.parser')
    except Exception as e:
        print(f"❌ Error fetching {url}: {e}")
        return None

def scrape_bns() -> Dict:
    """Scrape the full BNS text from Indian Kanoon."""
    print(f"🔍 Fetching BNS from {BNS_URL}...")
    
    soup = fetch_page(BNS_URL)
    if not soup:
        return None
    
    # Extract title
    title_elem = soup.find('h1') or soup.find('title')
    title = title_elem.get_text(strip=True) if title_elem else "Bharatiya Nyaya Sanhita, 2023"
    
    # Extract main content (Indian Kanoon uses div with class 'judgments')
    content_div = soup.find('div', class_='judgments') or soup.find('div', class_='doc')
    
    if content_div:
        # Remove navigation and footer elements
        for unwanted in content_div(['script', 'style', 'nav', 'footer', 'header']):
            unwanted.decompose()
        
        content = content_div.get_text(separator='\n', strip=True)
    else:
        # Fallback: get all text
        content = soup.get_text(separator='\n', strip=True)
    
    return {
        "title": title,
        "content": content,
        "url": BNS_URL,
        "date": "2023-12-25",  # Date of Presidential assent
        "effective_date": "2024-07-01",  # Date it came into force
        "citation": "Act No. 45 of 2023"
    }

def save_as_markdown(data: Dict, output_dir: str):
    """Save BNS as Markdown with YAML frontmatter."""
    ensure_dir(output_dir)
    
    filename = "bharatiya_nyaya_sanhita_2023.md"
    filepath = os.path.join(output_dir, filename)
    
    frontmatter = f"""---
title: "{data['title']}"
date: "{data['date']}"
effective_date: "{data['effective_date']}"
court: "UNION OF INDIA"
citation: "{data['citation']}"
verdict: "N/A"
statutes: ['Bharatiya Nyaya Sanhita', 'BNS']
summary: "The Bharatiya Nyaya Sanhita, 2023 is the new criminal code of India that replaced the Indian Penal Code, 1860. It came into effect on July 1, 2024 and contains 356 sections."
source_url: "{data['url']}"
ingested_type: "statute"
---

"""
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(frontmatter)
        f.write(data['content'])
    
    print(f"✅ Saved to: {filepath}")
    return filepath

async def main():
    print("🚀 Bharatiya Nyaya Sanhita (BNS) Scraper")
    print("=" * 60)
    
    ensure_dir(OUTPUT_DIR)
    
    # Scrape BNS
    bns_data = scrape_bns()
    
    if bns_data and bns_data['content'].strip():
        save_as_markdown(bns_data, OUTPUT_DIR)
        print("\n✨ BNS scraping complete!")
        print(f"📊 Content length: {len(bns_data['content'])} characters")
        print("\n🔄 Next step: Run ingestion script")
        print("   python scripts/ingest_documents.py")
    else:
        print("❌ Failed to scrape BNS")

if __name__ == "__main__":
    asyncio.run(main())
