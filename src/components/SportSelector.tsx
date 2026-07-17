import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Trophy } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { competitionsByGender, Competition } from '../data/competitions';
import { Gender } from '../data/players';
import { cn } from '../utils/cn';

/** Premium segmented toggle: Men's / Women's Football */
export function GenderToggle() {
  const { gender, setGender } = useApp();
  return (
    <div className="bg-card border border-border rounded-xl p-1 flex relative">
      {(['men', 'women'] as Gender[]).map((g) => (
        <button
          key={g}
          onClick={() => setGender(g)}
          className="flex-1 relative py-2 text-xs font-bold rounded-lg z-10"
        >
          {gender === g && (
            <motion.div
              layoutId="genderPill"
              className="absolute inset-0 bg-primary rounded-lg"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className={cn('relative z-10', gender === g ? 'text-black' : 'text-text-secondary')}>
            {g === 'men' ? "Men's" : "Women's"}
          </span>
        </button>
      ))}
    </div>
  );
}

/** Competition dropdown — filters to current gender */
export function CompetitionSelect() {
  const { gender, competition, setCompetition } = useApp();
  const [open, setOpen] = useState(false);
  const list = competitionsByGender(gender);

  const select = (c: Competition | null) => {
    setCompetition(c);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-card border border-border rounded-xl px-3.5 py-2.5"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Trophy size={15} className="text-primary" />
          {competition ? `${competition.flag} ${competition.name}` : `All ${gender === 'men' ? "Men's" : "Women's"} Competitions`}
        </span>
        <ChevronDown size={16} className={cn('text-text-secondary transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto no-scrollbar"
            >
              <button
                onClick={() => select(null)}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 text-sm hover:bg-white/5',
                  !competition && 'text-primary font-bold'
                )}
              >
                <span>All {gender === 'men' ? "Men's" : "Women's"}</span>
                {!competition && <Check size={14} />}
              </button>
              <div className="h-px bg-border mx-2" />
              {list.map((c) => (
                <button
                  key={c.id}
                  onClick={() => select(c)}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 text-sm hover:bg-white/5',
                    competition?.id === c.id && 'text-primary font-bold'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                    <span className={cn('text-[9px] px-1.5 py-0.5 rounded font-semibold', c.type === 'cup' ? 'bg-primary/15 text-primary' : 'bg-white/10 text-text-secondary')}>
                      {c.type === 'cup' ? 'CUP' : 'LEAGUE'}
                    </span>
                  </span>
                  {competition?.id === c.id && <Check size={14} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
