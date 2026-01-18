import React from 'react';
import { motion } from 'framer-motion';
import {
    Sparks,
    CheckCircle,
    ArrowRight,
    WarningTriangle,
    ThumbsUp,
    ThumbsDown,
    InfoCircle,
    List
} from 'iconoir-react';
import { cn } from '../../lib/utils';

interface StartUpInsightWidgetProps {
    data: {
        summary: string;
        actionPlan: string[];
        riskLevel: 'green' | 'yellow' | 'red';
    };
}

export const StartUpInsightWidget: React.FC<StartUpInsightWidgetProps> = ({ data }) => {
    const { summary, actionPlan, riskLevel } = data;

    const riskConfigs = {
        green: {
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
            borderColor: 'border-emerald-100 dark:border-emerald-800',
            icon: CheckCircle,
            label: 'Low Risk / Compliant'
        },
        yellow: {
            color: 'text-amber-600 dark:text-amber-400',
            bgColor: 'bg-amber-50 dark:bg-amber-900/20',
            borderColor: 'border-amber-100 dark:border-amber-800',
            icon: InfoCircle,
            label: 'Caution / Action Needed'
        },
        red: {
            color: 'text-rose-600 dark:text-rose-400',
            bgColor: 'bg-rose-50 dark:bg-rose-900/20',
            borderColor: 'border-rose-100 dark:border-rose-800',
            icon: WarningTriangle,
            label: 'High Risk / Immediate Action'
        }
    };

    const config = riskConfigs[riskLevel] || riskConfigs.yellow;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm max-w-2xl"
        >
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                        <InfoCircle className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-none">Startup Strategy Insight</h3>
                </div>
                <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5", config.bgColor, config.color)}>
                    <config.icon className="w-3 h-3" />
                    {config.label}
                </div>
            </div>

            <div className="p-6">
                {/* Summary Section */}
                <div className="mb-6">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">The Bottom Line</h4>
                    <p className="text-lg font-display font-medium text-zinc-900 dark:text-white leading-tight">
                        {summary}
                    </p>
                </div>

                {/* Action Plan Section */}
                {actionPlan && actionPlan.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                            <List className="w-3 h-3" /> Recommended Action Plan
                        </h4>
                        <div className="space-y-2">
                            {actionPlan.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="flex items-start gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900/30 transition-colors"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-500 shadow-sm">
                                        {idx + 1}
                                    </div>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug pt-0.5">
                                        {step}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Subject: Corporate Compliance / {riskLevel === 'red' ? 'High Priority' : 'Advisory'}</span>

                    <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-green-600 transition-colors">
                            <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors">
                            <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
