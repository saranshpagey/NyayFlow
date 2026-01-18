import os
import re
import json
from agents.entity_extractor import entity_extractor
from services.usage_service import usage_service
from supabase.client import create_client
from typing import List
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from dotenv import load_dotenv
from scraper_service import scraper_service

# Load API keys
load_dotenv()

class LegalRAG:
    def __init__(self):
        self.supabase_url = os.environ.get("SUPABASE_URL")
        self.supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
        self.google_api_key = os.environ.get("GOOGLE_API_KEY")


        if not all([self.supabase_url, self.supabase_key, self.google_api_key]):
            print("⚠️ LegalRAG: Missing environment variables for Gemini LLM!")
            self.active = False
            return

        self.supabase_client = create_client(self.supabase_url, self.supabase_key)
        self.embeddings_model = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=self.google_api_key)
        
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0.3, 
            google_api_key=self.google_api_key
        )
        
        self.active = True

    def extract_citations(self, text: str) -> dict:
        """Extract legal citations from text using regex."""
        citations = {
            "statutes": [],
            "cases": [],
            "articles": []
        }
        
        # Statute Patterns
        ipc_pattern = r"(Section\s+\d+[A-Z]*\s+(?:of\s+the\s+)?(?:IPC|Indian Penal Code))"
        crpc_pattern = r"(Section\s+\d+[A-Z]*\s+(?:of\s+the\s+)?(?:CrPC|Code of Criminal Procedure))"
        act_pattern = r"(Section\s+\d+[A-Z]*\s+(?:of\s+the\s+)?[\w\s]+Act(?:,\s+\d{4})?)"
        
        # Case Law Patterns
        scc_pattern = r"(\(\d{4}\)\s+\d+\s+SCC\s+\d+)"
        air_pattern = r"(AIR\s+\d{4}\s+(?:SC|High Court)\s+\d+)"
        v_pattern = r"([A-Z][\w\s\.]+v\.\s+[A-Z][\w\s\.]+)"
        
        # Constitution
        art_pattern = r"(Article\s+\d+[A-Z]*)"

        citations["statutes"].extend(re.findall(ipc_pattern, text, re.IGNORECASE))
        citations["statutes"].extend(re.findall(crpc_pattern, text, re.IGNORECASE))
        citations["cases"].extend(re.findall(scc_pattern, text))
        citations["cases"].extend(re.findall(air_pattern, text))
        citations["articles"].extend(re.findall(art_pattern, text, re.IGNORECASE))
        
        # Deduplicate
        for k in citations:
            citations[k] = list(set(citations[k]))
            
        return citations

    def _restructure_malformed_response(self, parsed_response: dict) -> dict:
        """
        Attempt to fix AI responses that don't follow the required {thinking, answer, widget} format.
        Handles cases where AI returns custom structures like {introduction, remedies_comparison, draft_legal_notice}.
        """
        # If already correct format, return as-is
        if 'answer' in parsed_response and 'widget' in parsed_response:
             # Check if answer is valid JSON for founder mode (heuristic)
             if isinstance(parsed_response['answer'], str) and parsed_response['answer'].strip().startswith('{') and '"riskLevel"' in parsed_response['answer']:
                 return parsed_response # It's a Founder Mode response, leave it alone
             
             return parsed_response
        
        print("⚠️ Malformed response detected. Attempting to restructure...")
        
        # Detect draft-related keys (in order of priority)
        draft_keys = ['draft_legal_notice', 'legal_notice', 'draft', 'template', 'document']
        found_draft_key = None
        for key in draft_keys:
            if key in parsed_response:
                found_draft_key = key
                break
        
        # Initialize restructured response
        restructured = {
            'thinking': parsed_response.get('thinking', 'Analysis complete'),
            'answer': '',
            'widget': None
        }
        
        # Build answer from all non-draft content
        answer_parts = []
        for key, value in parsed_response.items():
            if key in ['thinking', 'widget']:
                continue
            if key == found_draft_key:
                continue  # Handle draft separately
            
            # Convert key to readable title
            section_title = key.replace('_', ' ').title()
            
            if isinstance(value, str):
                answer_parts.append(f"### {section_title}\n\n{value}")
            elif isinstance(value, dict):
                # Handle nested dictionaries (like remedies_comparison)
                answer_parts.append(f"### {section_title}\n\n")
                for sub_key, sub_value in value.items():
                    sub_title = sub_key.replace('_', ' ').title()
                    if isinstance(sub_value, dict):
                        # Create comparison table or structured content
                        answer_parts.append(f"#### {sub_title}\n\n")
                        if 'description' in sub_value:
                            answer_parts.append(f"{sub_value['description']}\n\n")
                        if 'advantages' in sub_value:
                            answer_parts.append("**Advantages:**\n")
                            for adv in sub_value['advantages']:
                                answer_parts.append(f"- {adv}\n")
                            answer_parts.append("\n")
                        if 'disadvantages' in sub_value:
                            answer_parts.append("**Disadvantages:**\n")
                            for dis in sub_value['disadvantages']:
                                answer_parts.append(f"- {dis}\n")
                            answer_parts.append("\n")
                        if 'filing_procedure' in sub_value:
                            answer_parts.append("**Filing Procedure:**\n")
                            for step in sub_value['filing_procedure']:
                                answer_parts.append(f"- {step}\n")
                            answer_parts.append("\n")
                    else:
                        answer_parts.append(f"**{sub_title}:** {sub_value}\n\n")
            elif isinstance(value, list):
                answer_parts.append(f"### {section_title}\n\n")
                for item in value:
                    if isinstance(item, str):
                        answer_parts.append(f"- {item}\n")
                    else:
                        answer_parts.append(f"- {json.dumps(item)}\n")
                answer_parts.append("\n")
        
        restructured['answer'] = '\n'.join(answer_parts)
        
        # Extract draft widget if found
        if found_draft_key:
            draft_data = parsed_response[found_draft_key]
            print(f"✅ Found draft in key: {found_draft_key}")
            
            # Try to extract template from various possible structures
            template = ''
            if isinstance(draft_data, dict):
                # Try different possible keys for the template content
                template = draft_data.get('body', draft_data.get('content', draft_data.get('template', '')))
                
                # If body is a list, join it
                if isinstance(template, list):
                    template = '\n\n'.join(template)
                
                # Extract document type
                doc_type = draft_data.get('title', draft_data.get('subject', 'Legal Document'))
                
                # Try to extract variables from the template
                variables = []
                if template:
                    # Find all {{variable}} placeholders
                    var_matches = re.findall(r'\{\{(\w+)\}\}', template)
                    for var_name in set(var_matches):
                        variables.append({
                            'name': var_name,
                            'label': var_name.replace('_', ' ').title()
                        })
                
                restructured['widget'] = {
                    'type': 'draft',
                    'data': {
                        'template': template,
                        'documentType': doc_type,
                        'variables': variables
                    }
                }
            elif isinstance(draft_data, str):
                # Draft is just a string
                restructured['widget'] = {
                    'type': 'draft',
                    'data': {
                        'template': draft_data,
                        'documentType': 'Legal Document',
                        'variables': []
                    }
                }
        
        print(f"✅ Restructured response: answer={len(restructured['answer'])} chars, widget={restructured['widget'] is not None}")
        return restructured

    async def get_retrieved_context(self, query: str, history: List[dict] = None, match_count: int = 3, persona: str = "advocate"):
        """Retrieve relevant legal context without generating an answer (Cost Optimized)."""
        if not self.active:
            return "", []

        try:
            # 1. Query Refinement (Only for very long queries)
            search_query = query
            if len(query.split()) > 40:
                print("📝 Long query detected. Refining for search...")
                refine_prompt = f"Summarize the core legal search intent (1-3 keywords) for: {query}"
                refined_res = await self.llm.ainvoke(refine_prompt)
                search_query = refined_res.content.strip()
            elif history and len(query.split()) < 5:
                context_summary = history[-1]['content'][:100]
                search_query = f"{query} {context_summary}"

            # 2. Embedding & Search
            query_embedding = self.embeddings_model.embed_query(search_query)
            
            # Transition detection
            transition_context = ""
            try:
                ipc_match = re.search(r'IPC\s*(?:Section|Sec\.?|§)?\s*(\d+[A-Z]?)', query, re.I)
                bns_match = re.search(r'BNS\s*(?:Section|Sec\.?|§)?\s*(\d+)', query, re.I)
                mapping_path = os.path.join(os.path.dirname(__file__), "data/ipc_to_bns.json")
                if os.path.exists(mapping_path):
                    with open(mapping_path, 'r') as f:
                        mapping = json.load(f)
                        if ipc_match:
                            ipc_sec = ipc_match.group(1)
                            bns_info = mapping.get(ipc_sec)
                            if bns_info:
                                transition_context = f"\n[TRANSITION NOTE]: IPC Section {ipc_sec} -> BNS Correlation: {bns_info}\n"
                        elif bns_match:
                            bns_sec = bns_match.group(1)
                            for ipc, bns_info in mapping.items():
                                if f"{bns_sec} " in bns_info or bns_info.startswith(f"{bns_sec}("):
                                    transition_context = f"\n[TRANSITION NOTE]: BNS Section {bns_sec} -> IPC Section {ipc}. Context: {bns_info}\n"
                                    break
            except: pass

            res = self.supabase_client.rpc(
                "match_documents",
                {
                    "query_embedding": query_embedding,
                    "match_threshold": 0.4, 
                    "match_count": match_count
                }
            ).execute()
            
            processed_contents = []
            retrieved_sources = []
            if transition_context:
                processed_contents.append(transition_context)
                retrieved_sources.append({"title": "Transition Note", "citation": "BNS-IPC Map", "type": "Statute"})
            
            if res.data:
                for d in res.data:
                    content = d.get('content', '')
                    meta = d.get('metadata', {})
                    source_info = {
                        "title": meta.get('title', 'Legal Document'),
                        "citation": meta.get('citation', 'N/A'),
                        "type": meta.get('type', 'Unknown'),
                        "url": meta.get('url') or meta.get('file_path')
                    }
                    retrieved_sources.append(source_info)
                    processed_contents.append(f"Source ({source_info['citation']}):\n{content}")
            
            context_text = "\n\n".join(processed_contents)
            if len(context_text.split()) > 3000:
                context_text = " ".join(context_text.split()[:3000])
                
            return context_text if context_text else "No direct case law found.", retrieved_sources

        except Exception as e:
            print(f"⚠️ Context retrieval error: {e}")
            return "", []

    async def analyze_query(self, query: str, history: List[dict] = None, match_count: int = 3, persona: str = "advocate"):
        """Perform RAG: Retrieve and generate DECISIVE human-like answers."""
        if not self.active:
            return []

        try:
            # 1. Semantic Cache Check
            search_query = query
            query_embedding = self.embeddings_model.embed_query(search_query)
            
            cache_res = self.supabase_client.rpc("match_cache", {
                "query_embedding": query_embedding,
                "match_threshold": 0.98, 
                "match_count": 1,
            }).execute()

            if cache_res.data:
                cached_item = cache_res.data[0]
                # Log cache hit (0 cost but tracked operation)
                await usage_service.log_usage(
                    query_type="cache_hit",
                    model="cache",
                    input_tokens=0,
                    output_tokens=0
                )

                return [{
                    "id": "cache_hit",
                    "title": "Optimized Legal Insight",
                    "court": "NyayaFlow Memory",
                    "date": "2024",
                    "citation": "N/A",
                    "status": "good_law",
                    "summary": cached_item['response_json'].get("answer"),
                    "thinking": cached_item['response_json'].get("thinking"),
                    "widget": cached_item['response_json'].get("widget"),
                    "entities": []
                }]

            # 2. Optimized Retrieval
            print(f"🔍 Retrieval Phase...")
            context_text, retrieved_sources = await self.get_retrieved_context(query, history, match_count, persona)
            
            # Use original history extraction for prompt
            history_text = "N/A"
            if history:
                history_text = "\n".join([f"{msg['role'].upper()}: {msg['content']}" for msg in history[-5:]])
            
            # 3. Gemini Generation (STRICT DECISIVE MODE)
            
            # --- PERSONA-BASED PROMPT SELECTION ---
            if persona == "founder":
                persona_instructions = """
                CORE PERSONA: 'Founder Mode' Legal Navigator.
                1. **Goal**: Provide STRATEGIC, BUSINESS-FOCUSED intelligence. Founders don't want "case law summaries" - they want exact actionable advice.
                2. **Zero-Jargon Policy**: Explain every legal term in plain English. Use a "What this means" section if complex concepts appear.
                3. **Response Format**: Use clear markdown with these mandatory sections:
                   - **Bottom Line**: A 1-2 sentence executive summary.
                   - **The Analysis**: Comparison tables or structured facts.
                   - **Recommended Action Plan**: Step-by-step next steps for the founder.
                4. **Citations**: Include them subtly. Do NOT focus on procedural history or deep precedents.
                5. **Widget Usage**: For high-impact advice, ALWAYS use the `startup_insight` widget in your JSON response.
                6. **BNS/IPC Transition**: When citing criminal law, prioritize BNS (Bharatiya Nyaya Sanhita) over IPC. If the law has changed, explicitly highlight the BUSINESS IMPACT (e.g., "Penalty increased from 3 to 5 years" or "Now compoundable - you can settle"). Do NOT just mention section number changes.
                """
            else:
                persona_instructions = """
                CORE PERSONA: 'Advocate Mode' Senior Counsel.
                1. **Professional Authority**: Respond as a practicing senior advocate. Direct, precise, authoritative.
                2. **Legal Precision**: Use professional legal terminology (IPC, CrPC, CPC) correctly.
                3. **Strategy Focused**: Provide tactical legal strategy for courtroom or negotiation contexts.
                """

            # --- FEW-SHOT EXAMPLES SELECTION ---
            if persona == "founder":
                examples = """
                EXAMPLE 1 - Founder Comparison Query:
                USER: "What's the difference between LLP and Private Limited?"
                
                ASSISTANT: {
                    "thinking": "User needs comparison between LLP and Pvt Ltd. I'll provide a clear table and recommendation.",
                    "answer": "### LLP vs Private Limited Company\n\nBoth structures offer limited liability, but they differ significantly in compliance, management, and taxation.\n\n### Comparison Table\n\n| Aspect | LLP | Private Limited |\n|---|---|---|\n| **Liability** | Partners have limited liability | Shareholders have limited liability |\n| **Compliance** | Lower compliance requirements | Higher compliance (annual audits, filings) |\n| **Management** | Managed by designated partners | Managed by Board of Directors |\n| **Ownership** | Owned by partners | Owned by shareholders |\n| **Members** | Minimum 2, no maximum | Minimum 2, maximum 200 |\n| **Taxation** | Taxed as partnership firm | Taxed as company |\n| **Transfer** | Requires consent of partners | Restricted by Articles of Association |\n| **Perpetual Succession** | Yes | Yes |\n\n### Key Differences\n\n- **Compliance Burden**: Pvt Ltd has significantly higher compliance requirements including mandatory audits\n- **Management Structure**: LLP is partner-managed, Pvt Ltd has formal Board of Directors\n- **Taxation**: Different tax treatment - LLPs taxed as partnerships, Pvt Ltd as companies\n- **Fundraising**: Pvt Ltd is better for raising venture capital\n\n### Recommendation\n\n**Choose LLP if:**\n- You want lower compliance costs\n- You're a professional services firm (law, accounting, consulting)\n- You don't plan to raise external funding\n\n**Choose Private Limited if:**\n- You plan to raise venture capital or angel investment\n- You want a more formal corporate structure\n- You're building a product/tech startup",
                    "widget": null
                }
                
                EXAMPLE 2 - Founder Compliance Query:
                USER: "What are the rules for issuing shares to founders in a new company?"
                
                ASSISTANT: {
                    "thinking": "User needs info on share issuance under Companies Act. I'll explain Section 42/62 simply and provide an action plan.",
                    "answer": "### Issuing Shares in Your New Company\n\n**Bottom Line**: Shares can be issued during incorporation or later through a 'Rights Issue' or 'Preferential Allotment'. For new startups, issuing 'Equity Shares' is the most common path.\n\n### What this means\nWhen you 'issue shares', you are giving a percentage of ownership in exchange for capital (money) or services (sweat equity). This must be recorded in the Company's 'Register of Members'.\n\n### Key Rules (Section 62, Companies Act)\n- **Rights Issue**: Existing shareholders (including founders) have the first right to buy new shares.\n- **Board Approval**: Any issuance must be approved by the Board of Directors.\n- **ROC Filing**: You must file form **PAS-3** with the Registrar of Companies within 30 days of allotment.\n\n### Recommended Action Plan\n1. **Draft a Board Resolution**: Formally approve the number of shares and price.\n2. **Issue Share Certificates**: Provide physical/digital proof of ownership to each founder.\n3. **Pay Stamp Duty**: Ensure you pay the required stamp duty on share certificates (varies by state).\n4. **File PAS-3**: Submit the allotment details to the MCA portal.",
                    "widget": {
                        "type": "startup_insight",
                        "data": {
                            "summary": "Share issuance requires Board approval, ROC filing (PAS-3), and payment of stamp duty on certificates.",
                            "recommendations": [
                                "Keep a clean 'Register of Members' from Day 1",
                                "Don't skip the PAS-3 filing (30-day deadline)",
                                "Consult a CS for stamp duty calculations"
                            ],
                            "riskLevel": "green"
                        }
                    }
                }
                """
            else:
                examples = """
                EXAMPLE 1 - Pure Research Query:
                USER: "What are the remedies under RERA for delayed possession?"
                
                ASSISTANT: {
                    "thinking": "User needs RERA remedies. I'll provide Section 18 details and filing procedure.",
                    "answer": "### RERA Remedies for Delayed Possession\\n\\nUnder **Section 18** of the Real Estate (Regulation and Development) Act, 2016, homebuyers have the following remedies:\\n\\n1. **Refund with Interest**: Demand full refund of amount paid with interest at prescribed rate\\n2. **Compensation**: Claim compensation for delay\\n3. **Possession with Penalty**: Seek possession with penalty for delay\\n\\n### Filing Procedure\\n\\n1. File complaint with State RERA Authority\\n2. Submit agreement for sale and payment receipts\\n3. Pay prescribed fee\\n4. Attend hearings\\n5. RERA will pass binding order",
                    "widget": {
                        "type": "statute",
                        "data": {
                            "title": "Real Estate (Regulation and Development) Act, 2016",
                            "section": "Section 18",
                            "description": "Rights and duties of allottees - Refund and compensation for delay"
                        }
                    }
                }
                
                EXAMPLE 2 - Pure Drafting Query:
                USER: "Draft a legal notice for builder delay in possession"
                
                ASSISTANT: {
                    "thinking": "User needs a legal notice template. I'll create a comprehensive template with placeholders.",
                    "answer": "I've prepared a **Legal Notice for Delay in Possession** template. The notice demands possession and compensation from the builder. You can customize it using the interactive widget below.\\n\\n### Key Elements Included:\\n- Formal notice format\\n- Reference to agreement details\\n- Delay quantification\\n- Compensation demand\\n- Legal action warning\\n\\nClick '3-Split Studio' below to fill in your specific details.",
                    "widget": {
                        "type": "draft",
                        "data": {
                            "template": "LEGAL NOTICE\\n\\nTo,\\n{{builder_name}}\\n{{builder_address}}\\n\\nDear Sir/Madam,\\n\\nSubject: Legal Notice for Delay in Possession of Flat No. {{flat_number}}\\n\\nUnder instructions from my client {{client_name}}, I serve you with this legal notice:\\n\\n1. My client booked Flat No. {{flat_number}} in your project {{project_name}} vide agreement dated {{agreement_date}}.\\n\\n2. Possession was promised on {{promised_date}}, but has not been delivered despite {{delay_period}} delay.\\n\\n3. This constitutes breach of contract and deficiency in service.\\n\\nDEMAND:\\n1. Hand over possession within {{notice_period}} days\\n2. Pay compensation of Rs. {{compensation_amount}}\\n\\nFailing compliance, legal action will be initiated.\\n\\nYours faithfully,\\n{{advocate_name}}",
                            "documentType": "Legal Notice for Delay in Possession",
                            "variables": [
                                {"name": "builder_name", "label": "Builder/Developer Name"},
                                {"name": "builder_address", "label": "Builder Address"},
                                {"name": "flat_number", "label": "Flat/Unit Number"},
                                {"name": "client_name", "label": "Your Name"},
                                {"name": "project_name", "label": "Project Name"},
                                {"name": "agreement_date", "label": "Agreement Date"},
                                {"name": "promised_date", "label": "Promised Possession Date"},
                                {"name": "delay_period", "label": "Delay Period (e.g., 3 years)"},
                                {"name": "notice_period", "label": "Notice Period (e.g., 15 days)"},
                                {"name": "compensation_amount", "label": "Compensation Amount"},
                                {"name": "advocate_name", "label": "Advocate Name"}
                            ]
                        }
                    }
                }
                
                EXAMPLE 3 - Mixed Analysis + Drafting Query (CRITICAL - THIS IS YOUR CASE):
                USER: "Compare RERA and Consumer Court remedies for builder delay. Draft a legal notice."
                
                ASSISTANT: {
                    "thinking": "User wants BOTH comparison analysis AND a draft. I must provide full comparison in 'answer' and template in 'widget'.",
                    "answer": "### Comparison: RERA vs Consumer Court for Builder Delay\\n\\n| Aspect | RERA | Consumer Court |\\n|---|---|---|\\n| **Speed** | 60-90 days typical | 6-12 months typical |\\n| **Jurisdiction** | Real estate specific | Deficiency in service |\\n| **Compensation** | Refund + interest | Broader damages including mental agony |\\n| **Appeal** | To Appellate Tribunal | To State/National Commission |\\n| **Cost** | Lower fees | Moderate fees |\\n\\n### Recommendation\\n\\n**RERA is preferable** for builder delay cases because:\\n1. Faster resolution (time-bound)\\n2. Specialized expertise in real estate\\n3. Mandatory compliance by builders\\n\\n**Consumer Court is better** if:\\n1. Seeking compensation for mental agony\\n2. Builder is not registered under RERA\\n3. Broader consumer rights violation\\n\\n### Your Legal Notice\\n\\nI've prepared a comprehensive legal notice template below. Use the 3-Split Studio to customize it with your details.",
                    "widget": {
                        "type": "draft",
                        "data": {
                            "template": "LEGAL NOTICE\\n\\nTo,\\n{{builder_name}}\\n{{builder_address}}\\n\\nDear Sir/Madam,\\n\\nSubject: Legal Notice for Delay in Possession - Flat No. {{flat_number}}, {{project_name}}\\n\\nUnder instructions from my client {{client_name}}, residing at {{client_address}}, I serve you with this legal notice:\\n\\n1. My client booked Flat No. {{flat_number}} in {{project_name}} vide Agreement for Sale dated {{agreement_date}}.\\n\\n2. As per Clause {{possession_clause}} of the agreement, possession was to be delivered by {{promised_date}}.\\n\\n3. Despite {{delay_years}} years having elapsed, you have failed to deliver possession.\\n\\n4. This delay constitutes:\\n   - Breach of contract\\n   - Deficiency in service under Consumer Protection Act\\n   - Violation of Section 18, RERA 2016\\n\\n5. My client has suffered financial loss of Rs. {{financial_loss}} and immense mental agony.\\n\\nDEMAND:\\n1. Hand over peaceful possession within {{notice_days}} days\\n2. Pay compensation of Rs. {{compensation}} for delay, loss of rent, and mental harassment\\n\\nFailing compliance, my client will initiate proceedings under RERA/Consumer Protection Act at your cost and risk.\\n\\nYours faithfully,\\n{{advocate_name}}\\n{{advocate_contact}}",
                            "documentType": "Legal Notice for Delay in Possession",
                            "variables": [
                                {"name": "builder_name", "label": "Builder/Developer Name"},
                                {"name": "builder_address", "label": "Builder Complete Address"},
                                {"name": "flat_number", "label": "Flat/Unit Number"},
                                {"name": "project_name", "label": "Project Name"},
                                {"name": "client_name", "label": "Your Full Name"},
                                {"name": "client_address", "label": "Your Address"},
                                {"name": "agreement_date", "label": "Agreement Date"},
                                {"name": "possession_clause", "label": "Possession Clause Number"},
                                {"name": "promised_date", "label": "Promised Possession Date"},
                                {"name": "delay_years", "label": "Delay in Years"},
                                {"name": "financial_loss", "label": "Financial Loss Amount"},
                                {"name": "notice_days", "label": "Notice Period (e.g., 15)"},
                                {"name": "compensation", "label": "Total Compensation Demanded"},
                                {"name": "advocate_name", "label": "Advocate Name"},
                                {"name": "advocate_contact", "label": "Advocate Contact"}
                            ]
                        }
                    }
                }
                """

            prompt = f"""You are 'NyayaFlow AI'.
            {persona_instructions}
            
            FORMATTING RULES (STRICT):
               - NEVER output a "wall of text".
               - Use **Markdown Headers** (###) to separate distinct sections.
               - Use **Bullet Points** (-) for identifying lists/facts.
               - Keep paragraphs SHORT (max 3-4 lines).
               - **Bold** key legal terms or statutes.
               - **Tables (STRICT FORMAT)**:
                 * ALWAYS add a blank line before AND after the table
                 * Separator row must use ONLY 3 dashes per column: |---|---|---|
                 * Keep columns concise - no excessively long cells
                 * Maximum 5 columns per table
            3. **Solve In One Go (STRICT)**: Provide ALL requested research/drafts immediately.
            4. **Drafting Expert**: For drafts (notices, petitions, contracts), always write the FULL content inside the `answer` field and SIMULTANEOUSLY provide a `draft` widget in the `widget` field for the best UI experience.
            5. **Widget Priority**: If the user asks for a specific draft, statute, or procedure, ALWAYS use the corresponding `widget` in your JSON response. For any document request, the `draft` widget is the TOP priority.
            6. **CRITICAL - Comprehensive Responses**: If the user asks for BOTH legal analysis (comparisons, cases, procedures, IPC sections) AND a draft, you MUST provide:
               - Full legal analysis with tables, case laws, and procedures in the `answer` field
               - The draft template in the `widget` field
               - DO NOT just provide a draft widget alone. The `answer` must contain the complete legal strategy, comparison tables, Supreme Court cases, IPC sections, RERA procedures, etc.
               - Example: "Compare RERA, Consumer Protection, and NCLT + draft notice" → `answer` has full comparison table + analysis, `widget` has the draft template
            7. **Widget Selection Guidelines**:
               - Use `glossary` widget when user asks: "What does X mean?", "Define X", "Explain the term X"
               - Use `checklist` widget when user asks: "What documents do I need?", "Requirements for X", "Checklist for X"
               - Use `timeline` widget when user asks: "Timeline for X", "Stages of X", "Process timeline", "Appeals process"
               - Use `procedure` widget for vertical step-by-step instructions
               - Use `draft` widget for any document generation request

            FORMATTING EXAMPLE:
            ### Summary of Facts
            - Point 1...
            - Point 2...

            ### Comparison Table

            | Feature | Option A | Option B |
            |---|---|---|
            | Cost | Low | High |
            | Speed | Fast | Slow |

            ### Legal Analysis
            According to **Section 123**...

            ### Conclusion
            Output...
            
            PREVIOUS CONTEXT: \"\"\"{history_text}\"\"\"
            RETRIEVED INFO: \"\"\"{context_text}\"\"\"
            USER QUERY: \"\"\"{query}\"\"\"
            
            ═══════════════════════════════════════════════════════════════════════════
            ⚠️  CRITICAL: RESPONSE FORMAT REQUIREMENTS (MANDATORY - NO EXCEPTIONS) ⚠️
            ═══════════════════════════════════════════════════════════════════════════
            
            YOU MUST RESPOND WITH EXACTLY THIS JSON STRUCTURE. NO OTHER KEYS ALLOWED:
            
            {{
                "thinking": "Your internal reasoning process (string)",
                "answer": "Full markdown response with ALL analysis, comparisons, tables, cases, procedures (string)",
                "widget": {{
                    "type": "statute|penalty|procedure|glossary|checklist|timeline|draft",
                    "data": {{...}}
                }}
            }}
            
            ═══════════════════════════════════════════════════════════════════════════
            WIDGET DATA SCHEMAS (Use ONLY these exact keys for each type):
            ═══════════════════════════════════════════════════════════════════════════
            
            TYPE: "statute"
            {{
                "title": "Act Name",
                "section": "Section Number",
                "description": "Brief description",
                "cross_reference": "IPC Section Equivalent (if BNS) or BNS Section Equivalent (if IPC)"
            }}
            
            TYPE: "penalty"
            {{
                "offense": "Offense name",
                "fine": "Maximum fine amount",
                "imprisonment": "Duration"
            }}
            
            TYPE: "procedure"
            {{
                "title": "Procedure Name",
                "steps": ["Step 1", "Step 2", "Step 3"]
            }}
            
            TYPE: "glossary" (NEW - For legal term definitions)
            {{
                "term": "Legal Term",
                "definition": "Clear explanation of the term",
                "context": "Example usage in legal context (optional)"
            }}
            
            TYPE: "checklist" (NEW - For document/compliance requirements)
            {{
                "title": "Checklist Title",
                "items": ["Item 1", "Item 2", "Item 3"]
            }}
            
            TYPE: "timeline" (NEW - For horizontal timelines)
            {{
                "title": "Timeline Title",
                "steps": [
                    {{"label": "Stage 1", "subtext": "Duration/Date"}},
                    {{"label": "Stage 2", "subtext": "Duration/Date"}}
                ]
            }}
            
            TYPE: "draft" (MOST IMPORTANT - READ CAREFULLY)
            {{
                "template": "Full draft text with {{placeholder}} syntax for variables",
                "documentType": "Document name (e.g., Legal Notice, Petition, Contract)",
                "variables": [
                    {{"name": "variable_id", "label": "Human Readable Label"}},
                    {{"name": "another_var", "label": "Another Label"}}
                ]
            }}
            
            ═══════════════════════════════════════════════════════════════════════════
            FEW-SHOT EXAMPLES (Study these carefully):
            ═══════════════════════════════════════════════════════════════════════════
            
            {examples}
            
            ═══════════════════════════════════════════════════════════════════════════
            ⛔ FORBIDDEN BEHAVIORS (Will cause system failure):
            ═══════════════════════════════════════════════════════════════════════════
            
            ❌ DO NOT create custom root keys like "introduction", "remedies_comparison", "draft_legal_notice", "conclusion"
            ❌ DO NOT nest the draft inside the "answer" field as a JSON object
            ❌ DO NOT return only a widget without a full "answer" field
            ❌ DO NOT put comparison tables ONLY in widget - they belong in "answer"
            ❌ DO NOT create multiple widgets - only ONE widget per response
            
            ✅ DO put ALL analysis, comparisons, tables, cases, procedures in "answer" as Markdown
            ✅ DO put ONLY the draft template in widget.data.template
            ✅ DO use the EXACT key names specified in the schemas above
            ✅ DO include "thinking", "answer", and "widget" - all three are MANDATORY
            
            NOW RESPOND TO THE USER'S QUERY FOLLOWING THIS FORMAT EXACTLY:
            """

            print("🤖 Generation Phase...")
            response = await self.llm.ainvoke(prompt)
            
            # Log usage for cost tracking
            try:
                # Modern LangChain uses usage_metadata attribute
                usage = getattr(response, "usage_metadata", {})
                if not usage:
                    # Fallback to response_metadata
                    meta = response.response_metadata
                    usage = meta.get("token_usage") or meta.get("usage_metadata") or {}
                
                if usage:
                    await usage_service.log_usage(
                        query_type="research",
                        model="gemini-2.0-flash",
                        input_tokens=usage.get("input_tokens", usage.get("prompt_token_count", 0)),
                        output_tokens=usage.get("output_tokens", usage.get("candidates_token_count", 0))
                    )
            except Exception as usage_err:
                print(f"⚠️ Usage logging failed: {usage_err}")

            raw_content = response.content
            
            # JSON Parsing Logic
            # 1. Try extracting from Markdown block first
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', raw_content, re.DOTALL)
            if not json_match:
                # 2. Try finding correct JSON object
                json_match = re.search(r'\{.*\}', raw_content, re.DOTALL)
            
            parsed_response = {}
            if json_match:
                json_str = json_match.group(1) if json_match.lastindex else json_match.group(0)
                try:
                    parsed_response = json.loads(json_str)
                    
                    # CRITICAL: Restructure malformed responses
                    parsed_response = self._restructure_malformed_response(parsed_response)
                    
                    # Clean up malformed tables
                    if 'answer' in parsed_response:
                        parsed_response['answer'] = self._cleanup_malformed_tables(parsed_response['answer'])

                except json.JSONDecodeError:
                    print(f"❌ JSON Decode Error on: {json_str[:50]}...")
                    parsed_response = {"answer": raw_content, "thinking": "JSON Error", "widget": None}
            else:
                # 3. Fallback: Treat whole content as answer if no JSON found
                print("⚠️ No JSON structure found in response. Treating as raw text.")
                parsed_response = {"answer": raw_content, "thinking": "No structured JSON found", "widget": None}

            # Cache Answer
            if "answer" in parsed_response:
                try:
                    self.supabase_client.table("answer_cache").insert({
                        "query_text": search_query,
                        "query_embedding": query_embedding,
                        "response_json": parsed_response
                    }).execute()
                except: pass

            # Extract Citations from the AI Answer + Retrieved Docs
            extracted_citations = self.extract_citations(parsed_response.get("answer", "") + context_text)
            
            return [{
                "id": "rag_main",
                "title": "AI Legal Analysis",
                "court": "Research Bench",
                "date": "2024",
                "citation": ", ".join(extracted_citations['cases'][:2]) if extracted_citations['cases'] else "Analysis",
                "snippet": context_text[:300] + "...",
                "content": context_text,
                "status": "good_law",
                "summary": parsed_response.get("answer"),
                "thinking": parsed_response.get("thinking"),
                "widget": parsed_response.get("widget"),
                "entities": retrieved_sources, # Populating entities with Source Links
                "extracted_citations": extracted_citations
            }]

        except Exception as e:
            print(f"❌ RAG Master Error: {e}")
            import traceback
            traceback.print_exc()
            try:
                # FALLBACK MODE
                fallback_prompt = f"System delay occurred. Solve this as an AI assistant directly. User: {query}. Respond in JSON with 'thinking', 'answer', 'widget'."
                res = await self.llm.ainvoke(fallback_prompt)
                json_match = re.search(r'\{.*\}', res.content, re.DOTALL)
                if json_match:
                    parsed = json.loads(json_match.group(0))
                    return [{
                        "id": "fallback",
                        "title": "AI Direct Knowledge",
                        "court": "AI Brain",
                        "date": "2024",
                        "citation": "N/A",
                        "status": "distinguished",
                        "snippet": "Database search interrupted. Using training data.",
                        "summary": parsed.get("answer"),
                        "thinking": f"Fallback due to: {str(e)}",
                        "widget": parsed.get("widget"),
                        "entities": []
                    }]
            except: pass

            return [{
                "id": "error",
                "title": "System Latency",
                "court": "System",
                "date": "N/A",
                "citation": "N/A",
                "status": "caution_law",
                "widget": {"type": "summary", "data": {"key_point": "Database Timeout"}},
                "summary": "I apologize, but I encountered a system error. Please try again.",
                "entities": []
            }]

    def _cleanup_malformed_tables(self, text: str) -> str:
        """Fix malformed Markdown tables with excessively long separator rows."""
        if not text or '|' not in text:
            return text
        
        lines = text.split('\n')
        cleaned_lines = []
        
        for line in lines:
            # Check if line looks like a table separator (starts/ends with | and contains mostly dashes)
            if line.strip().startswith('|') and line.strip().endswith('|'):
                # Count the number of pipe characters to determine column count
                pipe_count = line.count('|')
                
                # If the line has way more dashes than pipes, it's likely malformed
                dash_count = line.count('-')
                if dash_count > pipe_count * 10:  # Threshold: more than 10 dashes per column
                    # Rebuild the separator row with just 3 dashes per column
                    num_columns = pipe_count - 1
                    if num_columns > 0:
                        fixed_separator = '|' + '---|' * num_columns
                        cleaned_lines.append(fixed_separator)
                        continue
            
            cleaned_lines.append(line)
        
        return '\n'.join(cleaned_lines)

    async def polish_draft(self, content: str, instructions: str):

        """Refine legal drafts based on user instructions."""
        if not self.active:
            return "AI Service Unavailable"

        prompt = f"""You are an Expert Legal Editor.
        Task: Refine the following legal draft based on the instructions.
        Maintain strict legal precision.
        
        INSTRUCTIONS: {instructions}
        
        DRAFT TO POLISH:
        \"\"\"{content}\"\"\"
        
        Respond ONLY with the polished text. Do not include conversational filler like "Here is the revised draft".
        """
        
        try:
            response = await self.llm.ainvoke(prompt)
            
            # Log usage for drafting polish
            try:
                # Modern LangChain uses usage_metadata attribute
                usage = getattr(response, "usage_metadata", {})
                if not usage:
                    # Fallback to response_metadata if needed
                    usage = response.response_metadata.get("token_usage", {})
                
                await usage_service.log_usage(
                    query_type="draft_polish",
                    model="gemini-2.0-flash",
                    input_tokens=usage.get("input_tokens", usage.get("prompt_token_count", 0)),
                    output_tokens=usage.get("output_tokens", usage.get("candidates_token_count", 0))
                )
            except Exception as e:
                print(f"⚠️ Polish usage logging failed: {e}")

            return response.content.strip()
        except Exception as e:
            print(f"❌ Polish Error: {e}")
            return content # Fallback to original


# Singleton
rag_engine = LegalRAG()
