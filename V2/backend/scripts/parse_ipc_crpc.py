
import os
import re
from pypdf import PdfReader

def clean_text(text):
    # Remove page numbers
    text = re.sub(r'\n\s*\d+\s*\n', '\n', text)
    return text

def parse_pdf(pdf_path, output_dir, act_name, act_year, max_sections):
    print(f"📄 Parsing {act_name} from {pdf_path}...")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    reader = PdfReader(pdf_path)
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() + "\n"
        
    # Standardize line endings
    full_text = full_text.replace('\r\n', '\n')
    
    # Split by Section Pattern: "\n123. Title" or "\n123A. Title"
    # IPC/CrPC use same pattern as Companies Act
    pattern = r'\n\s*(\d+[A-Z]?)\.\s+'
    
    parts = re.split(pattern, full_text)
    count = 0
    
    # Track highest section seen to detect resets
    highest_sec = 0
    
    for i in range(1, len(parts), 2):
        sec_num_str = parts[i]
        content = parts[i+1]
        
        # Parse numeric part
        match = re.match(r'(\d+)', sec_num_str)
        if match:
            sec_num = int(match.group(1))
            
            # STOP CONDITIONS
            if sec_num > max_sections:
                print(f"🛑 Reached Section {sec_num} (> {max_sections}). Stopping parsing.")
                break
                
            if sec_num < 10 and highest_sec > 50:
                 print(f"🛑 Section number reset to {sec_num} after {highest_sec}. Stopping parsing.")
                 break
                 
            if sec_num > highest_sec:
                highest_sec = sec_num
        
        # Extract title: content usually starts with title ending in ".—" or newline
        title_match = re.search(r'^(.*?)\.?—', content, re.DOTALL)
        if title_match:
            title = title_match.group(1).strip()
        else:
            lines = content.strip().split('\n')
            title = lines[0].strip() if lines else "Unknown Title"
            
        title = title.replace('\n', ' ').strip()
        full_content = f"{sec_num_str}. {content.strip()}"
        
        # Clean filename for IPC/CrPC (use descriptive names if possible)
        filename = f"section_{sec_num_str}.md"
        filepath = os.path.join(output_dir, filename)
        
        frontmatter = f"""---
title: "{act_name} Section {sec_num_str}: {title}"
section: "{sec_num_str}"
act: "{act_name}"
date: "{act_year}"
source_url: "Official PDF"
ingested_type: "statute_section"
---

{full_content}
"""
        with open(filepath, 'w') as f:
            f.write(frontmatter)
        count += 1
        
    print(f"✅ Parsed {count} sections to {output_dir}")

if __name__ == "__main__":
    # Define paths
    base_dir = "backend/source-documents/statutes"
    
    # IPC (Max 511 sections)
    ipc_pdf = f"{base_dir}/ipc/ipc_1860.pdf"
    ipc_out = f"{base_dir}/ipc"
    if os.path.exists(ipc_pdf):
        parse_pdf(ipc_pdf, ipc_out, "Indian Penal Code, 1860", "1860", 511)
        
    # CrPC (Max 484 sections)
    crpc_pdf = f"{base_dir}/crpc/crpc_1973.pdf"
    crpc_out = f"{base_dir}/crpc"
    if os.path.exists(crpc_pdf):
        parse_pdf(crpc_pdf, crpc_out, "Code of Criminal Procedure, 1973", "1973", 484)
