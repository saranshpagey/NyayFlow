#!/usr/bin/env python3
"""
NyayaFlow: Legal Template Importer
Ingests high-quality legal draft formats for paralegal automation.
"""

import os
from pathlib import Path

TEMPLATES = [
    {
        "title": "Legal Notice for Cheque Bounce (Section 138 NI Act)",
        "category": "Drafting / Notice",
        "content": """# LEGAL NOTICE: DISHONOUR OF CHEQUE
**Under Section 138 of the Negotiable Instruments Act, 1881**

To,
[Name of the Accused]
[Address]

**Subject: Notice under Section 138 of the Negotiable Instruments Act, 1881 regarding dishonour of Cheque No. [No.] for Rs. [Amount].**

Dear Sir/Madam,

Under instructions from my client [Client Name], resident of [Address], I hereby serve you with the following legal notice:

1. That you issued a cheque bearing No. [No.] dated [Date] drawn on [Bank Name] for a sum of Rs. [Amount] towards the discharge of your legally enforceable debt/liability.
2. That my client presented the said cheque for encashment through their bankers [Client Bank], but the same was returned unpaid by your bank with the remarks "[Reason - e.g., Insufficient Funds]" via return memo dated [Memo Date].
3. That my client informed you about the dishonour, but you have failed to make the payment.

I, therefore, through this notice, call upon you to make the payment of the said amount of Rs. [Amount] to my client within 15 (fifteen) days from the receipt of this notice. 

Failing which, my client shall be constrained to initiate criminal proceedings against you under Section 138 of the Negotiable Instruments Act, 1881, and other applicable laws, at your risk and cost.

Yours faithfully,
[Advocate Name]
[Date]"""
    },
    {
        "title": "Regular Bail Application (Section 439 CrPC / BNSS)",
        "category": "Drafting / Bail",
        "content": """# APPLICATION FOR REGULAR BAIL
**In the Court of [Court Name, e.g., Sessions Judge, New Delhi]**
**Application No. ______ of 202X**

In the matter of:
[Name of Accused] ...Applicant/Accused
Versus
State (NCT of Delhi) ...Respondent

**FIR No.:** [No.]
**Date:** [Date]
**Police Station:** [P.S. Name]
**Under Sections:** [e.g., 307/34 IPC]

**APPLICATION UNDER SECTION 439 OF THE CODE OF CRIMINAL PROCEDURE FOR GRANT OF REGULAR BAIL**

Most Respectfully Showeth:

1. That the applicant is a law-abiding citizen and has been falsely implicated in the above-mentioned FIR.
2. That the applicant was arrested on [Arrest Date] and is currently in judicial custody.
3. That the allegations against the applicant are vague, motivated, and not supported by any recovery from the applicant.
4. That the applicant has deep roots in society and is a permanent resident of [Address]. There is no risk of the applicant absconding or fleeing from justice.
5. That the applicant undertakes to join the investigation and cooperate with the trial as and when required.
6. That no other bail application is pending before this or any other court.

**PRAYER:**
It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to grant regular bail to the applicant in FIR No. [No.] PS [Name], in the interest of justice.

Applicant/Accused
Through Advocate
[Date]"""
    },
    {
        "title": "Vakalatnama (Advocate Authorization)",
        "category": "Drafting / Formal",
        "content": """# VAKALATNAMA
**In the Court of [Court Name]**
**Suit/Case No. ______ of 202X**

[Plaintiff/Petitioner/Complainant Name] ...Plaintiff/Petitioner
Versus
[Defendant/Respondent Name] ...Defendant/Respondent

KNOW ALL to whom these presents shall come that I/We [Client Name(s)] do hereby appoint:
**[Advocate Name(s)]**
to be my/our Advocate(s) in the above-mentioned case.

I/We authorize the said Advocate(s) to appear, plead, and act on my/our behalf; to file appeals, revisions, or petitions; to withdraw or settle the case; and to receive payments on my/our behalf.

All acts done by the said Advocate(s) shall be binding on me/us as if done by me/us personally.

Date: [Date]
Place: [Place]

(Signature of Client)
(Accepted by Advocate)"""
    }
]

def main():
    print("📝 NyayaFlow Template Importer Starting...")
    
    target_dir = Path(__file__).parent / "data" / "templates"
    target_dir.mkdir(parents=True, exist_ok=True)
    
    for t in TEMPLATES:
        filename = t['title'].lower().replace(" ", "_").replace("/", "_").replace("(", "").replace(")", "").replace(",", "") + ".md"
        with open(target_dir / filename, "w", encoding="utf-8") as f:
            # Add metadata block for better RAG retrieval
            f.write(f"TITLE: {t['title']}\nCATEGORY: {t['category']}\nTYPE: Legal Draft Template\n\n{t['content']}")
        print(f"   ✅ Saved: {filename}")

    print(f"\n✨ Successfully imported {len(TEMPLATES)} templates.")
    print(f"📂 Next: Run 'python ingest.py' to index './data/templates' into the Vector DB.")

if __name__ == "__main__":
    main()
