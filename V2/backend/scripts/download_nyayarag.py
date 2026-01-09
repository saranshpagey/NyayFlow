"""
Download and ingest Supreme Court judgments from NyayaRAG dataset.
Dataset: https://huggingface.co/datasets/opennyaiorg/NyayaRAG

This script uses the Hugging Face datasets library to download judgments 
from 2014-2025 and processes them through our ingestion pipeline.

Installation:
    pip install datasets huggingface-hub
"""
import os
import sys
import asyncio
from typing import List, Dict
from dotenv import load_dotenv
from tqdm import tqdm

load_dotenv()

# Add parent to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from datasets import load_dataset
    DATASETS_AVAILABLE = True
except ImportError:
    DATASETS_AVAILABLE = False
    print("⚠️ 'datasets' library not installed. Run: pip install datasets huggingface-hub")

# Configuration
TARGET_YEARS = list(range(2014, 2026))  # 2014-2025
OUTPUT_DIR = "./source-documents/nyayarag"
MAX_CASES_PER_YEAR = 500  # Limit to prevent overwhelming the system

def ensure_dir(path):
    """Create directory if it doesn't exist."""
    os.makedirs(path, exist_ok=True)

def download_and_filter_dataset():
    """
    Download the NyayaRAG dataset using Hugging Face datasets library.
    Returns filtered cases by year.
    """
    if not DATASETS_AVAILABLE:
        print("❌ Cannot proceed without 'datasets' library")
        print("   Run: pip install datasets huggingface-hub")
        return {}
    
    print("📡 Loading NyayaRAG dataset from Hugging Face...")
    print("   This may take a while on first run (dataset will be cached)...")
    
    try:
        # Load the dataset
        dataset = load_dataset("opennyaiorg/NyayaRAG", split="train")
        print(f"✅ Loaded {len(dataset)} total cases")
        
        # Group cases by year
        cases_by_year = {year: [] for year in TARGET_YEARS}
        
        print("\n📊 Filtering and organizing by year...")
        for case in tqdm(dataset, desc="Processing cases"):
            # Extract year from the case
            year = extract_year_from_case(case)
            
            if year in TARGET_YEARS and len(cases_by_year[year]) < MAX_CASES_PER_YEAR:
                cases_by_year[year].append({
                    "text": case.get("text", ""),
                    "title": case.get("title", f"SC Case {year}"),
                    "date": case.get("date", f"{year}-01-01"),
                    "citation": case.get("citation", ""),
                    "court": "Supreme Court of India",
                    "year": year
                })
        
        # Print summary
        print("\n📈 Cases found by year:")
        for year in TARGET_YEARS:
            count = len(cases_by_year[year])
            if count > 0:
                print(f"   {year}: {count} cases")
        
        return cases_by_year
        
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        print("\n💡 Possible solutions:")
        print("   1. Check internet connection")
        print("   2. Verify dataset name: opennyaiorg/NyayaRAG")
        print("   3. Try: huggingface-cli login (if dataset requires auth)")
        return {}

def extract_year_from_case(case_data: Dict) -> int:
    """Extract year from case metadata."""
    # Try different possible date fields
    date_str = case_data.get("date") or case_data.get("judgment_date") or ""
    
    if date_str:
        # Try to parse year from various formats
        for fmt in ["%Y-%m-%d", "%d-%m-%Y", "%Y"]:
            try:
                from datetime import datetime
                dt = datetime.strptime(str(date_str)[:10], fmt)
                return dt.year
            except:
                continue
    
    # Fallback: try to extract from title or citation
    title = str(case_data.get("title", ""))
    citation = str(case_data.get("citation", ""))
    
    for text in [title, citation]:
        # Look for 4-digit year
        import re
        years = re.findall(r'\b(20\d{2})\b', text)
        if years:
            return int(years[0])
    
    return 0  # Unknown year

def save_case_as_markdown(case: Dict, output_dir: str):
    """Save a case as a Markdown file with YAML frontmatter."""
    ensure_dir(output_dir)
    
    # Generate filename
    title_slug = case['title'].lower().replace(' ', '_').replace('/', '_')[:50]
    filename = f"{title_slug}_{case['year']}.md"
    filepath = os.path.join(output_dir, filename)
    
    # Create YAML frontmatter
    frontmatter = f"""---
title: {case['title']}
date: {case['date']}
court: {case['court']}
citation: {case['citation']}
year: {case['year']}
source: NyayaRAG Dataset
type: Supreme Court Judgment
---

"""
    
    # Write file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(frontmatter)
        f.write(case['text'])
    
    return filepath

async def main():
    print("🚀 NyayaRAG Bulk Ingestion Pipeline")
    print("=" * 60)
    print(f"📅 Target Years: {TARGET_YEARS[0]}-{TARGET_YEARS[-1]}")
    print(f"📊 Max Cases/Year: {MAX_CASES_PER_YEAR}")
    print("=" * 60)
    
    ensure_dir(OUTPUT_DIR)
    
    # Download and filter dataset
    cases_by_year = download_and_filter_dataset()
    
    if not cases_by_year or sum(len(cases) for cases in cases_by_year.values()) == 0:
        print("\n❌ No cases downloaded. Exiting.")
        return
    
    total_cases = 0
    
    # Save cases year by year
    for year in TARGET_YEARS:
        cases = cases_by_year.get(year, [])
        
        if not cases:
            continue
        
        # Save as Markdown files
        print(f"\n💾 Saving {len(cases)} cases for {year}...")
        year_dir = os.path.join(OUTPUT_DIR, str(year))
        
        for case in tqdm(cases, desc=f"Saving {year}"):
            save_case_as_markdown(case, year_dir)
        
        total_cases += len(cases)
        print(f"✅ Saved {len(cases)} cases for {year}")
    
    print("\n" + "=" * 60)
    print(f"✨ Download Complete!")
    print(f"📊 Total Cases Downloaded: {total_cases}")
    print(f"📁 Saved to: {OUTPUT_DIR}")
    print("\n🔄 Next Step: Run ingestion script")
    print(f"   python scripts/ingest_documents.py")

if __name__ == "__main__":
    asyncio.run(main())
