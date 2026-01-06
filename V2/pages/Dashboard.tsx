import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
    return (
        <DashboardLayout>
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Welcome to NyayaFlow</h1>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                        <p className="text-zinc-600 dark:text-zinc-400">
                            This is the beginning of your verified legal AI experience.
                            <br /><br />
                            Select a module from the sidebar to get started.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
