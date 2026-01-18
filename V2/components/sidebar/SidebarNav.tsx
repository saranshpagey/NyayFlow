import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    Sparks,
    EditPencil as Edit,
    Folder,
    LayoutLeft as Layout,
    Database,
    Coins,
    NavArrowDown
} from 'iconoir-react';
import { cn } from '../../lib/utils';

interface NavItemProps {
    to: string;
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    colorClass?: string;
    hasSubmenu?: boolean;
    isExpanded?: boolean;
    onClick?: (e?: React.MouseEvent) => void;
}

const NavItem: React.FC<NavItemProps> = ({
    to, icon: Icon, label, isActive, colorClass, hasSubmenu, isExpanded, onClick
}) => {
    return (
        <div className="space-y-1">
            <Link
                to={to}
                onClick={onClick}
                className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all border border-transparent",
                    isActive
                        ? "bg-white dark:bg-zinc-800 shadow-sm border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white font-semibold"
                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                )}
            >
                <Icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? (colorClass || "text-zinc-900 dark:text-white") : "text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                )} />
                <span className="flex-1">{label}</span>
                {hasSubmenu && (
                    <NavArrowDown className={cn(
                        "w-4 h-4 text-zinc-400 transition-transform",
                        isExpanded ? "rotate-0" : "-rotate-90"
                    )} />
                )}
            </Link>
        </div>
    );
};

interface SidebarNavProps {
    onCloseMobile?: () => void;
    isResearchExpanded: boolean;
    toggleResearch: () => void;
    researchLibrary?: React.ReactNode;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
    onCloseMobile,
    isResearchExpanded,
    toggleResearch,
    researchLibrary
}) => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="p-3 space-y-2" aria-label="Main Navigation">
            <NavItem
                to="/dashboard"
                icon={Home}
                label="Dashboard"
                isActive={isActive('/dashboard')}
                onClick={onCloseMobile}
            />
            <NavItem
                to="/research"
                icon={Sparks}
                label="Research AI"
                isActive={isActive('/research')}
                colorClass="text-blue-600"
                hasSubmenu={true}
                isExpanded={isResearchExpanded}
                onClick={(e) => {
                    // If already on research, just toggle. If not, navigate then expand.
                    if (isActive('/research')) {
                        toggleResearch();
                    } else {
                        if (!isResearchExpanded) toggleResearch();
                    }
                    onCloseMobile?.();
                }}
            />

            <AnimatePresence initial={false}>
                {isResearchExpanded && researchLibrary && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        {researchLibrary}
                    </motion.div>
                )}
            </AnimatePresence>
            <NavItem
                to="/drafter"
                icon={Edit}
                label="Smart Drafter"
                isActive={isActive('/drafter') && location.search !== '?category=startup'}
                colorClass="text-purple-600"
                onClick={onCloseMobile}
            />
            <NavItem
                to="/practice"
                icon={Folder}
                label="Case Files"
                isActive={isActive('/practice')}
                colorClass="text-orange-600"
                onClick={onCloseMobile}
            />
            <NavItem
                to="/widgets"
                icon={Layout}
                label="Widgets"
                isActive={isActive('/widgets')}
                colorClass="text-pink-600"
                onClick={onCloseMobile}
            />
            <NavItem
                to="/kb"
                icon={Database}
                label="Knowledge Base"
                isActive={isActive('/kb')}
                colorClass="text-indigo-600"
                onClick={onCloseMobile}
            />
            <div className="pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Founder Essentials</p>
                <NavItem
                    to="/drafter?category=startup"
                    icon={Sparks}
                    label="Startup Pack"
                    isActive={location.search === '?category=startup'}
                    colorClass="text-yellow-500"
                    onClick={onCloseMobile}
                />
            </div>

            <div className="pt-2 mt-2 border-t border-zinc-100 dark:border-zinc-800">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">FinOps</p>
                <NavItem
                    to="/finops"
                    icon={Coins}
                    label="Cost Tracker"
                    isActive={isActive('/finops')}
                    colorClass="text-emerald-500"
                    onClick={onCloseMobile}
                />
            </div>
        </nav>
    );
};
