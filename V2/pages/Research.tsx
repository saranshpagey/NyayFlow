import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { api, ResearchResult } from '../lib/apiClient';
import {
    PaperAirplaneIcon,
    SparklesIcon,
    CheckBadgeIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon,
    ArrowPathIcon,
    ScaleIcon,
    BookOpenIcon,
    ArrowTopRightOnSquareIcon,
    ShieldExclamationIcon,
    ClockIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

const StatuteWidget = ({ data }: { data: any }) => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl shadow-zinc-200/50 dark:shadow-none">
        <div className="flex items-center gap-2 mb-4">
            <ScaleIcon className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Legal Provision</span>
        </div>
        <h3 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white mb-2">{data.title}</h3>
        <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 mb-4">
            <p className="font-serif italic text-zinc-600 dark:text-zinc-400 leading-relaxed">"{data.text}"</p>
        </div>
        <p className="text-sm text-zinc-500 font-medium">💡 {data.explanation}</p>
    </div>
);

const PenaltyWidget = ({ data }: { data: any }) => (
    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
            <ShieldExclamationIcon className="w-5 h-5 text-red-600" />
            <span className="text-xs font-black text-red-600 uppercase tracking-widest">Penalty Warning</span>
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">{data.crime || 'Punishment Detail'}</h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-red-950/20 p-4 rounded-xl border border-red-100 dark:border-red-900/10">
                <span className="text-xs font-bold text-red-400 uppercase">Imprisonment</span>
                <p className="text-lg font-bold text-red-700 dark:text-red-400">{data.imprisonment || 'Not Specified'}</p>
            </div>
            <div className="bg-white dark:bg-red-950/20 p-4 rounded-xl border border-red-100 dark:border-red-900/10">
                <span className="text-xs font-bold text-red-400 uppercase">Maximum Fine</span>
                <p className="text-lg font-bold text-red-700 dark:text-red-400">{data.fine || 'Not Specified'}</p>
            </div>
        </div>
    </div>
);

