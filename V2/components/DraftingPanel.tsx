import React, { useState, useEffect } from 'react';
import { Xmark, Download, EditPencil, Check, Sparks, NavArrowDown, Page, Printer } from 'iconoir-react';
import { jsPDF } from 'jspdf';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '../lib/api';
import { cn } from '../lib/utils';

import { VakalatnamaTemplate } from './templates/Vakalatnama';
import { legalTemplates, LegalTemplate, replacePlaceholders, getCategories } from '../lib/templates';
import { StampPaper } from './legal/StampPaper';
import { Letterhead } from './legal/Letterhead';

interface DraftingPanelProps {
    isOpen: boolean;
    onClose: () => void;
    initialContent: string;
    title?: string;
}

const DraftingPanel: React.FC<DraftingPanelProps> = ({ isOpen, onClose, initialContent, title = "Legal Draft" }) => {
    const [content, setContent] = useState(initialContent);
    const [isSaving, setIsSaving] = useState(false);
    const [isPolishing, setIsPolishing] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<LegalTemplate | null>(null);
    const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
    const [printMode, setPrintMode] = useState(false);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const menu = document.getElementById('template-menu');
            const button = document.getElementById('template-button');
            if (menu && button && !menu.contains(event.target as Node) && !button.contains(event.target as Node)) {
                setIsTemplateMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const isLegacyVakalatnama = title?.toUpperCase().includes('VAKALATNAMA') && !selectedTemplate;

    const handleTemplateSelect = (template: LegalTemplate) => {
        setSelectedTemplate(template);
        setContent(replacePlaceholders(template.content, {}));
        setIsTemplateMenuOpen(false);
        toast.success(`Loaded ${template.name}`);
    };

    const handleExport = async () => {
        setIsSaving(true);
        try {
            const doc = new jsPDF({
                unit: 'mm',
                format: 'a4',
            });

            if (isLegacyVakalatnama) {
                // For HTML Template, use html method (rudimentary support in jsPDF without html2canvas can be tricky, 
                // but direct html() is better if we have the node).
                const element = document.getElementById('legal-template');
                if (element) {
                    await doc.html(element as HTMLElement, {
                        callback: function (doc) {
                            doc.save(`${title.replace(/\s+/g, '_')} _Draft.pdf`);
                        },
                        x: 0,
                        y: 0,
                        width: 210, // A4 width in mm
                        windowWidth: 800 // Scale down from screen px to A4 mm
                    });
                }
            } else {
                // Text Fallback
                const pageWidth = 210;
                const margin = 20;
                const contentWidth = pageWidth - (2 * margin);

                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text(title.toUpperCase(), pageWidth / 2, margin, { align: 'center' });

                doc.setFontSize(12);
                doc.setFont('times', 'normal');
                const cleanContent = content.replace(/```[\s\S]*?\n/g, '').replace(/```/g, '');
                const splitText = doc.splitTextToSize(cleanContent, contentWidth);
                doc.text(splitText, margin, margin + 20);
                doc.save(`${title.replace(/\s+/g, '_')}_Draft.pdf`);
            }

        } catch (error) {
            console.error("Export failed", error);
            toast.error("Export failed. Please try again.");
        } finally {
            if (!isLegacyVakalatnama) {
                // HTML export callback handles save, so only finish here for text
                setTimeout(() => setIsSaving(false), 1000);
            } else {
                setTimeout(() => setIsSaving(false), 3000); // Give HTML export some time
            }
        }
    };

    const handlePolish = async () => {
        if (!content.trim()) {
            toast.error("Nothing to polish! Add some content first.");
            return;
        }

        setIsPolishing(true);
        const polishToast = toast.loading("✨ Polishing your draft with AI...");

        try {
            const instructions = "Make this draft more formal, legally sound, and professional. Improve clarity and structure while maintaining all key information.";
            const response = await api.polishDraft(content, instructions);

            setContent(response.refined_content);
            toast.success("✅ Draft polished successfully!", { id: polishToast });
        } catch (error) {
            console.error("Polish failed:", error);
            toast.error("Failed to polish draft. Please try again.", { id: polishToast });
        } finally {
            setIsPolishing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] lg:w-[600px] bg-zinc-100 dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">



            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <EditPencil className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-zinc-900 dark:text-white uppercase tracking-wider">{selectedTemplate ? selectedTemplate.name : title}</h2>
                        <div className="flex items-center gap-1">
                            <p className="text-xs text-zinc-500">Live Editor</p>
                            {selectedTemplate && (
                                <span className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 font-medium uppercase tracking-tight">
                                    {selectedTemplate.category.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Template Selector */}
                    <div className="relative">
                        <button
                            id="template-button"
                            onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-sm transition-colors text-zinc-700 dark:text-zinc-300"
                        >
                            <Page className="w-4 h-4" />
                            <span className="hidden sm:inline">Templates</span>
                            <NavArrowDown className={`w-3 h-3 transition-transform ${isTemplateMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isTemplateMenuOpen && (
                            <div
                                id="template-menu"
                                className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                            >
                                <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
                                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1">Select Template</p>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto py-1">
                                    {getCategories().map(category => {
                                        const templates = legalTemplates.filter(t => t.category === category.value);
                                        if (templates.length === 0) return null;

                                        return (
                                            <div key={category.value} className="mb-2 last:mb-0">
                                                <div className="px-3 py-1.5 bg-zinc-50/50 dark:bg-zinc-900/50 sticky top-0 backdrop-blur-sm">
                                                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{category.label}</span>
                                                </div>
                                                {templates.map(template => (
                                                    <button
                                                        key={template.id}
                                                        onClick={() => handleTemplateSelect(template)}
                                                        className={cn(
                                                            "w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors flex items-center gap-2 group",
                                                            selectedTemplate?.id === template.id ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "text-zinc-600 dark:text-zinc-400"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-1.5 h-1.5 rounded-full transition-colors",
                                                            selectedTemplate?.id === template.id ? "bg-blue-600" : "bg-zinc-300 group-hover:bg-blue-400"
                                                        )} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs truncate">{template.name}</p>
                                                            <p className="text-xs text-zinc-400 truncate mt-0.5">{template.jurisdiction?.replace('_', ' ').toUpperCase() || 'GENERAL'}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handlePolish}
                        disabled={isPolishing || !content.trim()}
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm font-medium"
                        title="Polish with AI"
                    >
                        {isPolishing ? (
                            <>
                                <Sparks className="w-4 h-4 animate-spin" />
                                <span className="hidden sm:inline">Polishing...</span>
                            </>
                        ) : (
                            <>
                                <Sparks className="w-4 h-4" />
                                <span className="hidden sm:inline">Polish</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleExport}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 transition-colors tooltip tooltip-bottom"
                        title="Export to PDF"
                    >
                        {isSaving ? <Check className="w-5 h-5 text-green-500" /> : <Download className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                    >
                        <Xmark className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* High Risk Banner */}
            {selectedTemplate?.riskLevel === 'high' && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-800/20 p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="p-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 shrink-0 mt-0.5">
                        <Sparks className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Lawyer Consultation Recommended</p>
                        <p className="text-xs text-amber-600 dark:text-amber-300 mt-0.5 leading-relaxed">
                            This document involves significant equity or liability. We strongly advise having a qualified lawyer review the final draft.
                        </p>
                    </div>
                </div>
            )}

            {/* Scrollable Document Area */}
            <div className="flex-1 overflow-y-auto p-8 bg-zinc-100/50 dark:bg-black/20">
                {/* A4 Paper Simulation */}
                {isLegacyVakalatnama ? (
                    <div id="legal-template" className="scale-90 origin-top bg-white shadow-lg mx-auto">
                        <VakalatnamaTemplate />
                    </div>
                ) : (
                    <div className="relative mx-auto bg-white text-black shadow-lg overflow-hidden transition-all duration-300" style={{ width: '100%', maxWidth: '210mm', minHeight: '297mm' }}>
                        {selectedTemplate?.category === 'contract' || selectedTemplate?.category === 'affidavit' ? (
                            <StampPaper hideGraphics={printMode}>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full h-full min-h-[800px] resize-none border-none outline-none focus:ring-0 bg-transparent font-serif text-[12pt] leading-relaxed whitespace-pre-wrap overflow-hidden p-0"
                                    spellCheck={false}
                                    placeholder="Start drafting..."
                                />
                            </StampPaper>
                        ) : selectedTemplate?.category === 'notice' ? (
                            <Letterhead>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full h-full min-h-[600px] resize-none border-none outline-none focus:ring-0 bg-transparent font-serif text-[12pt] leading-relaxed whitespace-pre-wrap overflow-hidden p-0"
                                    spellCheck={false}
                                    placeholder="Start drafting..."
                                />
                            </Letterhead>
                        ) : (
                            <div className="p-[20mm]">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full h-full min-h-[800px] resize-none border-none outline-none focus:ring-0 bg-transparent font-serif text-[12pt] leading-relaxed whitespace-pre-wrap overflow-hidden"
                                    spellCheck={false}
                                    placeholder="Start drafting..."
                                />
                            </div>
                        )}
                    </div>
                )}

                <p className="mt-4 text-center text-xs text-zinc-400 uppercase tracking-widest">End of Document</p>
            </div>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#18181b',
                        color: '#fff',
                        border: '1px solid #27272a',
                    },
                }}
            />
        </div>
    );
};

export default DraftingPanel;
