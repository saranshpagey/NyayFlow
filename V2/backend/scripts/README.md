# Backend Scripts

This directory contains utility scripts for the NyayaFlow backend.

## 📂 Directory Structure

- **`/archive`**: Contains one-time data ingestion and scraping scripts (e.g., `import_XX.py`, `scrape_XX.py`). These are kept for reference/reproducibility but are not needed for daily operations.
- **`/tests`**: Contains standalone test and verification scripts (e.g., `test_rag.py`, `verify_XX.py`) used to validate specific subsystems.
- **Root (`.`)**: Contains active operational scripts.

## 🚀 Active Scripts

| Script | Purpose |
|--------|---------|
| `download_nyayarag.py` | Downloads the latest RAG knowledge base. |
| `check_db_health.py` | Diagnostics tool for vector database. |
| `ingest_documents.py` | Main entry point for ingesting user documents. |
| `setup_cache_db.py` | Initializes the SQLite query cache. |
| `list_gemini_models.py` | Helper to list available LLM models. |

## 🛠️ Usage

Run scripts from the `backend/` directory context:

```bash
# Example: Download RAG data
python3 scripts/download_nyayarag.py

# Example: Run a test
python3 scripts/tests/test_ipc_rag.py
```
