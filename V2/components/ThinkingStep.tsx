import React, { useState } from 'react';
import { Check, SystemRestart, Search, InfoCircle, NavArrowDown, NavArrowUp } from 'iconoir-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ThinkingStepStatus = 'waiting' | 'working' | 'done';

export interface ThinkingStepProps {
    title: string;
    details?: string; // Optional detailed logs
    status: ThinkingStepStatus;
    type?: 'search' | 'reasoning' | 'review';
}

export const ThinkingStep: React.FC<ThinkingStepProps> = ({ title, details, status, type = 'reasoning' }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getIcon = () => {
        if (status === 'working') return <SystemRestart className="w-4 h-4 text-blue-500 animate-spin" />;
        if (status === 'done') return <Check className="w-4 h-4 text-green-500" />;

        // Waiting icons
        if (type === 'search') return <Search className="w-4 h-4 text-zinc-300" />;
        return <InfoCircle className="w-4 h-4 text-zinc-300" />;
    };

    return (
        <div className="flex flex-col py-0.5 pl-2">
            <div className="flex items-center gap-3">
                <div className="transition-all duration-300">
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <button
                        onClick={() => details && setIsExpanded(!isExpanded)}
                        disabled={!details}
                        className={`text-sm text-left flex items-center gap-2 ${status === 'working' ? 'text-zinc-800 dark:text-zinc-200' : status === 'done' ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-400'}`}
                    >
                        {title}
                        {details && (
                            <span className="text-zinc-300 hover:text-zinc-500 transition-colors">
                                {isExpanded ? <NavArrowUp className="w-3.5 h-3.5" /> : <NavArrowDown className="w-3.5 h-3.5" />}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && details && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded-md p-3 whitespace-pre-wrap">
                            {details}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
