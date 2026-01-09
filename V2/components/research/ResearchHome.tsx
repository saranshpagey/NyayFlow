import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparks, ArrowRight } from 'iconoir-react';
import { User, Scale } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useResearch } from '../../context/ResearchContext';
import { CompactQuestionLibrary } from './CompactQuestionLibrary';
import { cn } from '../../lib/utils';

export const ResearchHome: React.FC = () => {
    const { persona, setPersona } = useAuth();
    const { createNewSession } = useResearch();
    const [input, setInput] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            createNewSession(undefined, input.trim());
        }
    };

    const togglePersona = () => {
        setPersona(persona === 'advocate' ? 'founder' : 'advocate');
        setIsMenuOpen(false);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 min-h-[calc(100vh-64px)] h-full">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full space-y-12 -mt-20"
            >
                {/* Branding */}
                {/* Branding */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-white shadow-xl mb-2">
                        <Sparks className="w-7 h-7 text-white dark:text-zinc-900" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                            {(() => {
                                const hour = new Date().getHours();
                                if (hour < 12) return "Good morning";
                                if (hour < 18) return "Good afternoon";
                                return "Good evening";
                            })()}, <span className="text-blue-600">Counsel.</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                            Ready to make a breakthrough today?
                        </p>
                    </div>
                </div>

                {/* Unified Search Bar */}
                <form onSubmit={handleSubmit} className="relative group z-20 max-w-3xl mx-auto w-full">
                    <div className="relative flex items-center w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[28px] shadow-xl shadow-blue-500/5 transition-all focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500/50 p-2">

                        {/* Persona Toggle (Segmented Control) */}
                        <div className="relative shrink-0 pl-1">
                            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 relative">
                                {/* Animated Background */}
                                <motion.div
                                    className={cn(
                                        "absolute inset-y-1 rounded-full shadow-sm z-0 transition-all duration-300 ease-spring",
                                        persona === 'founder'
                                            ? "bg-white dark:bg-zinc-700 left-1 w-[calc(50%-4px)] shadow-orange-500/10"
                                            : "bg-white dark:bg-zinc-700 left-[calc(50%)] w-[calc(50%-4px)] shadow-blue-500/10"
                                    )}
                                    layoutId="activePersona"
                                />

                                <button
                                    type="button"
                                    onClick={() => setPersona('founder')}
                                    className={cn(
                                        "relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors w-28",
                                        persona === 'founder' ? "text-orange-600 dark:text-orange-400" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
                                    )}
                                >
                                    <User className="w-4 h-4" />
                                    Founder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPersona('advocate')}
                                    className={cn(
                                        "relative z-10 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors w-28",
                                        persona === 'advocate' ? "text-blue-600 dark:text-blue-400" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
                                    )}
                                >
                                    <Scale className="w-4 h-4" />
                                    Advocate
                                </button>
                            </div>
                        </div>

                        {/* Input Field */}
                        <div className="flex-1 relative flex items-center">
                            <div className="absolute left-4 w-px h-6 bg-zinc-200 dark:bg-zinc-700"></div>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={persona === 'founder' ? "Ask a follow-up..." : "Research case law..."}
                                className="w-full bg-transparent border-none focus:ring-0 px-8 py-4 text-base placeholder:text-zinc-400 h-14 text-zinc-900 dark:text-white"
                            />
                        </div>

                        {/* Search Action (Right) */}
                        <div className="shrink-0 pr-1">
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="h-12 w-12 flex items-center justify-center bg-zinc-500 hover:bg-zinc-600 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-white rounded-[20px] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </form>

                {/* Compact Suggestions */}
                <div className="pt-8">
                    {persona === 'founder' ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <CompactQuestionLibrary onSelectQuestion={(q) => {
                                setInput(q);
                                createNewSession(undefined, q);
                            }} />
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center gap-2 text-sm text-zinc-400"
                        >
                            <span>Try:</span>
                            <button onClick={() => setInput("Section 302 IPC")} className="hover:text-blue-500 transition-colors">"Section 302 IPC"</button>
                            <span>or</span>
                            <button onClick={() => setInput("Startup compliance checklist")} className="hover:text-blue-500 transition-colors">"Startup compliance"</button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
