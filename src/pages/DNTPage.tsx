import { useState, useEffect } from "react";
import {
  getUsers,
  approvePayment,
  getScores,
  saveScore,
  recalcAllPoints,
  PLAYERS,
  type PlayerScore,
} from "@/lib/store";
import AppHeader from "@/components/AppHeader";
import { ShieldCheck, Users, BarChart3, Check, X } from "lucide-react";
import { toast } from "sonner";

const AdminPage = () => {
  const [tab, setTab] = useState<"users" | "scores">("users");
  const [, setTick] = useState(0);

  const refresh = () => setTick((t) => t + 1);

  const users = getUsers();
  const scores = getScores();

  const handleApprove = (email: string) => {
    approvePayment(email);
    toast.success("Payment approved!");
    refresh();
  };

  // ---- Score Input State ----
  const [scoreInputs, setScoreInputs] = useState<Record<string, PlayerScore>>({});

  useEffect(() => {
    const existing = getScores();
    const init: Record<string, PlayerScore> = {};
    PLAYERS.forEach((p) => {
      init[p.id] = existing[p.id] || {
        playerId: p.id,
        runs: 0,
        fours: 0,
        sixes: 0,
        wickets: 0,
        catches: 0,
      };
    });
    setScoreInputs(init);
  }, []);

  const updateField = (
    playerId: string,
    field: keyof Omit<PlayerScore, "playerId">,
    value: string
  ) => {
    setScoreInputs((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: parseInt(value) || 0,
      },
    }));
  };

  const handleSaveScores = () => {
    Object.values(scoreInputs).forEach((s) => saveScore(s));
    recalcAllPoints();
    toast.success("Scores updated & points recalculated!");
    refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setTab("users")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === "users"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <Users className="h-4 w-4" /> Users & Payments
          </button>
          <button
            onClick={() => setTab("scores")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === "scores"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Score Panel
          </button>
        </div>

        {/* Users Tab */}
        {tab === "users" && (
          <div className="space-y-3">
            {Object.values(users).length === 0 ? (
              <p className="text-muted-foreground text-sm">No users yet.</p>
            ) : (
              Object.values(users).map((user) => (
                <div
                  key={user.email}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                >
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                    {user.transactionId && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        TXN: <span className="font-mono text-foreground">{user.transactionId}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {user.paid ? (
                      <span className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                        <Check className="h-3 w-3" /> Approved
                      </span>
                    ) : user.transactionId ? (
                      <button
                        onClick={() => handleApprove(user.email)}
                        className="gradient-primary rounded-lg px-4 py-2 text-xs font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                        <X className="h-3 w-3" /> No Payment
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Scores Tab */}
        {tab === "scores" && (
          <div>
            <div className="mb-4 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-3 text-left font-semibold">Player</th>
                    <th className="px-3 py-3 text-center font-semibold">Runs</th>
                    <th className="px-3 py-3 text-center font-semibold">4s</th>
                    <th className="px-3 py-3 text-center font-semibold">6s</th>
                    <th className="px-3 py-3 text-center font-semibold">Wkts</th>
                    <th className="px-3 py-3 text-center font-semibold">Catches</th>
                  </tr>
                </thead>
                <tbody>
                  {PLAYERS.map((player) => {
                    const s = scoreInputs[player.id];
                    if (!s) return null;
                    return (
                      <tr key={player.id} className="border-b border-border/50">
                        <td className="px-4 py-2">
                          <div className="font-medium">{player.name}</div>
                          <div className="text-xs text-muted-foreground">{player.team}</div>
                        </td>
                        {(["runs", "fours", "sixes", "wickets", "catches"] as const).map(
                          (field) => (
                            <td key={field} className="px-1 py-2 text-center">
                              <input
                                type="number"
                                min={0}
                                value={s[field]}
                                onChange={(e) =>
                                  updateField(player.id, field, e.target.value)
                                }
                                className="w-16 rounded-lg border border-input bg-secondary px-2 py-1.5 text-center text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                              />
                            </td>
                          )
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleSaveScores}
              className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Save All Scores & Recalculate Points
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
