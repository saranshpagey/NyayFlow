---
name: entity-extractor
description: Real-time identification and extraction of legal entities (Statutes, Courts, Dates, Monetary Amounts) from raw conversation text.
---

# Entity Extractor Skill

This skill allows the agent to parse unstructured text and extract specific legal data points required for pre-filling documents and enhancing search precision.

## Core Capabilities

### 1. Legal NER (Named Entity Recognition)
- Identifies specific legal entities like `COURT`, `STATUTE`, `PRECEDENT`, and `SECTION`.
- Distinguishes between parties (e.g., `PETITIONER` vs `RESPONDENT`).

### 2. Temporal & Financial Extraction
- Extracts dates, deadlines, and time periods mentioned in legal disputes.
- Identifies monetary amounts, compensation claims, and fine values.

### 3. Template Pre-Filling
- Maps extracted entities to the `template_data` required for the `SmartDrafter`.
- Reduces user friction by "memorizing" names and amounts from the chat history.

## When to Use
- When the user starts a drafting session.
- When the AI needs to categorize segments of a query for the RAG engine.

## How to Use
1. **Analyze Text**: Run the query through the `en_legal_ner_trf` transformer model.
2. **Cluster**: Group identified entities by category.
3. **Dispatch**: Inyect these entities into the metadata of the `ResearchResponse`.
