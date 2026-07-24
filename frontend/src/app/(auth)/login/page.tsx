"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      setAuth(data.user, data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

const handleGoogle = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiUrl) {
    setError('Google login is not configured.');
    return;
  }

  const backendUrl = apiUrl.replace(/\/api\/?$/, '');
  window.location.assign(`${backendUrl}/api/auth/google`);
};

  return (
    <div className="min-h-screen relative flex items-center justify-end pr-50">
      {/* Full page background image */}
      <Image
        src="/auth.png"
        alt="Background"
        fill
        sizes="100vw"
        className="object-center"
        priority
      />

      {/* Login card */}
      <div className="relative z-20 w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Login into your account
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Continue your journey of{" "}
          <span className="text-purple-400">excellence</span>
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex flex-col gap-4 text-black">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full border border-gray-500 rounded-lg px-4 py-3 mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative mt-1">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-gray-500 rounded-lg px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            <Link
              href="/forgot-password"
              className="text-right text-xs text-purple-400 mt-1 hover:underline block"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-400 hover:bg-green-500 text-white py-3 rounded-full font-semibold text-lg transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={handleGoogle}
            className="w-full border border-gray-200 bg-white py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            <span className="text-gray-700 font-medium">
              Sign in with Google
            </span>
          </button>

          <p className="text-center text-sm text-gray-500">
            New Here?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
