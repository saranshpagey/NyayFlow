import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BentoFeatures from "../components/BentoFeatures";
import WhyUs from "../components/WhyUs";
import UseCases from "../components/UseCases";
import WaitlistForm from "../components/WaitlistForm";
import Footer from "../components/Footer";

const LandingPage = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className={`min-h-screen font-sans antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 ${darkMode ? 'dark' : ''}`}>
            <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
            <main>
                <Hero />
                <BentoFeatures />
                <WhyUs />
                <UseCases />
                <WaitlistForm />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
