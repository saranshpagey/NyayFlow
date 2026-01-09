import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Book,
    NavArrowRight,
    Settings,
    UserCircle,
    CreditCard,
    LogOut
} from 'iconoir-react';
import { SidebarNav } from './SidebarNav';
import { SidebarHistory } from './SidebarHistory';
import { cn } from '../../lib/utils';

interface SidebarProps {
    onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
    const location = useLocation();
    const [isResearchExpanded, setIsResearchExpanded] = useState(location.pathname === '/research');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = React.useRef<HTMLDivElement>(null);

    // Sync expansion with location
    useEffect(() => {
        if (location.pathname === '/research') {
            setIsResearchExpanded(true);
        }
    }, [location.pathname]);

    // Close profile menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
            {/* App Header */}
            <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-5 gap-3 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center shadow-sm">
                    <Book className="w-5 h-5 text-white dark:text-zinc-900" />
                </div>
                <span className="font-semibold text-base text-zinc-900 dark:text-white uppercase tracking-tight">NyayaFlow</span>
                <NavArrowRight className="w-4 h-4 text-zinc-400 ml-auto" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                <SidebarNav
                    onCloseMobile={onCloseMobile}
                    isResearchExpanded={isResearchExpanded}
                    toggleResearch={() => setIsResearchExpanded(!isResearchExpanded)}
                    researchLibrary={
                        <div className="px-3 pb-4 space-y-4">
                            <div className="flex items-center gap-3 px-3">
                                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest whitespace-nowrap">Research Library</span>
                                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                            </div>
                            <SidebarHistory onCloseMobile={onCloseMobile} />
                        </div>
                    }
                />
            </div>

            {/* Profile Section */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 relative">
                <div
                    ref={profileMenuRef}
                    className="flex items-center justify-between h-[56px] relative group px-0.5"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 border border-zinc-200 dark:border-zinc-800 shadow-inner flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">Aditya Verma</p>
                            <p className="text-[10px] text-zinc-500 truncate uppercase tracking-wider font-medium">Senior Advocate</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        aria-label="User menu"
                    >
                        <Settings className="w-5 h-5" />
                    </button>

                    {isProfileMenuOpen && (
                        <div className="absolute bottom-[calc(100%+12px)] right-0 w-64 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
                            <button className="w-full text-left p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg text-sm flex items-center gap-3 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                <UserCircle className="w-4 h-4 text-zinc-400" /> Profile Settings
                            </button>
                            <button className="w-full text-left p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg text-sm flex items-center gap-3 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                <CreditCard className="w-4 h-4 text-zinc-400" /> Billing
                            </button>
                            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />
                            <button className="w-full text-left p-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 rounded-lg text-sm flex items-center gap-3 transition-colors">
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
