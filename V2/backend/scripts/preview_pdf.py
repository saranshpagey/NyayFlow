
from pypdf import PdfReader
import sys

def find_schedule(path):
    try:
        reader = PdfReader(path)
        print(f"Reading {path} detected {len(reader.pages)} pages.")
        
        target_text = "SCHEDULE I"
        
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if target_text in text:
                print(f"FOUND '{target_text}' on page {i}!")
                print(text[:500])
                # Also print surrounding text to ensure it's the header
                break
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    path = "backend/source-documents/statutes/companies_act_2013/companies_act_2013.pdf"
    if len(sys.argv) > 1:
        path = sys.argv[1]
    find_schedule(path)
