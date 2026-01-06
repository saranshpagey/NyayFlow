import React from "react";
import {
    ArrowRightIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    PencilSquareIcon,
    ExclamationTriangleIcon,
    CalendarDaysIcon,
    MapPinIcon
} from "@heroicons/react/24/outline";

const BentoFeatures = () => {
    return (
        <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="font-display text-3xl md:text-5xl font-semibold text-zinc-900 dark:text-white mb-6 tracking-tight">Your entire legal workflow.<br />One intelligent OS.</h2>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">Stop switching between ChatGPT for summaries, Manupatra for research, and Word for drafting. NyayaFlow unifies them into a seamless experience.</p>
                    </div>
                    <a href="#waitlist" className="text-base font-semibold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 group px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                        See all features <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[450px]">

                    {/* Card 1: Legal Research Workbench (Split View) */}
                    <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-colors shadow-sm flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="p-8 pb-0">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <MagnifyingGlassIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Research Workbench</h3>
                                    </div>
                                    <p className="text-base text-zinc-500 dark:text-zinc-400">Context-aware search that understands Indian legal nuance.</p>
                                </div>
                            </div>
                        </div>

                        {/* Split View UI */}
                        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 mt-4 mx-4 mb-4 rounded-t-xl border-t border-x border-zinc-200 dark:border-zinc-800 flex overflow-hidden shadow-inner">
                            {/* Left: Query & Filters */}
                            <div className="w-1/3 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 flex flex-col gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Query</label>
                                    <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 p-2 rounded border border-zinc-200 dark:border-zinc-700">
                                        "Penalty for cheque bounce under Section 138"
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Filters</label>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-100 dark:border-blue-800">Supreme Court</span>
                                        <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] border border-zinc-200 dark:border-zinc-700">Last 5 Years</span>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <div className="h-24 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 rounded-lg border border-zinc-100 dark:border-zinc-800 p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <SparklesIcon className="w-3 h-3 text-purple-500" />
                                            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">AI Summary</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded w-full"></div>
                                            <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6"></div>
                                            <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded w-4/6"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Results Cards */}
                            <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-4 space-y-3 relative overflow-hidden">
                                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none"></div>

                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer group/card">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 group-hover/card:underline">MSR Leathers v. S. Palaniappan</h4>
                                            <span className="text-[10px] text-zinc-400">2013</span>
                                        </div>
                                        <div className="flex gap-2 mb-2">
                                            <span className="text-[10px] px-1.5 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded border border-green-100 dark:border-green-900/30">Cited 142 times</span>
                                            <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded">SC</span>
                                        </div>
                                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                            ...overruling the previous judgment, the court held that a payee can successively present the cheque for payment during its validity period...
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Smart Drafter (Document Editor) */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-colors shadow-sm flex flex-col relative overflow-hidden group">
                        <div className="p-8 pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <PencilSquareIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Smart Drafter</h3>
                            </div>
                            <p className="text-base text-zinc-500 dark:text-zinc-400">Auto-drafting tailored to State Laws.</p>
                        </div>

                        {/* Editor UI */}
                        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 mx-4 mb-4 rounded-t-xl border border-zinc-200 dark:border-zinc-800 shadow-inner relative overflow-hidden flex flex-col">
                            {/* Toolbar */}
                            <div className="h-8 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center px-3 gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                </div>
                                <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-1"></div>
                                <div className="text-[10px] font-medium text-zinc-500">Employment_Agreement_v2.docx</div>
                            </div>

                            {/* Canvas */}
                            <div className="flex-1 p-6 font-serif text-xs leading-relaxed text-zinc-800 dark:text-zinc-300 relative bg-white dark:bg-zinc-900/50">
                                <div className="absolute left-2 top-6 bottom-6 w-6 border-r border-zinc-100 dark:border-zinc-800 text-[9px] text-zinc-300 dark:text-zinc-600 flex flex-col gap-[18px] items-end pr-1 pt-0.5 select-none font-mono">
                                    {Array.from({ length: 10 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                                </div>
                                <div className="pl-6">
                                    <p className="text-center font-bold mb-4 uppercase">Employment Agreement</p>
                                    <p className="mb-2">1. <strong>Appointment:</strong> The Company hereby appoints the Employee as Senior Engineer...</p>
                                    <p className="mb-2 relative">
                                        2. <strong>Non-Compete:</strong> The Employee shall not join a competitor for 24 months post-termination.
                                        <span className="absolute -right-2 -top-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                                    </p>
                                    <p>3. <strong>Confidentiality:</strong> The Employee agrees to keep all trade secrets...</p>

                                    {/* AI Tooltip */}
                                    <div className="absolute top-28 right-4 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-red-100 dark:border-red-900/30 p-3 z-10 animate-fade-in-up">
                                        <div className="flex items-center gap-2 mb-1">
                                            <ExclamationTriangleIcon className="w-3 h-3 text-red-500" />
                                            <span className="text-[10px] font-bold text-red-600 dark:text-red-400">Risk Detected</span>
                                        </div>
                                        <p className="text-[10px] text-zinc-600 dark:text-zinc-300 leading-tight">
                                            Non-compete clauses post-termination are generally void in India under <strong>Section 27</strong> of the Contract Act.
                                        </p>
                                        <button className="mt-2 w-full py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-[10px] font-bold rounded border border-red-100 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                                            Fix Clause
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Practice Manager (Timeline View) */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-colors shadow-sm flex flex-col relative group">
                        <div className="p-8 pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                    <CalendarDaysIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Practice Manager</h3>
                            </div>
                            <p className="text-base text-zinc-500 dark:text-zinc-400">Track cases, hearings, and deadlines.</p>
                        </div>

                        <div className="flex-1 p-6 relative overflow-hidden">
                            <div className="absolute top-6 bottom-6 left-6 w-px bg-zinc-200 dark:bg-zinc-800 dashed"></div>

                            <div className="space-y-6">
                                {[
                                    { date: "Today", time: "10:30 AM", title: "Hearing: Sharma v. State", court: "High Court, Hall 4", type: "Urgent", status: "In Progress" },
                                    { date: "Tomorrow", time: "02:00 PM", title: "Client Meeting: TechCorp", court: "Office", type: "Meeting", status: "Upcoming" },
                                    { date: "Nov 28", time: "11:00 AM", title: "Filing Deadline", court: "NCLT", type: "Deadline", status: "Upcoming" },
                                ].map((item, i) => (
                                    <div key={i} className="relative pl-8 group/item">
                                        {/* Timeline Dot */}
                                        <div className={`absolute left-[-5px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${i === 0 ? 'bg-green-500 ring-4 ring-green-100 dark:ring-green-900/30' : 'bg-zinc-300 dark:bg-zinc-700'}`}></div>

                                        <div className="bg-zinc-50 dark:bg-zinc-950/50 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 p-4 rounded-xl shadow-sm transition-all group-hover/item:translate-x-1 group-hover/item:shadow-md cursor-pointer">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{item.title}</h4>
                                                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                                        <MapPinIcon className="w-3 h-3" /> {item.court}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-xs font-bold text-zinc-900 dark:text-white">{item.time}</span>
                                                    <span className="text-[10px] text-zinc-400 font-mono">{item.date}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.type === 'Urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                                                    {item.type}
                                                </span>
                                                {item.status === 'In Progress' && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium animate-pulse">
                                                        Live
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Card 4: The "Why" Visual */}
                    <div className="md:col-span-2 bg-zinc-900 dark:bg-zinc-800 rounded-3xl p-8 border border-zinc-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                        {/* Gradient Orb */}
                        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>

                        <div className="relative z-10 max-w-md">
                            <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white mb-4">
                                🚀 Built for Indian Law
                            </div>
                            <h3 className="text-3xl font-display font-bold text-white mb-4">Data you can trust.</h3>
                            <p className="text-zinc-400 leading-relaxed text-lg">
                                Unlike generic models trained on US Law, NyayaFlow is fine-tuned on the <strong className="text-white">Indian Constitution, IPC, CrPC</strong>, and 50+ years of Supreme Court judgments.
                            </p>
                        </div>

                        <div className="relative z-10 flex-1 w-full max-w-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-colors">
                                    <div className="text-3xl font-bold text-white mb-1">50M+</div>
                                    <div className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Judgments</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-colors translate-y-4">
                                    <div className="text-3xl font-bold text-orange-400 mb-1">100%</div>
                                    <div className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Indian Context</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-colors col-span-2">
                                    <div className="text-3xl font-bold text-green-400 mb-1">Zero</div>
                                    <div className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Hallucinations Policy</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BentoFeatures;
