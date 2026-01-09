import React from 'react';
import { Xmark, Sparks, ArrowRight } from 'iconoir-react';
import { ResearchResult } from '../../lib/types';

export const DeepDiveModal = ({ item, onClose }: { item: ResearchResult, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-300 border border-zinc-200 dark:border-zinc-800">
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1 px-2 rounded-lg bg-blue-600 text-xs font-semibold text-white uppercase tracking-tight">Official Authority</div>
                            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{item.court} • {item.date}</span>
                        </div>
                        <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-white leading-tight">{item.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <Xmark className="w-6 h-6 text-zinc-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                            <Sparks className="w-5 h-5" />
                            <h3 className="text-sm font-semibold uppercase tracking-widest">Key Legal Takeaway</h3>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-amber-50/30 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed">
                            {item.summary}
                        </div>
                    </div>

                    {item.content && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Original Document Snippet</h3>
                            <div className="p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-zinc-800">
                                <p className="text-zinc-700 dark:text-zinc-300 leading-loose font-serif text-xl italic whitespace-pre-wrap">
                                    "{item.content}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex justify-end gap-4">
                    <button className="bg-blue-600 active:scale-95 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-3 shadow-xl shadow-blue-500/20">
                        <ArrowRight className="w-5 h-5" />
                        Cite in Drafter
                    </button>
                </div>
            </div>
        </div>
    );
};
