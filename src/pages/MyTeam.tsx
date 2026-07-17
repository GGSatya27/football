import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ChevronDown, Crown, Sparkles, Star, ArrowUpDown, X, Bot, Save,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { FORMATIONS, Formation, Player } from '../data/players';
import { PageContainer, Header } from '../components/Layout';
import { Card } from '../components/Card';
import { FootballPitch } from '../components/FootballPitch';
import { PlayerCard } from '../components/PlayerCard';
import { PlayerDetail } from '../components/PlayerDetail';
import { StatPill } from '../components/ui';
import { Button } from '../components/Button';
import { GenderToggle } from '../components/SportSelector';

export function MyTeam() {
  const nav = useNavigate();
  const {
    gender, competition, players,
    starters, bench, formation, setFormation,
    captain, viceCaptain, setCaptain, setViceCaptain,
    swapPlayer, budgetRemaining, totalExpectedPoints, chemistry,
    saveCurrentTeam, savedTeams, loadTeam, deleteTeam,
  } = useApp();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showFormation, setShowFormation] = useState(false);
  const [showCaptain, setShowCaptain] = useState<'captain' | 'vice' | null>(null);
  const [swapMode, setSwapMode] = useState<number | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  const label = gender === 'women' ? "Women's" : "Men's";
  const starterPlayers = starters.map((id) => players.find((p) => p.id === id)!).filter(Boolean) as Player[];
  const benchPlayers = bench.map((id) => players.find((p) => p.id === id)!).filter(Boolean) as Player[];
  const selectedPlayer = players.find((p) => p.id === selectedId);

  const handlePitchSelect = (id: number) => {
    if (swapMode !== null) {
      swapPlayer(swapMode, id);
      setSwapMode(null);
    } else {
      setSelectedId(id);
    }
  };

  const handleBenchClick = (id: number) => {
    if (swapMode !== null) {
      swapPlayer(swapMode, id);
      setSwapMode(null);
    } else {
      setSelectedId(id);
    }
  };

  const optimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      const sorted = [...starters].sort((a, b) => {
        const pa = players.find((p) => p.id === a);
        const pb = players.find((p) => p.id === b);
        return (pb?.expectedPoints ?? 0) - (pa?.expectedPoints ?? 0);
      });
      setCaptain(sorted[0]);
      setViceCaptain(sorted[1]);
      setOptimizing(false);
    }, 1200);
  };

  const saveTeam = () => {
    if (!teamName.trim()) return;
    saveCurrentTeam(teamName);
    setTeamName('');
    setShowSave(false);
  };

  return (
    <PageContainer>
      <Header
        title="My Team"
        subtitle={`${label} • ${competition ? competition.name : 'All competitions'}`}
        right={
          <button onClick={() => nav('/transfers')} className="text-xs text-primary">
            Transfers
          </button>
        }
      />

      {/* Gender toggle */}
      <div className="px-5 mb-3">
        <GenderToggle />
      </div>

      {/* Stats strip */}
      <div className="px-5 mb-3 grid grid-cols-4 gap-2">
        <StatPill label="xPts" value={totalExpectedPoints().toFixed(1)} accent="text-success" />
        <StatPill label="Budget" value={`£${budgetRemaining().toFixed(1)}M`} accent={budgetRemaining() < 0 ? 'text-danger' : 'text-primary'} />
        <StatPill label="Chem" value={`${chemistry()}%`} accent="text-primary" />
        <StatPill label="Players" value={starters.length + bench.length} />
      </div>

      {/* Formation selector + saved teams */}
      <div className="px-5 mb-3 flex items-center gap-2">
        <button
          onClick={() => setShowFormation(!showFormation)}
          className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 text-sm font-semibold"
        >
          {formation} <ChevronDown size={14} className={showFormation ? 'rotate-180' : ''} />
        </button>
        <button
          onClick={() => setShowSave(true)}
          className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-3 py-2 text-xs font-semibold"
        >
          <Save size={14} className="text-primary" /> Save
        </button>
        <button
          onClick={() => setShowSaved(!showSaved)}
          className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-3 py-2 text-xs font-semibold"
        >
          Teams ({savedTeams.length})
        </button>
        <span className="text-xs text-text-secondary flex-1 ml-1">
          {swapMode !== null ? 'Select a player to swap with' : 'Tap a player to view or swap'}
        </span>
        {swapMode !== null && (
          <button onClick={() => setSwapMode(null)} className="text-xs text-danger flex items-center gap-1">
            <X size={12} /> Cancel
          </button>
        )}
      </div>

      <AnimatePresence>
        {showFormation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 mb-3 overflow-hidden"
          >
            <div className="flex gap-2 flex-wrap">
              {FORMATIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => { setFormation(f as Formation); setShowFormation(false); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                    formation === f ? 'bg-primary text-black border-primary' : 'bg-card border-border'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved teams */}
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 mb-3 overflow-hidden"
          >
            <Card className="p-3">
              {savedTeams.length === 0 ? (
                <p className="text-xs text-text-secondary text-center py-2">No saved teams yet. Build a team and hit Save.</p>
              ) : (
                <div className="space-y-2">
                  {savedTeams.map((t, i) => {
                    const comp = t.leagueId;
                    return (
                      <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.gender === 'women' ? 'bg-pink-500/20' : 'bg-primary/15'}`}>
                          {t.gender === 'women' ? <Star size={14} className="text-pink-400" /> : <Sparkles size={14} className="text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{t.name}</p>
                          <p className="text-[11px] text-text-secondary">{t.gender === 'women' ? "Women's" : "Men's"} • {comp} • {t.formation}</p>
                        </div>
                        <button onClick={() => { loadTeam(t); setShowSaved(false); }} className="text-xs text-primary font-bold px-2 py-1">Load</button>
                        <button onClick={() => deleteTeam(i)} className="text-xs text-danger font-bold px-2 py-1">Del</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pitch */}
      <div className="px-5 mb-4">
        <Card className="p-4">
          <FootballPitch
            starters={starterPlayers}
            formation={formation}
            captainId={captain}
            viceId={viceCaptain}
            onSelect={handlePitchSelect}
            selectedId={swapMode}
          />
          <div className="flex items-center justify-around mt-3 pt-3 border-t border-border">
            <button
              onClick={() => setShowCaptain('captain')}
              className="flex items-center gap-1.5 text-xs font-bold text-primary"
            >
              <Crown size={14} /> Captain: {players.find((p) => p.id === captain)?.name.split(' ').slice(-1)[0] || '-'}
            </button>
            <button
              onClick={() => setShowCaptain('vice')}
              className="flex items-center gap-1.5 text-xs font-bold"
            >
              <Star size={14} /> Vice: {players.find((p) => p.id === viceCaptain)?.name.split(' ').slice(-1)[0] || '-'}
            </button>
          </div>
        </Card>
      </div>

      {/* Captain modal */}
      <AnimatePresence>
        {showCaptain && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowCaptain(null)}
            className="fixed inset-0 z-50 bg-black/70 flex items-end max-w-md mx-auto"
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full rounded-t-card p-5 max-h-[70vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">{showCaptain === 'captain' ? 'Select Captain' : 'Select Vice Captain'}</h3>
                <button onClick={() => setShowCaptain(null)}><X size={18} /></button>
              </div>
              <div className="space-y-2">
                {starterPlayers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (showCaptain === 'captain') setCaptain(p.id);
                      else setViceCaptain(p.id);
                      setShowCaptain(null);
                    }}
                    className="w-full flex items-center gap-3 bg-white/5 rounded-xl p-2.5 text-left"
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: p.teamColor }}>
                      {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{p.name}</p>
                      <p className="text-[11px] text-text-secondary">{p.expectedPoints} xPts • £{p.price}M • {p.club}</p>
                    </div>
                    {(showCaptain === 'captain' ? captain === p.id : viceCaptain === p.id) && (
                      <Check size={18} className="text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bench */}
      <div className="px-5 mb-4">
        <h2 className="text-base font-bold mb-3">Bench</h2>
        <div className="grid grid-cols-1 gap-2">
          {benchPlayers.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              onClick={() => handleBenchClick(p.id)}
              selected={swapMode === p.id}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 mb-5 space-y-2">
        <Button onClick={optimize} size="lg" className="w-full" disabled={optimizing}>
          {optimizing ? (
            <><Bot size={18} className="animate-pulse" /> Optimizing...</>
          ) : (
            <><Sparkles size={18} /> Optimize Squad</>
          )}
        </Button>
        <Button
          onClick={() => setSwapMode(selectedId || starters[0])}
          variant="secondary" size="lg" className="w-full"
        >
          <ArrowUpDown size={18} /> Swap Player
        </Button>
      </div>

      {/* Save team modal */}
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
                <h3 className="font-bold">Save {label} Team</h3>
                <button onClick={() => setShowSave(false)}><X size={18} /></button>
              </div>
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder={`e.g. ${label} GW24 Squad`}
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none mb-4"
              />
              <Button onClick={saveTeam} size="lg" className="w-full" disabled={!teamName.trim()}>
                <Save size={16} /> Save Team
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player detail */}
      <AnimatePresence>
        {selectedPlayer && (
          <PlayerDetail
            player={selectedPlayer}
            onClose={() => setSelectedId(null)}
            isOwned
          />
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
