# NyayaFlow - Detailed Site Structure & User Flow

## 🌐 High-Level Navigation Architecture
The application follows a **"Hub & Spoke"** architecture designed for rapid access to legal tools. The **Dashboard** serves as the operational center, with dedicated "Spokes" for deep work.

### Navigation Hierarchy
-   **Global Sidebar (Desktop) / Drawer (Mobile)**
    -   **Dashboard**: Overview & Quick Actions
    -   **Research AI**: Chat-based Legal Intelligence
    -   **Smart Drafter**: Document Creation Studio
    -   **Case Files**: Client & Matter Management
    -   **Widgets**: Agent Network Status
    -   **Profile/Settings**: User Preferences & Billing

---

## 📍 Detailed Component Breakdown

### 1. Dashboard (`/dashboard`) - The Command Center
**Purpose**: Provide an "at-a-glance" view of the advocate's practice and instant access to AI tools.

*   **Welcome Header**:
    *   Dynamic greeting based on time of day.
    *   "Daily Legal Maxim" or Motivation quote.
    *   **Primary CTA**: "Start New Research" (Big, prominent button).
*   **Quick Action Grid**:
    *   `New Draft`: Deep links to the template selector.
    *   `Add Client`: Opens "New Case" modal.
    *   `Search Precedents`: Deep links to Research with "Search" intent.
*   **Live Activity Feed**:
    *   Real-time list of recent sessions (e.g., "Research on Sec 138...", "Drafting Notice for...").
    *   Status indicators (Completed, In Progress).
*   **Agent Status Widget**:
    *   Visual "Pulse" of the AI system.
    *   Shows status of `CaseAnalyzer`, `StatuteExpert`, `ProcedureGuide`.
    *   "System Healthy" / "Maintenance" indicators.

### 2. Research AI (`/research`) - The Brain
**Purpose**: A high-performance, chat-based interface for legal research and query resolution.

*   **Chat Interface**:
    *   **Input Area**: Multi-line text area, supporting voice input.
    *   **Persona Toggle**: Switch between "Lawyer" (Technical) and "Founder" (Simplified) modes.
    *   **Message Stream**: Distinct styles for User (Right) and AI (Left).
    *   **Founder Response**: Risk badges (Safety Layer), "Bottom Line" summary, and "Explain Simply" toggle.
    *   **Empty State**:
        - **Advocate**: "Start New Research" with recent topics.
        - **Founder**: "Founder Question Library" (Curated startup queries like Hiring, IP, Tax).
    *   **Thinking UI**: Expandable "Brain" section showing the AI's logic.

*   **Sidebar (History)**:
    *   **Session List**: Grouped by Date (Today, Yesterday, Last 7 Days).
    *   **Folders**: "Client A", "Criminal Cases", "Property Matters".
    *   **Search**: Full-text search across past chat history.
*   **Deep Dive Modal**:
    *   Triggered when clicking a citation (e.g., `[AIR 1973 SC 1461]`).
    *   Shows full text of the case headnote or statute section without leaving the chat.

### 3. Smart Drafter (`/drafter`) - The Workshop
**Purpose**: A specialized IDE (Integrated Development Environment) for legal documents.

*   **Template Library**:
    *   Categorized: Courts (HC/SC/District), Civil, Criminal, Corporate, **Startup Pack (Sprint 5)**.
    *   Searchable: "Bail Application", "Rent Agreement", "Mutual NDA".
    *   **Founder Essentials**: Dedicated section with Mutual NDA, Co-Founder Agreement, Consultant Agreement, Offer Letter.
*   **Editor Workspace**:
    *   **Left Pane (Inputs)**: Smart forms for structured data (Client Name, Respondent, Dates).
    *   **Right Pane (Preview)**: Real-time A4/Legal paper preview of the document.
    *   **Toolbar**: Export (PDF/Word), Copy, Print.
*   **AI Functionality**:
    *   **"Magic Polish"**: Highlight text -> Click "Polish" -> AI rewrites in formal legalese.
    *   **Auto-Fill**: AI extracts details from chat history to fill the template.

### 4. Case Files (`/practice`) - The Filing Cabinet
**Purpose**: Digital organization for client matters, replacing physical files.

*   **Case Grid/List**:
    *   Sortable by: Recent, Client Name, Next Hearing Date.
    *   Filter by: Tag (Civil/Criminal), Status (Open/Closed).
*   **Case Detail View**:
    *   **Overview**: Client details, Opposing Counsel, Court info.
    *   **Documents**: Repository of generated drafts and uploaded evidence.
    *   **Research Links**: Link specific CI research sessions to this case for context.
    *   **Notes**: Private encrypted notes for the advocate.

### 5. Settings & Profile
**Purpose**: Application configuration and subscription management.

*   **Profile**: Name, Bar Council Enrollment No., Signature upload (for drafts).
*   **Subscription**:
    *   Current Plan (Free/Pro/Team).
    *   Usage Meter (Drafts remaining, AI tokens used).
    *   Billing History & Invoices.
*   **Preferences**:
    *   **Theme**: System/Light/Dark (High Contrast support).
    *   **Citation Style**: "Bluebook" vs "Standard Indian Citation".
    *   **Default Jurisdiction**: e.g., "Bombay High Court" (tunes AI bias).

---

## 🔄 User Journey Flows

### Journey A: The "Urgent Hearing Prep" (Research Focus)
1.  **Login**: Advocate logs in on mobile while in court.
2.  **Dashboard**: Taps "Research AI".
3.  **Query**: Dictates/Types "Latest Supreme Court guidelines on arrest under Section 41A CrPC".
4.  **Process**:
    *   Orchestrator identifies `Procedure/Statute` intent.
    *   Routes to `StatuteExpert` & `ProcedureGuide`.
    *   RAG retrieves *Arnesh Kumar v. State of Bihar*.
5.  **Result**: AI provides a bulleted 5-point checklist of guidelines + Case Citation.
6.  **Action**: User pins the answer for offline access.

### Journey B: The "Client Onboarding & Filing" (Drafting Focus)
1.  **Login**: Advocate sits at desk (Desktop).
2.  **Dashboard**: Clicks "Add Client" -> Creates "Ramesh vs. State".
3.  **Navigation**: Goes to "Smart Drafter".
4.  **Template**: Selects "Anticipatory Bail Application (Sessions Court)".
5.  **Drafting**:
    *   Fills basic details in Left Pane.
    *   Uses **AI Polish** to expand "He is innocent and was not there" -> "The accused pleads alibi, stating he was not present at the *locus delicti*...".
6.  **Finalize**: Exports to DOCX for final formatting.
7.  **Organize**: Saves draft to "Ramesh vs. State" in Case Files.

---

## 📱 Responsive Behaviours

*   **Desktop (>1024px)**:
    *   Sidebar: Always visible, expanded.
    *   Drafter: Split-screen (Input + Preview).
*   **Tablet (768px - 1024px)**:
    *   Sidebar: Collapsed (Icon only).
    *   Drafter: Tabbed view (Input | Preview).
*   **Mobile (<768px)**:
    *   Sidebar: Hidden (Hamburger menu drawer).
    *   Research: Full-screen chat app feel.
    *   Drafter: Stacked view (Form first -> Preview button).
    *   **Touch Targets**: Minimum 44px for all reliable tapping.
