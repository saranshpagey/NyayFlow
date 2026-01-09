import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Book,
    SunLight,
    HalfMoon,
    Xmark,
    Menu,
} from "iconoir-react";

interface NavbarProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 top-0 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                        <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-zinc-900 transition-transform group-hover:scale-95">
                            <Book className="w-5 h-5" />
                        </div>
                        <span className="font-display font-semibold text-xl tracking-tight text-zinc-900 dark:text-white">NyayaFlow</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">Features</a>
                        <a href="#how-it-works" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">Workflow</a>
                        <a href="#use-cases" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm transition-colors">Customers</a>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {darkMode ? <SunLight className="w-4 h-4" /> : <HalfMoon className="w-4 h-4" />}
                        </button>
                        <Link to="/login" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <a href="#waitlist" className="bg-zinc-900 dark:bg-white dark:text-zinc-950 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all border border-transparent dark:border-transparent">
                            Request Access
                        </a>
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleDarkMode}
                            className="text-zinc-500 dark:text-zinc-400"
                        >
                            {darkMode ? <SunLight className="w-5 h-5" /> : <HalfMoon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-900 dark:text-white">
                            {isOpen ? <Xmark className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-white/10 shadow-xl z-20">
                    <div className="px-6 py-8 space-y-4">
                        <a href="#features" className="block text-base text-zinc-900 dark:text-white">Features</a>
                        <a href="#how-it-works" className="block text-base text-zinc-900 dark:text-white">Workflow</a>
                        <a href="#use-cases" className="block text-base text-zinc-900 dark:text-white">Customers</a>
                        <a href="#waitlist" className="block text-center w-full px-4 py-3 text-base font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-950 rounded-lg mt-4">Join Waitlist</a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
