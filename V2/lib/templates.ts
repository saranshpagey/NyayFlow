// Legal Template Management System
// Defines data structures and template library for NyayaFlow

export interface TemplateField {
    id: string;
    label: string;
    type: 'text' | 'date' | 'number' | 'textarea';
    placeholder: string;
    required: boolean;
}

export interface LegalTemplate {
    id: string;
    name: string;
    category: 'vakalatnama' | 'notice' | 'petition' | 'affidavit' | 'contract' | 'startup';
    jurisdiction?: 'bombay_hc' | 'delhi_hc' | 'supreme_court' | 'all';
    description: string;
    fields: TemplateField[];
    content: string; // With {{placeholder}} syntax
    riskLevel?: 'low' | 'medium' | 'high';
}

// Template Library
export const legalTemplates: LegalTemplate[] = [
    {
        id: 'vakalatnama-bombay-hc',
        name: 'Vakalatnama (Bombay High Court)',
        category: 'vakalatnama',
        jurisdiction: 'bombay_hc',
        description: 'Authorization for legal representation in Bombay High Court',
        fields: [
            { id: 'caseNumber', label: 'Case Number', type: 'text', placeholder: 'e.g., WP/12345/2026', required: true },
            { id: 'appellant', label: 'Plaintiff/Appellant', type: 'text', placeholder: 'Full name', required: true },
            { id: 'respondent', label: 'Defendant/Respondent', type: 'text', placeholder: 'Full name', required: true },
            { id: 'clientName', label: 'Client Name', type: 'text', placeholder: 'Your name', required: true },
            { id: 'advocateName', label: 'Advocate Name', type: 'text', placeholder: 'Advocate name', required: true },
            { id: 'place', label: 'Place', type: 'text', placeholder: 'e.g., Mumbai', required: true },
        ],
        content: `VAKALATNAMA

IN THE HIGH COURT OF JUDICATURE AT BOMBAY

Case Type / No.: {{caseNumber}}

Plaintiff / Appellant: {{appellant}}

VERSUS

Defendant / Respondent: {{respondent}}

I / We, {{clientName}}, the undersigned, do hereby appoint and retain {{advocateName}}, Advocate(s) enrolled with the Bar Council of Maharashtra and Goa, to act and appear for me/us in the above Suit / Appeal / Petition and on my/our behalf to conduct and prosecute (or defend) the same and all proceedings that may be taken in respect of any application connected with the same or any decree or order passed therein.

I / We authorise the said Advocate(s) to admit any compromise or give up any claim or to withdraw any suit or proceedings and to file any application for execution of the decree or order and to deposit, draw and receive money, cheques, cash and grant receipts thereof and to do all other acts and things which may be necessary to be done for the progress and in the course of the prosecution (or defence) of the said Suit / Appeal / Petition.

I / We agree to ratify all acts done by the Advocate(s) in pursuance of this authority.

Dated this {{date}} day of {{month}}, {{year}}
Place: {{place}}


                                                    _______________________
                                                    (Signature of Client)
                                                    {{clientName}}


ACCEPTED

                                                    _______________________
                                                    (Signature of Advocate)
                                                    {{advocateName}}
                                                    Enrollment No.: __________`
    },
    {
        id: 'vakalatnama-delhi-hc',
        name: 'Vakalatnama (Delhi High Court)',
        category: 'vakalatnama',
        jurisdiction: 'delhi_hc',
        description: 'Authorization for legal representation in Delhi High Court',
        fields: [
            { id: 'caseNumber', label: 'Case Number', type: 'text', placeholder: 'e.g., CS(OS) 123/2026', required: true },
            { id: 'petitioner', label: 'Petitioner', type: 'text', placeholder: 'Full name', required: true },
            { id: 'respondent', label: 'Respondent', type: 'text', placeholder: 'Full name', required: true },
            { id: 'clientName', label: 'Client Name', type: 'text', placeholder: 'Your name', required: true },
            { id: 'advocateName', label: 'Advocate Name', type: 'text', placeholder: 'Advocate name', required: true },
            { id: 'place', label: 'Place', type: 'text', placeholder: 'e.g., New Delhi', required: true },
        ],
        content: `VAKALATNAMA

IN THE HIGH COURT OF DELHI AT NEW DELHI

Case No.: {{caseNumber}}

Petitioner: {{petitioner}}

VERSUS

Respondent: {{respondent}}

I / We, {{clientName}}, the undersigned, do hereby appoint and retain {{advocateName}}, Advocate(s) enrolled with the Bar Council of Delhi, to act, appear and plead for me/us in the above matter and on my/our behalf to conduct and prosecute (or defend) the same and all proceedings that may be taken in respect thereof or any application connected therewith or any decree or order passed therein.

I / We hereby authorize the said Advocate(s) to:
1. Admit or deny facts, make or withdraw admissions
2. Compromise, compound or withdraw the suit/petition
3. File applications for execution of decree/order
4. Receive and give valid discharge for all monies payable
5. Do all acts and things necessary for the proper conduct of the case

I / We agree to ratify and confirm all acts done by the said Advocate(s) in pursuance of this authority.

Dated: {{date}}/{{month}}/{{year}}
Place: {{place}}


                                                    _______________________
                                                    (Signature of Client)
                                                    Name: {{clientName}}
                                                    Address: _______________


ACCEPTED

Date: _______________                               _______________________
                                                    (Signature of Advocate)
                                                    {{advocateName}}
                                                    Enrolment No.: __________`
    },
    {
        id: 'vakalatnama-supreme-court',
        name: 'Vakalatnama (Supreme Court of India)',
        category: 'vakalatnama',
        jurisdiction: 'supreme_court',
        description: 'Authorization for legal representation in Supreme Court of India',
        fields: [
            { id: 'caseNumber', label: 'Case Number', type: 'text', placeholder: 'e.g., SLP(C) No. 12345/2026', required: true },
            { id: 'petitioner', label: 'Petitioner', type: 'text', placeholder: 'Full name', required: true },
            { id: 'respondent', label: 'Respondent', type: 'text', placeholder: 'Full name', required: true },
            { id: 'clientName', label: 'Client Name', type: 'text', placeholder: 'Your name', required: true },
            { id: 'advocateName', label: 'Advocate-on-Record', type: 'text', placeholder: 'AOR name', required: true },
            { id: 'place', label: 'Place', type: 'text', placeholder: 'e.g., New Delhi', required: true },
        ],
        content: `VAKALATNAMA

IN THE SUPREME COURT OF INDIA

{{caseNumber}}

IN THE MATTER OF:

{{petitioner}}                                      ...Petitioner(s)

VERSUS

{{respondent}}                                      ...Respondent(s)

I / We, {{clientName}}, the Petitioner(s) in the above matter, do hereby appoint, constitute and authorize {{advocateName}}, Advocate-on-Record, Supreme Court of India, to act, appear and plead for me/us in the above matter and in all proceedings arising therefrom or connected therewith.

I / We hereby authorize the said Advocate-on-Record to:

1. File, present and prosecute the Special Leave Petition / Appeal / Writ Petition and all applications connected therewith;
2. Make or withdraw admissions, admit or deny documents;
3. Compromise, compound or withdraw the matter;
4. Engage Senior Advocates and other Advocates to appear and argue;
5. File applications for execution and receive monies;
6. Do all acts, deeds and things necessary for the proper conduct and prosecution of the matter.

I / We undertake to ratify and confirm all acts, deeds and things done by the said Advocate-on-Record in pursuance of this authority.

Dated this {{date}} day of {{month}}, {{year}}
Place: {{place}}


Deponent: {{clientName}}                            _______________________
Address: _______________                            (Signature of Deponent)
         _______________


VERIFICATION

I, {{clientName}}, the deponent above-named, do hereby verify that the contents of the above Vakalatnama are true and correct to the best of my knowledge and belief.

Verified at {{place}} on this {{date}} day of {{month}}, {{year}}.


                                                    _______________________
                                                    (Signature of Deponent)


ACCEPTED

                                                    _______________________
                                                    {{advocateName}}
                                                    Advocate-on-Record
                                                    Supreme Court of India
                                                    Enrolment No.: __________`
    },
    {
        id: 'legal-notice-cheque-bounce',
        name: 'Legal Notice (Cheque Bounce)',
        category: 'notice',
        jurisdiction: 'all',
        description: 'Legal notice under Section 138 of Negotiable Instruments Act',
        fields: [
            { id: 'payeeName', label: 'Payee Name', type: 'text', placeholder: 'Your name', required: true },
            { id: 'payeeAddress', label: 'Payee Address', type: 'textarea', placeholder: 'Your full address', required: true },
            { id: 'drawerName', label: 'Drawer Name', type: 'text', placeholder: 'Defaulter name', required: true },
            { id: 'drawerAddress', label: 'Drawer Address', type: 'textarea', placeholder: 'Defaulter address', required: true },
            { id: 'chequeNumber', label: 'Cheque Number', type: 'text', placeholder: 'e.g., 123456', required: true },
            { id: 'chequeDate', label: 'Cheque Date', type: 'date', placeholder: 'DD/MM/YYYY', required: true },
            { id: 'chequeAmount', label: 'Cheque Amount', type: 'text', placeholder: 'e.g., Rs. 50,000/-', required: true },
            { id: 'bankName', label: 'Bank Name', type: 'text', placeholder: 'Bank name', required: true },
            { id: 'returnDate', label: 'Return Date', type: 'date', placeholder: 'DD/MM/YYYY', required: true },
            { id: 'returnReason', label: 'Return Reason', type: 'text', placeholder: 'e.g., Insufficient Funds', required: true },
        ],
        content: `LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881

To,
{{drawerName}}
{{drawerAddress}}

Dear Sir/Madam,

SUBJECT: LEGAL NOTICE FOR DISHONOUR OF CHEQUE

Under instructions from and on behalf of my client {{payeeName}}, residing at {{payeeAddress}}, I hereby serve upon you this Legal Notice under Section 138 of the Negotiable Instruments Act, 1881.

FACTS OF THE CASE:

1. That you had issued Cheque No. {{chequeNumber}} dated {{chequeDate}} for an amount of {{chequeAmount}} drawn on {{bankName}} in favour of my client towards discharge of your legally enforceable debt/liability.

2. That my client presented the said cheque for encashment through his/her banker, but the same was returned unpaid on {{returnDate}} with the reason "{{returnReason}}".

3. That the dishonour of the said cheque has caused grave financial loss, mental agony and harassment to my client.

DEMAND:

You are hereby called upon to pay the amount of {{chequeAmount}} along with interest and costs within 15 (fifteen) days from the receipt of this notice, failing which my client shall be constrained to initiate criminal proceedings against you under Section 138 of the Negotiable Instruments Act, 1881, without any further reference to you.

Please note that upon conviction, you shall be liable for punishment which may extend to imprisonment for a term up to two years, or with fine which may extend to twice the amount of the cheque, or with both.

This notice is being issued without prejudice to any other rights and remedies available to my client under law.

Kindly treat this as urgent and comply with the demand to avoid unnecessary litigation.

Yours faithfully,

{{advocateName}}
Advocate for the Payee

Date: {{date}}/{{month}}/{{year}}
Place: {{place}}`
    },
    {
        id: 'legal-notice-property-dispute',
        name: 'Legal Notice (Property Dispute)',
        category: 'notice',
        jurisdiction: 'all',
        description: 'Legal notice for property-related disputes',
        fields: [
            { id: 'senderName', label: 'Sender Name', type: 'text', placeholder: 'Your name', required: true },
            { id: 'senderAddress', label: 'Sender Address', type: 'textarea', placeholder: 'Your address', required: true },
            { id: 'recipientName', label: 'Recipient Name', type: 'text', placeholder: 'Recipient name', required: true },
            { id: 'recipientAddress', label: 'Recipient Address', type: 'textarea', placeholder: 'Recipient address', required: true },
            { id: 'propertyDescription', label: 'Property Description', type: 'textarea', placeholder: 'Detailed property description', required: true },
            { id: 'disputeNature', label: 'Nature of Dispute', type: 'textarea', placeholder: 'Describe the dispute', required: true },
            { id: 'demandAction', label: 'Demanded Action', type: 'textarea', placeholder: 'What you want them to do', required: true },
        ],
        content: `LEGAL NOTICE

To,
{{recipientName}}
{{recipientAddress}}

Dear Sir/Madam,

RE: LEGAL NOTICE CONCERNING PROPERTY DISPUTE

Under instructions from and on behalf of my client {{senderName}}, residing at {{senderAddress}}, I hereby serve upon you this Legal Notice.

PROPERTY IN QUESTION:

{{propertyDescription}}

FACTS AND GRIEVANCES:

{{disputeNature}}

My client has tried to resolve this matter amicably with you on several occasions, but you have failed to respond positively or take any corrective action.

DEMAND:

You are hereby called upon to:

{{demandAction}}

You are required to comply with the above demand within 15 (fifteen) days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you for recovery, damages, injunction and/or any other relief as may be deemed fit, at your risk as to costs.

Please note that this notice is issued without prejudice to any other rights, remedies and contentions available to my client under law, all of which are expressly reserved.

Kindly treat this matter as urgent.

Yours faithfully,

{{advocateName}}
Advocate for {{senderName}}

Date: {{date}}/{{month}}/{{year}}
Place: {{place}}`
    },
    {
        id: 'writ-petition',
        name: 'Writ Petition',
        category: 'petition',
        jurisdiction: 'all',
        description: 'Constitutional remedy petition under Article 226/32',
        fields: [
            { id: 'courtName', label: 'Court Name', type: 'text', placeholder: 'e.g., High Court of Delhi', required: true },
            { id: 'petitionerName', label: 'Petitioner Name', type: 'text', placeholder: 'Full name', required: true },
            { id: 'petitionerAddress', label: 'Petitioner Address', type: 'textarea', placeholder: 'Full address', required: true },
            { id: 'respondentName', label: 'Respondent Name', type: 'text', placeholder: 'Full name/Department', required: true },
            { id: 'respondentDesignation', label: 'Respondent Designation', type: 'text', placeholder: 'Official designation', required: true },
            { id: 'reliefSought', label: 'Relief Sought', type: 'textarea', placeholder: 'What relief you are seeking', required: true },
            { id: 'groundsInBrief', label: 'Grounds (Brief)', type: 'textarea', placeholder: 'Brief grounds for petition', required: true },
        ],
        content: `IN THE {{courtName}}

WRIT PETITION NO. _______ OF {{year}}

(Under Article 226 of the Constitution of India)

IN THE MATTER OF:

{{petitionerName}}
{{petitionerAddress}}
                                                    ...Petitioner

VERSUS

{{respondentName}}
{{respondentDesignation}}
                                                    ...Respondent

WRIT PETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA

TO,
THE HON'BLE CHIEF JUSTICE AND HIS COMPANION JUSTICES OF THE {{courtName}}

THE HUMBLE PETITION OF THE PETITIONER ABOVE-NAMED

MOST RESPECTFULLY SHOWETH:

1. That the Petitioner has filed this Writ Petition under Article 226 of the Constitution of India seeking the following reliefs:

RELIEF SOUGHT:

{{reliefSought}}

2. That the Petitioner has no alternative efficacious remedy except to approach this Hon'ble Court under Article 226 of the Constitution of India.

BRIEF FACTS:

{{groundsInBrief}}

3. That the action/inaction of the Respondent is arbitrary, illegal, unconstitutional and violative of the fundamental rights of the Petitioner guaranteed under Articles 14, 19 and 21 of the Constitution of India.

4. That the Petitioner has not filed any other petition before any Court/Forum concerning the subject matter of this petition.

5. That this Hon'ble Court has the territorial jurisdiction to entertain and try this petition.

PRAYER:

In view of the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:

a) {{reliefSought}}

b) Pass such other and further orders as this Hon'ble Court may deem fit and proper in the facts and circumstances of the case.

AND FOR THIS ACT OF KINDNESS, THE PETITIONER AS IN DUTY BOUND SHALL EVER PRAY.


FILED BY:

{{advocateName}}
Advocate for the Petitioner

Date: {{date}}/{{month}}/{{year}}
Place: {{place}}`
    },
    {
        id: 'affidavit',
        name: 'General Affidavit',
        category: 'affidavit',
        jurisdiction: 'all',
        description: 'General sworn statement/affidavit format',
        fields: [
            { id: 'deponentName', label: 'Deponent Name', type: 'text', placeholder: 'Your full name', required: true },
            { id: 'deponentAge', label: 'Age', type: 'number', placeholder: 'Your age', required: true },
            { id: 'deponentOccupation', label: 'Occupation', type: 'text', placeholder: 'Your occupation', required: true },
            { id: 'deponentAddress', label: 'Address', type: 'textarea', placeholder: 'Your full address', required: true },
            { id: 'affidavitPurpose', label: 'Purpose', type: 'text', placeholder: 'Purpose of affidavit', required: true },
            { id: 'affidavitContent', label: 'Affidavit Content', type: 'textarea', placeholder: 'Main content/statements', required: true },
        ],
        content: `AFFIDAVIT

I, {{deponentName}}, aged {{deponentAge}} years, {{deponentOccupation}}, residing at {{deponentAddress}}, do hereby solemnly affirm and state on oath as under:

1. That I am the Deponent herein and am well acquainted with the facts and circumstances of the case.

2. That I am competent to swear this Affidavit and the contents of this Affidavit are within my personal knowledge and belief.

PURPOSE:

{{affidavitPurpose}}

STATEMENT OF FACTS:

{{affidavitContent}}

3. That I have not suppressed any material facts and whatever is stated hereinabove is true and correct to the best of my knowledge and belief.

4. That I am swearing this Affidavit to {{affidavitPurpose}}.


DEPONENT

                                                    _______________________
                                                    {{deponentName}}


VERIFICATION

I, {{deponentName}}, the Deponent above-named, do hereby verify that the contents of paragraphs 1 to 4 of the above Affidavit are true and correct to the best of my knowledge and belief and nothing material has been concealed therefrom.

Verified at {{place}} on this {{date}} day of {{month}}, {{year}}.


                                                    _______________________
                                                    DEPONENT


SOLEMNLY AFFIRMED AND SIGNED before me on this {{date}} day of {{month}}, {{year}}.


                                                    _______________________
                                                    OATH COMMISSIONER / NOTARY PUBLIC
                                                    
                                                    Name: ________________
                                                    Registration No.: _____`
    },
    {
        id: 'nda-agreement',
        name: 'Non-Disclosure Agreement (NDA)',
        category: 'contract',
        jurisdiction: 'all',
        description: 'Standard NDA to protect confidential information',
        fields: [
            { id: 'disclosingParty', label: 'Disclosing Party', type: 'text', placeholder: 'e.g., ABC Tech Pvt Ltd', required: true },
            { id: 'receivingParty', label: 'Receiving Party', type: 'text', placeholder: 'e.g., John Doe', required: true },
            { id: 'purpose', label: 'Purpose of Disclosure', type: 'text', placeholder: 'e.g., Project Collaboration', required: true },
            { id: 'duration', label: 'Confidentiality Duration', type: 'text', placeholder: 'e.g., 3 years', required: true },
            { id: 'jurisdictionCity', label: 'Jurisdiction City', type: 'text', placeholder: 'e.g., Bangalore', required: true },
        ],
        content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into on this {{date}} day of {{month}}, {{year}} (the "Effective Date") by and between:

{{disclosingParty}} (the "Disclosing Party")
AND
{{receivingParty}} (the "Receiving Party")

1. PURPOSE:
The Disclosing Party and Receiving Party wish to explore a business opportunity in connection with {{purpose}}.

2. CONFIDENTIAL INFORMATION:
"Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged.

3. OBLIGATIONS:
Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party. Receiving Party shall carefully restrict access to Confidential Information to employees, contractors, and third parties as is reasonably required.

4. DURATION:
The non-disclosure provisions of this Agreement shall survive the termination of this Agreement and Receiving Party's duty to hold Confidential Information in confidence shall remain in effect for {{duration}}.

5. GOVERNING LAW:
This Agreement shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in {{jurisdictionCity}}.

In witness whereof, the parties have executed this Agreement as of the date first above written.

DISCLOSING PARTY:                                   RECEIVING PARTY:
_______________________                             _______________________
{{disclosingParty}}                                 {{receivingParty}}`
    },
    {
        id: 'employment-agreement',
        name: 'Employment Agreement',
        category: 'contract',
        jurisdiction: 'all',
        description: 'Standard employment contract for employees',
        fields: [
            { id: 'employerName', label: 'Employer Name', type: 'text', placeholder: 'Company Name', required: true },
            { id: 'employeeName', label: 'Employee Name', type: 'text', placeholder: 'Full Name', required: true },
            { id: 'jobTitle', label: 'Job Title', type: 'text', placeholder: 'e.g., Software Engineer', required: true },
            { id: 'salary', label: 'Annual Salary', type: 'text', placeholder: 'e.g., Rs. 10,00,000', required: true },
            { id: 'noticePeriod', label: 'Notice Period', type: 'text', placeholder: 'e.g., 30 days', required: true },
        ],
        content: `EMPLOYMENT AGREEMENT

This Employment Agreement (the "Agreement") is made on {{date}} {{month}}, {{year}}, by and between:

{{employerName}} (the "Employer")
AND
{{employeeName}} (the "Employee")

1. APPOINTMENT:
The Employer hereby appoints the Employee as {{jobTitle}}, and the Employee hereby accepts the appointment.

2. COMPENSATION:
The Employee shall be paid an annual salary of {{salary}}, subject to statutory deductions.

3. PROBATION:
The Employee shall be on probation for a period of six months from the date of joining.

4. TERMINATION & NOTICE PERIOD:
Either party may terminate this agreement by giving {{noticePeriod}} notice in writing.

5. CONFIDENTIALITY:
The Employee shall not disclose any confidential information of the Employer to any third party during or after the term of employment.

6. GOVERNING LAW:
This Agreement shall be governed by the laws of India.

In witness whereof, the parties have signed this Agreement on the date mentioned above.

FOR THE EMPLOYER:                                   EMPLOYEE:
_______________________                             _______________________
{{employerName}}                                    {{employeeName}}`
    },
    {
        id: 'power-of-attorney',
        name: 'Power of Attorney (General)',
        category: 'affidavit',
        jurisdiction: 'all',
        description: 'Authorization for an agent to act on behalf of a principal',
        fields: [
            { id: 'principalName', label: 'Principal Name', type: 'text', placeholder: 'Your Name', required: true },
            { id: 'agentName', label: 'Agent Name', type: 'text', placeholder: 'Full Name of Agent', required: true },
            { id: 'agentRelation', label: 'Agent Relation', type: 'text', placeholder: 'e.g., Spouse, Son', required: true },
            { id: 'powers', label: 'Powers Granted', type: 'textarea', placeholder: 'Specific powers to grant', required: true },
        ],
        content: `GENERAL POWER OF ATTORNEY

BY THIS POWER OF ATTORNEY, I, {{principalName}}, residing at _____________, do hereby appoint and constitute {{agentName}}, {{agentRelation}} of {{principalName}}, as my true and lawful Attorney-in-Fact.

My Attorney-at-Law is authorized to act on my behalf and in my name to:

{{powers}}

I hereby agree to ratify and confirm all acts, deeds, and things that my said attorney shall lawfully do or cause to be done by virtue of this Power of Attorney.

This Power of Attorney shall remain in full force and effect until revoked by me in writing.

IN WITNESS WHEREOF, I have executed this Power of Attorney at {{place}} on this {{date}} day of {{month}}, {{year}}.


                                                    _______________________
                                                    PRINCIPAL: {{principalName}}

WITNESSES:
1. ____________________
2. ____________________`
    },
    {
        id: 'will-testament',
        name: 'Last Will and Testament',
        category: 'affidavit',
        jurisdiction: 'all',
        description: 'Legal declaration of asset distribution after death',
        fields: [
            { id: 'testatorName', label: 'Testator Name', type: 'text', placeholder: 'Your Full Name', required: true },
            { id: 'testatorAge', label: 'Age', type: 'number', placeholder: 'Your Age', required: true },
            { id: 'executorName', label: 'Executor Name', type: 'text', placeholder: 'Person to execute the will', required: true },
            { id: 'beneficiaries', label: 'Beneficiary Details', type: 'textarea', placeholder: 'List assets and who inherits them', required: true },
        ],
        content: `LAST WILL AND TESTAMENT

I, {{testatorName}}, son/daughter of _____________, aged {{testatorAge}} years, residing at _____________, being of sound mind and memory and acting of my own free will, do hereby make this my Last Will and Testament, revoking all previous Wills and Codicils.

1. EXECUTOR:
I hereby appoint {{executorName}} as the Executor of this Will.

2. DISTRIBUTION OF ASSETS:
I hereby bequeath and devise my assets in the following manner:

{{beneficiaries}}

3. RESIDUARY CLAUSE:
Any property not otherwise disposed of in this Will shall go to my legal heirs.

I have executed this Will at {{place}} on this {{date}} day of {{month}}, {{year}}, in the presence of the witnesses named below.


                                                    _______________________
                                                    TESTATOR: {{testatorName}}

WITNESSES:
We, the undersigned witnesses, do hereby certify that {{testatorName}} signed this Will in our presence.

1. ____________________
2. ____________________`
    },
    {
        id: 'saas-agreement',
        name: 'SaaS Agreement (Standard)',
        category: 'contract',
        jurisdiction: 'all',
        description: 'Terms for software as a service provision',
        fields: [
            { id: 'providerName', label: 'Service Provider', type: 'text', placeholder: 'Company Name', required: true },
            { id: 'customerName', label: 'Customer Name', type: 'text', placeholder: 'Client Name', required: true },
            { id: 'serviceDescription', label: 'Service Description', type: 'text', placeholder: 'e.g., Cloud Analytics Platform', required: true },
            { id: 'subscriptionFee', label: 'Subscription Fee', type: 'text', placeholder: 'e.g., Monthly Rs. 5000', required: true },
        ],
        content: `SaaS SERVICE AGREEMENT

This SaaS Agreement is made on this {{date}} day of {{month}}, {{year}}, between:

{{providerName}} (the "Provider")
AND
{{customerName}} (the "Customer")

1. SERVICES:
The Provider shall provide the Customer access to {{serviceDescription}} (the "Service") through the Provider's cloud platform.

2. LICENSE:
Provider grants Customer a non-exclusive, non-transferable license to access and use the Service during the term of this Agreement.

3. FEES:
Customer shall pay the Provider a subscription fee of {{subscriptionFee}}.

4. DATA PROTECTION:
The parties shall comply with all applicable data protection laws of India.

5. TERM:
This Agreement shall commence on the Effective Date and remain in force until terminated by either party.

In witness whereof, the parties have executed this Agreement.

FOR THE PROVIDER:                                   FOR THE CUSTOMER:
_______________________                             _______________________
{{providerName}}                                    {{customerName}}`
    },
    // --- STARTUP TEMPLATE PACK ---
    {
        id: 'startup-mutual-nda',
        name: 'Mutual Non-Disclosure Agreement (M-NDA)',
        category: 'startup',
        description: 'Protect confidential information shared by BOTH parties.',
        fields: [
            { id: 'party1', label: 'Party 1 (The Company)', type: 'text', placeholder: 'Your Company Name', required: true },
            { id: 'party2', label: 'Party 2 (Individual/Vendor)', type: 'text', placeholder: 'Recipient Name', required: true },
            { id: 'purpose', label: 'Purpose of Discussion', type: 'text', placeholder: 'e.g., Evaluating a potential business relationship', required: true },
            { id: 'date', label: 'Effective Date', type: 'date', placeholder: '', required: true },
            { id: 'place', label: 'Place of Execution', type: 'text', placeholder: 'e.g., New Delhi', required: true },
        ],
        content: `MUTUAL NON-DISCLOSURE AGREEMENT
        
This Mutual Non-Disclosure Agreement ("Agreement") is entered into on {{date}} at {{place}}, by and between:

{{party1}}, a company incorporated under the Companies Act, 2013, having its office at [Address] ("First Party")

AND

{{party2}}, resident/having office at [Address] ("Second Party").

1. PURPOSE
Both parties wish to disclose certain confidential information to each other for the purpose of {{purpose}} ("Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any non-public information disclosed by either party, including business plans, technical data, trade secrets, and customer lists.

3. MUTUAL CONFIDENTIALITY OBLIGATIONS
Each party agrees:
(a) To hold the other party's Confidential Information in strict confidence;
(b) To use such Information ONLY for the {{purpose}};
(c) Not to disclose such Information to any third party without prior written consent.

4. EXCLUSIONS
Confidentiality does not apply to info that is (i) public, (ii) already known, or (iii) independently developed.

5. REMEDIES
Both parties acknowledge that unauthorized disclosure may cause irreparable harm for which monetary damages may be inadequate.

6. GOVERNING LAW
This Agreement is governed by Indian law. Courts at {{place}} shall have exclusive jurisdiction.

Signed by:

______________________          ______________________
For {{party1}}                  For {{party2}}`
    },
    {
        id: 'startup-founder-agreement',
        name: 'Co-Founder Agreement (Short)',
        category: 'startup',
        riskLevel: 'high',
        description: 'Define equity and roles between co-founders.',
        fields: [
            { id: 'founder1', label: 'Founder 1 Name', type: 'text', placeholder: 'Name', required: true },
            { id: 'founder2', label: 'Founder 2 Name', type: 'text', placeholder: 'Name', required: true },
            { id: 'companyName', label: 'Entity Name', type: 'text', placeholder: 'Proposed Company Name', required: true },
            { id: 'equity1', label: 'Founder 1 Equity (%)', type: 'number', placeholder: '50', required: true },
            { id: 'equity2', label: 'Founder 2 Equity (%)', type: 'number', placeholder: '50', required: true },
            { id: 'vestingPeriod', label: 'Vesting Period (Years)', type: 'number', placeholder: '4', required: true },
        ],
        content: `CO-FOUNDER AGREEMENT

This Agreement is made on [Date] between:

1. {{founder1}}
2. {{founder2}}

(collectively referred to as "Founders").

1. ENTITY
The Founders agree to incorporate a company named "{{companyName}}" (or similar available name).

2. EQUITY SPLIT
The initial equity ownership shall be:
- {{founder1}}: {{equity1}}%
- {{founder2}}: {{equity2}}%

3. VESTING
The shares of the Founders shall be subject to a vesting period of {{vestingPeriod}} years, with a 1-year cliff.

4. ROLES
The Founders shall dedicate full time and effort to the business. Specific roles will be defined by the Board.

5. IP ASSIGNMENT
All intellectual property created by the Founders related to the business is hereby assigned to {{companyName}}.

6. DISPUTE RESOLUTION
Any disputes shall be resolved amicably or through arbitration under the Arbitration and Conciliation Act, 1996.

Signatures:

______________________          ______________________
{{founder1}}                    {{founder2}}`
    },
    {
        id: 'startup-offer-letter',
        name: 'Employment Offer Letter',
        category: 'startup',
        description: 'Standard offer letter for new hires.',
        fields: [
            { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Company Name', required: true },
            { id: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'Full Name', required: true },
            { id: 'role', label: 'Job Title', type: 'text', placeholder: 'e.g., Software Engineer', required: true },
            { id: 'salary', label: 'Annual CTC (INR)', type: 'text', placeholder: 'e.g., 12,00,000', required: true },
            { id: 'joiningDate', label: 'Joining Date', type: 'date', placeholder: '', required: true },
        ],
        content: `OFFER OF EMPLOYMENT

Date: [Date]

To,
{{candidateName}}

Dear {{candidateName}},

We are pleased to offer you the position of {{role}} at {{companyName}}.

1. PREAMBLE
We were impressed with your skills and believe you will be a valuable asset to our team.

2. COMPENSATION
Your Annual CTC will be ₹{{salary}}, subject to statutory deductions. Detailed breakup is attached.

3. JOINING DATE
You are expected to join us on {{joiningDate}}.

4. PROBATION
You will be on probation for a period of 3 months.

5. NOTICE PERIOD
The notice period for termination is 30 days by either party.

We look forward to building {{companyName}} with you.

Sincerely,

______________________
HR / Authorized Signatory
{{companyName}}

Accepted: ______________________ ({{candidateName}})`
    },
    {
        id: 'startup-consultant-agreement',
        name: 'Consultant Agreement',
        category: 'startup',
        description: 'Agreement for external consultants or freelancers.',
        fields: [
            { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Company Name', required: true },
            { id: 'consultantName', label: 'Consultant Name', type: 'text', placeholder: 'Name of Consultant', required: true },
            { id: 'scopeOfWork', label: 'Scope of Work', type: 'textarea', placeholder: 'Describe the specific deliverables...', required: true },
            { id: 'fees', label: 'Consultancy Fees', type: 'text', placeholder: 'e.g., ₹50,000 per month', required: true },
            { id: 'term', label: 'Term (Months/Weeks)', type: 'text', placeholder: 'e.g., 6 months', required: true },
        ],
        content: `CONSULTANCY AGREEMENT

This Consultancy Agreement ("Agreement") is entered into on [Date] by and between:

{{companyName}}, a company incorporated under the laws of India ("Company")

AND

{{consultantName}}, a consultant/independent contractor ("Consultant").

1. ENGAGEMENT
The Company hereby engages the Consultant to provide the services described in the Scope of Work.

2. SCOPE OF WORK
{{scopeOfWork}}

3. FEES AND PAYMENT
The Company shall pay the Consultant a fee of {{fees}} for the services rendered. Payments shall be made within 15 days of invoice.

4. INDEPENDENT CONTRACTOR
The Consultant is an independent contractor and not an employee of the Company.

5. INTELLECTUAL PROPERTY
All work product created by the Consultant for the Company shall be the sole property of the Company.

6. TERM AND TERMINATION
This Agreement shall be for a term of {{term}}. Either party may terminate with 15 days' notice.

Signatures:

______________________          ______________________
For {{companyName}}              {{consultantName}}`
    }
];

// Helper function to get templates by category
export const getTemplatesByCategory = (category: LegalTemplate['category']): LegalTemplate[] => {
    return legalTemplates.filter(template => template.category === category);
};

// Helper function to get template by ID
export const getTemplateById = (id: string): LegalTemplate | undefined => {
    return legalTemplates.find(template => template.id === id);
};

// Helper function to replace placeholders with values
export const replacePlaceholders = (content: string, values: Record<string, string>): string => {
    let result = content;

    // Auto-fill date fields if not provided
    const now = new Date();
    const defaultValues = {
        date: now.getDate().toString(),
        month: now.toLocaleString('default', { month: 'long' }),
        year: now.getFullYear().toString(),
        ...values
    };

    Object.entries(defaultValues).forEach(([key, value]) => {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(placeholder, value || `{{${key}}}`);
    });

    return result;
};

// Get all unique categories
export const getCategories = (): Array<{ value: LegalTemplate['category'], label: string }> => {
    return [
        { value: 'vakalatnama', label: 'Vakalatnama' },
        { value: 'notice', label: 'Legal Notices' },
        { value: 'petition', label: 'Petitions' },
        { value: 'affidavit', label: 'Affidavits' },
        { value: 'contract', label: 'Contracts' },
        { value: 'startup', label: 'Startup Pack' }
    ];
};
