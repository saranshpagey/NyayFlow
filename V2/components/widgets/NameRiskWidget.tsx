import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Search, InfoCircle, ThumbsUp, ThumbsDown } from 'iconoir-react';
import { cn } from '../../lib/utils';

interface NameRiskWidgetProps {
    data: {
        name: string;
        risk_score: number; // 0 to 100
        risk_level: 'green' | 'yellow' | 'red';
        conflicts: string[];
        recommendation: string;
    };
}

export const NameRiskWidget: React.FC<NameRiskWidgetProps> = ({ data }) => {
    const { name, risk_score, risk_level, conflicts, recommendation } = data;

    const riskConfigs = {
        green: {
            color: 'text-emerald-600 dark:text-emerald-400',
            stroke: 'var(--emerald-500)',
            icon: ShieldCheck,
            label: 'Strong Availability'
        },
        yellow: {
            color: 'text-amber-600 dark:text-amber-400',
            stroke: 'var(--amber-500)',
            icon: InfoCircle,
            label: 'Moderate Conflict Risk'
        },
        red: {
            color: 'text-rose-600 dark:text-rose-400',
            stroke: 'var(--rose-500)',
            icon: ShieldAlert,
            label: 'High Conflict Risk'
        }
    };

    const config = riskConfigs[risk_level] || riskConfigs.yellow;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-md max-w-md"
        >
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className={cn("p-2 rounded-xl bg-opacity-10", config.color, "bg-current")}>
                    <config.icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Business Name Risk Gauge</h3>
                    <p className="text-xxs text-zinc-500 uppercase font-bold tracking-tight">Checking: "{name}"</p>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-center mb-8 relative">
                    {/* Simplified Gauge */}
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="12"
                                className="text-zinc-100 dark:text-zinc-800"
                            />
                            <motion.circle
                                cx="80"
                                cy="80"
                                r="70"
                                fill="transparent"
                                stroke={config.stroke}
                                strokeWidth="12"
                                strokeDasharray={440}
                                initial={{ strokeDashoffset: 440 }}
                                animate={{ strokeDashoffset: 440 - (440 * risk_score) / 100 }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className={cn("text-4xl font-display font-medium", config.color)}>{risk_score}%</span>
                            <span className="text-xxs text-zinc-400 font-bold uppercase tracking-wider">Risk Score</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
                        <div className={cn("absolute left-0 top-0 bottom-0 w-1", risk_level === 'green' ? 'bg-emerald-500' : risk_level === 'yellow' ? 'bg-amber-500' : 'bg-rose-500')} />
                        <h4 className="text-xxs font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <ShieldCheck className="w-3 h-3" /> Professional Advisory
                        </h4>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-normal">
                            {recommendation}
                        </p>
                    </div>

                    {conflicts.length > 0 && (
                        <div>
                            <h4 className="text-xxs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <Search className="w-3 h-3" /> Potential Conflicts Identified
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {conflicts.map((conflict, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 shadow-sm">
                                        {conflict}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20">
                    <InfoCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 italic leading-snug">
                        Note: This risk gauge is an AI-powered screening based on the Trade Marks Act 1999 and newly ingested corporate data. It should be followed by a formal Ministry of Corporate Affairs (MCA) search.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4">
                    <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-green-600 transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors">
                        <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
