"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GameState } from "@/types/baseball";
import { calculateTeamStats, getMatchSummary, getTopPerformers } from "@/lib/statsCalculator";
import PlayerStats from "./PlayerStats";
import HeatMap from "./HeatMap";

interface StatsDashboardProps {
  gameState: GameState;
}

export default function StatsDashboard({ gameState }: StatsDashboardProps) {
  const [team1Stats, team2Stats] = calculateTeamStats(gameState);
  const matchSummary = getMatchSummary(gameState);
  const topPerformers = getTopPerformers(gameState);

  return (
    <div className="space-y-6">
      {/* Résumé du match */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">🏆 Résumé du Match</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score final */}
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-gray-600">Score Final</h3>
              <div className="text-4xl font-bold text-green-600">
                {matchSummary.finalScore}
              </div>
              <div className="text-sm text-gray-500">
                {matchSummary.winner.teamName} remporte la victoire !
              </div>
            </div>

            {/* Statistiques générales */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-600">Statistiques Générales</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Actions:</span>
                  <Badge variant="secondary">{matchSummary.totalActions}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Hits Réussis:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {matchSummary.totalHits}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Outs:</span>
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    {matchSummary.totalOuts}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Taux de Réussite:</span>
                  <Badge variant="secondary">{matchSummary.hitRate}%</Badge>
                </div>
              </div>
            </div>

            {/* Top performeurs */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-600">Meilleurs Performeurs</h3>
              <div className="space-y-2">
                {topPerformers.topBatter && (
                  <div className="bg-yellow-50 p-2 rounded">
                    <div className="text-sm font-medium">🏏 Meilleur Batteur</div>
                    <div className="text-xs text-gray-600">{topPerformers.topBatter.name}</div>
                    <div className="text-xs text-yellow-700">
                      {Math.round((topPerformers.topBatter.stats.hits / topPerformers.topBatter.stats.atBats) * 100) || 0}% réussite
                    </div>
                  </div>
                )}
                
                {topPerformers.topDefender && (
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-sm font-medium">🥎 Meilleur Défenseur</div>
                    <div className="text-xs text-gray-600">{topPerformers.topDefender.name}</div>
                    <div className="text-xs text-blue-700">
                      {Math.round((topPerformers.topDefender.stats.fielding.catches / topPerformers.topDefender.stats.fielding.totalOpportunities) * 100) || 0}% efficacité
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparaison des équipes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
              {team1Stats.teamName}
            </CardTitle>
            <CardDescription>Statistiques de l'équipe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Moyenne au Bâton</span>
                <span>{team1Stats.teamBattingAverage}%</span>
              </div>
              <Progress value={team1Stats.teamBattingAverage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Performance Défensive</span>
                <span>{team1Stats.teamDefensivePercentage}%</span>
              </div>
              <Progress value={team1Stats.teamDefensivePercentage} className="h-2" />
            </div>
            <div className="pt-2 border-t">
              <div className="text-sm text-gray-600 mb-2">Top 3 Batteurs</div>
              {team1Stats.bestHitters.map((player, index) => (
                <div key={player.id} className="flex justify-between text-xs py-1">
                  <span>#{index + 1} {player.name}</span>
                  <span>{Math.round((player.stats.hits / player.stats.atBats) * 100) || 0}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-600 rounded-full"></span>
              {team2Stats.teamName}
            </CardTitle>
            <CardDescription>Statistiques de l'équipe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Moyenne au Bâton</span>
                <span>{team2Stats.teamBattingAverage}%</span>
              </div>
              <Progress value={team2Stats.teamBattingAverage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Performance Défensive</span>
                <span>{team2Stats.teamDefensivePercentage}%</span>
              </div>
              <Progress value={team2Stats.teamDefensivePercentage} className="h-2" />
            </div>
            <div className="pt-2 border-t">
              <div className="text-sm text-gray-600 mb-2">Top 3 Batteurs</div>
              {team2Stats.bestHitters.map((player, index) => (
                <div key={player.id} className="flex justify-between text-xs py-1">
                  <span>#{index + 1} {player.name}</span>
                  <span>{Math.round((player.stats.hits / player.stats.atBats) * 100) || 0}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées par joueur */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Statistiques Détaillées par Joueur</CardTitle>
          <CardDescription>
            Performance individuelle de chaque joueur avec cartes de chaleur des zones de frappe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Équipe 1 */}
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-4">{team1Stats.teamName}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {team1Stats.players.map((player) => (
                  <PlayerStats key={player.id} player={player} />
                ))}
              </div>
            </div>

            {/* Équipe 2 */}
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-4">{team2Stats.teamName}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {team2Stats.players.map((player) => (
                  <PlayerStats key={player.id} player={player} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cartes de chaleur globales */}
      <Card>
        <CardHeader>
          <CardTitle>🗺️ Cartes de Chaleur des Zones</CardTitle>
          <CardDescription>
            Visualisation des zones préférées de chaque équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <HeatMap 
              title={team1Stats.teamName}
              players={team1Stats.players}
              teamColor="blue"
            />
            <HeatMap 
              title={team2Stats.teamName}
              players={team2Stats.players}
              teamColor="red"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}