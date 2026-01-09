import re
import json
from typing import List, Dict, Any, Optional

class CaseLawAgent:
    """
    Specialized agent for researching and summarizing specific case laws and precedents.
    
    Responsibilities:
    1. Retrieve specific case laws by name or citation.
    2. Summarize judicial holdings and reasoning.
    3. Identify the impact of a judgment on current law.
    """
    
    def __init__(self, llm, rag_engine):
        self.llm = llm
        self.rag_engine = rag_engine
        
    async def research_case(self, query: str, intent_data: Dict, history: Optional[List[dict]], persona: str = "advocate") -> Dict[str, Any]:
        """
        Research a specific case law.
        """
        print(f"⚖️ CaseLawAgent: Researching case in query: {query}")
        
        # 1. Search for case law in RAG
        search_query = f"Full judgment and summary of: {query}"
        rag_results = await self.rag_engine.analyze_query(search_query, history, persona=persona)
        
        rag_context = ""
        if rag_results and len(rag_results) > 0:
            for res in rag_results:
                rag_context += res.get("content", "") + "\n"
        
        # 2. Construct the caselaw prompt
        caselaw_prompt = f"""You are a Lead Researcher and Supreme Court Historian.

USER REQUEST: "{query}"

LEGAL CONTEXT (Retrieved):
{rag_context if rag_context else "Standard legal precedents apply."}

TASK:
Research and summarize the requested case law.
1. TITLE: Full name of the case (e.g., [Appellant] v. [Respondent]).
2. CITATION: Professional legal citation (e.g., AIR, SCC, etc.).
3. SUMMARY: Concise summary of the judicial holding and key reasoning.
4. SIGNIFICANCE: Why is this case important in Indian law?

PERSONA-SPECIFIC INSTRUCTIONS:
{"If persona is 'founder', exclude legal jargon, highlight practical business implications, and add the mandatory disclaimer: '> [!CAUTION]\\n> **Legal Information Only**: NyayaFlow provides legal information and AI-assisted drafting, NOT legal advice. This summary does not create an attorney-client relationship. Please consult a qualified advocate for your specific case.' at the very end of 'holding'." if persona == "founder" else "Maintain a professional, scholarly tone with deep judicial analysis."}

RESPONSE FORMAT (Strict JSON):
{{
    "title": "Case Name",
    "citation": "Law Citation",
    "holding": "Key holding/reasoning summary...",
    "significance": "Legal importance..."
}}

Respond ONLY with valid JSON.
"""

        try:
            print("⚖️ CaseLawAgent: Generating case summary...")
            response = await self.llm.ainvoke(caselaw_prompt)
            
            # Extract JSON
            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            if json_match:
                caselaw_data = json.loads(json_match.group(0))
                
                return {
                    "success": True,
                    "intent": intent_data,
                    "agent_used": "caselaw_agent",
                    "results": [{
                        "id": "caselaw_summary",
                        "title": caselaw_data.get("title", "Case Law Summary"),
                        "court": "Judicial Archive",
                        "date": "2024",
                        "citation": caselaw_data.get("citation", "Citation Unavailable"),
                        "status": "caselaw",
                        "summary": f"Judicial holding and legal significance of **{caselaw_data.get('title')}**:",
                        "thinking": f"Retrieved and summarized precedent: {caselaw_data.get('title')}",
                        "widget": {
                            "type": "caselaw",
                            "data": {
                                "title": caselaw_data.get("title"),
                                "citation": caselaw_data.get("citation"),
                                "summary": caselaw_data.get("holding")
                            }
                        }
                    }]
                }
            else:
                 return {
                    "success": True,
                    "intent": intent_data,
                    "agent_used": "caselaw_fallback",
                    "results": rag_results
                }
                
        except Exception as e:
            print(f"⚖️ CaseLawAgent Error: {e}")
            return {
                "success": True,
                "intent": intent_data,
                "agent_used": "caselaw_fallback_error",
                "results": rag_results
            }
