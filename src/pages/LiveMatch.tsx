import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Crown, TrendingUp } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageContainer } from '../components/Layout';
import { Card } from '../components/Card';
import { LiveBadge } from '../components/ui';
import { useCountUp } from '../hooks/useCountUp';
import { GenderToggle } from '../components/SportSelector';

interface LiveMatch {
  id: number;
  home: string; homeShort: string; homeColor: string;
  away: string; awayShort: string; awayColor: string;
  scoreHome: number; scoreAway: number;
  minute: number;
  possessionHome: number;
  cardsHome: number; cardsAway: number;
}

const MEN_MATCHES: LiveMatch[] = [
  { id: 1, home: 'Liverpool', homeShort: 'LIV', homeColor: '#C8102E', away: 'Arsenal', awayShort: 'ARS', awayColor: '#EF0107', scoreHome: 2, scoreAway: 1, minute: 67, possessionHome: 58, cardsHome: 1, cardsAway: 2 },
  { id: 2, home: 'Man City', homeShort: 'MCI', homeColor: '#6CABDD', away: 'Spurs', awayShort: 'TOT', awayColor: '#132257', scoreHome: 1, scoreAway: 1, minute: 34, possessionHome: 64, cardsHome: 0, cardsAway: 1 },
  { id: 3, home: 'Chelsea', homeShort: 'CHE', homeColor: '#034694', away: 'Newcastle', awayShort: 'NEW', awayColor: '#241F20', scoreHome: 0, scoreAway: 0, minute: 12, possessionHome: 52, cardsHome: 0, cardsAway: 0 },
];

const WOMEN_MATCHES: LiveMatch[] = [
  { id: 11, home: 'Chelsea Women', homeShort: 'CHE', homeColor: '#034694', away: 'Arsenal Women', awayShort: 'ARS', awayColor: '#EF0107', scoreHome: 1, scoreAway: 1, minute: 54, possessionHome: 55, cardsHome: 1, cardsAway: 0 },
  { id: 12, home: 'Barcelona Women', homeShort: 'BAR', homeColor: '#A50044', away: 'Lyon Women', awayShort: 'LYO', awayColor: '#0066B2', scoreHome: 2, scoreAway: 0, minute: 71, possessionHome: 62, cardsHome: 0, cardsAway: 1 },
  { id: 13, home: 'Portland Thorns', homeShort: 'POR', homeColor: '#0057B8', away: 'Gotham FC', awayShort: 'GOT', awayColor: '#003F87', scoreHome: 0, scoreAway: 0, minute: 23, possessionHome: 48, cardsHome: 0, cardsAway: 0 },
];

