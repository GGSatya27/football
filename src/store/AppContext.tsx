import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ALL_PLAYERS, Formation, Gender,
  MEN_DEFAULT_STARTERS, MEN_DEFAULT_BENCH, MEN_DEFAULT_CAPTAIN, MEN_DEFAULT_VICE,
  WOMEN_DEFAULT_STARTERS, WOMEN_DEFAULT_BENCH, WOMEN_DEFAULT_CAPTAIN, WOMEN_DEFAULT_VICE,
  BUDGET, playerById, activePlayers,
} from '../data/players';
import { COMPETITIONS, Competition } from '../data/competitions';

export interface SavedTeam {
  name: string;
  gender: Gender;
  leagueId: string;
  formation: Formation;
  starters: number[];
  bench: number[];
  captain: number;
  viceCaptain: number;
}

interface AppState {
  authed: boolean;
  user: { name: string; email: string } | null;
  login: (name: string, email: string) => void;
  logout: () => void;

  coins: number;
  xp: number;
  level: number;
  addCoins: (n: number) => void;

  // global sport selector
  gender: Gender;
  setGender: (g: Gender) => void;
  competition: Competition | null;
  setCompetition: (c: Competition | null) => void;
  competitions: Competition[];

  // active players for current selection
  players: typeof ALL_PLAYERS;

  // team — keyed by gender (persisted per gender)
  formation: Formation;
  setFormation: (f: Formation) => void;
  starters: number[];
  bench: number[];
  setSquad: (starters: number[], bench: number[]) => void;
  swapPlayer: (starterId: number, benchId: number) => void;
  captain: number;
  viceCaptain: number;
  setCaptain: (id: number) => void;
  setViceCaptain: (id: number) => void;

  budgetUsed: () => number;
  budgetRemaining: () => number;
  totalExpectedPoints: () => number;
  chemistry: () => number;

  // saved teams
  savedTeams: SavedTeam[];
  saveCurrentTeam: (name: string) => void;
  loadTeam: (t: SavedTeam) => void;
  deleteTeam: (idx: number) => void;
}

const Ctx = createContext<AppState | null>(null);

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp must be inside AppProvider');
  return c;
}

const XP_PER_LEVEL = 500;

interface TeamState {
  formation: Formation;
  starters: number[];
  bench: number[];
  captain: number;
  viceCaptain: number;
}

