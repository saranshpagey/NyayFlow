export interface ResearchResult {
    id: string;
    title: string;
    court: string;
    date: string;
    citation: string;
    snippet?: string;
    content?: string;
    status: 'good_law' | 'overruled' | 'distinguished' | 'caution_law' | 'draft';
    summary: string;
    thinking?: string;
    entities?: { text: string, label: string }[];
    widget?: {
        type: 'statute' | 'penalty' | 'procedure' | 'summary' | 'draft' | 'outcome' | 'checklist' | 'glossary' | 'caselaw' | 'agent_status' | 'timeline';
        data: any;
    };
}

export interface CaseFile {
    id: string;
    clientName: string;
    caseNumber: string;
    court: string;
    status: 'active' | 'pending' | 'closed';
    nextHearing: string;
    stage: string;
    vsty: string; // Versus / Respondent
    timeline: CaseEvent[];
}

export interface CaseEvent {
    id: string;
    date: string;
    title: string;
    description: string;
    type: 'hearing' | 'filing' | 'order' | 'meeting';
}

export interface DraftVariable {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'email' | 'tel' | 'textarea';
    required: boolean;
    placeholder?: string;
    defaultValue?: string;
    help_text?: string;
}

export interface DraftWidgetData {
    template: string;
    variables: DraftVariable[];
    documentType: string;
}

export interface Template {
    id: string;
    title: string;
    category: string;
    description: string;
    content: string; // The markdown/text content with {{placeholders}}
}

export interface Message {
    id: string;
    role: 'user' | 'ai' | 'assistant';
    content: string;
    thinking?: string;
    results?: ResearchResult[];
    widget?: { type: string; data: any };
    metadata?: {
        agents_used?: string[];
        orchestration_mode?: string;
        target_persona?: 'founder' | 'advocate';
        safety_level?: 'low' | 'medium' | 'high';
        [key: string]: any;
    };
}

export interface ResearchSession {
    id: string;
    title: string;
    messages: Message[];
    timestamp: number;
    folderId?: string;
    draftContext?: {
        content: string;
        title: string;
        template?: string;
        variables?: Record<string, string>;
        variableDefinitions?: DraftVariable[]; // NEW for persistence
        documentType?: string;
    };
}

export interface Folder {
    id: string;
    name: string;
    timestamp: number;
}
