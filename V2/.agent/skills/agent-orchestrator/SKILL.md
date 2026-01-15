---
name: agent-orchestrator
description: The master coordination skill for classifying legal intent, routing to specialized agents, and synthesizing multi-agent responses.
---

# Agent Orchestrator Skill

This is the central "brain" skill of the NyayaFlow system, responsible for understanding the user's intent and managing the workflow between multiple specialists.

## Core Capabilities

### 1. Intent Classification
- Analyzes natural language queries to determine the underlying legal intent (e.g., Research vs. Drafting vs. Analysis).
- Detects the user's persona (`advocate` vs. `founder`) to tailor the workflow.

### 2. Multi-Agent Dispatch
- Dynamically activates one or more specialized agents (Statute Expert, Case Analyzer, etc.) depending on the query complexity.
- Manages "Mixed Intent" queries by coordinating parallel requests to different specialists.

### 3. Response Synthesis
- Combines raw data from multiple agents into a single, cohesive, and human-readable response.
- Ensures cross-agent consistency (e.g., making sure the statutory explanation matches the procedural advice).

### 4. Safety & Routing Guardrails
- Implements the "Sprint 4" safety layer: classifies queries into High/Medium/Low risk and injecting jurisdiction-appropriate warnings.
- Forces "Lawyer Handoff" triggers for high-risk legal topics.

## When to Use
- This skill is always-on in the NyayaFlow backend.
- It is the primary skill for handling the initial reception of any user query.

## How to Use
1. **Classify**: Assign the query to one of the 8+ defined `Intent` categories.
2. **Dispatch**: Send the query to the primary Agent (and secondary agents if mixed).
3. **Synthesize**: Merge results, apply the Safety Badge, and return a structured JSON response.
