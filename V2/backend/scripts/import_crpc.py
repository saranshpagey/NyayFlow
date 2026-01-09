import kagglehub
import shutil
import os
import glob

def import_dataset():
    print("⬇️ Downloading CrPC dataset from Kaggle...")
    # Download latest version
    path = kagglehub.dataset_download("nandr39/the-code-of-criminal-procedure-dataset-crpc")
    
    print(f"✅ Downloaded to cache: {path}")
    
    # Target directory
    target_dir = "./data"
    os.makedirs(target_dir, exist_ok=True)
    
    # Move files
    files = []
    for ext in ["*.txt", "*.md", "*.csv"]:
        files.extend(glob.glob(os.path.join(path, ext)))
        files.extend(glob.glob(os.path.join(path, "**", ext), recursive=True))
    
    # Deduplicate
    files = list(set(files))
        
    print(f"📂 Found {len(files)} text files.")
    
    for file in files:
        filename = os.path.basename(file)
        dest = os.path.join(target_dir, filename)
        print(f"🚚 Moving {filename} to {target_dir}...")
        shutil.copy2(file, dest)
        
    print("✨ Import complete. Ready for ingestion.")

if __name__ == "__main__":
    import_dataset()
