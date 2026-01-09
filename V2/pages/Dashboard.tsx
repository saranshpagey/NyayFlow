import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';

import { useResearch } from '../context/ResearchContext';
import { Clock, Plus, ArrowRight, GraphUp, Search, Page } from 'iconoir-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

const Dashboard = () => {
    const { sessions, createNewSession, loadSession } = useResearch();
    const navigate = useNavigate();
    const [dashboardStats, setDashboardStats] = React.useState<{
        active_cases: number;
        pending_drafts: number;
        upcoming_hearings: number;
        efficiency_score: string;
    } | null>(null);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getDashboardStats();
                setDashboardStats(data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    // Stats configuration
    const stats = [
        {
            label: 'Cases Researched',
            value: dashboardStats?.active_cases ?? sessions.length,
            trend: '+12%',
            icon: Search,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Drafts Generated',
            value: dashboardStats?.pending_drafts ?? '0',
            trend: '+5%',
            icon: Page,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            label: 'Efficiency Score',
            value: dashboardStats?.efficiency_score ?? '94%',
            trend: '+2%',
            icon: GraphUp,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
    ];

    const recentSessions = Array.isArray(sessions) ? sessions.slice(0, 3) : [];

    return (
        <DashboardLayout>
            <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">

                {/* Welcome Header */}
                {/* Welcome Header - Professional Law Firm Style */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-display font-semibold text-zinc-900 dark:text-white tracking-tight mb-2">
                            Welcome back, <span className="text-indigo-600 dark:text-indigo-400">Advocate</span>.
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                            Your legal assistant is ready for <span className="font-semibold text-zinc-700 dark:text-zinc-300">Case No. 24/2024</span> research.
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { createNewSession(); navigate('/research'); }}
                        className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-lg font-semibold shadow-xl shadow-zinc-200/50 dark:shadow-none hover:shadow-2xl transition-all"
                        aria-label="Start New Research Session"
                    >
                        <Plus className="w-5 h-5 stroke-[2]" />
                        New Research
                    </motion.button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Stats & Recent Activity */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                                            <stat.icon className={cn("w-5 h-5", stat.color)} />
                                        </div>
                                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                                            {stat.trend}
                                        </span>
                                    </div>
                                    <div className="text-2xl font-medium text-zinc-900 dark:text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-zinc-500">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-zinc-400" />
                                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Recent Cases</h3>
                                </div>
                                <button onClick={() => navigate('/practice')} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group">
                                    View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {recentSessions.length > 0 ? (
                                    recentSessions.map((session) => (
                                        <div
                                            key={session.id}
                                            onClick={() => { loadSession(session.id); navigate('/research'); }}
                                            className="group flex items-center gap-4 p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 cursor-pointer transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                                                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-zinc-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                                                    {session.title || 'Untitled Research'}
                                                </h4>
                                                <p className="text-sm text-zinc-500 truncate">
                                                    Last updated {new Date(session.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-zinc-400 italic">
                                        No recent activity found. Start a new research session.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Quick Access */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Quick Access</h3>
                        </div>

                        <div className="space-y-4">
                            <motion.div
                                whileHover={{ y: -2 }}
                                onClick={() => navigate('/research')}
                                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 cursor-pointer transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                        <Search className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-zinc-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">Research AI</h4>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                            Deep legal research, case law analysis, and statute retrieval.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -2 }}
                                onClick={() => navigate('/drafter')}
                                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-500 cursor-pointer transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                        <Page className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-zinc-900 dark:text-white mb-1 group-hover:text-purple-600 transition-colors">Smart Drafter</h4>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                            Automated document generation and contract drafting.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -2 }}
                                onClick={() => navigate('/practice')}
                                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-500 cursor-pointer transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-zinc-900 dark:text-white mb-1 group-hover:text-orange-600 transition-colors">Case Files</h4>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                            Manage client cases, hearings, and evidence timelines.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
