"""
Scrape the complete Constitution of India from constitutionofindia.net
This will extract all Parts, Articles, and Schedules.
"""
import os
import sys
import asyncio
import requests
from bs4 import BeautifulSoup
from typing import List, Dict
from dotenv import load_dotenv
from tqdm import tqdm

load_dotenv()

# Add parent to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

OUTPUT_DIR = "./source-documents/constitution"
BASE_URL = "https://www.constitutionofindia.net"

def ensure_dir(path):
    """Create directory if it doesn't exist."""
    os.makedirs(path, exist_ok=True)

from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

def get_session():
    """Create a session with retry logic."""
    session = requests.Session()
    retry = Retry(
        total=5,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session

# Global session
session = get_session()

def fetch_page(url: str) -> BeautifulSoup:
    """Fetch and parse a webpage using the robust session."""
    try:
        response = session.get(url, timeout=30)
        response.raise_for_status()
        return BeautifulSoup(response.content, 'html.parser')
    except Exception as e:
        print(f"❌ Error fetching {url}: {e}")
        return None

# ... (discover_constitution_structure remains same) ...
def discover_constitution_structure():
    """
    Discover all parts, and then visit each part to find all articles.
    Returns a comprehensive list of URLs to scrape.
    """
    print("🔍 Discovering Constitution structure (Deep Scan)...")
    
    main_page = fetch_page(f"{BASE_URL}/read/")
    if not main_page:
        return []
    
    part_urls = []
    article_urls = []
    
    # 1. Find all Part links
    links = main_page.find_all('a', href=True)
    for link in links:
        href = link['href']
        if '/parts/' in href:
            full_url = href if href.startswith('http') else f"{BASE_URL}{href}"
            if full_url not in part_urls:
                part_urls.append(full_url)
    
    print(f"📖 Found {len(part_urls)} Parts. Scanning for Articles...")
    
    # 2. Visit each Part to find Articles
    for part_url in tqdm(part_urls, desc="Scanning Parts"):
        part_page = fetch_page(part_url)
        if not part_page:
            continue
            
        # Extract articles from this part
        sub_links = part_page.find_all('a', href=True)
        for sub_link in sub_links:
            sub_href = sub_link['href']
            # We want articles and schedules
            if '/articles/' in sub_href or '/schedules/' in sub_href:
                full_url = sub_href if sub_href.startswith('http') else f"{BASE_URL}{sub_href}"
                if full_url not in article_urls:
                    article_urls.append(full_url)
                    
        # Also keep track of the Part itself as a document? 
        # Yes, let's keep the Part summary page too.
        if part_url not in article_urls:
            article_urls.append(part_url)

    print(f"✅ Found {len(article_urls)} total constitutional provisions (Articles + Parts + Schedules)")
    return article_urls


def scrape_article(url: str) -> Dict:
    """Scrape a single article/part/schedule."""
    soup = fetch_page(url)
    if not soup:
        return None
    
    # Extract title
    title_elem = soup.find('h1') or soup.find('h2')
    title = title_elem.get_text(strip=True) if title_elem else "Constitutional Provision"
    
    # Extract main content
    content_div = soup.find('div', class_='content') or soup.find('article') or soup.find('main')
    
    if content_div:
        # Remove script and style elements
        for script in content_div(["script", "style"]):
            script.decompose()
        
        content = content_div.get_text(separator='\n', strip=True)
    else:
        # Fallback: get all paragraph text
        paragraphs = soup.find_all('p')
        content = '\n\n'.join([p.get_text(strip=True) for p in paragraphs])
    
    # Determine type (Article, Part, Schedule)
    doc_type = "Constitutional Article"
    if '/parts/' in url:
        doc_type = "Constitutional Part"
    elif '/schedules/' in url:
        doc_type = "Constitutional Schedule"
    
    return {
        "title": title,
        "content": content,
        "url": url,
        "type": doc_type
    }

def save_as_markdown(article: Dict, output_dir: str):
    """Save article as Markdown with YAML frontmatter."""
    ensure_dir(output_dir)
    
    # Generate filename
    title_slug = article['title'].lower().replace(' ', '_').replace('/', '_').replace('.', '')[:80]
    filename = f"{title_slug}.md"
    filepath = os.path.join(output_dir, filename)
    
    # Create YAML frontmatter
    frontmatter = f"""---
title: {article['title']}
type: {article['type']}
source: Constitution of India
source_url: {article['url']}
date: 1950-01-26
court: Constitutional Document
---

"""
    
    # Write file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(frontmatter)
        f.write(article['content'])
    
    return filepath

def get_filename(title: str) -> str:
    """Generate filename from title."""
    title_slug = title.lower().replace(' ', '_').replace('/', '_').replace('.', '')[:80]
    return f"{title_slug}.md"

async def main():
    print("🚀 Constitution of India Scraper (Robust Mode)")
    print("=" * 60)
    print(f"📍 Source: {BASE_URL}/read/")
    print("=" * 60)
    
    ensure_dir(OUTPUT_DIR)
    
    # Discover all constitutional provisions
    urls = discover_constitution_structure()
    
    print(f"\n📊 Total provisions to scrape: {len(urls)}")
    
    scraped_count = 0
    skipped_count = 0
    failed_count = 0
    
    # Scrape each provision
    for url in tqdm(urls, desc="Scraping Constitution"):
        # Check if already exists (heuristic based on URL slug? No, stick to scraping but skip write if same?)
        # Better: check if we can predict the filename? 
        # Since we don't know the title without fetching, let's just fetch.
        # BUT: we can check if the URL *looks* like one we processed.
        # Actually, let's just rely on the Retry logic to be fast.
        
        article = scrape_article(url)
        
        if article and article['content'].strip():
            # Check if file exists based on title
            filename = get_filename(article['title'])
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            if os.path.exists(filepath):
                skipped_count += 1
                continue

            save_as_markdown(article, OUTPUT_DIR)
            scraped_count += 1
        else:
            failed_count += 1
        
        # Be polite to the server
        await asyncio.sleep(0.5)
    
    print("\n" + "=" * 60)
    print(f"✨ Scraping Complete!")
    print(f"📊 New Scraped: {scraped_count}")
    print(f"⏭️ Skipped (Exists): {skipped_count}")
    print(f"⚠️ Failed: {failed_count}")
    print(f"📁 Saved to: {OUTPUT_DIR}")
    print("\n🔄 Next Step: Run ingestion script")
if __name__ == "__main__":
    asyncio.run(main())
