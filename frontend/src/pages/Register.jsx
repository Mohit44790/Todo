
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";

import {
  loginUser,
  registerUser,
} from "../redux/slices/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/login";

  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email.trim() || !password) {
      setLocalError("Please enter email and password.");
      return;
    }

    if (!isLogin && !name.trim()) {
      setLocalError("Please enter your name.");
      return;
    }

    try {
      if (isLogin) {
        await dispatch(
          loginUser({ email: email.trim(), password })
        ).unwrap();
      } else {
        await dispatch(
          registerUser({
            name: name.trim(),
            email: email.trim(),
            password,
          })
        ).unwrap();
      }

      navigate("/onboarding", { replace: true });
    } catch (err) {
      setLocalError(
        typeof err === "string" ? err : "Unable to continue. Please try again."
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f1f2f8] px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-lg">

        <div className="mb-7 text-center">
         

          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {isLogin
              ? "Login to manage your tasks"
              : "Register to start managing your tasks"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-[#4563ed]"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-[#4563ed]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-[#4563ed]"
            />
          </label>

          {(localError || error) && (
            <p className="text-sm text-red-500">
              {localError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-lg bg-[#4563ed] text-sm font-semibold text-white hover:bg-[#344fd1] disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          {" "}

          <Link
            to={isLogin ? "/register" : "/login"}
            className="font-semibold text-[#4563ed]"
          >
            {isLogin ? "Register" : "Login"}
          </Link>
        </p>
      </div>
    </main>
  );
}
