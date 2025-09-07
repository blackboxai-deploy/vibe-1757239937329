// Types pour l'application Baseball 5

export interface Player {
  id: string;
  name: string;
  position: number; // 1-5 pour les positions
  stats: PlayerStats;
}

export interface PlayerStats {
  // Statistiques de frappe
  atBats: number; // Nombre de passages au bâton
  hits: number; // Nombre de coups réussis (safe)
  hitZones: HitZoneStats; // Statistiques par zone
  
  // Statistiques défensives
  fielding: {
    catches: number; // Balles attrapées
    missedCatches: number; // Balles ratées
    goodThrows: number; // Bons lancers
    badThrows: number; // Mauvais lancers
    totalOpportunities: number; // Occasions défensives totales
  };
}

export interface HitZoneStats {
  zone1: { hits: number; attempts: number }; // Haut gauche
  zone2: { hits: number; attempts: number }; // Haut centre
  zone3: { hits: number; attempts: number }; // Haut droite
  zone4: { hits: number; attempts: number }; // Milieu gauche
  zone5: { hits: number; attempts: number }; // Milieu centre
  zone6: { hits: number; attempts: number }; // Milieu droite
  zone7: { hits: number; attempts: number }; // Bas gauche
  zone8: { hits: number; attempts: number }; // Bas centre
  zone9: { hits: number; attempts: number }; // Bas droite
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  score: number;
}

export interface GameAction {
  id: string;
  inning: number;
  batterId: string;
  batterName: string;
  hitZone: number; // 1-9
  result: 'safe' | 'out';
  defensive: {
    caught: boolean;
    goodThrow: boolean;
    fielderId?: string; // ID du joueur défensif impliqué
  };
  timestamp: number;
}

export interface GameState {
  teams: [Team, Team]; // Exactement 2 équipes
  currentInning: number;
  currentBatter: string | null; // ID du batteur actuel
  isGameActive: boolean;
  isGameComplete: boolean;
  actions: GameAction[];
  startTime: number;
  endTime?: number;
}

export interface InningStats {
  inning: number;
  team1Score: number;
  team2Score: number;
  actions: GameAction[];
}

// Types pour les statistiques calculées
export interface CalculatedPlayerStats extends PlayerStats {
  // Pourcentages calculés
  battingAverage: number; // hits / atBats
  bestZone: number; // Zone avec le meilleur pourcentage
  worstZone: number; // Zone avec le plus mauvais pourcentage
  catchingPercentage: number; // catches / (catches + missedCatches)
  throwingAccuracy: number; // goodThrows / (goodThrows + badThrows)
  defensiveEfficiency: number; // Performance défensive globale
}

export interface TeamStats {
  teamName: string;
  players: (Player & { calculatedStats: CalculatedPlayerStats })[];
  teamBattingAverage: number;
  teamDefensivePercentage: number;
  totalScore: number;
  bestHitters: Player[];
  bestDefenders: Player[];
}

// Types pour l'interface utilisateur
export interface GameSetup {
  team1Name: string;
  team2Name: string;
  team1Players: string[]; // Noms des joueurs
  team2Players: string[]; // Noms des joueurs
}

export type GamePhase = 'setup' | 'playing' | 'completed';

export interface UIState {
  currentPhase: GamePhase;
  selectedZone: number | null;
  showStats: boolean;
  selectedPlayer: string | null;
}