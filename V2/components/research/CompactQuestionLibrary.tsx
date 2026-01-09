import React from 'react';
import { Rocket, Users, FileText, ShieldCheck } from 'lucide-react';

interface CompactQuestionLibraryProps {
    onSelectQuestion: (question: string) => void;
}

const FOUNDER_CATEGORIES = [
    {
        title: "Quick Start",
        icon: Rocket,
        color: "orange",
        bg: "bg-orange-50 dark:bg-orange-900/10",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-100 dark:border-orange-800",
        questions: [
            "Difference between LLP and Pvt Ltd?",
            "Register startup name?",
            "Cost to incorporate?"
        ]
    },
    {
        title: "Hiring",
        icon: Users,
        color: "blue",
        bg: "bg-blue-50 dark:bg-blue-900/10",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-100 dark:border-blue-800",
        questions: [
            "Hire first employee?",
            "Offer letter template?",
            "Contractor vs Employee"
        ]
    },
    {
        title: "IP & Brand",
        icon: FileText,
        color: "purple",
        bg: "bg-purple-50 dark:bg-purple-900/10",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-100 dark:border-purple-800",
        questions: [
            "NDA Essentials",
            "Trademark my logo?",
            "Founder Agreement"
        ]
    }
];

export const CompactQuestionLibrary: React.FC<CompactQuestionLibraryProps> = ({ onSelectQuestion }) => {
    return (
        <div className="w-full flex justify-center">
            <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
                {FOUNDER_CATEGORIES.map((category, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col gap-3 p-4 rounded-3xl border border-transparent ${category.bg} min-w-[280px] backdrop-blur-sm transition-all hover:scale-[1.02] cursor-default`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <category.icon className={`w-4 h-4 ${category.text}`} />
                            <span className={`text-[11px] font-bold uppercase tracking-widest ${category.text}`}>
                                {category.title}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {category.questions.map((q, qIdx) => (
                                <button
                                    key={qIdx}
                                    onClick={() => onSelectQuestion(q)}
                                    className="text-left text-[13px] font-medium px-4 py-3 bg-white hover:bg-white/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 rounded-xl text-zinc-700 dark:text-zinc-200 transition-all shadow-sm hover:shadow-md border border-zinc-100 dark:border-zinc-700/50"
                                    title={q}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