export function LiveMatch() {
  const nav = useNavigate();
  const { gender, captain, players } = useApp();
  const [matchGender, setMatchGender] = useState<'men' | 'women'>(gender);
  const [matches, setMatches] = useState(matchGender === 'men' ? MEN_MATCHES : WOMEN_MATCHES);
  const [active, setActive] = useState(0);
  const [fantasyPts, setFantasyPts] = useState(matchGender === 'men' ? 42 : 38);
  const [rank, setRank] = useState(matchGender === 'men' ? 47 : 38);

  const ptsAnim = useCountUp(fantasyPts);
  const match = matches[active];

  const captainPlayer = players.find((p) => p.id === captain);
  const captainPts = captainPlayer ? Math.round(captainPlayer.expectedPoints * 2 * (match.minute / 90)) : 0;

  // when global gender changes, switch match view + reset
  useEffect(() => {
    setMatchGender(gender);
    setMatches(gender === 'men' ? MEN_MATCHES : WOMEN_MATCHES);
    setActive(0);
    setFantasyPts(gender === 'men' ? 42 : 38);
    setRank(gender === 'men' ? 47 : 38);
  }, [gender]);

  useEffect(() => {
    const t = setInterval(() => {
      setMatches((prev) => prev.map((m) => ({ ...m, minute: Math.min(90, m.minute + 1) })));
      if (Math.random() > 0.6) setFantasyPts((p) => p + Math.floor(Math.random() * 5));
      if (Math.random() > 0.8) setRank((r) => Math.max(1, r - 1));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const label = matchGender === 'women' ? "Women's" : "Men's";

  return (
    <PageContainer showNav={false}>
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-extrabold flex items-center gap-2">Live Match <LiveBadge /></h1>
          <p className="text-xs text-text-secondary">{label} • Gameweek 24</p>
        </div>
      </div>

      {/* Gender toggle */}
      <div className="px-5 mb-3">
        <GenderToggle />
      </div>

      {/* Match selector */}
      <div className="px-5 mb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {matches.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setActive(i)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${
              i === active ? 'bg-primary text-black' : 'bg-card border border-border'
            }`}
          >
            {m.homeShort} vs {m.awayShort}
          </button>
        ))}
      </div>

      {/* Scoreboard */}
      <div className="px-5 mb-4">
        <Card className="p-5">
          <div className="text-center mb-3">
            <span className="text-xs text-text-secondary">{match.minute}'</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-lg" style={{ backgroundColor: match.homeColor }}>
                {match.homeShort}
              </div>
              <p className="text-sm font-bold text-center">{match.home}</p>
            </div>
            <div className="flex items-center gap-3 px-4">
              <motion.span key={match.scoreHome} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="text-4xl font-black">
                {match.scoreHome}
              </motion.span>
              <span className="text-2xl text-text-secondary">:</span>
              <motion.span key={match.scoreAway} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="text-4xl font-black">
                {match.scoreAway}
              </motion.span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-lg" style={{ backgroundColor: match.awayColor }}>
                {match.awayShort}
              </div>
              <p className="text-sm font-bold text-center">{match.away}</p>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="font-semibold">{match.possessionHome}%</span>
              <span className="text-text-secondary">Possession</span>
              <span className="font-semibold">{100 - match.possessionHome}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden flex">
              <motion.div initial={{ width: 0 }} animate={{ width: `${match.possessionHome}%` }} className="bg-primary h-full" />
              <div className="bg-white/20 h-full flex-1" />
            </div>
          </div>
          <div className="flex justify-around mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-[10px] text-text-secondary">Cards</p>
              <p className="text-sm font-bold">{'🟨'.repeat(match.cardsHome) || '—'}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-text-secondary">Shots</p>
              <p className="text-sm font-bold">{12 + ((match.minute / 3) | 0)} - {8 + ((match.minute / 4) | 0)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-text-secondary">Cards</p>
              <p className="text-sm font-bold">{'🟨'.repeat(match.cardsAway) || '—'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Fantasy performance */}
      <div className="px-5 mb-4">
        <Card className="p-4">
          <h2 className="text-sm font-bold mb-3">Your {label} Fantasy Performance</h2>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-[10px] text-text-secondary">Live Points</p>
              <motion.p key={fantasyPts} initial={{ scale: 1.3, color: '#22C55E' }} animate={{ scale: 1, color: '#ffffff' }} className="text-2xl font-black">
                {ptsAnim.toFixed(0)}
              </motion.p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-[10px] text-text-secondary">Rank</p>
              <p className="text-2xl font-black text-primary">#{rank}</p>
              <p className="text-[10px] text-success flex items-center justify-center gap-0.5">
                <TrendingUp size={10} /> rising
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-[10px] text-text-secondary">Captain</p>
              <p className="text-2xl font-black text-primary">{captainPts}</p>
            </div>
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto no-scrollbar">
            {[
              { t: `${match.minute}'`, p: captainPlayer?.name, e: 'Goal', pts: +8, cap: true },
              { t: `${match.minute - 4}'`, p: players[1]?.name, e: 'Clean Bonus', pts: +3 },
              { t: `${match.minute - 7}'`, p: players[2]?.name, e: 'Assist', pts: +5 },
              { t: `${match.minute - 12}'`, p: players[3]?.name, e: 'Tackle Bonus', pts: +1 },
            ].map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-xs"
              >
                <span className="text-text-secondary w-10">{ev.t}</span>
                <span className="font-semibold flex-1 truncate">
                  {ev.p} {ev.cap && <Crown size={10} className="inline text-primary" />}
                </span>
                <span className="text-text-secondary">{ev.e}</span>
                <span className={`font-bold ${ev.pts > 0 ? 'text-success' : 'text-danger'}`}>
                  {ev.pts > 0 ? '+' : ''}{ev.pts}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Captain performance */}
      {captainPlayer && (
        <div className="px-5 mb-5">
          <Card className="p-4">
            <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Crown size={14} className="text-primary" /> Captain: {captainPlayer.name}
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white" style={{ backgroundColor: captainPlayer.teamColor }}>
                {captainPlayer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-secondary">Live fantasy pts (2x)</span>
                  <span className="text-lg font-black text-success">{captainPts}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${(captainPts / 20) * 100}%` }} className="h-full bg-success rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
