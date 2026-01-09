import React, { useState } from 'react';

export const VakalatnamaTemplate = () => {
    // State for dynamic fields to ensure they can be captured/exported
    const [caseNo, setCaseNo] = useState("_________________");
    const [appellant, setAppellant] = useState("_________________");
    const [respondent, setRespondent] = useState("_________________");
    const [clientName, setClientName] = useState("_________________");
    const [advocateName, setAdvocateName] = useState("_________________");

    return (
        <div className="w-full max-w-[800px] mx-auto bg-white min-h-[1000px] p-12 text-black font-serif shadow-xl">
            {/* Header */}
            <div className="text-center mb-8 space-y-4">
                <h1 className="text-2xl font-semibold underline decoration-2 underline-offset-4 tracking-widest">VAKALATNAMA</h1>
                <div className="mt-6 text-lg">
                    <p className="font-semibold">IN THE COURT OF</p>
                    <div
                        contentEditable
                        className="border-b border-black outline-none min-w-[300px] inline-block text-center mt-1 px-2 empty:before:content-['_________________________']"
                    ></div>
                </div>
            </div>

            {/* Case Details Box */}
            <div className="flex justify-between items-start mb-6 w-full">
                <div className="w-1/3">
                    <p className="font-semibold text-sm">Case Type / No.</p>
                </div>
                <div className="w-2/3 border-b border-black">
                    <input
                        type="text"
                        value={caseNo}
                        onChange={(e) => setCaseNo(e.target.value)}
                        className="w-full bg-transparent outline-none font-semibold text-center"
                    />
                </div>
            </div>

            {/* Parties */}
            <div className="space-y-4 mb-8 text-lg leading-relaxed">
                <div className="flex gap-4">
                    <span className="font-semibold w-32 shrink-0">Plaintiff / Appellant:</span>
                    <input
                        className="flex-1 border-b border-black outline-none bg-transparent"
                        value={appellant}
                        onChange={(e) => setAppellant(e.target.value)}
                    />
                </div>

                <div className="text-center font-semibold text-sm tracking-widest my-2">VERSUS</div>

                <div className="flex gap-4">
                    <span className="font-semibold w-32 shrink-0">Defendant / Respondent:</span>
                    <input
                        className="flex-1 border-b border-black outline-none bg-transparent"
                        value={respondent}
                        onChange={(e) => setRespondent(e.target.value)}
                    />
                </div>
            </div>

            {/* Authorization Body */}
            <div className="text-justify text-[15px] leading-7 mb-8 space-y-4">
                <p>
                    I / We, <span className="font-semibold border-b border-black px-2 inline-block min-w-[200px]" contentEditable onInput={(e) => setClientName(e.currentTarget.textContent || "")}></span> the undersigned, do hereby appoint and retain <span className="font-semibold border-b border-black px-2 inline-block min-w-[200px]" contentEditable onInput={(e) => setAdvocateName(e.currentTarget.textContent || "")}></span>, Advocate(s) to act and appear for me/us in the above Suit / Appeal / Petition and on my/our behalf to conduct and prosecute (or defend) the same and all proceedings that may be taken in respect of any application connected with the same or any decree or order passed therein.
                </p>
                <p>
                    I / We authorise the said Advocate(s) to admit any compromise or give up any claim or to withdraw any suit or proceedings and to file any application for execution of the decree or order and to deposit, draw and receive money, cheques, cash and grant receipts thereof and to do all other acts and things which may be necessary to be done for the progress and in the course of the prosecution (or defence) of the said Suit / Appeal / Petition.
                </p>
                <p>
                    I / We agree to ratify all acts done by the Advocate(s) in pursuance of this authority.
                </p>
            </div>

            {/* Date and Place */}
            <div className="flex justify-between items-end mt-12 mb-16">
                <div className="space-y-2">
                    <p>Dated this <span className="border-b border-black px-4 inline-block w-16 text-center">{new Date().getDate()}</span> day of <span className="border-b border-black px-4 inline-block w-24 text-center">{new Date().toLocaleString('default', { month: 'long' })}</span>, 20<span className="border-b border-black px-2 inline-block w-8 text-center">{new Date().getFullYear().toString().slice(-2)}</span></p>
                    <p>Place: <span className="border-b border-black px-4 inline-block w-32" contentEditable></span></p>
                </div>
                <div className="text-center">
                    <div className="h-16 w-40 border-b border-black mb-2"></div>
                    <p className="font-semibold text-sm">(Signature of Client)</p>
                </div>
            </div>

            {/* Acceptance */}
            <div className="border-t-2 border-black pt-4">
                <p className="font-semibold text-center mb-4 text-sm uppercase tracking-wider">Accepted</p>
                <div className="flex justify-end mt-8">
                    <div className="text-center">
                        <div className="h-12 w-40 border-b border-black mb-2"></div>
                        <p className="font-semibold text-sm">(Signature of Advocate)</p>
                        <p className="text-xs mt-1">{advocateName !== "_________________" ? advocateName : ""}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
