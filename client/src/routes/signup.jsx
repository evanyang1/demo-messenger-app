import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = (event) => {
    event.preventDefault();
    axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, { email, password, name });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-green-600">
              Messenger
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Create an account to start chatting.
            </p>
          </header>

          <h2 className="text-base font-medium text-zinc-900">Sign up</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Minimal setup. Just the basics.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSignup}>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-zinc-800"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                autoComplete="new-password"
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
              Create account
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-medium text-zinc-900 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-500"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
