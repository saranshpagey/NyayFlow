# Sprint 5: Founder Correctness & Safety Report

**Status:** Completed ✅
**Date:** January 2026
**Focus:** Data Accuracy, Risk Logic, and Founder-Specific UI

---

## 🎯 Objective
Sprint 5 focused on moving "Founder Mode" from a UI toggle to a **deeply intelligent, data-backed experience**. The goal was to ensure that when a founder asks a question, the answer is not just "simplified" but **legally correct**, based on specific startup statutes, and armed with proactive risk assessment like a human counsel.

---

## 🚀 Key Deliverables

### 1. **Data Ingestion: The Statutory Backbone**
We moved beyond general knowledge to ingest the "Startup Constitution" into our vector database:
*   **Companies Act, 2013**: Full ingestion of critical sections (Incorporation, Share Capital, Directors).
*   **Income Tax Act (Angel Tax)**: Specifically Section 56(2)(viib) and 80-IAC notifications.
*   **DPDP Act 2023**: Digital Personal Data Protection Act basics for tech startups.
*   **Startup India Notifications**: key circulars regarding tax exemptions.

### 2. **Specialized Logic Layer**
*   **Orchestrator Upgrade**: New routing logic detects "Founder Intent" vs "Legal Research Intent".
*   **Trademark "Nice Classification"**: The system now intelligently guesses the Nice Class (e.g., "Software" -> Class 9) to provide more accurate availability checks.
*   **Risk Logic**: Added a "Safety Boundary" that forces a lawyer referral for high-risk queries (e.g., criminal liability, co-founder disputes).

### 3. **New Founder Widgets**
We introduced two powerful new UI components designed for non-lawyers:

#### **A. StartUp Insight Widget**
*   **Purpose**: Provides an executive summary of complex legal situations.
*   **Features**:
    *   **The Bottom Line**: A 1-sentence plain English conclusion.
    *   **Action Plan**: Numbered step-by-step instructions.
    *   **Risk Badge**: Green/Yellow/Red indicator.
    *   **Feedback Loop**: Thumbs Up/Down buttons for RLHF (Reinforcement Learning from Human Feedback).

#### **B. Name Risk Widget**
*   **Purpose**: Instant trademark preliminary check.
*   **Features**:
    *   **Visual Gauge**: Animated risk meter (Low to High).
    *   **Conflict Detection**: Identifies potential phonetically similar marks.
    *   **Class Mapping**: Automatically checks the relevant industry class.

### 4. **Startup Template Pack**
Added "Magic Auto-Fill" enabled templates for the most common early-stage documents:
*   **Mutual NDA**: For vendor/partner discussions.
*   **Co-Founder Agreement**: Essential for equity splits.
*   **Consultant Agreement**: For hiring freelancers without IP risk.
*   **Offer Letter**: Standard startup employment format.

---

## 📊 Impact Analysis

| Metric | Before Sprint 5 | After Sprint 5 |
| :--- | :--- | :--- |
| **Data Source** | General Web / LLM Knowledge | **Verified Statutes (Companies Act, Tax)** |
| **Name Check** | Generic "Check MCA" advice | **Interactive Risk Gauge + Class Prediction** |
| **Drafting** | Generic Contracts | **Startup-Specific Template Pack** |
| **User Safety** | Basic Disclaimers | **Strict Risk Gating & Lawyer Hand-off** |

---

## 🔮 What's Next? (Sprint 6: Control & Scale)
Now that the "product" is right for founders, we focus on operational control:
1.  **Guest Limits**: Enforcing the 3-query cap for non-users.
2.  **Usage Metering**: Tracking token costs per user/session.
3.  **Cost Dashboard**: Internal view of unit economics.
4.  **Success Metrics**: Tracking "Founder Recall" (did they come back?) vs "Escalation Rate" (did they need a lawyer?).
