#!/usr/bin/env python3
"""
Case Law Metadata Extractor
Extracts structured metadata from legal judgments using NER and LLM-based analysis.
"""

import re
import json
from typing import Dict, List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()

class CaseLawMetadataExtractor:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0.1,
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
    
    def extract_citation(self, text: str) -> Optional[str]:
        """Extract AIR/SCC citation using regex."""
        # AIR pattern: AIR 2017 SC 4161
        air_pattern = r'AIR\s+(\d{4})\s+(SC|[A-Z]{2,})\s+(\d+)'
        air_match = re.search(air_pattern, text[:1000])
        if air_match:
            return f"AIR {air_match.group(1)} {air_match.group(2)} {air_match.group(3)}"
        
        # SCC pattern: (2017) 10 SCC 1
        scc_pattern = r'\((\d{4})\)\s+(\d+)\s+SCC\s+(\d+)'
        scc_match = re.search(scc_pattern, text[:1000])
        if scc_match:
            return f"({scc_match.group(1)}) {scc_match.group(2)} SCC {scc_match.group(3)}"
        
        return None
    
    def extract_court(self, text: str) -> str:
        """Identify court from text."""
        text_lower = text[:500].lower()
        
        if 'supreme court' in text_lower:
            return "Supreme Court"
        elif 'high court' in text_lower:
            # Try to identify which HC
            for state in ['delhi', 'bombay', 'madras', 'calcutta', 'karnataka', 'kerala']:
                if state in text_lower:
                    return f"{state.title()} High Court"
            return "High Court"
        elif 'district court' in text_lower or 'sessions court' in text_lower:
            return "District Court"
        
        return "Unknown"
    
    def extract_judges(self, text: str) -> List[str]:
        """Extract judge names using LLM."""
        prompt = f"""Extract the names of all judges from this legal judgment header.
Return ONLY a JSON array of judge names, nothing else.
Format: ["Justice Name 1", "Justice Name 2"]

If no judges found, return: []

Text:
{text[:1500]}
"""
        try:
            response = self.llm.invoke(prompt)
            content = response.content.strip()
            
            # Clean markdown code blocks if present
            if content.startswith('```'):
                content = content.split('```')[1]
                if content.startswith('json'):
                    content = content[4:]
            
            judges = json.loads(content)
            return judges if isinstance(judges, list) else []
        except Exception as e:
            print(f"Judge extraction failed: {e}")
            return []
    
    def extract_subject_tags(self, text: str) -> List[str]:
        """Extract subject tags using LLM."""
        prompt = f"""Analyze this legal judgment and assign 3-5 subject tags.

Choose from these categories:
- Constitutional: privacy, fundamental rights, Article 21, Article 14, writ petition
- Criminal: murder, bail, sentencing, IPC, evidence, POCSO
- Corporate: oppression, fraud, director liability, Companies Act, SEBI
- Civil: contract, tort, property, succession, consumer protection
- Tax: income tax, GST, customs, service tax

Return ONLY a JSON array of tags: ["tag1", "tag2", "tag3"]

Text (first 2000 chars):
{text[:2000]}
"""
        try:
            response = self.llm.invoke(prompt)
            content = response.content.strip()
            
            # Clean markdown
            if content.startswith('```'):
                content = content.split('```')[1]
                if content.startswith('json'):
                    content = content[4:]
            
            tags = json.loads(content)
            return tags if isinstance(tags, list) else []
        except Exception as e:
            print(f"Tag extraction failed: {e}")
            return []
    
    def extract_statutes_cited(self, text: str) -> List[str]:
        """Extract statute citations using regex."""
        statutes = []
        
        # IPC/BNS pattern
        ipc_pattern = r'(IPC|BNS)\s+Section\s+(\d+[A-Z]?)'
        for match in re.finditer(ipc_pattern, text[:3000]):
            statutes.append(f"{match.group(1)} Section {match.group(2)}")
        
        # Constitution pattern
        article_pattern = r'Article\s+(\d+[A-Z]?)'
        for match in re.finditer(article_pattern, text[:3000]):
            statutes.append(f"Constitution Article {match.group(1)}")
        
        # Companies Act pattern
        companies_pattern = r'Companies Act.*?Section\s+(\d+)'
        for match in re.finditer(companies_pattern, text[:3000]):
            statutes.append(f"Companies Act Section {match.group(1)}")
        
        return list(set(statutes))[:10]  # Deduplicate and limit
    
    def enhance_metadata(self, case_text: str, existing_metadata: Dict) -> Dict:
        """
        Enhance existing case metadata with extracted information.
        
        Args:
            case_text: Full text of the judgment
            existing_metadata: Current metadata dict
        
        Returns:
            Enhanced metadata dict
        """
        enhanced = existing_metadata.copy()
        
        # Extract new fields
        citation = self.extract_citation(case_text)
        if citation:
            enhanced['citation'] = citation
        
        court = self.extract_court(case_text)
        enhanced['court'] = court
        
        judges = self.extract_judges(case_text)
        if judges:
            enhanced['judges'] = judges
            enhanced['bench_strength'] = len(judges)
        
        tags = self.extract_subject_tags(case_text)
        if tags:
            enhanced['subject_tags'] = tags
        
        statutes = self.extract_statutes_cited(case_text)
        if statutes:
            enhanced['statutes_cited'] = statutes
        
        return enhanced


if __name__ == "__main__":
    # Test with sample case
    extractor = CaseLawMetadataExtractor()
    
    sample_text = """
    IN THE SUPREME COURT OF INDIA
    CIVIL APPELLATE JURISDICTION
    WRIT PETITION (CIVIL) NO. 494 OF 2012
    
    JUSTICE K.S. PUTTASWAMY (RETD.) & ANR. ... Petitioners
    Versus
    UNION OF INDIA & ORS. ... Respondents
    
    BEFORE:
    Hon'ble Chief Justice J.S. Khehar
    Hon'ble Mr. Justice J. Chelameswar
    Hon'ble Mr. Justice S.A. Bobde
    
    JUDGMENT
    
    The question before this Court is whether the right to privacy is a fundamental right
    under Article 21 of the Constitution of India. This bench of nine judges has been
    constituted to reconsider the decisions in M.P. Sharma v. Satish Chandra, AIR 1954 SC 300
    and Kharak Singh v. State of U.P., AIR 1963 SC 1295.
    
    Citation: AIR 2017 SC 4161
    """
    
    metadata = {
        "title": "Justice K.S. Puttaswamy vs Union of India",
        "date": "2017-08-24",
        "source_url": "https://indiankanoon.org/doc/91938676/"
    }
    
    enhanced = extractor.enhance_metadata(sample_text, metadata)
    print(json.dumps(enhanced, indent=2))
