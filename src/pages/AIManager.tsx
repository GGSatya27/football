import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Send, Sparkles, CloudRain, HeartPulse, PiggyBank, Star, Bot, User as UserIcon, ChevronRight, RefreshCw,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Player } from '../data/players';
import { PageContainer, Header } from '../components/Layout';
import { Card } from '../components/Card';
import { FootballPitch } from '../components/FootballPitch';
import { StatPill } from '../components/ui';
import { GenderToggle } from '../components/SportSelector';

interface Msg { role: 'ai' | 'user'; text: string; chips?: string[] }

const SUGGESTIONS = [
  'Build me a balanced squad',
  'Best captain under 10M',
  'Replace injured striker',
  'Optimize for rainy weather',
];

const CHIPS = [
  { label: 'Weather Impact', icon: CloudRain, color: 'text-blue-400' },
  { label: 'Injury Alert', icon: HeartPulse, color: 'text-danger' },
  { label: 'Budget Saver', icon: PiggyBank, color: 'text-success' },
  { label: 'Differential Pick', icon: Star, color: 'text-primary' },
];

function aiReply(prompt: string, gender: 'men' | 'women', players: Player[], compName: string): Msg {
  const p = prompt.toLowerCase();
  const label = gender === 'women' ? "Women's" : "Men's";
  const scope = compName || label + ' football';

  if (p.includes('captain')) {
    const cand = players.filter((pl) => pl.price < 10).sort((a, b) => b.expectedPoints - a.expectedPoints)[0];
    if (!cand) return { role: 'ai', text: 'No sub-£10M players in your current ' + scope + ' selection. Try widening the competition filter.' };
    const fdr = cand.fixtureDifficulty <= 2 ? 'favorable' : 'tricky';
    const upside = (cand.expectedPoints * 2).toFixed(1);
    return {
      role: 'ai',
      text: 'For ' + scope + ', under £10M, I would back ' + cand.name + '. ' + cand.expectedPoints + ' xPts vs a ' + fdr + ' fixture (FDR ' + cand.fixtureDifficulty + '/5), ' + cand.ownership + '% ownership, form reading ' + cand.form.join('-') + '. Captain score ' + cand.captainScore + '/100 and home rating ' + cand.homePerf + '/100. Double captain upside = ' + upside + ' pts.',
      chips: ['Set as Captain', 'Compare top 3'],
    };
  }
  if (p.includes('rain') || p.includes('weather')) {
    const weatherOps = [...players].sort((a, b) => b.weatherPerf - a.weatherPerf).slice(0, 3);
    return {
      role: 'ai',
      text: 'Wet conditions in ' + scope + ' favor shorter passing and set pieces. Top weather performers: ' + weatherOps.map((w) => w.name).join(', ') + '. I would favor set-piece takers and bench pacy wingers who rely on dry surface. Cross volume typically drops ~18% in rain.',
      chips: ['Apply changes', 'See weather report'],
    };
  }
  if (p.includes('injur')) {
    const injuries = players.filter((pl) => pl.injuryStatus !== 'fit');
    if (injuries.length === 0) return { role: 'ai', text: 'Your ' + scope + ' squad has no injury concerns. All starters are fit — good news for GW24.', chips: ['View squad'] };
    const listed = injuries.map((i) => i.name + ' (' + (i.injuryStatus === 'injured' ? 'OUT' : 'doubt') + ', ' + (i.injuryType || 'monitor') + ')').join('; ');
    return {
      role: 'ai',
      text: 'In ' + scope + ', ' + listed + '. Recommend covering the doubt with a bench option and avoiding the outright-injured player. Want me to suggest specific swaps?',
      chips: injuries.slice(0, 2).map((i) => 'Swap ' + i.name.split(' ').slice(-1)[0]),
    };
  }
  if (p.includes('balanced') || p.includes('squad') || p.includes('build')) {
    const top = players.slice(0, 1).map((x) => x.name).join(', ');
    return {
      role: 'ai',
      text: 'Balanced ' + scope + ' squad locked in: ' + players.length + ' eligible players, 4-3-3 with premium on top xPts (' + top + '), mid-tier creators, and budget defenders with high interception rates. Projected GW24 total ~68 pts with captain double. Bench has playable cover at every position.',
      chips: ['View squad', 'Optimize further'],
    };
  }
  if (p.includes('women') || p.includes("women's")) {
    return {
      role: 'ai',
      text: "Women's football mode active for " + scope + ". I have full player data including NWSL, WSL, Liga F, Frauen Bundesliga and more. You can ask me to build a Women's World Cup team, find the best women's midfielder under 9M, or optimize for a specific competition.",
      chips: ["Best women's captain", 'Differential pick', 'Budget gems'],
    };
  }
  const topName = players[0] ? players[0].name : 'N/A';
  const topPts = players[0] ? players[0].expectedPoints : 0;
  return {
    role: 'ai',
    text: 'I have analyzed your ' + scope + ' squad, fixtures and form. ' + players.length + ' eligible players in scope. Your top xPts is ' + topName + ' (' + topPts + ' xPts). Want captain advice, transfers, weather adjustments, or a differential pick?',
    chips: ['Suggest transfers', 'Differential pick', 'Weather report'],
  };
}

