import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, getCurrentUser, recalcAllPoints, PLAYERS } from "@/lib/store";
import AppHeader from "@/components/AppHeader";
import { Trophy, Medal, Crown } from "lucide-react";

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }
    recalcAllPoints();
    const interval = setInterval(() => {
      recalcAllPoints();
      setTick((t) => t + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const users = getUsers();
  const sorted = Object.values(users)
    .filter((u) => u.paid && u.team && u.team.length > 0)
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Crown className="h-5 w-5 text-warning" />;
    if (rank === 1) return <Medal className="h-5 w-5 text-muted-foreground" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-warning/60" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold font-display">Leaderboard</h2>
          <span className="ml-auto rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Live
          </span>
        </div>

        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-card">
            <Trophy className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold font-display">No teams yet</h3>
            <p className="text-sm text-muted-foreground">
              Be the first to select your team!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((user, index) => {
              const isMe = user.email === currentUser.email;
              const playerNames = (user.team || [])
                .map((id) => PLAYERS.find((p) => p.id === id)?.name)
                .filter(Boolean);
              const captainName = PLAYERS.find((p) => p.id === user.captain)?.name;

              return (
                <div
                  key={user.email}
                  className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                    isMe
                      ? "border-primary/30 bg-primary/5 shadow-card"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-bold">
                    {getRankIcon(index) || `#${index + 1}`}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold">{user.name}</span>
                      {isMe && (
                        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {playerNames.length} players
                      {captainName && ` • C: ${captainName}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-primary font-display">
                      {(user.points || 0).toFixed(1)}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
