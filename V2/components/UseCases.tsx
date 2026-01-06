import React from "react";
import {
    CheckCircleIcon,
    ArrowRightIcon
} from "@heroicons/react/24/outline";

const UseCases = () => {
    return (
        <section id="use-cases" className="py-24 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* For Startups */}
                    <div className="relative pl-8 md:pl-12 border-l-2 border-zinc-200 dark:border-zinc-800">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white dark:bg-zinc-900 border-2 border-blue-500 rounded-full shadow-sm ring-4 ring-blue-50 dark:ring-blue-900/20"></div>
                        <h3 className="font-display text-3xl font-bold text-zinc-900 dark:text-white mb-6">For Startups</h3>
                        <ul className="space-y-6">
                            {[
                                "Validate business name trademark availability instantly.",
                                "Generate employment letters and ESOP agreements tailored to your state.",
                                "Review vendor contracts for hidden risks in seconds."
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 text-zinc-600 dark:text-zinc-400 text-lg">
                                    <CheckCircleIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8">
                            <button className="text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                Explore Startup Tools <ArrowRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* For Lawyers */}
                    <div className="relative pl-8 md:pl-12 border-l-2 border-zinc-200 dark:border-zinc-800">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white dark:bg-zinc-900 border-2 border-orange-500 rounded-full shadow-sm ring-4 ring-orange-50 dark:ring-orange-900/20"></div>
                        <h3 className="font-display text-3xl font-bold text-zinc-900 dark:text-white mb-6">For Advocates</h3>
                        <ul className="space-y-6">
                            {[
                                "Slash research time by 90% with precise, verified citations.",
                                "Auto-generate first drafts of legal notices and petitions.",
                                "Track 50+ cases across different courts in a single dashboard."
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 text-zinc-600 dark:text-zinc-400 text-lg">
                                    <CheckCircleIcon className="w-6 h-6 text-orange-500 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8">
                            <button className="text-orange-600 dark:text-orange-400 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                Explore Advocate Tools <ArrowRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default UseCases;
