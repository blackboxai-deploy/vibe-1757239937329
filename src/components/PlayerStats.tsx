"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Player, CalculatedPlayerStats } from "@/types/baseball";
import { calculatePlayerStats, getZoneHeatmapData } from "@/lib/statsCalculator";

interface PlayerStatsProps {
  player: Player & { calculatedStats?: CalculatedPlayerStats };
}

export default function PlayerStats({ player }: PlayerStatsProps) {
  const stats = player.calculatedStats || calculatePlayerStats(player);
  const zoneData = getZoneHeatmapData(player.stats.hitZones);

  const getBattingColor = (average: number) => {
    if (average >= 70) return "bg-green-500";
    if (average >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getDefensiveColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    return "bg-orange-500";
  };

  const getZoneIntensityColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-green-400";
    if (percentage >= 40) return "bg-yellow-400";
    if (percentage >= 20) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-gray-600 text-white text-xs rounded-full flex items-center justify-center">
              {player.position}
            </span>
            {player.name}
          </div>
          <div className="flex gap-1">
            {stats.battingAverage > 0 && (
              <Badge variant="secondary" className="text-xs">
                {stats.atBats} AB
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Statistiques de frappe */}
        {stats.atBats > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Moyenne au bâton</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">{stats.battingAverage}%</span>
                <div className={`w-3 h-3 rounded-full ${getBattingColor(stats.battingAverage)}`}></div>
              </div>
            </div>
            <Progress value={stats.battingAverage} className="h-1.5" />
            <div className="text-xs text-gray-500">
              {stats.hits}/{stats.atBats} hits réussis
            </div>
          </div>
        )}

        {/* Statistiques défensives */}
        {stats.fielding.totalOpportunities > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Défense</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">{stats.defensiveEfficiency}%</span>
                <div className={`w-3 h-3 rounded-full ${getDefensiveColor(stats.defensiveEfficiency)}`}></div>
              </div>
            </div>
            <Progress value={stats.defensiveEfficiency} className="h-1.5" />
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div>Attrapés: {stats.catchingPercentage}%</div>
              <div>Lancers: {stats.throwingAccuracy}%</div>
            </div>
          </div>
        )}

        {/* Mini heatmap des zones */}
        {stats.atBats > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium">Zones de frappe</div>
            <div className="grid grid-cols-3 gap-0.5">
              {zoneData.map((zone) => (
                <div
                  key={zone.zone}
                  className={`
                    aspect-square text-xs font-bold text-white flex items-center justify-center rounded-sm
                    ${zone.attempts > 0 ? getZoneIntensityColor(zone.percentage) : 'bg-gray-200 text-gray-400'}
                  `}
                  title={`Zone ${zone.zone}: ${zone.hits}/${zone.attempts} (${zone.percentage}%)`}
                >
                  {zone.zone}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Meilleure: Zone {stats.bestZone}</span>
              {stats.bestZone !== stats.worstZone && (
                <span>Plus difficile: Zone {stats.worstZone}</span>
              )}
            </div>
          </div>
        )}

        {/* Message si pas de statistiques */}
        {stats.atBats === 0 && stats.fielding.totalOpportunities === 0 && (
          <div className="text-center py-4 text-gray-400">
            <div className="text-xs">Pas encore d'actions enregistrées</div>
            <div className="text-xs">pour ce joueur</div>
          </div>
        )}

        {/* Résumé rapide */}
        {(stats.atBats > 0 || stats.fielding.totalOpportunities > 0) && (
          <div className="border-t pt-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="font-medium text-blue-600">{stats.atBats}</div>
                <div className="text-gray-500">Passages</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-600">{stats.fielding.totalOpportunities}</div>
                <div className="text-gray-500">Défenses</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}