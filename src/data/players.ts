export type Gender = 'men' | 'women';
export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Player {
  id: number;
  name: string;
  gender: Gender;
  nationality: string;
  country: string; // short code
  club: string;
  league: string;
  leagueId: string;
  position: Position;
  age: number;
  height: number; // cm
  preferredFoot: 'L' | 'R' | 'B';
  marketValue: number; // millions
  price: number; // fantasy price millions
  overall: number; // 0-100
  goals: number;
  assists: number;
  xG: number;
  xA: number;
  passAccuracy: number; // %
  shots: number;
  dribbles: number;
  tackles: number;
  interceptions: number;
  minutes: number;
  fitness: number; // 0-100
  injuryStatus: 'fit' | 'doubt' | 'injured';
  injuryType: string;
  suspension: boolean;
  form: number[]; // last 5 ratings
  last5Rating: number; // avg
  popularity: number; // 0-100
  ownership: number; // %
  captainScore: number;
  viceScore: number;
  budgetValue: number; // xPts per M
  expectedPoints: number;
  fixtureDifficulty: number; // 1-5
  weatherPerf: number; // 0-100
  homePerf: number;
  awayPerf: number;
  playingStyle: string;
  weakFoot: number; // 1-5
  skillMoves: number; // 1-5
  aiValueScore: number; // 0-100
  secretScore: number; // 0-100
  teamColor: string;
}

export interface Team {
  id: number;
  name: string;
  short: string;
  color: string;
}

export const TEAMS: Team[] = [
  { id: 1, name: 'Arsenal', short: 'ARS', color: '#EF0107' },
  { id: 2, name: 'Chelsea', short: 'CHE', color: '#034694' },
  { id: 3, name: 'Liverpool', short: 'LIV', color: '#C8102E' },
  { id: 4, name: 'Man City', short: 'MCI', color: '#6CABDD' },
  { id: 5, name: 'Man United', short: 'MUN', color: '#DA291C' },
  { id: 6, name: 'Spurs', short: 'TOT', color: '#132257' },
  { id: 7, name: 'Newcastle', short: 'NEW', color: '#241F20' },
  { id: 8, name: 'Aston Villa', short: 'AVL', color: '#95BFE5' },
  { id: 9, name: 'Brighton', short: 'BHA', color: '#0057B8' },
  { id: 10, name: 'West Ham', short: 'WHU', color: '#7A263A' },
];

export const FORMATIONS = ['4-3-3', '3-5-2', '4-4-2', '5-3-2', '3-4-3', '4-2-3-1'] as const;
export type Formation = typeof FORMATIONS[number];

export interface FormationLayout {
  GK: number[];
  DEF: number[];
  MID: number[];
  FWD: number[];
}

export const FORMATION_LAYOUTS: Record<Formation, FormationLayout> = {
  '4-3-3': { GK: [50], DEF: [15, 38, 62, 85], MID: [28, 50, 72], FWD: [20, 50, 80] },
  '3-5-2': { GK: [50], DEF: [25, 50, 75], MID: [12, 30, 50, 70, 88], FWD: [35, 65] },
  '4-4-2': { GK: [50], DEF: [15, 38, 62, 85], MID: [15, 38, 62, 85], FWD: [35, 65] },
  '5-3-2': { GK: [50], DEF: [10, 28, 50, 72, 90], MID: [28, 50, 72], FWD: [35, 65] },
  '3-4-3': { GK: [50], DEF: [25, 50, 75], MID: [15, 38, 62, 85], FWD: [20, 50, 80] },
  '4-2-3-1': { GK: [50], DEF: [15, 38, 62, 85], MID: [20, 35, 50, 65, 80], FWD: [50] },
};

// Detailed named position slots per formation for the Custom Team Builder.
// y: 0 = attack (top), 100 = defense (bottom), GK at ~92.
export interface SlotDef {
  id: string;
  label: string;
  fullLabel: string;
  group: Position;
  x: number;
  y: number;
}

