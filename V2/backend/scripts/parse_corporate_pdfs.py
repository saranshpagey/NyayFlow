
import os
import re
import sys
import json
from pypdf import PdfReader

def clean_text(text):
    # Remove page break markers from our preview script if any (though reading directly from PDF)
    # Remove obvious headers/footers like "--- PAGE X ---"
    text = re.sub(r'\n---\s*PAGE\s*\d+\s*---\n', '\n', text)
    # Remove standalone page numbers
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
    pattern = r'\n\s*(\d+[A-Z]?)\.\s+'
    
    parts = re.split(pattern, full_text)
    count = 0
    
    # Track highest section seen to detect resets (Schedules)
    highest_sec = 0
    
    for i in range(1, len(parts), 2):
        sec_num_str = parts[i]
        content = parts[i+1]
        
        # Parse numeric part
        match = re.match(r'(\d+)', sec_num_str)
        if match:
            sec_num = int(match.group(1))
            
            # STOP CONDITIONS
            # 1. Exceeds max sections known for Act
            if sec_num > max_sections:
                print(f"🛑 Reached Section {sec_num} (> {max_sections}). Stopping parsing (likely Schedules).")
                break
                
            # 2. Section resets to 1 (or small number) after we've seen significantly higher numbers
            # (e.g. Schedule 1 starting with "1. ")
            if sec_num < 10 and highest_sec > 50:
                 print(f"🛑 Section number reset to {sec_num} after {highest_sec}. Stopping parsing (likely Schedules).")
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
    
    # Companies Act (Max 470)
    ca_pdf = f"{base_dir}/companies_act_2013/companies_act_2013.pdf"
    ca_out = f"{base_dir}/companies_act_2013"
    if os.path.exists(ca_pdf):
        parse_pdf(ca_pdf, ca_out, "Companies Act, 2013", "2013", 470)
        
    # Trade Marks Act (Max 159)
    tm_pdf = f"{base_dir}/trademarks_act_1999/trademarks_act_1999.pdf"
    tm_out = f"{base_dir}/trademarks_act_1999"
    if os.path.exists(tm_pdf):
        parse_pdf(tm_pdf, tm_out, "Trade Marks Act, 1999", "1999", 159)
