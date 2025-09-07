import { GameState } from "@/types/baseball";

const STORAGE_KEY = "baseball5-game-state";

export function saveGameState(gameState: GameState): void {
  try {
    const serializedState = JSON.stringify(gameState);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
  }
}

export function loadGameState(): GameState | null {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
    return null;
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erreur lors du nettoyage:", error);
  }
}

export function hasExistingGame(): boolean {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    return serializedState !== null;
  } catch (error) {
    console.error("Erreur lors de la vérification:", error);
    return false;
  }
}

// Fonctions utilitaires pour l'export/import
export function exportGameData(gameState: GameState): string {
  return JSON.stringify(gameState, null, 2);
}

export function importGameData(jsonString: string): GameState | null {
  try {
    const gameState = JSON.parse(jsonString);
    // Validation basique de la structure
    if (gameState && gameState.teams && Array.isArray(gameState.teams) && gameState.teams.length === 2) {
      return gameState;
    }
    throw new Error("Format de données invalide");
  } catch (error) {
    console.error("Erreur lors de l'import:", error);
    return null;
  }
}

// Fonction pour générer un rapport de match
export function generateMatchReport(gameState: GameState): string {
  const startDate = new Date(gameState.startTime);
  const endDate = gameState.endTime ? new Date(gameState.endTime) : new Date();
  const duration = Math.round((endDate.getTime() - startDate.getTime()) / 1000 / 60);
  
  let report = `=== RAPPORT DE MATCH BASEBALL 5 ===\n\n`;
  report += `Date: ${startDate.toLocaleDateString('fr-FR')}\n`;
  report += `Heure: ${startDate.toLocaleTimeString('fr-FR')} - ${endDate.toLocaleTimeString('fr-FR')}\n`;
  report += `Durée: ${duration} minutes\n`;
  report += `Manches jouées: ${gameState.currentInning}\n`;
  report += `Actions totales: ${gameState.actions.length}\n\n`;
  
  // Scores
  report += `=== SCORES FINAUX ===\n`;
  report += `${gameState.teams[0].name}: ${gameState.teams[0].score}\n`;
  report += `${gameState.teams[1].name}: ${gameState.teams[1].score}\n\n`;
  
  // Statistiques par équipe
  gameState.teams.forEach((team) => {
    report += `=== ${team.name.toUpperCase()} ===\n`;
    team.players.forEach(player => {
      const avg = player.stats.atBats > 0 ? Math.round((player.stats.hits / player.stats.atBats) * 100) : 0;
      report += `${player.name} (Pos. ${player.position}): ${player.stats.hits}/${player.stats.atBats} (${avg}%)\n`;
    });
    report += `\n`;
  });
  
  // Historique des actions
  report += `=== HISTORIQUE DES ACTIONS ===\n`;
  gameState.actions.forEach((action, index) => {
    report += `${index + 1}. Manche ${action.inning} - ${action.batterName}: Zone ${action.hitZone} → ${action.result.toUpperCase()}\n`;
  });
  
  return report;
}