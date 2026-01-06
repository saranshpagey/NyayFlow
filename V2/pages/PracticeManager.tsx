import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { MOCK_CASES, CaseFile } from '../lib/mockCaseData';
import { FolderIcon, CalendarIcon, ClockIcon, UserIcon, ChevronRightIcon, DocumentIcon, ScaleIcon } from '@heroicons/react/24/outline';

const PracticeManager = () => {
    const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null);

    return (
        <DashboardLayout>
            <div className="flex-1 overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex">

                {/* Case List Sidebar */}
                <div className="w-1/3 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                        <h1 className="text-xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <FolderIcon className="w-6 h-6 text-blue-600" />
                            Case Files
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1">Manage your active litigation.</p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {MOCK_CASES.map(caseItem => (
                                <div
                                    key={caseItem.id}
                                    onClick={() => setSelectedCase(caseItem)}
                                    className={`p-5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group ${selectedCase?.id === caseItem.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded uppercase tracking-wide">
                                            {caseItem.status}
                                        </span>
                                        <span className="text-xs text-zinc-400 font-mono">{caseItem.caseNumber}</span>
                                    </div>
                                    <h3 className="font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                                        {caseItem.clientName} v. {caseItem.vsty}
                                    </h3>
                                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                                        <ScaleIcon className="w-3 h-3" />
                                        {caseItem.court}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Case Detail / Timeline View */}
                <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-8">
                    {selectedCase ? (
                        <div className="max-w-3xl mx-auto">
                            {/* Case Header */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                                        {selectedCase.clientName} <span className="text-zinc-400 font-normal">vs.</span> {selectedCase.vsty}
                                    </h2>
                                    <div className="flex gap-2">
                                        <button className="text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                                            Add Update
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                        <CalendarIcon className="w-4 h-4 text-orange-500" />
                                        Next: <span className="font-semibold text-zinc-900 dark:text-white">{selectedCase.nextHearing}</span>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <ClockIcon className="w-4 h-4" />
                                        Stage: {selectedCase.stage}
                                    </span>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-3 space-y-8 pb-10">
                                {selectedCase.timeline.map((event, index) => (
                                    <div key={event.id} className="relative pl-8">
                                        {/* Timeline Dot */}
                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-950 ${event.type === 'heating' ? 'bg-orange-500' :
                                            event.type === 'order' ? 'bg-blue-500' :
                                                'bg-zinc-400'
                                            }`}></div>

                                        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${event.type === 'hearing' ? 'bg-orange-50 text-orange-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                                                    }`}>
                                                    {event.type}
                                                </span>
                                                <span className="text-xs text-zinc-400 font-medium">{event.date}</span>
                                            </div>
                                            <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                                                {event.title}
                                            </h4>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                            <FolderIcon className="w-16 h-16 mb-4 text-zinc-300 dark:text-zinc-800" />
                            <p className="text-lg font-medium">Select a case file to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PracticeManager;
