// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import api from "@/lib/axios";
// import { useAuthStore } from "@/store/authStore";

// export default function RegisterPage() {
//   const router = useRouter();
//   const { setAuth } = useAuthStore();
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     contact: "",
//     gender: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [agreed, setAgreed] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async () => {
//     if (!agreed) return setError("Please agree to terms and conditions");
//     if (form.password !== form.confirmPassword)
//       return setError("Passwords do not match");

//     setLoading(true);
//     setError("");
//     try {
//       const { data } = await api.post("/auth/register", {
//         username: form.username,
//         email: form.email,
//         password: form.password,
//         contact: form.contact,
//         gender: form.gender,
//       });
//       setAuth(data.user, data.token);
//       router.push("/dashboard");
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-stretch bg-slate-50">
//       {/* Left Section - Identical to Login for consistency */}
//       <div className="hidden lg:flex relative w-1/3 bg-indigo-900 overflow-hidden">
//         <Image
//           src="/auth-bg1.png"
//           alt="Registration Background"
//           fill
//           priority
//           sizes="33vw"
//           className="object-cover"
//         />
//         <div className="relative z-10 flex flex-col justify-end p-12 w-full bg-gradient-to-t from-indigo-950/90 to-transparent">
//           <h1 className="text-3xl font-bold text-white mb-3">
//             Start Your Excellence
//           </h1>
//           <p className="text-indigo-100 text-base max-w-sm">
//             Create an account today and unlock the full potential of our professional suite.
//           </p>
//         </div>
//         <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
//       </div>

//       {/* Right Section - Registration Form */}
//       <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
//         <div className="w-full max-w-[520px] py-8">
//           {/* Header */}
//           <div className="mb-8 text-center lg:text-left">
//             <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
//               Create account
//             </h2>
//             <p className="text-slate-500 mt-1">
//               Join our community of high-performers.
//             </p>
//           </div>

//           {error && (
//             <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
//               <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
//               <p className="text-red-600 text-sm font-medium">{error}</p>
//             </div>
//           )}

//           <div className="space-y-4">
//             {/* Username & Email Row */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Username</label>
//                 <input
//                   name="username"
//                   placeholder="johndoe"
//                   value={form.username}
//                   onChange={handleChange}
//                   className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
//                 <input
//                   name="email"
//                   type="email"
//                   placeholder="john@example.com"
//                   value={form.email}
//                   onChange={handleChange}
//                   className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
//                 />
//               </div>
//             </div>

//             {/* Passwords Row */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Password</label>
//                 <div className="relative">
//                   <input
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     value={form.password}
//                     onChange={handleChange}
//                     className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                   >
//                     {showPassword ? (
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
//                     ) : (
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
//                     )}
//                   </button>
//                 </div>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Confirm</label>
//                 <div className="relative">
//                   <input
//                     name="confirmPassword"
//                     type={showConfirm ? "text" : "password"}
//                     placeholder="••••••••"
//                     value={form.confirmPassword}
//                     onChange={handleChange}
//                     className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirm(!showConfirm)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                   >
//                     {showConfirm ? (
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
//                     ) : (
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Contact & Gender Row */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Contact</label>
//                 <input
//                   name="contact"
//                   placeholder="+1 (555) 000-0000"
//                   value={form.contact}
//                   onChange={handleChange}
//                   className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Gender</label>
//                 <input
//                   name="gender"
//                   placeholder="e.g. Female"
//                   value={form.gender}
//                   onChange={handleChange}
//                   className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
//                 />
//               </div>
//             </div>

//             {/* Terms */}
//             <div className="flex items-start gap-3 pt-4 px-1">
//               <div className="flex items-center h-5">
//                 <input
//                   id="terms"
//                   type="checkbox"
//                   checked={agreed}
//                   onChange={(e) => setAgreed(e.target.checked)}
//                   className="w-5 h-5 accent-indigo-600 rounded border-slate-300 transition-all cursor-pointer"
//                 />
//               </div>
//               <label htmlFor="terms" className="text-sm text-slate-500 leading-tight cursor-pointer select-none">
//                 I agree to the <span className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 transition-colors">Terms of Service</span> and <span className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 transition-colors">Privacy Policy</span>.
//               </label>
//             </div>

//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full relative group overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg shadow-indigo-100 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
//             >
//               <span className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
//                 Create Free Account
//                 <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
//               </span>
//               {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 </div>
//               )}
//             </button>

//             <p className="text-center text-sm text-slate-500 pt-6">
//               Already have an account?{" "}
//               <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
//                 Sign in instead
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!agreed) return setError("Please agree to terms and conditions");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match");
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        contact: form.contact,
        gender: form.gender,
      });
      setAuth(data.user, data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
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

      {/* Dark overlay */}
      {/* <div className="absolute inset-0 bg-black/30 z-10" /> */}

      {/* Register card */}
      <div className="relative z-20 w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Create your account
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          One step closer towards{" "}
          <span className="text-purple-400">excellence</span>
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex flex-col gap-4 text-black">
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-gray-500 rounded-lg px-4 py-3 mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-500 rounded-lg px-4 py-3 mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative mt-1">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-500 rounded-lg px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600">Confirm Password</label>
              <div className="relative mt-1">
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-500 rounded-lg px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300 text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                >
                  {showConfirm ? "🙈" : "👁"}
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-600">Contact</label>
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                className="w-full border border-gray-500 rounded-lg px-4 py-3 mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full border border-gray-500 rounded-lg px-4 py-3 mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 accent-purple-500"
            />
            <p className="text-xs text-gray-500">
              by signing up, I agree with all the{" "}
              <span className="text-blue-500 cursor-pointer hover:underline">
                TERMS & CONDITIONS
              </span>
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-400 hover:bg-green-500 text-white py-3 rounded-full font-semibold text-lg transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Signup"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
