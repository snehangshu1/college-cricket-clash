import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitPayment, getCurrentUser, MATCH } from "@/lib/store";
import AppHeader from "@/components/AppHeader";
import { QrCode, CheckCircle2 } from "lucide-react";

const PaymentPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [txnId, setTxnId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    navigate("/");
    return null;
  }

  if (user.paid) {
    navigate("/team");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnId.trim()) return;
    submitPayment(txnId.trim());
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="mb-2 text-xl font-bold text-center">Complete Payment</h2>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Pay ₹{MATCH.contestFee} to join the contest
          </p>

          {!submitted ? (
            <>
              {/* QR Code placeholder */}
              <div className="mb-6 flex flex-col items-center gap-3 rounded-xl border border-border bg-secondary/50 p-6">
                <QrCode className="h-32 w-32 text-primary" />
                <p className="text-sm font-medium">Scan to pay via UPI</p>
                <p className="text-xs text-muted-foreground">
                  yourname@upi • ₹{MATCH.contestFee}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                  UPI Transaction ID
                </label>
                <input
                  type="text"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  placeholder="Enter 12-digit transaction ID"
                  className="mb-4 w-full rounded-xl border border-input bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
                <button
                  type="submit"
                  className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  I Have Paid
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle2 className="h-16 w-16 text-primary" />
              <h3 className="text-lg font-bold">Payment Submitted!</h3>
              <p className="text-center text-sm text-muted-foreground">
                Your transaction ID has been recorded. Please wait for admin
                approval before selecting your team.
              </p>
              <button
                onClick={() => navigate("/match")}
                className="mt-4 rounded-xl border border-border bg-secondary px-6 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/80"
              >
                Back to Match
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
