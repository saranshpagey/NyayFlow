import re
import json
from typing import List, Dict, Any, Optional

class GlossaryAgent:
    """
    Specialized agent for explaining legal terms and jargon.
    
    Responsibilities:
    1. Define legal terms in plain English.
    2. Provide contextual usage examples.
    3. Cross-reference with related legal concepts.
    """
    
    def __init__(self, llm, rag_engine):
        self.llm = llm
        self.rag_engine = rag_engine
        
    async def define_term(self, query: str, intent_data: Dict, history: Optional[List[dict]], persona: str = "advocate") -> Dict[str, Any]:
        """
        Define a legal term.
        """
        print(f"📖 GlossaryAgent: Defining term in query: {query}")
        
        # 1. Search for term definition in RAG
        search_query = f"Definition and legal context of: {query}"
        rag_results = await self.rag_engine.analyze_query(search_query, history, persona=persona)
        
        rag_context = ""
        if rag_results and len(rag_results) > 0:
            for res in rag_results:
                rag_context += res.get("content", "") + "\n"
        
        # 2. Construct the glossary prompt
        glossary_prompt = f"""You are a Legal Lexicographer and Expert in Legal Terminology.

USER REQUEST: "{query}"

LEGAL CONTEXT (Retrieved):
{rag_context if rag_context else "Standard legal definitions apply."}

TASK:
Provide a clear definition of the requested legal term.
1. TERM: The term being defined.
2. DEFINITION: Clear, concise explanation in plain English.
3. CONTEXT: How this term is typically used in legal practice or a specific example.
4. SIMPLIFIED: For non-lawyers, what is the one-sentence takeaway?

PERSONA-SPECIFIC INSTRUCTIONS:
{"If persona is 'founder', prioritize simplicity, focus on business impact if applicable, and add the mandatory disclaimer: '> [!CAUTION]\\n> **Legal Information Only**: NyayaFlow provides legal information and AI-assisted drafting, NOT legal advice. This summary does not create an attorney-client relationship. Please consult a qualified advocate for your specific case.' at the very end of 'summary'." if persona == "founder" else "Maintain a professional, precise tone with academic legal depth."}

RESPONSE FORMAT (Strict JSON):
{{
    "term": "Term Name",
    "definition": "Full definition...",
    "legal_context": "Example usage...",
    "simplified_meaning": "Bottom-line explanation"
}}

Respond ONLY with valid JSON.
"""

        try:
            print("📖 GlossaryAgent: Generating definition...")
            response = await self.llm.ainvoke(glossary_prompt)
            
            # Extract JSON
            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            if json_match:
                glossary_data = json.loads(json_match.group(0))
                
                return {
                    "success": True,
                    "intent": intent_data,
                    "agent_used": "glossary_agent",
                    "results": [{
                        "id": "glossary_definition",
                        "title": f"Legal Definition: {glossary_data.get('term')}",
                        "court": "Legal Dictionary",
                        "date": "2024",
                        "citation": "Lexical Analysis",
                        "status": "glossary",
                        "summary": f"Detailed definition and legal context for **{glossary_data.get('term')}**:",
                        "thinking": f"Produced definition and context for {glossary_data.get('term')}",
                        "widget": {
                            "type": "glossary",
                            "data": {
                                "term": glossary_data.get("term"),
                                "definition": glossary_data.get("definition"),
                                "context": glossary_data.get("legal_context", "")
                            }
                        }
                    }]
                }
            else:
                 return {
                    "success": True,
                    "intent": intent_data,
                    "agent_used": "glossary_fallback",
                    "results": rag_results
                }
                
        except Exception as e:
            print(f"❌ GlossaryAgent Error: {e}")
            return {
                "success": True,
                "intent": intent_data,
                "agent_used": "glossary_fallback_error",
                "results": rag_results
            }
