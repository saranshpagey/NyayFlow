export interface TimelineEvent {
    id: string;
    date: string;
    title: string;
    description: string;
    type: 'hearing' | 'filing' | 'order' | 'meeting';
}

export interface CaseFile {
    id: string;
    caseNumber: string;
    clientName: string;
    vsty: string; // e.g., "State of Maharashtra"
    court: string;
    nextHearing: string;
    stage: string; // e.g., "Arguments", "Evidence"
    status: 'active' | 'closed' | 'pending_filing';
    timeline: TimelineEvent[];
}

export const MOCK_CASES: CaseFile[] = [
    {
        id: '1',
        caseNumber: 'CC/124/2023',
        clientName: 'Ramesh Gupta',
        vsty: 'TechSolutions Pvt Ltd',
        court: 'MM Court, Andheri',
        nextHearing: '2023-11-15',
        stage: 'Cross Examination',
        status: 'active',
        timeline: [
            { id: '1a', date: '2023-10-01', title: 'Hearing Adjourned', description: 'Accused absent. Bailable warrant issued.', type: 'hearing' },
            { id: '1b', date: '2023-09-15', title: 'Evidence Affidavit Filed', description: 'Complainant filed evidence by way of affidavit.', type: 'filing' },
            { id: '1c', date: '2023-08-20', title: 'Summons Issued', description: 'Court took cognizance and issued summons.', type: 'order' }
        ]
    },
    {
        id: '2',
        caseNumber: 'BA/450/2023',
        clientName: 'Suresh Kumar',
        vsty: 'State of Karnataka',
        court: 'High Court of Karnataka',
        nextHearing: '2023-11-10',
        stage: 'Arguments on Bail',
        status: 'active',
        timeline: [
            { id: '2a', date: '2023-11-01', title: 'Notice Issued', description: 'Notice issued to Public Prosecutor.', type: 'order' },
            { id: '2b', date: '2023-10-28', title: 'Bail Application Filed', description: 'Under Section 439 CrPC.', type: 'filing' }
        ]
    }
];
