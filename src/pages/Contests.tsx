import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Users, Shield, Lock, Clock, Check, X, Coins, Shuffle, User,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageContainer, Header } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ui';
import { cn } from '../utils/cn';

type Category = 'men' | 'women' | 'mixed';
type ContestType = 'mega' | 'h2h' | 'practice' | 'private';

interface Contest {
  id: string;
  name: string;
  category: Category;
  type: ContestType;
  prize: number;
  entry: number;
  spots: number;
  filled: number;
  startsIn: number;
  joined: boolean;
}

const ICONS = { mega: Trophy, h2h: Users, practice: Shield, private: Lock };

const ALL_CONTESTS: Contest[] = [
  // Men's
  { id: 'm1', name: "Men's Mega Contest", category: 'men', type: 'mega', prize: 1000000, entry: 49, spots: 500, filled: 452, startsIn: 5400, joined: false },
  { id: 'm2', name: "Champion's Clash", category: 'men', type: 'mega', prize: 5000000, entry: 99, spots: 1000, filled: 870, startsIn: 7200, joined: false },
  { id: 'm3', name: 'H2H vs Rahul S.', category: 'men', type: 'h2h', prize: 1000, entry: 25, spots: 2, filled: 1, startsIn: 3600, joined: false },
  { id: 'm4', name: "Men's Practice", category: 'men', type: 'practice', prize: 0, entry: 0, spots: 100, filled: 34, startsIn: 900, joined: false },
  { id: 'm5', name: 'Office League', category: 'men', type: 'private', prize: 50000, entry: 100, spots: 20, filled: 14, startsIn: 10800, joined: false },
  // Women's
  { id: 'w1', name: "Women's Mega Contest", category: 'women', type: 'mega', prize: 500000, entry: 49, spots: 250, filled: 210, startsIn: 5400, joined: false },
  { id: 'w2', name: 'WSL Champion Cup', category: 'women', type: 'mega', prize: 2000000, entry: 99, spots: 500, filled: 380, startsIn: 7200, joined: false },
  { id: 'w3', name: "H2H Women's", category: 'women', type: 'h2h', prize: 1000, entry: 25, spots: 2, filled: 1, startsIn: 3600, joined: false },
  { id: 'w4', name: "Women's Practice", category: 'women', type: 'practice', prize: 0, entry: 0, spots: 100, filled: 22, startsIn: 900, joined: false },
  { id: 'w5', name: 'Sisters League', category: 'women', type: 'private', prize: 25000, entry: 50, spots: 10, filled: 7, startsIn: 3600, joined: true },
  // Mixed
  { id: 'x1', name: 'Mixed Fantasy Cup', category: 'mixed', type: 'mega', prize: 3000000, entry: 75, spots: 750, filled: 540, startsIn: 5400, joined: false },
  { id: 'x2', name: 'Mixed H2H', category: 'mixed', type: 'h2h', prize: 2000, entry: 35, spots: 2, filled: 1, startsIn: 1800, joined: false },
];

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

export function Contests() {
  const { addCoins, coins, gender } = useApp();
  const [category, setCategory] = useState<Category>(gender);
  const [contests, setContests] = useState(ALL_CONTESTS);
  const [confirm, setConfirm] = useState<Contest | null>(null);

  useEffect(() => {
    setCategory(gender);
  }, [gender]);

  useEffect(() => {
    const t = setInterval(() => {
      setContests((prev) => prev.map((c) => ({ ...c, startsIn: Math.max(0, c.startsIn - 1) })));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const filtered = contests.filter((c) => c.category === category);

  const join = (c: Contest) => {
    if (coins < c.entry) return;
    setContests((prev) => prev.map((x) => x.id === c.id ? { ...x, joined: true, filled: x.filled + 1 } : x));
    if (c.entry > 0) addCoins(-c.entry);
    setConfirm(null);
  };

  const tabs: { key: Category; label: string; icon: typeof User }[] = [
    { key: 'men', label: "Men's", icon: User },
    { key: 'women', label: "Women's", icon: Users },
    { key: 'mixed', label: 'Mixed', icon: Shuffle },
  ];

  return (
    <PageContainer>
      <Header title="Contests" subtitle={`${coins.toLocaleString()} coins available`} />

      {/* Category tabs */}
      <div className="px-5 mb-4 grid grid-cols-3 gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setCategory(t.key)}
            className={cn(
              'flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold border',
              category === t.key ? 'bg-primary text-black border-primary' : 'bg-card border-border text-text-secondary'
            )}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* Contest cards */}
      <div className="px-5 space-y-3">
        {filtered.map((c, i) => {
          const Icon = ICONS[c.type];
          const fillPct = (c.filled / c.spots) * 100;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden">
                <div className="p-4 pb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center',
                      c.type === 'mega' ? 'bg-primary/15' : c.type === 'private' ? 'bg-white/10' : 'bg-white/5'
                    )}>
                      <Icon size={20} className={c.type === 'mega' ? 'text-primary' : 'text-white'} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{c.name}</p>
                      <p className="text-[11px] text-text-secondary capitalize">{c.type === 'h2h' ? 'Head-to-Head' : c.type}</p>
                    </div>
                  </div>
                  {c.filled >= c.spots && <span className="text-[10px] font-bold bg-danger/20 text-danger px-2 py-0.5 rounded">FULL</span>}
                </div>

                <div className="px-4 pb-3">
                  <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase">Prize Pool</p>
                      <p className="text-lg font-black text-success">
                        {c.prize > 0 ? `₹${c.prize.toLocaleString('en-IN')}` : 'Free'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-text-secondary uppercase">Entry</p>
                      <p className="text-sm font-bold flex items-center gap-1">
                        {c.entry === 0 ? 'Free' : <><Coins size={14} className="text-primary" /> {c.entry}</>}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-3">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-text-secondary">{c.filled} / {c.spots} joined</span>
                    <span className="text-text-secondary flex items-center gap-1">
                      <Clock size={11} /> {formatTime(c.startsIn)}
                    </span>
                  </div>
                  <ProgressBar value={fillPct} color={fillPct > 90 ? 'bg-danger' : 'bg-primary'} />
                </div>

                <div className="px-4 pb-4">
                  {c.joined ? (
                    <div className="bg-success/15 text-success rounded-xl py-2.5 text-center text-sm font-bold flex items-center justify-center gap-1.5">
                      <Check size={16} /> Joined
                    </div>
                  ) : (
                    <Button
                      onClick={() => setConfirm(c)}
                      className="w-full"
                      size="md"
                      disabled={c.filled >= c.spots || coins < c.entry}
                    >
                      {c.filled >= c.spots ? 'Contest Full' : coins < c.entry ? 'Not Enough Coins' : `Join • ${c.entry === 0 ? 'Free' : c.entry + ' coins'}`}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirm(null)}
            className="fixed inset-0 z-50 bg-black/70 flex items-end max-w-md mx-auto"
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full rounded-t-card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Confirm Entry</h3>
                <button onClick={() => setConfirm(null)}><X size={18} /></button>
              </div>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Contest</span><span className="font-semibold">{confirm.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Entry fee</span><span className="font-semibold">{confirm.entry === 0 ? 'Free' : `${confirm.entry} coins`}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Prize pool</span><span className="font-semibold text-success">{confirm.prize > 0 ? `₹${confirm.prize.toLocaleString('en-IN')}` : 'Free'}</span></div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-sm font-bold">Balance after</span>
                  <span className="text-sm font-bold">{(coins - confirm.entry).toLocaleString()} coins</span>
                </div>
              </div>
              <Button onClick={() => join(confirm)} size="lg" className="w-full">
                Confirm & Join
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
