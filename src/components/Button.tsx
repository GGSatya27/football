import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({
  children, onClick, variant = 'primary', size = 'md', className, disabled, type = 'button',
}: BtnProps) {
  const variants: Record<string, string> = {
    primary: 'bg-primary text-black font-bold',
    secondary: 'bg-white/10 text-white font-semibold',
    ghost: 'bg-transparent text-text-secondary',
    danger: 'bg-danger text-white font-bold',
    success: 'bg-success text-white font-bold',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-5 py-3.5 text-base rounded-xl',
  };
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'btn-ripple inline-flex items-center justify-center gap-2 transition-colors select-none',
        variants[variant],
        sizes[size],
        disabled && 'opacity-40 pointer-events-none',
        className
      )}
    >
      {children}
    </motion.button>
  );
}
