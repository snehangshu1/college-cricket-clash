import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/lib/store";
import { Trophy, Zap, Users, Award } from "lucide-react";

const LoginPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    loginUser(name.trim(), email.trim().toLowerCase());
    navigate("/match");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 gradient-hero">
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="gradient-primary flex h-16 w-16 items-center justify-center rounded-2xl shadow-glow">
          <Trophy className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="font-display text-4xl font-bold text-gradient">CricBattle</h1>
        <p className="text-muted-foreground text-sm">Fantasy Cricket • Play & Win</p>
      </div>

      <div className="mb-10 flex gap-8 text-center">
        {[
          { icon: Zap, label: "Live Points" },
          { icon: Users, label: "Compete" },
          { icon: Award, label: "Win Big" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-elevated"
      >
        <h2 className="mb-6 text-center text-xl font-bold font-display">Join the Game</h2>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Virat"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="virat@college.edu"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <button
          type="submit"
          className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
        >
          Enter Arena
        </button>
      </form>

      <p className="mt-8 text-xs text-muted-foreground">
        Private group contest • Not public betting
      </p>
    </div>
  );
};

export default LoginPage;
