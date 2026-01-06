import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Research from "./pages/Research";
import SmartDrafter from "./pages/SmartDrafter";
import PracticeManager from "./pages/PracticeManager";

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/drafter" element={<SmartDrafter />} />
                    <Route path="/practice" element={<PracticeManager />} />
                </Routes>
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
