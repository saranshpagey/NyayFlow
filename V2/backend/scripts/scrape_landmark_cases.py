#!/usr/bin/env python3
"""
Landmark Case Scraper with NER Enhancement
Scrapes curated landmark cases and applies metadata extraction before ingestion.
"""

import json
import os
import time
import requests
from bs4 import BeautifulSoup
from typing import Dict, List
from enhance_case_metadata import CaseLawMetadataExtractor

class LandmarkCaseScraper:
    def __init__(self, cases_json_path: str, output_dir: str):
        self.cases_json_path = cases_json_path
        self.output_dir = output_dir
        self.metadata_extractor = CaseLawMetadataExtractor()
        
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
    
    def scrape_case(self, url: str) -> str:
        """Scrape case text from Indian Kanoon."""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Indian Kanoon stores judgment text in <div class="judgments">
            judgment_div = soup.find('div', class_='judgments')
            if judgment_div:
                return judgment_div.get_text(separator='\n', strip=True)
            
            # Fallback: get all text
            return soup.get_text(separator='\n', strip=True)
        
        except Exception as e:
            print(f"❌ Failed to scrape {url}: {e}")
            return ""
    
    def process_case(self, case_info: Dict) -> bool:
        """
        Scrape a single case, enhance metadata, and save to markdown.
        
        Returns:
            True if successful, False otherwise
        """
        title = case_info['title']
        url = case_info['url']
        year = case_info.get('year', 'Unknown')
        tags = case_info.get('tags', [])
        
        print(f"📄 Processing: {title} ({year})")
        
        # Scrape case text
        case_text = self.scrape_case(url)
        if not case_text:
            return False
        
        # Build base metadata
        base_metadata = {
            "title": title,
            "source_url": url,
            "date": f"{year}-01-01",  # Approximate
            "ingested_type": "landmark_case",
            "curated_tags": tags
        }
        
        # Enhance with NER
        print(f"🔍 Extracting metadata...")
        enhanced_metadata = self.metadata_extractor.enhance_metadata(case_text, base_metadata)
        
        # Create markdown file
        filename = title.replace(' ', '_').replace('.', '').replace('/', '_')[:100] + '.md'
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
        
        print(f"✅ Saved: {filename}")
        print(f"   Citation: {enhanced_metadata.get('citation', 'N/A')}")
        print(f"   Court: {enhanced_metadata.get('court', 'N/A')}")
        print(f"   Judges: {len(enhanced_metadata.get('judges', []))}")
        print(f"   Tags: {len(enhanced_metadata.get('subject_tags', []))}\n")
        
        return True
    
    def run(self, delay_seconds: int = 3):
        """
        Scrape all landmark cases from the JSON file.
        
        Args:
            delay_seconds: Delay between requests to avoid rate limiting
        """
        with open(self.cases_json_path, 'r') as f:
            cases_data = json.load(f)
        
        total_cases = 0
        successful = 0
        
        for category, cases in cases_data.items():
            if category.startswith('_'):  # Skip metadata
                continue
            
            print(f"\n{'='*60}")
            print(f"📚 Category: {category.upper()}")
            print('='*60 + '\n')
            
            for case in cases:
                total_cases += 1
                if self.process_case(case):
                    successful += 1
                
                # Rate limiting
                time.sleep(delay_seconds)
        
        print(f"\n{'='*60}")
        print(f"✨ Scraping Complete!")
        print(f"   Total: {total_cases}")
        print(f"   Successful: {successful}")
        print(f"   Failed: {total_cases - successful}")
        print('='*60)


if __name__ == "__main__":
    scraper = LandmarkCaseScraper(
        cases_json_path="backend/data/landmark_cases.json",
        output_dir="backend/source-documents/cases/landmark"
    )
    
    print("🚀 Starting Landmark Case Scraper")
    print("   This will take ~2 minutes (29 cases × 3 sec delay)\n")
    
    scraper.run(delay_seconds=3)
