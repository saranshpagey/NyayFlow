import os
import re
import spacy
from supabase.client import create_client
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

        # Initialize NER Model (Local)
        try:
            print("🧠 Loading OpenNyAI Legal NER Model...")
            self.nlp = spacy.load("en_legal_ner_trf")
            print("✅ Legal NER Model Loaded.")
        except Exception as e:
            print(f"❌ Failed to load Legal NER Model: {e}")
            self.nlp = None

        if not all([self.supabase_url, self.supabase_key, self.google_api_key]):
            print("⚠️ LegalRAG: Missing environment variables for Gemini LLM!")
            self.active = False
            return

        self.supabase_client = create_client(self.supabase_url, self.supabase_key)
        self.embeddings_model = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=self.google_api_key)
        
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.3, # Slight increase for more natural creativity
            google_api_key=self.google_api_key
        )
        
        self.active = True

    def extract_entities(self, text: str):
        """Extract legal entities using OpenNyAI model."""
        if not self.nlp:
            return []
        try:
            doc = self.nlp(text)
            return [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
        except Exception as e:
            print(f"⚠️ NER Error: {e}")
            return []

    async def analyze_query(self, query: str):
        """Perform RAG: Retrieve documents and generate human-like answer with Thinking."""
        if not self.active:
            print("⚠️ RAG Engine is not active.")
            return []

        try:
            # 1. Retrieval: Embed query and search Supabase
            print(f"🔍 Searching for: {query}")
            query_embedding = self.embeddings_model.embed_query(query)
            
            res = self.supabase_client.rpc(
                "match_documents",
                {
                    "query_embedding": query_embedding,
                    "match_threshold": 0.3, # Lowered threshold to find more data
                    "match_count": 5,
                }
            ).execute()
            
            docs = res.data
            if not docs:
                print("⚠️ No relevant documents found.")
                return []

            # 2. Preparation: Combine context & Fetch Full Text if URL exists
            # We enable "Smart Fetching" if a result looks like a reference with a URL
            processed_contents = []
            for d in docs:
                content = d.get('content', '')
                url = d.get('metadata', {}).get('url') or (url_match.group(0) if (url_match := re.search(r'https?://[^\s]+', content)) else None)
                
                if url and ("indiankanoon.org" in url or len(content) < 500):
                    print(f"🌐 Smart Fetch triggered for: {url}")
                    full_text = scraper_service.fetch_legal_text(url)
                    if full_text:
                        # Truncate slightly to avoid hitting context limits, though Gemini is huge
                        d['content'] = full_text[:15000] 
                        print(f"✅ Successfully fetched full text ({len(full_text)} chars)")

                processed_contents.append(d['content'])

            context_text = "\n\n".join(processed_contents)
            
            # 3. Gemini Generation (Structured JSON Mode)
            prompt = f"""You are 'NyayaFlow AI', a top-tier legal assistant.
            
            You are 'NyayaFlow AI', a compassionate legal companion. Your purpose is not just to provide laws, but to guide people through the complexity of the legal world with empathy and clarity.
            
            CORE PERSONA:
            1. **Empathy First**: Legal issues are stressful. Before jumping into statutes, acknowledge the user's situation with human-like warmth. Use phrases like "I understand this is a difficult situation" or "It's completely normal to feel worried about this."
            2. **Natural Human Flow**: Avoid robotic numbering or stiff "Model" language. Speak like a supportive friend who happens to be extremely well-versed in Indian law. Use "I", "me", "you", and "we".
            3. **Language & Heart**: Detect the USER's language (English, Hindi, Hinglish) and match the *emotional* frequency. If they sound worried, be soothing. If they are seeking quick info, be efficient but warm.
            4. **Conversational Density**: Break your answer into short, soulful 2-3 sentence paragraphs. Connect ideas organically rather than just listing sections.
            5. **Thinking & Care**: Your 'thinking' process should reflect you considering the human impact, not just the legal logic.

            RETRIEVED CONTEXT FROM LEGAL BRAIN:
            \"\"\"{context_text}\"\"\"

            USER QUERY: \"\"\"{query}\"\"\"

            WIDGET TYPES (Choose the best fit):
            - 'statute': {{ "title": "Section Name", "text": "Original text", "explanation": "Simple summary" }}
            - 'penalty': {{ "crime": "Offense name", "imprisonment": "Duration", "fine": "Amount/Details" }}
            - 'procedure': {{ "title": "Process Name", "steps": ["Step 1", "Step 2", ...] }}
            - 'summary': {{ "key_point": "Impact/Outcome" }}

            RESPONSE FORMAT (Strict JSON only):
            {{
                "thinking": "Your step-by-step reasoning...",
                "answer": "Your human-like, chunked response in the user's language...",
                "widget": {{ "type": "...", "data": {{...}} }}
            }}
            """

            print("🤖 Asking Gemini 2.5 Flash...")
            response = self.llm.invoke(prompt)
            raw_content = response.content
            
            # JSON Parsing with cleanup
            cleaned_content = raw_content.replace('```json', '').replace('```', '').strip()
            
            import json
            try:
                parsed_response = json.loads(cleaned_content)
                ai_answer = parsed_response.get("answer", "Analysis complete.")
                ai_thinking = parsed_response.get("thinking", "Reasoning available.")
                widget_data = parsed_response.get("widget", {"type": "summary", "data": {"key_point": "Legal Insight"}})
            except Exception as e:
                print(f"❌ JSON Parse Failed: {e}")
                ai_answer = raw_content
                ai_thinking = "Could not parse thinking process."
                widget_data = {"type": "summary", "data": {"key_point": "Analysis Summary"}}

            # 4. Format Results with Entities
            results = []
            for i, doc in enumerate(docs):
                doc_entities = self.extract_entities(doc['content'])
                results.append({
                    "id": f"rag_{i}",
                    "title": doc.get("metadata", {}).get("title", f"Source {i+1}"),
                    "court": doc.get("metadata", {}).get("court", "Indian Courts"),
                    "date": doc.get("metadata", {}).get("date", "2024"),
                    "citation": doc.get("metadata", {}).get("citation", "N/A"),
                    "snippet": doc['content'][:300] + "...",
                    "content": doc['content'],
                    "status": "good_law",
                    "summary": ai_answer if i == 0 else "See primary analysis above.",
                    "thinking": ai_thinking if i == 0 else None,
                    "widget": widget_data if i == 0 else None,
                    "entities": doc_entities
                })

            return results

        except Exception as e:
            print(f"❌ RAG Error Detail: {e}")
            return [{
                "id": "fallback",
                "title": "Technical Issue",
                "court": "System",
                "date": "N/A",
                "citation": "N/A",
                "status": "distinguished",
                "snippet": f"An error occurred: {str(e)[:100]}",
                "summary": "I'm having trouble connecting to my legal brain. Please check your internet or try again in a moment.",
                "widget": {
                    "type": "summary",
                    "data": {
                        "key_point": "System Offline"
                    }
                }
            }]

# Singleton instance
rag_engine = LegalRAG()
