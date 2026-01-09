import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RecentHistoryProvider } from "./context/RecentHistoryContext";
import { ResearchProvider } from "./context/ResearchContext";
import { ModalProvider } from "./context/ModalContext";
import { LayoutProvider } from "./context/LayoutContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Research from "./pages/Research";
import SmartDrafter from "./pages/SmartDrafter";
import PracticeManager from "./pages/PracticeManager";
import WidgetShowcase from "./pages/WidgetShowcase";
import KnowledgeBase from "./pages/KnowledgeBase";

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ResearchProvider>
                    <ModalProvider>
                        <LayoutProvider>
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/research" element={<Research />} />
                                <Route path="/drafter" element={<SmartDrafter />} />
                                <Route path="/practice" element={<PracticeManager />} />
                                <Route path="/widgets" element={<WidgetShowcase />} />
                                <Route path="/kb" element={<KnowledgeBase />} />
                                <Route path="/knowledge-base" element={<KnowledgeBase />} />
                                <Route path="*" element={<LandingPage />} />
                            </Routes>
                        </LayoutProvider>
                    </ModalProvider>
                </ResearchProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Failed to find the root element");
}
const root = createRoot(rootElement);
root.render(<App />);
