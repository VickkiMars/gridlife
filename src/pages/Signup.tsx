import React from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowLeft } from "lucide-react";

/**
 * Signup Component
 * Aesthetic: Industrial Dark, Neon Blue, Google OAuth Focus
 */
const Signup: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    // OAuth flow would be implemented here
    // For now, redirect to dashboard on signup
    console.log("Initiating Google OAuth flow...");
    navigate("/create");
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email signup not yet implemented");
  };

  return (
    <div className="bg-[#161618] text-gray-200 font-sans antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#27272a] bg-[#161618]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#3b82f6] rounded flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Gridlife.io
            </span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-[#3b82f6] transition-colors text-sm font-mono uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Initialization Protocol
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-white">
              Begin Your <span className="text-[#3b82f6]">Sequence</span>
            </h1>
            <p className="text-gray-400 text-sm font-light">
              Join Gridlife.io and start tracking your daily momentum.
            </p>
          </div>

          {/* Google OAuth Button - Primary CTA */}
          <button
            onClick={handleGoogleSignup}
            className="w-full group relative mb-6 overflow-hidden rounded-lg bg-white text-gray-900 font-semibold py-3 px-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6]/0 via-[#3b82f6]/10 to-[#3b82f6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative flex items-center justify-center gap-3">
              {/* Google Icon */}
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#1f2937" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#1f2937" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#1f2937" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#1f2937" />
              </svg>
              <span>Continue with Google</span>
            </div>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-[#27272a] to-transparent" />
            <span className="text-xs text-gray-500 font-mono uppercase">Or</span>
            <div className="flex-1 h-px bg-gradient-to-l from-[#27272a] to-transparent" />
          </div>

          {/* Email Signup Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="velocity@gridlife.io"
                required
                className="w-full px-4 py-2 bg-[#27272a] border border-[#3f3f46] rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 bg-[#27272a] border border-[#3f3f46] rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/50 transition-colors text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#27272a] hover:bg-[#3b82f6] text-gray-300 hover:text-white font-semibold rounded-lg border border-[#3f3f46] hover:border-[#3b82f6] transition-all duration-200 text-sm uppercase font-mono tracking-wide"
            >
              Create Account
            </button>
          </form>

          {/* Terms & Privacy */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By signing up, you agree to our{" "}
            <a href="#" className="text-[#3b82f6] hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#3b82f6] hover:underline">
              Privacy Policy
            </a>
            .
          </p>

          {/* Signin Link */}
          <div className="text-center mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <a
              href="#"
              className="text-[#3b82f6] hover:underline font-semibold"
            >
              Sign in
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
