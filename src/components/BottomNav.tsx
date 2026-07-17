import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, Trophy, User, Clapperboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const items = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/builder', label: 'Builder', icon: Clapperboard },
  { to: '/team', label: 'My Team', icon: Users },
  { to: '/contests', label: 'Contests', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const loc = useLocation();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md">
      <div className="bg-card border-t border-border/80 backdrop-blur-sm">
        <div className="flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {items.map((item) => {
            const active = loc.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className="flex-1 flex flex-col items-center gap-1 py-1">
                <div className="relative">
                  {active && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute -inset-x-3 -inset-y-1.5 bg-primary/15 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={22}
                    className={cn('relative z-10 transition-colors', active ? 'text-primary' : 'text-text-secondary')}
                  />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-semibold transition-colors',
                    active ? 'text-primary' : 'text-text-secondary'
                  )}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
