import React, { useState, useRef, useEffect } from 'react';
import { Modal } from './Modal';
import { EditPencil } from 'iconoir-react';

interface PromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (value: string) => void;
    title: string;
    label: string;
    placeholder?: string;
    defaultValue?: string;
    confirmText?: string;
    cancelText?: string;
    maxLength?: number;
}

export const PromptModal: React.FC<PromptModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    label,
    placeholder = '',
    defaultValue = '',
    confirmText = 'Create',
    cancelText = 'Cancel',
    maxLength = 50
}) => {
    const [value, setValue] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setValue(defaultValue);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, defaultValue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onSubmit(value.trim());
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="p-4 rounded-3xl bg-blue-100 dark:bg-blue-900/20 text-blue-600">
                        <EditPencil className="w-6 h-6" />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white text-center">
                        {title}
                    </h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {label}
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={placeholder}
                            maxLength={maxLength}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-blue-500 focus:ring-0 text-zinc-900 dark:text-white placeholder-zinc-400 transition-colors text-sm"
                        />
                        <div className="flex justify-between text-xs text-zinc-400">
                            <span>{value.length}/{maxLength}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl font-medium text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="submit"
                        disabled={!value.trim()}
                        className="flex-1 px-4 py-3 rounded-xl font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {confirmText}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
