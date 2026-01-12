"use client";

import { motion } from "framer-motion";

interface SectionActionsProps {
    sectionId: string;
    sectionName: string;
    onDownload: (sectionId: string, sectionName: string) => void;
    onShareToX: (sectionName: string, sectionData?: string) => void;
    shareData?: string;
}

export function SectionActions({
    sectionId,
    sectionName,
    onDownload,
    onShareToX,
    shareData,
}: SectionActionsProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-3 mt-6"
        >
            <button
                onClick={() => onDownload(sectionId, sectionName)}
                className="font-vt323 text-sm md:text-base px-3 md:px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors font-bold flex items-center gap-2"
                title="Download as image"
            >
                <span className="text-base md:text-lg">📸</span>
                <span>DOWNLOAD</span>
            </button>
            <button
                onClick={() => onShareToX(sectionName, shareData)}
                className="font-vt323 text-sm md:text-base px-3 md:px-4 py-2 bg-black/40 border border-gray-500/50 text-gray-300 rounded hover:bg-black/60 transition-colors font-bold flex items-center gap-2"
                title="Share on X"
            >
                <svg
                    className="w-3 h-3 md:w-4 md:h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>SHARE ON X</span>
            </button>
        </motion.div>
    );
}
