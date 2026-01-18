import re
import json
from typing import List, Dict, Any, Optional

class StatuteExpertAgent:
    """
    Specialized agent for deep diving into legal statutes and acts.
    
    Responsibilities:
    1. Explain specific sections of acts (IPC, CrPC, etc.)
    2. Provide statutory interpretation
    3. Cross-reference with other relevant laws
    4. Track amendments and recent changes
    5. Simplify complex legal language
    """
    
    def __init__(self, llm, rag_engine):
        self.llm = llm
        self.rag_engine = rag_engine
        
    async def explain_statute(self, query: str, intent_data: Dict, history: Optional[List[dict]], persona: str = "advocate") -> Dict[str, Any]:
        """
        Explain a statute or legal section in detail.
        """
        print(f"📚 StatuteExpertAgent: Explaining query: {query}")
        
        # 1. Retrieve the specific statute text from RAG
        search_query = f"Full text and explanation of statute: {query}"
        rag_results = await self.rag_engine.analyze_query(search_query, history, persona=persona)
        
        rag_context = ""
        if rag_results and len(rag_results) > 0:
            rag_context = rag_results[0].get("content", "")
            if not rag_context:
                 rag_context = rag_results[0].get("summary", "")
        
        # 2. Construct the explanation prompt
        expert_prompt = f"""You are a Legal Scholar and Statute Expert specializing in Indian Law.

USER REQUEST: "{query}"

STATUTORY CONTEXT (Retrieved):
{rag_context if rag_context else "Standard statutory interpretation applies."}

TASK:
Provide a deep-dive explanation of the requested statute/section.
1. SIMPLIFY: Explain the core meaning in plain English.
2. TEXT: Provide the key legal text (if available or known).
3. KEY ELEMENTS: Break down the ingredients of the section.
4. PENALTY/REMEDY: What is the punishment or liability?
5. EXCEPTIONS: Any critical exceptions or provisos.
6. TRANSITION (CRITICAL): If this is an IPC section, mention its BNS 2023 equivalent. If this is a BNS section, mention its old IPC equivalent.
7. CROSS-LINK: Related sections in other acts (e.g., if IPC, link to CrPC/Evidence Act).

PERSONA-SPECIFIC INSTRUCTIONS:
{"If persona is 'founder', exclude legal jargon, provide a 'What this means for your business' section in 'full_explanation', and add the mandatory disclaimer: '> [!CAUTION]\\n> **Legal Information Only**: NyayaFlow provides legal information and AI-assisted drafting, NOT legal advice. This summary does not create an attorney-client relationship. Please consult a qualified advocate for your specific case.' at the very end of 'full_explanation'." if persona == "founder" else "Maintain a professional, scholarly tone with deep statutory interpretation."}

RESPONSE FORMAT (Strict JSON):
{{
    "title": "Section X, Act Name",
    "simplified_meaning": "Simple explanation...",
    "legal_text_snippet": "Key legal text...",
    "key_elements": ["Element 1", "Element 2"],
    "consequences": {{
        "penalty": "X years / Fine",
        "nature": "Cognizable/Bailable etc."
    }},
    "cross_references": ["Section Y of Act Z"],
    "full_explanation": "Detailed paragraph..."
}}

Respond ONLY with valid JSON.
"""

        try:
            print("📚 StatuteExpertAgent: Generating explanation...")
            response = await self.llm.ainvoke(expert_prompt)
            
            # Extract JSON
            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            if json_match:
                statute_data = json.loads(json_match.group(0))
                
                # Detect if user is asking specifically for penalty information
                query_lower = query.lower()
                is_penalty_query = any(keyword in query_lower for keyword in ['penalty', 'punishment', 'fine', 'imprisonment', 'jail', 'sentence'])
                
                # Choose widget type based on query intent
                if is_penalty_query and statute_data.get("consequences"):
                    widget_type = "penalty"
                    widget_data = {
                        "offense": statute_data.get("title", "Offense"),
                        "fine": statute_data.get("consequences", {}).get("penalty", "").split('/')[1].strip() if '/' in statute_data.get("consequences", {}).get("penalty", "") else "Not specified",
                        "imprisonment": statute_data.get("consequences", {}).get("penalty", "").split('/')[0].strip() if '/' in statute_data.get("consequences", {}).get("penalty", "") else statute_data.get("consequences", {}).get("penalty", "")
                    }
                else:
                    widget_type = "statute"
                    # Try to extract cross-reference if mentioned in text
                    cross_ref = ""
                    if statute_data.get("cross_references"):
                        cross_ref = statute_data.get("cross_references")[0]
                    elif "BNS" in statute_data.get("full_explanation", "") or "IPC" in statute_data.get("full_explanation", ""):
                         # Heuristic: try to find section mentions
                         match = re.search(r'(?:BNS|IPC)\s+(?:Section|Sec\.?|§)?\s*(\d+[A-Z]?)', statute_data.get("full_explanation", ""), re.I)
                         if match:
                             cross_ref = match.group(0)

                    widget_data = {
                        "title": statute_data.get("title"),
                        "section": re.search(r'Section\s*(\d+[A-Z]?)', statute_data.get("title", ""), re.I).group(1) if re.search(r'Section\s*(\d+[A-Z]?)', statute_data.get("title", ""), re.I) else "",
                        "text": statute_data.get("legal_text_snippet", ""),
                        "explanation": statute_data.get("simplified_meaning", ""),
                        "penalty": statute_data.get("consequences", {}).get("penalty", ""),
                        "cross_reference": cross_ref
                    }
                
                return {
                    "success": True,
                    "intent": intent_data,
                    "agent_used": "statute_expert",
                    "results": [{
                        "id": "statute_explanation",
                        "title": statute_data.get("title", "Statute Explanation"),
                        "court": "Legal Scholar",
                        "date": "2024",
                        "citation": "Statutory Analysis",
                        "status": "statute",
                        "summary": f"Below is the legal breakdown and interpretation of **{statute_data.get('title', 'requested section')}**.",
                        "thinking": f"Explained {statute_data.get('title')} with simplified meaning and consequences",
                        "widget": {
                            "type": widget_type,
                            "data": widget_data
                        }
                    }]
                }
            else:
                 return {
                    "success": True,
                    "intent": intent_data,
                    "agent_used": "statute_expert_fallback",
                    "results": rag_results
                }
                
        except Exception as e:
            print(f"❌ StatuteExpertAgent Error: {e}")
            return {
                "success": True,
                "intent": intent_data,
                "agent_used": "statute_expert_fallback_error",
                "results": rag_results
            }
