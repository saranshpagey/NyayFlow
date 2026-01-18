import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client
from collections import Counter

load_dotenv()

async def final_verification():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🔍 Final Verification Scan...")
    
    try:
        # Check for Companies Act
        res_companies = supabase.table("documents").select("id, metadata").ilike("metadata->>title", "%Companies Act 2013%").eq("metadata->>chunk_index", "0").execute()
        print(f"\n📄 Companies Act 2013 (chunk_index 0): {len(res_companies.data)} entries")
        for doc in res_companies.data:
            print(f"   - ID: {doc['id'][:20]}... | Date: {doc['metadata'].get('date')} | URL: {doc['metadata'].get('source_url')[:50]}...")
        
        # Check for LLP Act
        res_llp = supabase.table("documents").select("id, metadata").ilike("metadata->>title", "%Limited Liability Partnership%").eq("metadata->>chunk_index", "0").execute()
        print(f"\n📄 LLP Act 2008 (chunk_index 0): {len(res_llp.data)} entries")
        for doc in res_llp.data:
            print(f"   - ID: {doc['id'][:20]}... | Date: {doc['metadata'].get('date')} | URL: {doc['metadata'].get('source_url')[:50]}...")
        
        # Check for Trade Marks Act (full document, not sections)
        res_tm = supabase.table("documents").select("id, metadata").ilike("metadata->>title", "%Trade Marks Act%").eq("metadata->>chunk_index", "0").not_.eq("metadata->>section", "").execute()
        print(f"\n📄 Trade Marks Act 1999 (full doc, chunk_index 0): {len(res_tm.data)} entries")
        
        # Check for Angel Tax
        res_angel = supabase.table("documents").select("id, metadata").ilike("metadata->>title", "%Angel Tax%").eq("metadata->>chunk_index", "0").execute()
        print(f"\n📄 Angel Tax (chunk_index 0): {len(res_angel.data)} entries")
        for doc in res_angel.data:
            print(f"   - ID: {doc['id'][:20]}... | Date: {doc['metadata'].get('date')} | URL: {doc['metadata'].get('source_url')[:50]}...")
        
        # Check for DPDP Act
        res_dpdp = supabase.table("documents").select("id, metadata").ilike("metadata->>title", "%DPDP%").execute()
        print(f"\n📄 DPDP Act 2023: {len(res_dpdp.data)} total entries")
        
        # Summary
        print("\n" + "="*60)
        print("CLEANUP VERIFICATION SUMMARY")
        print("="*60)
        
        issues = []
        if len(res_companies.data) > 1:
            issues.append(f"Companies Act has {len(res_companies.data)} duplicate entries")
        if len(res_llp.data) > 1:
            issues.append(f"LLP Act has {len(res_llp.data)} duplicate entries")
        if len(res_angel.data) > 1:
            issues.append(f"Angel Tax has {len(res_angel.data)} duplicate entries")
            
        if issues:
            print("⚠️  ISSUES FOUND:")
            for issue in issues:
                print(f"   - {issue}")
        else:
            print("✅ Database is CLEAN - No duplicates detected!")
            
        # Total startup_compliance count
        res_total = supabase.table("documents").select("id", count="exact").eq("metadata->>topic", "startup_compliance").execute()
        print(f"\n📊 Total startup_compliance documents: {res_total.count}")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(final_verification())
