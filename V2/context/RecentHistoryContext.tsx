import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface HistoryItem {
    id: string;
    text: string;
    timestamp: number;
}

interface RecentHistoryContextType {
    historyItems: HistoryItem[];
    addHistoryItem: (text: string) => void;
    clearHistory: () => void;
}

const RecentHistoryContext = createContext<RecentHistoryContextType | undefined>(undefined);

export const useRecentHistory = () => {
    const context = useContext(RecentHistoryContext);
    if (!context) {
        throw new Error("useRecentHistory must be used within a RecentHistoryProvider");
    }
    return context;
};

interface RecentHistoryProviderProps {
    children: ReactNode;
}

export const RecentHistoryProvider: React.FC<RecentHistoryProviderProps> = ({ children }) => {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('research_history_v2');
        if (stored) {
            try {
                setHistoryItems(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse history from localStorage", e);
            }
        }
    }, []);

    const addHistoryItem = (text: string) => {
        if (!text.trim()) return;

        const newItem: HistoryItem = {
            id: Date.now().toString(),
            text: text.trim(),
            timestamp: Date.now()
        };

        setHistoryItems(prev => {
            // Remove duplicates (by text) and move new to top
            const filtered = prev.filter(i => i.text.toLowerCase() !== newItem.text.toLowerCase());
            const updated = [newItem, ...filtered].slice(0, 10);

            localStorage.setItem('research_history_v2', JSON.stringify(updated));
            return updated;
        });
    };

    const clearHistory = () => {
        setHistoryItems([]);
        localStorage.removeItem('research_history_v2');
    };

    return (
        <RecentHistoryContext.Provider value={{ historyItems, addHistoryItem, clearHistory }}>
            {children}
        </RecentHistoryContext.Provider>
    );
};
