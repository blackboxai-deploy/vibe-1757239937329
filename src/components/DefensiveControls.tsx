"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface DefensiveAction {
  caught: boolean;
  goodThrow: boolean;
}

interface DefensiveControlsProps {
  onDefensiveAction: (action: DefensiveAction) => void;
  disabled?: boolean;
  currentAction: DefensiveAction;
}

export default function DefensiveControls({ 
  onDefensiveAction, 
  disabled = false, 
  currentAction 
}: DefensiveControlsProps) {
  
  const updateAction = (field: keyof DefensiveAction, value: boolean) => {
    const newAction = { ...currentAction, [field]: value };
    onDefensiveAction(newAction);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Actions Défensives</CardTitle>
        <p className="text-center text-sm text-gray-600">
          Enregistrez les actions des joueurs défensifs
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Action d'attraper */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">🥎 Réception de la balle</h4>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="caught"
              checked={currentAction.caught}
              onCheckedChange={(checked) => updateAction("caught", !!checked)}
              disabled={disabled}
            />
            <label 
              htmlFor="caught" 
              className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
            >
              Balle attrapée par le défenseur
            </label>
          </div>
          <div className="text-xs text-gray-500 ml-6">
            ✅ Cochez si le joueur défensif a réussi à attraper la balle
          </div>
        </div>

        {/* Action de lancer */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">🎯 Qualité du lancer</h4>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="goodThrow"
              checked={currentAction.goodThrow}
              onCheckedChange={(checked) => updateAction("goodThrow", !!checked)}
              disabled={disabled}
            />
            <label 
              htmlFor="goodThrow" 
              className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
            >
              Lancer précis et bien exécuté
            </label>
          </div>
          <div className="text-xs text-gray-500 ml-6">
            🎯 Cochez si le lancer était précis et dans la bonne direction
          </div>
        </div>

        {/* Résumé de l'action */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-2">📊 Résumé de l'action</h4>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Réception :</span>
              <span className={currentAction.caught ? "text-green-600 font-medium" : "text-red-600"}>
                {currentAction.caught ? "✅ Réussie" : "❌ Ratée"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Lancer :</span>
              <span className={currentAction.goodThrow ? "text-green-600 font-medium" : "text-red-600"}>
                {currentAction.goodThrow ? "✅ Bon lancer" : "❌ Mauvais lancer"}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-2">💡 Instructions</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• <strong>Balle attrapée :</strong> Le défenseur a-t-il réussi à saisir la balle ?</div>
            <div>• <strong>Bon lancer :</strong> Le lancer était-il précis et bien dirigé ?</div>
            <div>• Ces statistiques aideront à évaluer les performances défensives</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}