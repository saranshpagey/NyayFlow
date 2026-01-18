import os
import requests
import re
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor

# Constants
OUTPUT_DIR_COMPANIES = "backend/source-documents/statutes/companies_act_2013"
OUTPUT_DIR_TRADEMARKS = "backend/source-documents/statutes/trademarks_act_1999"

# Ensure directories exist
os.makedirs(OUTPUT_DIR_COMPANIES, exist_ok=True)
os.makedirs(OUTPUT_DIR_TRADEMARKS, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
}

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def scrape_section(act_name, section_num, url, output_dir):
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            print(f"❌ Failed to fetch {act_name} Sec {section_num}: {response.status_code}")
            return

        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Indian Kanoon specific extraction
        # Title is usually in "doc_title" class or h2
        title_elem = soup.find(class_='doc_title') or soup.find('h2')
        title = clean_text(title_elem.text) if title_elem else f"Section {section_num}"
        
        # Content usually in 'doc_content' or 'judgments' div (for acts, it's often unstructured text)
        # For simplicity in this demo, we'll grab the main text block
        # In a real expanded version, we'd use more specific selectors for India Code vs Kanoon
        content_div = soup.find(class_='doc_content') or soup.find(class_='judgments')
        if not content_div:
            # Fallback for India Code structure simulation
            content_div = soup.find('body')
            
        # Clean up unwanted elements
        for script in content_div(["script", "style", "div", "a"]):
            script.decompose()
            
        text_content = clean_text(content_div.get_text())

        filename = f"section_{section_num}.md"
        filepath = os.path.join(output_dir, filename)

        frontmatter = f"""---
title: "{act_name} Section {section_num}: {title}"
section: "{section_num}"
act: "{act_name}"
source_url: "{url}"
ingested_type: "statute_section"
---

{text_content}
"""
        with open(filepath, 'w') as f:
            f.write(frontmatter)
        print(f"✅ Saved {act_name} Sec {section_num}")

    except Exception as e:
        print(f"⚠️ Error scraping {act_name} Sec {section_num}: {e}")

# Robust Scraper using TOC Logic
def scrape_from_toc(toc_url, act_name, output_dir):
    print(f"📄 Fetching TOC for {act_name}...")
    try:
        res = requests.get(toc_url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(res.content, 'html.parser')
        
        # Indian Kanoon TOC usually lists sections as links
        # We need to filter for links that look like "/doc/12345/" but exclude the main one
        links = []
        for a in soup.find_all('a', href=True):
            href = a['href']
            text = clean_text(a.text)
            
            # Simple heuristic: Sections usually start with "Section" or look like titles
            # And links start with /doc/
            if href.startswith('/doc/') and len(text) > 3:
                 # Exclude main act link if it appears
                 if href in toc_url: continue
                 
                 full_url = f"https://indiankanoon.org{href}"
                 links.append((text, full_url))
        
        print(f"🔍 Found {len(links)} potential section links. Starting scrape...")
        
        # Filter duplicates
        unique_links = list({url: text for text, url in links}.items())
        
        # Limit for demo safely to avoid rate limits, but enough for "Full" feel
        # In production remove slicing
        print(f"🚀 Scraping {len(unique_links)} sections...")
        
        with ThreadPoolExecutor(max_workers=5) as executor:
            for url, text in unique_links:
                # Try to extract section number from text or just use auto-increment if missing
                sec_match = re.search(r'Section\s+(\d+[A-Z]?)', text, re.IGNORECASE)
                sec_num = sec_match.group(1) if sec_match else "Unknown"
                
                if sec_num != "Unknown":
                    executor.submit(scrape_section, act_name, sec_num, url, output_dir)
                
    except Exception as e:
        print(f"❌ Failed to parse TOC {toc_url}: {e}")

def scrape_companies_act():
    # Companies Act 2013 on Indian Kanoon
    scrape_from_toc("https://indiankanoon.org/doc/1715424/", "Companies Act, 2013", OUTPUT_DIR_COMPANIES)

def scrape_trademarks_act():
    # Trade Marks Act 1999 on Indian Kanoon
    scrape_from_toc("https://indiankanoon.org/doc/1709404/", "Trade Marks Act, 1999", OUTPUT_DIR_TRADEMARKS)

if __name__ == "__main__":
    scrape_companies_act()
    scrape_trademarks_act()
