
import requests
from bs4 import BeautifulSoup
import os
import hashlib
import re

class ScraperService:
    def __init__(self, cache_dir="./data/cache"):
        self.cache_dir = cache_dir
        if not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)
        
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

    def _get_cache_path(self, url):
        """Generate a unique filename for the URL."""
        url_hash = hashlib.md5(url.encode()).hexdigest()
        return os.path.join(self.cache_dir, f"{url_hash}.txt")

    def fetch_legal_text(self, url):
        """Fetch and clean text from a legal URL (specifically Indian Kanoon)."""
        if not url or not url.startswith("http"):
            return None

        # Check Cache first
        cache_path = self._get_cache_path(url)
        if os.path.exists(cache_path):
            print(f"📦 Cache hit for: {url}")
            with open(cache_path, "r", encoding="utf-8") as f:
                return f.read()

        print(f"🛰️ Fetching from Web: {url}")
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Specialized extraction based on Domain
            if "indiankanoon.org" in url:
                content_div = soup.find("div", class_="judgments") or soup.find("div", class_="doc_content")
            elif "indiacode.nic.in" in url:
                # Indiacode often uses act_content or similar divs
                content_div = soup.find("div", class_="act_content") or soup.find("div", id="act_content") or soup.find("div", class_="container")
            else:
                content_div = soup.find("article") or soup.find("main") or soup.find("body")
            
            if content_div:
                # Remove unwanted elements
                for tag in content_div.find_all(["script", "style", "form", "input", "footer", "nav"]):
                    tag.decompose()
                
                text = content_div.get_text(separator="\n")
            else:
                text = soup.get_text(separator="\n")

            # Clean the text
            clean_text = self._clean_legal_text(text)
            
            # Save to Cache
            with open(cache_path, "w", encoding="utf-8") as f:
                f.write(clean_text)
                
            return clean_text

        except Exception as e:
            print(f"❌ Scraping Error: {e}")
            return None

    def _clean_legal_text(self, text):
        """Remove excess whitespace and boilerplate."""
        # Replace multiple newlines with single
        text = re.sub(r'\n+', '\n', text)
        # Remove multiple spaces
        text = re.sub(r' +', ' ', text)
        # Strip each line
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        # Simple heuristic to remove very short lines that might be noise
        # but keep relevant ones like "Section 1"
        return "\n".join(lines)

# Singleton
scraper_service = ScraperService()