const SourceSummaryPill = ({ count, onClick }: { count: number, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-2 bg-zinc-100/80 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50 rounded-full transition-all active:scale-95 group"
    >
        <div className="flex -space-x-2">
            {[1, 2, 3].slice(0, Math.min(count, 3)).map((i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-900 flex items-center justify-center shadow-sm">
                    <BookOpenIcon className="w-3 h-3 text-zinc-400" />
                </div>
            ))}
        </div>
        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
            {count} {count === 1 ? 'source' : 'sources'}
        </span>
    </button>
);

const ProcedureWidget = ({ data }: { data: any }) => (
    <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-6">
            <ClockIcon className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{data.title}</span>
        </div>
        <div className="space-y-6 relative ml-2">
            <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-indigo-200 dark:bg-indigo-800"></div>
            {data.steps.map((step: string, idx: number) => (
                <div key={idx} className="relative pl-6">
                    <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white dark:border-zinc-900"></div>
                    <p className="text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">{step}</p>
                </div>
            ))}
        </div>
    </div>
);

const SourceChip = ({ item, index, onClick }: { item: ResearchResult, index: number, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-blue-500 transition-all text-xs font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap active:scale-95 group"
    >
        <span className="w-4 h-4 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 rounded text-[10px] font-black text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            {index + 1}
        </span>
        <span className="max-w-[150px] truncate">{item.title}</span>
    </button>
);

// ... DeepDiveModal and component logic remains the same ...
// I will include the existing components and updated hook logic below.

const DeepDiveModal = ({ item, onClose }: { item: ResearchResult, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-300 border border-zinc-200 dark:border-zinc-800">
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1 px-2 rounded-lg bg-blue-600 text-[10px] font-black text-white uppercase tracking-tighter">Official Authority</div>
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{item.court} • {item.date}</span>
                        </div>
                        <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-white leading-tight">{item.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <XMarkIcon className="w-6 h-6 text-zinc-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                            <SparklesIcon className="w-5 h-5" />
                            <h3 className="text-sm font-black uppercase tracking-widest">Key Legal Takeaway</h3>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-amber-50/30 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                            {item.summary}
                        </div>
                    </div>

                    {item.content && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Original Document Snippet</h3>
                            <div className="p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-zinc-800">
                                <p className="text-zinc-700 dark:text-zinc-300 leading-loose font-serif text-xl italic whitespace-pre-wrap">
                                    "{item.content}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex justify-end gap-4">
                    <button className="bg-blue-600 active:scale-95 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-3 shadow-xl shadow-blue-500/20">
                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                        Cite in Drafter
                    </button>
                </div>
            </div>
        </div>
    );
};

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    thinking?: string; // New field for Chain of Thought
    results?: ResearchResult[];
    widget?: { type: string; data: any };
}

const Research = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', content: "Hello! I'm NyayaFlow AI. Ask me about legal sections, penalties, or procedures, and I'll generate the right legal widgets for you." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedResult, setSelectedResult] = useState<ResearchResult | null>(null);
    const [showSources, setShowSources] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const data = await api.research.search(input);
            const primaryResult = data[0]; // The first result has the AI summary and widget data

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: primaryResult?.summary || "I found some relevant authorities:",
                thinking: primaryResult?.thinking, // Pass the thinking process
                widget: primaryResult?.widget,
                results: data
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: "I'm having trouble connecting to my legal brain. Is the backend server running? 🧠❌"
            }]);
        } finally {
            setLoading(false);
        }
    };

    // Helper to render dynamic widget
    const renderWidget = (widget: { type: string; data: any }) => {
        switch (widget.type) {
            case 'statute': return <StatuteWidget data={widget.data} />;
            case 'penalty': return <PenaltyWidget data={widget.data} />;
            case 'procedure': return <ProcedureWidget data={widget.data} />;
            default: return null;
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950">
                {/* Chat Container */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-12">
                    <div className="max-w-4xl mx-auto w-full space-y-12 pt-8">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`w-full max-w-2xl space-y-6 ${msg.role === 'user' ? 'order-1' : ''}`}>

                                    {/* User Bubble */}
                                    {msg.role === 'user' && (
                                        <div className="ml-auto w-fit bg-white dark:bg-zinc-900 px-6 py-4 rounded-[2rem] rounded-tr-sm text-base text-zinc-900 dark:text-white font-medium shadow-sm border border-zinc-100 dark:border-zinc-800">
                                            {msg.content}
                                        </div>
                                    )}

                                    {/* AI Content */}
                                    {msg.role === 'ai' && (
                                        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">

                                            {/* 1. Header & Action Bar */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                                                        <SparklesIcon className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">NyayaFlow AI</span>
                                                </div>

                                                {msg.results && msg.results.length > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <div className="flex items-center gap-1 px-2 py-1.5 text-zinc-400">
                                                            <ArrowPathIcon
                                                                className="w-4 h-4 cursor-pointer hover:text-blue-500 transition-colors"
                                                                onClick={() => {
                                                                    setInput(msg.content);
                                                                    // Simple way to "refresh" - re-trigger handleSend with original content
                                                                }}
                                                            />
                                                            <DocumentTextIcon
                                                                className="w-4 h-4 cursor-pointer hover:text-blue-500 transition-colors"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(msg.content);
                                                                    alert('Copied to clipboard!');
                                                                }}
                                                            />
                                                            <CheckBadgeIcon className="w-4 h-4 cursor-pointer hover:text-blue-500 transition-colors" />
                                                        </div>
                                                        <SourceSummaryPill
                                                            count={msg.results.length}
                                                            onClick={() => setShowSources(!showSources)}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* 1.1. Expanded Sources List */}
                                            {showSources && msg.results && msg.results.length > 0 && (
                                                <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
                                                    {msg.results.map((result, idx) => (
                                                        <SourceChip
                                                            key={result.id}
                                                            item={result}
                                                            index={idx}
                                                            onClick={() => setSelectedResult(result)}
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            {/* 1.5. THINKING PROCESS (New) */}
                                            {msg.thinking && (
                                                <details className="group mb-4">
                                                    <summary className="cursor-pointer list-none flex items-center gap-2 text-[10px] font-black text-zinc-400 hover:text-blue-500 transition-colors uppercase tracking-widest select-none">
                                                        <span className="bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-100 dark:border-zinc-800 group-open:bg-blue-50 dark:group-open:bg-blue-900/10 transition-colors">
                                                            🧠 View Reasoning
                                                        </span>
                                                    </summary>
                                                    <div className="mt-3 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400 italic leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                                        <ReactMarkdown>{msg.thinking}</ReactMarkdown>
                                                    </div>
                                                </details>
                                            )}

                                            {/* 2. Text Response */}
                                            <div className="text-base leading-relaxed text-zinc-800 dark:text-zinc-200 font-medium">
                                                <ReactMarkdown
                                                    components={{
                                                        // Custom styling for markdown elements
                                                        strong: ({ node, ...props }) => <span className="font-bold text-blue-600 dark:text-blue-400" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 my-2" {...props} />,
                                                        li: ({ node, ...props }) => <li className="ml-2" {...props} />,
                                                        p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>

                                            {/* 3. DYNAMIC WIDGET (The new Generative UI part) */}
                                            {msg.widget && (
                                                <div className="animate-in zoom-in-95 duration-500">
                                                    {renderWidget(msg.widget)}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {loading && (
                            <div className="flex items-center gap-4 animate-pulse">
                                <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-400 border border-zinc-100 dark:border-zinc-800">
                                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                                </div>
                                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Analyzing Law & Precedents...</span>
                            </div>
                        )}

                        {/* Spacer to prevent overlap with fixed input */}
                        <div className="h-64" />
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Fixed Input Area */}
                <div className="fixed bottom-0 left-0 right-0 sm:left-64 p-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800 z-40">
                    <div className="max-w-4xl mx-auto relative">
                        <form
                            onSubmit={handleSend}
                            className="relative flex items-end bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-2 pr-2 border border-zinc-100 dark:border-zinc-800 focus-within:ring-0 focus-within:border-zinc-200 dark:focus-within:border-zinc-700"
                        >
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend(e as any);
                                    }
                                }}
                                placeholder="Example: Punishment for cheque bounce..."
                                rows={1}
                                className="flex-1 bg-transparent border-none text-[16px] text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-0 p-3 outline-none resize-none max-h-48 scrollbar-hide"
                                style={{ height: 'auto', minHeight: '48px' }}
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md shadow-blue-500/20 mb-1"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Deep Dive Modal */}
            {selectedResult && (
                <DeepDiveModal
                    item={selectedResult}
                    onClose={() => setSelectedResult(null)}
                />
            )}
        </DashboardLayout>
    );
};

export default Research;
