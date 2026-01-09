import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Lightbulb, ArrowRight, BookOpen } from 'lucide-react';

interface FounderResponse {
    summary: string;
    whatThisMeans: string;
    nextSteps: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    legalBasis?: string;
}

interface FounderResponseCardProps {
    response: FounderResponse;
    simplified?: boolean;
}

const RiskBadge = ({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' }) => {
    const config = {
        LOW: {
            bg: 'bg-green-100 dark:bg-green-900/20',
            text: 'text-green-700 dark:text-green-400',
            icon: CheckCircle2,
            label: 'Low Risk'
        },
        MEDIUM: {
            bg: 'bg-yellow-100 dark:bg-yellow-900/20',
            text: 'text-yellow-700 dark:text-yellow-400',
            icon: Info,
            label: 'Medium Risk'
        },
        HIGH: {
            bg: 'bg-red-100 dark:bg-red-900/20',
            text: 'text-red-700 dark:text-red-400',
            icon: AlertTriangle,
            label: 'High Risk'
        }
    };

    const { bg, text, icon: Icon, label } = config[level];

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${bg}`}>
            <Icon className={`w-4 h-4 ${text}`} />
            <span className={`text-xs font-medium ${text}`}>{label}</span>
        </div>
    );
};

export const FounderResponseCard: React.FC<FounderResponseCardProps> = ({ response, simplified }) => {
    const [showLegalBasis, setShowLegalBasis] = React.useState(false);

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Risk Indicator */}
            <div className="flex items-center justify-between">
                <RiskBadge level={response.riskLevel} />
                <span className="text-xs text-zinc-500">AI-Powered Assessment</span>
            </div>

            {/* Plain-English Summary */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg shrink-0">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-2">
                            📝 Bottom Line
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                            {response.summary}
                        </p>
                    </div>
                </div>
            </div>

            {/* What This Means */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg shrink-0">
                        <Info className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-sm text-purple-900 dark:text-purple-100 mb-2">
                            💡 What This Means for Your Business
                        </h3>
                        <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                            {response.whatThisMeans}
                        </p>
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-500 rounded-lg shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-sm text-green-900 dark:text-green-100 mb-3">
                            ✅ Next Steps
                        </h3>
                        <ul className="space-y-2">
                            {response.nextSteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-200">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-xs font-medium shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <span className="flex-1 leading-relaxed">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Legal Basis (Collapsible) - Only show in detailed mode (simplified=false) */}
            {response.legalBasis && !simplified && (
                <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                    <button
                        onClick={() => setShowLegalBasis(!showLegalBasis)}
                        className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-zinc-500" />
                            <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300">
                                📚 Legal Basis (Detailed View)
                            </span>
                        </div>
                        <ArrowRight
                            className={`w-4 h-4 text-zinc-500 transition-transform ${showLegalBasis ? 'rotate-90' : ''}`}
                        />
                    </button>

                    {showLegalBasis && (
                        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 animate-in slide-in-from-top-2 duration-200">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {response.legalBasis}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
