
from pypdf import PdfReader
import sys

def preview_pdf(path, start_page=20, num_pages=3):
    try:
        reader = PdfReader(path)
        print(f"📄 Reading {path}")
        print(f"Total Pages: {len(reader.pages)}\n")
        
        for i in range(start_page, min(start_page + num_pages, len(reader.pages))):
            print(f"\n{'='*60}")
            print(f"PAGE {i}")
            print('='*60)
            text = reader.pages[i].extract_text()
            print(text[:1000])  # First 1000 chars
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("IPC PREVIEW:\n")
    preview_pdf("backend/source-documents/statutes/ipc/ipc_1860.pdf", 20, 2)
    
    print("\n\n" + "="*80 + "\n\n")
    
    print("CrPC PREVIEW:\n")
    preview_pdf("backend/source-documents/statutes/crpc/crpc_1973.pdf", 20, 2)
