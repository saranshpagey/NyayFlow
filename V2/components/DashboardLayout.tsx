import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
    ScaleIcon,
    ChevronRightIcon,
    SparklesIcon,
    PencilSquareIcon,
    FolderIcon,
    Cog6ToothIcon,
    MagnifyingGlassIcon,
    ShareIcon
} from "@heroicons/react/24/outline";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900 text-left font-sans text-zinc-900 dark:text-white">

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
                        <Link to="/research" className="px-3 py-2 bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-lg flex items-center gap-3 text-sm font-semibold text-zinc-900 dark:text-white shadow-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                            <SparklesIcon className="w-4 h-4 text-blue-600" />
                            Research AI
                        </Link>
                        <Link to="/drafter" className="px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors group/nav">
                            <PencilSquareIcon className="w-4 h-4 group-hover/nav:text-zinc-900 dark:group-hover/nav:text-white transition-colors" />
                            Smart Drafter
                        </Link>
                        <Link to="/practice" className="px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors group/nav">
                            <FolderIcon className="w-4 h-4 group-hover/nav:text-zinc-900 dark:group-hover/nav:text-white transition-colors" />
                            Case Files
                        </Link>
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
            <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 relative min-w-0">

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

                {/* Content Area */}
                <main className="flex-1 overflow-hidden relative flex flex-col">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
