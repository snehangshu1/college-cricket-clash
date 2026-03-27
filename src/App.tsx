import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "./pages/LoginPage";
import MatchPage from "./pages/MatchPage";
import PaymentPage from "./pages/PaymentPage";
import TeamPage from "./pages/TeamPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import DNTPage from "./pages/DNTPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/match" element={<MatchPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/dnt" element={<DNTPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
