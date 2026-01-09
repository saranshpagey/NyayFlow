import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    FolderPlus,
    Check,
    Trash,
    Folder,
    NavArrowDown,
} from 'iconoir-react';
import { useResearch } from '../../context/ResearchContext';
import { useModal } from '../../context/ModalContext';
import { cn } from '../../lib/utils';

// Helper for time ago
const formatTimeAgo = (timestamp: number | string | Date) => {
    const date = new Date(timestamp);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

interface SidebarHistoryProps {
    onCloseMobile?: () => void;
}

export const SidebarHistory: React.FC<SidebarHistoryProps> = ({ onCloseMobile }) => {
    const navigate = useNavigate();
    const {
        sessions,
        folders,
        activeSessionId,
        activeFolderId,
        createNewSession,
        loadSession,
        loadFolder,
        createFolder,
        moveSessionToFolder,
        deleteSession,
        deleteMultipleSessions
    } = useResearch();

    const { showConfirm, showPrompt, showFolderSelect } = useModal();
    const [isSelectMode, setIsSelectMode] = React.useState(false);
    const [selectedSessionIds, setSelectedSessionIds] = React.useState<string[]>([]);
    const [expandedFolders, setExpandedFolders] = React.useState<string[]>([]);

    const handleSessionClick = (id: string) => {
        if (isSelectMode) {
            setSelectedSessionIds(prev =>
                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            );
            return;
        }
        loadSession(id);
        navigate('/research');
        onCloseMobile?.();
    };

    const toggleFolder = (id: string) => {
        setExpandedFolders(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const confirmed = await showConfirm({
            title: 'Delete Research Session?',
            description: 'This action cannot be undone. All chat history and notes will be permanently removed.',
            confirmText: 'Delete',
            variant: 'danger'
        });
        if (confirmed) {
            deleteSession(id);
        }
    };

    const renderSessionItem = (session: any) => {
        const isSelected = selectedSessionIds.includes(session.id);
        const isActive = activeSessionId === session.id;

        return (
            <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className={cn(
                    "flex items-center group relative px-3 py-2 cursor-pointer rounded-xl transition-all border border-transparent",
                    isSelected ? "bg-blue-100/50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800" :
                        isActive ? "bg-white dark:bg-zinc-800 shadow-sm border-zinc-200 dark:border-zinc-700" :
                            "hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                )}
            >
                {isSelectMode && (
                    <div className="mr-3 shrink-0">
                        <div className={cn(
                            "w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center",
                            isSelected ? "bg-blue-600 border-blue-600" : "border-zinc-300 dark:border-zinc-700"
                        )}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <span className={cn(
                        "text-xs truncate block leading-tight",
                        isActive ? "text-zinc-900 dark:text-white font-medium" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                    )}>{session.title}</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">{formatTimeAgo(session.timestamp)}</span>
                </div>

                {!isSelectMode && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                const folderId = await showFolderSelect({
                                    folders,
                                    currentFolderId: session.folderId,
                                    title: 'Move to Folder'
                                });
                                if (folderId !== null) moveSessionToFolder(session.id, folderId);
                            }}
                            className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-orange-500"
                        >
                            <FolderPlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={(e) => handleDeleteSession(e, session.id)}
                            className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-red-500"
                        >
                            <Trash className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4 pt-2">
            {/* Refined Action Grid - Icon Centric */}
            <div className="flex items-center gap-1 px-1">
                <button
                    onClick={() => {
                        createNewSession();
                        navigate('/research');
                        onCloseMobile?.();
                    }}
                    title="New Chat"
                    className="flex-1 flex items-center justify-center p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600 transition-all"
                >
                    <Plus className="w-5 h-5" />
                </button>
                <button
                    onClick={async () => {
                        const name = await showPrompt({
                            title: 'Create New Folder',
                            label: 'Folder Name',
                            placeholder: 'e.g., Criminal Cases...',
                            confirmText: 'Create Folder'
                        });
                        if (name) createFolder(name);
                    }}
                    title="New Folder"
                    className="flex-1 flex items-center justify-center p-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 dark:hover:bg-orange-900/20 text-orange-600 transition-all"
                >
                    <FolderPlus className="w-5 h-5" />
                </button>
                <button
                    onClick={() => {
                        setIsSelectMode(!isSelectMode);
                        setSelectedSessionIds([]);
                    }}
                    title={isSelectMode ? "Done Selecting" : "Select Sessions"}
                    className={cn(
                        "flex-1 flex items-center justify-center p-2.5 rounded-xl transition-all",
                        isSelectMode
                            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    )}
                >
                    <Check className="w-5 h-5" />
                </button>
            </div>

            {/* Folder & Session List */}
            <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-1 scrollbar-hide">
                {folders.map(folder => (
                    <div key={folder.id} className="space-y-1">
                        <div
                            onClick={() => {
                                loadFolder(folder.id);
                                navigate('/research');
                                if (!expandedFolders.includes(folder.id)) toggleFolder(folder.id);
                                onCloseMobile?.();
                            }}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all group relative",
                                activeFolderId === folder.id
                                    ? "bg-orange-50/50 dark:bg-orange-950/20 text-orange-600"
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                            )}
                        >
                            <Folder className={cn("w-4 h-4 transition-colors", activeFolderId === folder.id ? "text-orange-500" : "text-zinc-400")} />
                            <span className="flex-1 truncate text-xs font-medium">{folder.name}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleFolder(folder.id); }}
                                className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded-md"
                            >
                                <NavArrowDown className={cn("w-3.5 h-3.5 text-zinc-400 transition-transform", expandedFolders.includes(folder.id) ? "rotate-0" : "-rotate-90")} />
                            </button>
                        </div>

                        {expandedFolders.includes(folder.id) && (
                            <div className="pl-4 space-y-1 border-l border-zinc-200 dark:border-zinc-800 ml-5 pt-1">
                                {sessions.filter(s => s.folderId === folder.id).map(session => renderSessionItem(session))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Root Sessions */}
                <div className="space-y-1">
                    {sessions.filter(s => !s.folderId).map(session => renderSessionItem(session))}
                </div>
            </div>

            {/* Bulk Selection Bar */}
            {isSelectMode && selectedSessionIds.length > 0 && (
                <div className="bg-zinc-900 dark:bg-white rounded-xl p-2.5 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-white dark:text-zinc-900 text-[10px] font-medium pl-1 uppercase tracking-wider">
                            {selectedSessionIds.length} Selected
                        </div>
                        <button
                            onClick={async () => {
                                const confirmed = await showConfirm({
                                    title: `Delete ${selectedSessionIds.length} sessions?`,
                                    description: 'This action cannot be undone.',
                                    confirmText: 'Delete',
                                    variant: 'danger'
                                });
                                if (confirmed) {
                                    deleteMultipleSessions(selectedSessionIds);
                                    setSelectedSessionIds([]);
                                    setIsSelectMode(false);
                                }
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-medium px-2 py-1 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                            <Trash className="w-3 h-3" />
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
