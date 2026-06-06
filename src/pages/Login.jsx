import { useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { saveSession, sendOTP, verifyOTP } from "../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await sendOTP(normalizedEmail);
      setEmail(normalizedEmail);
      setStep("otp");
      toast.success("OTP sent! Check your email.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const normalizedOtp = otp.trim();

    if (!/^\d{6}$/.test(normalizedOtp)) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await verifyOTP(email, normalizedOtp);
      saveSession(data);
      toast.success("Signed in successfully.");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100svh-5rem)] items-start justify-center bg-[#f7f2eb] px-4 pb-10 pt-12 md:items-center md:px-8 md:py-12">
      <div className="w-full max-w-md overflow-hidden rounded-md bg-white shadow-[0_10px_36px_rgba(62,49,36,0.08)]">
        <div className="flex items-center justify-center px-5 py-7 sm:p-8">
          <div className="w-full">
            {/* Header */}
            <div className="mb-6">
              <h2 className="clo-card-title text-center text-black">
                {step === "email" ? "Sign in" : "Check your email"}
              </h2>
              {step === "otp" && (
                <p className="mt-1 text-center text-sm text-gray-500">
                  We sent a code to{" "}
                  <span className="font-medium text-black">{email}</span>
                </p>
              )}
            </div>

            {/* EMAIL STEP */}
            {step === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-black">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="h-12 w-full rounded-md border border-[#d7c8b8] bg-white pl-12 pr-4 text-sm outline-none transition focus:border-black"
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm leading-5 text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="flex h-12 w-full items-center justify-center rounded-md bg-black text-sm font-medium uppercase tracking-[2px] text-white transition hover:bg-[#222] disabled:opacity-50">
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* OTP STEP */}
            {step === "otp" && (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-medium text-black">
                    One-Time Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit code"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    maxLength={6}
                    className="h-12 w-full rounded-md border border-[#d7c8b8] bg-white px-4 text-center text-lg tracking-widest outline-none transition focus:border-black"
                  />
                </div>

                {error && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm leading-5 text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.trim().length !== 6}
                  className="flex h-12 w-full items-center justify-center rounded-md bg-black text-sm font-medium uppercase tracking-[2px] text-white transition hover:bg-[#222] disabled:opacity-50">
                  {loading ? "Verifying..." : "Verify Code"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setError("");
                  }}
                  className="w-full text-center text-sm text-gray-500 hover:text-black">
                  &larr; Use a different email
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
