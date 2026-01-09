import React from 'react';
import { motion } from 'framer-motion';
import { GraphUp, InfoCircle, NavArrowRight, ShieldCheck } from 'iconoir-react';
import { cn } from '../../lib/utils';

interface OutcomeWidgetProps {
    data: {
        probability: number;
        verdict_counts: {
            allowed: number;
            dismissed: number;
        };
        leading_precedent?: string;
        confidence: string;
        brief_reason: string;
    };
}

export const OutcomeWidget: React.FC<OutcomeWidgetProps> = ({ data }) => {
    const { probability, verdict_counts, leading_precedent, confidence, brief_reason } = data;

    // Determine color based on probability
    const getColor = (prob: number) => {
        if (prob >= 70) return 'text-emerald-600 dark:text-emerald-400';
        if (prob >= 40) return 'text-amber-600 dark:text-amber-400';
        return 'text-rose-600 dark:text-rose-400';
    };

    const getBgColor = (prob: number) => {
        if (prob >= 70) return 'bg-emerald-50 dark:bg-emerald-900/20';
        if (prob >= 40) return 'bg-amber-50 dark:bg-amber-900/20';
        return 'bg-rose-50 dark:bg-rose-900/20';
    };

    const strokeColor = probability >= 70 ? '#10b981' : probability >= 40 ? '#f59e0b' : '#f43f5e';

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <GraphUp className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-none">Outcome Oracle</h3>
                </div>
                <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider", getBgColor(probability), getColor(probability))}>
                    {confidence} Confidence
                </div>
            </div>

            <div className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                    {/* Radial Progress */}
                    <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-zinc-100 dark:text-zinc-800"
                            />
                            <motion.circle
                                cx="64"
                                cy="64"
                                r="58"
                                fill="transparent"
                                stroke={strokeColor}
                                strokeWidth="8"
                                strokeDasharray={364.4}
                                initial={{ strokeDashoffset: 364.4 }}
                                animate={{ strokeDashoffset: 364.4 - (364.4 * probability) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className={cn("text-3xl font-display font-medium", getColor(probability))}>{probability}%</span>
                            <span className="text-xs text-zinc-500 font-medium uppercase tracking-tight">Success Trend</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5" /> Statistical Basis
                            </h4>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden flex">
                                    <div
                                        className="h-full bg-emerald-500"
                                        style={{ width: `${(verdict_counts.allowed / (verdict_counts.allowed + verdict_counts.dismissed)) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs font-mono text-zinc-500 whitespace-nowrap">
                                    {verdict_counts.allowed} vs {verdict_counts.dismissed}
                                </span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-xs font-medium text-zinc-400 uppercase tracking-tight">Allowed</span>
                                <span className="text-xs font-medium text-zinc-400 uppercase tracking-tight">Dismissed</span>
                            </div>
                        </div>

                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                                "{brief_reason}"
                            </p>
                        </div>
                    </div>
                </div>

                {leading_precedent && (
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-2">Prime Precedent</h4>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/30 group cursor-pointer hover:border-indigo-400 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-medium text-xs shadow-md shadow-indigo-200">
                                    SC
                                </div>
                                <span className="text-xs font-medium text-zinc-900 dark:text-white truncate max-w-[200px]">
                                    {leading_precedent}
                                </span>
                            </div>
                            <NavArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                )}

                <div className="mt-4 flex items-start gap-2 text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-800/30 p-2 rounded-lg leading-normal">
                    <InfoCircle className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                    <span>This analysis is generated across 8 recent precedents in the database. Probabilities represent historical trends and are not legal certainties.</span>
                </div>
            </div>
        </div>
    );
};
