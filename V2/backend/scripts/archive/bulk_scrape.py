import os
import sys
import re

# Add backend to path to import components
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scraper_service import scraper_service

TARGET_DIR = "./source-documents/scraped"

# --- Configuration ---
URLS_TO_SCRAPE = [
    "https://indiankanoon.org/doc/1210757/", # Kesavananda Bharati
    "https://indiankanoon.org/doc/919386/",  # Justice K.S. Puttaswamy (Privacy)
    "https://indiankanoon.org/doc/1686715/", # Navtej Singh Johar (Section 377)
    "https://indiankanoon.org/doc/1157148/", # Shreya Singhal (Section 66A)
    "https://indiankanoon.org/doc/1551554/", # Shayara Bano (Triple Talaq)
    "https://indiankanoon.org/doc/1569253/", # S.R. Bommai (Federalism)
    "https://indiankanoon.org/doc/1735815/", # ADM Jabalpur (Emergency)
    "https://indiankanoon.org/doc/1930681/", # Minerva Mills (Limited Amendment)
    "https://indiankanoon.org/doc/1199306/", # Mohd. Ahmed Khan v. Shah Bano Begum
    "https://indiankanoon.org/doc/1656209/", # Vishaka v. State of Rajasthan
    "https://indiankanoon.org/doc/1271834/", # Maneka Gandhi v. Union of India
    "https://indiankanoon.org/doc/60799/",   # Joseph Shine v. Union of India (Adultery)
    "https://indiankanoon.org/doc/1640625/", # Indian Young Lawyers Assn (Sabarimala)
]

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def slugify(text):
    """Create a filename-safe slug."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '_', text)
    return text.strip('_')[:50]

def save_as_markdown(data):
    meta = data['metadata']
    text = data['text']
    
    # Generate filename
    slug = slugify(meta.get('title', 'doc')) + ".md"
    filepath = os.path.join(TARGET_DIR, slug)
    
    # Prepare Frontmatter
    frontmatter = f"""---
type: case_law
title: {meta.get('title', 'Unknown')}
citation: {meta.get('citation', 'N/A')}
court: {meta.get('court', 'Unknown')}
date: {meta.get('date', 'Unknown')}
source: {meta.get('url')}
status: scraped
---

# {meta.get('title')}

{text}
"""
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(frontmatter)
    
    print(f"✅ Saved to {filepath}")

def main():
    print(f"🚀 Starting Bulk Scrape of {len(URLS_TO_SCRAPE)} documents...")
    ensure_dir(TARGET_DIR)
    
    for url in URLS_TO_SCRAPE:
        print(f"Processing: {url}")
        result = scraper_service.fetch_legal_text(url)
        
        if result:
             # Basic metadata refinement if scraper missed it
             if result['metadata']['title'] == "Unknown Legal Document":
                  # Try to infer from text first line
                  lines = result['text'].split('\n')
                  if lines:
                      result['metadata']['title'] = lines[0][:100]
            
             save_as_markdown(result)
        else:
            print(f"❌ Failed to fetch {url}")

    print("\n✨ Batch Complete. Run 'python ingest.py' to index these.")

if __name__ == "__main__":
    main()