const MEN_TEAM: TeamState = {
  formation: '4-3-3',
  starters: MEN_DEFAULT_STARTERS,
  bench: MEN_DEFAULT_BENCH,
  captain: MEN_DEFAULT_CAPTAIN,
  viceCaptain: MEN_DEFAULT_VICE,
};
const WOMEN_TEAM: TeamState = {
  formation: '4-3-3',
  starters: WOMEN_DEFAULT_STARTERS,
  bench: WOMEN_DEFAULT_BENCH,
  captain: WOMEN_DEFAULT_CAPTAIN,
  viceCaptain: WOMEN_DEFAULT_VICE,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [coins, setCoins] = useState(12500);
  const [xp] = useState(1840);
  const [gender, setGender] = useState<Gender>('men');
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([]);

  const [menTeam, setMenTeam] = useState<TeamState>(MEN_TEAM);
  const [womenTeam, setWomenTeam] = useState<TeamState>(WOMEN_TEAM);

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;

  // current team state = the one for active gender
  const cur = gender === 'men' ? menTeam : womenTeam;
  const setCur = gender === 'men' ? setMenTeam : setWomenTeam;

  const players = activePlayers(gender, competition?.id);

  useEffect(() => {
    const saved = localStorage.getItem('statify-auth');
    if (saved === 'guest' || saved === 'true') {
      setAuthed(true);
      setUser(saved === 'guest' ? { name: 'Guest', email: '' } : { name: 'Alex Morgan', email: 'alex@statify.ai' });
    }
    const st = localStorage.getItem('statify-teams');
    if (st) {
      try { setSavedTeams(JSON.parse(st)); } catch { /* ignore */ }
    }
  }, []);

  const login = (name: string, email: string) => {
    setAuthed(true);
    setUser({ name, email });
    localStorage.setItem('statify-auth', email ? 'true' : 'guest');
  };
  const logout = () => {
    setAuthed(false);
    setUser(null);
    localStorage.removeItem('statify-auth');
  };

  const addCoins = (n: number) => setCoins((c) => c + n);

  // team mutators act on the current gender's team
  const setFormation = (f: Formation) => setCur((t) => ({ ...t, formation: f }));
  const setSquad = (s: number[], b: number[]) => setCur((t) => ({ ...t, starters: s, bench: b }));
  const swapPlayer = (starterId: number, benchId: number) =>
    setCur((t) => ({
      ...t,
      starters: t.starters.map((id) => (id === starterId ? benchId : id)),
      bench: t.bench.map((id) => (id === benchId ? starterId : id)),
    }));
  const setCaptain = (id: number) => setCur((t) => ({ ...t, captain: id }));
  const setViceCaptain = (id: number) => setCur((t) => ({ ...t, viceCaptain: id }));

  // When switching gender, reset competition if it doesn't match the gender
  const switchGender = (g: Gender) => {
    setGender(g);
    if (competition && competition.gender !== g) setCompetition(null);
  };

  const budgetUsed = () =>
    cur.starters.reduce((sum, id) => sum + (playerById(id)?.price ?? 0), 0);
  const budgetRemaining = () => BUDGET - budgetUsed();
  const totalExpectedPoints = () =>
    cur.starters.reduce((sum, id) => {
      const pl = playerById(id);
      if (!pl) return sum;
      const mult = id === cur.captain ? 2 : id === cur.viceCaptain ? 1.5 : 1;
      return sum + pl.expectedPoints * mult;
    }, 0);
  const chemistry = () => {
    const clubs = new Set(cur.starters.map((id) => playerById(id)?.club).filter(Boolean));
    const max = cur.starters.length;
    const unique = clubs.size;
    const score = Math.round(((max - unique) / (max - 1)) * 100);
    return Math.max(0, Math.min(100, score));
  };

  const saveCurrentTeam = (name: string) => {
    const t: SavedTeam = {
      name, gender, leagueId: competition?.id ?? 'all', formation: cur.formation,
      starters: cur.starters, bench: cur.bench, captain: cur.captain, viceCaptain: cur.viceCaptain,
    };
    const next = [t, ...savedTeams].slice(0, 10);
    setSavedTeams(next);
    localStorage.setItem('statify-teams', JSON.stringify(next));
  };
  const loadTeam = (t: SavedTeam) => {
    setGender(t.gender);
    setCompetition(COMPETITIONS.find((c) => c.id === t.leagueId) ?? null);
    setCur({
      formation: t.formation,
      starters: t.starters,
      bench: t.bench,
      captain: t.captain,
      viceCaptain: t.viceCaptain,
    });
  };
  const deleteTeam = (idx: number) => {
    const next = savedTeams.filter((_, i) => i !== idx);
    setSavedTeams(next);
    localStorage.setItem('statify-teams', JSON.stringify(next));
  };

  return (
    <Ctx.Provider
      value={{
        authed, user, login, logout,
        coins, xp, level, addCoins,
        gender, setGender: switchGender, competition, setCompetition,
        competitions: COMPETITIONS,
        players,
        formation: cur.formation, setFormation,
        starters: cur.starters, bench: cur.bench, setSquad, swapPlayer,
        captain: cur.captain, viceCaptain: cur.viceCaptain, setCaptain, setViceCaptain,
        budgetUsed, budgetRemaining, totalExpectedPoints, chemistry,
        savedTeams, saveCurrentTeam, loadTeam, deleteTeam,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
