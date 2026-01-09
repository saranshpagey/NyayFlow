import React from 'react';
import { Check, Book, WarningTriangle, InfoCircle, Page } from 'iconoir-react';
import { cn } from '../../lib/utils';

interface Penalty {
    offense: string;
    penalty: string;
}

interface StructuredData {
    title?: string;
    legal_limit?: string;
    penalties?: Penalty[];
    relevant_laws?: string;
    additional_information?: string[];
    disclaimer?: string;
    [key: string]: any;
}

interface StructuredResponseViewProps {
    data: StructuredData;
}

export const StructuredResponseView: React.FC<StructuredResponseViewProps> = ({ data }) => {
    return (
        <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            {data.title && (
                <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                        <Book className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">{data.title}</h3>
                </div>
            )}

            <div className="p-6 space-y-6">
                {/* Legal Limit & Relevant Laws Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.legal_limit && (
                        <div className="space-y-2">
                            <span className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                <WarningTriangle className="w-3.5 h-3.5" />
                                Legal Limit
                            </span>
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {data.legal_limit}
                            </div>
                        </div>
                    )}

                    {data.relevant_laws && (
                        <div className="space-y-2">
                            <span className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                <Page className="w-3.5 h-3.5" />
                                Relevant Laws
                            </span>
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {data.relevant_laws}
                            </div>
                        </div>
                    )}
                </div>

                {/* Penalties Table */}
                {data.penalties && data.penalties.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            <Check className="w-3.5 h-3.5" />
                            Penalties & Fines
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500 font-medium">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Offense</th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Penalty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {data.penalties.map((item, idx) => (
                                        <tr key={idx} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-5 py-3 font-medium text-zinc-900 dark:text-white">{item.offense}</td>
                                            <td className="px-5 py-3 text-zinc-700 dark:text-zinc-300">{item.penalty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Additional Information */}
                {data.additional_information && data.additional_information.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            <InfoCircle className="w-3.5 h-3.5" />
                            Key Points
                        </div>
                        <ul className="space-y-2">
                            {data.additional_information.map((info, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-base text-zinc-700 dark:text-zinc-300">
                                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
                                    <span className="leading-relaxed">{info}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Disclaimer */}
                {data.disclaimer && (
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <p className="text-xs text-zinc-500 italic text-center">
                            {data.disclaimer}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
