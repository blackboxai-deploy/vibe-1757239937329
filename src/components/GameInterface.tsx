"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GameState, Player } from "@/types/baseball";
import { useGameState } from "@/hooks/useGameState";
import HitZone from "./HitZone";
import DefensiveControls from "./DefensiveControls";

interface GameInterfaceProps {
  gameState: GameState;
  onGameStateUpdate: (gameState: GameState) => void;
  onGameComplete: (gameState: GameState) => void;
}

export default function GameInterface({ 
  gameState: initialGameState, 
  onGameStateUpdate,
  onGameComplete 
}: GameInterfaceProps) {
  const {
    gameState,
    addGameAction,
    setCurrentBatter,
    nextInning,
    startGame,
    endGame,
  } = useGameState(initialGameState);

  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [actionResult, setActionResult] = useState<"safe" | "out" | null>(null);
  const [defensiveAction, setDefensiveAction] = useState({
    caught: false,
    goodThrow: false,
  });

  // Synchroniser l'état local avec le parent
  useEffect(() => {
    onGameStateUpdate(gameState);
  }, [gameState, onGameStateUpdate]);

  // Démarrer le jeu automatiquement
  useEffect(() => {
    if (!gameState.isGameActive && !gameState.isGameComplete) {
      startGame();
    }
  }, [gameState.isGameActive, gameState.isGameComplete, startGame]);

  const resetActionForm = () => {
    setSelectedZone(null);
    setActionResult(null);
    setDefensiveAction({ caught: false, goodThrow: false });
  };

  const handleSubmitAction = () => {
    if (!gameState.currentBatter || !selectedZone || !actionResult) {
      return;
    }

    const action = {
      inning: gameState.currentInning,
      batterId: gameState.currentBatter,
      batterName: getAllPlayers().find(p => p.id === gameState.currentBatter)?.name || "",
      hitZone: selectedZone,
      result: actionResult,
      defensive: {
        ...defensiveAction,
        fielderId: getRandomDefender()?.id,
      },
    };

    addGameAction(action);
    resetActionForm();
    setCurrentBatter(null);
  };

  const getAllPlayers = (): Player[] => {
    return [...gameState.teams[0].players, ...gameState.teams[1].players];
  };

  const getRandomDefender = (): Player | null => {
    const allPlayers = getAllPlayers();
    const availableDefenders = allPlayers.filter(p => p.id !== gameState.currentBatter);
    if (availableDefenders.length === 0) return null;
    return availableDefenders[Math.floor(Math.random() * availableDefenders.length)];
  };

  const canSubmitAction = () => {
    return selectedZone && actionResult && gameState.currentBatter;
  };

  const handleEndGame = () => {
    endGame();
    onGameComplete(gameState);
  };

  return (
    <div className="space-y-6">
      {/* En-tête du match */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">
              Match en cours - Manche {gameState.currentInning}
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={nextInning} variant="outline">
                Manche Suivante
              </Button>
              <Button onClick={handleEndGame} variant="destructive">
                Terminer le Match
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scores des équipes */}
            {gameState.teams.map((team, index) => (
              <div key={team.id} className="text-center">
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <div className={`text-3xl font-bold ${index === 0 ? "text-blue-600" : "text-red-600"}`}>
                  {team.score}
                </div>
                <div className="text-sm text-gray-500">{team.players.length} joueurs</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sélection du batteur */}
      <Card>
        <CardHeader>
          <CardTitle>
            Sélection du Batteur
            {gameState.currentBatter && (
              <Badge className="ml-2">
                {getAllPlayers().find(p => p.id === gameState.currentBatter)?.name}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameState.teams.map((team, teamIndex) => (
              <div key={team.id}>
                <h4 className={`font-medium mb-3 ${teamIndex === 0 ? "text-blue-600" : "text-red-600"}`}>
                  {team.name}
                </h4>
                <div className="space-y-2">
                  {team.players.map((player) => (
                    <Button
                      key={player.id}
                      onClick={() => setCurrentBatter(player.id)}
                      variant={gameState.currentBatter === player.id ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      <span className="mr-2">{player.position}</span>
                      {player.name}
                      {player.stats.atBats > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {player.stats.hits}/{player.stats.atBats}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interface d'action - seulement si un batteur est sélectionné */}
      {gameState.currentBatter && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Zone de frappe */}
          <HitZone
            selectedZone={selectedZone}
            onZoneSelect={setSelectedZone}
          />

          {/* Contrôles de l'action */}
          <div className="space-y-4">
            {/* Résultat Safe/Out */}
            <Card>
              <CardHeader>
                <CardTitle>Résultat du coup</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setActionResult("safe")}
                    variant={actionResult === "safe" ? "default" : "outline"}
                    className={actionResult === "safe" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    ✅ Safe
                  </Button>
                  <Button
                    onClick={() => setActionResult("out")}
                    variant={actionResult === "out" ? "default" : "outline"}
                    className={actionResult === "out" ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    ❌ Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contrôles défensifs */}
            <DefensiveControls
              currentAction={defensiveAction}
              onDefensiveAction={setDefensiveAction}
            />

            {/* Validation de l'action */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={handleSubmitAction}
                  disabled={!canSubmitAction()}
                  size="lg"
                  className="w-full"
                >
                  📊 Enregistrer l'Action
                </Button>
                {!canSubmitAction() && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Sélectionnez une zone, un résultat et configurez les actions défensives
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Historique récent */}
      {gameState.actions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dernières Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {gameState.actions.slice(-5).reverse().map((action) => (
                <div key={action.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{action.batterName}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      Zone {action.hitZone} - {action.result === "safe" ? "✅ Safe" : "❌ Out"}
                    </span>
                  </div>
                  <Badge variant="outline">Manche {action.inning}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}