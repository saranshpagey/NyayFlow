import React, { useState } from 'react';
import { Modal } from './Modal';
import { Folder, FolderMinus } from 'iconoir-react';
import { Folder as FolderType } from '../../lib/types';

interface FolderSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (folderId: string | undefined) => void;
    folders: FolderType[];
    currentFolderId?: string;
    title?: string;
}

export const FolderSelectModal: React.FC<FolderSelectModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    folders,
    currentFolderId,
    title = 'Move to Folder'
}) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(currentFolderId);

    const handleConfirm = () => {
        onSelect(selectedId);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" title={title}>
            <div className="space-y-6">
                {/* Description */}
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Choose a folder to organize this research session, or select "No Folder" to keep it ungrouped.
                </p>

                {/* Folder List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {/* No Folder Option */}
                    <button
                        onClick={() => setSelectedId(undefined)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${selectedId === undefined
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                            }`}
                    >
                        <div className={`p-3 rounded-xl ${selectedId === undefined
                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                            }`}>
                            <FolderMinus className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className={`font-semibold text-sm ${selectedId === undefined
                                ? 'text-blue-600'
                                : 'text-zinc-900 dark:text-white'
                                }`}>
                                No Folder
                            </div>
                            <div className="text-xs text-zinc-400">
                                Keep research ungrouped
                            </div>
                        </div>
                        {selectedId === undefined && (
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                        )}
                    </button>

                    {/* Folder Options */}
                    {folders.length === 0 ? (
                        <div className="p-8 text-center text-zinc-400 text-sm italic">
                            No folders created yet. Create a folder from the sidebar to organize your research.
                        </div>
                    ) : (
                        folders.map((folder) => (
                            <button
                                key={folder.id}
                                onClick={() => setSelectedId(folder.id)}
                                className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${selectedId === folder.id
                                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                    }`}
                            >
                                <div className={`p-3 rounded-xl ${selectedId === folder.id
                                    ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600'
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                                    }`}>
                                    <Folder className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`font-semibold text-sm truncate ${selectedId === folder.id
                                        ? 'text-orange-600'
                                        : 'text-zinc-900 dark:text-white'
                                        }`}>
                                        {folder.name}
                                    </div>
                                    <div className="text-xs text-zinc-400">
                                        Research Folder
                                    </div>
                                </div>
                                {selectedId === folder.id && (
                                    <div className="w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl font-medium text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-3 rounded-xl font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg"
                    >
                        Move Here
                    </button>
                </div>
            </div>
        </Modal>
    );
};
