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
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="gradient-primary flex h-16 w-16 items-center justify-center rounded-2xl shadow-glow">
          <Trophy className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-black text-gradient">CricBattle</h1>
        <p className="text-muted-foreground">Fantasy Cricket • Play & Win</p>
      </div>

      {/* Features */}
      <div className="mb-8 flex gap-6 text-center">
        {[
          { icon: Zap, label: "Live Points" },
          { icon: Users, label: "Compete" },
          { icon: Award, label: "Win Big" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <Icon className="h-5 w-5 text-primary" />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-card"
      >
        <h2 className="mb-6 text-center text-xl font-bold">Join the Game</h2>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Virat"
            className="w-full rounded-xl border border-input bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="w-full rounded-xl border border-input bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <button
          type="submit"
          className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Enter Arena
        </button>
      </form>

      <p className="mt-6 text-xs text-muted-foreground">
        Private group contest • Not public betting
      </p>
    </div>
  );
};

export default LoginPage;
