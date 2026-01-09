import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import {
    Database,
    Upload,
    Link as LinkIcon,
    Activity,
    Page,
    Flash,
    CheckCircle,
    Clock,
    WarningTriangle,
    Sparks,
    Brain,
    NavArrowRight,
    Globe
} from 'iconoir-react';
import { AgentStatusWidget } from '../components/widgets/AgentStatusWidget';
import { cn } from '../lib/utils';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface KBStats {
    total_docs: number;
    vectors_indexed: number;
    last_sync: string;
    system_health: string;
}

const KnowledgeBase = () => {
    const [stats, setStats] = useState<KBStats>({
        total_docs: 0,
        vectors_indexed: 0,
        last_sync: 'Syncing...',
        system_health: 'Checking...'
    });
    const [recentDocs, setRecentDocs] = useState<any[]>([]);
    const [ingestUrl, setIngestUrl] = useState('');
    const [isIngesting, setIsIngesting] = useState(false);
    const [showAllDocs, setShowAllDocs] = useState(false);
    const [allDocs, setAllDocs] = useState<any[]>([]);
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [agentStatuses, setAgentStatuses] = useState<{
        id: string,
        name: string,
        status: 'idle' | 'processing' | 'success' | 'warning' | 'error',
        message: string
    }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, docsData, healthData] = await Promise.all([
                    api.getKbStats().catch(() => ({ total_docs: 0, vectors_indexed: 0, last_sync: 'Offline', system_health: 'Degraded' })),
                    api.getKbDocuments().catch(() => []),
                    api.healthCheck().catch(() => ({ status: 'unhealthy', orchestrator: false, rag_engine: false }))
                ]);
                setStats(statsData);
                setRecentDocs(Array.isArray(docsData) ? docsData : []);

                // Update agent statuses from real health data
                setAgentStatuses([
                    {
                        id: 'orchestrator',
                        name: 'Law Orchestrator',
                        status: healthData.status === 'healthy' ? 'success' : 'error',
                        message: healthData.status === 'healthy' ? 'v2.1 Active' : 'System Offline'
                    },
                    {
                        id: 'research',
                        name: 'Knowledge Scraper',
                        status: healthData.rag_engine ? 'success' : 'error',
                        message: healthData.rag_engine ? 'Connected' : 'Scanner Offline'
                    },
                    {
                        id: 'analyzer',
                        name: 'Vector Analyzer',
                        status: healthData.rag_engine ? 'success' : 'error',
                        message: healthData.rag_engine ? 'Ready' : 'Inaccessible'
                    },
                ]);
            } catch (e) {
                console.error("Failed to fetch KB data", e);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleViewAll = async () => {
        if (!showAllDocs && allDocs.length === 0) {
            setIsLoadingAll(true);
            try {
                // Fetch all documents using the public API method
                const data = await api.getKbDocuments();
                setAllDocs(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch all documents", error);
                toast.error('Failed to load all documents');
            } finally {
                setIsLoadingAll(false);
            }
        }
        setShowAllDocs(!showAllDocs);
    };

    const handleQuickIngest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ingestUrl) return;
        setIsIngesting(true);
        try {
            const res = await api.quickIngest(ingestUrl);
            if (res.success) {
                toast.success('Document queued for ingestion!');
                setIngestUrl('');
                setTimeout(() => {
                    api.getKbStats().then(setStats);
                    api.getKbDocuments().then(data => setRecentDocs(Array.isArray(data) ? data : []));
                }, 2000);
            }
        } catch (error) {
            toast.error('Ingestion failed.');
        } finally {
            setIsIngesting(false);
        }
    };

    const headerTitle = (
        <h1 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-600" />
            Knowledge Base
            <NavArrowRight className="w-3 h-3 text-zinc-300" />
            <span className="text-zinc-500 font-normal">System Corpus & Ingestion</span>
        </h1>
    );

    const headerRight = (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 border border-emerald-100 dark:border-emerald-800/20 rounded-lg shadow-sm transition-all hover:scale-105">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-wider">{stats.system_health}</span>
            </div>
            <button
                onClick={() => document.getElementById('ingest-input')?.focus()}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
                <Upload className="w-3.5 h-3.5" />
                Feed Brain
            </button>
        </div>
    );

    return (
        <DashboardLayout headerTitle={headerTitle} headerRight={headerRight}>
            {/* Main scrollable container */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950 scrollbar-hide">
                <div className="max-w-6xl mx-auto px-6 py-10 space-y-12 pb-32">

                    {/* High Precision Metrics Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Total Documents', value: stats.total_docs, icon: Page, subtext: 'Unique Legal Entities', color: 'indigo' },
                            { label: 'Indexed Vectors', value: stats.vectors_indexed, icon: Flash, subtext: 'Contextual Chunks', color: 'yellow' },
                            { label: 'Last Core Sync', value: stats.last_sync, icon: Clock, subtext: 'System Updated', color: 'emerald' },
                        ].map((metric, i) => (
                            <div key={i} className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between group hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                    <metric.icon className="w-24 h-24" />
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">{metric.label}</span>
                                    <div className={cn(
                                        "p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 group-hover:scale-110 transition-transform duration-500",
                                        metric.color === 'indigo' ? "text-indigo-500" : metric.color === 'yellow' ? "text-yellow-500" : "text-emerald-500"
                                    )}>
                                        <metric.icon className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-display font-semibold text-zinc-900 dark:text-white tabular-nums">
                                        {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-1 font-medium">{metric.subtext}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Feed / Ingestion Section */}
                        <div className="lg:col-span-8 space-y-12">
                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Upload className="w-5 h-5 text-zinc-400" />
                                    <h2 className="text-xl font-medium text-zinc-900 dark:text-white">Source Ingestion</h2>
                                </div>

                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm space-y-6">
                                    <form onSubmit={handleQuickIngest} className="space-y-4">
                                        <div className="group">
                                            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3 ml-1">Document URL</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
                                                <input
                                                    id="ingest-input"
                                                    type="url"
                                                    placeholder="e.g. https://indiankanoon.org/doc/123456"
                                                    value={ingestUrl}
                                                    onChange={(e) => setIngestUrl(e.target.value)}
                                                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-white rounded-2xl py-4 pl-12 pr-4 transition-all outline-none text-zinc-900 dark:text-white text-sm"
                                                    disabled={isIngesting}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isIngesting || !ingestUrl}
                                            className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium rounded-2xl transition-all flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] text-base shadow-lg dark:shadow-none"
                                        >
                                            {isIngesting ? <Activity className="w-5 h-5 animate-spin" /> : <Upload className="w-4 h-4" />}
                                            {isIngesting ? 'Feeding Legal Brain...' : 'Ingest Document'}
                                        </button>
                                    </form>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {['Indian Kanoon', 'India Code', 'SC Judgments'].map(s => (
                                            <button
                                                key={s}
                                                className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider transition-colors"
                                                onClick={() => setIngestUrl(s === 'Indian Kanoon' ? 'https://indiankanoon.org/doc/' : '')}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Recent Documents - High Contrast List */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-zinc-400" />
                                        <h2 className="text-xl font-medium text-zinc-900 dark:text-white">Recent Documents</h2>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full uppercase tracking-wider">
                                            {showAllDocs ? `All ${allDocs.length} Records` : 'Last 10 Records'}
                                        </span>
                                        {recentDocs.length > 0 && (
                                            <button
                                                onClick={handleViewAll}
                                                disabled={isLoadingAll}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-medium hover:opacity-90 transition-all disabled:opacity-50"
                                            >
                                                {isLoadingAll ? (
                                                    <>
                                                        <Activity className="w-3 h-3 animate-spin" />
                                                        Loading...
                                                    </>
                                                ) : showAllDocs ? (
                                                    <>
                                                        <NavArrowRight className="w-3 h-3 rotate-90" />
                                                        Show Less
                                                    </>
                                                ) : (
                                                    <>
                                                        <NavArrowRight className="w-3 h-3 -rotate-90" />
                                                        View All
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border-y border-zinc-100 dark:border-zinc-800">
                                    {recentDocs.length > 0 ? (
                                        <>
                                            {(showAllDocs ? allDocs : recentDocs).map((doc, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.03 }}
                                                    className="group flex items-center justify-between py-6 hover:px-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-2xl transition-all cursor-default"
                                                >
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 text-zinc-400 group-hover:text-indigo-600 transition-colors">
                                                            <Globe className="w-5 h-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-medium text-zinc-900 dark:text-white text-base truncate pr-6">{doc.title}</div>
                                                            <div className="text-xs text-zinc-400 font-medium uppercase tracking-widest flex items-center gap-3 mt-1">
                                                                <span>{doc.type}</span>
                                                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                                                <span>{doc.date}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6 shrink-0">
                                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 border border-emerald-100 dark:border-emerald-800/20 shadow-sm">
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            <span className="text-xs font-medium uppercase tracking-wider">Indexed</span>
                                                        </div>
                                                        <NavArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="py-20 text-center space-y-4">
                                            <Database className="w-10 h-10 text-zinc-200 dark:text-zinc-800 mx-auto" />
                                            <p className="text-zinc-400 text-sm">Knowledge base currently empty.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Status & Tips */}
                        <div className="lg:col-span-4 space-y-10">
                            <aside className="space-y-8">
                                {/* Agent System Status */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pl-1">Agent System Status</h4>
                                    <AgentStatusWidget
                                        variant="card"
                                        noShadow={true}
                                        data={{
                                            agents: agentStatuses
                                        }}
                                    />
                                </div>

                                {/* System Alerts - Only shown when load is actually high */}
                                {stats.vectors_indexed > 50000 && (
                                    <div className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <WarningTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                        <div className="space-y-1">
                                            <span className="text-xs font-medium text-red-600 uppercase tracking-wider">Compliance Alert</span>
                                            <p className="text-xs font-medium text-red-900 dark:text-red-200 leading-normal">
                                                High vector load detected ({Math.round(stats.vectors_indexed / 1000)}k+ chunks). Consider optimizing indexing strategy for archival documents.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Growth Forecast - High Contrast */}
                                <div className="bg-zinc-900 dark:bg-white p-8 rounded-2xl text-white dark:text-zinc-900 shadow-xl space-y-5 transition-transform hover:scale-[1.02]">
                                    <div className="flex items-center gap-3">
                                        <Sparks className="w-5 h-5 text-indigo-400" />
                                        <span className="text-xs font-medium uppercase tracking-wider opacity-80">Growth Forecast</span>
                                    </div>
                                    <p className="text-sm leading-relaxed opacity-90">
                                        Your system has indexed <span className="text-indigo-400 dark:text-indigo-600 font-medium">{stats.total_docs} legal entities</span>.
                                        {stats.total_docs < 100 ?
                                            " Adding more landmark cases will increase citation accuracy by up to 25%." :
                                            " Precision is currently at an elite level for constitutional matters."
                                        }
                                    </p>
                                    <button className="w-full py-3 bg-white/10 dark:bg-zinc-900/10 border border-white/20 dark:border-zinc-900/20 rounded-xl text-xs font-medium uppercase tracking-wider hover:bg-white/20 dark:hover:bg-zinc-900/20 transition-all">
                                        View Roadmap
                                    </button>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default KnowledgeBase;
