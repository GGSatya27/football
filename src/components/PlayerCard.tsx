import { motion } from 'framer-motion';
import { Player, COUNTRIES } from '../data/players';
import { cn } from '../utils/cn';

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
  selected?: boolean;
  badge?: string;
  className?: string;
}

export function PlayerCard({ player, onClick, selected, badge, className }: PlayerCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'bg-card border border-border rounded-card p-3 flex items-center gap-3 cursor-pointer relative',
        selected && 'border-primary ring-1 ring-primary',
        className
      )}
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-white text-sm flex-shrink-0"
        style={{ backgroundColor: player.teamColor }}
      >
        {player.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold truncate">{player.name}</p>
          <span className="text-xs">{COUNTRIES[player.country] || '🏴'}</span>
        </div>
        <p className="text-[11px] text-text-secondary">{player.club} • {player.position}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded font-semibold">£{player.price}M</span>
          <span className="text-[10px] text-success font-semibold">{player.expectedPoints} xPts</span>
          {player.ownership > 50 && <span className="text-[10px] text-primary font-semibold">★</span>}
        </div>
      </div>
      {badge && (
        <span className="text-[9px] bg-primary text-black font-bold px-1.5 py-0.5 rounded">{badge}</span>
      )}
      {player.injuryStatus !== 'fit' && (
        <span className={cn(
          'absolute top-2 right-2 w-2 h-2 rounded-full',
          player.injuryStatus === 'injured' ? 'bg-danger' : 'bg-amber-500'
        )} />
      )}
    </motion.div>
  );
}
