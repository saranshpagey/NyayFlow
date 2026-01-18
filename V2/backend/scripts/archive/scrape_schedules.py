"""
Targeted scraper for Constitution Schedules.
"""
import os
import sys
import asyncio
import requests
from bs4 import BeautifulSoup
from typing import Dict
from tqdm import tqdm

# Add parent to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

OUTPUT_DIR = "./source-documents/constitution"
BASE_URL = "https://www.constitutionofindia.net"

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def fetch_page(url: str) -> BeautifulSoup:
    try:
        response = requests.get(url, timeout=30)
        # 404 is fine, just means maybe URL pattern is wrong
        if response.status_code == 404:
            return None
        response.raise_for_status()
        return BeautifulSoup(response.content, 'html.parser')
    except Exception as e:
        print(f"❌ Error fetching {url}: {e}")
        return None

def scrape_schedule(url: str, title_hint: str) -> Dict:
    soup = fetch_page(url)
    if not soup:
        return None
    
    title_elem = soup.find('h1') or soup.find('h2')
    title = title_elem.get_text(strip=True) if title_elem else title_hint
    
    content_div = soup.find('div', class_='content') or soup.find('article') or soup.find('main')
    if content_div:
        for script in content_div(["script", "style"]):
            script.decompose()
        content = content_div.get_text(separator='\n', strip=True)
    else:
        paragraphs = soup.find_all('p')
        content = '\n\n'.join([p.get_text(strip=True) for p in paragraphs])
    
    return {
        "title": title,
        "content": content,
        "url": url,
        "type": "Constitutional Schedule"
    }

def save_as_markdown(article: Dict, output_dir: str):
    ensure_dir(output_dir)
    title_slug = article['title'].lower().replace(' ', '_').replace('/', '_').replace('.', '')[:80]
    filename = f"{title_slug}.md"
    filepath = os.path.join(output_dir, filename)
    
    frontmatter = f"""---
title: {article['title']}
type: {article['type']}
source: Constitution of India
source_url: {article['url']}
date: 1950-01-26
court: Constitutional Document
---

"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(frontmatter)
        f.write(article['content'])

async def main():
    print("🚀 Scraping all Schedules via Discovery...")
    ensure_dir(OUTPUT_DIR)
    
    # 1. Fetch main page to find Schedule links
    main_url = f"{BASE_URL}/read/"
    print(f"🔍 Scanning {main_url} for schedules...")
    
    soup = fetch_page(main_url)
    if not soup:
        print("❌ Failed to fetch main page.")
        return

    schedule_urls = []
    links = soup.find_all('a', href=True)
    
    for link in links:
        href = link['href']
        if '/schedules/' in href:
            full_url = href if href.startswith('http') else f"{BASE_URL}{href}"
            
            # De-duplicate
            if full_url not in schedule_urls:
                schedule_urls.append(full_url)

    print(f"📊 Found {len(schedule_urls)} Schedule links.")
    
    count = 0
    for url in tqdm(schedule_urls, desc="Scraping Schedules"):
        # Scrape
        data = scrape_schedule(url, "Constitutional Schedule")
        
        if data and data['content'].strip():
            save_as_markdown(data, OUTPUT_DIR)
            count += 1
            
    print(f"✨ Scraped {count} Schedules successfully.")

if __name__ == "__main__":
    asyncio.run(main())
