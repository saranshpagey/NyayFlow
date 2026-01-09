import React from 'react';
import { cn } from '../../lib/utils';
import { Mail, Phone, MapPin, Globe } from 'iconoir-react';

interface LetterheadProps {
    children: React.ReactNode;
    advocateName?: string;
    designation?: string;
    enrollmentNo?: string;
    address?: string;
    phone?: string;
    email?: string;
    hideHeader?: boolean;
}

export const Letterhead: React.FC<LetterheadProps> = ({
    children,
    advocateName = "ADITYA VERMA",
    designation = "Advocate, High Court & Supreme Court",
    enrollmentNo = "MAH/1234/2015",
    address = "Chamber No. 405, Lawyers Chamber Block, High Court of Delhi, New Delhi - 110003",
    phone = "+91 98765 43210",
    email = "aditya.verma@legal.com",
    hideHeader = false
}) => {
    if (hideHeader) {
        return (
            <div className="bg-white text-black font-serif p-16 min-h-[1123px]">
                {children}
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-[1123px] bg-white text-black font-serif shadow-sm">
            {/* Header */}
            <div className="pt-12 px-12 pb-6 flex flex-col items-center border-b-2 border-zinc-900 border-double mx-12">
                <h1 className="text-3xl font-semibold tracking-wide text-zinc-900 uppercase mb-1">
                    {advocateName}
                </h1>
                <p className="text-sm text-zinc-600 uppercase tracking-widest mb-1">
                    {designation}
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                    Enrolment No: {enrollmentNo}
                </p>
            </div>

            {/* Ref/Date Ribbon */}
            <div className="flex justify-between px-16 py-4 text-xs font-semibold text-zinc-900">
                <div>Ref. No: ___________</div>
                <div>Date: {new Date().toLocaleDateString()}</div>
            </div>

            {/* Content */}
            <div className="px-16 py-4 min-h-[700px] text-justify leading-relaxed">
                {children}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-zinc-50 border-t border-zinc-200 py-6 px-12 mx-12 mb-12">
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-zinc-600 uppercase tracking-wide">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        {address}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-zinc-400" />
                        {phone}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-zinc-400" />
                        {email}
                    </div>
                </div>
            </div>

            {/* Side Accent */}
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-zinc-900"></div>
        </div>
    );
};
