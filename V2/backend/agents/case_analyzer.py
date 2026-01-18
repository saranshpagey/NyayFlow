import re
import json
from typing import List, Dict, Any, Optional
from langchain_core.prompts import ChatPromptTemplate

class CaseAnalyzerAgent:
    """
    Specialized agent for analyzing legal cases and fact patterns.
    
    Responsibilities:
    1. Extract key facts from user queries
    2. Identify applicable laws and statutes
    3. Research relevant precedents via RAG
    4. Predict potential case outcomes
    5. Perform legal issue spotting
    """
    
    def __init__(self, llm, rag_engine):
        self.llm = llm
        self.rag_engine = rag_engine
        
    async def analyze(self, query: str, intent_data: Dict, history: Optional[List[dict]], persona: str = "advocate") -> Dict[str, Any]:
        """
        Analyze a legal situation/case.
        """
        print(f"🔍 CaseAnalyzerAgent: Analyzing query: {query}")
        
        # 1. First, search for relevant precedents using the shared RAG engine
        # We increase match_count to 8 for trend analysis
        search_query = f"Complete judgments and outcomes for: {query}"
        rag_context, retrieved_sources = await self.rag_engine.get_retrieved_context(search_query, history, match_count=8, persona=persona)
        
        # Aggregate multiple precedents for deep analysis
        case_titles = [res.get("title", "Unknown Case") for res in retrieved_sources if res.get("title")]

        # 2. Construct the analysis prompt
        analysis_prompt = f"""You are a Senior Legal Analyst specializing in Indian Law Trend Analysis.

ANALYZE THE FOLLOWING CASE/SITUATION:
User Query: "{query}"

RETRIEVED CASE LAWS & DATA (8 Precedents found):
{rag_context if rag_context else "No specific precedents found in immediate context. Rely on general legal principles."}

TASK:
Provide a statistical and strategic legal analysis.
1. Summary of Facts: Brief facts of the user's situation.
2. High-Level Issues: Key points of law.
3. TREND ANALYSIS: Read the retrieved cases. Note if they were 'Allowed', 'Dismissed', or 'Quashed'.
4. PROBABILITY: Calculate a success percentage based on these 8 precedents.
6. RECOMMENDATION: Specific strategic steps.

PERSONA-SPECIFIC INSTRUCTIONS:
{"If persona is 'founder', exclude legal jargon, provide a 2-sentence summary at the top, and add the mandatory disclaimer: '> [!CAUTION]\\n> **Legal Information Only**: NyayaFlow provides legal information and AI-assisted drafting, NOT legal advice. This summary does not create an attorney-client relationship. Please consult a qualified advocate for your specific case.' at the very end of 'analysis_content'." if persona == "founder" else "Maintain a professional, senior advocate tone with tactical strategy."}

RESPONSE FORMAT (Strict JSON):
{{
    "analysis_title": "Outcome Prediction: [Subject]",
    "facts_summary": "Summary...",
    "legal_issues": ["Issue 1", "Issue 2"],
    "applicable_laws": [
        {{ "law": "Act Name", "section": "Section X", "relevance": "Why it applies" }}
    ],
    "analysis_content": "Detailed trend analysis using **Markdown** formatting. Mention specific cases like 'In [Case Name], the court held...'",
    "outcome_prediction": {{
        "probability": 75,
        "verdict_counts": {{ "allowed": 6, "dismissed": 2 }},
        "leading_precedent": "{case_titles[0] if case_titles else 'None specified'}",
        "confidence": "High",
        "brief_reason": "Courts consistently allow bail in Section 420 cases if X and Y are met."
    }},
    "recommendation": "Strategic advice..."
}}

Respond ONLY with valid JSON.
"""

        try:
            print("🔍 CaseAnalyzerAgent: Generating deep analysis...")
            response = await self.llm.ainvoke(analysis_prompt)
            
            # Extract JSON
            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            if json_match:
                analysis_data = json.loads(json_match.group(0))
                
                # Format the result for the orchestrator
                return {
                    "success": True,
                    "intent": intent_data,
                    "agent_used": "case_analyzer_deep",
                    "results": [{
                        "id": "case_analysis",
                        "title": analysis_data.get("analysis_title", "Outcome Prediction"),
                        "court": "Data Analysis Wing",
                        "date": "2024",
                        "citation": "Statistical Analysis",
                        "status": "analysis",
                        "summary": f"### Statistical Outcome Prediction\nAnalysis based on 8 retrieved precedents for **{analysis_data.get('analysis_title')}**:",
                        "thinking": f"Synthesized 8 precedents. Found {analysis_data.get('outcome_prediction', {}).get('probability')}% success trend.",
                        "widget": {
                            "type": "outcome",
                            "data": analysis_data.get("outcome_prediction", {})
                        }
                    }]
                }
            else:
                # Fallback if parsing fails
                print("⚠️ CaseAnalyzerAgent: Failed to parse JSON response. Falling back to research results.")
                results = await self.rag_engine.analyze_query(query, history, persona=persona)
                return {
                    "success": True,
                    "intent": intent_data,
                    "agent_used": "case_analyzer_fallback",
                    "results": results
                }
                
        except Exception as e:
            # Fallback to standard research on error
            print(f"❌ CaseAnalyzerAgent Error: {e}")
            results = await self.rag_engine.analyze_query(query, history, persona=persona)
            return {
                "success": True,
                "intent": intent_data,
                "agent_used": "case_analyzer_fallback_error",
                "results": results
            }
