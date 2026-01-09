# NyayaFlow - Detailed Production Costing Analysis

## 📊 Infrastructure Cost Breakdown

### 1. Compute & Hosting (The "Rent")
We are adopting a **Serverless First** approach to minimize idle costs.

| Component | Provider Strategy | Cost Factors | Development (0-100 Users) | Growth (1000 Users) | Scale (10k Users) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Frontend** | Vercel Pro | $20/seat/mo | $20/mo | $60/mo (3 seats) | $200/mo (Team) |
| **Backend API** | Railway / AWS Lambda | RAM + CPU Time | $5 (Hobby) | $50 (Pro) | $400 (Dedicated) |
| **Database (SQL)** | Supabase (Postgres) | Storage + Egress | Free Tier | $25 (Pro 8GB) | $150 (Enterprise) |
| **Vector DB** | Supabase pgvector | Included in DB | $0 | $0 | $0 |

### 2. AI Intelligence (The "Brains" - Variable Cost)
This is our primary COGS (Cost of Goods Sold).

| AI Task | Model Strategy | Cost per 1000 Units |
| :--- | :--- | :--- |
| **Intelligent Routing** | Gemini 2.0 Flash | $0.05 |
| **Simple Statute Lookup** | Gemini 2.0 Flash | $0.10 |
| **Complex Case Analysis** | Gemini 1.5 Pro | $5.00 |
| **Draft Polish (1 page)** | Gemini 2.0 Flash | $0.02 |

**Unit Economics Calculation**:
*   Avg User performs 20 queries/day.
*   5 Complex Analysis + 15 Simple Queries.
*   **Daily AI Cost per Active User**: ~$0.05
*   **Monthly AI Cost per Active User**: ~$1.50 (₹120)

---

## 📉 Profit Margin Analysis

### Scenario A: "Pro" User (₹999/mo)
*   **Revenue**: ₹999
*   **AI Costs**: ₹120 (est.)
*   **Server Costs**: ₹30 (shared)
*   **Payment Gateway (2%)**: ₹20
*   **Gross Profit**: **₹829 (83% Margin)**

### Scenario B: "Power" User (Heavy Drafter)
*   **Revenue**: ₹999
*   **AI Costs**: ₹300 (est.)
*   **Server Costs**: ₹30
*   **Gross Profit**: **₹649 (65% Margin)**

*Conclusion: Even with heavy usage, margins remain >60% due to efficient model selection (Flash vs Pro).*

---

## 🛠️ Hidden Costs & Opex

1.  **Observability (Sentry/Datadog)**: Essential for debugging production errors. ~$26/mo.
2.  **Email (Resend/SendGrid)**: Transactional emails (Magic Links, Notifications). Free tier covers 3000/mo, then ~$20/mo.
3.  **Authentication (Supabase Auth)**: Free up to 50,000 MAUs. After that, $0.00325 per MAU.
4.  **Domain & SSL**: ~$15/year.

---

## 🚀 Scaling Triggers (When to upgrade?)

1.  **Database**: Upgrade to Supabase Pro ($25) immediately upon launch to get daily backups and 8GB storage.
2.  **Backend**: Stick to Railway/Render until >500 concurrent users, then migrate to Containerized AWS ECS for cost control.
3.  **AI Rate Limits**: Google API has rate limits. At 1000+ users, we will need **Provisioned Throughput** or fallback to OpenAI/Anthropic (Interoperability layer required).
