import re
import json
from typing import List, Dict, Any, Optional

class ProcedureGuideAgent:
    """
    Specialized agent for legal procedures, filing guides, and court processes.
    
    Responsibilities:
    1. Step-by-step filing procedures (FIR, Bail, Petition, etc.)
    2. Court-specific checklists (Supreme Court vs High Court)
    3. Document requirements
    4. Timeline and fee estimation
    5. Jurisdiction guidance
    """
    
    def __init__(self, llm, rag_engine):
        self.llm = llm
        self.rag_engine = rag_engine
        
    async def guide_procedure(self, query: str, intent_data: Dict, history: Optional[List[dict]], persona: str = "advocate") -> Dict[str, Any]:
        """
        Provide procedural guidance.
        """
        print(f"📋 ProcedureGuideAgent: Guiding query: {query}")
        
        # 1. Retrieve procedural rules from RAG
        search_query = f"Procedure and steps for: {query}"
        rag_results = await self.rag_engine.analyze_query(search_query, history, persona=persona)
        
        rag_context = ""
        if rag_results and len(rag_results) > 0:
            for res in rag_results:
                rag_context += res.get("content", "") + "\n"
        
        # 2. Construct the procedure prompt
        guide_prompt = f"""You are a Court Registrar and Procedure Expert specializing in Indian Legal System.

USER REQUEST: "{query}"

PROCEDURAL RULES (Retrieved):
{rag_context if rag_context else "Standard procedural rules apply."}

TASK:
Provide a clear, step-by-step guide for the requested legal procedure.
1. STEPS: Logical, numbered sequence of actions.
2. DOCUMENTS: Checklist of required papers (ID, Proofs, Affidavits).
3. WHERE TO FILE: Appropriate court/authority (Jurisdiction).
4. COSTS: Estimated court fees (if standard/known).
6. TIMELINE: Approximate time usage.

PERSONA-SPECIFIC INSTRUCTIONS:
{"If persona is 'founder', exclude legal jargon, focus on 'Next Steps' in the 'tips' section, and add the mandatory disclaimer: '> [!CAUTION]\\n> **Legal Information Only**: NyayaFlow provides legal information and AI-assisted drafting, NOT legal advice. This summary does not create an attorney-client relationship. Please consult a qualified advocate for your specific case.' at the very end of 'tips'." if persona == "founder" else "Maintain a professional, registrar-like tone with precise jurisdictional guidance."}

RESPONSE FORMAT (Strict JSON):
{{
    "procedure_name": "Filing Process for X",
    "steps": ["Step 1 description", "Step 2 description", "Step 3..."],
    "jurisdiction": "Court/Police Station details",
    "required_documents": ["Doc 1", "Doc 2", "Doc 3"],
    "estimated_timeline": "X - Y weeks/months",
    "fees": "Approx ₹XXX",
    "tips": "Practical advice for smoother processing"
}}

Respond ONLY with valid JSON.
"""

        try:
            print("📋 ProcedureGuideAgent: Generating guide...")
            response = await self.llm.ainvoke(guide_prompt)
            
            # Extract JSON
            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            if json_match:
                procedure_data = json.loads(json_match.group(0))
                
                # Detect widget type based on query intent
                query_lower = query.lower()
                is_checklist_query = any(keyword in query_lower for keyword in ['documents', 'requirements', 'checklist', 'what do i need', 'papers needed'])
                is_timeline_query = any(keyword in query_lower for keyword in ['timeline', 'stages', 'process timeline', 'how long', 'duration'])
                
                # Format for widget
                steps_formatted = procedure_data.get("steps", [])
                
                # Choose widget type and format data accordingly
                if is_checklist_query and procedure_data.get("required_documents"):
                    widget_type = "checklist"
                    widget_data = {
                        "title": procedure_data.get("procedure_name", "Document Checklist"),
                        "items": procedure_data.get("required_documents", [])
                    }
                    summary_text = f"Here are the mandatory documents and requirements for **{procedure_data.get('procedure_name', 'your request')}**:"
                elif is_timeline_query:
                    widget_type = "timeline"
                    # Convert steps to timeline format
                    timeline_steps = []
                    for i, step in enumerate(steps_formatted):
                        timeline_steps.append({
                            "label": f"Stage {i+1}",
                            "subtext": step[:50] + "..." if len(step) > 50 else step
                        })
                    widget_data = {
                        "title": procedure_data.get("procedure_name", "Process Timeline"),
                        "steps": timeline_steps
                    }
                    summary_text = f"The estimated timeline for this process is **{procedure_data.get('estimated_timeline', 'Varies')}**. Detailed stages are shown below:"
                else:
                    widget_type = "procedure"
                    widget_data = {
                        "title": procedure_data.get("procedure_name"),
                        "steps": steps_formatted,
                        "documents": procedure_data.get("required_documents", []),
                        "timeline": procedure_data.get("estimated_timeline", "")
                    }
                    summary_text = f"I have outlined the step-by-step procedure for **{procedure_data.get('procedure_name', 'your request')}** below:"
                
                procedure_name = procedure_data.get("procedure_name", "Procedural Guide")
                
                return {
                    "success": True,
                    "intent": intent_data,
                    "agent_used": "procedure_guide",
                    "results": [{
                        "id": "procedure_guide",
                        "title": procedure_name,
                        "court": "Procedural Wing",
                        "date": "2024",
                        "citation": "Practice Guidelines",
                        "status": "procedure",
                        "summary": summary_text,
                        "thinking": f"Mapped {len(steps_formatted)} steps for {procedure_name}",
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
                    "agent_used": "procedure_guide_fallback",
                    "results": rag_results
                }
                
        except Exception as e:
            print(f"❌ ProcedureGuideAgent Error: {e}")
            return {
                "success": True,
                "intent": intent_data,
                "agent_used": "procedure_guide_fallback_error",
                "results": rag_results
            }
