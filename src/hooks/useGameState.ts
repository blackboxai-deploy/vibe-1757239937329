"use client";

import { useState, useCallback } from "react";
import { GameState, GameAction, Player } from "@/types/baseball";

export function useGameState(initialGameState: GameState) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const addGameAction = useCallback((action: Omit<GameAction, "id" | "timestamp">) => {
    const newAction: GameAction = {
      ...action,
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    setGameState(prevState => {
      const newState = { ...prevState };
      
      // Ajouter l'action à l'historique
      newState.actions = [...newState.actions, newAction];

      // Mettre à jour les statistiques du batteur
      const batterTeam = newState.teams.find(team => 
        team.players.some(player => player.id === action.batterId)
      );
      
      if (batterTeam) {
        const batterIndex = batterTeam.players.findIndex(player => player.id === action.batterId);
        if (batterIndex !== -1) {
          const batter = { ...batterTeam.players[batterIndex] };
          
          // Incrémenter les passages au bâton
          batter.stats.atBats += 1;
          
          // Si safe, incrémenter les hits
          if (action.result === "safe") {
            batter.stats.hits += 1;
            // Incrémenter le score de l'équipe
            if (batterTeam.id === "team1") {
              newState.teams[0].score += 1;
            } else {
              newState.teams[1].score += 1;
            }
          }
          
          // Mettre à jour les statistiques de zone
          const zoneKey = `zone${action.hitZone}` as keyof typeof batter.stats.hitZones;
          batter.stats.hitZones[zoneKey].attempts += 1;
          if (action.result === "safe") {
            batter.stats.hitZones[zoneKey].hits += 1;
          }
          
          // Remplacer le joueur dans l'équipe
          const teamIndex = newState.teams.findIndex(team => team.id === batterTeam.id);
          newState.teams[teamIndex].players[batterIndex] = batter;
        }
      }

      // Mettre à jour les statistiques défensives (si un défenseur est impliqué)
      if (action.defensive.fielderId) {
        const defenderTeam = newState.teams.find(team => 
          team.players.some(player => player.id === action.defensive.fielderId)
        );
        
        if (defenderTeam) {
          const defenderIndex = defenderTeam.players.findIndex(player => 
            player.id === action.defensive.fielderId
          );
          
          if (defenderIndex !== -1) {
            const defender = { ...defenderTeam.players[defenderIndex] };
            
            // Incrémenter les opportunités défensives
            defender.stats.fielding.totalOpportunities += 1;
            
            // Statistiques d'attrapé
            if (action.defensive.caught) {
              defender.stats.fielding.catches += 1;
            } else {
              defender.stats.fielding.missedCatches += 1;
            }
            
            // Statistiques de lancer
            if (action.defensive.goodThrow) {
              defender.stats.fielding.goodThrows += 1;
            } else {
              defender.stats.fielding.badThrows += 1;
            }
            
            // Remplacer le joueur dans l'équipe
            const teamIndex = newState.teams.findIndex(team => team.id === defenderTeam.id);
            newState.teams[teamIndex].players[defenderIndex] = defender;
          }
        }
      }

      return newState;
    });

    return newAction;
  }, []);

  const setCurrentBatter = useCallback((batterId: string | null) => {
    setGameState(prevState => ({
      ...prevState,
      currentBatter: batterId,
    }));
  }, []);

  const nextInning = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      currentInning: prevState.currentInning + 1,
      currentBatter: null,
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isGameActive: true,
    }));
  }, []);

  const endGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isGameActive: false,
      isGameComplete: true,
      endTime: Date.now(),
      currentBatter: null,
    }));
  }, []);

  const getAllPlayers = useCallback((): Player[] => {
    return [...gameState.teams[0].players, ...gameState.teams[1].players];
  }, [gameState.teams]);

  const getPlayerById = useCallback((playerId: string): Player | null => {
    const allPlayers = getAllPlayers();
    return allPlayers.find(player => player.id === playerId) || null;
  }, [getAllPlayers]);

  const getTeamByPlayerId = useCallback((playerId: string) => {
    return gameState.teams.find(team => 
      team.players.some(player => player.id === playerId)
    );
  }, [gameState.teams]);

  return {
    gameState,
    setGameState,
    addGameAction,
    setCurrentBatter,
    nextInning,
    startGame,
    endGame,
    getAllPlayers,
    getPlayerById,
    getTeamByPlayerId,
  };
}