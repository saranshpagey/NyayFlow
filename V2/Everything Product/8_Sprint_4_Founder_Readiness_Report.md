# Sprint 4 Report: Founder Readiness & Safety Layer

**Date:** January 2026
**Status:** In Progress (60% Complete)
**Focus:** Expanding NyayaFlow from a pure "Lawyer Tool" to a "Dual-Persona Platform".

---

## 🎯 The Strategic Pivot

### Why "Founder Mode"?
While Advocates remain our primary power users, early-stage founders represent a massive, underserved market. They need legal *outcomes* (contracts, compliance), not legal *research*.

**The Problem:**
- Founders act as their own "General Counsel" until Series A.
- Existing tools (Google/ChatGPT) are dangerous—giving "plausible but wrong" advice.
- Lawyers are too expensive (₹15,000+ per consultation).

**The Solution:**
**NyayaFlow Founder Mode**—a safety-first, plain-English legal co-pilot that knows when to say "stop".

---

## 🛡️ Key Deliverables (Sprint 4)

### 1. The Safety Boundary Layer
We built a "Guardrail System" directly into the Agent Orchestrator. It's not just a UI change; it's a fundamental architectural routing decision.

| Risk Level | Trigger Keywords | System Action | UI Badge |
| :--- | :--- | :--- | :--- |
| **High** | `Arrest`, `Bail`, `FIR`, `Custody` | Force "Consult Lawyer" disclaimer | 🛑 Red |
| **Medium** | `Contract`, `Compliance`, `Audit` | Add "General Guidance" warning | ⚠️ Yellow |
| **Low** | `Glossary`, `Process`, `Info` | Standard AI response | (None) |

### 2. Dual-Persona Architecture
The system now maintains two distinct "Brain States" based on who is logged in:

**Advocate Persona:**
- **Tone**: Professional, Latin maxims allowed (*prima facie*, *res judicata*).
- **RAG**: Prioritizes Case Law and High Court Judgments.
- **Output**: Detailed legal arguments and citations.

**Founder Persona:**
- **Tone**: "Explain Like I'm 5". No jargon.
- **RAG**: Prioritizes Acts, Rules, and FAQs. **Suppresses complex Case Law.**
- **Output**: Bottom Line, Action Checklist, Risk Level.

### 3. Startup Toolkit Integration
We integrated specific workflows for high-frequency founder needs:
- **Co-Founder Agreements**: Equity split logic.
- **IP Protection**: Trademark class search (Sprint 5).
- **Hiring**: Offer letters vs Employment Contracts.

---

## 🏗️ Technical Implementation

### Metadata Tagging
Every response from the backend now carries a `metadata` payload:
```json
{
  "target_persona": "founder",
  "safety_level": "high",
  "orchestration_mode": "analyze"
}
```
The Frontend uses this to render the appropriate **Safety Badge** component dynamically.

### RAG Optimization (In Progress)
We are modifying the Vector Search engine to apply a "Persona Filter" *before* context generation.
- If `persona == founder`: Exclude `source_type: judgment` unless it's a Supreme Court landmark.
- This prevents the AI from confusing a founder with conflicting High Court rulings.

---

## 🔮 What's Next? (Sprint 5 & 6)

1.  **Founder Correctness (Sprint 5)**:
    - Ingesting the entire **Companies Act 2013** and **Startup India** policies into the semantic cache.
    - Building the **Name Risk Checker** (exact + fuzzy match).

2.  **Scale Readiness (Sprint 6)**:
    - Implementing **Query Caps** (3 free queries/day for guests).
    - Setting up **Stripe Integration** for "Founder Pro" plans.

---

## 📝 Conclusion
Sprint 4 bridges the gap between "Safe" and "Useful". We are not dumbing down the law; we are *translating* it. This opens up a serviceable addressable market (SAM) of 50M+ Indian MSMEs without alienating our core Advocate user base.
