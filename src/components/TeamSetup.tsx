"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GameSetup } from "@/types/baseball";

interface TeamSetupProps {
  onSetupComplete: (setup: GameSetup) => void;
}

export default function TeamSetup({ onSetupComplete }: TeamSetupProps) {
  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [team1Players, setTeam1Players] = useState<string[]>(["", "", "", "", ""]);
  const [team2Players, setTeam2Players] = useState<string[]>(["", "", "", "", ""]);

  const updateTeam1Player = (index: number, name: string) => {
    const newPlayers = [...team1Players];
    newPlayers[index] = name;
    setTeam1Players(newPlayers);
  };

  const updateTeam2Player = (index: number, name: string) => {
    const newPlayers = [...team2Players];
    newPlayers[index] = name;
    setTeam2Players(newPlayers);
  };

  const isValid = () => {
    return (
      team1Name.trim() !== "" &&
      team2Name.trim() !== "" &&
      team1Players.every(name => name.trim() !== "") &&
      team2Players.every(name => name.trim() !== "")
    );
  };

  const handleSubmit = () => {
    if (isValid()) {
      onSetupComplete({
        team1Name: team1Name.trim(),
        team2Name: team2Name.trim(),
        team1Players: team1Players.map(name => name.trim()),
        team2Players: team2Players.map(name => name.trim()),
      });
    }
  };

  const fillDemoData = () => {
    setTeam1Name("Équipe Alpha");
    setTeam1Players(["Alice Martin", "Bob Durand", "Claire Leroy", "David Silva", "Emma Garcia"]);
    setTeam2Name("Équipe Beta");
    setTeam2Players(["Frank Wilson", "Grace Chen", "Hugo Moreau", "Iris Dubois", "Jules Lambert"]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configuration des Équipes</h2>
        <Button onClick={fillDemoData} variant="outline">
          Remplir avec des données d'exemple
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Équipe 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
              Première Équipe
            </CardTitle>
            <CardDescription>
              Configurez le nom de l'équipe et les 5 joueurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="team1-name">Nom de l'équipe</Label>
              <Input
                id="team1-name"
                placeholder="Ex: Les Lions"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Joueurs (5 requis)</Label>
              <div className="space-y-2 mt-2">
                {team1Players.map((player, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <Input
                      placeholder={`Joueur ${index + 1}`}
                      value={player}
                      onChange={(e) => updateTeam1Player(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Équipe 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
              Deuxième Équipe
            </CardTitle>
            <CardDescription>
              Configurez le nom de l'équipe et les 5 joueurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="team2-name">Nom de l'équipe</Label>
              <Input
                id="team2-name"
                placeholder="Ex: Les Aigles"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Joueurs (5 requis)</Label>
              <div className="space-y-2 mt-2">
                {team2Players.map((player, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <Input
                      placeholder={`Joueur ${index + 1}`}
                      value={player}
                      onChange={(e) => updateTeam2Player(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation et démarrage */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {!isValid() && (
              <p className="text-orange-600 text-sm">
                ⚠️ Veuillez remplir tous les champs avant de commencer le match
              </p>
            )}
            <Button 
              onClick={handleSubmit}
              disabled={!isValid()}
              size="lg"
              className="px-8 py-3 text-lg"
            >
              🚀 Commencer le Match
            </Button>
            <p className="text-gray-500 text-sm">
              Une fois le match commencé, vous pourrez enregistrer chaque action sur le terrain
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}