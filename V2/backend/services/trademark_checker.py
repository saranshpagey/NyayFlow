import os
import re
from typing import List, Dict, Any
from supabase.client import create_client
from dotenv import load_dotenv

load_dotenv()

class TrademarkChecker:
    def __init__(self):
        self.supabase_url = os.environ.get("SUPABASE_URL")
        self.supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
        self.supabase = create_client(self.supabase_url, self.supabase_key)
        
        # Simplified Nice Classification Map (S5 MVP)
        self.class_map = {
            "technology": "9", "software": "9", "app": "9", "saas": "9",
            "clothing": "25", "fashion": "25",
            "food": "43", "restaurant": "43", "cafe": "43",
            "education": "41", "training": "41",
            "finance": "36", "fintech": "36", "consulting": "36",
            "healthcare": "44", "medical": "44"
        }
        
    async def check_name_risk(self, name: str, industry: str = "general") -> Dict[str, Any]:
        """
        Perform a semantic and fuzzy search for name conflicts in the ingested Trade Marks data.
        """
        print(f"🛡️ TrademarkChecker: Checking risk for '{name}' in industry '{industry}'")
        
        # 1. Exact Match Search in Metadata
        # (Assuming we tagged ingested TM documents with high-fidelity names in metadata)
        
        # 2. Semantic Search in Vector DB (using search_query)
        from rag_engine import rag_engine
        
        # We search specifically for the name in the documents tagged with topic: startup_compliance
        # or that appear to be TM documents.
        search_results = await rag_engine.analyze_query(
            f"Trademark status and availability for name: {name}", 
            persona="founder",
            match_count=5
        )
        
        # 3. Analyze results to calculate a "Risk Score"
        conflicts = []
        score = 0 # 0 = Safe, 100 = Conflict
        
        if search_results:
            for result in search_results:
                content = result.get("summary", "").lower()
                # Simplified risk heuristic for Sprint 5
                if name.lower() in content:
                    score += 40
                    conflicts.append(result.get("title", "Existing Trademark"))
        
        # Clamp score
        score = min(score, 100)
        
        risk_level = "green"
        if score > 70:
            risk_level = "red"
        elif score > 30:
            risk_level = "yellow"
            
        return {
            "name": name,
            "industry": industry,
            "risk_score": score,
            "risk_level": risk_level,
            "conflicts": list(set(conflicts))[:3],
            "conflicts": list(set(conflicts))[:3],
            "recommendation": self._get_recommendation(risk_level, name, industry)
        }

    def _map_industry_to_class(self, industry: str) -> str:
        words = industry.lower().split()
        for word in words:
            if word in self.class_map:
                return self.class_map[word]
        return "General"

    def _get_recommendation(self, level: str, name: str, industry: str) -> str:
        tm_class = self._map_industry_to_class(industry)
        class_note = f" (likely Class {tm_class})" if tm_class != "General" else ""
        
        if level == "green":
            return f"The name '{name}' appears available for '{industry}'{class_note}. Proceed with deeper MCA search."
        elif level == "yellow":
            return f"Caution: Similar names found. Ensure your brand is distinct in Class {tm_class if tm_class != 'General' else 'relevant classes'}."
        else:
            return f"High Risk: Direct conflicts found. We advise choosing a different name for '{industry}'{class_note} to avoid opposition."

trademark_checker = TrademarkChecker()
