import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";

// TODO: Import useUserStore from your store definition file

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        { email, password }
      );
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // useUserStore.getState().setUser(response.data.user);
      
      navigate({ to: "/chat" });
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + (error.response?.data?.message || error.message));
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-green-600">
              Simple Messenger
            </h1>
          </header>

          <h2 className="text-base font-medium text-zinc-900">Log in</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Welcome back. Enter your details to continue.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-800"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-800"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-xl bg-green-600 px-4 text-sm font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Log in
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-zinc-900 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-500"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
