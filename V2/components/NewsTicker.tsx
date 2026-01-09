import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InfoCircle } from 'iconoir-react';

const NEWS_ITEMS = [
    "Supreme Court to hear pleas on new Criminal Laws (BNS, BNSS, BSA) next week.",
    "Delhi High Court issues guidelines for AI use in legal drafting.",
    "Bar Council notifies updates to advocate enrollment process.",
    "RBI releases new framework for digital lending apps and recovery agents.",
    "Justice Sharma retires; Farewell ceremony scheduled for Friday."
];

export const NewsTicker = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % NEWS_ITEMS.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full bg-blue-50 dark:bg-blue-900/10 border-y border-blue-100 dark:border-blue-900/30 overflow-hidden h-10 flex items-center relative">
            <div className="absolute left-0 h-full bg-blue-100 dark:bg-blue-900/30 px-4 flex items-center z-10">
                <InfoCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider hidden sm:inline">Legal Updates</span>
            </div>

            <div className="flex-1 ml-32 sm:ml-40 pr-4 relative h-full flex items-center overflow-hidden">
                <AnimatePresence mode='wait'>
                    <motion.p
                        key={currentIndex}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 truncate absolute w-full"
                    >
                        {NEWS_ITEMS[currentIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
};
