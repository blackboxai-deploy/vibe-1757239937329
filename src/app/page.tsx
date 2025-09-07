"use client";

import { useState } from "react";
import TeamSetup from "@/components/TeamSetup";
import GameInterface from "@/components/GameInterface";
import StatsDashboard from "@/components/StatsDashboard";
import { GamePhase, GameState, GameSetup } from "@/types/baseball";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("setup");
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleGameSetup = (setup: GameSetup) => {
    // Créer l'état initial du jeu
    const initialGameState: GameState = {
      teams: [
        {
          id: "team1",
          name: setup.team1Name,
          players: setup.team1Players.map((name, index) => ({
            id: `team1-player-${index + 1}`,
            name,
            position: index + 1,
            stats: {
              atBats: 0,
              hits: 0,
              hitZones: {
                zone1: { hits: 0, attempts: 0 },
                zone2: { hits: 0, attempts: 0 },
                zone3: { hits: 0, attempts: 0 },
                zone4: { hits: 0, attempts: 0 },
                zone5: { hits: 0, attempts: 0 },
                zone6: { hits: 0, attempts: 0 },
                zone7: { hits: 0, attempts: 0 },
                zone8: { hits: 0, attempts: 0 },
                zone9: { hits: 0, attempts: 0 },
              },
              fielding: {
                catches: 0,
                missedCatches: 0,
                goodThrows: 0,
                badThrows: 0,
                totalOpportunities: 0,
              },
            },
          })),
          score: 0,
        },
        {
          id: "team2",
          name: setup.team2Name,
          players: setup.team2Players.map((name, index) => ({
            id: `team2-player-${index + 1}`,
            name,
            position: index + 1,
            stats: {
              atBats: 0,
              hits: 0,
              hitZones: {
                zone1: { hits: 0, attempts: 0 },
                zone2: { hits: 0, attempts: 0 },
                zone3: { hits: 0, attempts: 0 },
                zone4: { hits: 0, attempts: 0 },
                zone5: { hits: 0, attempts: 0 },
                zone6: { hits: 0, attempts: 0 },
                zone7: { hits: 0, attempts: 0 },
                zone8: { hits: 0, attempts: 0 },
                zone9: { hits: 0, attempts: 0 },
              },
              fielding: {
                catches: 0,
                missedCatches: 0,
                goodThrows: 0,
                badThrows: 0,
                totalOpportunities: 0,
              },
            },
          })),
          score: 0,
        },
      ],
      currentInning: 1,
      currentBatter: null,
      isGameActive: false,
      isGameComplete: false,
      actions: [],
      startTime: Date.now(),
    };

    setGameState(initialGameState);
    setGamePhase("playing");
  };

  const handleGameComplete = (finalGameState: GameState) => {
    setGameState({ ...finalGameState, isGameComplete: true, endTime: Date.now() });
    setGamePhase("completed");
  };

  const resetGame = () => {
    setGameState(null);
    setGamePhase("setup");
  };

  return (
    <div className="space-y-6">
      {gamePhase === "setup" && (
        <div className="text-center space-y-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">Bienvenue au Baseball 5 Statistics</CardTitle>
              <CardDescription className="text-lg">
                Configurez vos équipes et commencez à suivre les statistiques de votre match
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <h3 className="font-semibold">Configuration</h3>
                    <p className="text-sm text-gray-600">Créez vos équipes avec 5 joueurs chacune</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <h3 className="font-semibold">Match</h3>
                    <p className="text-sm text-gray-600">Enregistrez chaque action sur le terrain</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <h3 className="font-semibold">Statistiques</h3>
                    <p className="text-sm text-gray-600">Analysez les performances de chaque joueur</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <TeamSetup onSetupComplete={handleGameSetup} />
        </div>
      )}

      {gamePhase === "playing" && gameState && (
        <GameInterface 
          gameState={gameState} 
          onGameStateUpdate={setGameState}
          onGameComplete={handleGameComplete}
        />
      )}

      {gamePhase === "completed" && gameState && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-2">🏆 Match Terminé !</h2>
            <p className="text-gray-600 mb-6">Découvrez les statistiques complètes du match</p>
            <Button onClick={resetGame} variant="outline" size="lg">
              Nouveau Match
            </Button>
          </div>
          <StatsDashboard gameState={gameState} />
        </div>
      )}
    </div>
  );
}