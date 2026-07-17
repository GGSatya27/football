import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Star, Gem, AlertTriangle, CloudRain, Calendar, HeartPulse,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageContainer } from '../components/Layout';
import { Card, SectionTitle } from '../components/Card';
import { GenderToggle } from '../components/SportSelector';

export function Insights() {
  const nav = useNavigate();
  const { gender, competition, players } = useApp();
  const label = gender === 'women' ? "Women's" : "Men's";
  const scope = competition ? competition.name : `${label} football`;

  const bestCaptains = [...players].sort((a, b) => b.expectedPoints - a.expectedPoints).slice(0, 3);
  const differentials = [...players].filter((p) => p.ownership < 25).sort((a, b) => b.expectedPoints - a.expectedPoints).slice(0, 3);
  const budgetGems = [...players].sort((a, b) => b.budgetValue - a.budgetValue).slice(0, 3);
  const injuries = players.filter((p) => p.injuryStatus !== 'fit');

  const graphData = [42, 56, 38, 68, 51, 74, 62];

  return (
    <PageContainer showNav={false}>
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-extrabold">AI Insights</h1>
          <p className="text-xs text-text-secondary">{label} • {competition ? competition.short : 'All'}</p>
        </div>
      </div>

      <div className="px-5 mb-4">
        <GenderToggle />
      </div>

      {/* xPts Graph */}
      <div className="px-5 mb-4">
        <Card className="p-4">
          <SectionTitle title={`${label} xPts Trend`} action={<span className="text-xs text-text-secondary">Last 7 GWs</span>} />
          <div className="flex items-end justify-between gap-2 h-32">
            {graphData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold">{v}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / 80) * 100}%` }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="w-full bg-primary rounded-t-md"
                  style={{ minHeight: 4 }}
                />
                <span className="text-[9px] text-text-secondary">GW{24 - 6 + i}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Best Captain */}
      <div className="px-5 mb-4">
        <SectionTitle title={`Best ${label} Captain Picks`} />
        <div className="space-y-2">
          {bestCaptains.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center font-black text-primary text-sm">
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{p.name}</p>
                  <p className="text-[11px] text-text-secondary">{p.club} • {p.ownership}% owned • {p.league}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-success">{p.expectedPoints}</p>
                  <p className="text-[10px] text-text-secondary">xPts (2x = {(p.expectedPoints * 2).toFixed(1)})</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Differential Picks */}
      <div className="px-5 mb-4">
        <SectionTitle title={`${label} Differential Picks`} action={<Star size={14} className="text-primary" />} />
        <div className="grid grid-cols-1 gap-2">
          {differentials.map((p) => (
            <Card key={p.id} className="p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: p.teamColor }}>
                {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{p.name}</p>
                <p className="text-[11px] text-text-secondary">Low ownership {p.ownership}% • {p.league} — rank rise potential</p>
              </div>
              <span className="text-sm font-bold text-primary">{p.expectedPoints} xPts</span>
            </Card>
          ))}
          {differentials.length === 0 && <p className="text-xs text-text-secondary text-center py-4">No differentials in scope.</p>}
        </div>
      </div>

      {/* Budget Gems */}
      <div className="px-5 mb-4">
        <SectionTitle title={`${label} Budget Gems`} action={<Gem size={14} className="text-success" />} />
        <div className="grid grid-cols-3 gap-2">
          {budgetGems.map((p) => (
            <Card key={p.id} className="p-3 text-center">
              <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-white text-xs mb-1.5" style={{ backgroundColor: p.teamColor }}>
                {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <p className="text-xs font-bold truncate">{p.name.split(' ').slice(-1)}</p>
              <p className="text-[10px] text-text-secondary">£{p.price}M</p>
              <p className="text-sm font-bold text-success">{p.expectedPoints}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="px-5 mb-4">
        <SectionTitle title={`${label} Risk Analysis`} action={<AlertTriangle size={14} className="text-danger" />} />
        <Card className="p-4 space-y-3">
          {[
            { label: 'Captain Risk', value: 22, color: 'bg-success', desc: 'Top pick fixture difficulty low' },
            { label: 'Injury Risk', value: injuries.length > 2 ? 55 : 30, color: injuries.length > 2 ? 'bg-danger' : 'bg-amber-500', desc: `${injuries.length} players flagged in scope` },
            { label: 'Rotation Risk', value: 30, color: 'bg-amber-500', desc: 'Cup competition rotation possible' },
            { label: 'Form Risk', value: 18, color: 'bg-success', desc: 'Squad form trending up' },
          ].map((r) => (
            <div key={r.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold">{r.label}</span>
                <span className="text-text-secondary">{r.value}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${r.value}%` }} className={`h-full ${r.color}`} />
              </div>
              <p className="text-[10px] text-text-secondary mt-0.5">{r.desc}</p>
            </div>
          ))}
        </Card>
      </div>

      {/* Weather + Fixture difficulty */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <Card className="p-4">
            <CloudRain size={18} className="text-blue-400 mb-2" />
            <p className="text-sm font-bold">Weather Impact</p>
            <p className="text-[11px] text-text-secondary mt-1">Rain at 3 venues. Cross volume -18%. Favors set-piece takers in {scope}.</p>
          </Card>
          <Card className="p-4">
            <Calendar size={18} className="text-primary mb-2" />
            <p className="text-sm font-bold">Fixture Difficulty</p>
            <p className="text-[11px] text-text-secondary mt-1">Avg rating 2.8/5. Home fixtures favorable for top picks.</p>
          </Card>
        </div>
      </div>

      {/* Injury Watch */}
      <div className="px-5 mb-5">
        <SectionTitle title={`${label} Injury Watch`} action={<HeartPulse size={14} className="text-danger" />} />
        <div className="space-y-2">
          {injuries.map((p) => (
            <Card key={p.id} className="p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: p.teamColor }}>
                {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{p.name}</p>
                <p className="text-[11px] text-text-secondary">{p.club} • {p.injuryType || 'monitor'}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                p.injuryStatus === 'injured' ? 'bg-danger/20 text-danger' : 'bg-amber-500/20 text-amber-500'
              }`}>
                {p.injuryStatus === 'injured' ? 'OUT' : 'DOUBT'}
              </span>
            </Card>
          ))}
          {injuries.length === 0 && <p className="text-xs text-text-secondary text-center py-4">No injuries in {scope}. All clear!</p>}
        </div>
      </div>
    </PageContainer>
  );
}
