import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import PageTransition from '../components/PageTransition';
import { legalTemplates, LegalTemplate } from '../lib/templates';
import { DotBackground } from '../components/ui/grid-background';
import { StampPaper } from '../components/legal/StampPaper';
import { Letterhead } from '../components/legal/Letterhead';
import {
    EditPencil,
    Page,
    ArrowLeft,
    Download,
    Search,
    Text,
    Check,
    NavArrowRight,
    Sparks,
    Xmark,
    ShareIos,
    UserPlus,
    Printer
} from 'iconoir-react';
import { api } from '../lib/apiClient';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

// ... (existing code)

const SmartDrafter = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<LegalTemplate | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [previewContent, setPreviewContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPolishModalOpen, setIsPolishModalOpen] = useState(false);
    const [polishInstruction, setPolishInstruction] = useState('');
    const [isPolishing, setIsPolishing] = useState(false);
    const [printMode, setPrintMode] = useState(false);
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    // Regex to find {{placeholders}}
    const PLACEHOLDER_REGEX = /{{(.*?)}}/g;

    useEffect(() => {
        if (selectedTemplate) {
            // Generate preview based on form data
            let content = selectedTemplate.content;
            Object.keys(formData).forEach(key => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                content = content.replace(regex, formData[key] || `[${key.replace(/_/g, ' ').toUpperCase()}]`);
            });
            setPreviewContent(content);
        }
    }, [formData, selectedTemplate]);

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const extractFields = (template: LegalTemplate) => {
        const matches = Array.from(template.content.matchAll(PLACEHOLDER_REGEX));
        // Deduplicate
        return Array.from(new Set(matches.map(m => m[1])));
    };

    const handleExport = () => {
        if (!selectedTemplate) return;

        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(selectedTemplate.name.toUpperCase(), 105, 20, { align: 'center' });

        // Add Content
        doc.setFontSize(12);
        doc.setFont('times', 'normal');

        // Split text to fit page width
        const splitText = doc.splitTextToSize(previewContent.replace(/\[.*?\]/g, '______'), 170);
        doc.text(splitText, 20, 40);

        doc.save(`${selectedTemplate.name.replace(/\s+/g, '_')}.pdf`);
    };

    const handlePolish = async () => {
        if (!polishInstruction.trim()) return;
        setIsPolishing(true);
        try {
            const refined = await api.drafter.polish(previewContent, polishInstruction);
            setPreviewContent(refined);
            setIsPolishModalOpen(false);
            setPolishInstruction('');
        } catch (e) {
            console.error(e);
            alert("Failed to polish draft. Ensure backend is running.");
        } finally {
            setIsPolishing(false);
        }
    };

    const filteredTemplates = legalTemplates.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !categoryFilter || t.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const headerTitle = (
        <div className="flex items-center gap-4">
            {selectedTemplate && (
                <button
                    onClick={() => setSelectedTemplate(null)}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group"
                    title="Back to Templates"
                >
                    <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white" />
                </button>
            )}
            <div className="flex flex-col">
                <h1 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <EditPencil className="w-4 h-4 text-purple-600" />
                    {selectedTemplate ? 'Drafting Studio' : 'Smart Drafter'}
                    <NavArrowRight className="w-3 h-3 text-zinc-300" />
                    <span className="text-zinc-500 font-normal">
                        {selectedTemplate ? selectedTemplate.name : 'Templates'}
                    </span>
                </h1>
            </div>
        </div>
    );

    const headerRight = selectedTemplate ? (
        <div className="flex items-center gap-2">
            {/* Collaborators */}
            <div className="flex items-center -space-x-2 mr-2">
                <div className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 bg-pink-500 flex items-center justify-center text-xs font-semibold text-white shadow-sm" title="Rohan (Editing)">RJ</div>
                <div className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 bg-teal-500 flex items-center justify-center text-xs font-semibold text-white shadow-sm" title="Anjali (Viewing)">AK</div>
                <button className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shadow-sm">
                    <UserPlus className="w-3.5 h-3.5" />
                </button>
            </div>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

            {/* Print Mode Toggle for Stamp Paper */}
            {(selectedTemplate.category === 'contract' || selectedTemplate.category === 'affidavit') && (
                <button
                    onClick={() => setPrintMode(!printMode)}
                    className={cn(
                        "p-2 rounded-lg transition-colors tooltip tooltip-bottom",
                        printMode ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                    )}
                    title={printMode ? "Printing on Actual Stamp Paper" : "Show Stamp Paper Preview"}
                >
                    <Printer className="w-3.5 h-3.5" />
                </button>
            )}

            <button
                onClick={() => setIsPolishModalOpen(true)}
                className="flex items-center gap-2 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all font-display"
            >
                <Sparks className="w-3.5 h-3.5 text-purple-500" />
                Refine
            </button>
            <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105"
            >
                <Download className="w-3.5 h-3.5" />
                Export
            </button>
        </div>
    ) : null;

    return (
        <DashboardLayout headerTitle={headerTitle} headerRight={headerRight}>
            <DotBackground className="items-start justify-start">
                <PageTransition className="flex flex-col h-full w-full overflow-hidden relative z-10">

                    {/* Main Content */}
                    <AnimatePresence mode='wait'>
                        {!selectedTemplate ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex-1 overflow-y-auto p-8"
                            >
                                <div className="max-w-7xl mx-auto space-y-8">
                                    {/* Search Bar */}
                                    <div className="relative max-w-md mx-auto mb-12">
                                        <input
                                            type="text"
                                            placeholder="Search templates (e.g., 'NDA', 'Affidavit')..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                        />
                                        <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-3.5" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredTemplates.map(template => (
                                            <div
                                                key={template.id}
                                                onClick={() => setSelectedTemplate(template)}
                                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-8 -mt-8"></div>

                                                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <Page className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                                </div>

                                                <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors font-display">{template.name}</h3>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">{template.description}</p>

                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                                    <span className="text-xs uppercase font-medium tracking-wider px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-md">
                                                        {template.category}
                                                    </span>
                                                    <span className="text-xs text-indigo-600 font-medium group-hover:translate-x-1 transition-transform flex items-center">
                                                        Use Template <NavArrowRight className="w-3 h-3 ml-1" />
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex overflow-hidden p-6 gap-6"
                            >
                                {/* Inputs Panel */}
                                <div className="w-1/3 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 overflow-y-auto shadow-sm backdrop-blur-sm flex flex-col">
                                    <div className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400">
                                        <Text className="w-5 h-5" />
                                        <h3 className="font-medium uppercase text-xs tracking-wider">Fill Details</h3>
                                    </div>

                                    <div className="space-y-5 flex-1">
                                        {extractFields(selectedTemplate).map(field => (
                                            <div key={field} className="group">
                                                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 capitalize ml-1 group-focus-within:text-indigo-600 transition-colors">
                                                    {field.replace(/_/g, ' ')}
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder={`Type here...`}
                                                    className="w-full rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm py-3 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                                    value={formData[field] || ''}
                                                />
                                            </div>
                                        ))}

                                        {extractFields(selectedTemplate).length === 0 && (
                                            <div className="text-center text-zinc-400 py-10 italic">
                                                No placeholders found in this template.
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 text-center">
                                        {Object.keys(formData).length} / {extractFields(selectedTemplate).length} fields filled
                                    </div>
                                </div>

                                {/* Live Preview - Paper Effect */}
                                <div className="flex-1 bg-zinc-100/50 dark:bg-black/20 rounded-2xl p-8 overflow-y-auto flex justify-center items-start shadow-inner">
                                    <div className="bg-white text-black shadow-2xl w-full max-w-[210mm] min-h-[297mm] relative animate-in zoom-in-95 duration-500 overflow-hidden">
                                        {selectedTemplate.category === 'contract' || selectedTemplate.category === 'affidavit' ? (
                                            <StampPaper hideGraphics={printMode}>
                                                <div className="prose max-w-none whitespace-pre-wrap font-serif text-[12pt] leading-relaxed">
                                                    {previewContent.split('\n').map((line, i) => (
                                                        <React.Fragment key={i}>
                                                            {line}
                                                            <br />
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </StampPaper>
                                        ) : selectedTemplate.category === 'notice' ? (
                                            <Letterhead>
                                                <div className="prose max-w-none whitespace-pre-wrap font-serif text-[12pt] leading-relaxed">
                                                    {previewContent.split('\n').map((line, i) => (
                                                        <React.Fragment key={i}>
                                                            {line}
                                                            <br />
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </Letterhead>
                                        ) : (
                                            <div className="p-[20mm]">
                                                <div className="absolute top-0 right-0 p-4 opacity-50">
                                                    <span className="text-xs font-mono tracking-widest text-zinc-300">A4 PREVIEW</span>
                                                </div>
                                                <div className="prose max-w-none whitespace-pre-wrap font-serif text-[12pt] leading-relaxed">
                                                    {previewContent.split('\n').map((line, i) => (
                                                        <React.Fragment key={i}>
                                                            {line}
                                                            <br />
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Polish Modal */}
                    {isPolishModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                                        <Sparks className="w-5 h-5 text-purple-500" />
                                        Refine Draft with AI
                                    </h3>
                                    <button onClick={() => setIsPolishModalOpen(false)} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                                        <Xmark className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                                    Provide instructions on how you want to improve this document (e.g., "Make the tone more aggressive", "Add a clause about jurisdiction in Delhi").
                                </p>

                                <textarea
                                    value={polishInstruction}
                                    onChange={(e) => setPolishInstruction(e.target.value)}
                                    placeholder="Enter instructions..."
                                    className="w-full h-32 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-4 text-sm focus:ring-2 focus:ring-purple-500/20 outline-none mb-6 resize-none"
                                />

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsPolishModalOpen(false)}
                                        className="px-4 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePolish}
                                        disabled={isPolishing}
                                        className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isPolishing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparks className="w-4 h-4" />}
                                        {isPolishing ? 'Refining...' : 'Refine Draft'}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                </PageTransition>
            </DotBackground>
        </DashboardLayout>
    );
};

export default SmartDrafter;
