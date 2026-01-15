---
name: statute-expert
description: Specialized skill for deep diving into Indian legal statutes, interpreting specific sections (IPC, BNS, CrPC), and tracking statutory transitions.
---

# Statute Expert Skill

This skill provides authoritative interpretation and explanation of specific legal sections within the Indian legal framework.

## Core Capabilities

### 1. Statutory Interpretation
- Explains the core meaning and "ingredients" of a specific section in plain English.
- Identifies the mandatory elements required to constitute an offense or legal right.

### 2. Transition Mapping (IPC ↔ BNS)
- Automatically provides the Bharatiya Nyaya Sanhita (BNS) 2023 equivalent for any legacy Indian Penal Code (IPC) section mentioned.
- Maps old procedures to the new Bharatiya Nagarik Suraksha Sanhita (BNSS).

### 3. Penalty & Remedy Analysis
- Extracts precise details regarding imprisonment terms, fine structures, and the nature of the offense (e.g., Cognizable vs. Non-Bailable).

### 4. Cross-Act Linking
- Connects a section in one act with relevant procedural or evidentiary sections in others (e.g., linking IPC 302 to CrPC 154 for FIR procedures).

## When to Use
- When a user asks "What is Section X of Act Y?"
- When a user query mentions a specific legal section and requires a breakdown of its consequences.
- When comparing the old criminal laws (IPC/CrPC/IEA) with the new 2023 statutes (BNS/BNSS/BSA).

## How to Use
1. **Identify Section**: Extract the specific section number and the Act it belongs to.
2. **Contextualize**: determine if the user is an `advocate` (high technicality) or a `founder` (high simplicity).
3. **Draft Response**: Use the `StatuteWidget` for visual clarity, ensuring the "Simplified Meaning" and "Legal Text" are clearly separated.
