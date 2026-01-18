# Sprint 6 Implementation Plan: Control & Scale Readiness

**Objective:** Transition NyayaFlow from a feature-rich prototype to a production-ready platform. This sprint focuses on sustainability, cost control, and user conversion through intelligent gating and metering.

---

## 🤖 Component Breakdown

### 1. Guest Gating & Signup Wall
**Goal:** Enforce a hard "3-query limit" for guest users to drive signups and control costs.

- [ ] **Backend: `GuestManager` Service**
    - Create `services/guest_manager.py`.
    - Track `guest_id` (UUID or Fingerprint) in a new `guest_usage` table in Supabase.
    - Method `check_limit(guest_id)`: Increments count and returns boolean.
- [ ] **Backend: API Enforcement**
    - Update `server.py`'s `research_endpoint` to call `GuestManager`.
    - Return `403 Forbidden` with header `X-Limit-Reached: true` when limit is hit.
- [ ] **Frontend: `SignupWall` Modal**
    - Create `components/modals/SignupWall.tsx` with a premium, high-conversion design.
    - Trigger modal in `pages/Research.tsx` upon receiving the limit-reached error.
- [ ] **Frontend: Usage Progress Bar**
    - Show a subtle "2/3 free queries used" indicator in the Research input area for guests.

### 2. Usage Metering System
**Goal:** Professional-grade tracking of token consumption and cost association.

- [ ] **Database Schema Update**
    - Add `user_id` (UUID) and `session_id` to `llm_usage_logs` table.
- [ ] **Backend: `UsageService` Enhancement**
    - Update `usage_service.py` to accept `user_id`.
    - Automatically fetch the user's current "Plan" (Free/Pro) to apply different token caps.
    - Implement "Hard Stop" logic for users who exceed their monthly token budget.
- [ ] **Backend: Token Calculation**
    - Ensure all agents (Orchestrator, RAG, CaseAnalyzer) correctly pass `usage_metadata` from Gemini responses to the logger.

### 3. Internal Cost Dashboard (`/admin`)
**Goal:** Real-time visibility into the business's burn rate and unit economics.

- [ ] **Backend: Analytics API**
    - Create `/api/admin/metrics` endpoint.
    - Aggregate data: Total Burn (USD), Avg Cost/User, Most Expensive Agent, Cache Hit Rate.
- [ ] **Frontend: Admin Panel**
    - Create `pages/AdminDashboard.tsx` (accessible via `/admin`).
    - Use `recharts` for visual burn charts and intent distribution pie charts.
    - Add a "Kill Switch" per user/guest for cost outliers.

### 4. Founder Success Metrics
**Goal:** Quantify the value provided to startup founders beyond just chat accuracy.

- [ ] **Logic: Feedback Loop Tracking**
    - Update `case_persistence.py` to store widget feedback (`ThumbsUp`/`ThumbsDown`) in a dedicated `feedback_logs` table with context.
- [ ] **Logic: Action Plan Conversion**
    - Track if users click on specific action items in the `StartUpInsightWidget`.
- [ ] **Logic: Escalation Detection**
    - Track queries that result in "High Risk" flags where the user subsequently asks "Find me a lawyer".

---

## 🚀 Execution Sequence

1.  **Phase 1 (Gating)**: Implement `GuestManager` and `SignupWall`. (Immediate cost protection).
2.  **Phase 2 (Metering)**: Update `UsageService` and Database schema to track `user_id`.
3.  **Phase 3 (Dashboard)**: Build the Internal Admin UI for monitoring.
4.  **Phase 4 (Metrics)**: Implement granular feedback and conversion tracking.

---

## 🛠️ Tech Stack Additions
- **Recharts**: For the Admin Dashboard visualizations.
- **Supabase Auth Hooks**: For linking `guest_id` data to `user_id` upon signup.
- **FingerprintJS (Optional)**: For more robust guest identification if IP rotation is an issue.

---

## 📈 Success Definition
- **Guest-to-User Conversion**: > 15%.
- **Cost Awareness**: Every single AI query is mapped to a cost and a user.
- **Operational Stability**: Admin can identify and block "token-drainer" query patterns within 1 minute.