export function AIManager() {
  const nav = useNavigate();
  const {
    gender, competition, players, starters, formation, captain, viceCaptain, setCaptain,
    totalExpectedPoints, chemistry, budgetRemaining,
  } = useApp();

  const compName = competition?.name ?? '';
  const label = gender === 'women' ? "Women's" : "Men's";

  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', text: `Hey gaffer — I have crunched the numbers for ${compName || label} football GW24. Your squad is looking strong at ${totalExpectedPoints().toFixed(1)} projected points. Want to optimize captain, plan transfers, or adjust for weather?` },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const starterPlayers = starters
    .map((id) => players.find((p) => p.id === id))
    .filter(Boolean) as Player[];

  // Reset conversation when scope changes
  useEffect(() => {
    setMessages([
      { role: 'ai', text: `Switched to ${compName || label} football. ${players.length} players in scope. Ask me to build your squad, find a captain, or handle injuries.` },
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender, competition?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, aiReply(text, gender, players, compName)]);
      setTyping(false);
    }, 900);
  };

  const handleChip = (label: string) => {
    if (label === 'Set as Captain') {
      const cand = players.filter((pl) => pl.price < 10).sort((a, b) => b.expectedPoints - a.expectedPoints)[0];
      if (cand) {
        setCaptain(cand.id);
        setMessages((m) => [...m, { role: 'ai', text: `Done — ${cand.name} is now your ${gender === 'women' ? "Women's" : "Men's"} captain for GW24. Projected points boosted by 2x multiplier.` }]);
      }
    } else if (label.startsWith('Swap ')) {
      send(`Replace ${label.replace('Swap ', '')} with a fit alternative`);
    } else {
      send(label);
    }
  };

  return (
    <PageContainer>
      <Header
        title="AI Manager"
        subtitle={`${label} • ${competition ? competition.name : 'All competitions'}`}
        right={
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10">
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs font-bold text-primary">Pro</span>
          </div>
        }
      />

      {/* Gender toggle */}
      <div className="px-5 mb-4">
        <GenderToggle />
      </div>

      {/* Chat section */}
      <div className="px-5 mb-4">
        <div className="bg-card border border-border rounded-card p-3 h-[260px] flex flex-col">
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.role === 'ai' ? 'bg-primary/15' : 'bg-white/10'
                }`}>
                  {m.role === 'ai' ? <Bot size={15} className="text-primary" /> : <UserIcon size={15} className="text-white" />}
                </div>
                <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.role === 'ai' ? 'bg-white/5 rounded-tl-sm' : 'bg-primary text-black rounded-tr-sm font-medium'
                }`}>
                  <p className="leading-relaxed">{m.text}</p>
                  {m.chips && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {m.chips.map((c) => (
                        <button
                          key={c}
                          onClick={() => handleChip(c)}
                          className="text-[11px] bg-primary/15 text-primary px-2.5 py-1 rounded-lg font-semibold"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                  <Bot size={15} className="text-primary" />
                </div>
                <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-text-secondary"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mx-1 px-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-[11px] whitespace-nowrap bg-white/5 border border-border rounded-lg px-3 py-1.5 text-text-secondary"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder={`Ask about ${label} football...`}
              className="flex-1 bg-white/5 border border-border rounded-xl px-3.5 py-2.5 text-sm focus:border-primary outline-none"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => send(input)}
              className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center flex-shrink-0"
            >
              <Send size={17} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Floating chips */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CHIPS.map((c) => (
            <button
              key={c.label}
              onClick={() => send(c.label)}
              className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-2 flex-shrink-0"
            >
              <c.icon size={14} className={c.color} />
              <span className="text-xs font-semibold">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pitch + stats */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold">Your {label} Pitch</h2>
          <button onClick={() => nav('/team')} className="text-xs text-primary flex items-center gap-1">
            Edit team <ChevronRight size={12} />
          </button>
        </div>
        <Card className="p-4">
          <FootballPitch starters={starterPlayers} formation={formation} captainId={captain} viceId={viceCaptain} />
          <div className="grid grid-cols-4 gap-2 mt-3">
            <StatPill label="xPts" value={totalExpectedPoints().toFixed(1)} accent="text-success" />
            <StatPill label="Chem" value={`${chemistry()}%`} accent="text-primary" />
            <StatPill label="Budget" value={`£${budgetRemaining().toFixed(1)}M`} />
            <StatPill label="Form" value={formation} />
          </div>
        </Card>
      </div>

      {/* Insights list */}
      <div className="px-5 mb-5">
        <div className="space-y-2">
          {[
            { icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-400/10', title: `Weather: Rain expected at ${compName ? 'matchday venues' : '3 venues'}`, desc: 'Cross volume likely down 18%. Favors set-piece takers.' },
            { icon: HeartPulse, color: 'text-danger', bg: 'bg-danger/10', title: `Injury: ${players.filter((p) => p.injuryStatus !== 'fit').length} players flagged in scope`, desc: 'Check the Injury Watch list before deadline.' },
            { icon: PiggyBank, color: 'text-success', bg: 'bg-success/10', title: 'Budget Saver available', desc: 'High budgetValue picks can fund a premium upgrade.' },
            { icon: Star, color: 'text-primary', bg: 'bg-primary/10', title: 'Differential: low-ownership high-xPts', desc: 'Rank-rise potential with under 25% ownership picks.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-card border border-border rounded-card p-3.5 flex gap-3"
            >
              <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <item.icon size={17} className={item.color} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{item.title}</p>
                <p className="text-[11px] text-text-secondary mt-0.5">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-5 mb-5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => nav('/insights')}
          className="w-full bg-card border border-border rounded-card p-4 flex items-center gap-3"
        >
          <RefreshCw size={18} className="text-primary" />
          <div className="flex-1 text-left">
            <p className="text-sm font-bold">Full {label} Insights Dashboard</p>
            <p className="text-[11px] text-text-secondary">Captain picks, risk analysis, fixtures</p>
          </div>
          <ChevronRight size={16} className="text-text-secondary" />
        </motion.button>
      </div>
    </PageContainer>
  );
}
