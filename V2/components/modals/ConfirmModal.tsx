import React from 'react';
import { Modal } from './Modal';
import { WarningTriangle, Trash, InfoCircle } from 'iconoir-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    icon?: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'info',
    icon
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const variantConfig = {
        danger: {
            icon: icon || <Trash className="w-6 h-6" />,
            iconBg: 'bg-red-100 dark:bg-red-900/20',
            iconColor: 'text-red-600',
            confirmButton: 'bg-red-600 hover:bg-red-700 text-white'
        },
        warning: {
            icon: icon || <WarningTriangle className="w-6 h-6" />,
            iconBg: 'bg-orange-100 dark:bg-orange-900/20',
            iconColor: 'text-orange-600',
            confirmButton: 'bg-orange-600 hover:bg-orange-700 text-white'
        },
        info: {
            icon: icon || <InfoCircle className="w-6 h-6" />,
            iconBg: 'bg-blue-100 dark:bg-blue-900/20',
            iconColor: 'text-blue-600',
            confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white'
        }
    };

    const config = variantConfig[variant];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
            <div className="space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className={`p-4 rounded-3xl ${config.iconBg} ${config.iconColor}`}>
                        {config.icon}
                    </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                        {title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm ${config.confirmButton} transition-colors shadow-lg`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
