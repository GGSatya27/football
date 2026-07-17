import { motion } from 'framer-motion';
import { X, TrendingUp, Heart, Calendar, ShoppingCart } from 'lucide-react';
import { Player, COUNTRIES } from '../data/players';
import { Button } from './Button';
import { StatPill } from './ui';

interface PlayerDetailProps {
  player: Player;
  onClose: () => void;
  onBuy?: () => void;
  isOwned?: boolean;
}

// Simple radar chart (5-axis)
function RadarChart({ values }: { values: number[] }) {
  const labels = ['ATT', 'DEF', 'PASS', 'PHY', 'FORM'];
  const size = 140;
  const center = size / 2;
  const radius = 50;
  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
    const r = (v / 100) * radius;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  });
  const path = points.map((p) => p.join(',')).join(' ');
  const axes = labels.map((_, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    return [center + radius * Math.cos(angle), center + radius * Math.sin(angle)];
  });
  return (
    <svg width={size} height={size} className="mx-auto">
      {[0.33, 0.66, 1].map((s) => (
        <circle key={s} cx={center} cy={center} r={radius * s} fill="none" stroke="#ffffff15" strokeWidth="1" />
      ))}
      {axes.map((a, i) => (
        <line key={i} x1={center} y1={center} x2={a[0]} y2={a[1]} stroke="#ffffff15" strokeWidth="1" />
      ))}
      <motion.polygon
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        points={path}
        fill="#FFD54A40"
        stroke="#FFD54A"
        strokeWidth="2"
        style={{ transformOrigin: 'center' }}
      />
      {labels.map((l, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const lx = center + (radius + 14) * Math.cos(angle);
        const ly = center + (radius + 14) * Math.sin(angle);
        return <text key={l} x={lx} y={ly} fill="#9CA3AF" fontSize="9" textAnchor="middle" dominantBaseline="middle" fontWeight="700">{l}</text>;
      })}
    </svg>
  );
}

export function PlayerDetail({ player, onClose, onBuy, isOwned }: PlayerDetailProps) {
  const fixtures = ['ARS (H)', 'CHE (A)', 'LIV (H)', 'MUN (A)'];
  const transferTrend = [10, 15, 22, 30, 42, 55, player.ownership];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 flex items-end max-w-md mx-auto"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full rounded-t-card max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        {/* Header */}
        <div className="relative p-5 pb-4 border-b border-border">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <X size={16} />
          </button>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-xl"
              style={{ backgroundColor: player.teamColor }}
            >
              {player.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h2 className="text-lg font-black">{player.name}</h2>
              <p className="text-sm text-text-secondary">{player.club} • {player.position} • {COUNTRIES[player.country]}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-primary">£{player.price}M</span>
                <span className="text-xs text-text-secondary">•</span>
                <span className="text-sm font-bold text-success">{player.expectedPoints} xPts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2">
            <StatPill label="Ownership" value={`${player.ownership}%`} />
            <StatPill label="Total Pts" value={Math.round(player.form.reduce((a, b) => a + b, 0) * 8)} accent="text-primary" />
            <StatPill label="Fitness" value={`${player.fitness}%`} accent={player.fitness < 85 ? 'text-danger' : 'text-success'} />
          </div>

          {/* Form */}
          <div>
            <p className="text-xs font-bold mb-2">Recent Form (last 5 GWs)</p>
            <div className="flex gap-1.5">
              {player.form.map((f, i) => (
                <div key={i} className="flex-1">
                  <div className="h-14 bg-white/5 rounded-lg flex items-end overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(f / 12) * 100}%` }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="w-full bg-primary rounded-md"
                    />
                  </div>
                  <p className="text-center text-[10px] mt-1 font-semibold">{f}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Radar */}
          <div>
            <p className="text-xs font-bold mb-2">Performance Radar</p>
            <RadarChart values={[
              player.position === 'GK' ? 60 : player.position === 'DEF' ? 70 : 88,
              player.position === 'FWD' ? 50 : player.position === 'DEF' ? 88 : 70,
              75, player.fitness, player.form.reduce((a, b) => a + b, 0) / player.form.length * 10,
            ]} />
          </div>

          {/* Injury status */}
          <div className={`flex items-center gap-3 p-3 rounded-xl ${player.injuryStatus === 'fit' ? 'bg-success/10' : 'bg-danger/10'}`}>
            <Heart size={18} className={player.injuryStatus === 'fit' ? 'text-success' : 'text-danger'} />
            <div className="flex-1">
              <p className="text-sm font-bold">{player.injuryStatus === 'fit' ? 'Fully Fit' : player.injuryStatus === 'doubt' ? 'Doubtful — 60% to start' : 'Injured'}</p>
              <p className="text-[11px] text-text-secondary">{player.injuryStatus === 'fit' ? 'No known issues' : 'Monitor before deadline'}</p>
            </div>
          </div>

          {/* Fixtures */}
          <div>
            <p className="text-xs font-bold mb-2 flex items-center gap-1.5"><Calendar size={14} /> Upcoming Fixtures</p>
            <div className="grid grid-cols-2 gap-2">
              {fixtures.map((f, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-2 text-xs font-semibold text-center">{f}</div>
              ))}
            </div>
          </div>

          {/* Transfer trend */}
          <div>
            <p className="text-xs font-bold mb-2 flex items-center gap-1.5"><TrendingUp size={14} /> Transfer Trend</p>
            <div className="flex items-end gap-1 h-16">
              {transferTrend.map((t, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(t / 80) * 100}%` }}
                    transition={{ delay: i * 0.05 }}
                    className="w-full bg-primary/70 rounded-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buy button */}
          {!isOwned && onBuy && (
            <Button onClick={onBuy} size="lg" className="w-full">
              <ShoppingCart size={18} /> Add to Team • £{player.price}M
            </Button>
          )}
          {isOwned && (
            <div className="text-center text-sm text-success font-bold py-2">In your squad</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
