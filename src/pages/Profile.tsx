import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Coins, Zap, Trophy, Target, Star, Settings, LogOut, ChevronRight,
  Award, Flame, Crown, TrendingUp, Shield, Trash2, FolderOpen,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageContainer, Header } from '../components/Layout';
import { Card } from '../components/Card';
import { Avatar } from '../components/ui';
import { Button } from '../components/Button';

const badges = [
  { icon: Crown, label: 'Champion', color: 'text-primary', bg: 'bg-primary/15' },
  { icon: Flame, label: '7-Day Streak', color: 'text-danger', bg: 'bg-danger/15' },
  { icon: Target, label: 'Sharp Shooter', color: 'text-success', bg: 'bg-success/15' },
  { icon: Star, label: 'Top 1%', color: 'text-primary', bg: 'bg-primary/15' },
  { icon: Award, label: 'Tactician', color: 'text-white', bg: 'bg-white/10' },
  { icon: Shield, label: 'Clean Sheet', color: 'text-success', bg: 'bg-success/15' },
];

const seasons = [
  { season: '2023/24', rank: 47, points: 2148, wins: 12, best: 3 },
  { season: '2022/23', rank: 124, points: 1895, wins: 8, best: 12 },
];

export function Profile() {
  const nav = useNavigate();
  const { user, coins, xp, level, logout, savedTeams, loadTeam, deleteTeam } = useApp();

  const stats = [
    { label: 'Total Points', value: '4,043', icon: TrendingUp },
    { label: 'Contest Wins', value: '20', icon: Trophy },
    { label: 'Best Rank', value: '#3', icon: Crown },
    { label: 'Avg Score', value: '54', icon: Target },
  ];

  return (
    <PageContainer>
      <Header title="Profile" right={<Settings size={18} className="text-text-secondary" />} />

      {/* Profile card */}
      <div className="px-5 mb-4">
        <Card className="p-5">
          <div className="flex items-center gap-4 mb-4">
            <Avatar name={user?.name || 'Player'} size={64} />
            <div className="flex-1">
              <h2 className="text-lg font-bold">{user?.name || 'Player'}</h2>
              <p className="text-xs text-text-secondary">{user?.email || 'Guest account'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-primary/15 text-primary font-bold px-2 py-0.5 rounded">Level {level}</span>
                <span className="text-[10px] bg-white/10 font-semibold px-2 py-0.5 rounded">Pro Member</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-text-secondary flex items-center gap-1"><Zap size={12} className="text-primary" /> {xp.toLocaleString()} XP</span>
            <span className="text-text-secondary">Level {level + 1} at {(level + 1) * 500} XP</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(xp % 500) / 5}%` }} transition={{ duration: 0.8 }} className="h-full bg-primary rounded-full" />
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                <Coins size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary">Coin Balance</p>
                <p className="text-sm font-bold">{coins.toLocaleString()}</p>
              </div>
            </div>
            <Button size="sm" onClick={() => nav('/contests')}>Use Coins</Button>
          </div>
        </Card>
      </div>

      {/* My Saved Teams */}
      <div className="px-5 mb-4">
        <h2 className="text-base font-bold mb-3">My Saved Teams</h2>
        {savedTeams.length === 0 ? (
          <Card className="p-5 text-center">
            <FolderOpen size={24} className="text-text-secondary mx-auto mb-2" />
            <p className="text-sm text-text-secondary">No saved teams yet</p>
            <Button size="sm" variant="secondary" className="mt-3" onClick={() => nav('/team')}>Build a Team</Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {savedTeams.map((t, i) => (
              <Card key={i} className="p-3 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.gender === 'women' ? 'bg-pink-500/20' : 'bg-primary/15'}`}>
                  {t.gender === 'women' ? <Star size={16} className="text-pink-400" /> : <Trophy size={16} className="text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{t.name}</p>
                  <p className="text-[11px] text-text-secondary">{t.gender === 'women' ? "Women's" : "Men's"} • {t.formation} • {t.starters.length} players</p>
                </div>
                <button onClick={() => { loadTeam(t); nav('/team'); }} className="text-xs text-primary font-bold px-2 py-1">Load</button>
                <button onClick={() => deleteTeam(i)} className="text-danger"><Trash2 size={15} /></button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-2 gap-2">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="p-3.5">
                <s.icon size={18} className="text-primary mb-2" />
                <p className="text-xl font-black">{s.value}</p>
                <p className="text-[11px] text-text-secondary">{s.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="px-5 mb-4">
        <h2 className="text-base font-bold mb-3">Achievements</h2>
        <div className="grid grid-cols-3 gap-2">
          {badges.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-3 flex flex-col items-center text-center"
            >
              <div className={`w-10 h-10 rounded-full ${b.bg} flex items-center justify-center mb-1.5`}>
                <b.icon size={18} className={b.color} />
              </div>
              <p className="text-[10px] font-semibold leading-tight">{b.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Season history */}
      <div className="px-5 mb-4">
        <h2 className="text-base font-bold mb-3">Season History</h2>
        <div className="space-y-2">
          {seasons.map((s) => (
            <Card key={s.season} className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold">{s.season}</p>
                <span className="text-xs text-text-secondary">Overall Rank</span>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-black text-primary">#{s.rank}</p>
                <div className="flex gap-4 text-right">
                  <div>
                    <p className="text-[10px] text-text-secondary">Points</p>
                    <p className="text-sm font-bold">{s.points.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary">Wins</p>
                    <p className="text-sm font-bold">{s.wins}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary">Best GW</p>
                    <p className="text-sm font-bold">#{s.best}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="px-5 mb-5">
        <h2 className="text-base font-bold mb-3">Settings</h2>
        <Card className="divide-y divide-border">
          {['Account', 'Notifications', 'Privacy', 'Help & Support', 'About Statify AI'].map((s) => (
            <button key={s} className="w-full flex items-center justify-between p-3.5 text-sm font-semibold">
              {s} <ChevronRight size={16} className="text-text-secondary" />
            </button>
          ))}
        </Card>
      </div>

      <div className="px-5 mb-5">
        <Button variant="danger" size="lg" className="w-full" onClick={logout}>
          <LogOut size={18} /> Sign Out
        </Button>
      </div>
    </PageContainer>
  );
}
