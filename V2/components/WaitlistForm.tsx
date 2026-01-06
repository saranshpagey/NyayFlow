import React, { useState } from "react";
import {
    CheckBadgeIcon,
    ArrowPathIcon
} from "@heroicons/react/24/outline";

const WaitlistForm = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");
        setTimeout(() => {
            setStatus("success");
            setEmail("");
        }, 1500);
    }

    return (
        <section id="waitlist" className="py-24 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-white/5 relative overflow-hidden">
            {/* Background decorative blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-30 pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-20 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-3xl mx-auto px-4 relative z-10 text-center">
                <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">Built for the future of Indian Law.</h2>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
                    Join the private beta. Secure your spot to access the most advanced legal OS built for India.
                </p>

                <div className="max-w-md mx-auto relative">
                    {status === "success" ? (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-8 rounded-2xl animate-fade-in-up">
                            <CheckBadgeIcon className="w-10 h-10 text-green-600 dark:text-green-500 mx-auto mb-4" />
                            <h3 className="font-bold text-xl text-green-800 dark:text-green-300 mb-2">You're on the list!</h3>
                            <p className="text-green-700 dark:text-green-400">We'll notify you as soon as your spot opens up.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="advocate@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-5 py-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all shadow-sm text-base"
                                required
                            />
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px] text-base"
                            >
                                {status === "loading" ? (
                                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                                ) : "Join Beta"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}

export default WaitlistForm;
