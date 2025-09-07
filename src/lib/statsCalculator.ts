import { Player, CalculatedPlayerStats, TeamStats, GameState, HitZoneStats } from "@/types/baseball";

export function calculatePlayerStats(player: Player): CalculatedPlayerStats {
  const stats = player.stats;
  
  // Calcul de la moyenne au bâton
  const battingAverage = stats.atBats > 0 ? (stats.hits / stats.atBats) * 100 : 0;
  
  // Trouver la meilleure et la pire zone
  let bestZone = 1;
  let worstZone = 1;
  let bestPercentage = 0;
  let worstPercentage = 100;
  
  Object.entries(stats.hitZones).forEach(([, zoneStats], index) => {
    const zone = zoneStats as { hits: number; attempts: number };
    if (zone.attempts > 0) {
      const percentage = (zone.hits / zone.attempts) * 100;
      if (percentage > bestPercentage) {
        bestPercentage = percentage;
        bestZone = index + 1;
      }
      if (percentage < worstPercentage) {
        worstPercentage = percentage;
        worstZone = index + 1;
      }
    }
  });
  
  // Calcul du pourcentage d'attrapés
  const totalCatchAttempts = stats.fielding.catches + stats.fielding.missedCatches;
  const catchingPercentage = totalCatchAttempts > 0 ? 
    (stats.fielding.catches / totalCatchAttempts) * 100 : 0;
  
  // Calcul de la précision des lancers
  const totalThrowAttempts = stats.fielding.goodThrows + stats.fielding.badThrows;
  const throwingAccuracy = totalThrowAttempts > 0 ? 
    (stats.fielding.goodThrows / totalThrowAttempts) * 100 : 0;
  
  // Calcul de l'efficacité défensive globale
  const defensiveEfficiency = stats.fielding.totalOpportunities > 0 ?
    ((stats.fielding.catches + stats.fielding.goodThrows) / 
     (stats.fielding.totalOpportunities * 2)) * 100 : 0;

  return {
    ...stats,
    battingAverage: Math.round(battingAverage * 100) / 100,
    bestZone,
    worstZone,
    catchingPercentage: Math.round(catchingPercentage * 100) / 100,
    throwingAccuracy: Math.round(throwingAccuracy * 100) / 100,
    defensiveEfficiency: Math.round(defensiveEfficiency * 100) / 100,
  };
}

export function calculateTeamStats(gameState: GameState): [TeamStats, TeamStats] {
  const teamStats = gameState.teams.map(team => {
    const playersWithStats = team.players.map(player => ({
      ...player,
      calculatedStats: calculatePlayerStats(player),
    }));

    // Calcul de la moyenne d'équipe au bâton
    const totalAtBats = playersWithStats.reduce((sum, player) => sum + player.stats.atBats, 0);
    const totalHits = playersWithStats.reduce((sum, player) => sum + player.stats.hits, 0);
    const teamBattingAverage = totalAtBats > 0 ? (totalHits / totalAtBats) * 100 : 0;

    // Calcul du pourcentage défensif d'équipe
    const totalDefensiveOpportunities = playersWithStats.reduce(
      (sum, player) => sum + player.stats.fielding.totalOpportunities, 0
    );
    const totalSuccessfulDefensive = playersWithStats.reduce(
      (sum, player) => sum + player.stats.fielding.catches + player.stats.fielding.goodThrows, 0
    );
    const teamDefensivePercentage = totalDefensiveOpportunities > 0 ?
      (totalSuccessfulDefensive / (totalDefensiveOpportunities * 2)) * 100 : 0;

    // Meilleurs batteurs (top 3)
    const bestHitters = [...playersWithStats]
      .filter(player => player.stats.atBats > 0)
      .sort((a, b) => b.calculatedStats.battingAverage - a.calculatedStats.battingAverage)
      .slice(0, 3);

    // Meilleurs défenseurs (top 3)
    const bestDefenders = [...playersWithStats]
      .filter(player => player.stats.fielding.totalOpportunities > 0)
      .sort((a, b) => b.calculatedStats.defensiveEfficiency - a.calculatedStats.defensiveEfficiency)
      .slice(0, 3);

    return {
      teamName: team.name,
      players: playersWithStats,
      teamBattingAverage: Math.round(teamBattingAverage * 100) / 100,
      teamDefensivePercentage: Math.round(teamDefensivePercentage * 100) / 100,
      totalScore: team.score,
      bestHitters,
      bestDefenders,
    };
  });

  return [teamStats[0], teamStats[1]];
}

export function getZoneHeatmapData(hitZones: HitZoneStats) {
  return Object.entries(hitZones).map(([zoneName, stats]) => {
    const zoneNumber = parseInt(zoneName.replace('zone', ''));
    const zoneStats = stats as { hits: number; attempts: number };
    const percentage = zoneStats.attempts > 0 ? (zoneStats.hits / zoneStats.attempts) * 100 : 0;
    
    return {
      zone: zoneNumber,
      hits: zoneStats.hits,
      attempts: zoneStats.attempts,
      percentage: Math.round(percentage * 100) / 100,
      intensity: Math.min(percentage / 100, 1), // Pour les couleurs
    };
  });
}

export function getTopPerformers(gameState: GameState) {
  const allPlayers = [...gameState.teams[0].players, ...gameState.teams[1].players];
  const playersWithStats = allPlayers.map(player => ({
    ...player,
    calculatedStats: calculatePlayerStats(player),
  }));

  // Meilleur batteur global
  const topBatter = playersWithStats
    .filter(player => player.stats.atBats > 0)
    .sort((a, b) => b.calculatedStats.battingAverage - a.calculatedStats.battingAverage)[0];

  // Meilleur défenseur global
  const topDefender = playersWithStats
    .filter(player => player.stats.fielding.totalOpportunities > 0)
    .sort((a, b) => b.calculatedStats.defensiveEfficiency - a.calculatedStats.defensiveEfficiency)[0];

  // Joueur le plus actif (le plus d'actions)
  const mostActive = playersWithStats
    .sort((a, b) => (b.stats.atBats + b.stats.fielding.totalOpportunities) - 
                    (a.stats.atBats + a.stats.fielding.totalOpportunities))[0];

  return {
    topBatter,
    topDefender,
    mostActive,
  };
}

export function getMatchSummary(gameState: GameState) {
  const [team1Stats, team2Stats] = calculateTeamStats(gameState);
  const topPerformers = getTopPerformers(gameState);
  
  // Équipe gagnante
  const winner = team1Stats.totalScore > team2Stats.totalScore ? team1Stats : team2Stats;
  const loser = team1Stats.totalScore > team2Stats.totalScore ? team2Stats : team1Stats;
  
  // Statistiques du match
  const totalActions = gameState.actions.length;
  const matchDuration = gameState.endTime && gameState.startTime ? 
    Math.round((gameState.endTime - gameState.startTime) / 1000 / 60) : 0;
  
  const totalHits = gameState.actions.filter(action => action.result === "safe").length;
  const totalOuts = gameState.actions.filter(action => action.result === "out").length;
  const hitRate = totalActions > 0 ? (totalHits / totalActions) * 100 : 0;

  return {
    winner,
    loser,
    totalActions,
    matchDuration,
    totalHits,
    totalOuts,
    hitRate: Math.round(hitRate * 100) / 100,
    topPerformers,
    finalScore: `${winner.totalScore} - ${loser.totalScore}`,
    innings: gameState.currentInning,
  };
}