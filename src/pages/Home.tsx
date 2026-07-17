import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell, Coins, Zap, TrendingUp, Users, Sparkles, Trophy, Radio,
  Target, Gift, Brain, ArrowRight, Crown, Flame, Clapperboard,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PageContainer } from '../components/Layout';
import { Card, SectionTitle } from '../components/Card';
import { Avatar, ProgressBar, StatPill } from '../components/ui';
import { FootballPitch } from '../components/FootballPitch';
import { GenderToggle, CompetitionSelect } from '../components/SportSelector';
import { useCountUp } from '../hooks/useCountUp';
import { COUNTRIES } from '../data/players';

export function Home() {
  const nav = useNavigate();
  const {
    user, coins, xp, level, gender, competition,
    starters, formation, captain, viceCaptain, totalExpectedPoints, budgetRemaining,
    players,
  } = useApp();
  const pts = useCountUp(totalExpectedPoints());
  const weeklyXp = xp % 500;

  // gender-aware derived data
  const featured = [...players].sort((a, b) => b.expectedPoints - a.expectedPoints).slice(0, 3);
  const trending = [...players].sort((a, b) => b.ownership - a.ownership).slice(0, 4);
  const isWomen = gender === 'women';

  const quickActions = [
    { label: 'Build Team', icon: Users, to: '/team', color: 'text-primary' },
    { label: 'Custom', icon: Clapperboard, to: '/builder', color: 'text-primary' },
    { label: 'Transfers', icon: TrendingUp, to: '/transfers', color: 'text-primary' },
    { label: 'Live Matches', icon: Radio, to: '/live', color: 'text-danger' },
  ];

  const rewards = [
    { label: 'Weekly Challenge', icon: Target, sub: 'Earn 500 XP', progress: 60 },
    { label: 'Prediction', icon: Zap, sub: 'Gameweek 24', progress: 0 },
    { label: 'Daily Quiz', icon: Brain, sub: '+100 coins', progress: 40 },
    { label: 'Streak', icon: Flame, sub: '7 days', progress: 70 },
    { label: 'Spin Wheel', icon: Gift, sub: 'Free spin', progress: 100 },
  ];

  const contests = [
    { name: isWomen ? 'WSL Mega Contest' : 'Mega Contest', prize: isWomen ? '₹5,00,000' : '₹10,00,000', spots: isWomen ? '210 / 250' : '450 / 500' },
    { name: 'Head-to-Head', prize: '₹1,000', spots: '1 / 2' },
    { name: isWomen ? 'Private W League' : 'Private League', prize: '₹50,000', spots: '12 / 20' },
  ];

  const leaderboard = isWomen
    ? [
        { rank: 1, name: 'Sara W.', pts: 1190, avatar: 'SW' },
        { rank: 2, name: 'Elena R.', pts: 1142, avatar: 'ER' },
        { rank: 3, name: 'Yuki T.', pts: 1098, avatar: 'YT' },
        { rank: 38, name: 'You', pts: 856, avatar: 'AM', isUser: true },
      ]
    : [
        { rank: 1, name: 'Rohit K.', pts: 1245, avatar: 'RK' },
        { rank: 2, name: 'Sarah L.', pts: 1198, avatar: 'SL' },
        { rank: 3, name: 'Marco P.', pts: 1156, avatar: 'MP' },
        { rank: 47, name: 'You', pts: 982, avatar: 'AM', isUser: true },
      ];

  const starterPlayers = starters
    .map((id) => players.find((p) => p.id === id))
    .filter(Boolean) as typeof players;

  const compLabel = competition ? competition.short : isWomen ? 'ALL W' : 'ALL M';

  return (
    <PageContainer>
      {/* Top bar */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name || 'Player'} size={40} />
          <div>
            <p className="text-xs text-text-secondary">Welcome back</p>
            <p className="text-sm font-bold">{user?.name || 'Player'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5">
            <Coins size={15} className="text-primary" />
            <span className="text-sm font-bold">{coins.toLocaleString()}</span>
          </div>
          <button onClick={() => nav('/profile')} className="relative">
            <Bell size={20} className="text-text-secondary" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-danger" />
          </button>
        </div>
      </div>

      {/* Global Sport Selector */}
      <div className="px-5 mb-4 space-y-2.5">
        <GenderToggle />
        <CompetitionSelect />
      </div>

      {/* XP Level + Weekly progress */}
      <div className="px-5 mb-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                <Zap size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">Level {level}</p>
                <p className="text-[11px] text-text-secondary">{xp.toLocaleString()} XP</p>
              </div>
            </div>
            <span className="text-[11px] text-text-secondary">{weeklyXp}/500 XP this week</span>
          </div>
          <ProgressBar value={(weeklyXp / 500) * 100} />
        </Card>
      </div>

      {/* Reward scroll cards */}
      <div className="mb-5">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
          {rewards.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="min-w-[140px] bg-card border border-border rounded-card p-3"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <r.icon size={18} className="text-primary" />
              </div>
              <p className="text-sm font-bold">{r.label}</p>
              <p className="text-[11px] text-text-secondary mb-2">{r.sub}</p>
              <ProgressBar value={r.progress} color={r.progress === 100 ? 'bg-success' : 'bg-primary'} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((a) => (
            <motion.button
              key={a.label}
              whileTap={{ scale: 0.94 }}
              onClick={() => nav(a.to)}
              className="flex flex-col items-center gap-1.5 bg-card border border-border rounded-xl py-3"
            >
              <a.icon size={20} className={a.color} />
              <span className="text-[10px] font-semibold text-text-secondary">{a.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Featured players for active competition */}
      <div className="px-5 mb-5">
        <SectionTitle
          title="Featured Picks"
          action={<span className="text-xs text-text-secondary">{compLabel}</span>}
        />
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {featured.map((p) => (
            <motion.div
              key={p.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => nav('/transfers')}
              className="min-w-[150px] bg-card border border-border rounded-card p-3 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white mb-2" style={{ backgroundColor: p.teamColor }}>
                {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <p className="text-sm font-bold truncate">{p.name}</p>
              <p className="text-[10px] text-text-secondary truncate">{p.club}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded font-semibold">£{p.price}M</span>
                <span className="text-xs font-bold text-success">{p.expectedPoints} xPts</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Current Team Card */}
      <div className="px-5 mb-5">
        <SectionTitle
          title={`Your ${isWomen ? "Women's" : "Men's"} Team`}
          action={<button onClick={() => nav('/team')} className="text-xs text-primary flex items-center gap-1">View <ArrowRight size={12} /></button>}
        />
        <Card hover className="p-4">
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-md font-semibold">{formation}</span>
                <span className="text-xs text-text-secondary">Budget left</span>
                <span className="text-xs font-bold text-success">£{budgetRemaining().toFixed(1)}M</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <StatPill label="Captain" value={players.find((p) => p.id === captain)?.name.split(' ').slice(-1)[0] || '-'} accent="text-primary" />
                <StatPill label="Vice" value={players.find((p) => p.id === viceCaptain)?.name.split(' ').slice(-1)[0] || '-'} />
                <StatPill label="xPts" value={pts.toFixed(1)} accent="text-success" />
              </div>
            </div>
            <div className="w-28">
              <FootballPitch starters={starterPlayers} formation={formation} captainId={captain} viceId={viceCaptain} compact />
            </div>
          </div>
        </Card>
      </div>

      {/* Live contests */}
      <div className="px-5 mb-5">
        <SectionTitle
          title={`${isWomen ? "Women's" : "Men's"} Contests`}
          action={<button onClick={() => nav('/contests')} className="text-xs text-primary flex items-center gap-1">All <ArrowRight size={12} /></button>}
        />
        <div className="space-y-2">
          {contests.map((c, i) => (
            <Card key={c.name} delay={i * 0.05} className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Trophy size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">{c.name}</p>
                  <p className="text-[11px] text-text-secondary">{c.spots} joined</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-success">{c.prize}</p>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={() => nav('/contests')}
                  className="text-[10px] bg-primary text-black font-bold px-3 py-1 rounded-md mt-0.5"
                >
                  Join
                </motion.button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Trending players */}
      <div className="px-5 mb-5">
        <SectionTitle title="Trending" action={<span className="text-xs text-text-secondary">GW 24</span>} />
        <Card className="p-3 space-y-1.5">
          {trending.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 p-1.5 rounded-lg">
              <span className="w-5 text-sm font-bold text-text-secondary">{i + 1}</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ backgroundColor: p.teamColor }}>
                {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{p.name} <span className="text-xs">{COUNTRIES[p.country] || '🏴'}</span></p>
                <p className="text-[10px] text-text-secondary truncate">{p.club} • {p.ownership}% owned</p>
              </div>
              <span className="text-xs font-bold text-success">{p.expectedPoints}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Leaderboard preview */}
      <div className="px-5 mb-5">
        <SectionTitle title="Leaderboard" action={<span className="text-xs text-text-secondary">{compLabel}</span>} />
        <Card className="p-3 space-y-1.5">
          {leaderboard.map((u) => (
            <div
              key={u.rank}
              className={`flex items-center gap-3 p-2 rounded-lg ${u.isUser ? 'bg-primary/10' : ''}`}
            >
              <div className={`w-7 text-center text-sm font-bold ${u.rank <= 3 ? 'text-primary' : 'text-text-secondary'}`}>
                {u.rank <= 3 ? <Crown size={14} className="inline text-primary" /> : u.rank}
              </div>
              <Avatar name={u.name} size={28} />
              <p className="text-sm font-semibold flex-1">{u.name}</p>
              <span className="text-sm font-bold">{u.pts}</span>
            </div>
          ))}
          <div className="flex items-center justify-around pt-2 mt-1 border-t border-border">
            <div className="text-center">
              <p className="text-[10px] text-text-secondary">Your Rank</p>
              <p className="text-sm font-bold text-primary">{isWomen ? '38th' : '47th'}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-[10px] text-text-secondary">Weekly</p>
              <p className="text-sm font-bold">{isWomen ? '9th' : '12th'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* AI banner */}
      <div className="px-5 mb-5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => nav('/ai')}
          className="w-full bg-card border border-primary/30 rounded-card p-4 flex items-center gap-3 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Sparkles size={22} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Ask AI Manager</p>
            <p className="text-[11px] text-text-secondary">Get instant tactical advice for {competition ? competition.name : isWomen ? "Women's" : "Men's"} football</p>
          </div>
          <ArrowRight size={18} className="text-primary" />
        </motion.button>
      </div>
    </PageContainer>
  );
}
