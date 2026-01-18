import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Coins,
    Flash,
    GraphUp,
    Reports,
    InfoCircle,
    CheckCircle
} from 'iconoir-react';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

interface UsageStats {
    total_cost_usd: number;
    total_tokens: number;
    query_count: number;
    breakdown: Record<string, number>;
    days: number;
}

import { useCurrency } from '../../hooks/useCurrency';

export const CostTrackerWidget = ({ data }: { data?: UsageStats } = {}) => {
    const [stats, setStats] = useState<UsageStats | null>(data || null);
    const [isLoading, setIsLoading] = useState(true);
    const { format, convert } = useCurrency();

    useEffect(() => {
        if (data) {
            setStats(data);
            setIsLoading(false);
            return;
        }

        const fetchStats = async () => {
            try {
                const data = await api.getUsageStats(7);
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch usage stats", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 30000); // 30s auto-refresh
        return () => clearInterval(interval);
    }, []);

    if (isLoading || !stats) {
        return (
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl animate-pulse">
                <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded mb-6" />
                <div className="h-8 w-32 bg-zinc-100 dark:bg-zinc-800 rounded mb-2" />
                <div className="h-4 w-48 bg-zinc-100 dark:bg-zinc-800 rounded" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 relative overflow-hidden transition-all hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 shadow-sm"
        >
            {/* Background Accent */}
            <div className="absolute -top-12 -right-12 p-24 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                <Coins className="w-48 h-48" />
            </div>

            <div className="relative space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                            <Coins className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">7-Day Expenditure</h4>
                    </div>
                </div>

                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-display font-bold text-zinc-900 dark:text-white tabular-nums">
                            {format(stats.total_cost_usd)}
                        </span>
                        <span className="text-sm font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <GraphUp className="w-3 h-3" />
                            Live
                        </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 font-medium flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        {stats.query_count} AI Operations Tracked
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Flash className="w-3.5 h-3.5 text-yellow-500" />
                            <span className="text-xxs font-bold text-zinc-500 uppercase tracking-widest">Tokens</span>
                        </div>
                        <div className="text-lg font-bold text-zinc-900 dark:text-white tabular-nums">
                            {stats.total_tokens.toLocaleString()}
                        </div>
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Reports className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-xxs font-bold text-zinc-500 uppercase tracking-widest">Avg Query</span>
                        </div>
                        <div className="text-lg font-bold text-zinc-900 dark:text-white tabular-nums">
                            {stats.query_count > 0 ? format(stats.total_cost_usd / stats.query_count) : "₹0.00"}
                        </div>
                    </div>
                </div>

                {/* Breakdown Progress Bars if data exists */}
                {Object.keys(stats.breakdown).length > 0 ? (
                    <div className="space-y-4 pt-2">
                        <h5 className="text-xxs font-bold text-zinc-400 uppercase tracking-widest">Cost Breakdown</h5>
                        <div className="space-y-3">
                            {Object.entries(stats.breakdown).map(([type, cost], i) => (
                                <div key={type} className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider">
                                        <span className="text-zinc-500">{type.replace('_', ' ')}</span>
                                        <span className="text-zinc-900 dark:text-white">{format(cost)}</span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(cost / stats.total_cost_usd) * 100}%` }}
                                            className={cn(
                                                "h-full rounded-full transition-all duration-1000",
                                                i === 0 ? "bg-indigo-500" : i === 1 ? "bg-emerald-500" : "bg-yellow-500"
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-800/20 rounded-2xl">
                        <InfoCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                        <p className="text-[11px] text-indigo-900 /60 dark:text-indigo-200/60 leading-relaxed font-medium">
                            Tracking is active. Cost data will appear as you perform research or drafting.
                        </p>
                    </div>
                )}

                <button className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all shadow-lg dark:shadow-none">
                    View Billing Cloud
                </button>
            </div>
        </motion.div>
    );
};
