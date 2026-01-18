#!/usr/bin/env python3
"""
Import Indian Penal Code (IPC) Sections Dataset from Kaggle
Dataset: dev523/indian-penal-code-ipc-sections-information
"""

import kagglehub
import shutil
from pathlib import Path

def main():
    print("📥 Downloading IPC Dataset from Kaggle...")
    
    # Download latest version
    path = kagglehub.dataset_download("dev523/indian-penal-code-ipc-sections-information")
    
    print(f"✅ Downloaded to: {path}")
    
    # Move files to data directory
    source_dir = Path(path)
    target_dir = Path(__file__).parent / "data"
    target_dir.mkdir(exist_ok=True)
    
    # Find and copy relevant files (CSV, TXT, MD, JSON)
    extensions = ['.csv', '.txt', '.md', '.json']
    files_found = []
    
    for ext in extensions:
        for file in source_dir.rglob(f'*{ext}'):
            # Create a unique name with 'imported_' prefix
            target_file = target_dir / f"imported_ipc_{file.name}"
            shutil.copy2(file, target_file)
            files_found.append(target_file.name)
            print(f"   📄 Copied: {file.name} -> {target_file.name}")
    
    # Remove duplicates
    files_found = list(set(files_found))
    
    print(f"\n✅ Import Complete! {len(files_found)} file(s) ready for ingestion:")
    for f in files_found:
        print(f"   - {f}")
    
    print("\n🔄 Next Step: Run 'python ingest.py' to index this data into Supabase.")

if __name__ == "__main__":
    main()
