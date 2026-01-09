import { useState } from 'react';
import { Copy, Check, Page, EditPencil, Download, ViewColumns3, Sparks, ArrowRight } from 'iconoir-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface LegalDraftWidgetProps {
    data: {
        template: string;
        variables?: Record<string, string> | any[];
        documentType?: string;
        consult_lawyer?: boolean;
    };
    onOpenInStudio?: () => void;
    onOpenInSidebar?: () => void;
    onDownload?: () => void;
}

export const LegalDraftWidget = ({ data, onOpenInStudio, onOpenInSidebar, onDownload }: LegalDraftWidgetProps) => {
    const [copied, setCopied] = useState(false);

    const getDraftText = () => {
        let content = data.template || (data as any).content || (data as any).text || (data as any).payload || '';

        if (!content) return '';

        if (!data.variables) return content;

        if (Array.isArray(data.variables)) {
            data.variables.forEach((variable) => {
                const regex = new RegExp(`{{${variable.name}}}`, 'g');
                // Use placeholder or name for cleaner preview text, label is for the form
                content = content.replace(regex, `[${variable.placeholder || variable.name}]`);
            });
        } else {
            Object.entries(data.variables).forEach(([key, value]) => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                content = content.replace(regex, (value as string) || `[${key}]`);
            });
        }
        return content;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getDraftText());
        setCopied(true);
        toast.success('Draft copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            {/* Consult Lawyer Banner */}
            {data.consult_lawyer && (
                <div className="px-6 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30 flex items-center justify-center gap-2">
                    <div className="p-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                        <Sparks className="w-3 h-3" />
                    </div>
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                        High Risk Document: Consulting a lawyer is recommended.
                    </p>
                </div>
            )}

            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                        <Page className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white leading-none">
                            {data.documentType || 'Suggested Draft'}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-medium">Drafting Assistant</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {onDownload && (
                        <button
                            onClick={onDownload}
                            className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                            title="Download PDF"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content Container */}
            <div className="p-3 bg-zinc-100 dark:bg-zinc-950">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-inner font-serif text-base leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap selection:bg-blue-100 dark:selection:bg-blue-900/30 min-h-[250px] max-h-[400px] overflow-y-auto border border-zinc-200/50 dark:border-zinc-800/50 scrollbar-hide">
                    {getDraftText() || (
                        <span className="text-zinc-400 italic font-sans text-xs">AI failed to generate draft content. Try reframing the request.</span>
                    )}
                </div>
            </div>

            {/* Power Tools Section */}
            <div className="px-6 py-4 flex flex-col gap-4 bg-white dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Drafting Ecosystem</span>
                    <Link
                        to="/drafter"
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors uppercase tracking-wider"
                    >
                        Browse 50+ Templates <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onOpenInStudio}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-medium transition-all border border-indigo-200/50 dark:border-indigo-800/50"
                    >
                        <ViewColumns3 className="w-4 h-4" />
                        3-Split Studio
                    </button>
                    <button
                        onClick={onOpenInSidebar}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-medium transition-all border border-zinc-200 dark:border-zinc-800"
                    >
                        <EditPencil className="w-4 h-4" />
                        Quick Edit
                    </button>
                </div>
            </div>

            {/* Tip */}
            <div className="px-6 py-3 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                <div className="flex items-center gap-1.5">
                    <Sparks className="w-3 h-3 text-purple-500" />
                    <p className="text-xs text-zinc-500 italic">
                        All drafts can be refined with AI and printed on Stamp Paper.
                    </p>
                </div>
            </div>
        </div>
    );
};
