import React from 'react';
import { FastArrowRight } from 'iconoir-react';

export const TimelineWidget = ({ data }: { data: any }) => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-2.5 mb-6 sticky left-0">
            <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                <FastArrowRight className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{data.title}</span>
        </div>

        <div className="flex items-start gap-4 min-w-max pb-4">
            {data.steps.map((step: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center gap-3 w-40 relative group">
                    {idx < data.steps.length - 1 && (
                        <div className="absolute top-[14px] left-1/2 w-full h-[2px] bg-zinc-100 dark:bg-zinc-800 -z-10 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors"></div>
                    )}

                    <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-500 group-hover:border-purple-500 group-hover:text-purple-600 transition-colors z-10">
                        {idx + 1}
                    </div>

                    <div className="text-center space-y-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white leading-tight">{step.label}</p>
                        {step.subtext && <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight">{step.subtext}</p>}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
