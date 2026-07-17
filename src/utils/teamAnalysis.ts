import { Player, Formation, BUDGET, FORMATION_SLOTS } from '../data/players';

export interface AIInsight {
  type: 'danger' | 'warning' | 'success' | 'info';
  icon: string;
  title: string;
  detail: string;
  impact: number; // points to add/subtract from rating
}

export interface TeamAnalysis {
  rating: number;
  budgetUsed: number;
  budgetRemaining: number;
  budgetOK: boolean;
  totalXpts: number;
  chemistry: number;
  fitnessAvg: number;
  injuryCount: number;
  positionCoverage: number;
  captainScore: number;
  insights: AIInsight[];
  recommendations: string[];
}

export function analyzeTeam(
  slots: (Player | null)[],
  formation: Formation,
  captain: Player | null,
  viceCaptain: Player | null,
): TeamAnalysis {
  const filled = slots.filter(Boolean) as Player[];
  const formationSlots = FORMATION_SLOTS[formation];

  const budgetUsed = filled.reduce((sum, p) => sum + p.price, 0);
  const budgetRemaining = BUDGET - budgetUsed;
  const budgetOK = budgetRemaining >= 0;

  const totalXpts = filled.reduce((sum, p) => sum + p.expectedPoints, 0);
  const fitnessAvg = filled.length > 0 ? Math.round(filled.reduce((s, p) => s + p.fitness, 0) / filled.length) : 0;
  const injuryCount = filled.filter((p) => p.injuryStatus !== 'fit').length;
  const injuredPlayers = filled.filter((p) => p.injuryStatus !== 'fit');

  const clubs = new Set(filled.map((p) => p.club));
  const chemistry = filled.length > 1 ? Math.round(((filled.length - clubs.size) / (filled.length - 1)) * 100) : 0;

  const captainScore = captain ? Math.min(100, Math.round(captain.expectedPoints * 8 + captain.captainScore * 0.2)) : 0;

  let positionCoverage = 0;
  const groupCounts: Record<string, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  slots.forEach((p, i) => {
    const slot = formationSlots[i];
    if (p && slot) groupCounts[slot.group]++;
  });
  let correctSlots = 0;
  slots.forEach((p, i) => {
    const slot = formationSlots[i];
    if (p && slot && p.position === slot.group) correctSlots++;
  });
  positionCoverage = filled.length > 0 ? Math.round((correctSlots / filled.length) * 100) : 0;

  const insights: AIInsight[] = [];
  const recommendations: string[] = [];
  let rating = 50;

  if (!budgetOK) {
    const over = Math.abs(budgetRemaining).toFixed(1);
    insights.push({ type: 'danger', icon: 'Wallet', title: 'Budget Exceeded', detail: 'Your squad is over budget by ' + over + 'M. Remove a premium player or downgrade to fit.', impact: -15 });
    recommendations.push('Budget exceeded by ' + over + 'M — downgrade a premium pick to stay within ' + BUDGET + 'M.');
  } else if (budgetRemaining < 5) {
    insights.push({ type: 'warning', icon: 'Wallet', title: 'Budget Tight', detail: 'Only ' + budgetRemaining.toFixed(1) + 'M left. Consider downgrading to unlock stronger picks.', impact: -5 });
  } else {
    insights.push({ type: 'success', icon: 'Wallet', title: 'Budget Healthy', detail: budgetRemaining.toFixed(1) + 'M remaining — good spending balance.', impact: +8 });
  }

  if (injuryCount > 0) {
    injuredPlayers.forEach((p) => {
      const status = p.injuryStatus === 'injured' ? 'is injured' : 'is a doubt';
      insights.push({ type: p.injuryStatus === 'injured' ? 'danger' : 'warning', icon: 'HeartPulse', title: p.name + ' ' + status, detail: 'Replace ' + p.name.split(' ').slice(-1)[0] + ' (' + (p.injuryType || 'monitoring') + ') to avoid a likely zero-pointer.', impact: p.injuryStatus === 'injured' ? -12 : -6 });
      recommendations.push('Replace ' + p.name + ' because he is ' + (p.injuryStatus === 'injured' ? 'injured' : 'a doubt') + ' (' + (p.injuryType || 'monitoring') + ').');
    });
  } else {
    insights.push({ type: 'success', icon: 'HeartPulse', title: 'Squad Fully Fit', detail: 'No injury concerns across your starting XI.', impact: +6 });
  }

  if (fitnessAvg < 75) {
    insights.push({ type: 'warning', icon: 'Activity', title: 'Low Squad Fitness', detail: 'Average fitness is ' + fitnessAvg + '%. Fatigue may hurt performance this gameweek.', impact: -8 });
    recommendations.push('Squad fitness averaging ' + fitnessAvg + '% — rotate fatigued players.');
  } else {
    insights.push({ type: 'success', icon: 'Activity', title: 'High Fitness', detail: 'Average fitness ' + fitnessAvg + '% — squad is match-ready.', impact: +5 });
  }

  const midfielders = filled.filter((p) => p.position === 'MID');
  const avgCreativity = midfielders.length > 0 ? midfielders.reduce((s, p) => s + p.xA, 0) / midfielders.length : 0;
  if (midfielders.length > 0 && avgCreativity < 4) {
    insights.push({ type: 'warning', icon: 'Sparkles', title: 'Midfield Lacks Creativity', detail: 'Your midfield averages ' + avgCreativity.toFixed(1) + ' xA. Add a creative playmaker for more chance creation.', impact: -7 });
    recommendations.push('Your midfield lacks creativity — consider adding a high-xA playmaker.');
  }

  if (positionCoverage < 100) {
    const wrong = filled.length - Math.round((positionCoverage / 100) * filled.length);
    insights.push({ type: 'warning', icon: 'Grid3x3', title: 'Position Mismatch', detail: wrong + ' player(s) are out of position. Drag them to matching slots for full chemistry.', impact: -(wrong * 5) });
    recommendations.push(wrong + ' player(s) are out of position — reassign them to matching slots.');
  } else {
    insights.push({ type: 'success', icon: 'Grid3x3', title: 'Perfect Position Coverage', detail: 'Every player is in their natural position.', impact: +8 });
  }

  if (chemistry >= 70) {
    insights.push({ type: 'success', icon: 'Users', title: 'Strong Team Chemistry', detail: chemistry + '% chemistry from shared clubs. Bonus expected points.', impact: +6 });
  } else if (chemistry < 40) {
    insights.push({ type: 'warning', icon: 'Users', title: 'Low Chemistry', detail: 'Only ' + chemistry + '% chemistry. Players from the same club boost synergy.', impact: -4 });
  }

  const weatherPlayers = filled.filter((p) => p.weatherPerf < 70);
  if (weatherPlayers.length > 0) {
    insights.push({ type: 'info', icon: 'CloudRain', title: 'Weather Risk', detail: weatherPlayers.length + ' player(s) perform poorly in wet conditions (rain forecast this gameweek).', impact: -3 });
    recommendations.push('Rain forecast — ' + weatherPlayers.map((p) => p.name).join(', ') + ' underperform in wet weather.');
  }

  const easyFixtures = filled.filter((p) => p.fixtureDifficulty <= 2).sort((a, b) => b.expectedPoints - a.expectedPoints);
  const hardFixtures = filled.filter((p) => p.fixtureDifficulty >= 4);
  if (hardFixtures.length > 0) {
    insights.push({ type: 'warning', icon: 'Calendar', title: 'Tough Fixtures Ahead', detail: hardFixtures.length + ' player(s) face difficult opponents (FDR 4-5).', impact: -6 });
  }
  if (easyFixtures.length > 0 && easyFixtures[0].id !== captain?.id) {
    insights.push({ type: 'info', icon: 'Calendar', title: easyFixtures[0].name + ' Has Easy Fixture', detail: easyFixtures[0].name + ' faces an FDR ' + easyFixtures[0].fixtureDifficulty + ' opponent — strong captain candidate.', impact: 0 });
    recommendations.push(easyFixtures[0].name + ' has a much easier upcoming fixture (FDR ' + easyFixtures[0].fixtureDifficulty + ') — consider captaining.');
  }

  if (captain) {
    if (captain.injuryStatus !== 'fit') {
      insights.push({ type: 'danger', icon: 'Crown', title: 'Captain Injured', detail: 'Your captain ' + captain.name + ' is not fully fit. Reassign the armband.', impact: -10 });
      recommendations.push('Captain ' + captain.name + ' is not fit — reassign the armband to a healthy top scorer.');
    } else if (captain.fixtureDifficulty >= 4) {
      const alt = easyFixtures.find((p) => p.id !== captain.id);
      insights.push({ type: 'warning', icon: 'Crown', title: 'Captain Faces Tough Fixture', detail: captain.name + ' has FDR ' + captain.fixtureDifficulty + '. ' + (alt ? alt.name + ' has an easier game.' : 'Consider a different captain.'), impact: -5 });
      recommendations.push('Captain recommendation changed due to fixture difficulty — ' + (alt ? alt.name + ' has an easier game.' : 'switch to a player with lower FDR.'));
    } else if (weatherPlayers.includes(captain)) {
      insights.push({ type: 'warning', icon: 'Crown', title: 'Captain Weather Risk', detail: 'Captain ' + captain.name + ' underperforms in rain (weather rating ' + captain.weatherPerf + ').', impact: -5 });
      recommendations.push('Captain recommendation changed due to weather — ' + captain.name + ' has a low weather rating.');
    } else {
      insights.push({ type: 'success', icon: 'Crown', title: 'Strong Captain Choice', detail: captain.name + ' — ' + captain.expectedPoints + ' xPts (2x = ' + (captain.expectedPoints * 2).toFixed(1) + '), FDR ' + captain.fixtureDifficulty + '.', impact: +6 });
    }
  }

  if (!viceCaptain) {
    insights.push({ type: 'warning', icon: 'Star', title: 'No Vice Captain', detail: 'Assign a vice captain for cover if your captain misses the gameweek.', impact: -3 });
  }

  const formationRec = recommendFormation(filled, formation);
  if (formationRec) {
    insights.push({ type: 'info', icon: 'LayoutGrid', title: 'Formation Suggestion', detail: formationRec.detail, impact: 0 });
    recommendations.push(formationRec.text);
  }

  rating += insights.reduce((sum, i) => sum + i.impact, 0);
  rating += Math.round(totalXpts * 1.2);
  rating += Math.round(chemistry * 0.15);
  rating += Math.round(fitnessAvg * 0.05);
  if (captain) rating += Math.round(captainScore * 0.1);
  if (viceCaptain) rating += 3;

  return {
    rating: Math.max(0, Math.min(100, rating)),
    budgetUsed,
    budgetRemaining,
    budgetOK,
    totalXpts,
    chemistry,
    fitnessAvg,
    injuryCount,
    positionCoverage,
    captainScore,
    insights,
    recommendations,
  };
}

