import React from 'react';
import { ClipboardCheck, CheckCircle } from 'iconoir-react';

export const ChecklistWidget = ({ data }: { data: any }) => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                <ClipboardCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{data.title}</span>
        </div>

        <div className="space-y-2">
            {data.items.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-950/30 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer">
                    <div className="mt-0.5 text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500 transition-colors">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        {item}
                    </p>
                </div>
            ))}
        </div>
    </div>
);
