import kagglehub
import shutil
import os
import glob

def import_dataset():
    print("⬇️ Downloading 'Laws and Acts of India' dataset from Kaggle...")
    # Download latest version
    path = kagglehub.dataset_download("kausthubkannan/laws-and-acts-of-india")
    
    print(f"✅ Downloaded to cache: {path}")
    
    # Target directory
    target_dir = "./data"
    os.makedirs(target_dir, exist_ok=True)
    
    # Move files
    # We'll look for common text formats. The structure is unknown yet.
    files = []
    for ext in ["*.txt", "*.md", "*.csv", "*.pdf"]:
        files.extend(glob.glob(os.path.join(path, ext)))
        files.extend(glob.glob(os.path.join(path, "**", ext), recursive=True))
    
    # Deduplicate
    files = list(set(files))
        
    print(f"📂 Found {len(files)} potential data files.")
    
    for file in files:
        # Avoid overwriting existing files with same name by prepending a prefix if needed
        # But for now let's just copy.
        filename = os.path.basename(file)
        dest = os.path.join(target_dir, f"imported_{filename}")
        print(f"🚚 Moving {filename} to {target_dir}...")
        shutil.copy2(file, dest)
        
    print("✨ Import complete. Ready for ingestion.")

if __name__ == "__main__":
    import_dataset()
