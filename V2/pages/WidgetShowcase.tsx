import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { StatuteWidget } from '../components/widgets/StatuteWidget';
import { PenaltyWidget } from '../components/widgets/PenaltyWidget';
import { ProcedureWidget } from '../components/widgets/ProcedureWidget';
import { StructuredResponseView } from '../components/widgets/StructuredResponseView';
import { CaseLawWidget } from '../components/widgets/CaseLawWidget';
import { ChecklistWidget } from '../components/widgets/ChecklistWidget';
import { GlossaryWidget } from '../components/widgets/GlossaryWidget';
import { TimelineWidget } from '../components/widgets/TimelineWidget';
import { LegalDraftWidget } from '../components/widgets/LegalDraftWidget';
import { OutcomeWidget } from '../components/widgets/OutcomeWidget';
import { AgentStatusWidget } from '../components/widgets/AgentStatusWidget';

const WidgetShowcase = () => {
    const mockStatuteData = {
        title: "Section 302 IPC",
        text: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
        explanation: "This section prescribes the punishment for the offense of murder."
    };

    const mockPenaltyData = {
        crime: "Cheating (Section 420)",
        imprisonment: "7 Years",
        fine: "Unlimited"
    };

    const mockProcedureData = {
        title: "Filing a First Information Report (FIR)",
        steps: [
            "Visit the nearest police station having jurisdiction over the area.",
            "Inform the officer visible about the offense (orally or in writing).",
            "The officer must record the information in the daily diary.",
            "Read the recorded information to verify correctness and sign it.",
            "Get a free copy of the FIR immediately after registration."
        ]
    };

    const mockStructuredData = {
        title: "Driving Under Influence (Section 185 MV Act)",
        legal_limit: "30mg / 100ml blood",
        relevant_laws: "Motor Vehicles Act, 1988",
        penalties: [
            { offense: "First Offense", penalty: "Imprisonment up to 6 months or Fine ₹10,000" },
            { offense: "Subsequent Offense", penalty: "Imprisonment up to 2 years or Fine ₹15,000" }
        ],
        additional_information: [
            "Police can seize your driving license immediately.",
            "Vehicle may be impounded if no co-driver is available."
        ],
        disclaimer: "Fines may vary based on state amendments."
    };

    const mockCaseData = {
        title: "Arnesh Kumar v. State of Bihar",
        citation: "(2014) 8 SCC 273",
        ruling: "Police cannot automatically arrest accused in cases where punishment is less than 7 years. Notice under Section 41A CrPC is mandatory.",
        bench: "Justices C.K. Prasad & P.C. Ghose"
    };

    const mockChecklistData = {
        title: "Documents for Divorce Petition",
        items: [
            "Marriage Certificate",
            "Passport Size Photographs of both parties",
            "Proof of Residence (Aadhar/Voter ID)",
            "Evidence of Separation (>1 year)",
            "Income Tax Returns (last 3 years)"
        ]
    };

    const mockGlossaryData = {
        term: "Res Judicata",
        definition: "A matter that has been adjudicated by a competent court and may not be pursued further by the same parties.",
        context: "If you already sued for breach of contract and lost, you cannot sue again for the same breach."
    };

    const mockTimelineData = {
        title: "Civil Suit Stages",
        steps: [
            { label: "Filing Plaint", subtext: "Step 1" },
            { label: "Summons", subtext: "Notice to Def." },
            { label: "Written Statement", subtext: "Reply by Def." },
            { label: "Evidence", subtext: "Documents/Witness" },
            { label: "Arguments", subtext: "Final Hearing" },
            { label: "Judgment", subtext: "Decree Passed" }
        ]
    };

    const mockDraftData = {
        documentType: "Legal Notice (Cheque Bounce)",
        template: "To,\n[Builder's Name]\n[Builder's Address]\n\nDate: [Date]\n\nSubject: Legal Notice for Delay in Possession of Flat\n\nDear Sir/Madam,\n\nUnder instructions from my client, I hereby serve you this notice...",
        variables: { "Builder's Name": "XYZ Developers", "Date": "24th Oct 2023" }
    };

    const mockOutcomeData = {
        probability: 72,
        verdict_counts: { allowed: 45, dismissed: 18 },
        leading_precedent: "State of Haryana v. Bhajan Lal",
        confidence: "High",
        brief_reason: "Strong overlap with delay-in-possession precedents where developers were held liable for contractual breach."
    };

    return (
        <DashboardLayout headerTitle="Widget Showcase">
            <div className="h-full overflow-y-auto">
                <div className="p-8 space-y-12 max-w-5xl mx-auto pb-32">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white border-b pb-2">Outcome Oracle</h2>
                            <OutcomeWidget data={mockOutcomeData} />
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white border-b pb-2">Structured Response</h2>
                            <StructuredResponseView data={mockStructuredData} />
                        </section>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white border-b pb-2">Statute</h2>
                            <StatuteWidget data={mockStatuteData} />
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white border-b pb-2">Penalty</h2>
                            <PenaltyWidget data={mockPenaltyData} />
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white border-b pb-2">Procedure</h2>
                            <ProcedureWidget data={mockProcedureData} />
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white border-b pb-2">Case Law</h2>
                            <CaseLawWidget data={mockCaseData} />
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white border-b pb-2">Checklist</h2>
                            <ChecklistWidget data={mockChecklistData} />
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white border-b pb-2">Glossary</h2>
                            <GlossaryWidget data={mockGlossaryData} />
                        </section>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white border-b pb-2">Timeline</h2>
                        <TimelineWidget data={mockTimelineData} />
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white border-b pb-2">Legal Draft</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <LegalDraftWidget data={mockDraftData} />
                            <AgentStatusWidget
                                data={{
                                    agents: [
                                        { id: 'orchestrator', name: 'Law Orchestrator', status: 'processing', message: 'Routing query...' },
                                        { id: 'analyzer', name: 'Legal Analyzer', status: 'success', message: 'Intent identified' },
                                        { id: 'research', name: 'Research Agent', status: 'idle' },
                                    ]
                                }}
                            />
                        </div>
                    </section>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default WidgetShowcase;
