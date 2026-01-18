#!/usr/bin/env python3
"""
Bulk Case Law Scraper
Scrapes 10,000+ cases from Indian Kanoon using topic-based queries with NER enhancement.
"""

import json
import os
import time
import hashlib
import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Set
from enhance_case_metadata import CaseLawMetadataExtractor

class BulkCaseScraper:
    def __init__(self, queries_json_path: str, output_dir: str):
        self.queries_json_path = queries_json_path
        self.output_dir = output_dir
        self.metadata_extractor = CaseLawMetadataExtractor()
        self.scraped_urls: Set[str] = set()  # Deduplication
        self.case_hashes: Set[str] = set()  # Content-based deduplication
        
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
    
    def search_indian_kanoon(self, query: str, max_results: int = 200) -> List[str]:
        """
        Search Indian Kanoon and return case URLs.
        
        Args:
            query: Search query
            max_results: Maximum number of results to fetch
        
        Returns:
            List of case URLs
        """
        base_url = "https://indiankanoon.org/search/"
        urls = []
        page = 0
        
        while len(urls) < max_results:
            try:
                params = {
                    'formInput': query,
                    'pagenum': page
                }
                
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                }
                
                response = requests.get(base_url, params=params, headers=headers, timeout=30)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Find case result links
                result_links = soup.find_all('a', href=True)
                page_urls = []
                
                for link in result_links:
                    href = link.get('href', '')
                    if '/doc/' in href:
                        full_url = f"https://indiankanoon.org{href}" if not href.startswith('http') else href
                        if full_url not in self.scraped_urls:
                            page_urls.append(full_url)
                
                if not page_urls:
                    break
                
                urls.extend(page_urls[:max_results - len(urls)])
                page += 1
                time.sleep(2)  # Rate limiting
                
            except Exception as e:
                print(f"❌ Search error on page {page}: {e}")
                break
        
        return urls[:max_results]
    
    def scrape_case(self, url: str) -> str:
        """Scrape case text from Indian Kanoon."""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            judgment_div = soup.find('div', class_='judgments')
            
            if judgment_div:
                return judgment_div.get_text(separator='\n', strip=True)
            return soup.get_text(separator='\n', strip=True)
        
        except Exception as e:
            print(f"❌ Failed to scrape {url}: {e}")
            return ""
    
    def get_content_hash(self, text: str) -> str:
        """Generate hash for content-based deduplication."""
        # Use first 1000 chars for hash (title + beginning)
        return hashlib.md5(text[:1000].encode()).hexdigest()
    
    def process_case(self, url: str, query_topic: str) -> bool:
        """
        Scrape a case, enhance metadata, and save.
        
        Args:
            url: Case URL
            query_topic: Topic this case was found under
        
        Returns:
            True if successful, False otherwise
        """
        # URL-based deduplication
        if url in self.scraped_urls:
            return False
        
        # Smart-Resume: Check if file already exists on disk
        filename = hashlib.md5(url.encode()).hexdigest() + '.md'
        filepath = os.path.join(self.output_dir, filename)
        if os.path.exists(filepath):
            # print(f"⏭️  Already on disk: {url}")
            self.scraped_urls.add(url)
            return False
        
        case_text = self.scrape_case(url)
        if not case_text or len(case_text) < 100:
            return False
        
        # Content-based deduplication
        content_hash = self.get_content_hash(case_text)
        if content_hash in self.case_hashes:
            print(f"⚠️  Duplicate content detected, skipping")
            return False
        
        # Extract title from first line
        title = case_text.split('\n')[0][:200]
        
        # Build base metadata
        base_metadata = {
            "title": title,
            "source_url": url,
            "ingested_type": "bulk_case",
            "query_topic": query_topic
        }
        
        # Enhance with NER
        enhanced_metadata = self.metadata_extractor.enhance_metadata(case_text, base_metadata)
        
        # Save to markdown
        filename = hashlib.md5(url.encode()).hexdigest() + '.md'
        filepath = os.path.join(self.output_dir, filename)
        
        # Build frontmatter
        frontmatter_lines = ["---"]
        for key, value in enhanced_metadata.items():
            if isinstance(value, list):
                frontmatter_lines.append(f"{key}: {json.dumps(value)}")
            elif isinstance(value, str):
                frontmatter_lines.append(f'{key}: "{value}"')
            else:
                frontmatter_lines.append(f"{key}: {value}")
        frontmatter_lines.append("---\n")
        
        content = '\n'.join(frontmatter_lines) + '\n' + case_text
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        # Mark as processed
        self.scraped_urls.add(url)
        self.case_hashes.add(content_hash)
        
        return True
    
    def run(self, pilot_mode: bool = False, pilot_queries: int = 3):
        """
        Run bulk scraping.
        
        Args:
            pilot_mode: If True, only scrape first N queries for testing
            pilot_queries: Number of queries to test in pilot mode
        """
        with open(self.queries_json_path, 'r') as f:
            queries_data = json.load(f)
        
        total_cases = 0
        successful = 0
        query_count = 0
        
        for category, queries in queries_data.items():
            if category.startswith('_'):  # Skip metadata
                continue
            
            print(f"\n{'='*60}")
            print(f"📚 Category: {category.upper()}")
            print('='*60 + '\n')
            
            for query_config in queries:
                query_count += 1
                
                if pilot_mode and query_count > pilot_queries:
                    print(f"\n🛑 Pilot mode: Stopping after {pilot_queries} queries")
                    break
                
                query = query_config['query']
                max_results = query_config['max_results']
                
                print(f"🔍 Query: \"{query}\"")
                print(f"   Target: {max_results} results")
                
                # Search for cases
                urls = self.search_indian_kanoon(query, max_results)
                print(f"   Found: {len(urls)} URLs")
                
                # Process each case
                for i, url in enumerate(urls, 1):
                    total_cases += 1
                    if self.process_case(url, category):
                        successful += 1
                        if successful % 10 == 0:
                            print(f"   ✅ Processed {successful}/{total_cases} cases")
                    
                    # Rate limiting
                    time.sleep(3)
                
                print(f"   ✅ Completed query: {successful} new cases added\n")
            
            if pilot_mode and query_count >= pilot_queries:
                break
        
        print(f"\n{'='*60}")
        print(f"✨ Scraping Complete!")
        print(f"   Total Attempted: {total_cases}")
        print(f"   Successful: {successful}")
        print(f"   Duplicates Skipped: {total_cases - successful}")
        print('='*60)


if __name__ == "__main__":
    scraper = BulkCaseScraper(
        queries_json_path="backend/data/bulk_scrape_queries.json",
        output_dir="backend/source-documents/cases/bulk"
    )
    
    print("🚀 Bulk Case Law Scraper")
    print("   Mode: FULL SCALE (50 queries, ~10,000 cases)")
    print("   Estimated Time: 8-10 hours")
    print("   This will run in the background.\n")
    
    scraper.run(pilot_mode=False)
