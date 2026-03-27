import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "@/lib/store";
import { Trophy, LogOut, Shield } from "lucide-react";

const AppHeader = () => {
  const user = getCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const navItems = [
    { path: "/match", label: "Match" },
    { path: "/team", label: "My Team" },
    { path: "/leaderboard", label: "Leaderboard" },
  ];

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/match" className="flex items-center gap-2">
          <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Trophy className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-gradient">CricBattle</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/dnt"
            className="text-muted-foreground transition-colors hover:text-foreground"
            title="Admin Panel"
          >
            <Shield className="h-4 w-4" />
          </Link>
          <span className="text-sm text-muted-foreground">{user.name}</span>
          <button
            onClick={handleLogout}
            className="text-muted-foreground transition-colors hover:text-destructive"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex border-t border-border sm:hidden">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex-1 py-2 text-center text-xs font-medium transition-colors ${
              location.pathname === item.path
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default AppHeader;
