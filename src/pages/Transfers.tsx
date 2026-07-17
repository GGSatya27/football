import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, TrendingUp, TrendingDown, Gem, Check,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Position, Player } from '../data/players';
import { competitionsByGender } from '../data/competitions';
import { PageContainer, Header } from '../components/Layout';
import { Card } from '../components/Card';
import { PlayerCard } from '../components/PlayerCard';
import { PlayerDetail } from '../components/PlayerDetail';
import { GenderToggle } from '../components/SportSelector';

type SortKey = 'trending' | 'gems' | 'rise' | 'drop';
type Availability = 'all' | 'fit' | 'doubt' | 'injured';

const FILTER_CHIPS: { key: SortKey; label: string; icon: typeof TrendingUp }[] = [
  { key: 'trending', label: 'Trending', icon: TrendingUp },
  { key: 'gems', label: 'Budget Gems', icon: Gem },
  { key: 'rise', label: 'Price Rise', icon: TrendingUp },
  { key: 'drop', label: 'Price Drop', icon: TrendingDown },
];

export function Transfers() {
  const { gender, competition, players, starters, bench, swapPlayer, budgetRemaining } = useApp();
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState<Position | 'ALL'>('ALL');
  const [leagueFilter, setLeagueFilter] = useState<string>('ALL');
  const [sort, setSort] = useState<SortKey>('trending');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(15);
  const [maxAge, setMaxAge] = useState(40);
  const [minXpts, setMinXpts] = useState(0);
  const [minFitness, setMinFitness] = useState(0);
  const [availability, setAvailability] = useState<Availability>('all');
  const [selected, setSelected] = useState<Player | null>(null);
  const [justAdded, setJustAdded] = useState<number | null>(null);

  const ownedIds = new Set([...starters, ...bench]);
  const leagues = competitionsByGender(gender);

  const sorted = useMemo(() => {
    let list = players.filter((p) => !ownedIds.has(p.id));
    if (search) list = list.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.club.toLowerCase().includes(search.toLowerCase()) ||
      p.nationality.toLowerCase().includes(search.toLowerCase())
    );
    if (posFilter !== 'ALL') list = list.filter((p) => p.position === posFilter);
    if (leagueFilter !== 'ALL') list = list.filter((p) => p.leagueId === leagueFilter);
    list = list.filter((p) => p.price <= maxPrice && p.age <= maxAge && p.expectedPoints >= minXpts && p.fitness >= minFitness);
    if (availability !== 'all') list = list.filter((p) => p.injuryStatus === availability);

    switch (sort) {
      case 'trending': list = [...list].sort((a, b) => b.ownership - a.ownership); break;
      case 'gems': list = [...list].sort((a, b) => b.budgetValue - a.budgetValue); break;
      case 'rise': list = [...list].sort((a, b) => b.expectedPoints - a.expectedPoints); break;
      case 'drop': list = [...list].sort((a, b) => a.price - b.price); break;
    }
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, posFilter, sort, maxPrice, maxAge, minXpts, minFitness, availability, leagueFilter, gender, competition?.id]);

  const handleAdd = (p: Player) => {
    const benchPlayer = players.find((x) => bench.includes(x.id) && x.position === p.position);
    if (benchPlayer) swapPlayer(benchPlayer.id, p.id);
    setJustAdded(p.id);
    setTimeout(() => setJustAdded(null), 1500);
    setSelected(null);
  };

  const label = gender === 'women' ? "Women's" : "Men's";

  return (
    <PageContainer>
      <Header title="Transfers" subtitle={`${label} • £${budgetRemaining().toFixed(1)}M available`} />

      {/* Gender toggle */}
      <div className="px-5 mb-3">
        <GenderToggle />
      </div>

      {/* Search */}
      <div className="px-5 mb-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search players, clubs, countries..."
              className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm focus:border-primary outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
              showFilters ? 'bg-primary text-black border-primary' : 'bg-card border-border'
            }`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Position filter */}
      <div className="px-5 mb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPosFilter(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              posFilter === p ? 'bg-primary text-black' : 'bg-card border border-border text-text-secondary'
            }`}
          >
            {p === 'ALL' ? 'All' : p}
          </button>
        ))}
        <div className="w-px bg-border mx-1" />
        {leagues.slice(0, 6).map((l) => (
          <button
            key={l.id}
            onClick={() => setLeagueFilter(leagueFilter === l.id ? 'ALL' : l.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              leagueFilter === l.id ? 'bg-white/10 text-white' : 'bg-card border border-border text-text-secondary'
            }`}
          >
            {l.flag} {l.short}
          </button>
        ))}
      </div>

      {/* Sort chips */}
      <div className="px-5 mb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {FILTER_CHIPS.map((c) => (
          <button
            key={c.key}
            onClick={() => setSort(c.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${
              sort === c.key ? 'bg-white/10 text-white' : 'bg-card border border-border text-text-secondary'
            }`}
          >
            <c.icon size={13} /> {c.label}
          </button>
        ))}
      </div>

      {/* Advanced filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 mb-3 overflow-hidden"
          >
            <Card className="p-4 space-y-4">
              <div>
                <p className="text-xs font-bold mb-2">Max Price: £{maxPrice.toFixed(1)}M</p>
                <input type="range" min="4" max="15" step="0.5" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div>
                <p className="text-xs font-bold mb-2">Max Age: {maxAge}</p>
                <input type="range" min="16" max="40" step="1" value={maxAge} onChange={(e) => setMaxAge(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div>
                <p className="text-xs font-bold mb-2">Min Expected Points: {minXpts}</p>
                <input type="range" min="0" max="10" step="0.5" value={minXpts} onChange={(e) => setMinXpts(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div>
                <p className="text-xs font-bold mb-2">Min Fitness: {minFitness}%</p>
                <input type="range" min="0" max="100" step="5" value={minFitness} onChange={(e) => setMinFitness(Number(e.target.value))} className="w-full accent-primary" />
              </div>
              <div>
                <p className="text-xs font-bold mb-2">Availability</p>
                <div className="flex gap-2">
                  {([
                    { k: 'all', l: 'All' }, { k: 'fit', l: 'Fit' }, { k: 'doubt', l: 'Doubt' }, { k: 'injured', l: 'Injured' },
                  ] as const).map((a) => (
                    <button
                      key={a.k}
                      onClick={() => setAvailability(a.k)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        availability === a.k ? 'bg-primary text-black' : 'bg-card border border-border text-text-secondary'
                      }`}
                    >
                      {a.l}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => { setMaxPrice(15); setMaxAge(40); setMinXpts(0); setMinFitness(0); setAvailability('all'); setLeagueFilter('ALL'); }} className="text-xs text-danger font-semibold">
                Reset all filters
              </button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="px-5 space-y-2 mb-5">
        <p className="text-xs text-text-secondary">{sorted.length} players available</p>
        {sorted.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.3) }}
            className="relative"
          >
            <PlayerCard player={p} onClick={() => setSelected(p)} />
            <AnimatePresence>
              {justAdded === p.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-success/20 rounded-card flex items-center justify-center gap-2 border border-success"
                >
                  <Check size={18} className="text-success" />
                  <span className="text-sm font-bold text-success">Added!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        {sorted.length === 0 && (
          <div className="text-center py-12 text-text-secondary text-sm">No players match your filters.</div>
        )}
      </div>

      {/* Player detail */}
      <AnimatePresence>
        {selected && (
          <PlayerDetail player={selected} onClose={() => setSelected(null)} onBuy={() => handleAdd(selected)} />
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
