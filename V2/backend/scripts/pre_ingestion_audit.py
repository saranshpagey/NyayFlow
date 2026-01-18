#!/usr/bin/env python3
"""
Pre-Ingestion Audit
Compares local source files with database to identify missing documents.
"""

import os
import sys
import yaml

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from rag_engine import rag_engine

def parse_frontmatter(file_path):
    """Extract title from markdown frontmatter."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                metadata = yaml.safe_load(parts[1])
                return metadata.get('title', os.path.basename(file_path))
    except Exception:
        pass
    
    return os.path.basename(file_path)

def check_exists_in_db(title):
    """Check if document exists in Supabase."""
    try:
        res = rag_engine.supabase_client.table("documents").select("id").eq("metadata->>title", title).limit(1).execute()
        return len(res.data) > 0
    except Exception:
        return False

def audit_directory(directory_path, category_name):
    """Audit a directory and report missing documents."""
    if not os.path.exists(directory_path):
        print(f"⚠️  Directory not found: {directory_path}")
        return 0, 0
    
    files = [f for f in os.listdir(directory_path) if f.endswith('.md')]
    total = len(files)
    missing = 0
    
    print(f"\n{'='*60}")
    print(f"📂 {category_name}")
    print(f"   Path: {directory_path}")
    print('='*60)
    print(f"   Total Files: {total}")
    
    missing_files = []
    for filename in files:
        path = os.path.join(directory_path, filename)
        title = parse_frontmatter(path)
        
        if not check_exists_in_db(title):
            missing += 1
            missing_files.append(title)
    
    print(f"   In Database: {total - missing}")
    print(f"   Missing: {missing}")
    
    if missing > 0 and missing <= 10:
        print(f"\n   Missing Documents:")
        for doc in missing_files[:10]:
            print(f"   - {doc}")
    
    return total, missing

if __name__ == "__main__":
    print("🔍 Pre-Ingestion Audit")
    print("   Comparing local files with database...\n")
    
    categories = [
        ("backend/source-documents/constitution", "Constitution of India"),
        ("backend/source-documents/statutes/bns", "Bharatiya Nyaya Sanhita (BNS)"),
        ("backend/source-documents/statutes/ipc", "Indian Penal Code (IPC)"),
        ("backend/source-documents/statutes/crpc", "Code of Criminal Procedure (CrPC)"),
        ("backend/source-documents/statutes/companies_act_2013", "Companies Act, 2013"),
        ("backend/source-documents/statutes/trademarks_act_1999", "Trade Marks Act, 1999"),
        ("backend/source-documents/cases/landmark", "Landmark Cases (Phase 1)"),
    ]
    
    total_files = 0
    total_missing = 0
    
    for path, name in categories:
        t, m = audit_directory(path, name)
        total_files += t
        total_missing += m
    
    print(f"\n{'='*60}")
    print(f"📊 SUMMARY")
    print('='*60)
    print(f"   Total Source Files: {total_files}")
    print(f"   Already in Database: {total_files - total_missing}")
    print(f"   Missing (Need Ingestion): {total_missing}")
    if total_files > 0:
        print(f"   Completion: {((total_files - total_missing) / total_files * 100):.1f}%")
    print('='*60)
    
    if total_missing > 0:
        print(f"\n✅ Recommendation: Run ingestion to add {total_missing} missing documents")
        print(f"   The script will automatically skip {total_files - total_missing} existing documents")
    else:
        print(f"\n✅ Database is fully synced! No ingestion needed.")
