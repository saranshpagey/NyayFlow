import React from "react";
import { ScaleIcon } from "@heroicons/react/24/outline";

const Footer = () => {
    return (
        <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/5 pt-20 pb-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
                                <ScaleIcon className="w-5 h-5 text-white dark:text-zinc-900" />
                            </div>
                            <span className="font-display font-bold text-xl text-zinc-900 dark:text-white">NyayaFlow</span>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xs mb-6">
                            Democratizing legal access in India through verifiable, secure, and intelligent AI.
                        </p>
                        <div className="flex gap-4">
                            {/* Placeholder Social Icons */}
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Product</h4>
                        <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Security</a></li>
                            <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Changelog</a></li>
                            <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Legal</a></li>
                            <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Careers</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-200 dark:border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-400 dark:text-zinc-600 text-xs">
                        © 2023 NyayaFlow Technologies Pvt Ltd. All rights reserved.
                    </p>
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-medium text-green-600 dark:text-green-500">Systems Operational</span>
                        </div>
                        <span className="text-xs text-zinc-400 cursor-pointer hover:underline">Privacy Policy</span>
                        <span className="text-xs text-zinc-400 cursor-pointer hover:underline">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
