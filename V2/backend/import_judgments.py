#!/usr/bin/env python3
"""
NyayaFlow: Landmark Judgments Importer
Pulls full text of critical SC/HC judgments for the Research Brain.
"""

import os
from pathlib import Path
from scraper_service import scraper_service

# List of critical Landmark Judgments in Indian Legal History
LANDMARK_JUDGMENTS = [
    {
        "title": "Kesavananda Bharati v. State of Kerala",
        "year": 1973,
        "importance": "Basic Structure Doctrine - Parliament cannot alter the essential features of the Constitution.",
        "url": "https://indiankanoon.org/doc/257876/"
    },
    {
        "title": "Maneka Gandhi v. Union of India",
        "year": 1978,
        "importance": "Personal Liberty & Due Process - Article 21 must be fair, just, and reasonable.",
        "url": "https://indiankanoon.org/doc/1766147/"
    },
    {
        "title": "Vishaka v. State of Rajasthan",
        "year": 1997,
        "importance": "Sexual Harassment at Workplace - Guidelines to protect women in the absence of legislation.",
        "url": "https://indiankanoon.org/doc/1031794/"
    },
    {
        "title": "Justice K.S. Puttaswamy v. Union of India",
        "year": 2017,
        "importance": "Right to Privacy - Declared as a fundamental right under Article 21.",
        "url": "https://indiankanoon.org/doc/91938676/"
    },
    {
        "title": "Navtej Singh Johar v. Union of India",
        "year": 2018,
        "importance": "Section 377 Decriminalization - Struck down the portion of IPC 377 criminalizing consensual gay sex.",
        "url": "https://indiankanoon.org/doc/168671544/"
    },
    {
        "title": "S.R. Bommai v. Union of India",
        "year": 1994,
        "importance": "Federalism & Article 356 - Restricted the power to dismiss state governments.",
        "url": "https://indiankanoon.org/doc/60799/"
    },
    {
        "title": "Shah Bano Begum Case (Mohd. Ahmed Khan v. Shah Bano Begum)",
        "year": 1985,
        "importance": "Maintenance for Muslim Women - Section 125 CrPC applies to all.",
        "url": "https://indiankanoon.org/doc/10563/"
    },
    {
        "title": "Shayara Bano v. Union of India",
        "year": 2017,
        "importance": "Triple Talaq - Declared instant Triple Talaq (Talaq-e-Biddat) as unconstitutional.",
        "url": "https://indiankanoon.org/doc/115701223/"
    },
    {
        "title": "Indra Sawhney v. Union of India",
        "year": 1992,
        "importance": "Mandal Commission - Reservation cap of 50% and introduction of 'Creamy Layer'.",
        "url": "https://indiankanoon.org/doc/1368744/"
    },
    {
        "title": "M.C. Mehta v. Union of India (Oleum Gas Leak)",
        "year": 1987,
        "importance": "Absolute Liability - Enterprises in hazardous activities are strictly liable for damages.",
        "url": "https://indiankanoon.org/doc/1486949/"
    }
]

def main():
    print("⚖️ NyayaFlow Landmark Judgments Importer Starting...")
    
    target_dir = Path(__file__).parent / "data" / "judgments"
    target_dir.mkdir(parents=True, exist_ok=True)
    
    total_pulled = 0
    
    for judgment in LANDMARK_JUDGMENTS:
        print(f"📥 Pulling: {judgment['title']} ({judgment['year']})...")
        content = scraper_service.fetch_legal_text(judgment['url'])
        if content:
            # Clean filename
            filename = judgment['title'].lower().replace(" ", "_").replace(".", "").replace("/", "_").replace(",", "") + ".md"
            with open(target_dir / filename, "w", encoding="utf-8") as f:
                header = f"# {judgment['title']}\n"
                header += f"YEAR: {judgment['year']}\n"
                header += f"IMPORTANCE: {judgment['importance']}\n"
                header += f"SOURCE: {judgment['url']}\n\n"
                f.write(header + content)
            total_pulled += 1
            print(f"   ✅ Saved to {filename}")
        else:
            print(f"   ❌ Failed to pull {judgment['title']}")

    print(f"\n✨ Success! Pulled {total_pulled} Landmark Judgments.")
    print(f"📂 Next: Run 'python ingest.py' or a dedicated script to index './data/judgments'.")

if __name__ == "__main__":
    main()
