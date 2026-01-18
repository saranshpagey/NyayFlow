#!/usr/bin/env python3
"""
Landmark Case URL Generator
Uses Indian Kanoon's filters to programmatically generate 500 landmark case URLs.
"""

import requests
from bs4 import BeautifulSoup
import json
import time

class LandmarkCaseURLGenerator:
    def __init__(self):
        self.base_url = "https://indiankanoon.org"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
    
    def scrape_category_urls(self, category_url: str, max_cases: int = 100) -> list:
        """
        Scrape case URLs from a category page on Indian Kanoon.
        
        Args:
            category_url: URL of the category (e.g., constitutional law, criminal law)
            max_cases: Maximum number of cases to scrape from this category
        
        Returns:
            List of case URLs
        """
        urls = []
        page = 1
        
        while len(urls) < max_cases:
            try:
                paginated_url = f"{category_url}&pagenum={page}"
                print(f"📄 Scraping page {page} of {category_url.split('/')[-1]}...")
                
                response = requests.get(paginated_url, headers=self.headers, timeout=30)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Find all case links
                case_links = soup.find_all('a', href=True)
                page_urls = []
                
                for link in case_links:
                    href = link.get('href', '')
                    # Indian Kanoon case URLs follow pattern /doc/XXXXXXX/
                    if '/doc/' in href and href not in urls:
                        full_url = self.base_url + href if not href.startswith('http') else href
                        page_urls.append(full_url)
                
                if not page_urls:
                    print(f"   No more cases found on page {page}")
                    break
                
                urls.extend(page_urls[:max_cases - len(urls)])
                page += 1
                time.sleep(2)  # Rate limiting
                
            except Exception as e:
                print(f"❌ Error on page {page}: {e}")
                break
        
        return urls[:max_cases]
    
    def generate_landmark_urls(self) -> dict:
        """
        Generate 500 landmark case URLs across categories.
        
        Returns:
            Dictionary with categories and their case URLs
        """
        categories = {
            "constitutional_law": {
                "url": "https://indiankanoon.org/browse/?formInput=doctypes%3A%20judgments%20%20court%3A%20%22supreme%20court%22%20%20subject%3A%20%22constitutional%20law%22",
                "target": 100
            },
            "criminal_law": {
                "url": "https://indiankanoon.org/browse/?formInput=doctypes%3A%20judgments%20%20court%3A%20%22supreme%20court%22%20%20subject%3A%20%22criminal%20law%22",
                "target": 100
            },
            "corporate_law": {
                "url": "https://indiankanoon.org/browse/?formInput=doctypes%3A%20judgments%20%20court%3A%20%22supreme%20court%22%20%20subject%3A%20%22company%20law%22",
                "target": 50
            },
            "civil_rights": {
                "url": "https://indiankanoon.org/browse/?formInput=doctypes%3A%20judgments%20%20court%3A%20%22supreme%20court%22%20%20subject%3A%20%22fundamental%20rights%22",
                "target": 100
            },
            "contract_tort": {
                "url": "https://indiankanoon.org/browse/?formInput=doctypes%3A%20judgments%20%20court%3A%20%22supreme%20court%22%20%20subject%3A%20%22contract%22",
                "target": 50
            },
            "administrative_law": {
                "url": "https://indiankanoon.org/browse/?formInput=doctypes%3A%20judgments%20%20court%3A%20%22supreme%20court%22%20%20subject%3A%20%22administrative%20law%22",
                "target": 100
            }
        }
        
        all_urls = {}
        
        for category, config in categories.items():
            print(f"\n{'='*60}")
            print(f"📚 Category: {category.upper()}")
            print(f"   Target: {config['target']} cases")
            print('='*60)
            
            urls = self.scrape_category_urls(config['url'], config['target'])
            all_urls[category] = urls
            
            print(f"✅ Collected {len(urls)} URLs for {category}\n")
        
        return all_urls


if __name__ == "__main__":
    print("🚀 Landmark Case URL Generator")
    print("   Target: 500 Supreme Court landmark cases\n")
    
    generator = LandmarkCaseURLGenerator()
    
    # Note: This is a placeholder implementation
    # Indian Kanoon's actual browse URLs may differ
    # For now, we'll use a simpler approach: manually curated list
    
    print("⚠️  Note: Automated URL generation from Indian Kanoon requires")
    print("   analyzing their browse/search structure. For now, using")
    print("   the existing curated list and expanding it manually.\n")
    
    print("✅ Recommendation: Continue with the 19 curated cases as Phase 1A")
    print("   Then proceed to Phase 2 (Bulk Scraping) for volume.")
