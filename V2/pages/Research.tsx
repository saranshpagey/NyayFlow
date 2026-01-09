import React, { useState, useRef, useEffect } from 'react';
import { useLayout } from '../context/LayoutContext';
import { SystemRestart } from 'iconoir-react';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import DashboardLayout from '../components/DashboardLayout';
import PageTransition from '../components/PageTransition';
import DraftingPanel from '../components/DraftingPanel';
import { api } from '../lib/api';
import { ResearchResult, Message } from '../lib/types';
import {
    Send,
    Sparks,
    Check,
    Refresh,
    Page,
    Search,
    EditPencil,
    ArrowRight,
    Plus,
    Folder,
    FolderPlus,
    Trash,
    NavArrowUp,
    NavArrowDown
} from "iconoir-react";
import { Gavel, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// import { DotBackground } from '../components/ui/grid-background';
import { useAuth } from '../context/AuthContext';
import { useResearch } from '../context/ResearchContext';
import { useModal } from '../context/ModalContext';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

// Modular Widgets
import { TimelineWidget } from '../components/widgets/TimelineWidget';
import { StatuteWidget } from '../components/widgets/StatuteWidget';
import { PenaltyWidget } from '../components/widgets/PenaltyWidget';
import { ProcedureWidget } from '../components/widgets/ProcedureWidget';
import { OutcomeWidget } from '../components/widgets/OutcomeWidget';
import { LegalDraftWidget } from '../components/widgets/LegalDraftWidget';
import { SourceSummaryPill } from '../components/widgets/SourceSummaryPill';
import { SourceChip } from '../components/widgets/SourceChip';
import { StructuredResponseView } from '../components/widgets/StructuredResponseView';
import { ChecklistWidget } from '../components/widgets/ChecklistWidget';
import { GlossaryWidget } from '../components/widgets/GlossaryWidget';
import { AgentStatusWidget } from '../components/widgets/AgentStatusWidget';
import { DraftDetailsPanel } from '../components/DraftDetailsPanel';
import { SourceDetailsPanel } from '../components/SourceDetailsPanel';

// Sprint 2: Founder Mode Components
import { FounderQuestionLibrary } from '../components/FounderQuestionLibrary';
import { FounderResponseCard } from '../components/FounderResponseCard';
import { ExplainSimplyToggle } from '../components/ExplainSimplyToggle';
import { DraftPreviewPanel } from '../components/DraftPreviewPanel';
import { DraftChatPanel } from '../components/DraftChatPanel';
import { DraftVariable, DraftWidgetData } from '../lib/types';
import { DeepDiveModal } from '../components/modals/DeepDiveModal';
import { ThinkingStep } from '../components/ThinkingStep';
import { ResearchHome } from '../components/research/ResearchHome';

// Utility function for time formatting
const formatTimeAgo = (timestamp: string | number | Date): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} weeks ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(days / 365);
    return `${years} years ago`;
};

// Mock thinking time generator
const getThinkingTime = (content: string) => {
    return Math.max(1, Math.floor(content.length / 500) + Math.floor(Math.random() * 3));
};

