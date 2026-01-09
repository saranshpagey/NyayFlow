import React, { createContext, useContext, useState, useEffect } from 'react';

interface LayoutContextType {
    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarWidth, setSidebarWidth] = useState(256);

    useEffect(() => {
        const storedWidth = localStorage.getItem('sidebarWidth');
        if (storedWidth) setSidebarWidth(parseInt(storedWidth));
    }, []);

    return (
        <LayoutContext.Provider value={{ sidebarWidth, setSidebarWidth }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within LayoutProvider');
    }
    return context;
};
