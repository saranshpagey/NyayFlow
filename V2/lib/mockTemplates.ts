export interface Template {
    id: string;
    title: string;
    description: string;
    category: 'Notice' | 'Contract' | 'Affidavit';
    content: string; // Handlebars-style placeholders
}

export const MOCK_TEMPLATES: Template[] = [
    {
        id: 'notice-138',
        title: 'Legal Notice: Section 138 NI Act',
        description: 'Standard notice for dishonour of cheque due to insufficiency of funds.',
        category: 'Notice',
        content: `LEGAL NOTICE

To,
{{drawer_name}}
{{drawer_address}}

Sub: Notice under Section 138 of the Negotiable Instruments Act, 1881 regarding dishonour of Cheque No. {{cheque_no}} dated {{cheque_date}} for Rs. {{amount}}.

Dear Sir/Madam,

Under instruction and on behalf of my client {{payee_name}}, resident of {{payee_address}}, I serve upon you the following legal notice:

1. That you issued a Cheque bearing No. {{cheque_no}} dated {{cheque_date}} for a sum of Rs. {{amount}} drawn on {{bank_name}} in discharge of your liability towards my client.
2. That my client presented the said cheque for encashment, but the same was returned unpaid by your banker with the remarks "Insufficiency of Funds" vide Return Memo dated {{return_date}}.
3. That my client approached you and informed you about the dishonour, but you failed to make the payment.

I hereby call upon you to make the payment of Rs. {{amount}} within 15 days of receipt of this notice, failing which my client shall be constrained to initiate criminal proceedings against you under Section 138 of the Negotiable Instruments Act, 1881.

Yours faithfully,

{{advocate_name}}
Advocate`
    },
    {
        id: 'rent-agreement',
        title: 'Residential Rent Agreement',
        description: '11-month standard rent agreement for residential property.',
        category: 'Contract',
        content: `RENT AGREEMENT

This Rent Agreement is made on this {{agreement_date}} at {{city}} BETWEEN:

{{landlord_name}}, S/o {{landlord_father_name}}, R/o {{landlord_address}} (hereinafter called the LESSOR);

AND

{{tenant_name}}, S/o {{tenant_father_name}}, R/o {{tenant_permanent_address}} (hereinafter called the LESSEE).

WHEREAS the Lessor is the absolute owner of the property situated at {{property_address}}.

NOW THIS DEED WITNESSETH AS UNDER:
1. That the Lessee shall pay a monthly rent of Rs. {{rent_amount}} excluding electricity and water charges.
2. That this lease is granted for a period of 11 months commencing from {{start_date}}.
...`
    }
];
