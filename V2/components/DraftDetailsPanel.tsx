import React from 'react';
import { DraftVariable } from '../lib/types';
import { EditPencil, Check } from 'iconoir-react';

interface DraftDetailsPanelProps {
    variables: DraftVariable[];
    values: Record<string, string>;
    onChange: (name: string, value: string) => void;
    onGenerate: () => void;
    documentType: string;
    isGenerating?: boolean;
}

export const DraftDetailsPanel: React.FC<DraftDetailsPanelProps> = ({
    variables,
    values,
    onChange,
    onGenerate,
    documentType,
    isGenerating = false
}) => {
    const allRequiredFilled = variables
        .filter(v => v.required)
        .every(v => values[v.name]?.trim());

    const renderField = (variable: DraftVariable) => {
        const value = values[variable.name] || '';
        const commonClasses = "w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";

        switch (variable.type) {
            case 'textarea':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(variable.name, e.target.value)}
                        placeholder={variable.placeholder || variable.label}
                        rows={3}
                        className={commonClasses + " resize-none"}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        value={value}
                        onChange={(e) => onChange(variable.name, e.target.value)}
                        className={commonClasses}
                    />
                );
            case 'number':
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onChange(variable.name, e.target.value)}
                        placeholder={variable.placeholder || variable.label}
                        className={commonClasses}
                    />
                );
            default:
                return (
                    <input
                        type={variable.type}
                        value={value}
                        onChange={(e) => onChange(variable.name, e.target.value)}
                        placeholder={variable.placeholder || variable.label}
                        className={commonClasses}
                    />
                );
        }
    };

    return (
        <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <EditPencil className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
                            Draft Details
                        </h2>
                        <p className="text-xs text-zinc-500">
                            {documentType.replace(/_/g, ' ')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {variables.map((variable) => (
                    <div key={variable.name} className="space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                            {variable.label}
                            {variable.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {variable.help_text && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                                {variable.help_text}
                            </p>
                        )}
                        {renderField(variable)}
                    </div>
                ))}
            </div>

            {/* Generate Button */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <button
                    onClick={onGenerate}
                    disabled={!allRequiredFilled || isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm font-medium"
                >
                    {isGenerating ? (
                        <>
                            <EditPencil className="w-4 h-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            Generate Draft
                        </>
                    )}
                </button>
                {!allRequiredFilled && (
                    <p className="mt-2 text-xs text-center text-zinc-500">
                        Fill all required fields to generate
                    </p>
                )}
            </div>
        </div>
    );
};
