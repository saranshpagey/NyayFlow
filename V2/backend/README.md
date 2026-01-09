# NyayaFlow AI Backend

**Multi-Agent Legal Intelligence System**

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Server                          │
│                      (server.py)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Legal Agent Orchestrator                       │
│             (agents/orchestrator.py)                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Intent Classification Engine                        │  │
│  │  • Research  • Draft  • Analyze  • Explain          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Agent Router                                        │  │
│  │  Selects appropriate agent(s) based on intent       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │Research│  │ Draft  │  │Analyze │
    │ Agent  │  │ Agent  │  │ Agent  │
    └───┬────┘  └────────┘  └────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│                    RAG Engine                               │
│                  (rag_engine.py)                            │
│                                                             │
│  • Semantic Cache (Supabase)                               │
│  • Vector Search (ChromaDB)                                │
│  • Gemini 2.0 Flash LLM                                    │
│  • Smart Web Scraping                                      │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file:

```env
GOOGLE_API_KEY=your_google_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Start Server

```bash
# Option 1: Using the startup script (recommended)
./start.sh

# Option 2: Direct Python
python3 server.py
```

Server will start on `http://localhost:8000`

## 📡 API Endpoints

### Core Endpoints

#### `POST /api/research`
Main research endpoint with intelligent routing.

**Request:**
```json
{
  "query": "What is Section 420 IPC?",
  "session_id": "user_123",
  "history": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ],
  "use_orchestrator": true
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "rag_main",
      "title": "AI Legal Analysis",
      "summary": "Section 420 of the Indian Penal Code...",
      "thinking": "Step-by-step reasoning...",
      "widget": {
        "type": "statute",
        "data": {...}
      }
    }
  ],
  "metadata": {
    "intent": {
      "primary_intent": "research",
      "complexity": "simple"
    },
    "agent_used": "research_agent",
    "orchestrated": true
  }
}
```

#### `POST /api/draft/generate`
Generate legal documents.

**Request:**
```json
{
  "query": "Draft a Vakalatnama for Bombay High Court",
  "session_id": "user_123",
  "history": []
}
```

#### `POST /api/draft/polish`
Refine existing drafts.

**Request:**
```json
{
  "content": "Original draft text...",
  "instructions": "Make it more formal and add citations"
}
```

#### `GET /api/agents/status`
Get status of all agents.

**Response:**
```json
{
  "orchestrator_active": true,
  "rag_engine_active": true,
  "available_agents": [
    "research_agent",
    "draft_agent",
    "case_analyzer",
    "statute_expert",
    "procedure_guide"
  ],
  "version": "2.0.0"
}
```

### Utility Endpoints

- `GET /health` - Health check
- `GET /api/test/orchestrator` - Test orchestrator functionality

## 🧠 Agent System

### Intent Classification

The orchestrator automatically classifies queries into:

- **Research**: Finding case law, precedents, legal principles
- **Draft**: Creating legal documents (notices, petitions, etc.)
- **Analyze**: Analyzing specific cases or situations
- **Explain**: Explaining legal concepts or procedures
- **Procedure**: Step-by-step guidance for legal processes
- **Mixed**: Multiple intents in one query

### Agent Routing

Based on intent, the orchestrator routes to:

1. **Research Agent** → RAG Engine → Vector DB + LLM
2. **Draft Agent** → Research + Template Generation
3. **Analysis Agent** → Deep case analysis
4. **Procedure Agent** → Step-by-step guidance

## 🔧 Configuration

### Orchestrator vs Direct RAG

You can toggle between orchestrated (intelligent) and direct RAG mode:

```python
# Orchestrated mode (default)
use_orchestrator=True  # Intent classification + agent routing

# Direct RAG mode
use_orchestrator=False  # Bypass orchestrator, go straight to RAG
```

### Performance Tuning

- **Semantic Cache**: 98% similarity threshold for instant responses
- **Vector Search**: 40% similarity threshold, top 3 results
- **LLM Temperature**: 0.3 for balanced creativity/precision

## 📊 Monitoring

### Logs

The server provides detailed logging:

```
🎯 Orchestrator Mode: Processing query via multi-agent system
🎯 Intent Classification: research (Complexity: simple)
🔍 Activating Research Agent...
📚 RAG Engine Active: True
```

### Health Checks

```bash
curl http://localhost:8000/health
```

## 🛠️ Development

### Adding New Agents

1. Create agent file in `agents/` directory
2. Implement agent logic
3. Register in `orchestrator.py`
4. Add routing logic in `route_query()`

### Testing

```bash
# Test orchestrator
curl http://localhost:8000/api/test/orchestrator

# Test research
curl -X POST http://localhost:8000/api/research \
  -H "Content-Type: application/json" \
  -d '{"query": "What is Section 420 IPC?", "use_orchestrator": true}'
```

## 📝 Notes

- The orchestrator uses Gemini 2.0 Flash for intent classification
- RAG engine has semantic caching for frequently asked questions
- All responses include thinking/reasoning for transparency
- Widget system provides structured data for UI rendering

## 🚨 Troubleshooting

**Port 8000 already in use:**
```bash
./start.sh  # Automatically kills existing processes
```

**Missing environment variables:**
Check `.env` file has all required keys

**Orchestrator not active:**
Verify `GOOGLE_API_KEY` is set correctly

## 📚 Next Steps

1. Implement more specialized agents
2. Add authentication/authorization
3. Implement rate limiting
4. Add request caching
5. Deploy to production

---

**Version**: 2.0.0  
**Last Updated**: 2026-01-07
