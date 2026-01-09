import React from 'react';
import { Timer } from 'iconoir-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const ProcedureWidget = ({ data }: { data: any }) => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Timer className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white">{data.title}</h3>
        </div>
        <div className="space-y-6 relative ml-2">
            <div className="absolute left-[3px] top-2 bottom-2 w-px bg-zinc-200 dark:bg-zinc-800"></div>
            {data.steps.map((step: string, idx: number) => (
                <div key={idx} className="relative pl-6">
                    <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 ring-4 ring-white dark:ring-zinc-900"></div>
                    <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-[15px] prose-sm prose-zinc dark:prose-invert max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({ node, ...props }) => <span {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-semibold text-zinc-900 dark:text-white" {...props} />,
                            }}
                        >
                            {step}
                        </ReactMarkdown>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
