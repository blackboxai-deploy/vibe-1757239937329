"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsDashboard from "@/components/StatsDashboard";
import { GameState } from "@/types/baseball";

export default function ResultsPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les données du match depuis le localStorage
    try {
      const savedGame = localStorage.getItem("baseball5-game-state");
      if (savedGame) {
        const parsedGame = JSON.parse(savedGame);
        setGameState(parsedGame);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const goHome = () => {
    // Nettoyer le localStorage et retourner à l'accueil
    localStorage.removeItem("baseball5-game-state");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="text-center space-y-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Aucun Match Trouvé</CardTitle>
            <CardDescription>
              Il n'y a pas de données de match à afficher
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={goHome} className="w-full">
              Retour à l'Accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          📊 Statistiques Complètes du Match
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Analysez les performances de chaque joueur et équipe avec des statistiques détaillées
          et des visualisations interactives.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={goHome} variant="outline">
            🏠 Nouveau Match
          </Button>
          <Button 
            onClick={() => window.print()} 
            variant="outline"
          >
            🖨️ Imprimer
          </Button>
          <Button 
            onClick={() => {
              const dataStr = JSON.stringify(gameState, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `baseball5-stats-${new Date().toISOString().split('T')[0]}.json`;
              link.click();
            }}
            variant="outline"
          >
            💾 Exporter
          </Button>
        </div>
      </div>

      {/* Dashboard des statistiques */}
      <StatsDashboard gameState={gameState} />

      {/* Actions supplémentaires */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Supplémentaires</CardTitle>
          <CardDescription>
            Que souhaitez-vous faire avec ces statistiques ?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={goHome} className="h-auto py-4 px-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🆕</div>
                <div className="font-medium">Nouveau Match</div>
                <div className="text-xs text-gray-500">Commencer une nouvelle partie</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigator.share && navigator.share({
                title: 'Statistiques Baseball 5',
                text: 'Découvrez mes statistiques de match Baseball 5!',
                url: window.location.href
              })}
              className="h-auto py-4 px-6"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📤</div>
                <div className="font-medium">Partager</div>
                <div className="text-xs text-gray-500">Partager les résultats</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.print()}
              className="h-auto py-4 px-6"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📋</div>
                <div className="font-medium">Rapport PDF</div>
                <div className="text-xs text-gray-500">Imprimer ou sauvegarder</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer avec informations du match */}
      {gameState.endTime && gameState.startTime && (
        <div className="text-center text-sm text-gray-500 border-t pt-6">
          <p>
            Match joué le {new Date(gameState.startTime).toLocaleDateString('fr-FR')} 
            {' '}de {new Date(gameState.startTime).toLocaleTimeString('fr-FR')}
            {' '}à {new Date(gameState.endTime).toLocaleTimeString('fr-FR')}
          </p>
          <p className="mt-1">
            Durée: {Math.round((gameState.endTime - gameState.startTime) / 1000 / 60)} minutes
            {' • '}
            {gameState.actions.length} actions enregistrées
            {' • '}
            {gameState.currentInning} manches jouées
          </p>
        </div>
      )}
    </div>
  );
}