const API_BASE_URL = "http://localhost:8000";

export interface ResearchResult {
    id: string;
    title: string;
    court: string;
    date: string;
    citation: string;
    snippet: string;
    content: string;
    status: 'good_law' | 'overruled' | 'distinguished';
    summary: string;
    thinking?: string;
    entities?: { text: string, label: string }[];
    widget?: {
        type: 'statute' | 'penalty' | 'procedure' | 'summary';
        data: any;
    };
}

export const api = {
    research: {
        search: async (query: string, history?: { role: string, content: string }[]): Promise<ResearchResult[]> => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/research`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query, history }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                return data.results;
            } catch (error) {
                console.error("API Error:", error);
                // Fallback to empty list or throw to be handled by UI
                throw error;
            }
        }
    }
};
