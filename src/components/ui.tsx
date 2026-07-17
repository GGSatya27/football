import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export function Avatar({ name, size = 36, className }: { name: string; size?: number; className?: string }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      className={cn('rounded-full bg-gradient-to-br from-primary to-amber-600 text-black font-extrabold flex items-center justify-center', className)}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export function LiveBadge({ label = 'LIVE' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-danger/20 text-danger text-[10px] font-bold">
      <span className="w-1.5 h-1.5 rounded-full bg-danger live-dot" />
      {label}
    </span>
  );
}

export function ProgressBar({ value, className, color = 'bg-primary' }: { value: number; className?: string; color?: string }) {
  return (
    <div className={cn('h-1.5 bg-white/10 rounded-full overflow-hidden', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={cn('h-full rounded-full', color)}
      />
    </div>
  );
}

export function StatPill({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="bg-white/5 rounded-lg px-2.5 py-1.5">
      <div className="text-[9px] uppercase text-text-secondary tracking-wide">{label}</div>
      <div className={cn('text-sm font-bold', accent)}>{value}</div>
    </div>
  );
}
