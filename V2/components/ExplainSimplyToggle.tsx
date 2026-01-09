import React from 'react';
import { Lightbulb, BookOpen } from 'lucide-react';

interface ExplainSimplyToggleProps {
    simplified: boolean;
    onToggle: () => void;
}

export const ExplainSimplyToggle: React.FC<ExplainSimplyToggleProps> = ({ simplified, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-sm transition-all duration-200 border border-zinc-200 dark:border-zinc-700"
            aria-label={simplified ? "Switch to detailed mode" : "Switch to simple mode"}
        >
            {simplified ? (
                <>
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Simple Mode</span>
                </>
            ) : (
                <>
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Detailed Mode</span>
                </>
            )}
        </button>
    );
};
