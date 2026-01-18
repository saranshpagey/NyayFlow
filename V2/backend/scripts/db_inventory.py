import os
import asyncio
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

async def inventory_check():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    supabase = create_client(url, key)

    print("📊 Generating Database Inventory...")
    
    # Fetch all metadata
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
            print(f"   Scanned {len(all_metadata)} chunks...", end='\r')
        except Exception:
            break
            
    print(f"\n✅ Scan Complete. Total Chunks: {len(all_metadata)}")

    unique_titles = set()
    categories = {"Cases": 0, "Statutes": 0, "Constitution": 0, "Others": 0}
    
    for item in all_metadata:
        meta = item.get("metadata", {}) or {}
        title = meta.get("title", "Untitled")
        unique_titles.add(title)
        
        # Categorize
        lower_title = title.lower()
        if "vs" in lower_title or "v." in lower_title:
            categories["Cases"] += 1
        elif "act" in lower_title or "code" in lower_title or "section" in lower_title:
            categories["Statutes"] += 1
        elif "constitution" in lower_title:
            categories["Constitution"] += 1
        else:
            categories["Others"] += 1

    print("\n📦 INVENTORY SUMMARY")
    print("===================")
    print(f"Total Unique Documents: {len(unique_titles)}")
    print("-------------------")
    print(f"📚 Case Laws:       {categories['Cases']} chunks")
    print(f"📜 Statutes & Acts: {categories['Statutes']} chunks")
    print(f"🇮🇳 Constitution:    {categories['Constitution']} chunks")
    print("-------------------")
    
    print("\n🔍 SAMPLE DOCUMENTS (First 20):")
    for t in sorted(list(unique_titles))[:20]:
        print(f" - {t}")

if __name__ == "__main__":
    asyncio.run(inventory_check())
