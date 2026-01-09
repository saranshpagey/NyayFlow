
import os
import re
import json
from pypdf import PdfReader

# Paths
PDF_PATH = os.path.join(os.path.dirname(__file__), "../source-documents/statutes/bns/250883_english_01042024.pdf")
MAPPING_PATH = os.path.join(os.path.dirname(__file__), "../data/ipc_to_bns.json")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "../source-documents/statutes/bns/sections")

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_mapping():
    try:
        with open(MAPPING_PATH, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️ Warning: Could not load mapping: {e}")
        return {}

def extract_text():
    print(f"📄 Reading PDF: {PDF_PATH}")
    reader = PdfReader(PDF_PATH)
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() + "\n"
    return full_text

def parse_sections(text):
    # Regex to find sections: Number followed by a dot, then text.
    # Usually sections in statutes are formatted as "1. ", "2. ", etc at the start of a paragraph.
    # Note: Some sections might be within chapters.
    
    sections = []
    # This regex looks for something like "\n4.The punishments" or "\n300. Murder"
    # It catches a newline, followed by 1-3 digits, then a dot, then the rest.
    pattern = re.compile(r'\n(\d+)\.(.*?)(?=\n\d+\.|$)', re.DOTALL)
    
    matches = pattern.findall(text)
    for num, content in matches:
        sections.append({
            "section": num.strip(),
            "content": content.strip()
        })
    
    return sections

def main():
    mapping = load_mapping()
    
    # Invert mapping to get BNS -> IPC
    bns_to_ipc = {}
    for ipc, bns_content in mapping.items():
        # Extact BNS section number from content like "1(3) Every person..."
        match = re.match(r'^(\d+)(?:\((\d+)\))?', bns_content.strip())
        if match:
            bns_sec = match.group(1)
            if bns_sec not in bns_to_ipc:
                bns_to_ipc[bns_sec] = []
            if ipc != "REMOVED":
                bns_to_ipc[bns_sec].append(ipc)

    text = extract_text()
    sections = parse_sections(text)
    
    print(f"🔍 Found {len(sections)} sections in PDF.")
    
    for sec in sections:
        sec_num = sec["section"]
        content = sec["content"]
        
        # Get IPC cross-references
        ipc_refs = bns_to_ipc.get(sec_num, [])
        
        # Determine Title (usually first line of content)
        lines = content.split('\n')
        title = lines[0].strip() if lines else f"Section {sec_num}"
        
        # Create Markdown
        filename = f"bns_section_{sec_num}.md"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        frontmatter = f"""---
title: "BNS Section {sec_num}: {title}"
section: "{sec_num}"
act: "Bharatiya Nyaya Sanhita, 2023"
date: "2023-12-25"
effective_date: "2024-07-01"
crossref_ipc: {json.dumps(ipc_refs)}
source_url: "Official PDF"
ingested_type: "statute_section"
---

{content}
"""
        with open(filepath, 'w') as f:
            f.write(frontmatter)
            
    print(f"✅ Extracted {len(sections)} sections to {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
