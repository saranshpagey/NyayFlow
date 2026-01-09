import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import PageTransition from '../components/PageTransition';
import { CaseFile } from '../lib/types';
import { api } from '../lib/api';
import { DotBackground } from '../components/ui/grid-background';
import {
    Folder,
    Calendar,
    Timer,
    User,
    NavArrowRight,
    Page,
    Book,
    ViewColumns3,
    List,
    Plus,
    FilterList,
    Xmark,

    Notes,
    GoogleDocs,
    UserPlus
} from 'iconoir-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const PracticeManager = () => {
    const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
    const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'timeline' | 'docs' | 'notes'>('timeline');
    const [isAddCaseModalOpen, setIsAddCaseModalOpen] = useState(false);
    const [cases, setCases] = useState<CaseFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch cases on mount
    React.useEffect(() => {
        const fetchCases = async () => {
            try {
                const data = await api.getCases();
                setCases(data as unknown as CaseFile[]);
            } catch (error) {
                console.error('Failed to fetch cases:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCases();
    }, []);

    // Filter Logic
    const filteredCases = cases.filter(c =>
        c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.vsty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter/Group data for Kanban (using filtered data)
    const stages = ['Filing', 'Evidence', 'Arguments', 'Judgment'];
    const getStageColumn = (stage: string) => {
        if (stage.includes('Evidence')) return 'Evidence';
        if (stage.includes('Arguments')) return 'Arguments';
        if (stage.includes('Judgment') || stage.includes('Order')) return 'Judgment';
        return 'Filing'; // Default
    };

    const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all",
                activeTab === id
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    const headerTitle = (
        <h1 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <Folder className="w-4 h-4 text-orange-600" />
            Case Management
            <NavArrowRight className="w-3 h-3 text-zinc-300" />
            <span className="text-zinc-500 font-normal">
                {viewMode === 'list' ? 'All Active Cases' : 'Kanban Board'}
            </span>
        </h1>
    );

    const headerRight = (
        <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800">
                <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                        "p-1.5 rounded-md transition-all",
                        viewMode === 'list'
                            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    )}
                    title="List View"
                >
                    <List className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={() => setViewMode('board')}
                    className={cn(
                        "p-1.5 rounded-md transition-all",
                        viewMode === 'board'
                            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    )}
                    title="Board View"
                >
                    <ViewColumns3 className="w-3.5 h-3.5" />
                </button>
            </div>

            <button
                onClick={() => setIsAddCaseModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
                <Plus className="w-3.5 h-3.5" />
                New Case
            </button>
        </div>
    );

    return (
        <DashboardLayout headerTitle={headerTitle} headerRight={headerRight}>
            <DotBackground className="items-start justify-start">
                <PageTransition className="flex flex-col h-full w-full overflow-hidden relative z-10">

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden">
                        {viewMode === 'list' ? (
                            <div className="flex h-full">
                                {/* Case List Sidebar */}
                                <div className="w-1/3 bg-white/50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800 flex flex-col backdrop-blur-sm">
                                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                placeholder="Search cases, clients..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                            />
                                            {searchQuery ? (
                                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5">
                                                    <Xmark className="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
                                                </button>
                                            ) : (
                                                <FilterList className="w-4 h-4 text-zinc-400 absolute right-3 top-2.5" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                        {filteredCases.map(caseItem => (
                                            <div
                                                key={caseItem.id}
                                                onClick={() => setSelectedCase(caseItem)}
                                                className={cn(
                                                    "p-4 rounded-xl cursor-pointer transition-all border",
                                                    selectedCase?.id === caseItem.id
                                                        ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30 shadow-sm"
                                                        : "bg-white dark:bg-zinc-900 border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                                                )}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={cn(
                                                        "text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider",
                                                        caseItem.status === 'active' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-zinc-100 text-zinc-500"
                                                    )}>
                                                        {caseItem.status}
                                                    </span>
                                                    <span className="text-xs text-zinc-400 font-mono">{caseItem.caseNumber}</span>
                                                </div>
                                                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1 truncate">
                                                    {caseItem.clientName} v. {caseItem.vsty}
                                                </h3>
                                                <div className="text-xs text-zinc-500 flex items-center gap-1.5 mt-2">
                                                    <Book className="w-3.5 h-3.5" />
                                                    {caseItem.court}
                                                </div>
                                            </div>
                                        ))}
                                        {filteredCases.length === 0 && (
                                            <div className="p-8 text-center text-zinc-400 text-sm">
                                                No cases found matching "{searchQuery}"
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Case Detail View */}
                                <div className="flex-1 overflow-y-auto p-8 bg-zinc-50/50 dark:bg-black/20">
                                    {selectedCase ? (
                                        <motion.div
                                            key={selectedCase.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="max-w-4xl mx-auto space-y-8"
                                        >
                                            {/* Header */}
                                            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                                                {/* Assigned Team */}
                                                <div className="absolute top-8 right-8 flex items-center gap-4">
                                                    <div className="flex items-center -space-x-2">
                                                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-blue-500 flex items-center justify-center text-xs font-semibold text-white" title="Aditya (Lead)">AV</div>
                                                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-emerald-500 flex items-center justify-center text-xs font-semibold text-white" title="Junior Assoc.">JA</div>
                                                        <button className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                                                            <UserPlus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-start mb-6">
                                                    <div className='max-w-[70%]'>
                                                        <h2 className="text-3xl font-display font-semibold text-zinc-900 dark:text-white mb-2">
                                                            {selectedCase.clientName} <span className="text-zinc-400 font-serif italic">vs.</span> {selectedCase.vsty}
                                                        </h2>
                                                        <p className="text-zinc-500 flex items-center gap-2">
                                                            <Book className="w-4 h-4" />
                                                            {selectedCase.court}
                                                            <span className="text-zinc-300 px-2">•</span>
                                                            <span className="font-mono text-zinc-400">{selectedCase.caseNumber}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end -mt-8 mb-6">
                                                    <div className="text-right">
                                                        <div className="text-sm text-zinc-500 mb-1">Next Hearing</div>
                                                        <div className="text-lg font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-end gap-2">
                                                            <Calendar className="w-5 h-5" />
                                                            {selectedCase.nextHearing}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                                                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl">
                                                        <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Current Stage</div>
                                                        <div className="font-semibold text-zinc-900 dark:text-white">{selectedCase.stage}</div>
                                                    </div>
                                                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl">
                                                        <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Client Contact</div>
                                                        <div className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                                            <User className="w-4 h-4" />
                                                            {selectedCase.clientName}
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl">
                                                        <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Activity</div>
                                                        <div className="font-semibold text-zinc-900 dark:text-white">{selectedCase.timeline.length} Updates</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details Tabs */}
                                            <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl w-fit">
                                                <TabButton id="timeline" label="Timeline" icon={Timer} />
                                                <TabButton id="docs" label="Documents" icon={GoogleDocs} />
                                                <TabButton id="notes" label="Private Notes" icon={Notes} />
                                            </div>

                                            {/* Tab Content */}
                                            <div className="min-h-[300px]">
                                                {activeTab === 'timeline' && (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                        <div className="space-y-0 relative border-l border-zinc-200 dark:border-zinc-800 ml-3">
                                                            {selectedCase.timeline.map((event, index) => (
                                                                <div key={event.id} className="relative pl-8 pb-12 last:pb-0 group">
                                                                    <div className={cn(
                                                                        "absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-950 bg-blue-500",
                                                                        event.type === 'hearing' && "bg-orange-500",
                                                                        event.type === 'filing' && "bg-purple-500"
                                                                    )}></div>

                                                                    <div className="flex flex-col sm:flex-row gap-4 items-start group-hover:-translate-y-1 transition-transform duration-200">
                                                                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex-1">
                                                                            <div className="flex justify-between items-start mb-2">
                                                                                <span className={cn(
                                                                                    "text-xs font-semibold px-2 py-1 rounded uppercase tracking-wider",
                                                                                    event.type === 'hearing' ? "bg-orange-50 text-orange-600" :
                                                                                        event.type === 'filing' ? "bg-purple-50 text-purple-600" :
                                                                                            "bg-zinc-100 text-zinc-600"
                                                                                )}>{event.type}</span>
                                                                                <span className="text-xs text-zinc-400 font-mono">{event.date}</span>
                                                                            </div>
                                                                            <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">{event.title}</h4>
                                                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{event.description}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {activeTab === 'docs' && (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-4">
                                                        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center text-center justify-center gap-3 hover:border-blue-500 cursor-pointer transition-colors group">
                                                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                                                                <GoogleDocs className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-zinc-900 dark:text-white">Case Brief.pdf</h4>
                                                                <p className="text-xs text-zinc-500">Added 2 days ago</p>
                                                            </div>
                                                        </div>
                                                        <div className="p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center text-center justify-center gap-3 text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 transition-colors cursor-pointer">
                                                            <Plus className="w-6 h-6" />
                                                            <span className="font-semibold">Upload Document</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {activeTab === 'notes' && (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                        <textarea
                                                            className="w-full h-48 p-4 rounded-xl bg-yellow-50 dark:bg-zinc-900 border border-yellow-200 dark:border-zinc-800 text-sm text-zinc-800 dark:text-zinc-300 focus:ring-2 focus:ring-yellow-500/20 outline-none resize-none font-serif leading-relaxed"
                                                            placeholder="Add private notes about this case strategy..."
                                                            defaultValue="Focus on proving the timeline of events in the next cross-examination. Need to verify the witness statement from date 12/08."
                                                        />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                            <Folder className="w-24 h-24 text-zinc-200 dark:text-zinc-800 mb-4" />
                                            <h3 className="text-xl font-semibold text-zinc-400">No Case Selected</h3>
                                            <p className="text-zinc-500">Choose a file from the sidebar to view details</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Kanban Board View
                            <div className="h-full overflow-x-auto p-8">
                                <div className="flex gap-6 min-w-max h-full">
                                    {stages.map(stage => (
                                        <div key={stage} className="w-80 flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
                                            <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
                                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{stage}</span>
                                                <span className="text-xs bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                                                    {filteredCases.filter(c => getStageColumn(c.stage) === stage).length}
                                                </span>
                                            </div>
                                            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                                                {filteredCases.filter(c => getStageColumn(c.stage) === stage).map(caseItem => (
                                                    <div
                                                        key={caseItem.id}
                                                        onClick={() => {
                                                            setSelectedCase(caseItem);
                                                            setViewMode('list'); // Switch to details
                                                        }}
                                                        className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-semibold text-sm text-zinc-900 dark:text-white line-clamp-2">{caseItem.clientName} v. {caseItem.vsty}</h4>
                                                        </div>
                                                        <div className="space-y-2 mt-3">
                                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                                <Book className="w-3 h-3" />
                                                                <span className="truncate">{caseItem.court}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10 px-2 py-1 rounded-md w-fit">
                                                                <Calendar className="w-3 h-3" />
                                                                {caseItem.nextHearing}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {filteredCases.filter(c => getStageColumn(c.stage) === stage).length === 0 && (
                                                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                                                        <span className="text-xs text-zinc-400">No cases in {stage}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add Case Modal */}
                    <AnimatePresence>
                        {isAddCaseModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                            <Folder className="w-5 h-5 text-blue-500" />
                                            Open New Case File
                                        </h3>
                                        <button onClick={() => setIsAddCaseModalOpen(false)}>
                                            <Xmark className="w-5 h-5 text-zinc-500 hover:text-zinc-700" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-zinc-500 mb-1">Client Name</label>
                                                <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg px-3 py-2 text-sm" placeholder="e.g. Rahul Sharma" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-zinc-500 mb-1">Against (Respondent)</label>
                                                <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg px-3 py-2 text-sm" placeholder="e.g. State of UP" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-500 mb-1">Case Number</label>
                                            <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg px-3 py-2 text-sm" placeholder="e.g. WP(C) 123/2024" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-500 mb-1">Court / Forum</label>
                                            <input type="text" className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg px-3 py-2 text-sm" placeholder="e.g. Supreme Court of India" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-8">
                                        <button
                                            onClick={() => setIsAddCaseModalOpen(false)}
                                            className="px-4 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button className="px-6 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700">
                                            Create File
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                </PageTransition>
            </DotBackground>
        </DashboardLayout>
    );
};

export default PracticeManager;
