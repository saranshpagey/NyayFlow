import React from 'react';
import { ShieldAlert } from 'iconoir-react';

export const PenaltyWidget = ({ data }: { data: any }) => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">
                <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white">{data.crime || 'Punishment Detail'}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Imprisonment</span>
                <p className="text-base font-medium text-zinc-900 dark:text-zinc-200 mt-1">{data.imprisonment || 'Not Specified'}</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Maximum Fine</span>
                <p className="text-base font-medium text-zinc-900 dark:text-zinc-200 mt-1">{data.fine || 'Not Specified'}</p>
            </div>
        </div>
    </div>
);