const ThinkingProcess = ({ msg, onSourceClick }: { msg: any, onSourceClick: (source: any) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const duration = React.useMemo(() => getThinkingTime(msg.content), [msg.content]);

    const validSources = React.useMemo(() => (msg.results || []).filter((r: any) =>
        r.type !== 'agent_status' &&
        r.id !== 'orchestrator' &&
        r.id !== 'agent_status_info' &&
        r.id !== 'agent_status_draft' &&
        r.id !== 'agent_status_analyze' &&
        r.id !== 'agent_status_statute' &&
        r.id !== 'agent_status_procedure' &&
        r.id !== 'agent_status_glossary' &&
        r.id !== 'agent_status_caselaw' &&
        r.id !== 'agent_status_founder' &&
        !(r.widget && r.widget.type === 'agent_status')
    ), [msg.results]);

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors group"
            >
                <div className="text-xs">
                    Thought for {duration} seconds
                </div>
                {isOpen ? <NavArrowUp className="w-3.5 h-3.5" /> : <NavArrowDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pl-2 border-l-2 border-zinc-100 dark:border-zinc-800 mt-2 space-y-3 pb-2">
                            {/* Thinking Steps */}
                            <div className="space-y-1">
                                {msg.thinking && (
                                    <ThinkingStep
                                        title="Analyzed Request"
                                        status="done"
                                        type="reasoning"
                                        details={typeof msg.thinking === 'object' ? JSON.stringify(msg.thinking, null, 2) : msg.thinking}
                                    />
                                )}
                                {validSources.length > 0 && (
                                    <div className="space-y-3">
                                        <ThinkingStep
                                            title={`Found ${validSources.length} relevant sources`}
                                            status="done"
                                            type="search"
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                                            {validSources.map((result: any, idx: number) => (
                                                <SourceChip
                                                    key={result.id}
                                                    item={result}
                                                    index={idx}
                                                    onClick={() => onSourceClick({ sources: validSources, activeId: result.id })}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SafetyBadge = ({ level, persona, metadata }: { level?: string, persona?: string, metadata?: any }) => {
    if (!level || level === 'low' || persona === 'advocate') return null;

    const config = {
        medium: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-200 dark:border-yellow-800',
            text: 'text-yellow-700 dark:text-yellow-400',
            icon: '⚠️',
            label: 'Proceed with Caution'
        },
        high: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800',
            text: 'text-red-700 dark:text-red-400',
            icon: '🛑',
            label: 'Consult a Lawyer'
        }
    };

    const style = config[level as keyof typeof config] || config.medium;
    const confidenceScore = metadata?.confidence_score || 0.8;
    const incompleteReasons = metadata?.incomplete_reasons || [];
    const jurisdictionWarning = metadata?.jurisdiction_warning;
    const lawyerQuestions = metadata?.lawyer_questions || [];

    return (
        <div className={`mt-3 mb-2 rounded-xl border ${style.bg} ${style.border} overflow-hidden`}>
            {/* Main Warning */}
            <div className="flex items-start gap-3 p-3">
                <span className="text-lg mt-0.5 select-none">{style.icon}</span>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>
                            {style.label}
                        </span>
                        <span className={`text-xs ${style.text} opacity-70`}>
                            Confidence: {Math.round(confidenceScore * 100)}%
                        </span>
                    </div>
                    <p className={`text-xs ${style.text} mt-1 leading-relaxed opacity-90`}>
                        {level === 'high'
                            ? "This topic involves significant legal risk or criminal liability. Please consult a qualified advocate."
                            : "This is general guidance. Specific compliance rules may vary by state and sector."}
                    </p>
                </div>
            </div>

            {/* Jurisdiction Warning */}
            {jurisdictionWarning && (
                <div className={`px-3 py-2 border-t ${style.border} bg-opacity-50`}>
                    <p className={`text-xs ${style.text} flex items-start gap-2`}>
                        <span>📍</span>
                        <span>{jurisdictionWarning}</span>
                    </p>
                </div>
            )}

            {/* Incomplete Answer Reasons */}
            {incompleteReasons.length > 0 && (
                <div className={`px-3 py-2 border-t ${style.border}`}>
                    <p className={`text-xs font-semibold ${style.text} mb-1`}>⚠️ Why this answer may be incomplete:</p>
                    <ul className={`text-xs ${style.text} opacity-90 space-y-1 ml-4`}>
                        {incompleteReasons.map((reason: string, idx: number) => (
                            <li key={idx} className="list-disc">{reason}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Lawyer Questions */}
            {lawyerQuestions.length > 0 && (
                <div className={`px-3 py-2 border-t ${style.border} bg-white/50 dark:bg-black/20`}>
                    <p className={`text-xs font-semibold ${style.text} mb-1.5`}>💬 Questions to ask your lawyer:</p>
                    <ul className={`text-xs ${style.text} opacity-90 space-y-1 ml-4`}>
                        {lawyerQuestions.map((question: string, idx: number) => (
                            <li key={idx} className="list-decimal">{question}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const Research = () => {
    const {
        activeSession,
        activeSessionId,
        activeFolderId,
        folders,
        sessions,
        addMessage,
        loadingSessionId,
        setLoadingSessionId,
        showDraftPanel,
        setShowDraftPanel,
        createNewSession,
        loadSession,
        loadFolder,
        moveSessionToFolder,
        deleteSession,
        updateSessionDraft
    } = useResearch();
    const { showConfirm, showFolderSelect } = useModal();
    const { user, persona, setPersona, guestId, queryCount, incrementQueryCount, resetGuestData } = useAuth();
    const { sidebarWidth } = useLayout();

    const isLoading = !!loadingSessionId && loadingSessionId === activeSessionId;

    // State declarations - must be before early return
    const [input, setInput] = useState('');
    const [selectedResult, setSelectedResult] = useState<ResearchResult | null>(null);
    const [showSources, setShowSources] = useState(false);
    const [lastQuery, setLastQuery] = useState('');
    const [searchStatusIndex, setSearchStatusIndex] = useState(0);
    const [dynamicPlan, setDynamicPlan] = useState<string[]>([]);
    const [simplifyMode, setSimplifyMode] = useState(false);
    const [sourcePanelData, setSourcePanelData] = useState<{ sources: any[], activeId: string } | null>(null);
    const [showExportBrief, setShowExportBrief] = useState(false);
    const [exportBriefData, setExportBriefData] = useState<any>(null);
    const processedInitialSessionsRef = useRef<Set<string>>(new Set());

    const getDynamicStatuses = (query: string) => {
        if (dynamicPlan.length > 0) return dynamicPlan;

        const q = query.toLowerCase();

        if (q.includes('draft') || q.includes('prepare') || q.includes('write')) {
            return [
                "Understanding what this document needs...",
                "Finding the right legal template for you...",
                "Drafting with professional legal language...",
                "Reviewing for clarity and accuracy..."
            ];
        }

        if (q.includes('punishment') || q.includes('penalty') || q.includes('section') || q.includes('article') || q.includes('law')) {
            return [
                "Finding the relevant sections in the law...",
                "Decoding the legal language for you...",
                "Checking for any recent changes or updates...",
                "Working out what this means in simple terms..."
            ];
        }

        if (q.includes('case') || q.includes('judgment') || q.includes('precedent') || q.includes('versus') || q.includes('vs')) {
            return [
                "Looking through past court judgments...",
                "Finding similar cases to support this...",
                "Summarizing what the court decided...",
                "Connecting the dots for your query..."
            ];
        }

        if (q.includes('procedure') || q.includes('steps') || q.includes('how to')) {
            return [
                "Figuring out the exact steps for you...",
                "Double-checking the required documents...",
                "Working out how long this usually takes...",
                "Putting your step-by-step guide together..."
            ];
        }

        // Default "Deep Research" steps
        return [
            "Looking through our legal records...",
            "Finding the most relevant information...",
            "Making sure everything is accurate...",
            "Writing down your final answer now..."
        ];
    };

    const searchStatuses = getDynamicStatuses(lastQuery);

    useEffect(() => {
        let interval: any;
        if (isLoading) {
            setSearchStatusIndex(0);
            interval = setInterval(() => {
                setSearchStatusIndex(prev => (prev < searchStatuses.length - 1 ? prev + 1 : prev));
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    // Reset panel state on session change
    // Reset panel state on session change
    useEffect(() => {
        setSourcePanelData(null);
        setShowDraftPanel(false);
        // Force closed on any ID change
    }, [activeSessionId, setShowDraftPanel]);

    // Draft state
    const [isDrafting, setIsDrafting] = useState(false);
    const [draftVariables, setDraftVariables] = useState<DraftVariable[]>([]);
    const [draftValues, setDraftValues] = useState<Record<string, string>>({});
    const [draftTemplate, setDraftTemplate] = useState('');
    const [draftDocType, setDraftDocType] = useState('');
    const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const messages = activeSession?.messages || [];
    const draftContent = activeSession?.draftContext?.content || '';
    const draftTitle = activeSession?.draftContext?.title || 'Draft Document';

    // Removed auto-opening of 3-Split Studio
    // Users now manually trigger it via the LegalDraftWidget "3-Split Studio" button

    const handleVariableChange = (name: string, value: string) => {
        const newValues = { ...draftValues, [name]: value };
        setDraftValues(newValues);
        if (activeSessionId) {
            // Update persistence
            updateSessionDraft(activeSessionId, { variables: newValues });
        }
    };

    const handleGenerateDraft = async () => {
        if (!activeSessionId) return;
        setIsGeneratingDraft(true);

        try {
            const prompt = `Please finalize and polish this ${draftDocType}. Render the final document using the filled details: ${JSON.stringify(draftValues)}. Ensure the tone is professional and correct any obvious inconsistencies.`;

            const response = await api.research(
                prompt,
                activeSessionId,
                messages.slice(-3).map(m => ({
                    role: (m.role === 'ai' ? 'assistant' : 'user') as 'user' | 'assistant',
                    content: m.content
                })),
                true
            );

            if (response.results?.[0]?.widget?.type === 'draft') {
                const draftData = response.results[0].widget.data as DraftWidgetData;
                setDraftTemplate(draftData.template);
                toast.success("Draft updated with refinements!");
            } else {
                toast.success("Draft details saved!");
            }
        } catch (error) {
            console.error("Research failed", error);
            toast.error("Failed to fetch research results.");
        } finally {
            setIsGeneratingDraft(false);
        }
    };

    // Derived state for foldr view
    const activeFolder = folders.find(f => f.id === activeFolderId);
    const folderSessions = sessions.filter(s => s.folderId === activeFolderId);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        // Restore focus to input after AI finishes thinking
        if (!isLoading && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [messages, isLoading]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    // Auto-trigger API call for sessions created with initial message (from founder questions)
    useEffect(() => {
        if (!activeSessionId || !activeSession) return;

        // Don't process the same session twice
        if (processedInitialSessionsRef.current.has(activeSessionId)) return;

        const msgs = activeSession.messages;
        // Check if this is a new session with exactly 1 user message and no AI response
        if (msgs.length === 1 && msgs[0].role === 'user' && !loadingSessionId) {
            const initialMessage = msgs[0].content;
            processedInitialSessionsRef.current.add(activeSessionId);
            // Trigger the API call without adding the message again
            handleSend(initialMessage, true);
        }
    }, [activeSessionId, activeSession]); // Added activeSession to dependencies to avoid race conditions

    const handleSend = async (e: React.FormEvent | string, skipAddMessage: boolean = false) => {
        if (typeof e !== 'string') e.preventDefault();

        const queryText = typeof e === 'string' ? e : input;
        if (!queryText.trim() || isLoading) return;

        // Guest Gating Check - Show in-chat message instead of silent block
        if (!user && queryCount >= 3) {
            // Add user's attempted message
            const userMsg: Message = { id: Date.now().toString(), role: 'user', content: queryText };
            addMessage(userMsg, activeSessionId || createNewSession());

            // Add system message with signup prompt
            const systemMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: `### 🔒 Guest Limit Reached\n\nYou've used all **3 free queries** as a guest. To continue researching and unlock unlimited access:\n\n**Sign up for free** to get:\n- ✅ Unlimited AI-powered legal research\n- ✅ Advanced drafting tools\n- ✅ Case management features\n- ✅ Save your research history\n\n[Create Free Account](/auth) • Already have an account? [Sign In](/auth)\n\n---\n\n*Your current session will be preserved after signup.*`
            };
            addMessage(systemMsg, activeSessionId);

            setInput(''); // Clear input
            return;
        }

        // Capture the session ID at the start to prevent race conditions
        let targetSessionId = activeSessionId;

        // If no active session, create one first
        if (!targetSessionId) {
            targetSessionId = createNewSession();
        }

        if (!skipAddMessage) {
            // Robust check: don't add if this same message was just added (e.g. by createNewSession)
            const lastMsg = activeSession?.messages[activeSession.messages.length - 1];
            if (!(lastMsg?.role === 'user' && lastMsg.content === queryText)) {
                const userMsg: Message = { id: Date.now().toString(), role: 'user', content: queryText };
                addMessage(userMsg, targetSessionId);
            }
        }
        setLastQuery(queryText);
        setInput('');
        setLoadingSessionId(targetSessionId);
        setDynamicPlan([]); // Reset old plan

        let messageSent = false;

        try {
            const history = messages.slice(-5).map(m => ({
                role: (m.role === 'ai' ? 'assistant' : 'user') as 'user' | 'assistant',
                content: m.content
            }));

            // Step 1: Fast Intent/Plan fetch for the loader
            api.getIntent(queryText, history, persona).then(res => {
                if (res.success && res.strategic_plan.length > 0) {
                    setDynamicPlan(res.strategic_plan);
                }
            });

            // Step 2: Full Research Call
            const response = await api.research(
                queryText,
                targetSessionId,
                history,
                true, // use orchestrator
                { persona, guestId }
            );

            const data = response.results;
            const primaryResult = data[0];

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: primaryResult?.summary || "I found some relevant authorities:",
                thinking: primaryResult?.thinking,
                widget: primaryResult?.widget,
                results: data,
                metadata: response.metadata // Pass safety metadata
            };
            addMessage(aiMsg, targetSessionId);
            messageSent = true;

            // Increment query count if success
            if (response.success && !user) {
                incrementQueryCount();
            }

            // Log for debugging
            if (response.metadata) {
                console.log('🤖 Agent Used:', response.metadata.agent_used);
                console.log('🎯 Intent:', response.metadata.intent);
            }

            // Handle Structured Draft Response
            if (primaryResult?.widget?.type === 'draft') {
                const draftData = primaryResult.widget.data as DraftWidgetData;

                // Persist to session for later use (when user clicks "Open in Studio")
                if (targetSessionId) {
                    updateSessionDraft(targetSessionId, {
                        template: draftData.template,
                        title: draftData.documentType || 'Draft Document',
                        variableDefinitions: draftData.variables,
                        variables: {},
                        documentType: draftData.documentType
                    });
                }
                return; // Stop further processing
            }

            // Drafting views are now exclusively user-triggered via LegalDraftWidget buttons
        } catch (err) {
            console.error("Research Error Details:", err);
            if (!messageSent) {
                const errorMsg = err instanceof Error ? err.message : "Unknown error";
                addMessage({
                    id: (Date.now() + 1).toString(),
                    role: 'ai',
                    content: `I'm having trouble connecting to my legal brain. Error: ${errorMsg}. Is the backend server running? 🧠❌`
                }, targetSessionId);
            } else {
                console.error("Post-response processing failed:", err);
            }
        } finally {
            setLoadingSessionId(null);
        }
    };

    const renderDraftContent = (data: DraftWidgetData) => {
        let content = data.template || (data as any).content || (data as any).text || (data as any).payload || '';
        if (data.variables && Array.isArray(data.variables)) {
            data.variables.forEach((variable) => {
                const regex = new RegExp(`{{${variable.name}}}`, 'g');
                content = content.replace(regex, `[${variable.label || variable.name}]`);
            });
        }
        return content;
    };

    const handleDownloadPDF = (data: DraftWidgetData) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text((data.documentType || 'Legal Draft').toUpperCase(), 105, 20, { align: 'center' });

        doc.setFontSize(11);
        doc.setFont('times', 'normal');
        const content = renderDraftContent(data);
        const splitText = doc.splitTextToSize(content, 170);
        doc.text(splitText, 20, 40);
        doc.save(`${(data.documentType || 'Draft').replace(/\s+/g, '_')}.pdf`);
        toast.success("PDF Downloaded!");
    };

    const renderWidget = (widget: { type: string; data: any }) => {
        switch (widget.type) {
            case 'statute': return <StatuteWidget data={widget.data} />;
            case 'penalty': return <PenaltyWidget data={widget.data} />;
            case 'procedure': return <ProcedureWidget data={widget.data} />;
            case 'outcome': return <OutcomeWidget data={widget.data} />;
            case 'checklist': return <ChecklistWidget data={widget.data} />;
            case 'glossary': return <GlossaryWidget data={widget.data} />;
            case 'agent_status': return <AgentStatusWidget data={widget.data} />;
            case 'timeline': return <TimelineWidget data={widget.data} />;
            case 'draft': return (
                <LegalDraftWidget
                    data={widget.data}
                    onOpenInStudio={() => {
                        const draftData = widget.data as DraftWidgetData;
                        const rawTemplate = draftData.template || (draftData as any).content || (draftData as any).text || (draftData as any).payload || '';
                        setDraftTemplate(rawTemplate);
                        setDraftVariables(draftData.variables);
                        setDraftDocType(draftData.documentType);

                        // Magic Auto-fill from Context
                        const initialValues: Record<string, string> = {};
                        if (draftData.variables) {
                            draftData.variables.forEach(v => {
                                if (v.defaultValue) initialValues[v.name] = v.defaultValue;
                            });
                        }
                        setDraftValues(initialValues);
                        setIsDrafting(true);
                    }}
                    onOpenInSidebar={() => {
                        const content = renderDraftContent(widget.data);
                        // We use a temporary session state or update active session
                        if (activeSessionId) {
                            updateSessionDraft(activeSessionId, {
                                content: content,
                                title: widget.data.documentType || 'Draft Document'
                            });
                        }
                        setShowDraftPanel(true);
                    }}
                    onDownload={() => handleDownloadPDF(widget.data)}
                />
            );
            default: return null;
        }
    };


    const handleMoveActiveSession = async () => {
        if (!activeSessionId) return;
        const folderId = await showFolderSelect({
            folders,
            currentFolderId: activeSession?.folderId,
            title: 'Move to Folder'
        });
        if (folderId !== null) moveSessionToFolder(activeSessionId, folderId);
    };

    // Requirement: When I've started with query the Header should contextualise what the chat is about
    const sessionFolder = folders.find(f => f.id === activeSession?.folderId);

    const headerTitle = activeSession ? (
        <div className="flex items-center gap-2 overflow-hidden">
            {sessionFolder && (
                <>
                    <div
                        onClick={() => loadFolder(sessionFolder.id)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors shrink-0"
                    >
                        <Folder className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-xs font-medium text-zinc-500">{sessionFolder.name}</span>
                    </div>
                    <span className="text-zinc-300 dark:text-zinc-700">/</span>
                </>
            )}
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] shrink-0"></div>
                <span className="text-sm font-medium text-zinc-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                    {activeSession.messages.length === 0 ? 'New Research' : activeSession.title}
                </span>
            </div>
        </div>
    ) : (
        <div className="flex items-center gap-3">
            <Sparks className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-zinc-900 dark:text-white">Research AI</span>
        </div>
    );

    const headerRight = (
        <div className="flex items-center gap-3">
            {/* Guest Progress */}
            {/* Guest Progress */}
            {!user && (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Guest: {queryCount}/3 Queries</span>
                    </div>
                    {/* Developer Reset Button */}
                    <button
                        onClick={() => {
                            resetGuestData();
                            toast.success('Guest count reset to 0!', { duration: 2000 });
                        }}
                        className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-blue-500 transition-colors"
                        title="Reset guest count (Dev Tool)"
                    >
                        <Refresh className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Persona Toggle - Force Render */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <button
                    onClick={() => {
                        console.log('🔘 Switching to Lawyer Persona');
                        setPersona('advocate');
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${(!persona || persona === 'advocate') ? 'bg-white dark:bg-zinc-700 text-blue-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                    <Gavel className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Lawyer</span>
                </button>
                <button
                    onClick={() => {
                        console.log('🔘 Switching to Founder Persona');
                        setPersona('founder');
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${persona === 'founder' ? 'bg-white dark:bg-zinc-700 text-orange-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                >
                    <Target className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Founder</span>
                </button>
            </div>


            {/* Founder Mode: Simple Toggle */}
            {
                persona === 'founder' && (
                    <>
                        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
                        <ExplainSimplyToggle
                            simplified={simplifyMode}
                            onToggle={() => setSimplifyMode(!simplifyMode)}
                        />
                    </>
                )
            }

            <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

            {
                activeSessionId && activeSession?.messages.length > 0 && (
                    <>
                        <button
                            onClick={handleMoveActiveSession}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-orange-500 transition-colors"
                            title="Move to Folder"
                            aria-label="Move chat to folder"
                        >
                            <FolderPlus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={async () => {
                                if (!activeSessionId) return;
                                const confirmed = await showConfirm({
                                    title: 'Delete this chat?',
                                    description: 'All messages and context will be permanently removed from your research library.',
                                    confirmText: 'Delete',
                                    cancelText: 'Cancel',
                                    variant: 'danger'
                                });
                                if (confirmed) deleteSession(activeSessionId);
                            }}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                            title="Delete Chat"
                            aria-label="Delete this chat"
                        >
                            <Trash className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
                    </>
                )
            }
            <button
                onClick={() => {
                    setSourcePanelData(null); // Explicitly close sidebar first
                    createNewSession();
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-medium hover:opacity-90 transition-all shadow-sm"
                aria-label="Start new chat"
            >
                <Plus className="w-3.5 h-3.5" />
                New Chat
            </button>
        </div >
    );

    // Early return for no active session - use ResearchHome component
    if (!activeSessionId) {
        return (
            <DashboardLayout>
                <PageTransition>
                    <ResearchHome />
                </PageTransition>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout headerTitle={headerTitle} headerRight={headerRight}>
            <div className="h-screen w-full bg-white dark:bg-zinc-950 flex flex-col items-start justify-start overflow-hidden">
                <PageTransition className="flex h-full w-full bg-transparent overflow-hidden relative z-10">

                    {isDrafting ? (
                        <div className="flex w-full h-full divide-x divide-zinc-200 dark:divide-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                            <div className="w-[30%] min-w-[320px] h-full overflow-hidden">
                                <DraftDetailsPanel
                                    variables={draftVariables}
                                    values={draftValues}
                                    onChange={handleVariableChange}
                                    onGenerate={handleGenerateDraft}
                                    documentType={draftDocType}
                                    isGenerating={isGeneratingDraft}
                                />
                            </div>
                            <div className="w-[30%] min-w-[320px] h-full overflow-hidden bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
                                <DraftChatPanel
                                    messages={messages}
                                    isLoading={isLoading}
                                    onSend={(msg) => handleSend(msg)}
                                />
                            </div>
                            <div className="flex-1 h-full overflow-hidden bg-zinc-100 dark:bg-black/20">
                                <DraftPreviewPanel
                                    template={draftTemplate}
                                    variables={draftValues}
                                    title={draftDocType}
                                    onClose={() => setIsDrafting(false)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={`flex flex-col h-full transition-all duration-300 ease-in-out ${(showDraftPanel || (sourcePanelData && sourcePanelData.sources.length > 0)) ? 'w-full lg:w-[calc(100%-600px)]' : 'w-full'}`}>
                            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-12">
                                <div className="max-w-4xl mx-auto w-full space-y-12 pt-8">

                                    {activeFolderId && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-20">
                                            <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-4 rounded-2xl bg-orange-100 dark:bg-orange-900/20 text-orange-600">
                                                            <Folder className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <h1 className="text-3xl font-display font-medium text-zinc-900 dark:text-white">{activeFolder?.name}</h1>
                                                            <p className="text-sm text-zinc-500">{folderSessions.length} Research Sessions grouped here</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => loadFolder('')}
                                                        className="px-4 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-widest"
                                                    >
                                                        Back to Library
                                                    </button>
                                                </div>
                                                <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full mb-8" />

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {folderSessions.map(session => (
                                                        <div
                                                            key={session.id}
                                                            onClick={() => loadSession(session.id)}
                                                            className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer group relative"
                                                        >
                                                            <div className="flex justify-between items-start mb-3">
                                                                <h3 className="font-medium text-base text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1 pr-6">{session.title}</h3>
                                                                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                                            </div>
                                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                                                                {session.messages[0]?.content || 'Empty research session...'}
                                                            </p>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200/50 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400 text-xs font-medium uppercase tracking-wide">
                                                                    <Sparks className="w-3 h-3 text-blue-500" />
                                                                    {session.messages.length} Messages
                                                                </div>
                                                                <span className="text-xs text-zinc-500">Updated {formatTimeAgo(session.timestamp)}</span>
                                                            </div>

                                                            {/* Quick Delete in Grid */}
                                                            <button
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    const confirmed = await showConfirm({
                                                                        title: 'Delete this session?',
                                                                        description: 'This research session will be permanently removed.',
                                                                        confirmText: 'Delete',
                                                                        variant: 'danger'
                                                                    });
                                                                    if (confirmed) deleteSession(session.id);
                                                                }}
                                                                className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-zinc-400 hover:text-red-500 transition-all"
                                                            >
                                                                <Trash className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => createNewSession()}
                                                        className="p-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-4 text-zinc-400 hover:border-blue-500 hover:text-blue-500 transition-all group min-h-[160px]"
                                                    >
                                                        <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 transition-colors">
                                                            <Plus className="w-6 h-6" />
                                                        </div>
                                                        <span className="text-xs font-medium uppercase tracking-widest">New Research</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {messages.length === 0 && !activeFolderId && (
                                        persona === 'founder' ? (
                                            <FounderQuestionLibrary
                                                onSelectQuestion={(q) => handleSend(q)}
                                            />
                                        ) : (
                                            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                                                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 animate-in zoom-in-50 duration-500">
                                                    <Sparks className="w-8 h-8 text-white" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h2 className="text-3xl font-display font-medium text-zinc-900 dark:text-white">Start your Research</h2>
                                                    <p className="text-zinc-500 max-w-sm mx-auto">Ask about specialized statutes, latest case laws, or procedural steps for any legal matter.</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 max-w-md w-full">
                                                    {["Punishment for Cheque Bounce", "Bail provisions under BNSS", "Draft a Rent Agreement", "Procedure for Divorce"].map(t => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setInput(t)}
                                                            className="p-3 text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500 transition-all text-left"
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    )}

                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`w-full max-w-2xl space-y-6 ${msg.role === 'user' ? 'order-1' : ''}`}>
                                                {msg.role === 'user' && (
                                                    <div className="ml-auto w-fit bg-white dark:bg-zinc-900 px-6 py-4 rounded-2xl rounded-tr-sm text-base text-zinc-900 dark:text-white shadow-sm border border-zinc-100 dark:border-zinc-800">
                                                        {msg.content}
                                                    </div>
                                                )}
                                                {(msg.role === 'ai' || msg.role === 'assistant') && (
                                                    <div className="space-y-4 animate-in slide-in-from-left-4 duration-500">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-start gap-3">
                                                                <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/20 mt-1">
                                                                    <Sparks className="w-4 h-4" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <ThinkingProcess msg={msg} onSourceClick={setSourcePanelData} />

                                                                    {/* Sprint 4: Founder Safety Disclaimer */}
                                                                    {msg.metadata?.safety_level && (
                                                                        <SafetyBadge
                                                                            level={msg.metadata.safety_level}
                                                                            persona={msg.metadata.target_persona}
                                                                        />
                                                                    )}

                                                                    <div className="text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
                                                                        {(() => {
                                                                            let content = msg.content;
                                                                            let structuredData: any = null;

                                                                            // Try parsing if string looks like JSON
                                                                            if (typeof content === 'string' && content.trim().startsWith('{')) {
                                                                                try {
                                                                                    structuredData = JSON.parse(content);
                                                                                } catch (e) {
                                                                                    // Not valid JSON
                                                                                }
                                                                            } else if (typeof content === 'object' && content !== null) {
                                                                                structuredData = content;
                                                                            }

                                                                            // Check for Founder Mode JSON signature
                                                                            if (structuredData && structuredData.riskLevel && structuredData.summary) {
                                                                                return <FounderResponseCard response={structuredData} simplified={simplifyMode} />;
                                                                            }

                                                                            // Check for legacy structured legal response signature
                                                                            if (structuredData && (structuredData.title || structuredData.legal_limit) && (structuredData.penalties || structuredData.relevant_laws)) {
                                                                                return <StructuredResponseView data={structuredData} />;
                                                                            }

                                                                            return (
                                                                                <ReactMarkdown
                                                                                    remarkPlugins={[remarkGfm]}
                                                                                    components={{
                                                                                        p: ({ node, ...props }) => <p className="mb-4 text-base leading-7 text-zinc-900 dark:text-zinc-100 last:mb-0" {...props} />,
                                                                                        h1: ({ node, ...props }) => <h1 className="text-3xl font-display font-semibold text-zinc-900 dark:text-white mt-8 mb-4 tracking-tight" {...props} />,
                                                                                        h2: ({ node, ...props }) => <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-white mt-6 mb-3 tracking-tight" {...props} />,
                                                                                        h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mt-5 mb-2" {...props} />,
                                                                                        strong: ({ node, ...props }) => <span className="font-medium text-zinc-950 dark:text-white" {...props} />,
                                                                                        ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-5 space-y-2 my-4 text-zinc-900 dark:text-zinc-100 marker:text-zinc-500" {...props} />,
                                                                                        ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-5 space-y-2 my-4 text-zinc-900 dark:text-zinc-100 marker:text-zinc-500" {...props} />,
                                                                                        li: ({ node, ...props }) => <li className="pl-1 leading-7" {...props} />,
                                                                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-r-lg text-zinc-600 dark:text-zinc-400 italic" {...props} />,
                                                                                        code: ({ node, inline, ...props }: any) => {
                                                                                            if (inline) {
                                                                                                return <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-600 dark:text-indigo-400" {...props} />;
                                                                                            }
                                                                                            return <code className="block w-full" {...props} />;
                                                                                        },
                                                                                        pre: ({ node, ...props }) => <pre className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl overflow-x-auto my-6 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 font-serif whitespace-pre-wrap shadow-inner" {...props} />,
                                                                                        table: ({ node, ...props }) => <div className="overflow-x-auto my-6 rounded-lg border border-zinc-200 dark:border-zinc-700"><table className="w-full text-base text-left" {...props} /></div>,
                                                                                        th: ({ node, ...props }) => <th className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 font-medium text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-700" {...props} />,
                                                                                        td: ({ node, ...props }) => <td className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300" {...props} />,
                                                                                        a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                                                    }}>
                                                                                    {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
                                                                                </ReactMarkdown>
                                                                            );
                                                                        })()}
                                                                    </div>

                                                                    {/* Render all widgets found in results, or the primary widget if results are empty */}
                                                                    {(() => {
                                                                        const widgetsToRender: { type: string; data: any; id: string }[] = [];

                                                                        if (msg.results && msg.results.length > 0) {
                                                                            msg.results.forEach((res, idx) => {
                                                                                if (res.widget) {
                                                                                    widgetsToRender.push({
                                                                                        ...res.widget as any,
                                                                                        id: res.id || `widget-${idx}`
                                                                                    });
                                                                                }
                                                                            });
                                                                        } else if (msg.widget) {
                                                                            widgetsToRender.push({
                                                                                ...msg.widget as any,
                                                                                id: 'primary-widget'
                                                                            });
                                                                        }

                                                                        return widgetsToRender
                                                                            .filter(w => {
                                                                                if (w.type === 'agent_status') {
                                                                                    return typeof window !== 'undefined' && localStorage.getItem('nyayaflow_debug') === 'true';
                                                                                }
                                                                                return true;
                                                                            })
                                                                            .map((w) => (
                                                                                <div key={w.id} className="mt-6">
                                                                                    {renderWidget(w)}
                                                                                </div>
                                                                            ));
                                                                    })()}

                                                                    {/* Magic Auto-Fill Button */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {isLoading && (
                                        <div className="space-y-4 max-w-2xl">
                                            <ThinkingStep
                                                title={
                                                    lastQuery.toLowerCase().includes('draft') || lastQuery.toLowerCase().includes('prepare')
                                                        ? "I'm working on your legal draft now..."
                                                        : lastQuery.toLowerCase().includes('case') || lastQuery.toLowerCase().includes('judgment')
                                                            ? "I'm searching for relevant court cases..."
                                                            : lastQuery.toLowerCase().includes('procedure') || lastQuery.toLowerCase().includes('steps')
                                                                ? "I'm figuring out the right procedure for you..."
                                                                : "I'm looking into this for you..."
                                                }
                                                status={searchStatusIndex > 0 ? "done" : "working"}
                                            />
                                            <ThinkingStep
                                                title={searchStatuses[searchStatusIndex]}
                                                status={searchStatusIndex > 0 ? "working" : "waiting"}
                                                type="search"
                                            />
                                        </div>
                                    )}
                                    <div className="h-64" />
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            <div
                                className={`fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-40 transition-all duration-300 ${showDraftPanel ? 'right-0 lg:right-[600px]' : 'right-0'}`}
                                style={{ left: window.innerWidth >= 768 ? `${sidebarWidth}px` : '0' }}
                            >
                                <div className="max-w-3xl mx-auto relative px-4">
                                    <div className="absolute inset-0 -top-20 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent pointer-events-none" />
                                    <form
                                        onSubmit={handleSend}
                                        className="relative flex items-center bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-200/50 dark:shadow-zinc-950/50 rounded-2xl p-2 pr-2 border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                                    >
                                        <div className="pl-3 py-2 text-zinc-400">
                                            {isLoading ? <SystemRestart className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                        </div>
                                        <textarea
                                            ref={textareaRef}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend(e as any);
                                                }
                                            }}
                                            placeholder={!user && queryCount >= 3 ? "🔒 Guest limit reached - Sign up to continue" : "Ask a follow-up..."}
                                            rows={1}
                                            className="flex-1 bg-transparent border-none text-[16px] text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-0 p-3 outline-none resize-none max-h-48 scrollbar-hide disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ height: 'auto', minHeight: '24px' }}
                                            disabled={!user && queryCount >= 3}
                                        />
                                        <button
                                            type="submit"
                                            className="p-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-lg"
                                            disabled={isLoading || !input.trim() || (!user && queryCount >= 3)}
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </form>
                                    <div className="text-center mt-3">
                                        {!user && queryCount === 2 ? (
                                            <p className="text-xs text-orange-500 font-medium">⚠️ Last free query remaining - Sign up for unlimited access</p>
                                        ) : !user && queryCount >= 3 ? (
                                            <p className="text-xs text-red-500 font-medium">🔒 Guest limit reached - Please sign up to continue</p>
                                        ) : (
                                            <p className="text-xs text-zinc-500">NyayaFlow AI can make mistakes. Verify important information.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DraftingPanel
                        isOpen={showDraftPanel}
                        onClose={() => setShowDraftPanel(false)}
                        initialContent={draftContent}
                        title={draftTitle}
                    />
                    <SourceDetailsPanel
                        isOpen={!!sourcePanelData}
                        onClose={() => setSourcePanelData(null)}
                        sources={sourcePanelData?.sources || []}
                        activeSourceId={sourcePanelData?.activeId}
                    />
                </PageTransition>

                {selectedResult && (
                    <DeepDiveModal
                        item={selectedResult}
                        onClose={() => setSelectedResult(null)}
                    />
                )}

                {/* Sprint 4: Export Brief Modal */}
                {showExportBrief && exportBriefData && (
                    <ExportBriefModal
                        isOpen={showExportBrief}
                        onClose={() => setShowExportBrief(false)}
                        query={exportBriefData.query}
                        results={exportBriefData.results}
                    />
                )}
            </div>
        </DashboardLayout >
    );
};

export default Research;
