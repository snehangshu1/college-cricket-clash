import { useNavigate } from "react-router-dom";
import { MATCH, getCurrentUser } from "@/lib/store";
import AppHeader from "@/components/AppHeader";
import { Calendar, MapPin, Clock, IndianRupee } from "lucide-react";

const MatchPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  if (!user) {
    navigate("/");
    return null;
  }

  const handleJoin = () => {
    // Flow: select team first, then pay
    navigate("/team");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Match Card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
          {/* Match Header */}
          <div className="gradient-primary px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary-foreground/20 px-3 py-1 text-xs font-bold text-primary-foreground">
                IPL 2026
              </span>
              <div className="flex items-center gap-1 text-xs text-primary-foreground/80">
                <Clock className="h-3 w-3" />
                {MATCH.time}
              </div>
            </div>
          </div>

          {/* Teams */}
          <div className="p-8">
            <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-black text-primary font-display">
                  {MATCH.team1}
                </div>
                <span className="text-sm font-semibold">{MATCH.team1Full}</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-muted-foreground/40 font-display">VS</span>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-warning/10 text-2xl font-black text-warning font-display">
                  {MATCH.team2}
                </div>
                <span className="text-sm font-semibold">{MATCH.team2Full}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {MATCH.date}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {MATCH.venue}
              </div>
            </div>
          </div>

          {/* Contest */}
          <div className="border-t border-border p-6">
            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div>
                <h3 className="font-bold text-foreground font-display">Mega Contest</h3>
                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <IndianRupee className="h-3 w-3" />
                  Entry: ₹{MATCH.contestFee}
                </div>
              </div>
              <button
                onClick={handleJoin}
                className="gradient-primary rounded-xl px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                {user.team && user.team.length > 0 ? "Edit Team" : "Select Team"}
              </button>
            </div>

            {user.transactionId && !user.paid && (
              <div className="mt-4 rounded-xl border border-warning/30 bg-warning/5 p-3 text-center text-sm text-warning font-medium">
                ⏳ Payment submitted — Waiting for admin approval
              </div>
            )}

            {user.paid && (
              <div className="mt-4 rounded-xl border border-success/30 bg-success/5 p-3 text-center text-sm text-success font-medium">
                ✅ Payment approved — You're in the contest!
              </div>
            )}
          </div>
        </div>

        {/* Point System */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-bold font-display">Point System</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { label: "1 Run", pts: "0.5 pts" },
              { label: "Boundary (4)", pts: "3 pts" },
              { label: "Six (6)", pts: "4 pts" },
              { label: "Wicket", pts: "4 pts" },
              { label: "Catch", pts: "3 pts" },
              { label: "Out", pts: "4 pts" },
              { label: "Hat-trick", pts: "8 pts" },
              { label: "No Ball", pts: "3 pts" },
              { label: "Catch Out", pts: "3 pts" },
              { label: "Captain", pts: "2× points" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-muted/50 p-3 text-center"
              >
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="mt-1 text-sm font-bold text-primary">{item.pts}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchPage;
