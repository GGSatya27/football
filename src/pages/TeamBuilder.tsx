import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Check, Search, Crown, Star, Sparkles, X,
  Wallet, HeartPulse, Activity, CloudRain, Calendar, Users, Grid3x3,
  LayoutGrid, TrendingUp, Plus, Trash2, Save, Zap,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import {
  Player, Position, Formation, FORMATIONS, FORMATION_SLOTS, SlotDef,
  BUDGET, COUNTRIES, activePlayers, availableCountries,
} from '../data/players';
import { competitionsByGender, Competition } from '../data/competitions';
import { Gender } from '../data/players';
import { analyzeTeam, optimizeTeam } from '../utils/teamAnalysis';
import { PageContainer } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';

const STEPS = ['Category', 'Competition', 'Country', 'Formation', 'Squad', 'Captain', 'AI Analysis'];
const INSIGHT_ICONS: Record<string, typeof Wallet> = {
  Wallet, HeartPulse, Activity, CloudRain, Calendar, Users, Grid3x3,
  LayoutGrid, Sparkles, Crown, Star, TrendingUp,
};

export function TeamBuilder() {
  const nav = useNavigate();
  const { saveCurrentTeam } = useApp();

  // wizard state
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<Gender>('men');
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [formation, setFormation] = useState<Formation>('4-3-3');
  const [slots, setSlots] = useState<(Player | null)[]>([]);
  const [captain, setCaptain] = useState<number | null>(null);
  const [viceCaptain, setViceCaptain] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState<Position | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'xpts' | 'price' | 'value' | 'form'>('xpts');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeSwaps, setOptimizeSwaps] = useState<string[]>([]);

  // init slots when formation changes
  const formationSlots = FORMATION_SLOTS[formation];
  const slotCount = formationSlots.length;

  // ensure slots array matches formation length
  const currentSlots = useMemo(() => {
    const arr = [...slots];
    while (arr.length < slotCount) arr.push(null);
    return arr.slice(0, slotCount);
  }, [slots, slotCount]);

  // available players: gender + competition + country filtered
  const available = useMemo(() => {
    let list = activePlayers(gender, competition?.id);
    if (country) list = list.filter((p) => p.country === country);
    return list;
  }, [gender, competition, country]);

  const countries = useMemo(() => availableCountries(gender), [gender]);
  const competitions = competitionsByGender(gender);

  const filledPlayers = currentSlots.filter(Boolean) as Player[];
  const budgetUsed = filledPlayers.reduce((s, p) => s + p.price, 0);
  const budgetRemaining = BUDGET - budgetUsed;

  const captainPlayer = currentSlots.find((p) => p?.id === captain) ?? null;
  const vicePlayer = currentSlots.find((p) => p?.id === viceCaptain) ?? null;

  const analysis = useMemo(
    () => analyzeTeam(currentSlots, formation, captainPlayer, vicePlayer),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSlots, formation, captain, viceCaptain],
  );

  // filtered + sorted player list for picker
  const pickerPlayers = useMemo(() => {
    let list = available.filter((p) => !currentSlots.some((s) => s?.id === p.id));
    if (search) list = list.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.club.toLowerCase().includes(search.toLowerCase()) ||
      p.nationality.toLowerCase().includes(search.toLowerCase()),
    );
    if (posFilter !== 'ALL') list = list.filter((p) => p.position === posFilter);
    switch (sortBy) {
      case 'xpts': list = [...list].sort((a, b) => b.expectedPoints - a.expectedPoints); break;
      case 'price': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'value': list = [...list].sort((a, b) => b.budgetValue - a.budgetValue); break;
      case 'form': list = [...list].sort((a, b) => b.last5Rating - a.last5Rating); break;
    }
    return list;
  }, [available, currentSlots, search, posFilter, sortBy]);

  const handleSlotTap = (idx: number) => {
    setSelectedSlot(idx);
    setShowPicker(true);
  };

  const assignPlayer = (player: Player) => {
    if (selectedSlot === null) return;
    setSlots((prev) => {
      const arr = [...prev];
      while (arr.length < slotCount) arr.push(null);
      // remove player from any other slot first
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]?.id === player.id) arr[i] = null;
      }
      arr[selectedSlot] = player;
      return arr.slice(0, slotCount);
    });
    setShowPicker(false);
    setSelectedSlot(null);
  };

  const removeFromSlot = (idx: number) => {
    setSlots((prev) => {
      const arr = [...prev];
      arr[idx] = null;
      return arr;
    });
  };

  const handleOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      const result = optimizeTeam(available, formation, currentSlots, captain, viceCaptain);
      setSlots(result.slots);
      setCaptain(result.captainId);
      setViceCaptain(result.viceId);
      setOptimizeSwaps(result.swaps);
      setOptimizing(false);
    }, 1500);
  };

  const handleSave = () => {
    if (!teamName.trim()) return;
    saveCurrentTeam(teamName);
    setTeamName('');
    setShowSave(false);
    nav('/team');
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return true;
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return filledPlayers.length >= 7;
    if (step === 5) return captain !== null;
    return true;
  };

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <PageContainer showNav={false}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center">
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-extrabold">Team Builder</h1>
          <p className="text-xs text-text-secondary">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
        </div>
      </div>

      {/* Step progress bar */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                i <= step ? 'bg-primary' : 'bg-white/10',
              )}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          {STEPS.map((_, i) => (
            <span key={i} className={cn('text-[8px] font-semibold', i === step ? 'text-primary' : 'text-text-secondary')}>
              {i + 1}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 0: Category */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5">
            <h2 className="text-base font-bold mb-3">Choose Category</h2>
            <div className="space-y-3">
              {(['men', 'women'] as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={cn(
                    'w-full p-4 rounded-card border-2 flex items-center gap-4 transition-all',
                    gender === g ? 'border-primary bg-primary/10' : 'border-border bg-card',
                  )}
                >
                  <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-2xl', gender === g ? 'bg-primary/20' : 'bg-white/5')}>
                    {g === 'men' ? '⚽' : '⚽'}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-base font-bold">{g === 'men' ? "Men's Football" : "Women's Football"}</p>
                    <p className="text-xs text-text-secondary">{g === 'men' ? 'Premier League, La Liga, World Cup...' : 'WSL, NWSL, Liga F, Women\'s World Cup...'}</p>
                  </div>
                  {gender === g && <Check size={20} className="text-primary" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 1: Competition */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5">
            <h2 className="text-base font-bold mb-3">Select Competition</h2>
            <button
              onClick={() => setCompetition(null)}
              className={cn(
                'w-full p-3.5 rounded-card border-2 flex items-center justify-between mb-2',
                !competition ? 'border-primary bg-primary/10' : 'border-border bg-card',
              )}
            >
              <span className="text-sm font-bold">All {gender === 'men' ? "Men's" : "Women's"} Competitions</span>
              {!competition && <Check size={18} className="text-primary" />}
            </button>
            <div className="space-y-2">
              {competitions.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCompetition(competition?.id === c.id ? null : c)}
                  className={cn(
                    'w-full p-3.5 rounded-card border-2 flex items-center justify-between',
                    competition?.id === c.id ? 'border-primary bg-primary/10' : 'border-border bg-card',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{c.flag}</span>
                    <div className="text-left">
                      <p className="text-sm font-bold">{c.name}</p>
                      <p className="text-[10px] text-text-secondary">{c.country} • {c.type}</p>
                    </div>
                  </div>
                  {competition?.id === c.id && <Check size={18} className="text-primary" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: Country */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5">
            <h2 className="text-base font-bold mb-3">Select Country</h2>
            <button
              onClick={() => setCountry(null)}
              className={cn(
                'w-full p-3.5 rounded-card border-2 flex items-center justify-between mb-2',
                !country ? 'border-primary bg-primary/10' : 'border-border bg-card',
              )}
            >
              <span className="text-sm font-bold">All Countries</span>
              {!country && <Check size={18} className="text-primary" />}
            </button>
            <div className="grid grid-cols-2 gap-2">
              {countries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCountry(country === c.code ? null : c.code)}
                  className={cn(
                    'p-3 rounded-card border-2 flex items-center gap-2',
                    country === c.code ? 'border-primary bg-primary/10' : 'border-border bg-card',
                  )}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-bold truncate">{c.name}</p>
                    <p className="text-[10px] text-text-secondary">{c.count} players</p>
                  </div>
                  {country === c.code && <Check size={16} className="text-primary" />}
                </button>
              ))}
            </div>
            {countries.length === 0 && (
              <p className="text-center text-sm text-text-secondary py-8">No players found for this filter.</p>
            )}
          </motion.div>
        )}

        {/* STEP 3: Formation */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5">
            <h2 className="text-base font-bold mb-3">Select Formation</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {FORMATIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => { setFormation(f); setSlots([]); }}
                  className={cn(
                    'p-4 rounded-card border-2 text-center',
                    formation === f ? 'border-primary bg-primary/10' : 'border-border bg-card',
                  )}
                >
                  <p className="text-2xl font-black">{f}</p>
                  <p className="text-[10px] text-text-secondary mt-1">
                    {f.split('-').map(Number).join(' / ')}
                  </p>
                </button>
              ))}
            </div>
            <Card className="p-4">
              <p className="text-xs font-bold text-text-secondary mb-3 text-center uppercase tracking-wide">Formation Preview</p>
              <FormationPitch formation={formation} slots={currentSlots} onSlotTap={handleSlotTap} />
            </Card>
          </motion.div>
        )}

        {/* STEP 4: Player Selection + Assign */}
        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold">Build Your Squad</h2>
              <div className="text-right">
                <p className={cn('text-sm font-bold', budgetRemaining < 0 ? 'text-danger' : 'text-success')}>
                  £{budgetRemaining.toFixed(1)}M
                </p>
                <p className="text-[10px] text-text-secondary">{filledPlayers.length}/{slotCount} filled</p>
              </div>
            </div>

            <Card className="p-4 mb-3">
              <FormationPitch formation={formation} slots={currentSlots} onSlotTap={handleSlotTap} />
            </Card>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-text-secondary">Tap a slot to assign a player.</span>
              <span className="text-xs text-text-secondary">|</span>
              <span className="text-xs font-bold text-primary">{available.length} available</span>
            </div>

            {/* selected players list */}
            {filledPlayers.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-bold text-text-secondary mb-2">Selected Players</p>
                <div className="space-y-1.5">
                  {currentSlots.map((p, i) => p && (
                    <div key={i} className="bg-card border border-border rounded-xl p-2.5 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: p.teamColor }}>
                        {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{p.name} <span className="text-xs">{COUNTRIES[p.country]}</span></p>
                        <p className="text-[10px] text-text-secondary">{FORMATION_SLOTS[formation][i].fullLabel} • {p.club} • £{p.price}M</p>
                      </div>
                      <button onClick={() => removeFromSlot(i)} className="text-danger">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 5: Captain */}
        {step === 5 && (
          <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5">
            <h2 className="text-base font-bold mb-3">Assign Captain & Vice</h2>
            <Card className="p-4 mb-3">
              <FormationPitch formation={formation} slots={currentSlots} captainId={captain} viceId={viceCaptain} onSlotTap={(i) => {
                const p = currentSlots[i];
                if (!p) return;
                if (captain === p.id) setCaptain(null);
                else if (viceCaptain === p.id) setViceCaptain(null);
                else if (!captain) setCaptain(p.id);
                else if (!viceCaptain) setViceCaptain(p.id);
                else setCaptain(p.id);
              }} />
            </Card>

            <div className="space-y-2 mb-4">
              <p className="text-xs font-bold text-text-secondary">Tap a player to cycle: Captain → Vice → None</p>
              {filledPlayers.sort((a, b) => b.expectedPoints - a.expectedPoints).slice(0, 5).map((p) => {
                const isCap = captain === p.id;
                const isVice = viceCaptain === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (isCap) setCaptain(null);
                      else if (isVice) setViceCaptain(null);
                      else if (!captain) setCaptain(p.id);
                      else if (!viceCaptain) setViceCaptain(p.id);
                      else setCaptain(p.id);
                    }}
                    className="w-full bg-card border border-border rounded-xl p-3 flex items-center gap-3"
                  >
                    <span className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: p.teamColor }}>
                      {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </span>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold">{p.name}</p>
                      <p className="text-[10px] text-text-secondary">{p.expectedPoints} xPts • £{p.price}M • {p.club}</p>
                    </div>
                    {isCap && <span className="flex items-center gap-1 text-xs font-bold text-primary"><Crown size={14} /> C</span>}
                    {isVice && <span className="flex items-center gap-1 text-xs font-bold text-white"><Star size={14} /> V</span>}
                    {!isCap && !isVice && <Plus size={16} className="text-text-secondary" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 6: AI Analysis */}
        {step === 6 && (
          <motion.div key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5">
            <h2 className="text-base font-bold mb-3">AI Validation</h2>

            {/* Overall rating */}
            <Card className="p-5 mb-3 text-center">
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Overall Team Rating</p>
              <motion.p
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className={cn(
                  'text-5xl font-black',
                  analysis.rating >= 80 ? 'text-success' : analysis.rating >= 60 ? 'text-primary' : 'text-danger',
                )}
              >
                {analysis.rating}
                <span className="text-2xl text-text-secondary">/100</span>
              </motion.p>
              <div className="flex justify-center gap-4 mt-3 text-xs">
                <span className="text-text-secondary">Budget: <span className={analysis.budgetOK ? 'text-success font-bold' : 'text-danger font-bold'}>{analysis.budgetOK ? 'OK' : 'OVER'}</span></span>
                <span className="text-text-secondary">xPts: <span className="font-bold">{analysis.totalXpts.toFixed(1)}</span></span>
                <span className="text-text-secondary">Chem: <span className="font-bold">{analysis.chemistry}%</span></span>
              </div>
            </Card>

            {/* Stat breakdown */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <Card className="p-3 text-center">
                <p className="text-[10px] text-text-secondary">Fitness</p>
                <p className="text-lg font-bold">{analysis.fitnessAvg}%</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-[10px] text-text-secondary">Injuries</p>
                <p className={cn('text-lg font-bold', analysis.injuryCount > 0 ? 'text-danger' : 'text-success')}>{analysis.injuryCount}</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-[10px] text-text-secondary">Coverage</p>
                <p className="text-lg font-bold">{analysis.positionCoverage}%</p>
              </Card>
            </div>

            {/* Insights */}
            <div className="space-y-2 mb-3">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">AI Analysis</p>
              {analysis.insights.map((ins, i) => {
                const Icon = INSIGHT_ICONS[ins.icon] || Sparkles;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={cn(
                      'rounded-xl p-3 flex gap-3 border',
                      ins.type === 'danger' ? 'bg-danger/10 border-danger/30' :
                      ins.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                      ins.type === 'success' ? 'bg-success/10 border-success/30' :
                      'bg-white/5 border-border',
                    )}
                  >
                    <Icon size={17} className={cn(
                      'flex-shrink-0 mt-0.5',
                      ins.type === 'danger' ? 'text-danger' :
                      ins.type === 'warning' ? 'text-amber-500' :
                      ins.type === 'success' ? 'text-success' : 'text-primary',
                    )} />
                    <div>
                      <p className="text-sm font-bold">{ins.title}</p>
                      <p className="text-[11px] text-text-secondary mt-0.5">{ins.detail}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <Card className="p-4 mb-3">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">AI Recommendations</p>
                <div className="space-y-2">
                  {analysis.recommendations.map((r, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <Sparkles size={14} className="text-primary flex-shrink-0 mt-0.5" />
                      <p>{r}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Optimize swaps log */}
            {optimizeSwaps.length > 0 && (
              <Card className="p-4 mb-3 border-primary/30">
                <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">AI Optimization Log</p>
                <div className="space-y-1.5">
                  {optimizeSwaps.map((s, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <Zap size={12} className="text-primary flex-shrink-0 mt-0.5" />
                      <p>{s}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Action buttons */}
            <div className="space-y-2 mb-5">
              <Button onClick={handleOptimize} size="lg" className="w-full" disabled={optimizing}>
                {optimizing ? (
                  <><Sparkles size={18} className="animate-pulse" /> Optimizing...</>
                ) : (
                  <><Sparkles size={18} /> Optimize with AI</>
                )}
              </Button>
              <Button onClick={() => setShowSave(true)} variant="secondary" size="lg" className="w-full">
                <Save size={18} /> Save My Team
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="px-5 pb-5 flex items-center gap-2">
        {step > 0 && (
          <Button variant="secondary" size="lg" onClick={prev} className="flex-1">
            <ChevronLeft size={18} /> Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button size="lg" onClick={next} className="flex-1" disabled={!canProceed()}>
            Continue <ChevronRight size={18} />
          </Button>
        ) : (
          <Button variant="success" size="lg" onClick={() => nav('/team')} className="flex-1">
            <Check size={18} /> Done
          </Button>
        )}
      </div>

      {/* Player picker modal */}
      <AnimatePresence>
        {showPicker && (
          <PlayerPicker
            players={pickerPlayers}
            slot={selectedSlot !== null ? formationSlots[selectedSlot] : null}
            search={search}
            setSearch={setSearch}
            posFilter={posFilter}
            setPosFilter={setPosFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onPick={assignPlayer}
            onClose={() => { setShowPicker(false); setSelectedSlot(null); }}
          />
        )}
      </AnimatePresence>

      {/* Save modal */}
      <AnimatePresence>
        {showSave && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowSave(false)}
            className="fixed inset-0 z-50 bg-black/70 flex items-end max-w-md mx-auto"
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full rounded-t-card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Save Custom Team</h3>
                <button onClick={() => setShowSave(false)}><X size={18} /></button>
              </div>
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Argentina World Cup Squad"
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none mb-4"
              />
              <Button onClick={handleSave} size="lg" className="w-full" disabled={!teamName.trim()}>
                <Save size={16} /> Save Team
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}

// ===== Formation Pitch with draggable slots =====
function FormationPitch({
  formation, slots, captainId, viceId, onSlotTap,
}: {
  formation: Formation;
  slots: (Player | null)[];
  captainId?: number | null;
  viceId?: number | null;
  onSlotTap: (idx: number) => void;
}) {
  const formationSlots = FORMATION_SLOTS[formation];
  return (
    <div className="relative w-full aspect-[3/4] rounded-card overflow-hidden pitch-stripe">
      {/* pitch markings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-2 border-2 border-white/20 rounded-md" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/20 rounded-full" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-24 h-10 border-2 border-t-0 border-white/20" />
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-24 h-10 border-2 border-b-0 border-white/20" />
      </div>

      {/* formation lines connecting slots */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {formationSlots.map((slot, i) => {
          const nextSlots = formationSlots.filter((s, j) => j > i && s.group === slot.group);
          return nextSlots.map((ns, k) => (
            <line
              key={i + '-' + k}
              x1={slot.x + '%'} y1={slot.y + '%'}
              x2={ns.x + '%'} y2={ns.y + '%'}
              stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3,3"
            />
          ));
        })}
      </svg>

      {formationSlots.map((slot, i) => {
        const player = slots[i];
        const isCap = player?.id === captainId;
        const isVice = player?.id === viceId;
        const positionMatch = player ? player.position === slot.group : true;
        return (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute"
            style={{ left: slot.x + '%', top: slot.y + '%', transform: 'translate(-50%, -50%)', zIndex: 2 }}
            onClick={(e) => {
              e.stopPropagation();
              onSlotTap(i);
            }}
          >
            <div className="flex flex-col items-center gap-0.5 cursor-pointer">
              {player ? (
                <>
                  <div
                    className={cn(
                      'relative rounded-full flex items-center justify-center font-extrabold text-white shadow-lg w-9 h-9 text-[10px]',
                      !positionMatch && 'ring-2 ring-danger',
                      isCap && 'ring-2 ring-primary',
                    )}
                    style={{ backgroundColor: player.teamColor }}
                  >
                    {player.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    {(isCap || isVice) && (
                      <span className={cn(
                        'absolute -top-1 -right-1 rounded-full text-[7px] font-black px-1 w-4 h-4 flex items-center justify-center',
                        isCap ? 'bg-primary text-black' : 'bg-white/90 text-black',
                      )}>
                        {isCap ? 'C' : 'V'}
                      </span>
                    )}
                    {player.injuryStatus !== 'fit' && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-danger border border-black" />
                    )}
                  </div>
                  <div className="text-center bg-black/40 rounded px-1">
                    <div className="text-[9px] font-semibold text-white leading-tight">
                      {player.name.split(' ').slice(-1)}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-full border-2 border-dashed border-white/30 flex items-center justify-center w-9 h-9 bg-black/20">
                    <Plus size={16} className="text-white/40" />
                  </div>
                  <div className="text-center">
                    <div className="text-[9px] font-semibold text-white/50 leading-tight">{slot.label}</div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ===== Player Picker Modal =====
function PlayerPicker({
  players, slot, search, setSearch, posFilter, setPosFilter, sortBy, setSortBy, onPick, onClose,
}: {
  players: Player[];
  slot: SlotDef | null;
  search: string;
  setSearch: (s: string) => void;
  posFilter: Position | 'ALL';
  setPosFilter: (p: Position | 'ALL') => void;
  sortBy: 'xpts' | 'price' | 'value' | 'form';
  setSortBy: (s: 'xpts' | 'price' | 'value' | 'form') => void;
  onPick: (p: Player) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 flex items-end max-w-md mx-auto"
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full rounded-t-card p-4 max-h-[80vh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold">Select Player</h3>
            {slot && <p className="text-[11px] text-text-secondary">{slot.fullLabel} • {slot.group}</p>}
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <div className="flex gap-2 mb-2">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white/5 border border-border rounded-lg pl-8 pr-3 py-2 text-sm focus:border-primary outline-none"
            />
          </div>
        </div>

        <div className="flex gap-1.5 mb-2 overflow-x-auto no-scrollbar">
          {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPosFilter(p)}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-bold flex-shrink-0',
                posFilter === p ? 'bg-primary text-black' : 'bg-white/5 text-text-secondary',
              )}
            >
              {p}
            </button>
          ))}
          <div className="w-px bg-border mx-0.5" />
          {([
            { k: 'xpts', l: 'xPts' }, { k: 'value', l: 'Value' }, { k: 'price', l: 'Price' }, { k: 'form', l: 'Form' },
          ] as const).map((s) => (
            <button
              key={s.k}
              onClick={() => setSortBy(s.k)}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-bold flex-shrink-0',
                sortBy === s.k ? 'bg-white/10 text-white' : 'bg-white/5 text-text-secondary',
              )}
            >
              {s.l}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5">
          {players.map((p) => (
            <button
              key={p.id}
              onClick={() => onPick(p)}
              className="w-full bg-white/5 rounded-xl p-2.5 flex items-center gap-3 text-left hover:bg-white/10"
            >
              <span className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{ backgroundColor: p.teamColor }}>
                {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{p.name} <span className="text-xs">{COUNTRIES[p.country]}</span></p>
                <p className="text-[10px] text-text-secondary truncate">{p.club} • {p.position} • {p.age}y • Fit {p.fitness}%</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded font-semibold">£{p.price}M</span>
                  <span className="text-[10px] text-success font-semibold">{p.expectedPoints} xPts</span>
                  {p.injuryStatus !== 'fit' && <span className="text-[10px] text-danger font-semibold">{p.injuryStatus === 'injured' ? 'INJ' : 'Doubt'}</span>}
                  {p.popularity > 80 && <span className="text-[10px] text-primary font-semibold">★</span>}
                </div>
              </div>
              <Plus size={18} className="text-primary flex-shrink-0" />
            </button>
          ))}
          {players.length === 0 && (
            <p className="text-center text-sm text-text-secondary py-8">No players match your filters.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
