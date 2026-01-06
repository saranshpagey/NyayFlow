export interface CaseLaw {
    id: string;
    title: string;
    court: string;
    date: string;
    citation: string;
    snippet: string;
    status: 'good_law' | 'overruled' | 'distinguished';
    summary: string;
}

export const MOCK_RESEARCH_RESULTS: CaseLaw[] = [
    {
        id: '1',
        title: 'Dalmia Cement (Bharat) Ltd. vs. Galaxy Traders & Agencies Ltd.',
        court: 'Supreme Court of India',
        date: '2001-01-22',
        citation: '2001 SCC (6) 463',
        snippet: '...Section 138 of the Negotiable Instruments Act is to inculcate faith in the efficacy of banking operations and credibility in transacting business on negotiable instruments...',
        status: 'good_law',
        summary: 'The SC held that the object of Section 138 is to promote the efficacy of banking operations. Using technicalities to defeat the purpose of the Act is discouraged. The court emphasized that the deadlines in the Act are strict to ensure finding of guilt or innocence is not delayed.'
    },
    {
        id: '2',
        title: 'Dashrath Rupsingh Rathod vs. State of Maharashtra',
        court: 'Supreme Court of India',
        date: '2014-08-01',
        citation: '2014 CriLJ 3855',
        snippet: '...complaint under Section 138 must be filed in the court within whose territorial jurisdiction the offence was committed...',
        status: 'overruled',
        summary: 'Initially held that the complaint must be filed where the cheque was dishonoured. NOTE: This led to the 2015 Amendment of the NI Act which clarified jurisdiction is where the payee bank account is located. Marked as OVERRULED due to legislative amendment.'
    },
    {
        id: '3',
        title: 'M/s. Meters and Instruments Private Limited vs. Kanchan Mehta',
        court: 'Supreme Court of India',
        date: '2017-10-05',
        citation: 'AIR 2017 SC 4594',
        snippet: '...compounding of offence under Section 138 can be done even without the consent of the complainant if the accused is willing to pay the amount...',
        status: 'distinguished',
        summary: 'SC observed that though Section 138 is a criminal offence, it is civil in nature. The court has the power to close proceedings if the accused compensates the complainant, even without complainant consent in certain suitable cases.'
    }
];
