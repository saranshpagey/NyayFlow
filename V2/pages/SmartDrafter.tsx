import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { MOCK_TEMPLATES, Template } from '../lib/mockTemplates';
import { PencilSquareIcon, DocumentTextIcon, ArrowLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { jsPDF } from 'jspdf';

const SmartDrafter = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [previewContent, setPreviewContent] = useState('');

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

    const extractFields = (template: Template) => {
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
        doc.text(selectedTemplate.title.toUpperCase(), 105, 20, { align: 'center' });

        // Add Content
        doc.setFontSize(12);
        doc.setFont('times', 'normal');

        // Split text to fit page width
        const splitText = doc.splitTextToSize(previewContent, 170); // 170mm width (A4 minus margins)
        doc.text(splitText, 20, 40);

        doc.save(`${selectedTemplate.title.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <DashboardLayout>
            <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-6 h-full flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <div className="flex items-center gap-3">
                        {selectedTemplate && (
                            <button onClick={() => setSelectedTemplate(null)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                                <ArrowLeftIcon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                                {selectedTemplate ? 'Drafting Mode' : 'Smart Drafter'}
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {selectedTemplate ? `Editing: ${selectedTemplate.title}` : 'Select a template to start drafting compliant legal documents.'}
                            </p>
                        </div>
                    </div>
                    {selectedTemplate && (
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            Export PDF
                        </button>
                    )}
                </div>

                {/* Template Selection Grid */}
                {!selectedTemplate && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_TEMPLATES.map(template => (
                            <div
                                key={template.id}
                                onClick={() => setSelectedTemplate(template)}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{template.title}</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2">{template.description}</p>
                                <span className="text-xs font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700">
                                    {template.category}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Editor Interface */}
                {selectedTemplate && (
                    <div className="flex-1 flex gap-6 min-h-0">
                        {/* Inputs Panel */}
                        <div className="w-1/3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 overflow-y-auto shadow-sm">
                            <h3 className="font-bold text-zinc-900 dark:text-white mb-4 uppercase text-xs tracking-wider">Document Details</h3>
                            <div className="space-y-4">
                                {extractFields(selectedTemplate).map(field => (
                                    <div key={field}>
                                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 capitalize">
                                            {field.replace(/_/g, ' ')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                                            className="w-full rounded-lg border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                                            onChange={(e) => handleInputChange(field, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 overflow-y-auto shadow-sm relative">
                            <div className="absolute top-0 right-0 p-2">
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Live Preview</span>
                            </div>
                            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap font-serif text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                {previewContent}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default SmartDrafter;
