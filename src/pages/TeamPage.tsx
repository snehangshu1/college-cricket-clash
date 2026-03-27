import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, PLAYERS, saveTeam } from "@/lib/store";
import AppHeader from "@/components/AppHeader";
import { Check, Star, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

const ROLE_LABELS: Record<string, string> = {
  BAT: "Batsman",
  BOWL: "Bowler",
  AR: "All-Rounder",
  WK: "Wicketkeeper",
};

const TeamPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [selected, setSelected] = useState<string[]>(user?.team || []);
  const [captain, setCaptain] = useState<string>(user?.captain || "");
  const [filter, setFilter] = useState<string>("ALL");

  if (!user) {
    navigate("/");
    return null;
  }

  // Not paid — show blocked state
  if (!user.paid) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
          <ShieldAlert className="h-16 w-16 text-warning" />
          <h2 className="text-xl font-bold">Waiting for Approval</h2>
          <p className="text-sm text-muted-foreground">
            Your payment must be approved by the admin before you can select
            your team. Please check back later.
          </p>
          <button
            onClick={() => navigate("/match")}
            className="mt-4 rounded-xl border border-border bg-secondary px-6 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/80"
          >
            Back to Match
          </button>
        </div>
      </div>
    );
  }

  const filteredPlayers = useMemo(
    () =>
      filter === "ALL"
        ? PLAYERS
        : PLAYERS.filter((p) => p.role === filter),
    [filter]
  );

  const togglePlayer = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
      if (captain === id) setCaptain("");
    } else {
      if (selected.length >= 7) {
        toast.error("Maximum 7 players allowed");
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
    if (selected.length < 5) {
      toast.error("Select at least 5 players");
      return;
    }
    if (!captain) {
      toast.error("Select a captain");
      return;
    }
    saveTeam(selected, captain);
    toast.success("Team saved successfully!");
    navigate("/leaderboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Select Your Team</h2>
            <p className="text-sm text-muted-foreground">
              Pick 5–7 players and choose 1 captain (2× points)
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-primary">{selected.length}/7</div>
            <div className="text-xs text-muted-foreground">Selected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {["ALL", "BAT", "BOWL", "AR", "WK"].map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === role
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {role === "ALL" ? "All" : ROLE_LABELS[role]}
            </button>
          ))}
        </div>

        {/* Player Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredPlayers.map((player) => {
            const isSelected = selected.includes(player.id);
            const isCaptain = captain === player.id;

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-card hover:border-border/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${
                      player.team === "MI"
                        ? "bg-info/20 text-info"
                        : "bg-warning/20 text-warning"
                    }`}
                  >
                    {player.team}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{player.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {ROLE_LABELS[player.role]} • {player.credits} cr
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Captain toggle */}
                  {isSelected && (
                    <button
                      onClick={() => toggleCaptain(player.id)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                        isCaptain
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                      title="Make Captain"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {/* Select toggle */}
                  <button
                    onClick={() => togglePlayer(player.id)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
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

        {/* Save Button */}
        <div className="sticky bottom-0 mt-6 bg-background pb-4 pt-2">
          <button
            onClick={handleSave}
            disabled={selected.length < 5 || !captain}
            className="gradient-primary w-full rounded-xl py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:hover:scale-100"
          >
            Save Team ({selected.length} players{captain ? " • Captain selected" : ""})
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
