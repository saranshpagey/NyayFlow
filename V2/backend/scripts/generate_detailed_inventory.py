import os
import asyncio
from supabase import create_client
from dotenv import load_dotenv
from collections import defaultdict

load_dotenv()

async def generate_inventory_report():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    supabase = create_client(url, key)

    print("📊 Fetching full metadata for detailed report...")
    
    all_metadata = []
    offset = 0
    limit = 1000
    
    while True:
        try:
            res = supabase.table("documents").select("metadata").range(offset, offset + limit - 1).execute()
            if not res.data:
                break
            all_metadata.extend(res.data)
            offset += limit
            print(f"   Fetched {len(all_metadata)} records...", end='\r')
        except Exception as e:
            print(f"❌ Error: {e}")
            break
            
    print(f"\n✅ Scan Complete. Total Vectors: {len(all_metadata)}")

    # Group by Category
    categories = defaultdict(set)
    
    for item in all_metadata:
        meta = item.get("metadata", {}) or {}
        title = meta.get("title", "Untitled").strip()
        
        # Categorization Logic
        lower_title = title.lower()
        if "vs." in lower_title or " v " in lower_title or "versus" in lower_title or "civil appeal" in lower_title or "criminal appeal" in lower_title:
            categories["Case Law"].add(title)
        elif "constitution" in lower_title or "article" in lower_title:
            categories["Constitution"].add(title)
        elif "act" in lower_title or "code" in lower_title or "bill" in lower_title or "ordinance" in lower_title or "rule" in lower_title or "regulation" in lower_title:
            categories["Statutes & Acts"].add(title)
        elif "section" in lower_title:
            categories["Statutes & Acts"].add(title)
        else:
            categories["Others"].add(title)

    # Generate Markdown Content
    md_lines = []
    md_lines.append(f"# 🗄️ Detailed Database Inventory")
    md_lines.append(f"**Date:** 2026-01-19")
    md_lines.append(f"**Total Unique Documents:** {sum(len(v) for v in categories.values())}")
    md_lines.append(f"**Total Vector Chunks:** {len(all_metadata)}")
    md_lines.append("")
    md_lines.append("---")
    md_lines.append("")
    
    for category in ["Constitution", "Statutes & Acts", "Case Law", "Others"]:
        titles = sorted(list(categories[category]))
        if not titles: continue
        
        md_lines.append(f"## {category} ({len(titles)})")
        if len(titles) > 500:
             md_lines.append(f"*(Showing first 500 of {len(titles)})*")
             titles = titles[:500]
             
        for t in titles:
            md_lines.append(f"- {t}")
        md_lines.append("")
        md_lines.append("---")
        md_lines.append("")

    report_path = "database_content_report.md"
    # Write to local file first, then we can move/read it
    with open(report_path, "w") as f:
        f.write("\n".join(md_lines))
        
    print(f"✨ Report generated at {report_path}")

if __name__ == "__main__":
    asyncio.run(generate_inventory_report())
