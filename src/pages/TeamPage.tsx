import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, PLAYERS, saveTeam } from "@/lib/store";
import AppHeader from "@/components/AppHeader";
import { Check, Star, Users } from "lucide-react";
import { toast } from "sonner";

const ROLE_LABELS: Record<string, string> = {
  BAT: "Batsman",
  BOWL: "Bowler",
  AR: "All-Rounder",
  WK: "Wicketkeeper",
};

const MAX_PLAYERS = 11;
const MIN_PLAYERS = 5;

const TeamPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [selected, setSelected] = useState<string[]>(user?.team || []);
  const [captain, setCaptain] = useState<string>(user?.captain || "");
  const [filter, setFilter] = useState<string>("ALL");

  const filteredPlayers = useMemo(
    () =>
      filter === "ALL"
        ? PLAYERS
        : PLAYERS.filter((p) => p.role === filter),
    [filter]
  );

  if (!user) {
    navigate("/");
    return null;
  }

  const togglePlayer = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
      if (captain === id) setCaptain("");
    } else {
      if (selected.length >= MAX_PLAYERS) {
        toast.error(`Maximum ${MAX_PLAYERS} players allowed`);
        return;
      }
      setSelected([...selected, id]);
    }
  };

  const toggleCaptain = (id: string) => {
    if (!selected.includes(id)) return;
    setCaptain(captain === id ? "" : id);
  };

  const handleSave = () => {
    if (selected.length < MIN_PLAYERS) {
      toast.error(`Select at least ${MIN_PLAYERS} players`);
      return;
    }
    if (!captain) {
      toast.error("Select a captain");
      return;
    }
    saveTeam(selected, captain);
    toast.success("Team saved!");
    // After saving team, go to payment if not paid
    if (!user.paid && !user.transactionId) {
      navigate("/payment");
    } else {
      navigate("/leaderboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display">Select Your Team</h2>
            <p className="text-sm text-muted-foreground">
              Pick {MIN_PLAYERS}–{MAX_PLAYERS} players and choose 1 captain (2× points)
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-2xl font-black text-primary font-display">{selected.length}/{MAX_PLAYERS}</span>
            </div>
            <div className="text-xs text-muted-foreground">Selected</div>
          </div>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {["ALL", "BAT", "BOWL", "AR", "WK"].map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                filter === role
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {role === "ALL" ? "All" : ROLE_LABELS[role]}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {filteredPlayers.map((player) => {
            const isSelected = selected.includes(player.id);
            const isCaptain = captain === player.id;

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-primary/40 bg-primary/5 shadow-card"
                    : "border-border bg-card hover:border-primary/20 hover:shadow-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold ${
                      player.team === "MI"
                        ? "bg-info/10 text-info"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {player.team}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{player.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {ROLE_LABELS[player.role]} • {player.credits} cr
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected && (
                    <button
                      onClick={() => toggleCaptain(player.id)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                        isCaptain
                          ? "border-primary bg-primary text-primary-foreground shadow-glow"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                      title="Make Captain"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => togglePlayer(player.id)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 mt-6 bg-background/95 backdrop-blur-sm pb-4 pt-3">
          <button
            onClick={handleSave}
            disabled={selected.length < MIN_PLAYERS || !captain}
            className="gradient-primary w-full rounded-xl py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:hover:scale-100"
          >
            Save Team ({selected.length} players{captain ? " • Captain ✓" : ""})
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
