export type Gender = 'men' | 'women';

export interface Competition {
  id: string;
  name: string;
  short: string;
  gender: Gender;
  type: 'league' | 'cup';
  country: string;
  flag: string;
}

export const COMPETITIONS: Competition[] = [
  // MEN — Leagues
  { id: 'epl', name: 'Premier League', short: 'EPL', gender: 'men', type: 'league', country: 'England', flag: '🏴' },
  { id: 'laliga', name: 'La Liga', short: 'LLG', gender: 'men', type: 'league', country: 'Spain', flag: '🇪🇸' },
  { id: 'bundesliga', name: 'Bundesliga', short: 'BND', gender: 'men', type: 'league', country: 'Germany', flag: '🇩🇪' },
  { id: 'seriea', name: 'Serie A', short: 'SEA', gender: 'men', type: 'league', country: 'Italy', flag: '🇮🇹' },
  { id: 'ligue1', name: 'Ligue 1', short: 'LG1', gender: 'men', type: 'league', country: 'France', flag: '🇫🇷' },
  { id: 'mls', name: 'MLS', short: 'MLS', gender: 'men', type: 'league', country: 'USA', flag: '🇺🇸' },
  { id: 'spl', name: 'Saudi Pro League', short: 'SPL', gender: 'men', type: 'league', country: 'Saudi Arabia', flag: '🇸🇦' },
  // MEN — Cups
  { id: 'ucl', name: 'UEFA Champions League', short: 'UCL', gender: 'men', type: 'cup', country: 'Europe', flag: '🇪🇺' },
  { id: 'wc', name: 'FIFA World Cup', short: 'WLD', gender: 'men', type: 'cup', country: 'World', flag: '🌐' },
  { id: 'copa', name: 'Copa America', short: 'COP', gender: 'men', type: 'cup', country: 'South America', flag: '🌎' },
  { id: 'asian', name: 'AFC Asian Cup', short: 'ASN', gender: 'men', type: 'cup', country: 'Asia', flag: '🌏' },
  { id: 'afcon', name: 'CAF Africa Cup', short: 'AFN', gender: 'men', type: 'cup', country: 'Africa', flag: '🌍' },
  { id: 'friendly', name: 'International Friendlies', short: 'INT', gender: 'men', type: 'cup', country: 'World', flag: '🌐' },

  // WOMEN — Leagues
  { id: 'wsl', name: "Women's Super League", short: 'WSL', gender: 'women', type: 'league', country: 'England', flag: '🏴' },
  { id: 'ligaf', name: 'Liga F', short: 'LGF', gender: 'women', type: 'league', country: 'Spain', flag: '🇪🇸' },
  { id: 'fbl', name: 'Frauen Bundesliga', short: 'FBL', gender: 'women', type: 'league', country: 'Germany', flag: '🇩🇪' },
  { id: 'saf', name: 'Serie A Femminile', short: 'SAF', gender: 'women', type: 'league', country: 'Italy', flag: '🇮🇹' },
  { id: 'd1f', name: 'Division 1 Feminine', short: 'D1F', gender: 'women', type: 'league', country: 'France', flag: '🇫🇷' },
  { id: 'nwsl', name: 'NWSL', short: 'NWS', gender: 'women', type: 'league', country: 'USA', flag: '🇺🇸' },
  { id: 'weleague', name: 'WE League', short: 'WEL', gender: 'women', type: 'league', country: 'Japan', flag: '🇯🇵' },
  { id: 'aleague', name: 'A-League Women', short: 'ALW', gender: 'women', type: 'league', country: 'Australia', flag: '🇦🇺' },
  // WOMEN — Cups
  { id: 'uwcl', name: 'UEFA Women Champions League', short: 'UWCL', gender: 'women', type: 'cup', country: 'Europe', flag: '🇪🇺' },
  { id: 'wwc', name: "FIFA Women's World Cup", short: 'WWC', gender: 'women', type: 'cup', country: 'World', flag: '🌐' },
  { id: 'weuro', name: "Women's Euro", short: 'WEU', gender: 'women', type: 'cup', country: 'Europe', flag: '🇪🇺' },
  { id: 'wcopa', name: "Women's Copa America", short: 'WCP', gender: 'women', type: 'cup', country: 'South America', flag: '🌎' },
  { id: 'wasian', name: "Women's Asian Cup", short: 'WAC', gender: 'women', type: 'cup', country: 'Asia', flag: '🌏' },
  { id: 'olympic', name: 'Olympic Football', short: 'OLY', gender: 'women', type: 'cup', country: 'World', flag: '🏅' },
];

export function competitionsByGender(g: Gender): Competition[] {
  return COMPETITIONS.filter((c) => c.gender === g);
}
