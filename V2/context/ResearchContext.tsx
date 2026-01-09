import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Message, ResearchSession, Folder } from '../lib/types';

interface ResearchContextType {
    sessions: ResearchSession[];
    folders: Folder[];
    activeSessionId: string | null;
    activeFolderId: string | null;
    activeSession: ResearchSession | null;

    // Actions
    createNewSession: (folderId?: string, initialMessage?: string) => string;
    loadSession: (id: string) => void;
    loadFolder: (id: string) => void;
    addMessage: (msg: Message, sessionId?: string) => void;
    updateSessionTitle: (title: string) => void;
    deleteSession: (id: string) => void;
    deleteMultipleSessions: (ids: string[]) => void;
    updateSessionDraft: (sessionId: string, draftContext: any) => void;

    // Folder Actions
    createFolder: (name: string) => void;
    moveSessionToFolder: (sessionId: string, folderId: string | undefined) => void;
    deleteFolder: (id: string) => void;

    // Loading & Draft UI State (Transient or Session-linked)
    loadingSessionId: string | null;
    setLoadingSessionId: (id: string | null) => void;
    showDraftPanel: boolean;
    setShowDraftPanel: (show: boolean) => void;
}

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export const useResearch = () => {
    const context = useContext(ResearchContext);
    if (!context) {
        throw new Error("useResearch must be used within a ResearchProvider");
    }
    return context;
};

const STORAGE_KEY_SESSIONS = 'nyayaflow_sessions_v1';
const STORAGE_KEY_FOLDERS = 'nyayaflow_folders_v1';

export const ResearchProvider = ({ children }: { children: ReactNode }) => {
    const [sessions, setSessions] = useState<ResearchSession[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);
    const [showDraftPanel, setShowDraftPanel] = useState(false);

    // Persistence: Load
    useEffect(() => {
        const storedSessions = localStorage.getItem(STORAGE_KEY_SESSIONS);
        const storedFolders = localStorage.getItem(STORAGE_KEY_FOLDERS);

        if (storedSessions) {
            try {
                const parsed = JSON.parse(storedSessions);
                if (Array.isArray(parsed)) {
                    setSessions(parsed);
                }
            } catch (e) {
                console.error("Failed to load sessions", e);
            }
        }
        if (storedFolders) {
            try {
                const parsed = JSON.parse(storedFolders);
                if (Array.isArray(parsed)) {
                    setFolders(parsed);
                }
            } catch (e) {
                console.error("Failed to load folders", e);
            }
        }
    }, []);

    // Persistence: Save
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    }, [sessions]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
    }, [folders]);

    const activeSession = sessions.find(s => s.id === activeSessionId) || null;

    const createNewSession = (folderId?: string, initialMessage?: string) => {
        const newId = Date.now().toString();
        const newSession: ResearchSession = {
            id: newId,
            title: initialMessage ? (initialMessage.slice(0, 30) + (initialMessage.length > 30 ? '...' : '')) : 'New Research',
            messages: initialMessage ? [{
                id: Date.now().toString(),
                role: 'user',
                content: initialMessage
            }] : [],
            timestamp: Date.now(),
            folderId,
            draftContext: { content: '', title: 'Draft Document' }
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newId);
        setActiveFolderId(null);
        setShowDraftPanel(false);
        return newId;
    };

    const loadSession = (id: string) => {
        setActiveSessionId(id);
        setActiveFolderId(null);
        const session = sessions.find(s => s.id === id);
        // ...
    };

    const loadFolder = (id: string) => {
        setActiveFolderId(id);
        setActiveSessionId(null);
    };

    const addMessage = (msg: Message, sessionId?: string) => {
        const targetId = sessionId || activeSessionId;

        if (!targetId) {
            console.warn('addMessage called with no active session');
            return;
        }

        setSessions(prev => prev.map(s => {
            if (s.id === targetId) {
                const updatedMessages = [...s.messages, msg];
                // Auto-generate title if it's the first message
                let newTitle = s.title;
                if (s.messages.length === 0 && msg.role === 'user') {
                    newTitle = msg.content.slice(0, 30) + (msg.content.length > 30 ? '...' : '');
                }
                return {
                    ...s,
                    messages: updatedMessages,
                    title: newTitle,
                    timestamp: Date.now()
                };
            }
            return s;
        }));
    };

    const updateSessionTitle = (title: string) => {
        setSessions(prev => prev.map(s =>
            s.id === activeSessionId ? { ...s, title } : s
        ));
    };

    const deleteSession = (id: string) => {
        setSessions(prev => prev.filter(s => s.id !== id));
        if (activeSessionId === id) setActiveSessionId(null);
    };

    const deleteMultipleSessions = (ids: string[]) => {
        setSessions(prev => prev.filter(s => !ids.includes(s.id)));
        if (activeSessionId && ids.includes(activeSessionId)) {
            setActiveSessionId(null);
        }
    };

    const createFolder = (name: string) => {
        const newFolder: Folder = {
            id: Date.now().toString(),
            name,
            timestamp: Date.now()
        };
        setFolders(prev => [newFolder, ...prev]);
    };

    const moveSessionToFolder = (sessionId: string, folderId: string | undefined) => {
        setSessions(prev => prev.map(s =>
            s.id === sessionId ? { ...s, folderId } : s
        ));
    };

    const deleteFolder = (id: string) => {
        setFolders(prev => prev.filter(f => f.id !== id));
        // Reset sessions in that folder to no folder
        setSessions(prev => prev.map(s =>
            s.folderId === id ? { ...s, folderId: undefined } : s
        ));
    };

    const updateSessionDraft = (sessionId: string, draftContext: any) => {
        setSessions(prev => prev.map(s =>
            s.id === sessionId ? { ...s, draftContext: { ...s.draftContext, ...draftContext } } : s
        ));
    };

    return (
        <ResearchContext.Provider value={{
            sessions,
            folders,
            activeSessionId,
            activeFolderId,
            activeSession,
            createNewSession,
            loadSession,
            loadFolder,
            addMessage,
            updateSessionTitle,
            deleteSession,
            deleteMultipleSessions,
            updateSessionDraft,
            createFolder,
            moveSessionToFolder,
            deleteFolder,
            loadingSessionId,
            setLoadingSessionId,
            showDraftPanel,
            setShowDraftPanel
        }}>
            {children}
        </ResearchContext.Provider>
    );
};
