"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HitZoneProps {
  selectedZone: number | null;
  onZoneSelect: (zone: number) => void;
  disabled?: boolean;
}

export default function HitZone({ selectedZone, onZoneSelect, disabled = false }: HitZoneProps) {
  const zones = [
    { id: 1, position: "Haut Gauche", row: 0, col: 0 },
    { id: 2, position: "Haut Centre", row: 0, col: 1 },
    { id: 3, position: "Haut Droite", row: 0, col: 2 },
    { id: 4, position: "Milieu Gauche", row: 1, col: 0 },
    { id: 5, position: "Milieu Centre", row: 1, col: 1 },
    { id: 6, position: "Milieu Droite", row: 1, col: 2 },
    { id: 7, position: "Bas Gauche", row: 2, col: 0 },
    { id: 8, position: "Bas Centre", row: 2, col: 1 },
    { id: 9, position: "Bas Droite", row: 2, col: 2 },
  ];

  const getZoneColor = (zoneId: number) => {
    if (disabled) return "bg-gray-100 text-gray-400 cursor-not-allowed";
    if (selectedZone === zoneId) return "bg-blue-600 text-white shadow-lg scale-105";
    return "bg-white hover:bg-blue-50 hover:scale-105 text-gray-700 shadow-sm";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Zone de Frappe</CardTitle>
        <p className="text-center text-sm text-gray-600">
          Cliquez sur la zone où la balle a été frappée
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {zones.map((zone) => (
            <Button
              key={zone.id}
              onClick={() => !disabled && onZoneSelect(zone.id)}
              disabled={disabled}
              className={`
                h-20 w-20 transition-all duration-200 border-2 border-gray-200
                ${getZoneColor(zone.id)}
              `}
              variant="ghost"
            >
              <div className="text-center">
                <div className="text-lg font-bold">{zone.id}</div>
                <div className="text-xs opacity-75 leading-tight">
                  {zone.position.split(' ').map((word, i) => (
                    <div key={i}>{word}</div>
                  ))}
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        {selectedZone && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                {selectedZone}
              </span>
              Zone {selectedZone} sélectionnée
            </div>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500 space-y-1">
            <div>🎯 Zone 5 (Centre) : Coup le plus équilibré</div>
            <div>⚡ Zones 1,3,7,9 (Coins) : Coups plus difficiles</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}