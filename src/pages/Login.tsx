import { useState } from "react";

const API_BASE_URL = "http://localhost:8080/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔐 Attempting login with email:", email);
      console.log("📡 API URL:", `${API_BASE_URL}/auth/login`);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      console.log("📊 Response status:", response.status, response.statusText);
      console.log("📋 Response headers:", response.headers);

      let data;
      try {
        data = await response.json();
        console.log("📦 Response data:", data);
      } catch (parseErr) {
        console.error("❌ Failed to parse JSON response:", parseErr);
        throw new Error(`Invalid response format: ${response.statusText}`);
      }

      if (!response.ok) {
        const errorMessage =
          data.message || data.error || data.msg || "Login failed";
        throw new Error(errorMessage);
      }

      const token = data.token || data.access_token || data.accessToken;

      if (!token) {
        console.error("⚠️ Response data:", data);
        throw new Error(
          "No token received from server. Check server response.",
        );
      }

      localStorage.setItem("authToken", token);
      console.log("✅ Login successful, token stored");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("❌ Login error:", message);
      console.error("Full error object:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Add your Google OAuth logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h4 className="text-2xl font-bold text-gray-800">Sign in here</h4>
          <p className="text-gray-500 mt-2 text-sm">
            Please enter your details
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="exam@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-1 border border-gray-300 focus:ring-1 focus:ring-[#732C2C] focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-1 border border-gray-300 focus:ring-1 focus:ring- focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-[#5a2323] text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "login"}
          </button>
        </form>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <image
              href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext x='0' y='20' font-size='20' fill='%234285F4'%3EG%3C/text%3E%3C/svg%3E"
              width="20"
              height="20"
            />
          </svg>
          <span className="text-gray-700 font-medium">
            Login in with Google
          </span>
        </button>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <a
            href="#signup"
            className="text-[#732c2c] font-semibold hover:underline"
          >
            Create one here
          </a>
        </p>
      </div>
    </div>
  );
}
