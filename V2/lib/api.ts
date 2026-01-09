/**
 * NyayaFlow API Client
 * 
 * Handles all communication with the backend Legal Agent System.
 * Supports both orchestrated (intelligent routing) and direct RAG modes.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

import { ResearchResult } from './types';

// ==================== Types ====================

export interface ApiMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ResearchResponse {
    success: boolean;
    results: ResearchResult[];
    metadata?: {
        intent?: {
            primary_intent: string;
            complexity: string;
            reasoning?: string;
        };
        agent_used: string;
        orchestrated: boolean;
        target_persona?: string;
        safety_level?: string;
        [key: string]: any;
    };
}



export interface DashboardStats {
    active_cases: number;
    pending_drafts: number;
    upcoming_hearings: number;
    efficiency_score: string;
    system_status: string;
}

// Minimal interface for Case (expand as needed based on backend)
export interface CaseData {
    id?: string;
    clientName: string;
    vsty: string;
    caseNumber: string;
    court: string;
    nextHearing?: string;
    stage?: string;
    status?: string;
    description?: string;
    [key: string]: any;
}

export interface DraftResponse {
    success: boolean;
    results: ResearchResult[];
}

export interface PolishResponse {
    success: boolean;
    refined_content: string;
}

// ==================== API Client ====================

class NyayaFlowAPI {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE) {
        this.baseUrl = baseUrl;
    }

    /**
     * Research endpoint - Main query interface
     */
    async research(
        query: string,
        sessionId: string = 'default',
        history: ApiMessage[] = [],
        useOrchestrator: boolean = true,
        options: { persona?: string, guestId?: string | null } = {}
    ): Promise<ResearchResponse> {
        try {
            // Create AbortController with 2-minute timeout for complex legal queries
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds

            const response = await fetch(`${this.baseUrl}/research`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    session_id: sessionId,
                    history,
                    use_orchestrator: useOrchestrator,
                    persona: options.persona || 'advocate',
                    guest_id: options.guestId
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Research request failed');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('Request timed out. The query may be too complex. Try breaking it into smaller parts.');
            }
            console.error('Research API error:', error);
            throw error;
        }
    }

    /**
     * Get intent and strategic plan for a query
     */
    async getIntent(
        query: string,
        history: ApiMessage[] = [],
        persona: string = 'advocate'
    ): Promise<{ success: boolean; intent: string; strategic_plan: string[] }> {
        try {
            const response = await fetch(`${this.baseUrl}/research/intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, history, persona })
            });

            if (!response.ok) return { success: false, intent: 'research', strategic_plan: [] };
            return await response.json();
        } catch (error) {
            console.error('Intent API error:', error);
            return { success: false, intent: 'research', strategic_plan: [] };
        }
    }

    /**
     * Generate legal drafts
     */
    async generateDraft(
        query: string,
        sessionId: string = 'default',
        history: ApiMessage[] = []
    ): Promise<DraftResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/draft/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    session_id: sessionId,
                    history
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Draft generation failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Draft generation error:', error);
            throw error;
        }
    }

    /**
     * Polish/refine existing drafts
     */
    async polishDraft(
        content: string,
        instructions: string
    ): Promise<PolishResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/draft/polish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    instructions
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Draft polishing failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Draft polishing error:', error);
            throw error;
        }
    }
    /**
     * Health check
     */
    async healthCheck(): Promise<{ status: string, orchestrator: boolean, rag_engine: boolean }> {
        try {
            const response = await fetch(`${this.baseUrl.replace(/\/api$/, '')}/health`);
            if (!response.ok) throw new Error('Health check failed');
            return await response.json();
        } catch (error) {
            console.error('Health check error:', error);
            throw error;
        }
    }





    // --- Dashboard ---

    async getDashboardStats(): Promise<DashboardStats> {
        try {
            const response = await fetch(`${this.baseUrl}/dashboard`);
            if (!response.ok) throw new Error('Failed to fetch dashboard stats');
            return await response.json();
        } catch (error) {
            console.error('Dashboard stats error:', error);
            // Fallback
            return {
                active_cases: 0,
                pending_drafts: 0,
                upcoming_hearings: 0,
                efficiency_score: '94%',
                system_status: 'offline'
            };
        }
    }

    // --- Case Management ---

    async getCases(): Promise<CaseData[]> {
        const response = await fetch(`${this.baseUrl}/cases`);
        if (!response.ok) throw new Error('Failed to fetch cases');
        return await response.json();
    }

    async createCase(data: CaseData): Promise<CaseData> {
        const response = await fetch(`${this.baseUrl}/cases`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create case');
        return await response.json();
    }

    async updateCase(id: string, data: Partial<CaseData>): Promise<CaseData> {
        const response = await fetch(`${this.baseUrl}/cases/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update case');
        return await response.json();
    }

    async deleteCase(id: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}/cases/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete case');
        return await response.json();
    }

    // --- Knowledge Base ---

    async quickIngest(url: string): Promise<{ success: boolean, message: string }> {
        const response = await fetch(`${this.baseUrl}/kb/ingest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        if (!response.ok) throw new Error('Failed to start ingestion');
        return await response.json();
    }

    async getKbStats(): Promise<{ total_docs: number, vectors_indexed: number, last_sync: string, system_health: string }> {
        const response = await fetch(`${this.baseUrl}/kb/stats`);
        if (!response.ok) throw new Error('Failed to fetch KB stats');
        return await response.json();
    }

    async getKbDocuments(): Promise<any[]> {
        const response = await fetch(`${this.baseUrl}/kb/documents`);
        if (!response.ok) throw new Error('Failed to fetch KB documents');
        return await response.json();
    }
}

// ==================== Singleton Export ====================

export const api = new NyayaFlowAPI();

// ==================== Convenience Functions ====================

/**
 * Quick research query
 */
export async function queryLegalAI(
    query: string,
    history: ApiMessage[] = [],
    options: { persona?: string, guestId?: string | null } = {}
): Promise<ResearchResult[]> {
    const response = await api.research(query, 'default', history, true, options);
    return response.results;
}

/**
 * Quick draft generation
 */
export async function generateLegalDraft(
    draftType: string,
    details: string,
    history: ApiMessage[] = []
): Promise<string> {
    const query = `Generate a ${draftType}: ${details}`;
    const response = await api.generateDraft(query, 'default', history);

    if (response.results && response.results.length > 0) {
        return response.results[0].summary;
    }

    throw new Error('No draft generated');
}

/**
 * Check if backend is ready
 */
export async function isBackendReady(): Promise<boolean> {
    try {
        const health = await api.healthCheck();
        return health.status === 'healthy';
    } catch {
        return false;
    }
}

export default api;
