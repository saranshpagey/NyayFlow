import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ExtractedFields {
    [key: string]: string | null;
}

export interface ExtractionResponse {
    success: boolean;
    extracted_fields: ExtractedFields;
    confidence: number;
    missing_fields: string[];
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

/**
 * Hook for extracting entities from conversation and auto-filling drafts
 */
export const useEntityExtraction = () => {
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractionError, setExtractionError] = useState<string | null>(null);

    /**
     * Extract entities from conversation and return pre-filled data
     */
    const extractEntities = async (
        conversationHistory: Message[],
        templateId: string = 'auto'
    ): Promise<ExtractionResponse | null> => {
        setIsExtracting(true);
        setExtractionError(null);

        try {
            const response = await fetch(`${API_BASE}/api/extract-entities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversation_history: conversationHistory,
                    template_id: templateId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Extraction failed');
            }

            const data = await response.json();

            if (data.success) {
                console.log('✅ Entity extraction successful', {
                    confidence: data.confidence,
                    fields: Object.keys(data.extracted_fields).length,
                });

                return data as ExtractionResponse;
            } else {
                throw new Error('Extraction failed');
            }
        } catch (err: any) {
            const errorMsg = err.message || 'Extraction failed';
            console.error('❌ Entity extraction error:', errorMsg);
            setExtractionError(errorMsg);
            return null;
        } finally {
            setIsExtracting(false);
        }
    };

    return {
        extractEntities,
        isExtracting,
        extractionError,
    };
};
