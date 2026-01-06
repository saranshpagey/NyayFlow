import React from "react";
import {
    ArrowRightIcon,
    ScaleIcon,
    ChevronRightIcon,
    SparklesIcon,
    PencilSquareIcon,
    FolderIcon,
    Cog6ToothIcon,
    MagnifyingGlassIcon,
    ShareIcon,
    DocumentTextIcon,
    ArrowPathIcon,
    PaperClipIcon,
    ShieldCheckIcon,
    BookOpenIcon,
    CheckBadgeIcon
} from "@heroicons/react/24/outline";

const Hero = () => {
    return (
        <section className="relative pt-24 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">

            {/* Dot Grid Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(120, 120, 120, 0.1) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="max-w-4xl mx-auto text-center">
                    {/* Trust Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-8 cursor-default shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        <span className="text-[12px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">India's First Verified Legal AI</span>
                    </div>

                    <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-semibold text-zinc-900 dark:text-white tracking-tight leading-[1.0] mb-8">
                        Legal intelligence, <br />
                        <span className="text-zinc-400 dark:text-zinc-600">grounded in reality.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-12 font-light">
                        Research Indian case law with <span className="text-zinc-900 dark:text-white font-medium underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2">zero hallucinations</span>. Draft compliant contracts in minutes. Manage your practice without the chaos.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
                        <a href="#waitlist" className="h-14 px-8 bg-gradient-to-b from-zinc-800 to-zinc-950 dark:from-white dark:to-zinc-200 text-white dark:text-zinc-950 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2 group border border-zinc-700 dark:border-zinc-300 shadow-xl shadow-zinc-200/50 dark:shadow-none">
                            Start Free Trial
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                        <button className="h-14 px-8 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm">
                            See the Demo
                        </button>
                    </div>
                </div>

                {/* Main Product Mockup */}
                <div className="relative mx-auto max-w-7xl px-0">
                    <div className="relative rounded-xl md:rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9] group ring-1 ring-zinc-950/5 dark:ring-white/5">

                        {/* App UI */}
                        <div className="flex h-full flex-col md:flex-row bg-zinc-50 dark:bg-zinc-900 text-left">

                            {/* Sidebar Navigation */}
                            <div className="hidden md:flex w-64 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex-col justify-between shrink-0 text-left">
                                <div>
                                    {/* App Switcher */}
                                    <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-5 gap-3">
                                        <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-white flex items-center justify-center shadow-sm">
                                            <ScaleIcon className="w-4 h-4 text-white dark:text-zinc-900" />
                                        </div>
                                        <span className="font-bold text-sm text-zinc-900 dark:text-white">Workspace</span>
                                        <ChevronRightIcon className="w-3.5 h-3.5 text-zinc-400 ml-auto" />
                                    </div>

                                    {/* Navigation Links */}
                                    <div className="p-3 space-y-1 mt-2">
                                        <div className="px-3 py-2 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-lg flex items-center gap-3 text-sm font-semibold text-zinc-900 dark:text-white shadow-sm cursor-pointer">
                                            <SparklesIcon className="w-4 h-4 text-blue-600" />
                                            Research AI
                                        </div>
                                        <div className="px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors group/nav">
                                            <PencilSquareIcon className="w-4 h-4 group-hover/nav:text-zinc-900 dark:group-hover/nav:text-white transition-colors" />
                                            Smart Drafter
                                        </div>
                                        <div className="px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors group/nav">
                                            <FolderIcon className="w-4 h-4 group-hover/nav:text-zinc-900 dark:group-hover/nav:text-white transition-colors" />
                                            Case Files
                                        </div>
                                    </div>

                                    {/* Recent History */}
                                    <div className="mt-6 px-5">
                                        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">RECENT</div>
                                        <div className="space-y-3 pl-1">
                                            {[
                                                { title: "Sec 138 Analysis", time: "2m ago" },
                                                { title: "NDA - TechCorp", time: "2h ago" },
                                                { title: "Sharma Bail Plea", time: "1d ago" }
                                            ].map((item, i) => (
                                                <div key={i} className="flex flex-col gap-0.5 cursor-pointer group/item relative pl-3 border-l border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
                                                    <span className="text-sm text-zinc-600 dark:text-zinc-300 group-hover/item:text-zinc-900 dark:group-hover/item:text-white transition-colors truncate font-medium">{item.title}</span>
                                                    <span className="text-[10px] text-zinc-400">{item.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* User Profile */}
                                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 border border-zinc-200 shadow-inner"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">Aditya Verma</p>
                                            <p className="text-xs text-zinc-500 truncate">Senior Advocate</p>
                                        </div>
                                        <Cog6ToothIcon className="w-5 h-5 text-zinc-400 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-200" />
                                    </div>
                                </div>
                            </div>

                            {/* Main Interface */}
                            <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 relative">

                                {/* Top Header */}
                                <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-8 bg-white dark:bg-zinc-950 shrink-0">
                                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                                        <span className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors">Research</span>
                                        <ChevronRightIcon className="w-3 h-3 text-zinc-300" />
                                        <span className="text-zinc-900 dark:text-white font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                            New Query
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg min-w-[240px]">
                                            <MagnifyingGlassIcon className="w-4 h-4 text-zinc-400" />
                                            <span className="text-xs text-zinc-400 font-medium">Search cases, acts...</span>
                                            <div className="ml-auto flex items-center gap-1">
                                                <span className="text-[10px] text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5 shadow-sm">⌘K</span>
                                            </div>
                                        </div>
                                        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
                                        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                                            <ShareIcon className="w-5 h-5 text-zinc-400 hover:text-zinc-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Chat / Content Area */}
                                <div className="flex-1 overflow-hidden relative flex flex-col">
                                    <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10">

                                        {/* User Message */}
                                        <div className="flex justify-end">
                                            <div className="flex gap-4 max-w-2xl flex-row-reverse group">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 border border-zinc-200 shrink-0 shadow-sm mt-1"></div>
                                                <div className="flex flex-col items-end gap-1.5 text-right">
                                                    <span className="text-[11px] text-zinc-400 font-medium">10:42 AM</span>
                                                    <div className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white px-6 py-4 rounded-3xl rounded-tr-none text-[15px] shadow-sm border border-zinc-200 dark:border-zinc-700/50 inline-block text-left leading-relaxed">
                                                        What is the penalty for cheque bounce under Section 138 of NI Act?
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Response */}
                                        <div className="flex gap-5 max-w-3xl group">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 ring-4 ring-blue-50 dark:ring-blue-900/10 mt-1">
                                                <SparklesIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="space-y-4 w-full">
                                                <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl rounded-tl-none border border-zinc-200 dark:border-zinc-800 shadow-sm text-[15px] text-zinc-800 dark:text-zinc-200 leading-7 relative">
                                                    <p className="mb-6">
                                                        According to <strong className="text-zinc-900 dark:text-white font-bold bg-blue-50 dark:bg-blue-900/20 px-1 rounded border border-blue-100 dark:border-blue-800/30">Section 138 of the Negotiable Instruments Act, 1881</strong>, the dishonour of a cheque for insufficiency of funds is a criminal offence. The penalties prescribed are:
                                                    </p>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                                        <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex gap-4 hover:border-red-200 dark:hover:border-red-900/50 transition-colors">
                                                            <div className="w-1 bg-red-500 rounded-full h-full"></div>
                                                            <div>
                                                                <div className="text-xs font-bold text-zinc-900 dark:text-white mb-1 uppercase tracking-wide">Imprisonment</div>
                                                                <div className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">Up to 2 years</div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex gap-4 hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors">
                                                            <div className="w-1 bg-orange-500 rounded-full h-full"></div>
                                                            <div>
                                                                <div className="text-xs font-bold text-zinc-900 dark:text-white mb-1 uppercase tracking-wide">Monetary Fine</div>
                                                                <div className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">Up to twice the cheque amount</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Rich Citation Card */}
                                                    <div className="mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-5">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                                                <CheckBadgeIcon className="w-3.5 h-3.5 text-green-500" />
                                                                Verified Sources
                                                            </p>
                                                            <div className="flex gap-2">
                                                                <button className="text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline">View Full Act</button>
                                                            </div>
                                                        </div>
                                                        <div className="bg-blue-50/50 dark:bg-blue-900/5 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4 flex items-start gap-4 group/citation cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all hover:shadow-sm">
                                                            <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg border border-blue-100 dark:border-blue-900/50 shadow-sm shrink-0">
                                                                <BookOpenIcon className="w-5 h-5 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 group-hover/citation:text-blue-600 transition-colors">The Negotiable Instruments Act, 1881</h4>
                                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-mono bg-white dark:bg-zinc-950 px-2 py-1 rounded border border-zinc-100 dark:border-zinc-800/50 inline-block">
                                                                    "Where any cheque drawn by a person on an account maintained by him with a banker for payment of any amount of money..."
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Response Actions */}
                                                    <div className="absolute top-6 right-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors" title="Copy"><DocumentTextIcon className="w-4 h-4 text-zinc-400" /></button>
                                                        <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors" title="Regenerate"><ArrowPathIcon className="w-4 h-4 text-zinc-400" /></button>
                                                    </div>
                                                </div>

                                                {/* Suggested Actions */}
                                                <div className="flex flex-wrap gap-2 pl-2">
                                                    <button className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-full shadow-sm hover:shadow transition-all hover:-translate-y-0.5">Draft Legal Notice for Cheque Bounce</button>
                                                    <button className="text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-full shadow-sm hover:shadow transition-all hover:-translate-y-0.5">Find Supreme Court Judgments on Sec 138</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 pt-12">
                                        <div className="max-w-4xl mx-auto relative shadow-2xl rounded-2xl ring-1 ring-zinc-950/5 dark:ring-white/10">
                                            <div className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-2xl"></div>
                                            <div className="relative flex items-center p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                                <button className="p-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                                                    <PaperClipIcon className="w-5 h-5" />
                                                </button>
                                                <input
                                                    type="text"
                                                    placeholder="Ask a follow up question or paste case details..."
                                                    className="flex-1 bg-transparent border-none text-[15px] px-3 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-0"
                                                    disabled
                                                />
                                                <button className="p-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:opacity-90 transition-opacity shadow-md">
                                                    <ArrowRightIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-center mt-4">
                                            <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
                                                <ShieldCheckIcon className="w-3 h-3" />
                                                NyayaFlow is designed for legal professionals. Verify important information.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section >
    );
};

export default Hero;