export const FORMATION_SLOTS: Record<Formation, SlotDef[]> = {
  '4-3-3': [
    { id: 'gk', label: 'GK', fullLabel: 'Goalkeeper', group: 'GK', x: 50, y: 92 },
    { id: 'rb', label: 'RB', fullLabel: 'Right Back', group: 'DEF', x: 85, y: 72 },
    { id: 'rcb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 62, y: 74 },
    { id: 'lcb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 38, y: 74 },
    { id: 'lb', label: 'LB', fullLabel: 'Left Back', group: 'DEF', x: 15, y: 72 },
    { id: 'rcm', label: 'CM', fullLabel: 'Central Mid', group: 'MID', x: 72, y: 48 },
    { id: 'cm', label: 'CM', fullLabel: 'Central Mid', group: 'MID', x: 50, y: 50 },
    { id: 'lcm', label: 'CM', fullLabel: 'Central Mid', group: 'MID', x: 28, y: 48 },
    { id: 'rw', label: 'RW', fullLabel: 'Right Wing', group: 'MID', x: 80, y: 20 },
    { id: 'st', label: 'ST', fullLabel: 'Striker', group: 'FWD', x: 50, y: 16 },
    { id: 'lw', label: 'LW', fullLabel: 'Left Wing', group: 'MID', x: 20, y: 20 },
  ],
  '4-4-2': [
    { id: 'gk', label: 'GK', fullLabel: 'Goalkeeper', group: 'GK', x: 50, y: 92 },
    { id: 'rb', label: 'RB', fullLabel: 'Right Back', group: 'DEF', x: 85, y: 72 },
    { id: 'rcb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 62, y: 74 },
    { id: 'lcb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 38, y: 74 },
    { id: 'lb', label: 'LB', fullLabel: 'Left Back', group: 'DEF', x: 15, y: 72 },
    { id: 'rm', label: 'RM', fullLabel: 'Right Mid', group: 'MID', x: 85, y: 45 },
    { id: 'rcm', label: 'CM', fullLabel: 'Central Mid', group: 'MID', x: 58, y: 48 },
    { id: 'lcm', label: 'CM', fullLabel: 'Central Mid', group: 'MID', x: 42, y: 48 },
    { id: 'lm', label: 'LM', fullLabel: 'Left Mid', group: 'MID', x: 15, y: 45 },
    { id: 'rst', label: 'ST', fullLabel: 'Striker', group: 'FWD', x: 38, y: 18 },
    { id: 'lst', label: 'ST', fullLabel: 'Striker', group: 'FWD', x: 62, y: 18 },
  ],
  '3-5-2': [
    { id: 'gk', label: 'GK', fullLabel: 'Goalkeeper', group: 'GK', x: 50, y: 92 },
    { id: 'rcb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 28, y: 76 },
    { id: 'cb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 50, y: 76 },
    { id: 'lcb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 72, y: 76 },
    { id: 'rwb', label: 'RWB', fullLabel: 'Right Wing Back', group: 'DEF', x: 88, y: 55 },
    { id: 'rcm', label: 'CM', fullLabel: 'Central Mid', group: 'MID', x: 65, y: 50 },
    { id: 'cm', label: 'CM', fullLabel: 'Central Mid', group: 'MID', x: 50, y: 52 },
    { id: 'lcm', label: 'CM', fullLabel: 'Central Mid', group: 'MID', x: 35, y: 50 },
    { id: 'lwb', label: 'LWB', fullLabel: 'Left Wing Back', group: 'DEF', x: 12, y: 55 },
    { id: 'rst', label: 'ST', fullLabel: 'Striker', group: 'FWD', x: 38, y: 18 },
    { id: 'lst', label: 'ST', fullLabel: 'Striker', group: 'FWD', x: 62, y: 18 },
  ],
  '5-3-2': [
    { id: 'gk', label: 'GK', fullLabel: 'Goalkeeper', group: 'GK', x: 50, y: 92 },
    { id: 'rwb', label: 'RWB', fullLabel: 'Right Wing Back', group: 'DEF', x: 90, y: 70 },
    { id: 'rcb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 70, y: 76 },
    { id: 'cb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 50, y: 76 },
    { id: 'lcb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 30, y: 76 },
    { id: 'lwb', label: 'LWB', fullLabel: 'Left Wing Back', group: 'DEF', x: 10, y: 70 },
    { id: 'rcm', label: 'CM', fullLabel: 'Central Mid', group: 'MID', x: 72, y: 48 },
    { id: 'cm', label: 'CM', fullLabel: 'Central Mid', group: 'MID', x: 50, y: 50 },
    { id: 'lcm', label: 'CM', fullLabel: 'Central Mid', group: 'MID', x: 28, y: 48 },
    { id: 'rst', label: 'ST', fullLabel: 'Striker', group: 'FWD', x: 38, y: 18 },
    { id: 'lst', label: 'ST', fullLabel: 'Striker', group: 'FWD', x: 62, y: 18 },
  ],
  '3-4-3': [
    { id: 'gk', label: 'GK', fullLabel: 'Goalkeeper', group: 'GK', x: 50, y: 92 },
    { id: 'rcb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 28, y: 76 },
    { id: 'cb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 50, y: 76 },
    { id: 'lcb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 72, y: 76 },
    { id: 'rm', label: 'RM', fullLabel: 'Right Mid', group: 'MID', x: 85, y: 45 },
    { id: 'rcm', label: 'CM', fullLabel: 'Central Mid', group: 'MID', x: 58, y: 48 },
    { id: 'lcm', label: 'CM', fullLabel: 'Central Mid', group: 'MID', x: 42, y: 48 },
    { id: 'lm', label: 'LM', fullLabel: 'Left Mid', group: 'MID', x: 15, y: 45 },
    { id: 'rw', label: 'RW', fullLabel: 'Right Wing', group: 'MID', x: 80, y: 20 },
    { id: 'st', label: 'ST', fullLabel: 'Striker', group: 'FWD', x: 50, y: 16 },
    { id: 'lw', label: 'LW', fullLabel: 'Left Wing', group: 'MID', x: 20, y: 20 },
  ],
  '4-2-3-1': [
    { id: 'gk', label: 'GK', fullLabel: 'Goalkeeper', group: 'GK', x: 50, y: 92 },
    { id: 'rb', label: 'RB', fullLabel: 'Right Back', group: 'DEF', x: 85, y: 72 },
    { id: 'rcb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 62, y: 74 },
    { id: 'lcb', label: 'CB', fullLabel: 'Center Back', group: 'DEF', x: 38, y: 74 },
    { id: 'lb', label: 'LB', fullLabel: 'Left Back', group: 'DEF', x: 15, y: 72 },
    { id: 'rdm', label: 'DM', fullLabel: 'Defensive Mid', group: 'MID', x: 65, y: 58 },
    { id: 'ldm', label: 'DM', fullLabel: 'Defensive Mid', group: 'MID', x: 35, y: 58 },
    { id: 'rw', label: 'RW', fullLabel: 'Right Wing', group: 'MID', x: 80, y: 28 },
    { id: 'am', label: 'AM', fullLabel: 'Attacking Mid', group: 'MID', x: 50, y: 30 },
    { id: 'lw', label: 'LW', fullLabel: 'Left Wing', group: 'MID', x: 20, y: 28 },
    { id: 'st', label: 'ST', fullLabel: 'Striker', group: 'FWD', x: 50, y: 14 },
  ],
};

export const COUNTRIES: Record<string, string> = {
  ARG: '🇦🇷', BRA: '🇧🇷', ESP: '🇪🇸', FRA: '🇫🇷', NED: '🇳🇱', ENG: '🏴', EGY: '🇪🇬',
  POR: '🇵🇹', NOR: '🇳🇴', SWE: '🇸🇪', URU: '🇺🇾', SEN: '🇸🇳', CMR: '🇨🇲', ECU: '🇪🇨',
  USA: '🇺🇸', GER: '🇩🇪', ITA: '🇮🇹', CAN: '🇨🇦', AUS: '🇦🇺', JPN: '🇯🇵',
  SUI: '🇨🇭', DEN: '🇩🇰', POL: '🇵🇱', NGA: '🇳🇬', ZAM: '🇿🇲', MEX: '🇲🇽',
  COL: '🇨🇴', SCO: '🏴', WAL: '🏴', IRL: '🇮🇪', CRC: '🇨🇷', PAR: '🇵🇾',
  BEL: '🇧🇪', CRO: '🇭🇷', KOR: '🇰🇷', MAR: '🇲🇦', TUR: '🇹🇷',
};

export const COUNTRY_NAMES: Record<string, string> = {
  ARG: 'Argentina', BRA: 'Brazil', ESP: 'Spain', FRA: 'France', NED: 'Netherlands',
  ENG: 'England', EGY: 'Egypt', POR: 'Portugal', NOR: 'Norway', SWE: 'Sweden',
  URU: 'Uruguay', SEN: 'Senegal', CMR: 'Cameroon', ECU: 'Ecuador',
  USA: 'USA', GER: 'Germany', ITA: 'Italy', CAN: 'Canada', AUS: 'Australia', JPN: 'Japan',
  SUI: 'Switzerland', DEN: 'Denmark', POL: 'Poland', NGA: 'Nigeria', ZAM: 'Zambia', MEX: 'Mexico',
  COL: 'Colombia', SCO: 'Scotland', WAL: 'Wales', IRL: 'Ireland', CRC: 'Costa Rica', PAR: 'Paraguay',
  BEL: 'Belgium', CRO: 'Croatia', KOR: 'South Korea', MAR: 'Morocco', TUR: 'Turkey',
};

export function formationShape(f: Formation) {
  return f.split('-').map(Number);
}

export const BUDGET = 100;

// ---------- player factory ----------
interface Raw {
  id: number; name: string; gender: Gender; nationality: string; country: string;
  club: string; league: string; leagueId: string; position: Position;
  age: number; height: number; foot: 'L' | 'R' | 'B'; marketValue: number;
  price: number; overall: number; goals: number; assists: number; xG: number; xA: number;
  passAccuracy: number; shots: number; dribbles: number; tackles: number; interceptions: number;
  minutes: number; fitness: number; injuryStatus: 'fit' | 'doubt' | 'injured'; injuryType: string;
  suspension: boolean; form: number[]; popularity: number; ownership: number;
  captainScore: number; viceScore: number; expectedPoints: number; fixtureDifficulty: number;
  weatherPerf: number; homePerf: number; awayPerf: number; playingStyle: string;
  weakFoot: number; skillMoves: number; aiValueScore: number; secretScore: number; teamColor: string;
}

function mk(r: Raw): Player {
  const last5Rating = +(r.form.reduce((a, b) => a + b, 0) / r.form.length).toFixed(1);
  const budgetValue = +(r.expectedPoints / r.price).toFixed(2);
  const { foot, ...rest } = r;
  return { ...rest, preferredFoot: foot, last5Rating, budgetValue };
}

// ===== MEN'S DATASET =====
const MEN: Player[] = [
  // Premier League
  mk({ id: 1, name: 'Alisson', gender: 'men', nationality: 'Brazil', country: 'BRA', club: 'Liverpool', league: 'Premier League', leagueId: 'epl', position: 'GK', age: 31, height: 191, foot: 'R', marketValue: 45, price: 5.5, overall: 89, goals: 0, assists: 0, xG: 0, xA: 0, passAccuracy: 78, shots: 0, dribbles: 0, tackles: 0, interceptions: 14, minutes: 1980, fitness: 95, injuryStatus: 'fit', injuryType: '', suspension: false, form: [3, 5, 2, 6, 4], popularity: 72, ownership: 45, captainScore: 12, viceScore: 24, expectedPoints: 4.2, fixtureDifficulty: 3, weatherPerf: 82, homePerf: 88, awayPerf: 80, playingStyle: 'Sweeper Keeper', weakFoot: 3, skillMoves: 2, aiValueScore: 68, secretScore: 41, teamColor: '#C8102E' }),
  mk({ id: 2, name: 'Raya', gender: 'men', nationality: 'Spain', country: 'ESP', club: 'Arsenal', league: 'Premier League', leagueId: 'epl', position: 'GK', age: 28, height: 183, foot: 'R', marketValue: 32, price: 5.0, overall: 85, goals: 0, assists: 0, xG: 0, xA: 0, passAccuracy: 82, shots: 0, dribbles: 0, tackles: 0, interceptions: 11, minutes: 1890, fitness: 92, injuryStatus: 'fit', injuryType: '', suspension: false, form: [4, 3, 5, 5, 4], popularity: 64, ownership: 38, captainScore: 8, viceScore: 18, expectedPoints: 4.5, fixtureDifficulty: 2, weatherPerf: 78, homePerf: 85, awayPerf: 78, playingStyle: 'Distribution Keeper', weakFoot: 3, skillMoves: 2, aiValueScore: 72, secretScore: 38, teamColor: '#EF0107' }),
  mk({ id: 3, name: 'Ederson', gender: 'men', nationality: 'Brazil', country: 'BRA', club: 'Man City', league: 'Premier League', leagueId: 'epl', position: 'GK', age: 30, height: 188, foot: 'L', marketValue: 38, price: 5.3, overall: 86, goals: 0, assists: 0, xG: 0, xA: 0, passAccuracy: 88, shots: 0, dribbles: 0, tackles: 0, interceptions: 9, minutes: 1620, fitness: 88, injuryStatus: 'doubt', injuryType: 'Thigh', suspension: false, form: [2, 4, 3, 5, 3], popularity: 48, ownership: 22, captainScore: 6, viceScore: 14, expectedPoints: 3.8, fixtureDifficulty: 2, weatherPerf: 80, homePerf: 86, awayPerf: 82, playingStyle: 'Ball-Playing Keeper', weakFoot: 4, skillMoves: 3, aiValueScore: 64, secretScore: 33, teamColor: '#6CABDD' }),
  mk({ id: 4, name: 'Onana', gender: 'men', nationality: 'Cameroon', country: 'CMR', club: 'Man United', league: 'Premier League', leagueId: 'epl', position: 'GK', age: 27, height: 190, foot: 'R', marketValue: 28, price: 4.8, overall: 83, goals: 0, assists: 0, xG: 0, xA: 0, passAccuracy: 75, shots: 0, dribbles: 0, tackles: 0, interceptions: 12, minutes: 1710, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [3, 2, 4, 3, 2], popularity: 42, ownership: 15, captainScore: 5, viceScore: 11, expectedPoints: 3.5, fixtureDifficulty: 3, weatherPerf: 75, homePerf: 80, awayPerf: 72, playingStyle: 'Reactive Keeper', weakFoot: 3, skillMoves: 2, aiValueScore: 58, secretScore: 45, teamColor: '#DA291C' }),
  mk({ id: 5, name: 'Saliba', gender: 'men', nationality: 'France', country: 'FRA', club: 'Arsenal', league: 'Premier League', leagueId: 'epl', position: 'DEF', age: 22, height: 192, foot: 'R', marketValue: 80, price: 5.5, overall: 86, goals: 2, assists: 1, xG: 1.4, xA: 0.8, passAccuracy: 89, shots: 8, dribbles: 4, tackles: 28, interceptions: 32, minutes: 1890, fitness: 95, injuryStatus: 'fit', injuryType: '', suspension: false, form: [4, 6, 5, 7, 4], popularity: 78, ownership: 50, captainScore: 22, viceScore: 38, expectedPoints: 5.2, fixtureDifficulty: 2, weatherPerf: 85, homePerf: 90, awayPerf: 84, playingStyle: 'Ball-Carrying CB', weakFoot: 3, skillMoves: 3, aiValueScore: 82, secretScore: 55, teamColor: '#EF0107' }),
  mk({ id: 6, name: 'Van Dijk', gender: 'men', nationality: 'Netherlands', country: 'NED', club: 'Liverpool', league: 'Premier League', leagueId: 'epl', position: 'DEF', age: 32, height: 193, foot: 'R', marketValue: 38, price: 6.0, overall: 88, goals: 3, assists: 2, xG: 2.1, xA: 1.5, passAccuracy: 91, shots: 12, dribbles: 6, tackles: 24, interceptions: 38, minutes: 1980, fitness: 93, injuryStatus: 'fit', injuryType: '', suspension: false, form: [6, 5, 7, 6, 8], popularity: 85, ownership: 55, captainScore: 30, viceScore: 48, expectedPoints: 5.8, fixtureDifficulty: 3, weatherPerf: 88, homePerf: 92, awayPerf: 86, playingStyle: 'Dominant CB', weakFoot: 3, skillMoves: 3, aiValueScore: 86, secretScore: 62, teamColor: '#C8102E' }),
  mk({ id: 7, name: 'Walker', gender: 'men', nationality: 'England', country: 'ENG', club: 'Man City', league: 'Premier League', leagueId: 'epl', position: 'DEF', age: 33, height: 178, foot: 'R', marketValue: 18, price: 5.2, overall: 84, goals: 0, assists: 3, xG: 0.2, xA: 2.1, passAccuracy: 86, shots: 4, dribbles: 8, tackles: 26, interceptions: 22, minutes: 1740, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [3, 5, 4, 6, 5], popularity: 62, ownership: 28, captainScore: 14, viceScore: 26, expectedPoints: 4.6, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 86, awayPerf: 80, playingStyle: 'Recovery RB', weakFoot: 3, skillMoves: 3, aiValueScore: 72, secretScore: 40, teamColor: '#6CABDD' }),
  mk({ id: 8, name: 'Trippier', gender: 'men', nationality: 'England', country: 'ENG', club: 'Newcastle', league: 'Premier League', leagueId: 'epl', position: 'DEF', age: 33, height: 173, foot: 'R', marketValue: 12, price: 5.8, overall: 83, goals: 1, assists: 6, xG: 0.6, xA: 4.2, passAccuracy: 84, shots: 18, dribbles: 5, tackles: 22, interceptions: 20, minutes: 1680, fitness: 88, injuryStatus: 'doubt', injuryType: 'Calf', suspension: false, form: [7, 5, 8, 6, 5], popularity: 70, ownership: 42, captainScore: 28, viceScore: 44, expectedPoints: 6.1, fixtureDifficulty: 3, weatherPerf: 80, homePerf: 84, awayPerf: 78, playingStyle: 'Crossing RB', weakFoot: 4, skillMoves: 3, aiValueScore: 80, secretScore: 52, teamColor: '#241F20' }),
  mk({ id: 9, name: 'Estupinan', gender: 'men', nationality: 'Ecuador', country: 'ECU', club: 'Brighton', league: 'Premier League', leagueId: 'epl', position: 'DEF', age: 25, height: 175, foot: 'L', marketValue: 22, price: 4.8, overall: 81, goals: 0, assists: 4, xG: 0.3, xA: 2.8, passAccuracy: 83, shots: 10, dribbles: 12, tackles: 30, interceptions: 24, minutes: 1620, fitness: 85, injuryStatus: 'fit', injuryType: '', suspension: false, form: [4, 3, 5, 4, 6], popularity: 54, ownership: 18, captainScore: 16, viceScore: 28, expectedPoints: 4.2, fixtureDifficulty: 2, weatherPerf: 78, homePerf: 82, awayPerf: 76, playingStyle: 'Attacking LB', weakFoot: 3, skillMoves: 4, aiValueScore: 75, secretScore: 60, teamColor: '#0057B8' }),
  mk({ id: 10, name: 'Konsa', gender: 'men', nationality: 'England', country: 'ENG', club: 'Aston Villa', league: 'Premier League', leagueId: 'epl', position: 'DEF', age: 25, height: 183, foot: 'R', marketValue: 28, price: 4.5, overall: 80, goals: 1, assists: 0, xG: 0.5, xA: 0.2, passAccuracy: 85, shots: 6, dribbles: 3, tackles: 26, interceptions: 30, minutes: 1710, fitness: 91, injuryStatus: 'fit', injuryType: '', suspension: false, form: [3, 4, 2, 5, 4], popularity: 40, ownership: 12, captainScore: 10, viceScore: 20, expectedPoints: 3.8, fixtureDifficulty: 3, weatherPerf: 82, homePerf: 84, awayPerf: 80, playingStyle: 'Ball-Playing CB', weakFoot: 3, skillMoves: 2, aiValueScore: 68, secretScore: 47, teamColor: '#95BFE5' }),
  mk({ id: 11, name: 'Salah', gender: 'men', nationality: 'Egypt', country: 'EGY', club: 'Liverpool', league: 'Premier League', leagueId: 'epl', position: 'MID', age: 31, height: 175, foot: 'L', marketValue: 65, price: 13.0, overall: 91, goals: 17, assists: 9, xG: 14.2, xA: 7.8, passAccuracy: 84, shots: 78, dribbles: 52, tackles: 18, interceptions: 14, minutes: 1890, fitness: 94, injuryStatus: 'fit', injuryType: '', suspension: false, form: [8, 10, 7, 9, 12], popularity: 96, ownership: 68, captainScore: 92, viceScore: 98, expectedPoints: 8.5, fixtureDifficulty: 2, weatherPerf: 86, homePerf: 94, awayPerf: 82, playingStyle: 'Inverted Winger', weakFoot: 4, skillMoves: 4, aiValueScore: 95, secretScore: 78, teamColor: '#C8102E' }),
  mk({ id: 12, name: 'Saka', gender: 'men', nationality: 'England', country: 'ENG', club: 'Arsenal', league: 'Premier League', leagueId: 'epl', position: 'MID', age: 22, height: 178, foot: 'L', marketValue: 110, price: 9.5, overall: 87, goals: 12, assists: 11, xG: 9.8, xA: 8.2, passAccuracy: 86, shots: 62, dribbles: 68, tackles: 24, interceptions: 18, minutes: 1860, fitness: 92, injuryStatus: 'fit', injuryType: '', suspension: false, form: [7, 8, 6, 9, 8], popularity: 92, ownership: 60, captainScore: 78, viceScore: 88, expectedPoints: 7.2, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 90, awayPerf: 82, playingStyle: 'Wide Playmaker', weakFoot: 4, skillMoves: 4, aiValueScore: 90, secretScore: 70, teamColor: '#EF0107' }),
  mk({ id: 13, name: 'Foden', gender: 'men', nationality: 'England', country: 'ENG', club: 'Man City', league: 'Premier League', leagueId: 'epl', position: 'MID', age: 23, height: 171, foot: 'L', marketValue: 90, price: 8.5, overall: 88, goals: 14, assists: 7, xG: 11.5, xA: 5.8, passAccuracy: 88, shots: 70, dribbles: 58, tackles: 16, interceptions: 12, minutes: 1800, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [6, 9, 7, 8, 7], popularity: 88, ownership: 52, captainScore: 70, viceScore: 82, expectedPoints: 6.8, fixtureDifficulty: 2, weatherPerf: 86, homePerf: 88, awayPerf: 84, playingStyle: 'Drifting 10', weakFoot: 4, skillMoves: 4, aiValueScore: 88, secretScore: 65, teamColor: '#6CABDD' }),
  mk({ id: 14, name: 'Palmer', gender: 'men', nationality: 'England', country: 'ENG', club: 'Chelsea', league: 'Premier League', leagueId: 'epl', position: 'MID', age: 21, height: 182, foot: 'L', marketValue: 80, price: 8.0, overall: 85, goals: 13, assists: 8, xG: 10.4, xA: 6.6, passAccuracy: 85, shots: 64, dribbles: 48, tackles: 20, interceptions: 16, minutes: 1770, fitness: 95, injuryStatus: 'fit', injuryType: '', suspension: false, form: [9, 7, 10, 8, 6], popularity: 90, ownership: 58, captainScore: 82, viceScore: 90, expectedPoints: 7.5, fixtureDifficulty: 3, weatherPerf: 82, homePerf: 88, awayPerf: 80, playingStyle: 'Creative 10', weakFoot: 4, skillMoves: 4, aiValueScore: 89, secretScore: 68, teamColor: '#034694' }),
  mk({ id: 15, name: 'Bruno F', gender: 'men', nationality: 'Portugal', country: 'POR', club: 'Man United', league: 'Premier League', leagueId: 'epl', position: 'MID', age: 29, height: 179, foot: 'R', marketValue: 60, price: 8.3, overall: 87, goals: 10, assists: 12, xG: 8.2, xA: 9.4, passAccuracy: 82, shots: 72, dribbles: 42, tackles: 22, interceptions: 18, minutes: 1830, fitness: 91, injuryStatus: 'fit', injuryType: '', suspension: false, form: [7, 6, 8, 9, 7], popularity: 86, ownership: 48, captainScore: 72, viceScore: 84, expectedPoints: 6.9, fixtureDifficulty: 3, weatherPerf: 80, homePerf: 88, awayPerf: 78, playingStyle: 'Press-Resistant 10', weakFoot: 4, skillMoves: 4, aiValueScore: 86, secretScore: 60, teamColor: '#DA291C' }),
  mk({ id: 16, name: 'Maddison', gender: 'men', nationality: 'England', country: 'ENG', club: 'Spurs', league: 'Premier League', leagueId: 'epl', position: 'MID', age: 27, height: 175, foot: 'L', marketValue: 50, price: 7.5, overall: 84, goals: 6, assists: 9, xG: 5.2, xA: 7.1, passAccuracy: 84, shots: 58, dribbles: 44, tackles: 18, interceptions: 14, minutes: 1560, fitness: 82, injuryStatus: 'doubt', injuryType: 'Ankle', suspension: false, form: [5, 7, 6, 8, 4], popularity: 76, ownership: 32, captainScore: 48, viceScore: 62, expectedPoints: 5.8, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 86, awayPerf: 78, playingStyle: 'Set-Piece Specialist', weakFoot: 4, skillMoves: 4, aiValueScore: 78, secretScore: 58, teamColor: '#132257' }),
  mk({ id: 17, name: 'Bowen', gender: 'men', nationality: 'England', country: 'ENG', club: 'West Ham', league: 'Premier League', leagueId: 'epl', position: 'MID', age: 27, height: 175, foot: 'R', marketValue: 42, price: 6.5, overall: 82, goals: 8, assists: 5, xG: 6.4, xA: 4.2, passAccuracy: 82, shots: 54, dribbles: 38, tackles: 24, interceptions: 16, minutes: 1740, fitness: 89, injuryStatus: 'fit', injuryType: '', suspension: false, form: [4, 6, 5, 7, 5], popularity: 60, ownership: 22, captainScore: 32, viceScore: 48, expectedPoints: 5.2, fixtureDifficulty: 3, weatherPerf: 80, homePerf: 84, awayPerf: 76, playingStyle: 'Direct Winger', weakFoot: 3, skillMoves: 4, aiValueScore: 74, secretScore: 55, teamColor: '#7A263A' }),
  mk({ id: 18, name: 'Mbeumo', gender: 'men', nationality: 'Cameroon', country: 'CMR', club: 'Brentford', league: 'Premier League', leagueId: 'epl', position: 'MID', age: 24, height: 171, foot: 'L', marketValue: 35, price: 5.5, overall: 80, goals: 7, assists: 4, xG: 5.6, xA: 3.2, passAccuracy: 81, shots: 48, dribbles: 42, tackles: 22, interceptions: 12, minutes: 1650, fitness: 87, injuryStatus: 'fit', injuryType: '', suspension: false, form: [5, 4, 6, 5, 7], popularity: 48, ownership: 15, captainScore: 22, viceScore: 36, expectedPoints: 4.8, fixtureDifficulty: 2, weatherPerf: 78, homePerf: 82, awayPerf: 74, playingStyle: 'Press Winger', weakFoot: 3, skillMoves: 4, aiValueScore: 72, secretScore: 62, teamColor: '#E30613' }),
  mk({ id: 19, name: 'Haaland', gender: 'men', nationality: 'Norway', country: 'NOR', club: 'Man City', league: 'Premier League', leagueId: 'epl', position: 'FWD', age: 23, height: 195, foot: 'L', marketValue: 180, price: 14.0, overall: 91, goals: 22, assists: 4, xG: 19.8, xA: 3.2, passAccuracy: 80, shots: 92, dribbles: 28, tackles: 10, interceptions: 8, minutes: 1740, fitness: 93, injuryStatus: 'fit', injuryType: '', suspension: false, form: [10, 12, 8, 11, 14], popularity: 98, ownership: 75, captainScore: 96, viceScore: 100, expectedPoints: 9.2, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 96, awayPerf: 88, playingStyle: 'Complete Striker', weakFoot: 4, skillMoves: 3, aiValueScore: 97, secretScore: 82, teamColor: '#6CABDD' }),
  mk({ id: 20, name: 'Watkins', gender: 'men', nationality: 'England', country: 'ENG', club: 'Aston Villa', league: 'Premier League', leagueId: 'epl', position: 'FWD', age: 28, height: 180, foot: 'R', marketValue: 55, price: 9.0, overall: 84, goals: 16, assists: 8, xG: 13.4, xA: 6.2, passAccuracy: 82, shots: 74, dribbles: 38, tackles: 18, interceptions: 12, minutes: 1860, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [8, 7, 9, 6, 8], popularity: 84, ownership: 48, captainScore: 62, viceScore: 78, expectedPoints: 7.1, fixtureDifficulty: 3, weatherPerf: 82, homePerf: 88, awayPerf: 80, playingStyle: 'Pressing Striker', weakFoot: 3, skillMoves: 4, aiValueScore: 85, secretScore: 68, teamColor: '#95BFE5' }),
  mk({ id: 21, name: 'Isak', gender: 'men', nationality: 'Sweden', country: 'SWE', club: 'Newcastle', league: 'Premier League', leagueId: 'epl', position: 'FWD', age: 24, height: 192, foot: 'R', marketValue: 65, price: 8.5, overall: 84, goals: 14, assists: 5, xG: 11.8, xA: 4.1, passAccuracy: 81, shots: 68, dribbles: 44, tackles: 14, interceptions: 10, minutes: 1680, fitness: 88, injuryStatus: 'fit', injuryType: '', suspension: false, form: [7, 8, 6, 9, 7], popularity: 78, ownership: 35, captainScore: 54, viceScore: 70, expectedPoints: 6.6, fixtureDifficulty: 3, weatherPerf: 80, homePerf: 86, awayPerf: 78, playingStyle: 'Mobile Striker', weakFoot: 4, skillMoves: 4, aiValueScore: 82, secretScore: 64, teamColor: '#241F20' }),
  mk({ id: 22, name: 'Nunez', gender: 'men', nationality: 'Uruguay', country: 'URU', club: 'Liverpool', league: 'Premier League', leagueId: 'epl', position: 'FWD', age: 24, height: 187, foot: 'R', marketValue: 50, price: 7.5, overall: 82, goals: 10, assists: 6, xG: 12.4, xA: 4.8, passAccuracy: 78, shots: 82, dribbles: 36, tackles: 16, interceptions: 12, minutes: 1620, fitness: 85, injuryStatus: 'fit', injuryType: '', suspension: false, form: [5, 6, 4, 7, 6], popularity: 70, ownership: 20, captainScore: 38, viceScore: 54, expectedPoints: 5.4, fixtureDifficulty: 2, weatherPerf: 78, homePerf: 84, awayPerf: 76, playingStyle: 'Chaos Striker', weakFoot: 3, skillMoves: 3, aiValueScore: 75, secretScore: 66, teamColor: '#C8102E' }),
  mk({ id: 23, name: 'Jackson', gender: 'men', nationality: 'Senegal', country: 'SEN', club: 'Chelsea', league: 'Premier League', leagueId: 'epl', position: 'FWD', age: 22, height: 186, foot: 'R', marketValue: 40, price: 7.0, overall: 80, goals: 9, assists: 4, xG: 8.6, xA: 3.2, passAccuracy: 79, shots: 66, dribbles: 48, tackles: 18, interceptions: 14, minutes: 1650, fitness: 89, injuryStatus: 'fit', injuryType: '', suspension: false, form: [6, 4, 7, 5, 8], popularity: 66, ownership: 28, captainScore: 34, viceScore: 50, expectedPoints: 5.6, fixtureDifficulty: 3, weatherPerf: 78, homePerf: 84, awayPerf: 76, playingStyle: 'Runner Striker', weakFoot: 3, skillMoves: 4, aiValueScore: 76, secretScore: 58, teamColor: '#034694' }),
  mk({ id: 24, name: 'Toney', gender: 'men', nationality: 'England', country: 'ENG', club: 'Brentford', league: 'Premier League', leagueId: 'epl', position: 'FWD', age: 27, height: 185, foot: 'R', marketValue: 45, price: 7.8, overall: 81, goals: 11, assists: 3, xG: 9.2, xA: 2.4, passAccuracy: 76, shots: 60, dribbles: 28, tackles: 22, interceptions: 10, minutes: 1620, fitness: 91, injuryStatus: 'fit', injuryType: '', suspension: false, form: [7, 6, 5, 8, 6], popularity: 64, ownership: 18, captainScore: 36, viceScore: 52, expectedPoints: 5.9, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 86, awayPerf: 80, playingStyle: 'Target Man', weakFoot: 3, skillMoves: 3, aiValueScore: 77, secretScore: 60, teamColor: '#E30613' }),
  // La Liga extras
  mk({ id: 25, name: 'Bellingham', gender: 'men', nationality: 'England', country: 'ENG', club: 'Real Madrid', league: 'La Liga', leagueId: 'laliga', position: 'MID', age: 20, height: 186, foot: 'R', marketValue: 180, price: 11.5, overall: 88, goals: 15, assists: 8, xG: 12.4, xA: 6.2, passAccuracy: 88, shots: 72, dribbles: 52, tackles: 28, interceptions: 22, minutes: 1860, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [8, 9, 7, 10, 9], popularity: 94, ownership: 58, captainScore: 84, viceScore: 92, expectedPoints: 8.0, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 92, awayPerf: 84, playingStyle: 'Box-Crashing 10', weakFoot: 4, skillMoves: 4, aiValueScore: 93, secretScore: 72, teamColor: '#FEBE10' }),
  mk({ id: 26, name: 'Vinicius', gender: 'men', nationality: 'Brazil', country: 'BRA', club: 'Real Madrid', league: 'La Liga', leagueId: 'laliga', position: 'MID', age: 23, height: 176, foot: 'R', marketValue: 150, price: 11.0, overall: 89, goals: 13, assists: 10, xG: 10.8, xA: 8.4, passAccuracy: 84, shots: 68, dribbles: 82, tackles: 16, interceptions: 12, minutes: 1800, fitness: 88, injuryStatus: 'fit', injuryType: '', suspension: false, form: [9, 8, 10, 7, 9], popularity: 95, ownership: 54, captainScore: 80, viceScore: 90, expectedPoints: 7.8, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 94, awayPerf: 82, playingStyle: 'Dribbling Winger', weakFoot: 4, skillMoves: 5, aiValueScore: 92, secretScore: 75, teamColor: '#FEBE10' }),
  mk({ id: 27, name: 'Lewandowski', gender: 'men', nationality: 'Poland', country: 'POL', club: 'Barcelona', league: 'La Liga', leagueId: 'laliga', position: 'FWD', age: 35, height: 185, foot: 'R', marketValue: 30, price: 10.5, overall: 88, goals: 18, assists: 5, xG: 15.6, xA: 4.2, passAccuracy: 82, shots: 88, dribbles: 32, tackles: 12, interceptions: 8, minutes: 1740, fitness: 86, injuryStatus: 'fit', injuryType: '', suspension: false, form: [9, 8, 10, 9, 8], popularity: 88, ownership: 46, captainScore: 72, viceScore: 84, expectedPoints: 7.6, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 92, awayPerf: 82, playingStyle: 'Poacher', weakFoot: 4, skillMoves: 4, aiValueScore: 88, secretScore: 60, teamColor: '#A50044' }),
  mk({ id: 28, name: 'Yamal', gender: 'men', nationality: 'Spain', country: 'ESP', club: 'Barcelona', league: 'La Liga', leagueId: 'laliga', position: 'MID', age: 16, height: 180, foot: 'L', marketValue: 75, price: 7.5, overall: 82, goals: 6, assists: 9, xG: 4.8, xA: 7.2, passAccuracy: 84, shots: 52, dribbles: 76, tackles: 18, interceptions: 14, minutes: 1620, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [7, 8, 6, 9, 8], popularity: 86, ownership: 32, captainScore: 50, viceScore: 68, expectedPoints: 6.2, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 88, awayPerf: 80, playingStyle: 'Inverted Winger', weakFoot: 4, skillMoves: 5, aiValueScore: 84, secretScore: 78, teamColor: '#A50044' }),
  mk({ id: 29, name: 'Mbappe', gender: 'men', nationality: 'France', country: 'FRA', club: 'Real Madrid', league: 'La Liga', leagueId: 'laliga', position: 'FWD', age: 25, height: 178, foot: 'R', marketValue: 180, price: 12.5, overall: 91, goals: 20, assists: 8, xG: 17.2, xA: 6.4, passAccuracy: 84, shots: 94, dribbles: 72, tackles: 14, interceptions: 10, minutes: 1800, fitness: 92, injuryStatus: 'fit', injuryType: '', suspension: false, form: [10, 9, 11, 8, 10], popularity: 98, ownership: 64, captainScore: 90, viceScore: 96, expectedPoints: 8.8, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 94, awayPerf: 86, playingStyle: 'Speed Striker', weakFoot: 4, skillMoves: 5, aiValueScore: 95, secretScore: 80, teamColor: '#FEBE10' }),
  // Argentina / Serie A / Bundesliga extras
  mk({ id: 30, name: 'Messi', gender: 'men', nationality: 'Argentina', country: 'ARG', club: 'Inter Miami', league: 'MLS', leagueId: 'mls', position: 'FWD', age: 36, height: 170, foot: 'L', marketValue: 35, price: 12.0, overall: 90, goals: 16, assists: 11, xG: 13.2, xA: 9.1, passAccuracy: 88, shots: 80, dribbles: 72, tackles: 12, interceptions: 8, minutes: 1680, fitness: 85, injuryStatus: 'fit', injuryType: '', suspension: false, form: [9, 8, 10, 7, 9], popularity: 97, ownership: 62, captainScore: 84, viceScore: 92, expectedPoints: 8.4, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 94, awayPerf: 80, playingStyle: 'Playmaker Forward', weakFoot: 4, skillMoves: 5, aiValueScore: 92, secretScore: 80, teamColor: '#F7B5CD' }),
  mk({ id: 31, name: 'Alvarez', gender: 'men', nationality: 'Argentina', country: 'ARG', club: 'Atletico Madrid', league: 'La Liga', leagueId: 'laliga', position: 'FWD', age: 24, height: 170, foot: 'R', marketValue: 70, price: 8.5, overall: 85, goals: 13, assists: 6, xG: 10.8, xA: 4.8, passAccuracy: 83, shots: 66, dribbles: 48, tackles: 22, interceptions: 14, minutes: 1740, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [7, 8, 6, 9, 7], popularity: 80, ownership: 36, captainScore: 58, viceScore: 74, expectedPoints: 6.8, fixtureDifficulty: 3, weatherPerf: 80, homePerf: 86, awayPerf: 78, playingStyle: 'Pressing Forward', weakFoot: 4, skillMoves: 4, aiValueScore: 82, secretScore: 66, teamColor: '#CB3524' }),
  mk({ id: 32, name: 'Enzo F', gender: 'men', nationality: 'Argentina', country: 'ARG', club: 'Chelsea', league: 'Premier League', leagueId: 'epl', position: 'MID', age: 23, height: 176, foot: 'R', marketValue: 55, price: 7.0, overall: 84, goals: 5, assists: 8, xG: 4.2, xA: 6.4, passAccuracy: 87, shots: 44, dribbles: 38, tackles: 28, interceptions: 22, minutes: 1770, fitness: 88, injuryStatus: 'fit', injuryType: '', suspension: false, form: [6, 7, 5, 8, 6], popularity: 74, ownership: 30, captainScore: 42, viceScore: 60, expectedPoints: 5.8, fixtureDifficulty: 3, weatherPerf: 80, homePerf: 86, awayPerf: 76, playingStyle: 'Deep-Lying Playmaker', weakFoot: 4, skillMoves: 3, aiValueScore: 78, secretScore: 58, teamColor: '#034694' }),
  mk({ id: 33, name: 'Mac Allister', gender: 'men', nationality: 'Argentina', country: 'ARG', club: 'Liverpool', league: 'Premier League', leagueId: 'epl', position: 'MID', age: 25, height: 174, foot: 'R', marketValue: 50, price: 6.5, overall: 84, goals: 4, assists: 7, xG: 3.2, xA: 5.8, passAccuracy: 88, shots: 38, dribbles: 34, tackles: 30, interceptions: 24, minutes: 1830, fitness: 91, injuryStatus: 'fit', injuryType: '', suspension: false, form: [6, 7, 5, 8, 7], popularity: 76, ownership: 32, captainScore: 40, viceScore: 58, expectedPoints: 5.6, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 88, awayPerf: 80, playingStyle: 'Box-to-Box 8', weakFoot: 4, skillMoves: 3, aiValueScore: 80, secretScore: 62, teamColor: '#C8102E' }),
  mk({ id: 34, name: 'Romero', gender: 'men', nationality: 'Argentina', country: 'ARG', club: 'Spurs', league: 'Premier League', leagueId: 'epl', position: 'DEF', age: 26, height: 185, foot: 'R', marketValue: 45, price: 5.2, overall: 84, goals: 1, assists: 1, xG: 0.4, xA: 0.6, passAccuracy: 85, shots: 8, dribbles: 6, tackles: 32, interceptions: 30, minutes: 1710, fitness: 89, injuryStatus: 'fit', injuryType: '', suspension: false, form: [5, 6, 4, 7, 5], popularity: 68, ownership: 24, captainScore: 18, viceScore: 32, expectedPoints: 4.8, fixtureDifficulty: 3, weatherPerf: 84, homePerf: 86, awayPerf: 80, playingStyle: 'Aggressive CB', weakFoot: 3, skillMoves: 2, aiValueScore: 74, secretScore: 50, teamColor: '#132257' }),
  mk({ id: 35, name: 'Martinez', gender: 'men', nationality: 'Argentina', country: 'ARG', club: 'Aston Villa', league: 'Premier League', leagueId: 'epl', position: 'GK', age: 31, height: 195, foot: 'R', marketValue: 28, price: 5.0, overall: 85, goals: 0, assists: 0, xG: 0, xA: 0, passAccuracy: 76, shots: 0, dribbles: 0, tackles: 0, interceptions: 13, minutes: 1890, fitness: 92, injuryStatus: 'fit', injuryType: '', suspension: false, form: [4, 5, 3, 6, 4], popularity: 60, ownership: 20, captainScore: 8, viceScore: 18, expectedPoints: 4.2, fixtureDifficulty: 3, weatherPerf: 82, homePerf: 86, awayPerf: 78, playingStyle: 'Reactive Keeper', weakFoot: 3, skillMoves: 2, aiValueScore: 66, secretScore: 44, teamColor: '#95BFE5' }),
  mk({ id: 36, name: 'De Bruyne', gender: 'men', nationality: 'Belgium', country: 'BEL', club: 'Man City', league: 'Premier League', leagueId: 'epl', position: 'MID', age: 33, height: 181, foot: 'R', marketValue: 50, price: 10.5, overall: 90, goals: 8, assists: 14, xG: 6.8, xA: 11.2, passAccuracy: 89, shots: 62, dribbles: 48, tackles: 20, interceptions: 16, minutes: 1620, fitness: 82, injuryStatus: 'doubt', injuryType: 'Hamstring', suspension: false, form: [6, 8, 7, 9, 5], popularity: 90, ownership: 44, captainScore: 76, viceScore: 88, expectedPoints: 7.8, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 90, awayPerf: 82, playingStyle: 'Complete 10', weakFoot: 5, skillMoves: 4, aiValueScore: 90, secretScore: 70, teamColor: '#6CABDD' }),
  mk({ id: 37, name: 'Modric', gender: 'men', nationality: 'Croatia', country: 'CRO', club: 'Real Madrid', league: 'La Liga', leagueId: 'laliga', position: 'MID', age: 39, height: 172, foot: 'R', marketValue: 10, price: 6.5, overall: 85, goals: 4, assists: 8, xG: 3.2, xA: 6.4, passAccuracy: 90, shots: 40, dribbles: 42, tackles: 24, interceptions: 18, minutes: 1530, fitness: 84, injuryStatus: 'fit', injuryType: '', suspension: false, form: [6, 7, 5, 8, 6], popularity: 82, ownership: 28, captainScore: 38, viceScore: 56, expectedPoints: 5.8, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 88, awayPerf: 80, playingStyle: 'Deep Playmaker', weakFoot: 4, skillMoves: 4, aiValueScore: 80, secretScore: 58, teamColor: '#FEBE10' }),
  mk({ id: 38, name: 'Verratti', gender: 'men', nationality: 'Italy', country: 'ITA', club: 'Napoli', league: 'Serie A', leagueId: 'seriea', position: 'MID', age: 31, height: 165, foot: 'R', marketValue: 25, price: 6.0, overall: 85, goals: 3, assists: 9, xG: 2.4, xA: 7.2, passAccuracy: 91, shots: 32, dribbles: 54, tackles: 26, interceptions: 20, minutes: 1680, fitness: 86, injuryStatus: 'fit', injuryType: '', suspension: false, form: [6, 5, 7, 6, 8], popularity: 72, ownership: 22, captainScore: 34, viceScore: 52, expectedPoints: 5.4, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 86, awayPerf: 80, playingStyle: 'Press-Resistant 6', weakFoot: 4, skillMoves: 5, aiValueScore: 78, secretScore: 62, teamColor: '#199CE6' }),
  mk({ id: 39, name: 'Kvaratskhelia', gender: 'men', nationality: 'Georgia', country: 'CRO', club: 'Napoli', league: 'Serie A', leagueId: 'seriea', position: 'MID', age: 23, height: 183, foot: 'L', marketValue: 65, price: 7.5, overall: 85, goals: 9, assists: 7, xG: 7.2, xA: 5.4, passAccuracy: 84, shots: 58, dribbles: 72, tackles: 18, interceptions: 14, minutes: 1680, fitness: 88, injuryStatus: 'fit', injuryType: '', suspension: false, form: [7, 6, 8, 7, 9], popularity: 78, ownership: 30, captainScore: 48, viceScore: 66, expectedPoints: 6.2, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 88, awayPerf: 78, playingStyle: 'Dribbling Winger', weakFoot: 4, skillMoves: 5, aiValueScore: 82, secretScore: 68, teamColor: '#199CE6' }),
  mk({ id: 40, name: 'Son', gender: 'men', nationality: 'South Korea', country: 'KOR', club: 'Spurs', league: 'Premier League', leagueId: 'epl', position: 'MID', age: 31, height: 183, foot: 'R', marketValue: 45, price: 9.0, overall: 86, goals: 14, assists: 7, xG: 11.2, xA: 5.6, passAccuracy: 84, shots: 70, dribbles: 52, tackles: 18, interceptions: 14, minutes: 1800, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [8, 7, 9, 6, 8], popularity: 88, ownership: 42, captainScore: 66, viceScore: 80, expectedPoints: 7.0, fixtureDifficulty: 3, weatherPerf: 82, homePerf: 88, awayPerf: 80, playingStyle: 'Inverted Winger', weakFoot: 5, skillMoves: 4, aiValueScore: 86, secretScore: 64, teamColor: '#132257' }),
];

// ===== WOMEN'S DATASET =====
const WOMEN: Player[] = [
  // Women's Super League (England)
  mk({ id: 101, name: 'Earps', gender: 'women', nationality: 'England', country: 'ENG', club: 'Man United Women', league: "Women's Super League", leagueId: 'wsl', position: 'GK', age: 31, height: 173, foot: 'R', marketValue: 1.2, price: 5.5, overall: 88, goals: 0, assists: 0, xG: 0, xA: 0, passAccuracy: 80, shots: 0, dribbles: 0, tackles: 0, interceptions: 12, minutes: 1980, fitness: 94, injuryStatus: 'fit', injuryType: '', suspension: false, form: [3, 5, 2, 6, 4], popularity: 75, ownership: 42, captainScore: 14, viceScore: 26, expectedPoints: 4.4, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 90, awayPerf: 82, playingStyle: 'Reactive Keeper', weakFoot: 3, skillMoves: 2, aiValueScore: 70, secretScore: 45, teamColor: '#DA291C' }),
  mk({ id: 102, name: 'Hampton', gender: 'women', nationality: 'England', country: 'ENG', club: 'Chelsea Women', league: "Women's Super League", leagueId: 'wsl', position: 'GK', age: 24, height: 178, foot: 'R', marketValue: 0.8, price: 5.0, overall: 84, goals: 0, assists: 0, xG: 0, xA: 0, passAccuracy: 82, shots: 0, dribbles: 0, tackles: 0, interceptions: 10, minutes: 1890, fitness: 92, injuryStatus: 'fit', injuryType: '', suspension: false, form: [4, 3, 5, 5, 4], popularity: 58, ownership: 30, captainScore: 9, viceScore: 18, expectedPoints: 4.2, fixtureDifficulty: 2, weatherPerf: 80, homePerf: 86, awayPerf: 78, playingStyle: 'Distribution Keeper', weakFoot: 3, skillMoves: 2, aiValueScore: 66, secretScore: 38, teamColor: '#034694' }),
  mk({ id: 103, name: 'Bronze', gender: 'women', nationality: 'England', country: 'ENG', club: 'Chelsea Women', league: "Women's Super League", leagueId: 'wsl', position: 'DEF', age: 32, height: 170, foot: 'R', marketValue: 0.6, price: 5.8, overall: 87, goals: 2, assists: 5, xG: 1.2, xA: 3.8, passAccuracy: 85, shots: 14, dribbles: 18, tackles: 26, interceptions: 24, minutes: 1740, fitness: 88, injuryStatus: 'fit', injuryType: '', suspension: false, form: [6, 7, 5, 8, 6], popularity: 82, ownership: 44, captainScore: 26, viceScore: 42, expectedPoints: 5.6, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 88, awayPerf: 80, playingStyle: 'Attacking RB', weakFoot: 3, skillMoves: 4, aiValueScore: 82, secretScore: 52, teamColor: '#034694' }),
  mk({ id: 104, name: 'Williamson', gender: 'women', nationality: 'England', country: 'ENG', club: 'Arsenal Women', league: "Women's Super League", leagueId: 'wsl', position: 'DEF', age: 27, height: 172, foot: 'R', marketValue: 0.7, price: 5.5, overall: 85, goals: 1, assists: 2, xG: 0.8, xA: 1.6, passAccuracy: 88, shots: 8, dribbles: 8, tackles: 28, interceptions: 30, minutes: 1800, fitness: 91, injuryStatus: 'fit', injuryType: '', suspension: false, form: [5, 6, 4, 7, 5], popularity: 78, ownership: 38, captainScore: 22, viceScore: 36, expectedPoints: 5.2, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 88, awayPerf: 82, playingStyle: 'Ball-Playing CB', weakFoot: 4, skillMoves: 3, aiValueScore: 78, secretScore: 50, teamColor: '#EF0107' }),
  mk({ id: 105, name: 'Carter', gender: 'women', nationality: 'England', country: 'ENG', club: 'Arsenal Women', league: "Women's Super League", leagueId: 'wsl', position: 'DEF', age: 28, height: 168, foot: 'R', marketValue: 0.4, price: 4.8, overall: 82, goals: 0, assists: 3, xG: 0.2, xA: 2.2, passAccuracy: 84, shots: 6, dribbles: 10, tackles: 24, interceptions: 22, minutes: 1620, fitness: 88, injuryStatus: 'doubt', injuryType: 'Knee', suspension: false, form: [4, 5, 3, 6, 4], popularity: 52, ownership: 18, captainScore: 14, viceScore: 26, expectedPoints: 4.4, fixtureDifficulty: 3, weatherPerf: 80, homePerf: 84, awayPerf: 78, playingStyle: 'Defensive RB', weakFoot: 3, skillMoves: 3, aiValueScore: 70, secretScore: 44, teamColor: '#EF0107' }),
  mk({ id: 106, name: 'Bright', gender: 'women', nationality: 'England', country: 'ENG', club: 'Chelsea Women', league: "Women's Super League", leagueId: 'wsl', position: 'DEF', age: 30, height: 175, foot: 'R', marketValue: 0.5, price: 5.3, overall: 84, goals: 2, assists: 1, xG: 1.0, xA: 0.8, passAccuracy: 86, shots: 10, dribbles: 6, tackles: 26, interceptions: 28, minutes: 1710, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [5, 4, 6, 5, 7], popularity: 64, ownership: 26, captainScore: 18, viceScore: 32, expectedPoints: 4.8, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 86, awayPerf: 80, playingStyle: 'Dominant CB', weakFoot: 3, skillMoves: 3, aiValueScore: 74, secretScore: 48, teamColor: '#034694' }),
  // WSL Mid + FWD
  mk({ id: 107, name: 'James', gender: 'women', nationality: 'England', country: 'ENG', club: 'Chelsea Women', league: "Women's Super League", leagueId: 'wsl', position: 'MID', age: 22, height: 175, foot: 'L', marketValue: 2.5, price: 9.5, overall: 88, goals: 12, assists: 10, xG: 9.8, xA: 7.6, passAccuracy: 86, shots: 64, dribbles: 72, tackles: 22, interceptions: 16, minutes: 1800, fitness: 93, injuryStatus: 'fit', injuryType: '', suspension: false, form: [8, 9, 7, 10, 9], popularity: 94, ownership: 62, captainScore: 86, viceScore: 94, expectedPoints: 7.8, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 92, awayPerf: 82, playingStyle: 'Creative 10', weakFoot: 4, skillMoves: 5, aiValueScore: 92, secretScore: 76, teamColor: '#034694' }),
  mk({ id: 108, name: 'Toone', gender: 'women', nationality: 'England', country: 'ENG', club: 'Man United Women', league: "Women's Super League", leagueId: 'wsl', position: 'MID', age: 24, height: 168, foot: 'R', marketValue: 1.8, price: 7.5, overall: 85, goals: 8, assists: 9, xG: 6.2, xA: 7.2, passAccuracy: 85, shots: 54, dribbles: 48, tackles: 20, interceptions: 14, minutes: 1740, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [7, 6, 8, 7, 9], popularity: 82, ownership: 38, captainScore: 54, viceScore: 72, expectedPoints: 6.6, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 88, awayPerf: 78, playingStyle: 'Playmaking 10', weakFoot: 4, skillMoves: 4, aiValueScore: 84, secretScore: 62, teamColor: '#DA291C' }),
  mk({ id: 109, name: 'Walsh', gender: 'women', nationality: 'England', country: 'ENG', club: 'Chelsea Women', league: "Women's Super League", leagueId: 'wsl', position: 'MID', age: 27, height: 170, foot: 'R', marketValue: 1.5, price: 6.0, overall: 86, goals: 1, assists: 6, xG: 0.6, xA: 4.8, passAccuracy: 91, shots: 12, dribbles: 32, tackles: 34, interceptions: 28, minutes: 1830, fitness: 92, injuryStatus: 'fit', injuryType: '', suspension: false, form: [6, 7, 5, 8, 6], popularity: 78, ownership: 32, captainScore: 28, viceScore: 48, expectedPoints: 5.4, fixtureDifficulty: 2, weatherPerf: 86, homePerf: 88, awayPerf: 84, playingStyle: 'Deep-Lying 6', weakFoot: 4, skillMoves: 3, aiValueScore: 80, secretScore: 55, teamColor: '#034694' }),
  mk({ id: 110, name: 'Russo', gender: 'women', nationality: 'England', country: 'ENG', club: 'Arsenal Women', league: "Women's Super League", leagueId: 'wsl', position: 'FWD', age: 25, height: 178, foot: 'R', marketValue: 2.0, price: 9.0, overall: 86, goals: 14, assists: 6, xG: 11.8, xA: 4.8, passAccuracy: 82, shots: 72, dribbles: 38, tackles: 18, interceptions: 12, minutes: 1800, fitness: 91, injuryStatus: 'fit', injuryType: '', suspension: false, form: [8, 7, 9, 6, 8], popularity: 88, ownership: 52, captainScore: 68, viceScore: 82, expectedPoints: 7.2, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 90, awayPerf: 80, playingStyle: 'Complete Striker', weakFoot: 4, skillMoves: 4, aiValueScore: 88, secretScore: 68, teamColor: '#EF0107' }),
  mk({ id: 111, name: 'Hemp', gender: 'women', nationality: 'England', country: 'ENG', club: 'Man City Women', league: "Women's Super League", leagueId: 'wsl', position: 'FWD', age: 24, height: 170, foot: 'L', marketValue: 1.8, price: 8.5, overall: 85, goals: 11, assists: 9, xG: 8.8, xA: 7.2, passAccuracy: 84, shots: 66, dribbles: 68, tackles: 22, interceptions: 16, minutes: 1740, fitness: 89, injuryStatus: 'fit', injuryType: '', suspension: false, form: [7, 8, 6, 9, 7], popularity: 86, ownership: 46, captainScore: 62, viceScore: 78, expectedPoints: 6.8, fixtureDifficulty: 3, weatherPerf: 84, homePerf: 88, awayPerf: 80, playingStyle: 'Wide Forward', weakFoot: 4, skillMoves: 5, aiValueScore: 86, secretScore: 66, teamColor: '#6CABDD' }),
  mk({ id: 112, name: 'Kelly', gender: 'women', nationality: 'England', country: 'ENG', club: 'Man City Women', league: "Women's Super League", leagueId: 'wsl', position: 'MID', age: 26, height: 168, foot: 'R', marketValue: 1.2, price: 6.5, overall: 83, goals: 6, assists: 8, xG: 4.8, xA: 6.4, passAccuracy: 83, shots: 48, dribbles: 58, tackles: 20, interceptions: 14, minutes: 1620, fitness: 87, injuryStatus: 'fit', injuryType: '', suspension: false, form: [6, 5, 7, 6, 8], popularity: 74, ownership: 28, captainScore: 38, viceScore: 56, expectedPoints: 5.6, fixtureDifficulty: 3, weatherPerf: 82, homePerf: 86, awayPerf: 78, playingStyle: 'Crossing Winger', weakFoot: 4, skillMoves: 4, aiValueScore: 78, secretScore: 58, teamColor: '#6CABDD' }),
  mk({ id: 113, name: 'Stanway', gender: 'women', nationality: 'England', country: 'ENG', club: 'Bayern Women', league: 'Frauen Bundesliga', leagueId: 'fbl', position: 'MID', age: 25, height: 172, foot: 'R', marketValue: 1.4, price: 7.0, overall: 84, goals: 7, assists: 7, xG: 5.6, xA: 5.8, passAccuracy: 85, shots: 58, dribbles: 42, tackles: 26, interceptions: 18, minutes: 1680, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [7, 6, 8, 5, 7], popularity: 76, ownership: 30, captainScore: 44, viceScore: 62, expectedPoints: 6.0, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 86, awayPerf: 80, playingStyle: 'Box-to-Box 8', weakFoot: 4, skillMoves: 4, aiValueScore: 80, secretScore: 60, teamColor: '#DC052D' }),
  mk({ id: 114, name: 'Miedema', gender: 'women', nationality: 'Netherlands', country: 'NED', club: 'Man City Women', league: "Women's Super League", leagueId: 'wsl', position: 'FWD', age: 28, height: 178, foot: 'R', marketValue: 1.5, price: 8.8, overall: 86, goals: 13, assists: 8, xG: 10.6, xA: 6.4, passAccuracy: 83, shots: 70, dribbles: 44, tackles: 16, interceptions: 12, minutes: 1710, fitness: 84, injuryStatus: 'doubt', injuryType: 'Knee', suspension: false, form: [7, 6, 8, 5, 7], popularity: 84, ownership: 38, captainScore: 58, viceScore: 74, expectedPoints: 6.6, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 88, awayPerf: 78, playingStyle: 'False 9', weakFoot: 4, skillMoves: 4, aiValueScore: 84, secretScore: 64, teamColor: '#6CABDD' }),
  // NWSL
  mk({ id: 115, name: 'Smith', gender: 'women', nationality: 'USA', country: 'USA', club: 'Portland Thorns', league: 'NWSL', leagueId: 'nwsl', position: 'FWD', age: 24, height: 173, foot: 'R', marketValue: 2.0, price: 10.5, overall: 89, goals: 16, assists: 7, xG: 13.4, xA: 5.6, passAccuracy: 82, shots: 84, dribbles: 62, tackles: 18, interceptions: 12, minutes: 1800, fitness: 94, injuryStatus: 'fit', injuryType: '', suspension: false, form: [9, 8, 10, 9, 8], popularity: 92, ownership: 56, captainScore: 80, viceScore: 92, expectedPoints: 8.2, fixtureDifficulty: 2, weatherPerf: 86, homePerf: 92, awayPerf: 84, playingStyle: 'Speed Striker', weakFoot: 4, skillMoves: 5, aiValueScore: 92, secretScore: 76, teamColor: '#0057B8' }),
  mk({ id: 116, name: 'Horan', gender: 'women', nationality: 'USA', country: 'USA', club: 'Lyon Women', league: 'Division 1 Feminine', leagueId: 'd1f', position: 'MID', age: 30, height: 178, foot: 'R', marketValue: 1.6, price: 8.0, overall: 87, goals: 9, assists: 10, xG: 7.2, xA: 8.4, passAccuracy: 88, shots: 56, dribbles: 44, tackles: 28, interceptions: 22, minutes: 1800, fitness: 92, injuryStatus: 'fit', injuryType: '', suspension: false, form: [7, 8, 6, 9, 7], popularity: 88, ownership: 42, captainScore: 60, viceScore: 78, expectedPoints: 6.8, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 88, awayPerf: 82, playingStyle: 'Box-to-Box 8', weakFoot: 4, skillMoves: 4, aiValueScore: 86, secretScore: 64, teamColor: '#0066B2' }),
  mk({ id: 117, name: 'Lavelle', gender: 'women', nationality: 'USA', country: 'USA', club: 'Gotham FC', league: 'NWSL', leagueId: 'nwsl', position: 'MID', age: 29, height: 165, foot: 'R', marketValue: 1.3, price: 7.5, overall: 85, goals: 7, assists: 9, xG: 5.4, xA: 7.2, passAccuracy: 86, shots: 52, dribbles: 56, tackles: 24, interceptions: 16, minutes: 1620, fitness: 88, injuryStatus: 'doubt', injuryType: 'Hip', suspension: false, form: [6, 7, 5, 8, 6], popularity: 82, ownership: 34, captainScore: 48, viceScore: 66, expectedPoints: 6.2, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 86, awayPerf: 78, playingStyle: 'Creative 10', weakFoot: 4, skillMoves: 5, aiValueScore: 82, secretScore: 62, teamColor: '#003F87' }),
  mk({ id: 118, name: 'Girma', gender: 'women', nationality: 'USA', country: 'USA', club: 'San Diego Wave', league: 'NWSL', leagueId: 'nwsl', position: 'DEF', age: 24, height: 175, foot: 'R', marketValue: 1.5, price: 5.5, overall: 86, goals: 1, assists: 2, xG: 0.4, xA: 1.6, passAccuracy: 87, shots: 8, dribbles: 8, tackles: 30, interceptions: 34, minutes: 1800, fitness: 94, injuryStatus: 'fit', injuryType: '', suspension: false, form: [6, 7, 5, 8, 6], popularity: 78, ownership: 30, captainScore: 22, viceScore: 38, expectedPoints: 5.2, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 88, awayPerf: 82, playingStyle: 'Ball-Carrying CB', weakFoot: 3, skillMoves: 3, aiValueScore: 80, secretScore: 58, teamColor: '#002D72' }),
  mk({ id: 119, name: 'Naeher', gender: 'women', nationality: 'USA', country: 'USA', club: 'Chicago Stars', league: 'NWSL', leagueId: 'nwsl', position: 'GK', age: 36, height: 173, foot: 'R', marketValue: 0.5, price: 5.2, overall: 85, goals: 0, assists: 0, xG: 0, xA: 0, passAccuracy: 78, shots: 0, dribbles: 0, tackles: 0, interceptions: 11, minutes: 1800, fitness: 88, injuryStatus: 'fit', injuryType: '', suspension: false, form: [4, 5, 3, 6, 4], popularity: 62, ownership: 24, captainScore: 10, viceScore: 22, expectedPoints: 4.2, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 86, awayPerf: 80, playingStyle: 'Reactive Keeper', weakFoot: 3, skillMoves: 2, aiValueScore: 64, secretScore: 40, teamColor: '#102141' }),
  mk({ id: 120, name: 'Swanson', gender: 'women', nationality: 'USA', country: 'USA', club: 'Chicago Stars', league: 'NWSL', leagueId: 'nwsl', position: 'FWD', age: 26, height: 168, foot: 'R', marketValue: 1.8, price: 9.2, overall: 87, goals: 14, assists: 6, xG: 11.2, xA: 4.8, passAccuracy: 82, shots: 76, dribbles: 64, tackles: 16, interceptions: 12, minutes: 1740, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [8, 7, 9, 6, 8], popularity: 90, ownership: 48, captainScore: 70, viceScore: 84, expectedPoints: 7.4, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 90, awayPerf: 82, playingStyle: 'Speed Winger', weakFoot: 4, skillMoves: 5, aiValueScore: 88, secretScore: 70, teamColor: '#102141' }),
  // Liga F / Spain
  mk({ id: 121, name: 'Bonmati', gender: 'women', nationality: 'Spain', country: 'ESP', club: 'Barcelona Women', league: 'Liga F', leagueId: 'ligaf', position: 'MID', age: 26, height: 170, foot: 'R', marketValue: 2.5, price: 10.0, overall: 90, goals: 13, assists: 12, xG: 9.8, xA: 9.6, passAccuracy: 89, shots: 62, dribbles: 64, tackles: 26, interceptions: 20, minutes: 1860, fitness: 93, injuryStatus: 'fit', injuryType: '', suspension: false, form: [9, 8, 10, 9, 8], popularity: 96, ownership: 58, captainScore: 88, viceScore: 96, expectedPoints: 8.4, fixtureDifficulty: 2, weatherPerf: 86, homePerf: 94, awayPerf: 84, playingStyle: 'Complete 10', weakFoot: 4, skillMoves: 5, aiValueScore: 95, secretScore: 80, teamColor: '#A50044' }),
  mk({ id: 122, name: 'Putellas', gender: 'women', nationality: 'Spain', country: 'ESP', club: 'Barcelona Women', league: 'Liga F', leagueId: 'ligaf', position: 'MID', age: 30, height: 173, foot: 'L', marketValue: 2.2, price: 9.8, overall: 89, goals: 15, assists: 9, xG: 11.8, xA: 7.4, passAccuracy: 87, shots: 70, dribbles: 56, tackles: 22, interceptions: 16, minutes: 1800, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [8, 9, 7, 10, 8], popularity: 94, ownership: 54, captainScore: 84, viceScore: 92, expectedPoints: 8.0, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 92, awayPerf: 82, playingStyle: 'Attacking 10', weakFoot: 4, skillMoves: 5, aiValueScore: 93, secretScore: 78, teamColor: '#A50044' }),
  mk({ id: 123, name: 'Geyoro', gender: 'women', nationality: 'France', country: 'FRA', club: 'PSG Women', league: 'Division 1 Feminine', leagueId: 'd1f', position: 'MID', age: 27, height: 168, foot: 'R', marketValue: 1.0, price: 6.5, overall: 84, goals: 6, assists: 8, xG: 4.6, xA: 6.4, passAccuracy: 87, shots: 44, dribbles: 42, tackles: 28, interceptions: 22, minutes: 1740, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [6, 7, 5, 8, 6], popularity: 74, ownership: 28, captainScore: 40, viceScore: 58, expectedPoints: 5.8, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 86, awayPerf: 80, playingStyle: 'Box-to-Box 8', weakFoot: 4, skillMoves: 4, aiValueScore: 78, secretScore: 56, teamColor: '#004170' }),
  mk({ id: 124, name: 'Diani', gender: 'women', nationality: 'France', country: 'FRA', club: 'Lyon Women', league: 'Division 1 Feminine', leagueId: 'd1f', position: 'FWD', age: 29, height: 170, foot: 'R', marketValue: 1.4, price: 8.5, overall: 86, goals: 12, assists: 7, xG: 9.8, xA: 5.6, passAccuracy: 82, shots: 68, dribbles: 58, tackles: 18, interceptions: 14, minutes: 1740, fitness: 88, injuryStatus: 'fit', injuryType: '', suspension: false, form: [7, 8, 6, 9, 7], popularity: 84, ownership: 40, captainScore: 60, viceScore: 76, expectedPoints: 6.8, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 88, awayPerf: 80, playingStyle: 'Power Winger', weakFoot: 4, skillMoves: 5, aiValueScore: 85, secretScore: 66, teamColor: '#0066B2' }),
  mk({ id: 125, name: 'Renard', gender: 'women', nationality: 'France', country: 'FRA', club: 'Lyon Women', league: 'Division 1 Feminine', leagueId: 'd1f', position: 'DEF', age: 34, height: 187, foot: 'R', marketValue: 0.6, price: 5.5, overall: 86, goals: 4, assists: 2, xG: 2.4, xA: 1.6, passAccuracy: 86, shots: 16, dribbles: 6, tackles: 28, interceptions: 32, minutes: 1740, fitness: 86, injuryStatus: 'fit', injuryType: '', suspension: false, form: [6, 5, 7, 6, 8], popularity: 80, ownership: 36, captainScore: 26, viceScore: 42, expectedPoints: 5.4, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 88, awayPerf: 82, playingStyle: 'Dominant CB', weakFoot: 3, skillMoves: 2, aiValueScore: 78, secretScore: 50, teamColor: '#0066B2' }),
  mk({ id: 126, name: 'Kerr', gender: 'women', nationality: 'Australia', country: 'AUS', club: 'Chelsea Women', league: "Women's Super League", leagueId: 'wsl', position: 'FWD', age: 31, height: 170, foot: 'R', marketValue: 2.0, price: 11.0, overall: 89, goals: 17, assists: 6, xG: 14.2, xA: 4.8, passAccuracy: 82, shots: 82, dribbles: 54, tackles: 16, interceptions: 12, minutes: 1680, fitness: 78, injuryStatus: 'injured', injuryType: 'ACL', suspension: false, form: [9, 8, 10, 7, 9], popularity: 92, ownership: 44, captainScore: 76, viceScore: 88, expectedPoints: 8.6, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 94, awayPerf: 84, playingStyle: 'Complete Striker', weakFoot: 4, skillMoves: 4, aiValueScore: 90, secretScore: 72, teamColor: '#034694' }),
  mk({ id: 127, name: 'Graham Hansen', gender: 'women', nationality: 'Norway', country: 'NOR', club: 'Barcelona Women', league: 'Liga F', leagueId: 'ligaf', position: 'MID', age: 29, height: 170, foot: 'R', marketValue: 2.0, price: 10.2, overall: 89, goals: 11, assists: 14, xG: 8.8, xA: 11.2, passAccuracy: 85, shots: 60, dribbles: 78, tackles: 20, interceptions: 14, minutes: 1800, fitness: 90, injuryStatus: 'fit', injuryType: '', suspension: false, form: [9, 8, 10, 9, 8], popularity: 94, ownership: 50, captainScore: 82, viceScore: 92, expectedPoints: 8.2, fixtureDifficulty: 2, weatherPerf: 84, homePerf: 94, awayPerf: 82, playingStyle: 'Dribbling Winger', weakFoot: 5, skillMoves: 5, aiValueScore: 93, secretScore: 76, teamColor: '#A50044' }),
  mk({ id: 128, name: 'Caldentey', gender: 'women', nationality: 'Spain', country: 'ESP', club: 'Arsenal Women', league: "Women's Super League", leagueId: 'wsl', position: 'MID', age: 28, height: 168, foot: 'L', marketValue: 1.2, price: 7.0, overall: 85, goals: 8, assists: 10, xG: 6.2, xA: 7.8, passAccuracy: 86, shots: 52, dribbles: 54, tackles: 22, interceptions: 16, minutes: 1710, fitness: 89, injuryStatus: 'fit', injuryType: '', suspension: false, form: [7, 6, 8, 7, 9], popularity: 80, ownership: 32, captainScore: 50, viceScore: 68, expectedPoints: 6.4, fixtureDifficulty: 2, weatherPerf: 82, homePerf: 88, awayPerf: 80, playingStyle: 'Wide Playmaker', weakFoot: 4, skillMoves: 5, aiValueScore: 82, secretScore: 64, teamColor: '#EF0107' }),
];

export const ALL_PLAYERS: Player[] = [...MEN, ...WOMEN];

export const MEN_PLAYERS = MEN;
export const WOMEN_PLAYERS = WOMEN;

export function playersByGender(g: Gender): Player[] {
  return ALL_PLAYERS.filter((p) => p.gender === g);
}

export function playersByLeague(leagueId: string): Player[] {
  return ALL_PLAYERS.filter((p) => p.leagueId === leagueId);
}

export function playerById(id: number): Player | undefined {
  return ALL_PLAYERS.find((p) => p.id === id);
}

export function activePlayers(gender: Gender, leagueId?: string): Player[] {
  let list = playersByGender(gender);
  if (leagueId) list = list.filter((p) => p.leagueId === leagueId);
  return list;
}

export function playersByCountry(countryCode: string, gender?: Gender): Player[] {
  return ALL_PLAYERS.filter((p) => p.country === countryCode && (!gender || p.gender === gender));
}

export function availableCountries(gender: Gender): { code: string; name: string; flag: string; count: number }[] {
  const map = new Map<string, number>();
  ALL_PLAYERS.filter((p) => p.gender === gender).forEach((p) => {
    map.set(p.country, (map.get(p.country) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([code, count]) => ({ code, name: COUNTRY_NAMES[code] || code, flag: COUNTRIES[code] || '🏴', count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Default squads per gender (4-3-3, balanced)
export const MEN_DEFAULT_STARTERS = [1, 5, 6, 8, 9, 11, 12, 14, 19, 20, 21];
export const MEN_DEFAULT_BENCH = [2, 7, 15, 22];
export const MEN_DEFAULT_CAPTAIN = 11;
export const MEN_DEFAULT_VICE = 19;

export const WOMEN_DEFAULT_STARTERS = [101, 104, 106, 103, 118, 107, 108, 109, 110, 115, 121];
export const WOMEN_DEFAULT_BENCH = [102, 105, 112, 120];
export const WOMEN_DEFAULT_CAPTAIN = 107;
export const WOMEN_DEFAULT_VICE = 121;
