import { motion } from 'framer-motion';
import { Player, FORMATION_LAYOUTS, Formation } from '../data/players';
import { cn } from '../utils/cn';

interface PitchProps {
  starters: Player[];
  formation: Formation;
  captainId?: number;
  viceId?: number;
  onSelect?: (id: number) => void;
  selectedId?: number | null;
  compact?: boolean;
  className?: string;
}

const POS_Y = { GK: 88, DEF: 66, MID: 40, FWD: 16 };

export function FootballPitch({
  starters, formation, captainId, viceId, onSelect, selectedId, compact = false, className,
}: PitchProps) {
  const layout = FORMATION_LAYOUTS[formation];
  const positions: { player: Player; x: number; y: number }[] = [];

  (['GK', 'DEF', 'MID', 'FWD'] as const).forEach((pos) => {
    const ids = starters.filter((p) => p.position === pos);
    const xs = layout[pos];
    ids.forEach((pl, i) => {
      const x = xs[i] ?? 50;
      const y = POS_Y[pos];
      positions.push({ player: pl, x, y });
    });
  });

  return (
    <div
      className={cn(
        'relative w-full rounded-card overflow-hidden pitch-stripe',
        compact ? 'aspect-[3/4] max-h-[280px]' : 'aspect-[3/4]',
        className
      )}
    >
      {/* pitch markings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-2 border-2 border-white/20 rounded-md" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/20 rounded-full" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-24 h-10 border-2 border-t-0 border-white/20" />
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-24 h-10 border-2 border-b-0 border-white/20" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-full bg-white/10" />
      </div>

      {positions.map(({ player, x, y }) => {
        const isCap = player.id === captainId;
        const isVice = player.id === viceId;
        const selected = selectedId === player.id;
        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(player.id);
            }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <div
                className={cn(
                  'relative rounded-full flex items-center justify-center font-extrabold text-white shadow-lg',
                  compact ? 'w-7 h-7 text-[10px]' : 'w-10 h-10 text-xs',
                  selected && 'ring-4 ring-primary'
                )}
                style={{ backgroundColor: player.teamColor }}
              >
                {player.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                {(isCap || isVice) && (
                  <span
                    className={cn(
                      'absolute -top-1 -right-1 rounded-full text-[8px] font-black px-1',
                      compact ? 'w-4 h-4' : 'w-5 h-5',
                      isCap ? 'bg-primary text-black' : 'bg-white/90 text-black'
                    )}
                  >
                    {isCap ? 'C' : 'V'}
                  </span>
                )}
                {player.injuryStatus !== 'fit' && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-danger border border-black" />
                )}
              </div>
              {!compact && (
                <div className="text-center">
                  <div className="text-[10px] font-semibold text-white drop-shadow leading-tight">
                    {player.name.split(' ').slice(-1)}
                  </div>
                  <div className="text-[9px] text-white/70 leading-tight">{player.expectedPoints}pts</div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
