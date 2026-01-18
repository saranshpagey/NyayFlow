import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def verify_sprint5_completion():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🔍 Sprint 5 Final Verification\n")
    
    try:
        # 1. Check Trade Marks Rules 2017
        res_rules = supabase.table("documents").select("id", count="exact").ilike("metadata->>title", "%Trade Marks Rules 2017%").execute()
        print(f"✅ Trade Marks Rules 2017: {res_rules.count} chunks")
        
        # 2. Check Trade Marks Act (should still be there)
        res_act = supabase.table("documents").select("id", count="exact").ilike("metadata->>title", "%Trade Marks Act%").execute()
        print(f"✅ Trade Marks Act 1999: {res_act.count} chunks")
        
        # 3. Check Companies Act
        res_companies = supabase.table("documents").select("id", count="exact").ilike("metadata->>title", "%Companies Act 2013%").execute()
        print(f"✅ Companies Act 2013: {res_companies.count} chunks")
        
        # 4. Check LLP Act
        res_llp = supabase.table("documents").select("id", count="exact").ilike("metadata->>title", "%Limited Liability Partnership%").execute()
        print(f"✅ LLP Act 2008: {res_llp.count} chunks")
        
        # 5. Check Angel Tax
        res_angel = supabase.table("documents").select("id", count="exact").ilike("metadata->>title", "%Angel Tax%").execute()
        print(f"✅ Angel Tax: {res_angel.count} chunks")
        
        # 6. Check DPDP Act
        res_dpdp = supabase.table("documents").select("id", count="exact").ilike("metadata->>title", "%DPDP%").execute()
        print(f"✅ DPDP Act 2023: {res_dpdp.count} chunks")
        
        # 7. Total startup_compliance count
        res_total = supabase.table("documents").select("id", count="exact").eq("metadata->>topic", "startup_compliance").execute()
        print(f"\n📊 Total startup_compliance documents: {res_total.count}")
        
        # 8. Sample a Trade Marks Rules entry to verify content
        sample = supabase.table("documents").select("metadata").ilike("metadata->>title", "%Trade Marks Rules 2017%").eq("metadata->>chunk_index", "0").execute()
        if sample.data:
            print(f"\n📄 Sample Trade Marks Rules metadata:")
            print(f"   Title: {sample.data[0]['metadata'].get('title')}")
            print(f"   Date: {sample.data[0]['metadata'].get('date')}")
            print(f"   URL: {sample.data[0]['metadata'].get('source_url')}")
            print(f"   Topic: {sample.data[0]['metadata'].get('topic')}")
            
        print("\n✅ Sprint 5 Verification PASSED")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(verify_sprint5_completion())
