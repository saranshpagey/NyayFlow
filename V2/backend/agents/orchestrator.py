"""
Legal Agent Orchestrator - Multi-Agent Coordination System

This orchestrator routes legal queries to specialized agents and coordinates their responses.
It acts as the "brain" that decides which agents to activate based on the query type.
"""

import os
import re
from typing import List, Dict, Any, Optional
from enum import Enum
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from agents.case_analyzer import CaseAnalyzerAgent
from services.usage_service import usage_service
from agents.statute_expert import StatuteExpertAgent
from agents.procedure_guide import ProcedureGuideAgent
from agents.glossary_agent import GlossaryAgent
from agents.caselaw_agent import CaseLawAgent
from services.trademark_checker import trademark_checker

load_dotenv()


class AgentType(Enum):
    """Types of specialized legal agents."""
    RESEARCHER = "researcher"
    DRAFTER = "drafter"
    CASE_ANALYZER = "case_analyzer"
    STATUTE_EXPERT = "statute_expert"
    PROCEDURE_GUIDE = "procedure_guide"


class Intent(Enum):
    """User query intents."""
    RESEARCH = "research"
    DRAFT = "draft"
    ANALYZE = "analyze"
    EXPLAIN = "explain"
    PROCEDURE = "procedure"
    GLOSSARY = "glossary"
    CASELAW = "caselaw"
    MIXED = "mixed"
    # Founder-specific intents
    FOUNDER_COMPLIANCE = "founder_compliance"
    FOUNDER_HIRING = "founder_hiring"
    FOUNDER_IP = "founder_ip"
    FOUNDER_CONTRACTS = "founder_contracts"
    FOUNDER_INCORPORATION = "founder_incorporation"


