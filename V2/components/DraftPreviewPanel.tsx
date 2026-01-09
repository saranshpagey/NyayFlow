import React from 'react';
import { Download, Check, Xmark } from 'iconoir-react';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

interface DraftPreviewPanelProps {
    template: string;
    variables: Record<string, string>;
    title: string;
    onClose: () => void;
}

export const DraftPreviewPanel: React.FC<DraftPreviewPanelProps> = ({
    template,
    variables,
    title,
    onClose
}) => {
    const [isSaving, setIsSaving] = React.useState(false);

    // Interpolate variables into template
    const renderContent = () => {
        let content = template;
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, value || `[${key}]`);
        });
        return content;
    };

    const handleExport = async () => {
        setIsSaving(true);
        try {
            const doc = new jsPDF({
                unit: 'mm',
                format: 'a4',
            });

            const pageWidth = 210;
            const margin = 20;
            const contentWidth = pageWidth - (2 * margin);

            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(title.toUpperCase(), pageWidth / 2, margin, { align: 'center' });

            doc.setFontSize(12);
            doc.setFont('times', 'normal');
            const cleanContent = renderContent();
            const splitText = doc.splitTextToSize(cleanContent, contentWidth);
            doc.text(splitText, margin, margin + 20);
            doc.save(`${title.replace(/\s+/g, '_')}_Draft.pdf`);

            toast.success('✅ Draft exported successfully!');
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Export failed. Please try again.");
        } finally {
            setTimeout(() => setIsSaving(false), 1000);
        }
    };

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
                <div>
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
                        {title}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Live Preview</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                        title="Export to PDF"
                    >
                        {isSaving ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                        {isSaving ? 'Exported!' : 'Export PDF'}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-zinc-400 hover:text-red-500 transition-colors"
                    >
                        <Xmark className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Preview Document */}
            <div className="flex-1 overflow-y-auto p-8">
                <div
                    className="relative mx-auto bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xl rounded-2xl p-12 font-serif text-[15px] leading-relaxed whitespace-pre-wrap border border-zinc-200 dark:border-zinc-800"
                    style={{ width: '100%', maxWidth: '210mm', minHeight: '297mm' }}
                >
                    {renderContent()}
                </div>
                <p className="mt-6 text-center text-xs text-zinc-400 uppercase tracking-widest">
                    End of Document
                </p>
            </div>
        </div>
    );
};
