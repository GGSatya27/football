import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function PageContainer({ children, showNav = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg text-white max-w-md mx-auto relative">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className={showNav ? 'pb-24' : ''}
      >
        {children}
      </motion.main>
    </div>
  );
}

export function Header({
  title, subtitle, right,
}: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="px-5 pt-5 pb-3 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
