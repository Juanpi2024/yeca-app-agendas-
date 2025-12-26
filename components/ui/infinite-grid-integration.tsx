
import React, { useState, useRef, useEffect } from 'react';
import {
    motion,
    useMotionValue,
    useMotionTemplate,
    useAnimationFrame
} from "framer-motion";
import { MousePointerClick, Info, Sun, Moon, Settings2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard Shadcn utility for merging Tailwind classes safely.
 */
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Helper component for the SVG grid pattern.
 */
const GridPattern = ({ offsetX, offsetY, size }: { offsetX: any; offsetY: any; size: number }) => {
    return (
        <svg className="w-full h-full">
            <defs>
                <motion.pattern
                    id="grid-pattern"
                    width={size}
                    height={size}
                    patternUnits="userSpaceOnUse"
                    x={offsetX}
                    y={offsetY}
                >
                    <path
                        d={`M ${size} 0 L 0 0 0 ${size}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-muted-foreground/20"
                    />
                </motion.pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
    );
};

/**
 * The Infinite Grid Component
 * Displays a scrolling background grid that reveals an active layer on mouse hover.
 * Modified to be a pure background layer.
 */
export const InfiniteGrid = () => {
    const [gridSize, setGridSize] = useState(40);
    const containerRef = useRef<HTMLDivElement>(null);

    // Track mouse position with Motion Values for performance
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        mouseX.set(clientX);
        mouseY.set(clientY);
    };

    useEffect(() => {
        window.addEventListener('mousemove', (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        });
        return () => window.removeEventListener('mousemove', () => { });
    }, [mouseX, mouseY]);

    // Grid offsets for infinite scroll animation
    const gridOffsetX = useMotionValue(0);
    const gridOffsetY = useMotionValue(0);

    const speedX = 0.5;
    const speedY = 0.5;

    useAnimationFrame(() => {
        const currentX = gridOffsetX.get();
        const currentY = gridOffsetY.get();
        gridOffsetX.set((currentX + speedX) % gridSize);
        gridOffsetY.set((currentY + speedY) % gridSize);
    });

    const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

    return (
        <div
            ref={containerRef}
            className={cn(
                "fixed inset-0 w-full h-full pointer-events-none bg-background z-0"
            )}
        >
            {/* Layer 1: Subtle background grid */}
            <div className="absolute inset-0 opacity-[0.05]">
                <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} />
            </div>

            {/* Layer 2: Highlighted grid */}
            <motion.div
                className="absolute inset-0 opacity-30"
                style={{ maskImage, WebkitMaskImage: maskImage }}
            >
                <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} size={gridSize} />
            </motion.div>

            {/* Decorative Blur Spheres */}
            <div className="absolute inset-0 z-0">
                <div className="absolute right-[-10%] top-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[120px]" />
                <div className="absolute left-[-5%] bottom-[-10%] w-[35%] h-[35%] rounded-full bg-blue-500/10 blur-[120px]" />
            </div>
        </div>
    );
};

export default InfiniteGrid;
