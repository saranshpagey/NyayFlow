import requests
from bs4 import BeautifulSoup
import os
import re
import hashlib

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
        """
        Fetch and clean text from a legal URL.
        Returns a dict: {"text": str, "metadata": dict}
        """
        if not url or not url.startswith("http"):
            return None

        # Check Cache first
        cache_path = self._get_cache_path(url)
        if os.path.exists(cache_path):
            print(f"📦 Cache hit for: {url}")
            with open(cache_path, "r", encoding="utf-8") as f:
                # Naive: we previously stored just text. For backward compatibility, 
                # we return text with empty metadata if it's just raw text.
                # Ideally, cache should store JSON. 
                content = f.read()
                return {"text": content, "metadata": {"source": url, "cached": True}}

        print(f"🛰️ Fetching from Web: {url}")
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Metadata Extraction
            metadata = self._extract_metadata(soup, url)
            
            # Content Extraction
            if "indiankanoon.org" in url:
                content_div = soup.find("div", class_="judgments") or soup.find("div", class_="doc_content")
            elif "indiacode.nic.in" in url:
                content_div = soup.find("div", class_="act_content") or soup.find("div", id="act_content") or soup.find("div", class_="container")
            else:
                content_div = soup.find("article") or soup.find("main") or soup.find("body")
            
            if content_div:
                for tag in content_div.find_all(["script", "style", "form", "input", "footer", "nav", "div", "button"]):
                    # Be careful removing DIVs, sometimes they contain structure. 
                    # For IndianKanoon, 'judgments' div contains everything.
                    if tag.name == "div" and tag.get("class") == ["doc_options"]: # Remove doc options
                         tag.decompose()
                    elif tag.name != "div":
                        tag.decompose()
                
                text = content_div.get_text(separator="\n")
            else:
                text = soup.get_text(separator="\n")

            # Clean the text
            clean_text = self._clean_legal_text(text)
            
            # Save to Cache (Storing just text for now to maintain compat with existing plain-text usage, 
            # but ideally we should switch to JSON cache)
            with open(cache_path, "w", encoding="utf-8") as f:
                f.write(clean_text)
                
            return {"text": clean_text, "metadata": metadata}

        except Exception as e:
            print(f"❌ Scraping Error: {e}")
            return None

    def _extract_metadata(self, soup, url):
        """Extract metadata from the page using HTML tags and Regex fallback."""
        meta = {
            "url": url,
            "title": "Unknown Legal Document",
            "date": "Unknown",
            "court": "Unknown",
            "citation": "N/A"
        }
        
        try:
            full_text = soup.get_text(separator="\n")
            
            # 1. Title Extraction
            # Indian Kanoon usually has <div class="doc_title">
            title_tag = soup.find("div", class_="doc_title")
            if title_tag:
                raw_title = title_tag.get_text().strip()
                # Clean "Cites 15" or "[Cites 0]" suffixes common on Indian Kanoon
                raw_title = re.split(r'\[?Cites|\[?Cited by', raw_title)[0].strip()
                if raw_title:
                    meta["title"] = raw_title
            
            # Fallback: Look for the first substantial line that looks like a title
            if meta["title"] == "Unknown Legal Document" or len(meta["title"]) < 10:
                if "indiacode" in url:
                    act_title = soup.find("div", class_="act-title")
                    if act_title:
                        meta["title"] = act_title.get_text().strip()
                
                # Regex Fallback for "Party A vs Party B"
                # Look in first 40 lines (judgments can have preambles)
                lines = [l.strip() for l in full_text.split('\n') if l.strip()]
                for line in lines[:60]: # Increased scan depth
                    # Look for classic Law Report patterns or Vs pattern
                    if " vs " in line.lower() or " versus " in line.lower() or " v. " in line.lower():
                        meta["title"] = line
                        break
            
            # 2. Date Extraction
            # Look for "Date of Judgment" or standard date patterns
            date_patterns = [
                r"DATE OF JUDGMENT[:\s]+(\d{1,2}[/\.-]\d{1,2}[/\.-]\d{2,4})",
                r"Date of Decision[:\s]+(\d{1,2}\s+\w+\.?\s+\d{4})",
                r"(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\W+\d{4})"
            ]
            for pat in date_patterns:
                match = re.search(pat, full_text, re.IGNORECASE)
                if match:
                    meta["date"] = match.group(1)
                    break
            
            # 3. Court Extraction
            doc_source = soup.find("div", class_="doc_source")
            if doc_source:
                meta["court"] = doc_source.get_text().strip()
            elif "Supreme Court" in full_text[:500]:
                meta["court"] = "Supreme Court of India"
            elif "High Court" in full_text[:500]:
                # Try to find which High Court
                hc_match = re.search(r"([A-Z][a-z]+)\s+High Court", full_text[:500])
                if hc_match:
                    meta["court"] = f"{hc_match.group(1)} High Court"
            
            # 4. Citation Extraction
            citation_patterns = [
                r"Equivalent citations[:\s]+(.*?)(?:\n|$)",
                r"CITATION[:\s]+(.*?)(?:\n|$)",
                r"(\d{4}\s+SCC\s+\(?\d+\)?\s+\d+)",
                r"(AIR\s+\d{4}\s+SC\s+\d+)"
            ]
            for pat in citation_patterns:
                match = re.search(pat, full_text, re.IGNORECASE)
                if match:
                    # Clean up the citation
                    clean_cite = re.sub(r'\s+', ' ', match.group(1).strip())
                    meta["citation"] = clean_cite
                    break

        except Exception as e:
            print(f"⚠️ Metadata extraction warning: {e}")
            
        return meta

    def _clean_legal_text(self, text):
        """Remove excess whitespace and boilerplate."""
        # Replace multiple newlines with single
        text = re.sub(r'\n+', '\n', text)
        # Remove multiple spaces
        text = re.sub(r' +', ' ', text)
        # Strip each line
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        return "\n".join(lines)

# Singleton
scraper_service = ScraperService()
