import React from 'react';
import { Rocket, Users, FileText, ShieldCheck, Sparkles } from 'lucide-react';

interface QuestionCategory {
    category: string;
    icon: React.ElementType;
    color: string;
    questions: string[];
}

interface FounderQuestionLibraryProps {
    onSelectQuestion: (question: string) => void;
}

const FOUNDER_QUESTIONS: QuestionCategory[] = [
    {
        category: "Getting Started",
        icon: Rocket,
        color: "orange",
        questions: [
            "What's the difference between LLP and Private Limited?",
            "Do I need to register my startup name?",
            "What licenses do I need to start an online business?",
            "How much does it cost to incorporate a company?"
        ]
    },
    {
        category: "Hiring & HR",
        icon: Users,
        color: "blue",
        questions: [
            "How do I hire my first employee legally?",
            "What should be in an offer letter?",
            "Can I hire contractors instead of employees?",
            "What are my obligations when terminating an employee?"
        ]
    },
    {
        category: "Contracts & IP",
        icon: FileText,
        color: "purple",
        questions: [
            "What should my NDA include?",
            "How do I protect my brand name?",
            "Do I need a founder agreement?",
            "Can I trademark my logo?"
        ]
    },
    {
        category: "Compliance",
        icon: ShieldCheck,
        color: "green",
        questions: [
            "When do I need GST registration?",
            "What are my tax obligations as a startup?",
            "Do I need a privacy policy for my website?",
            "What licenses are required for e-commerce?"
        ]
    }
];

const getColorClasses = (color: string) => {
    const colors = {
        orange: {
            icon: 'text-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-900/10',
            border: 'border-orange-200 dark:border-orange-800',
            hover: 'hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
        },
        blue: {
            icon: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/10',
            border: 'border-blue-200 dark:border-blue-800',
            hover: 'hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
        },
        purple: {
            icon: 'text-purple-500',
            bg: 'bg-purple-50 dark:bg-purple-900/10',
            border: 'border-purple-200 dark:border-purple-800',
            hover: 'hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
        },
        green: {
            icon: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/10',
            border: 'border-green-200 dark:border-green-800',
            hover: 'hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
        }
    };
    return colors[color as keyof typeof colors] || colors.orange;
};

export const FounderQuestionLibrary: React.FC<FounderQuestionLibraryProps> = ({ onSelectQuestion }) => {
    return (
        <div className="max-w-5xl mx-auto space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Founder Mode</span>
                </div>
                <h2 className="text-3xl font-semibold text-zinc-900 dark:text-white">
                    Popular Legal Questions for Founders
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                    Get instant answers to common startup legal questions. Click any question to start researching.
                </p>
            </div>

            {/* Question Categories */}
            <div className="space-y-8">
                {FOUNDER_QUESTIONS.map((category, idx) => {
                    const colors = getColorClasses(category.color);
                    const Icon = category.icon;

                    return (
                        <div
                            key={category.category}
                            className="space-y-4"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Category Header */}
                            <div className="flex items-center gap-3">
                                <div className={`p-2 ${colors.bg} rounded-lg`}>
                                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                                </div>
                                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                    {category.category}
                                </h3>
                                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                            </div>

                            {/* Questions Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {category.questions.map((question, qIdx) => (
                                    <button
                                        key={qIdx}
                                        onClick={() => onSelectQuestion(question)}
                                        className={`group p-4 text-left text-sm bg-white dark:bg-zinc-900 border ${colors.border} rounded-xl ${colors.hover} transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
                                                <span className={`text-xs font-medium ${colors.icon}`}>
                                                    {qIdx + 1}
                                                </span>
                                            </div>
                                            <span className="flex-1 text-zinc-700 dark:text-zinc-300 leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                                {question}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Note */}
            <div className="text-center pt-4">
                <p className="text-xs text-zinc-500">
                    💡 Tip: These are just starting points. Feel free to ask any legal question about your startup!
                </p>
            </div>
        </div>
    );
};
