import React from 'react';

const SkipLink = () => {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-indigo-600 focus:font-medium focus:rounded-lg focus:shadow-lg focus:ring-4 focus:ring-indigo-500/50 transition-transform"
        >
            Skip to main content
        </a>
    );
};

export default SkipLink;
