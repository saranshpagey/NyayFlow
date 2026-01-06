import React from "react";
import {
    CheckBadgeIcon,
    BoltIcon,
    LockClosedIcon
} from "@heroicons/react/24/outline";

const WhyUs = () => {
    return (
        <section className="py-24 bg-white dark:bg-zinc-950 relative border-t border-zinc-100 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6">Why NyayaFlow?</h2>
                    <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">Precision where it counts. We prioritize accuracy and security over generative fluff.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Verifiable Accuracy",
                            desc: "Every claim is backed by a specific Section or Judgment link. Click to read the original source text instantly.",
                            icon: <CheckBadgeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        },
                        {
                            title: "Startup Economics",
                            desc: "Legal tech shouldn't cost a fortune. Flat monthly pricing with unlimited queries. No hidden 'per-search' fees.",
                            icon: <BoltIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        },
                        {
                            title: "Bank-Grade Privacy",
                            desc: "Client data is encrypted at rest and in transit. We never train our public models on your private case files.",
                            icon: <LockClosedIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group hover:shadow-lg">
                            <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{item.title}</h3>
                            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default WhyUs;
