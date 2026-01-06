#!/usr/bin/env python3
"""
NyayaFlow: Excise Law Inporter
Pulls Central and State Excise Acts for vector indexing.
"""

import os
from pathlib import Path
from scraper_service import scraper_service

# Categorized list of major Excise Acts in India
EXCISE_ACTS = {
    "Central": [
        {"title": "Central Excise Act, 1944", "url": "https://indiankanoon.org/doc/1359392/"},
        {"title": "Medicinal and Toilet Preparations (Excise Duties) Act, 1955", "url": "https://indiankanoon.org/doc/885695/"}
    ],
    "States": [
        {"state": "Uttar Pradesh", "title": "U.P. Excise Act, 1910", "url": "https://indiankanoon.org/doc/289904/"},
        {"state": "Maharashtra", "title": "Maharashtra Excise Act (Bombay Prohibition Act, 1949)", "url": "https://indiankanoon.org/doc/690226/"},
        {"state": "Karnataka", "title": "Karnataka Excise Act, 1965", "url": "https://indiankanoon.org/doc/1577741/"},
        {"state": "Delhi", "title": "Delhi Excise Act, 2009", "url": "https://indiankanoon.org/doc/1715891/"},
        {"state": "Tamil Nadu", "title": "Tamil Nadu Prohibition Act, 1937", "url": "https://indiankanoon.org/doc/1744186/"},
        {"state": "West Bengal", "title": "Bengal Excise Act, 1909", "url": "https://indiankanoon.org/doc/192770/"},
        {"state": "Bihar", "title": "Bihar Excise Act, 1915 (Prohibition)", "url": "https://indiankanoon.org/doc/1716964/"},
        {"state": "Gujarat", "title": "Gujarat Prohibition Act, 1949", "url": "https://indiankanoon.org/doc/858448/"},
        {"state": "Punjab", "title": "Punjab Excise Act, 1914", "url": "https://indiankanoon.org/doc/177093/"},
        {"state": "Haryana", "title": "Haryana Excise Act, 1914", "url": "https://indiankanoon.org/doc/312812/"}
    ]
}

def main():
    print("🏟️ NyayaFlow Excise Law Importer Starting...")
    
    target_dir = Path(__file__).parent / "data" / "excise"
    target_dir.mkdir(parents=True, exist_ok=True)
    
    total_pulled = 0
    
    # 1. Central Acts
    for act in EXCISE_ACTS["Central"]:
        print(f"📥 Pulling Central: {act['title']}...")
        content = scraper_service.fetch_legal_text(act['url'])
        if content:
            filename = act['title'].lower().replace(" ", "_").replace(",", "") + ".md"
            with open(target_dir / filename, "w", encoding="utf-8") as f:
                f.write(f"# {act['title']}\n\nCategory: Central Excise\nLink: {act['url']}\n\n{content}")
            total_pulled += 1
            print(f"   ✅ Saved to {filename}")

    # 2. State Acts
    for act in EXCISE_ACTS["States"]:
        print(f"📥 Pulling {act['state']}: {act['title']}...")
        content = scraper_service.fetch_legal_text(act['url'])
        if content:
            filename = f"state_{act['state'].lower()}_{act['title'].lower().replace(' ', '_').replace(',', '')}.md"
            with open(target_dir / filename, "w", encoding="utf-8") as f:
                f.write(f"# {act['title']}\n\nState: {act['state']}\nLink: {act['url']}\n\n{content}")
            total_pulled += 1
            print(f"   ✅ Saved to {filename}")

    print(f"\n✨ Success! Pulled {total_pulled} Excise Acts.")
    print(f"📂 Next: Run 'python ingest.py' to index './data/excise' into your Legal Brain.")

if __name__ == "__main__":
    main()
