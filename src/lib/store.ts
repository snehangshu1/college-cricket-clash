// ==========================================
// LOCAL STORAGE BASED STORE
// ==========================================

export interface User {
  name: string;
  email: string;
  paid: boolean;
  transactionId?: string;
  team?: string[]; // player IDs
  captain?: string; // player ID
  points?: number;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  role: "BAT" | "BOWL" | "AR" | "WK";
  credits: number;
  image?: string;
}

export interface PlayerScore {
  playerId: string;
  runs: number;
  fours: number;
  sixes: number;
  wickets: number;
  catches: number;
  outs: number;
  hatricks: number;
  noballs: number;
  catchouts: number;
}

// ---- Hardcoded Players for MI vs CSK ----
export const PLAYERS: Player[] = [
  // Mumbai Indians
  { id: "mi1", name: "Rohit Sharma", team: "MI", role: "BAT", credits: 10 },
  { id: "mi2", name: "Ishan Kishan", team: "MI", role: "WK", credits: 9 },
  { id: "mi3", name: "Suryakumar Yadav", team: "MI", role: "BAT", credits: 9.5 },
  { id: "mi4", name: "Tilak Varma", team: "MI", role: "BAT", credits: 8.5 },
  { id: "mi5", name: "Hardik Pandya", team: "MI", role: "AR", credits: 9.5 },
  { id: "mi6", name: "Jasprit Bumrah", team: "MI", role: "BOWL", credits: 9 },
  { id: "mi7", name: "Tim David", team: "MI", role: "BAT", credits: 8 },
  // Chennai Super Kings
  { id: "csk1", name: "MS Dhoni", team: "CSK", role: "WK", credits: 8.5 },
  { id: "csk2", name: "Ruturaj Gaikwad", team: "CSK", role: "BAT", credits: 9.5 },
  { id: "csk3", name: "Devon Conway", team: "CSK", role: "BAT", credits: 9 },
  { id: "csk4", name: "Shivam Dube", team: "CSK", role: "AR", credits: 8.5 },
  { id: "csk5", name: "Ravindra Jadeja", team: "CSK", role: "AR", credits: 9.5 },
  { id: "csk6", name: "Deepak Chahar", team: "CSK", role: "BOWL", credits: 8 },
  { id: "csk7", name: "Matheesha Pathirana", team: "CSK", role: "BOWL", credits: 8 },
];

// ---- Match Info ----
export const MATCH = {
  id: "match1",
  team1: "MI",
  team1Full: "Mumbai Indians",
  team2: "CSK",
  team2Full: "Chennai Super Kings",
  date: "2026-04-05",
  time: "7:30 PM IST",
  venue: "Wankhede Stadium, Mumbai",
  contestFee: 20,
};

// ---- Storage helpers ----
const USERS_KEY = "fc_users";
const CURRENT_USER_KEY = "fc_current_user";
const SCORES_KEY = "fc_scores";

export function getUsers(): Record<string, User> {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveUsers(users: Record<string, User>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loginUser(name: string, email: string): User {
  const users = getUsers();
  if (!users[email]) {
    users[email] = { name, email, paid: false, points: 0 };
    saveUsers(users);
  }
  localStorage.setItem(CURRENT_USER_KEY, email);
  return users[email];
}

export function getCurrentUser(): User | null {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return null;
  const users = getUsers();
  return users[email] || null;
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function submitPayment(transactionId: string) {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return;
  const users = getUsers();
  if (users[email]) {
    users[email].transactionId = transactionId;
    users[email].paid = false;
    saveUsers(users);
  }
}

export function approvePayment(email: string) {
  const users = getUsers();
  if (users[email]) {
    users[email].paid = true;
    saveUsers(users);
  }
}

export function saveTeam(playerIds: string[], captainId: string) {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return;
  const users = getUsers();
  if (users[email]) {
    users[email].team = playerIds;
    users[email].captain = captainId;
    saveUsers(users);
  }
}

export function getScores(): Record<string, PlayerScore> {
  const raw = localStorage.getItem(SCORES_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function saveScore(score: PlayerScore) {
  const scores = getScores();
  scores[score.playerId] = score;
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

// ---- Point Calculation ----
export function calculatePlayerPoints(score: PlayerScore): number {
  const runPoints = score.runs * 0.5;
  const fourPoints = score.fours * 3;
  const sixPoints = score.sixes * 4;
  const wicketPoints = score.wickets * 4;
  const catchPoints = score.catches * 3;
  const outPoints = (score.outs || 0) * 4;
  const hatrickPoints = (score.hatricks || 0) * 8;
  const noballPoints = (score.noballs || 0) * 3;
  const catchoutPoints = (score.catchouts || 0) * 3;
  return runPoints + fourPoints + sixPoints + wicketPoints + catchPoints + outPoints + hatrickPoints + noballPoints + catchoutPoints;
}

export function calculateUserPoints(user: User): number {
  if (!user.team) return 0;
  const scores = getScores();
  let total = 0;
  for (const playerId of user.team) {
    const score = scores[playerId];
    if (score) {
      let pts = calculatePlayerPoints(score);
      if (playerId === user.captain) pts *= 2;
      total += pts;
    }
  }
  return total;
}

export function recalcAllPoints() {
  const users = getUsers();
  for (const email of Object.keys(users)) {
    users[email].points = calculateUserPoints(users[email]);
  }
  saveUsers(users);
}
