import React from 'react';
import { cn } from '../../lib/utils';
import { NavArrowDown } from 'iconoir-react';

interface StampPaperProps {
    children: React.ReactNode;
    amount?: 100 | 500;
    state?: string;
    purchaserName?: string;
    hideGraphics?: boolean; // For printing on actual stamp paper
}

export const StampPaper: React.FC<StampPaperProps> = ({
    children,
    amount = 100,
    state = "DELHI",
    purchaserName = "___________________",
    hideGraphics = false
}) => {
    if (hideGraphics) {
        // Just spacing for printing
        return (
            <div className="relative w-full h-full bg-white text-black font-serif">
                <div className="h-[350px] w-full" aria-hidden="true" />
                <div className="px-16 pb-16">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-[1123px] bg-[#fdfbf7] text-black font-serif overflow-hidden shadow-sm selection:bg-green-100">
            {/* Security Pattern Border */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-[url('https://www.transparenttextures.com/patterns/security-pattern.png')] opacity-20"></div>

            {/* Stamp Header Area */}
            <div className="relative h-[350px] w-full bg-opacity-5 p-8 flex flex-col items-center justify-start border-b border-dashed border-green-800/20">

                {/* Simulated Watermark Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png"
                        alt="Watermark"
                        className="w-[400px] grayscale"
                    />
                </div>

                <div className="w-full flex justify-between items-start mb-4 relative z-10">
                    <div className="text-xs font-semibold text-green-800 tracking-widest border border-green-800 px-2 py-0.5">
                        INDIA NON JUDICIAL
                    </div>
                    <div className="text-xs font-semibold text-green-800 tracking-widest">
                        Government of {state}
                    </div>
                </div>

                {/* Main Stamp Graphic Simulation */}
                <div className="relative w-full h-48 border-2 border-green-700/30 rounded-lg flex items-center justify-center bg-green-50/30 overflow-hidden">
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-800 to-transparent"></div>

                    <div className="flex items-center gap-8 z-10">
                        {/* Emblem */}
                        <div className="w-24 h-24 opacity-80">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/800px-Emblem_of_India.svg.png"
                                alt="Satyamev Jayate"
                                className="w-full h-full object-contain grayscale brightness-50 sepiahue-rotate-90 saturate-200"
                                style={{ filter: 'sepia(1) hue-rotate(90deg) saturate(3)' }}
                            />
                        </div>

                        {/* Denomination */}
                        <div className="flex flex-col items-center">
                            <h1 className="text-4xl font-semibold text-green-900 tracking-tighter">
                                {amount === 100 ? 'ONE HUNDRED RUPEES' : 'FIVE HUNDRED RUPEES'}
                            </h1>
                            <div className="flex items-center gap-4 mt-2 w-full">
                                <div className="h-px bg-green-800 flex-1"></div>
                                <span className="text-2xl font-semibold text-green-900">Rs. {amount}</span>
                                <div className="h-px bg-green-800 flex-1"></div>
                            </div>
                        </div>
                    </div>

                    {/* Serial No Simulation */}
                    <div className="absolute bottom-2 right-4 font-mono text-xs text-red-900 tracking-widest">
                        AB {Math.floor(Math.random() * 900000) + 100000}
                    </div>
                </div>

                {/* Purchase Details */}
                <div className="w-full mt-4 flex justify-between text-xs font-mono text-zinc-600 border-t border-zinc-200 pt-2">
                    <div>
                        <span className="text-zinc-400">Purchased By:</span> {purchaserName}
                    </div>
                    <div>
                        <span className="text-zinc-400">Date:</span> {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Document Content */}
            <div className="px-16 pb-16 pt-8 relative z-10">
                {children}
            </div>

            {/* Footer Watermark */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-zinc-300 font-mono">
                Generated via NyayaFlow • Not a valid legal instrument until printed on physical stamp paper
            </div>
        </div>
    );
};
