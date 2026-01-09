import React from 'react';
import { X, ExternalLink, ScrollText, Book, Gavel, Search, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Source {
    id: string;
    title: string;
    citation?: string;
    content?: string;
    summary?: string;
    url?: string;
    type?: string;
}

interface SourceDetailsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    sources: Source[];
    activeSourceId?: string;
}

export const SourceDetailsPanel: React.FC<SourceDetailsPanelProps> = ({ isOpen, onClose, sources, activeSourceId }) => {
    const getIcon = (type?: string) => {
        const t = (type || '').toLowerCase();
        if (t.includes('statute') || t.includes('act')) return <Book className="w-5 h-5 text-indigo-500" />;
        if (t.includes('case') || t.includes('judgment')) return <Gavel className="w-5 h-5 text-orange-500" />;
        return <ScrollText className="w-5 h-5 text-blue-500" />;
    };

    // Auto-close if no sources (safety check)
    React.useEffect(() => {
        if (isOpen && sources.length === 0) {
            onClose();
        }
    }, [isOpen, sources.length, onClose]);

    // Escape key to close
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    return (
        <>
            {/* Backdrop for mobile and click-outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[45] bg-zinc-900/5 backdrop-blur-[2px] cursor-default"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                />
            )}

            <div
                className={`fixed inset-y-0 right-0 z-50 w-full lg:w-[600px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                                <Search className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
                                    Source Explorer
                                </h2>
                                <p className="text-xs text-zinc-500 font-medium">
                                    {sources.length} Citations Found
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Vertical Procedure-like List */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="relative space-y-12">
                            {/* Vertical Progress Line */}
                            <div className="absolute left-[23px] top-6 bottom-6 w-px bg-zinc-100 dark:bg-zinc-800" />

                            {sources.map((source, index) => (
                                <div
                                    key={source.id || index}
                                    id={`source-${source.id}`}
                                    className={`relative pl-14 transition-all duration-500 ${activeSourceId === source.id ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                                >
                                    {/* Source Number Bubble */}
                                    <div className={`absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white dark:border-zinc-950 shadow-sm transition-all duration-300 z-10 ${activeSourceId === source.id
                                        ? 'bg-indigo-600 text-white scale-110 shadow-indigo-500/20'
                                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400'
                                        }`}>
                                        <span className="text-sm font-semibold">{index + 1}</span>
                                    </div>

                                    <div className={`p-6 rounded-3xl border transition-all duration-300 ${activeSourceId === source.id
                                        ? 'bg-white dark:bg-zinc-900 border-indigo-500/30 shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/10'
                                        : 'bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800'
                                        }`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm">
                                                    {getIcon(source.type)}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white leading-tight">
                                                        {source.title}
                                                    </h3>
                                                    {source.citation && (
                                                        <p className="text-xs text-indigo-500 font-medium font-mono mt-1 uppercase tracking-tight">
                                                            {source.citation}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {source.url && (
                                                <a
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>

                                        {/* Content/Snippet */}
                                        <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 text-[13px] leading-relaxed">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {source.content || source.summary || "_No preview available._"}
                                            </ReactMarkdown>
                                        </div>

                                        {/* Footer Info */}
                                        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">
                                                {source.type || 'Legal Authority'}
                                            </span>
                                            <div className="flex items-center gap-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                                Verified <ChevronRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Panel Footer */}
                    <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <p className="text-[11px] text-center text-zinc-500 italic font-medium">
                            Citations curated by orchestrator for strategic legal guidance.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
