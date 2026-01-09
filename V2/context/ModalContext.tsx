import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { PromptModal } from '../components/modals/PromptModal';
import { FolderSelectModal } from '../components/modals/FolderSelectModal';
import { Folder } from '../lib/types';

interface ConfirmOptions {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    icon?: React.ReactNode;
}

interface PromptOptions {
    title: string;
    label: string;
    placeholder?: string;
    defaultValue?: string;
    confirmText?: string;
    cancelText?: string;
    maxLength?: number;
}

interface FolderSelectOptions {
    folders: Folder[];
    currentFolderId?: string;
    title?: string;
}

interface ModalContextType {
    showConfirm: (options: ConfirmOptions) => Promise<boolean>;
    showPrompt: (options: PromptOptions) => Promise<string | null>;
    showFolderSelect: (options: FolderSelectOptions) => Promise<string | undefined | null>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    // Confirm Modal State
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        options: ConfirmOptions;
        resolve: (value: boolean) => void;
    } | null>(null);

    // Prompt Modal State
    const [promptState, setPromptState] = useState<{
        isOpen: boolean;
        options: PromptOptions;
        resolve: (value: string | null) => void;
    } | null>(null);

    // Folder Select Modal State
    const [folderSelectState, setFolderSelectState] = useState<{
        isOpen: boolean;
        options: FolderSelectOptions;
        resolve: (value: string | undefined | null) => void;
    } | null>(null);

    const showConfirm = (options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmState({ isOpen: true, options, resolve });
        });
    };

    const showPrompt = (options: PromptOptions): Promise<string | null> => {
        return new Promise((resolve) => {
            setPromptState({ isOpen: true, options, resolve });
        });
    };

    const showFolderSelect = (options: FolderSelectOptions): Promise<string | undefined | null> => {
        return new Promise((resolve) => {
            setFolderSelectState({ isOpen: true, options, resolve });
        });
    };

    return (
        <ModalContext.Provider value={{ showConfirm, showPrompt, showFolderSelect }}>
            {children}

            {/* Confirm Modal */}
            {confirmState && (
                <ConfirmModal
                    isOpen={confirmState.isOpen}
                    onClose={() => {
                        confirmState.resolve(false);
                        setConfirmState(null);
                    }}
                    onConfirm={() => {
                        confirmState.resolve(true);
                        setConfirmState(null);
                    }}
                    {...confirmState.options}
                />
            )}

            {/* Prompt Modal */}
            {promptState && (
                <PromptModal
                    isOpen={promptState.isOpen}
                    onClose={() => {
                        promptState.resolve(null);
                        setPromptState(null);
                    }}
                    onSubmit={(value) => {
                        promptState.resolve(value);
                        setPromptState(null);
                    }}
                    {...promptState.options}
                />
            )}

            {/* Folder Select Modal */}
            {folderSelectState && (
                <FolderSelectModal
                    isOpen={folderSelectState.isOpen}
                    onClose={() => {
                        folderSelectState.resolve(null);
                        setFolderSelectState(null);
                    }}
                    onSelect={(folderId) => {
                        folderSelectState.resolve(folderId);
                        setFolderSelectState(null);
                    }}
                    {...folderSelectState.options}
                />
            )}
        </ModalContext.Provider>
    );
};
