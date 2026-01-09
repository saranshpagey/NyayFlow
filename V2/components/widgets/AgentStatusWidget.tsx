import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Search, FileText, ShieldAlert, Cpu, CheckCircle2, Loader2, RefreshCw, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AgentStatusWidgetProps {
    data?: {
        agents?: {
            id: string;
            name: string;
            status: 'idle' | 'processing' | 'success' | 'warning' | 'error';
            message?: string;
        }[];
    };
    variant?: 'card' | 'sidebar';
    noShadow?: boolean;
}

const statusIcons: Record<string, React.ElementType> = {
    'orchestrator': Cpu,
    'research': Search,
    'drafter': FileText,
    'compliance': ShieldAlert,
    'analyzer': Bot,
    'statute': FileText,
    'procedure': Search,
    'glossary': Search,
    'caselaw': Search
};

const defaultAgents = [
    { id: 'orchestrator', name: 'Orchestrator', status: 'idle' as const },
    { id: 'research', name: 'Research AI', status: 'success' as const, message: 'Indexed 15k vectors' },
    { id: 'analyzer', name: 'Legal Analyzer', status: 'processing' as const, message: 'Detecting intent...' },
];

export const AgentStatusWidget: React.FC<AgentStatusWidgetProps> = ({ data, variant = 'card', noShadow = false }) => {
    const displayAgents = data?.agents?.map(a => ({
        ...a,
        icon: statusIcons[a.id] || Bot
    })) || defaultAgents.map(a => ({ ...a, icon: statusIcons[a.id] || Bot }));

    if (variant === 'sidebar') {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h4 className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-3 h-3 text-indigo-500" />
                        Live Agent Network
                    </h4>
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    {displayAgents.map((agent) => (
                        <div
                            key={agent.id}
                            className="group flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 transition-all duration-300"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={cn(
                                    "p-1.5 rounded-lg shrink-0",
                                    agent.status === 'processing' ? "bg-indigo-500/10 text-indigo-500 animate-pulse" :
                                        agent.status === 'success' ? "bg-emerald-500/10 text-emerald-500" :
                                            agent.status === 'error' ? "bg-red-500/10 text-red-500" :
                                                "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                                )}>
                                    <agent.icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                    <h5 className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">{agent.name}</h5>
                                    {agent.message && (
                                        <p className="text-[10px] text-zinc-500 dark:text-zinc-500 truncate leading-none mt-0.5">{agent.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="shrink-0 ml-2">
                                {agent.status === 'processing' ? (
                                    <Loader2 className="w-3 h-3 text-indigo-500 animate-spin" />
                                ) : agent.status === 'success' ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                ) : agent.status === 'error' ? (
                                    <ShieldAlert className="w-3 h-3 text-red-500" />
                                ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative group" style={{ overflow: 'visible' }}>
            {/* Glossy Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className={cn(
                "relative glass-card bg-white/80 dark:bg-zinc-900/80 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-md",
                !noShadow && "shadow-xl"
            )} style={{ overflow: 'visible' }}>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/30">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-zinc-900 dark:text-white tracking-tight">Agent Network</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Orchestration Active</p>
                            </div>
                        </div>
                    </div>
                    <button className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-500 transition-all active:scale-95 border border-zinc-200 dark:border-zinc-700">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {displayAgents.map((agent, idx) => (
                            <motion.div
                                key={agent.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative group/row"
                            >
                                <div className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl transition-all duration-300",
                                    "bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-100 dark:border-zinc-800/50",
                                    "hover:bg-white dark:hover:bg-zinc-800 hover:border-indigo-500/20 hover:shadow-sm"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "p-2.5 rounded-xl transition-all shadow-sm",
                                            agent.status === 'processing' ? "bg-indigo-500 text-white animate-pulse shadow-indigo-500/20" :
                                                agent.status === 'success' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                                                    agent.status === 'error' ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                                                        "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                                        )}>
                                            <agent.icon className="w-4.5 h-4.5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-zinc-900 dark:text-white">{agent.name}</h4>
                                            {agent.message && (
                                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium leading-none">
                                                    {agent.status === 'processing' && <span className="text-indigo-500 mr-1.5">●</span>}
                                                    {agent.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        {agent.status === 'processing' ? (
                                            <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                                        ) : agent.status === 'success' ? (
                                            <div className="flex items-center gap-2 pl-3 py-1 border-l border-zinc-200 dark:border-zinc-800">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Ready</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Idle</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between text-xs text-zinc-500 italic">
                        <span className="flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-indigo-500" />
                            System Latency: 42ms
                        </span>
                        <span>v1.0.4-stable</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
