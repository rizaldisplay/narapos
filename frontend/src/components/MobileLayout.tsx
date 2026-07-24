import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-zinc-100 flex justify-center">
      <div className="w-full max-w-[430px] bg-white min-h-[100dvh] shadow-xl relative overflow-x-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}

export function PageTransition({ children, keyName }: { children: ReactNode; keyName: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyName}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 flex flex-col min-h-0"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
