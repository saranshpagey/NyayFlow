#!/usr/bin/env python3
"""
NyayaFlow: Procedural 'Fine-Print' Importer
Ingests Limitation Act periods and common Court Fee structures.
"""

import os
from pathlib import Path

PROCEDURAL_DATA = [
    {
        "title": "Limitation Act 1963 - Common Civil Periods",
        "category": "Procedural / Limitation",
        "content": """# LIMITATION ACT, 1963 - COMMON SCHEDULE
| Nature of Suit | Period of Limitation | Starting Point (Time from which period begins to run) |
| :--- | :--- | :--- |
| **Money Lent** | 3 Years | When the loan is made (or when the demand is made if on demand). |
| **Breach of Contract** | 3 Years | When the contract is broken. |
| **Possession of Immovable Property (Title)** | 12 Years | When possession of defendant becomes adverse to plaintiff. |
| **Specific Performance of Contract** | 3 Years | Fixed date for performance, or when refusal is noticed. |
| **Recovery of Trust/Mortgaged Property** | 30 Years | When the transfer becomes known to the plaintiff. |
| **Balance of Account (Mutual/Current)** | 3 Years | Close of the year in which the last item is entered. |
| **Goods Sold and Delivered** | 3 Years | Date of delivery of goods. |
| **Promissory Note (Installments)** | 3 Years | Expiration of the first term of payment. |
| **General Suit (No specific limit provided)** | 3 Years | When the right to sue accrues. |

---
**CRITICAL NOTE:** In criminal cases, while the Limitation Act doesn't apply directly to all, Section 468 of CrPC specifies limits (e.g., 6 months for fine-only offenses, 1 year for up to 1 year jail, 3 years for 1-3 years jail)."""
    },
    {
        "title": "Court Fees Act - Sample Estimates (General India)",
        "category": "Procedural / Fees",
        "content": """# COURT FEES & STAMP DUTY SAMPLES
*Note: Court fees vary by State. These are common estimates.*

### 1. Civil Suits (Ad Valorem fees based on suit value)
- **Suit for Money**: Usually 5% to 10% of the suit value, depending on the tier.
- **Suit for Possession**: 10-20 times the land revenue or market value calculation.

### 2. Fixed Fees (Common Applications)
- **Vakalatnama**: Rs. 5 to Rs. 10 (State dependent) + Advocate Welfare Fund stamps.
- **Bail Application**: Rs. 2 to Rs. 20.
- **Urgent Application**: Rs. 5 to Rs. 50.
- **Legal Notice**: No court fee (only advocate fee and postage).

### 3. Divorce & Matrimonial
- **Mutual Consent (Delhi)**: Approx Rs. 15 to Rs. 100 fixed fee.

---
**PARALEGAL TIP:** Always check the specific 'State Court Fees Act' (e.g., Bombay Court Fees Act 1959) for exact calculations in your jurisdiction."""
    }
]

def main():
    print("⚖️ NyayaFlow Procedural Importer Starting...")
    
    target_dir = Path(__file__).parent / "data" / "procedural"
    target_dir.mkdir(parents=True, exist_ok=True)
    
    for d in PROCEDURAL_DATA:
        filename = d['title'].lower().replace(" ", "_").replace("-", "").replace("(", "").replace(")", "").replace(",", "").replace("/", "_") + ".md"
        with open(target_dir / filename, "w", encoding="utf-8") as f:
            f.write(f"TITLE: {d['title']}\nCATEGORY: {d['category']}\nTYPE: Procedural Guide\n\n{d['content']}")
        print(f"   ✅ Saved: {filename}")

    print(f"\n✨ Successfully imported procedural guides.")
    print(f"📂 Next: Index './data/procedural' into the Vector DB.")

if __name__ == "__main__":
    main()
