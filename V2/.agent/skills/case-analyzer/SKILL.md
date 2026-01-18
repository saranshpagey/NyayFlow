---
name: case-analyzer
description: High-level analysis of legal fact patterns, issue spotting, and predicting case outcomes based on statistical judicial trends.
---

# Case Analyzer Skill

This skill allows the agent to process complex legal situations, identify core legal issues, and provide strategic outcome predictions.

## Core Capabilities

### 1. Legal Issue Spotting
- Analyzes raw fact patterns (user stories) to identify which laws and legal principles are triggered.
- Isolates relevant facts from noise to focus on the points of law that will determine the verdict.

### 2. Statistical Outcome Prediction
- Evaluates 8+ historical precedents retrieved via RAG to calculate a success probability.
- Aggregates verdict counts (Allowed/Dismissed/Quashed) to identify judicial trends for a specific topic.

### 3. Strategic Recommendations
- Provides a "Winning Strategy" or "Next Steps" based on the patterns found in successful precedents.
- Warns of common pitfalls that led to dismissals in similar historical cases.

### 4. Fact Pattern Synthesis
- Summarizes the user's situation into a professional "Statement of Facts" suitable for a legal brief.

## When to Use
- When a user describes a situation (e.g., "My landlord is not returning my deposit") and asks for their chances in court.
- When an advocate needs to know the "success rate" of a specific type of petition in a particular jurisdiction.

## How to Use
1. **Fact Extraction**: Isolate the parties, the alleged act, and the current stage of the dispute.
2. **Trend Mapping**: Cross-reference retrieved RAG results for "Verdict: Allowed" vs "Verdict: Dismissed".
3. **Draft Response**: Use the `OutcomeWidget` to display the probability and leading precedent clearly.
