import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../lib/types';
import { Sparks, Send, User } from 'iconoir-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Widgets & Components
import { ThinkingStep } from './ThinkingStep';
import { StatuteWidget } from './widgets/StatuteWidget';
import { PenaltyWidget } from './widgets/PenaltyWidget';
import { ProcedureWidget } from './widgets/ProcedureWidget';
import { OutcomeWidget } from './widgets/OutcomeWidget';
import { LegalDraftWidget } from './widgets/LegalDraftWidget'; // We might skip this one if it's redundant in the panel, but good for consistency
import { StructuredResponseView } from './widgets/StructuredResponseView';

interface DraftChatPanelProps {
    messages: Message[];
    onSend: (message: string) => void;
    isLoading?: boolean;
}

export const DraftChatPanel: React.FC<DraftChatPanelProps> = ({ messages, onSend, isLoading }) => {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
        }
    };

    const renderWidget = (widget: { type: string; data: any }) => {
        switch (widget.type) {
            case 'statute': return <StatuteWidget data={widget.data} />;
            case 'penalty': return <PenaltyWidget data={widget.data} />;
            case 'procedure': return <ProcedureWidget data={widget.data} />;
            case 'outcome': return <OutcomeWidget data={widget.data} />;
            // We consciously avoid nesting another heavy LegalDraftWidget inside the side panel if it's already open
            // but for completeness or history, we can show a summary
            case 'draft': return <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg text-xs">Draft generated (View in right panel)</div>;
            // Add others as needed
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-zinc-950">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Sparks className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">AI Co-Pilot</h2>
                </div>
                <span className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">Chat & Refine</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="text-center py-12 opacity-50">
                        <p className="text-sm text-zinc-500">Ask AI to refine or edit your draft...</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>

                            <div className={`flex gap-3 max-w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${msg.role === 'ai'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                    }`}>
                                    {msg.role === 'ai' ? <Sparks className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                </div>

                                <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    {/* Thinking Block */}
                                    {msg.thinking && (
                                        <ThinkingStep
                                            title="AI Reasoning"
                                            details={msg.thinking}
                                            status="done"
                                            type="reasoning"
                                        />
                                    )}

                                    {/* Content Block */}
                                    <div className={`rounded-2xl p-3 text-sm leading-relaxed w-full ${msg.role === 'user'
                                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-tr-none'
                                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-200 dark:border-zinc-800'
                                        }`}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Widget Block */}
                                    {msg.widget && (
                                        <div className="w-full mt-1">
                                            {renderWidget(msg.widget)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex items-center gap-2 text-zinc-400 text-xs pl-9 animate-pulse">
                        <Sparks className="w-3 h-3" />
                        AI is thinking...
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Refine draft (e.g. 'Make clause 3 stricter')..."
                        className="w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm rounded-xl pl-4 pr-10 py-2.5 border-none focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-zinc-400"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:bg-transparent disabled:text-zinc-400 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};
