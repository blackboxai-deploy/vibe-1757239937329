"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player, CalculatedPlayerStats } from "@/types/baseball";

interface HeatMapProps {
  title: string;
  players: (Player & { calculatedStats: CalculatedPlayerStats })[];
  teamColor: "blue" | "red";
}

export default function HeatMap({ title, players, teamColor }: HeatMapProps) {
  // Calculer les données agrégées de toutes les zones pour l'équipe
  const aggregatedZones = Array.from({ length: 9 }, (_, index) => {
    const zoneNumber = index + 1;
    let totalHits = 0;
    let totalAttempts = 0;

    players.forEach(player => {
      const zoneKey = `zone${zoneNumber}` as keyof typeof player.stats.hitZones;
      const zoneStats = player.stats.hitZones[zoneKey];
      totalHits += zoneStats.hits;
      totalAttempts += zoneStats.attempts;
    });

    const percentage = totalAttempts > 0 ? (totalHits / totalAttempts) * 100 : 0;

    return {
      zone: zoneNumber,
      hits: totalHits,
      attempts: totalAttempts,
      percentage: Math.round(percentage * 100) / 100,
    };
  });

  const getZoneColor = (percentage: number, attempts: number) => {
    if (attempts === 0) return "bg-gray-100 text-gray-400";
    
    const baseColor = teamColor === "blue" ? "blue" : "red";
    
    if (percentage >= 80) return `bg-${baseColor}-600 text-white`;
    if (percentage >= 60) return `bg-${baseColor}-500 text-white`;
    if (percentage >= 40) return `bg-${baseColor}-400 text-white`;
    if (percentage >= 20) return `bg-${baseColor}-300 text-gray-800`;
    return `bg-${baseColor}-200 text-gray-700`;
  };

  const maxAttempts = Math.max(...aggregatedZones.map(zone => zone.attempts));
  const maxPercentage = Math.max(...aggregatedZones.map(zone => zone.percentage));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
        <div className="text-center text-sm text-gray-600">
          Carte de chaleur des zones de frappe
        </div>
      </CardHeader>
      <CardContent>
        {/* Grille principale */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {aggregatedZones.map((zone) => (
              <div
                key={zone.zone}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-lg border-2 
                  transition-all duration-200 hover:scale-105 cursor-pointer
                  ${getZoneColor(zone.percentage, zone.attempts)}
                `}
                title={`Zone ${zone.zone}: ${zone.hits}/${zone.attempts} hits (${zone.percentage}%)`}
              >
                <div className="font-bold text-lg">{zone.zone}</div>
                <div className="text-xs opacity-90">
                  {zone.percentage > 0 ? `${zone.percentage}%` : "-"}
                </div>
                <div className="text-xs opacity-75">
                  {zone.attempts > 0 ? `${zone.hits}/${zone.attempts}` : "0/0"}
                </div>
              </div>
            ))}
          </div>

          {/* Légende */}
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-700">Légende de Performance</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded bg-${teamColor}-600`}></div>
                  <span>Excellente (80%+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded bg-${teamColor}-500`}></div>
                  <span>Bonne (60-79%)</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded bg-${teamColor}-400`}></div>
                  <span>Correcte (40-59%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded bg-${teamColor}-300`}></div>
                  <span>Faible (20-39%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques résumées */}
          <div className="border-t pt-3">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-gray-700">Zone Favorite</div>
                <div className={`text-${teamColor}-600 font-bold`}>
                  {aggregatedZones.find(zone => zone.percentage === maxPercentage)?.zone || "-"}
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Plus Active</div>
                <div className={`text-${teamColor}-600 font-bold`}>
                  {aggregatedZones.find(zone => zone.attempts === maxAttempts)?.zone || "-"}
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Total Hits</div>
                <div className={`text-${teamColor}-600 font-bold`}>
                  {aggregatedZones.reduce((sum, zone) => sum + zone.hits, 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Analyse rapide */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">💡 Analyse Rapide</div>
            <div className="text-xs text-gray-600 space-y-1">
              {maxPercentage >= 80 && (
                <div>✨ Excellente performance sur certaines zones</div>
              )}
              {maxAttempts >= 5 && (
                <div>🎯 Zone {aggregatedZones.find(zone => zone.attempts === maxAttempts)?.zone} très sollicitée</div>
              )}
              {aggregatedZones.filter(zone => zone.attempts > 0).length >= 7 && (
                <div>📊 Bonne répartition des coups sur le terrain</div>
              )}
              {aggregatedZones.filter(zone => zone.percentage >= 50).length >= 5 && (
                <div>🏆 Stratégie de frappe efficace</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}