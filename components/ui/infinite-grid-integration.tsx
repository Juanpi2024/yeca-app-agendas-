
import React from 'react';

/**
 * PremiumBackground
 * A simple, elegant background with soft gradients and a subtle texture.
 * Professional and lightweight.
 */
export const PremiumBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 -z-10 bg-slate-50 overflow-hidden">
            {/* Soft Mesh Gradients */}
            <div
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-100/50 blur-[120px] animate-pulse"
                style={{ animationDuration: '8s' }}
            />
            <div
                className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/40 blur-[130px] animate-pulse"
                style={{ animationDuration: '12s' }}
            />
            <div
                className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-50/60 blur-[100px]"
            />

            {/* Subtle Dot Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `radial-gradient(#e2e8f0 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Vignette effect */}
            <div className="absolute inset-0 bg-transparent shadow-[inset_0_0_150px_rgba(255,255,255,0.5)]" />
        </div>
    );
};

export default PremiumBackground;