function recommendFormation(players: Player[], current: Formation): { text: string; detail: string } | null {
  const fwd = players.filter((p) => p.position === 'FWD').length;
  const mid = players.filter((p) => p.position === 'MID').length;
  const def = players.filter((p) => p.position === 'DEF').length;
  if (fwd <= 1 && mid >= 5 && current !== '4-2-3-1') {
    return { text: 'Switch to a 4-2-3-1 formation — you have only ' + fwd + ' striker but ' + mid + ' midfielders.', detail: 'Only ' + fwd + ' forward selected. A 4-2-3-1 would better utilize your ' + mid + ' midfielders.' };
  }
  if (fwd >= 3 && def <= 3 && current !== '3-4-3') {
    return { text: 'Switch to a 3-4-3 formation to maximize your ' + fwd + ' attacking options.', detail: 'You have ' + fwd + ' forwards — a 3-4-3 gets the most attackers on the pitch.' };
  }
  return null;
}

// AI optimization: rebuild the team within budget, respecting country/competition/formation
export function optimizeTeam(
  available: Player[],
  formation: Formation,
  currentSlots: (Player | null)[],
  captainId: number | null,
  viceId: number | null,
): { slots: (Player | null)[]; captainId: number | null; viceId: number | null; swaps: string[] } {
  const slots = FORMATION_SLOTS[formation];
  const used = new Set<number>();
  const result: (Player | null)[] = [...currentSlots];
  const swaps: string[] = [];

  // Step 1: remove injured players and replace with best fit available
  result.forEach((p, i) => {
    if (p && p.injuryStatus === 'injured') {
      const slot = slots[i];
      const replacement = available
        .filter((x) => x.position === slot.group && !used.has(x.id))
        .sort((a, b) => b.aiValueScore - a.aiValueScore)[0];
      if (replacement) {
        swaps.push('Replaced injured ' + p.name + ' with ' + replacement.name);
        used.add(replacement.id);
        result[i] = replacement;
      } else {
        result[i] = null;
      }
    } else if (p) {
      used.add(p.id);
    }
  });

  // Step 2: fill empty slots with best available by position group
  result.forEach((p, i) => {
    if (!p) {
      const slot = slots[i];
      const best = available
        .filter((x) => x.position === slot.group && !used.has(x.id))
        .sort((a, b) => b.aiValueScore - a.aiValueScore)[0];
      if (best) {
        used.add(best.id);
        result[i] = best;
      }
    }
  });

  // Step 3: budget optimization — if over budget, swap most expensive underperformer
  let budgetUsed = result.filter(Boolean).reduce((s, p) => s + (p?.price ?? 0), 0);
  while (budgetUsed > BUDGET && result.some((p) => p)) {
    const overBy = budgetUsed - BUDGET;
    const expensive = result
      .map((p, i) => ({ p, i, valueRatio: p ? p.expectedPoints / p.price : 0 }))
      .filter((x) => x.p)
      .sort((a, b) => a.valueRatio - b.valueRatio)[0];
    if (!expensive || !expensive.p) break;
    const slot = slots[expensive.i];
    const cheaper = available
      .filter((x) => x.position === slot.group && !used.has(x.id) && x.price < (expensive.p?.price ?? 0))
      .sort((a, b) => b.aiValueScore - a.aiValueScore)[0];
    if (cheaper && (expensive.p?.price ?? 0) - cheaper.price >= overBy * 0.5) {
      used.delete(expensive.p!.id);
      used.add(cheaper.id);
      swaps.push('Downgraded ' + expensive.p?.name + ' to ' + cheaper.name + ' to fix budget');
      result[expensive.i] = cheaper;
      budgetUsed = result.filter(Boolean).reduce((s, p) => s + (p?.price ?? 0), 0);
    } else {
      break;
    }
  }

  // Step 4: upgrade cheap slots if budget allows
  budgetUsed = result.filter(Boolean).reduce((s, p) => s + (p?.price ?? 0), 0);
  result.forEach((p, i) => {
    if (!p) return;
    const remaining = BUDGET - budgetUsed;
    if (remaining < 2) return;
    const slot = slots[i];
    const upgrade = available
      .filter((x) => x.position === slot.group && !used.has(x.id) && x.price > p.price && x.price - p.price <= remaining && x.aiValueScore > p.aiValueScore)
      .sort((a, b) => b.aiValueScore - a.aiValueScore)[0];
    if (upgrade) {
      used.delete(p.id);
      used.add(upgrade.id);
      budgetUsed += upgrade.price - p.price;
      swaps.push('Upgraded ' + p.name + ' to ' + upgrade.name);
      result[i] = upgrade;
    }
  });

  // Step 5: pick best captain & vice
  const filled = result.filter(Boolean) as Player[];
  const sorted = [...filled].sort((a, b) => b.expectedPoints - a.expectedPoints);
  const newCaptain = sorted[0]?.id ?? captainId;
  const newVice = sorted[1]?.id ?? viceId;
  if (newCaptain !== captainId && sorted[0]) swaps.push('Captained ' + sorted[0].name + ' (highest xPts: ' + sorted[0].expectedPoints + ')');

  return { slots: result, captainId: newCaptain, viceId: newVice, swaps };
}
