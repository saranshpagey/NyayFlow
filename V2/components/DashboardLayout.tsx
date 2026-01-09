import React, { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLayout } from '../context/LayoutContext';
import {
    NavArrowRight,
    Search,
    ShareIos,
    Menu,
    Xmark,
    Activity,
    CheckCircle,
    WarningTriangle
} from "iconoir-react";
import { cn } from "../lib/utils";
import { Sidebar } from "./sidebar/Sidebar";
import SkipLink from './ui/SkipLink';
import { api } from "../lib/api";

interface DashboardLayoutProps {
    children: ReactNode;
    headerTitle?: ReactNode;
    headerRight?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, headerTitle, headerRight }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { sidebarWidth, setSidebarWidth } = useLayout();
    const [isResizing, setIsResizing] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [systemStatus, setSystemStatus] = React.useState<'healthy' | 'unhealthy' | 'checking'>('checking');

    // System health check loop
    React.useEffect(() => {
        const checkHealth = async () => {
            try {
                const health = await api.healthCheck();
                setSystemStatus(health.status === 'healthy' ? 'healthy' : 'unhealthy');
            } catch (err) {
                setSystemStatus('unhealthy');
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, 30000); // Pulse every 30s
        return () => clearInterval(interval);
    }, []);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Collaboration link copied to clipboard!');
    };

    const startResizing = React.useCallback((e: React.MouseEvent) => {
        setIsResizing(true);
        e.preventDefault();
    }, []);

    const stopResizing = React.useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = React.useCallback((e: MouseEvent) => {
        if (isResizing) {
            const newWidth = Math.min(Math.max(240, e.clientX), 480);
            setSidebarWidth(newWidth);
        }
    }, [isResizing, setSidebarWidth]);

    React.useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [resize, stopResizing]);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const isActive = (path: string) => location.pathname === path;

    // Default Header Content
    const defaultHeaderTitle = (
        <div className="flex items-center gap-4 text-xs sm:text-sm text-zinc-500">
            <span className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors capitalize hidden sm:inline">
                {location.pathname.replace('/', '') || 'Dashboard'}
            </span>
            <NavArrowRight className="w-3 h-3 text-zinc-300 hidden sm:inline" />

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "w-2 h-2 rounded-full",
                        isActive('/research') ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-zinc-400"
                    )}></span>
                    <span className="text-zinc-900 dark:text-white font-medium">
                        {isActive('/research') ? 'Research AI' : isActive('/drafter') ? 'Smart Drafter' : isActive('/practice') ? 'Case Files' : 'Dashboard'}
                    </span>
                </div>

                <div className="w-px h-3 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

                {/* System Heartbeat */}
                <div className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md transition-all",
                    systemStatus === 'healthy' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" :
                        systemStatus === 'unhealthy' ? "text-red-600 bg-red-50 dark:bg-red-950/20" :
                            "text-zinc-400 bg-zinc-100 dark:bg-zinc-800"
                )}>
                    {systemStatus === 'healthy' ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                    ) : systemStatus === 'unhealthy' ? (
                        <WarningTriangle className="w-3.5 h-3.5" />
                    ) : (
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                    )}
                    <span className="text-[10px] uppercase font-medium tracking-widest hidden lg:inline">Legal Brain: {systemStatus}</span>
                    <span className="text-[10px] uppercase font-medium tracking-widest lg:hidden">{systemStatus}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900 text-left font-sans text-zinc-900 dark:text-white overflow-hidden">
            <SkipLink />

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobileMenu}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white dark:bg-zinc-950 z-[101] shadow-2xl md:hidden flex flex-col pt-[env(safe-area-inset-top)]"
                        >
                            <Sidebar onCloseMobile={closeMobileMenu} />
                            <button
                                onClick={closeMobileMenu}
                                className="absolute top-4 right-4 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500"
                                aria-label="Close menu"
                            >
                                <Xmark className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar Navigation */}
            <div
                style={{ width: `${sidebarWidth}px` }}
                className="hidden md:flex flex-col justify-between shrink-0 text-left relative group/sidebar z-[90]"
            >
                {/* Resize Handle */}
                <div
                    onMouseDown={startResizing}
                    className={cn(
                        "absolute top-0 -right-1 w-2 h-full cursor-col-resize z-50 transition-colors",
                        isResizing ? "bg-blue-500/20" : "hover:bg-blue-500/10"
                    )}
                >
                    <div className={cn(
                        "absolute inset-y-0 right-[3px] w-px transition-colors",
                        isResizing ? "bg-blue-500" : "bg-transparent group-hover/sidebar:bg-zinc-300 dark:group-hover/sidebar:bg-zinc-700"
                    )} />
                </div>
                <Sidebar />
            </div>

            {/* Main Interface */}
            <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 relative min-w-0">
                {/* Top Header */}
                <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-8 bg-white dark:bg-zinc-950 shrink-0 gap-4">
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 md:hidden hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        {headerTitle || defaultHeaderTitle}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {headerRight}
                        <div className="hidden md:flex items-center relative group">
                            <Search className="w-4 h-4 text-zinc-400 absolute left-3 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                            <input
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const query = (e.target as HTMLInputElement).value;
                                        if (query.trim()) {
                                            navigate(`/research?q=${encodeURIComponent(query)}`);
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }
                                }}
                                type="text"
                                placeholder="Search cases, acts..."
                                className="pl-9 pr-10 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64"
                            />
                            <div className="absolute right-2 flex items-center gap-1 pointer-events-none">
                                <span className="text-xs text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5 shadow-sm">⌘K</span>
                            </div>
                        </div>

                        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

                        <button
                            onClick={handleShare}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        >
                            <ShareIos className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <main className="flex-1 overflow-hidden relative flex flex-col">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