class LegalAgentOrchestrator:
    """
    Master orchestrator that routes legal queries to specialized agents.
    
    Architecture:
    1. Intent Classification: Determines what the user wants
    2. Agent Selection: Chooses appropriate agents
    3. Coordination: Manages multi-agent collaboration
    4. Response Synthesis: Combines agent outputs
    """
    
    def __init__(self):
        """Initialize the orchestrator with LLM and agents."""
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        
        if not self.google_api_key:
            print("⚠️ Orchestrator: Missing GOOGLE_API_KEY")
            self.active = False
            return
        
        # Router LLM for intent classification
        self.router_llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0.1,  # Low temp for consistent routing
            google_api_key=self.google_api_key
        )
        
        # Coordinator LLM for synthesis
        self.coordinator_llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0.3,
            google_api_key=self.google_api_key
        )
        
        # Import RAG engine (Lazy import to avoid circular dependency if possible, or just standard import)
        try:
            from rag_engine import rag_engine
            self.rag_engine = rag_engine
        except ImportError:
            # Fallback for direct execution contexts
            import sys
            sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            from rag_engine import rag_engine
            self.rag_engine = rag_engine
            
        # Initialize Specialized Agents
        self.case_analyzer = CaseAnalyzerAgent(self.coordinator_llm, self.rag_engine)
        self.statute_expert = StatuteExpertAgent(self.coordinator_llm, self.rag_engine)
        self.procedure_guide = ProcedureGuideAgent(self.coordinator_llm, self.rag_engine)
        self.glossary_agent = GlossaryAgent(self.coordinator_llm, self.rag_engine)
        self.caselaw_agent = CaseLawAgent(self.coordinator_llm, self.rag_engine)
        
        self.active = True
        print("✅ Legal Agent Orchestrator initialized with Specialized Sub-Agents")
    
    async def classify_intent(self, query: str, history: Optional[List[dict]] = None) -> Dict[str, Any]:
        """
        Classify user intent using Fast Heuristics first, then LLM if ambiguous.
        """
        if not self.active:
            return {"primary_intent": Intent.RESEARCH.value, "complexity": "simple"}

        # --- PHASE 1: FAST HEURISTICS (Sub-millisecond) ---
        query_lower = query.lower()
        
        # PRIORITY 1: Analysis Intent Detection (Win Probability, Case Assessment)
        analysis_keywords = ["analyze", "analysis", "probability", "chances", "likelihood", 
                            "predict", "calculate", "assess", "evaluate", "win rate", 
                            "success rate", "outcome", "odds"]
        has_analysis_intent = any(keyword in query_lower for keyword in analysis_keywords)
        
        if has_analysis_intent:
            print("🚀 Fast Path: ANALYSIS Intent detected via Heuristics (Priority 1)")
            return {
                "primary_intent": Intent.ANALYZE.value,
                "complexity": "moderate",
                "entities": {},
                "strategic_plan": [
                    "Analyzing your situation for legal risks...",
                    "Comparing facts with leading precedents...",
                    "Calculating potential legal outcomes..."
                ]
            }
        
        # PRIORITY 2: Check for complex research keywords
        research_keywords = ["compare", "comparison", "cases", "supreme court", "high court", 
                            "ipc", "sections", "act", "procedure", "filing", "remedies",
                            "versus", "vs", "judgment", "precedent"]
        has_research_intent = any(keyword in query_lower for keyword in research_keywords)
        
        # PRIORITY 3: Draft Detection (only with action verbs, not context words like "notice")
        # Refined: Only trigger if query starts with or contains strong draft action verbs
        draft_action_verbs = ["draft", "write", "prepare", "create", "generate"]
        has_draft_action = any(verb in query_lower for verb in draft_action_verbs)
        
        # Context-sensitive draft keywords (only if action verb present)
        draft_context_words = ["vakalatnama", "petition", "agreement", "contract"]
        has_draft_context = any(word in query_lower for word in draft_context_words)
        
        if has_draft_action and has_research_intent:
            # Complex query: User wants analysis AND a draft
            # Route to RAG which can provide both comprehensive answer + draft widget
            print("🚀 Fast Path: MIXED Intent (Research + Draft) - Routing to RAG for comprehensive response")
            return {
                "primary_intent": Intent.RESEARCH.value,  # RAG handles this better
                "complexity": "complex",
                "entities": {"document_types": [word for word in ["notice", "petition", "agreement", "contract"] if word in query_lower]},
                "strategic_plan": [
                    "Analyzing drafting and research requirements...",
                    "Searching for reference templates and laws...",
                    "Coordinating multi-agent effort for you..."
                ]
            }
        elif has_draft_action or has_draft_context:
            # Simple draft request without research
            print("🚀 Fast Path: Draft Intent detected via Heuristics (Priority 3)")
            return {
                "primary_intent": Intent.DRAFT.value, 
                "complexity": "moderate",
                "entities": {"document_types": [word for word in ["notice", "petition", "agreement", "contract"] if word in query_lower]},
                "strategic_plan": [
                    "Understanding document context...",
                    "Locating the appropriate legal frame...",
                    "Drafting with professional legal terms..."
                ]
            }
        
        # PRIORITY 4: Procedure & Filing Detection
        if any(word in query_lower for word in ["how to file", "procedure", "steps for", "process of", "filing", "checklist", "requirements", "documents needed"]):
             print("🚀 Fast Path: PROCEDURE Intent detected via Heuristics (Priority 4)")
             return {
                 "primary_intent": Intent.PROCEDURE.value, 
                 "complexity": "simple",
                 "strategic_plan": [
                     "Mapping out the exact procedural steps...",
                     "Checking latest filing and document requirements...",
                     "Compiling your step-by-step guide..."
                 ]
             }

        # PRIORITY 5: Glossary/Definition Detection
        if any(word in query_lower for word in ["what does", "define", "meaning of", "explain the term", "legal term"]):
             print("🚀 Fast Path: GLOSSARY Intent detected via Heuristics (Priority 5)")
             return {
                 "primary_intent": Intent.GLOSSARY.value, 
                 "complexity": "simple",
                 "strategic_plan": [
                     "Searching legal dictionary and context...",
                     "Simplifying the term for easy understanding...",
                     "Identifying related legal concepts..."
                 ]
             }

        # PRIORITY 6: CaseLaw Detection
        if any(word in query_lower for word in ["cite", "case of", "judgment", "ruling", "v.", "versus", "precedent"]):
             # Check if it's more research-heavy or specifically for a caselaw card
             if len(query_lower.split()) < 10:
                 print("🚀 Fast Path: CASELAW Intent detected via Heuristics (Priority 6)")
                 return {
                     "primary_intent": Intent.CASELAW.value, 
                     "complexity": "simple",
                     "strategic_plan": [
                         "Locating specific judicial precedents...",
                         "Summarizing the key court holding...",
                         "Cross-linking with related judgments..."
                     ]
                 }
        
        # PRIORITY 7: Founder-Specific Intent Detection
        if not query_lower:
             query_lower = query.lower()

        # Compliance
        compliance_keywords = ["do i need", "am i required", "is it mandatory", "compliance", 
                              "registration", "license", "gst", "tax obligation", "filing requirement"]
        if any(kw in query_lower for kw in compliance_keywords):
            print("🚀 Fast Path: FOUNDER_COMPLIANCE Intent detected")
            return {"primary_intent": Intent.FOUNDER_COMPLIANCE.value, "complexity": "moderate"}
        
        # Hiring & HR
        hiring_keywords = ["hire", "employee", "contractor", "offer letter", "salary", 
                          "termination", "resignation", "first employee", "hr policy"]
        if any(kw in query_lower for kw in hiring_keywords):
            print("🚀 Fast Path: FOUNDER_HIRING Intent detected")
            return {"primary_intent": Intent.FOUNDER_HIRING.value, "complexity": "moderate"}
        
        # Intellectual Property & Name Availability
        ip_keywords = ["trademark", "copyright", "patent", "logo", "brand name", 
                      "intellectual property", "ip protection", "protect my brand",
                      "available", "name conflict", "is the name"]
        if any(kw in query_lower for kw in ip_keywords):
            print("🚀 Fast Path: FOUNDER_IP Intent detected")
            return {"primary_intent": Intent.FOUNDER_IP.value, "complexity": "moderate"}
        
        # Contracts & Agreements
        contract_keywords = ["nda", "non-disclosure", "founder agreement", "partnership agreement",
                            "mou", "terms and conditions", "service agreement"]
        if any(kw in query_lower for kw in contract_keywords):
            print("🚀 Fast Path: FOUNDER_CONTRACTS Intent detected")
            return {"primary_intent": Intent.FOUNDER_CONTRACTS.value, "complexity": "moderate"}
        
        # Incorporation & Company Formation
        incorporation_keywords = ["company", "startup", "llp", "private limited", "pvt ltd",
                                 "incorporation", "register business", "register company", 
                                 "opc", "sole proprietorship", "partnership firm"]
        if any(kw in query_lower for kw in incorporation_keywords):
            print("🚀 Fast Path: FOUNDER_INCORPORATION Intent detected")
            return {"primary_intent": Intent.FOUNDER_INCORPORATION.value, "complexity": "moderate"}

        # --- PHASE 2: LLM CLASSIFICATION (Fallback for complex queries) ---
        # Build context from history
        recent_context = ""
        if history and len(history) > 0:
            recent_context = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history[-3:]])
        
        classification_prompt = f"""You are an intent classifier for a legal AI system.

CONVERSATION HISTORY:
{recent_context if recent_context else "No previous context"}

CURRENT QUERY: "{query}"

Analyze the query and respond in JSON format:
{{
    "primary_intent": "research|draft|analyze|explain|procedure|glossary|caselaw|mixed|founder_compliance|founder_hiring|founder_ip|founder_contracts|founder_incorporation",
    "secondary_intents": ["intent1", "intent2"],
    "entities": {{
        "case_names": ["Case Name v. Case Name"],
        "statutes": ["IPC Section 420", "CrPC Section 154"],
        "document_types": ["Vakalatnama", "Notice", "Petition"],
        "courts": ["Supreme Court", "Bombay High Court"]
    }},
    "complexity": "simple|moderate|complex",
    "reasoning": "Brief explanation of classification",
    "strategic_plan": [
        "Human-sounding step 1 (e.g., 'Looking into the relevant IPC sections...')",
        "Human-sounding step 2 (e.g., 'Analyzing how courts have ruled on this...')",
        "Human-sounding step 3 (e.g., 'Preparing a personalized answer for you...')"
    ]
    ]
}}

PERSONA GUIDANCE:
- If user query is professional, make the plan sound scholarly.
- If user query is a simple question, make the plan sound like a helpful assistant.
- NEVER use tech jargon like 'Vector Search' or 'LLM' in the strategic_plan.

INTENT DEFINITIONS:
- research: Finding case law, precedents, legal principles
- draft: Creating legal documents (notices, petitions, etc.)
- analyze: Analyzing specific user situations, fact patterns, or personal legal problems (e.g., "I was fired", "My neighbor...")
- explain: Explaining general legal concepts, acts, sections, or terms (e.g., "What is bail?", "Explain Section 302")
- procedure: Step-by-step guidance for filing or legal processes
- glossary: Defining specific legal terms or jargon (e.g., "What is sub-judice?")
- caselaw: Finding a specific case by name or citation to understand its holding
- mixed: Multiple intents in one query

EXAMPLES:
Query: "I was fired without notice." -> analyze
Query: "Explain Section 138." -> explain
Query: "How to file FIR?" -> procedure
Query: "Draft a notice." -> draft
Query: "Find cases on murder." -> research

Respond ONLY with valid JSON."""

        try:
            response = await self.router_llm.ainvoke(classification_prompt)
            
            # Log usage for intent classification
            try:
                # Modern LangChain uses usage_metadata attribute
                usage = getattr(response, "usage_metadata", {})
                if not usage:
                    # Fallback to response_metadata if needed
                    usage = response.response_metadata.get("token_usage", {})
                
                await usage_service.log_usage(
                    query_type="orchestration_routing",
                    model="gemini-2.0-flash",
                    input_tokens=usage.get("input_tokens", usage.get("prompt_token_count", 0)),
                    output_tokens=usage.get("output_tokens", usage.get("candidates_token_count", 0))
                )
            except Exception as e:
                print(f"⚠️ Orchestrator usage logging failed: {e}")

            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            
            if json_match:
                import json
                result = json.loads(json_match.group(0))
                print(f"🎯 Intent Classification: {result['primary_intent']} (Complexity: {result['complexity']})")
                return result
            
        except Exception as e:
            print(f"⚠️ Intent classification error: {e}")
        
        # Fallback: simple heuristics
        query_lower = query.lower()
        if any(word in query_lower for word in ["draft", "write", "prepare", "vakalatnama", "notice", "petition"]):
            return {"primary_intent": Intent.DRAFT.value, "complexity": "moderate"}
        elif any(word in query_lower for word in ["analyze", "review", "opinion"]):
            return {"primary_intent": Intent.ANALYZE.value, "complexity": "moderate"}
        elif any(word in query_lower for word in ["procedure", "process", "steps", "how to file"]):
            return {"primary_intent": Intent.PROCEDURE.value, "complexity": "simple"}
        else:
            return {"primary_intent": Intent.RESEARCH.value, "complexity": "simple"}
    
    async def route_query(self, query: str, history: Optional[List[dict]] = None, persona: str = "advocate") -> Dict[str, Any]:
        """
        Main routing function that orchestrates the entire flow.
        
        Flow:
        1. Classify intent
        2. Route to appropriate agents
        3. Coordinate multi-agent responses if needed
        4. Synthesize final response
        """
        if not self.active:
            return {
                "success": False,
                "error": "Orchestrator not active",
                "response": "AI service unavailable"
            }
        
        # Step 1: Classify Intent
        query_lower = query.lower()
        intent_data = await self.classify_intent(query, history)
        primary_intent = intent_data.get("primary_intent", "research")
        
        if primary_intent == Intent.RESEARCH.value:
            # Use existing RAG engine for research
            from rag_engine import rag_engine
            results = await rag_engine.analyze_query(query, history, persona=persona)
            
            response = {
                "success": True,
                "intent": intent_data,
                "agent_used": "research_agent",
                "results": results
            }
            agents_used = ["ResearchAgent"]
            
            # Add AgentStatus widget as a supplementary result
            results.append({
                "id": "agent_status_info",
                "title": "Agent Network Status",
                "widget": {
                    "type": "agent_status",
                    "data": {
                        "agents": [
                            {"id": "research", "name": "Research AI", "status": "success", "message": "Search completed"}
                        ]
                    }
                }
            })
        
        elif primary_intent == Intent.DRAFT.value:
            # Drafting requires both research + generation
            response = await self._handle_draft_request(query, intent_data, history, persona=persona)
            agents_used = ["ResearchAgent", "Drafter"]
            if response.get("success") and response.get("results"):
                response["results"].append({
                    "id": "agent_status_draft",
                    "title": "Agent Status",
                    "widget": {
                        "type": "agent_status",
                        "data": {
                            "agents": [
                                {"id": "research", "name": "Research AI", "status": "success"},
                                {"id": "drafter", "name": "Smart Drafter", "status": "success"}
                            ]
                        }
                    }
                })
        
        elif primary_intent == Intent.ANALYZE.value:
            # Case analysis
            response = await self._handle_analysis_request(query, intent_data, history, persona=persona)
            agents_used = ["CaseAnalyzer"]
            if response.get("success") and response.get("results"):
                response["results"].append({
                    "id": "agent_status_analyze",
                    "title": "Agent Status",
                    "widget": {
                        "type": "agent_status",
                        "data": {"agents": [{"id": "analyzer", "name": "Case Analyzer", "status": "success"}]}
                    }
                })
        
        elif primary_intent == Intent.EXPLAIN.value:
            # Statute/Concept explanation
            response = await self.statute_expert.explain_statute(query, intent_data, history, persona=persona)
            agents_used = ["StatuteExpert"]
            if response.get("success") and response.get("results"):
                response["results"].append({
                    "id": "agent_status_statute",
                    "title": "Agent Status",
                    "widget": {
                        "type": "agent_status",
                        "data": {"agents": [{"id": "statute", "name": "Statute Expert", "status": "success"}]}
                    }
                })
        
        elif primary_intent == Intent.PROCEDURE.value:
            # Procedural guidance
            response = await self.procedure_guide.guide_procedure(query, intent_data, history, persona=persona)
            agents_used = ["ProcedureGuide"]
            if response.get("success") and response.get("results"):
                response["results"].append({
                    "id": "agent_status_procedure",
                    "title": "Agent Status",
                    "widget": {
                        "type": "agent_status",
                        "data": {"agents": [{"id": "procedure", "name": "Procedure Guide", "status": "success"}]}
                    }
                })

        elif primary_intent == Intent.GLOSSARY.value:
            # Legal term definition
            response = await self.glossary_agent.define_term(query, intent_data, history, persona=persona)
            agents_used = ["GlossaryAgent"]
            if response.get("success") and response.get("results"):
                response["results"].append({
                    "id": "agent_status_glossary",
                    "title": "Agent Status",
                    "widget": {
                        "type": "agent_status",
                        "data": {"agents": [{"id": "glossary", "name": "Glossary AI", "status": "success"}]}
                    }
                })
            
        elif primary_intent == Intent.CASELAW.value:
            # Specific case law research
            response = await self.caselaw_agent.research_case(query, intent_data, history, persona=persona)
            agents_used = ["CaseLawAgent"]
            if response.get("success") and response.get("results"):
                response["results"].append({
                    "id": "agent_status_caselaw",
                    "title": "Agent Status",
                    "widget": {
                        "type": "agent_status",
                        "data": {"agents": [{"id": "caselaw", "name": "CaseLaw Researcher", "status": "success"}]}
                    }
                })
        
        elif primary_intent == Intent.MIXED.value:
            # Multi-agent coordination needed
            response = await self._handle_mixed_request(query, intent_data, history, persona=persona)
            agents_used = ["Orchestrator", "MultiAgent"]
            
            if response.get("success") and response.get("results"):
                response["results"].append({
                    "id": "agent_status_info",
                    "title": "Agent Coordination Status",
                    "widget": {
                        "type": "agent_status",
                        "data": {
                            "agents": [
                                {"id": "orchestrator", "name": "Orchestrator", "status": "success"},
                                {"id": "research", "name": "Research AI", "status": "success"},
                                {"id": "drafter", "name": "Smart Drafter", "status": "idle"}
                            ]
                        }
                    }
                })
        
        elif primary_intent == Intent.FOUNDER_IP.value:
            # Special handling for Trademark/Name Risk Checks
            if any(w in query_lower for w in ["available", "conflict", "is the name", "name"]):
                # Extract proposed name (heuristic: last 2-3 words or words in quotes)
                proposed_name = query
                quotes_match = re.search(r'["\'](.*?)["\']', query)
                if quotes_match:
                    proposed_name = quotes_match.group(1)
                
                risk_data = await trademark_checker.check_name_risk(proposed_name)
                
                results = [{
                    "id": "name_risk_check",
                    "title": f"Risk Assessment for '{proposed_name}'",
                    "court": "Trademark Service",
                    "date": "2024",
                    "citation": "Statutory Check",
                    "status": "caution_law" if risk_data["risk_level"] != "green" else "good_law",
                    "summary": risk_data["recommendation"],
                    "thinking": f"Performed fuzzy search across Trade Marks Act and ingested corporate data for '{proposed_name}'.",
                    "widget": {
                        "type": "name_risk",
                        "data": risk_data
                    }
                }]
                response = {
                    "success": True,
                    "intent": intent_data,
                    "agent_used": "trademark_advisor",
                    "results": results
                }
                agents_used = ["TrademarkChecker", "ResearchAgent"]
            else:
                # Regular IP research
                from rag_engine import rag_engine
                results = await rag_engine.analyze_query(query, history, persona="founder")
                response = {
                    "success": True,
                    "intent": intent_data,
                    "agent_used": "founder_ip_advisor",
                    "results": results
                }
                agents_used = ["FounderAdvisor", "ResearchAgent"]
            
            if response.get("success") and response.get("results"):
                response["results"].append({
                    "id": "agent_status_founder",
                    "title": "Agent Status",
                    "widget": {
                        "type": "agent_status",
                        "data": {
                            "agents": [
                                {"id": "founder_advisor", "name": "Founder Advisor", "status": "success"},
                                {"id": "research", "name": "Legal Research", "status": "success"}
                            ]
                        }
                    }
                })
        
        else:
            # Default to research
            from rag_engine import rag_engine
            results = await rag_engine.analyze_query(query, history, persona=persona)
            response = {
                "success": True,
                "intent": intent_data,
                "agent_used": "research_agent",
                "results": results
            }
            agents_used = ["ResearchAgent"]

        # Step 3: Add Metadata for AgentStatusWidget & Sprint 4 Safety Layer
        if response.get("success"):
            safety_data = self._determine_safety_level(primary_intent, query, persona)
            
            response["metadata"] = {
                "agents_used": agents_used,
                "orchestration_mode": primary_intent,
                "strategic_plan": intent_data.get("strategic_plan", []),
                # Sprint 4: Founder Readiness Tags
                "target_persona": persona, 
                "safety_level": safety_data["level"],
                "confidence_score": safety_data["confidence"],
                "jurisdiction_warning": safety_data.get("jurisdiction_warning"),
                "incomplete_reasons": safety_data.get("incomplete_reasons", []),
                "lawyer_questions": safety_data.get("lawyer_questions", []),
                "can_export_brief": safety_data["level"] == "high" # Founder Escalation Trigger
            }
        
        return response
    
    def _determine_safety_level(self, intent: str, query: str, persona: str) -> dict:
        """
        Comprehensive safety analysis for Founder queries.
        Returns dict with: level, confidence, jurisdiction_warning, incomplete_reasons, lawyer_questions
        """
        if persona == "advocate":
            return {
                "level": "low",
                "confidence": 0.95,
                "response_type": "lawyer_grade"
            }

        # Founder Logic - Comprehensive Analysis
        query_lower = query.lower()
        
        safety_data = {
            "level": "low",
            "confidence": 0.8,
            "response_type": "founder_grade",
            "incomplete_reasons": [],
            "lawyer_questions": []
        }
        
        # High Risk Triggers
        criminal_keywords = ["bail", "arrest", "jail", "police", "fir", "criminal", "custody", "imprisonment", "chargesheet"]
        if any(w in query_lower for w in criminal_keywords):
            safety_data["level"] = "high"
            safety_data["confidence"] = 0.6  # Low confidence for criminal matters
            safety_data["incomplete_reasons"].append("Criminal law requires case-specific legal defense strategy")
            safety_data["lawyer_questions"] = [
                "What are the exact charges filed against you?",
                "Have you been formally arrested or just summoned?",
                "Do you have any prior criminal record?",
                "What evidence does the prosecution have?"
            ]
        
        if intent in [Intent.CASELAW.value, Intent.ANALYZE.value]:
            safety_data["level"] = "high"
            safety_data["confidence"] = 0.5  # Case law interpretation is complex
            safety_data["incomplete_reasons"].append("Legal precedents require professional interpretation for your specific facts")
            safety_data["response_type"] = "mixed"  # Needs both explanation and lawyer review

        # Medium Risk Triggers
        if intent in [Intent.FOUNDER_CONTRACTS.value, Intent.FOUNDER_COMPLIANCE.value, Intent.DRAFT.value]:
            safety_data["level"] = "medium"
            safety_data["confidence"] = 0.75
            safety_data["incomplete_reasons"].append("Compliance rules vary by state and industry sector")
            safety_data["lawyer_questions"] = [
                "Which state is your business registered in?",
                "What is your industry/sector?",
                "What is your annual turnover?"
            ]
        
        # Jurisdiction Detection
        state_keywords = ["maharashtra", "delhi", "karnataka", "tamil nadu", "gujarat", "west bengal", "rajasthan", "punjab"]
        if any(state in query_lower for state in state_keywords):
            safety_data["jurisdiction_warning"] = "This query mentions state-specific law. Rules may differ from central legislation."
            safety_data["confidence"] = max(0.6, safety_data["confidence"] - 0.1)  # Reduce confidence
        
        # Detect if query is about multiple topics (Mixed)
        topic_count = sum([
            any(w in query_lower for w in ["company", "incorporation"]),
            any(w in query_lower for w in ["tax", "gst", "income tax"]),
            any(w in query_lower for w in ["trademark", "copyright", "patent"]),
            any(w in query_lower for w in ["employee", "hire", "termination"])
        ])
        
        if topic_count > 1:
            safety_data["response_type"] = "mixed"
            safety_data["incomplete_reasons"].append("Your query covers multiple legal domains - each may need separate expert review")
        
        return safety_data

    async def _handle_draft_request(self, query: str, intent_data: Dict, history: Optional[List[dict]], persona: str = "advocate") -> Dict[str, Any]:
        """Handle document drafting requests."""
        print("📝 Activating Draft Agent...")
        
        # Extract document type
        doc_types = intent_data.get("entities", {}).get("document_types", [])
        doc_type = doc_types[0] if doc_types else "legal document"
        
        
        # First, do research if needed (Decoupled retrieval for cost optimization)
        from rag_engine import rag_engine
        research_context, retrieved_sources = await rag_engine.get_retrieved_context(
            f"Legal requirements and format for {doc_type} in India",
            history,
            persona=persona
        )
        
        persona_instructions = ""
        if persona == "founder":
            persona_instructions = """
            FOUNDER MODE SPECIAL INSTRUCTIONS:
            1. The 'label' for each variable MUST be a clear, simple question.
               - BAD: 'Employee Name'
               - GOOD: 'What is the full name of the employee?'
            2. Add a 'help_text' field to variables to explain complex terms simply.
            3. If this document involves equity, co-founder rights, or high liability, set "consult_lawyer": true in the root JSON.
            """
        
        # Then generate the draft
        draft_prompt = f"""You are an expert legal drafter specializing in Indian law.

TASK: Generata a structured draft template for a {doc_type}.

USER REQUEST: "{query}"

LEGAL RESEARCH CONTEXT:
{research_context if research_context else 'No specific precedents found'}

INSTRUCTIONS:
1. Create a COMPLETE draft template using Jinja2-style placeholders: {{variable_name}}
2. Identify all variables that need user input
3. Suggest sensible defaults where applicable
{persona_instructions}

Respond in JSON format:
{{
    "draft_title": "Title of Document",
    "consult_lawyer": false,
    "template_content": "Full formatted draft text with {{placeholders}}...",
    "variables": [
        {{
            "name": "variable_name",
            "label": "Human Readable Label (or Question)",
            "help_text": "Optional explanation for non-lawyers",
            "type": "text|number|date|textarea",
            "required": true|false,
            "placeholder": "Example value",
            "defaultValue": "Pre-filled value from context (if any)"
        }}
    ],
    "document_type": "{doc_type}"
}}"""

        try:
            response = await self.coordinator_llm.ainvoke(draft_prompt)
            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            
            if json_match:
                import json
                draft_data = json.loads(json_match.group(0))
                
                return {
                    "success": True,
                    "intent": intent_data,
                    "agent_used": "draft_agent",
                    "results": [{
                        "id": "draft_output",
                        "title": draft_data.get("draft_title", doc_type),
                        "court": "Draft Generator",
                        "date": "2024",
                        "citation": "Generated",
                        "status": "draft",
                        "summary": f"✅ Draft template created: {draft_data.get('draft_title', doc_type)}",
                        "thinking": f"Structured legal format for {draft_data.get('draft_title', doc_type)} prepared",
                        "widget": {
                            "type": "draft",
                            "data": {
                                "template": draft_data.get("template_content", ""),
                                "variables": draft_data.get("variables", []),
                                "documentType": draft_data.get("document_type", doc_type),
                                "consult_lawyer": draft_data.get("consult_lawyer", False)
                            }
                        }
                    }]
                }
        except Exception as e:
            print(f"❌ Draft generation error: {e}")
        
        # Fallback to standard research if generation fails
        from rag_engine import rag_engine
        research_results = await rag_engine.analyze_query(query, history, persona=persona)
        return {
            "success": True,
            "intent": intent_data,
            "agent_used": "research_agent_fallback",
            "results": research_results
        }
    
    async def _handle_analysis_request(self, query: str, intent_data: Dict, history: Optional[List[dict]], persona: str = "advocate") -> Dict[str, Any]:
        """Handle case/situation analysis requests using CaseAnalyzerAgent."""
        print(f"🔍 Activating Case Analyzer Agent (Persona: {persona})...")
        
        return await self.case_analyzer.analyze(query, intent_data, history, persona=persona)
    
    
    async def _handle_mixed_request(self, query: str, intent_data: Dict, history: Optional[List[dict]], persona: str = "advocate") -> Dict[str, Any]:
        """Handle queries requiring multiple agents."""
        print(f"🤝 Multi-Agent Coordination Mode (Persona: {persona})...")
        
        # For now, delegate to RAG which handles mixed intents well
        from rag_engine import rag_engine
        # Multi-agent coordination often needs rich context first
        from rag_engine import rag_engine
        research_context, retrieved_sources = await rag_engine.get_retrieved_context(query, history, persona=persona)
        
        # Then delegate to RAG for full answer generation (using the context)
        # Note: analyze_query already does retrieval, so this is just a context check
        results = await rag_engine.analyze_query(query, history, persona=persona)
        
        return {
            "success": True,
            "intent": intent_data,
            "agent_used": "multi_agent",
            "results": results
        }


# Singleton instance
orchestrator = LegalAgentOrchestrator()
