import { ResearchResult } from "./types";
const API_BASE_URL = "http://localhost:8000";

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
    },
    drafter: {
        polish: async (content: string, instructions: string): Promise<string> => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/draft/polish`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, instructions }),
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                return data.refined_content;
            } catch (error) {
                console.error("Drafting API Error:", error);
                throw error;
            }
        }
    }
};
