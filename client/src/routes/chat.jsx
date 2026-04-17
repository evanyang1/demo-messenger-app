import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/chat")({
  loader: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw redirect({ to: "/" });
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/getUser`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data.user;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // If the token is invalid or expired, clear it and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const user = Route.useLoaderData();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate({ to: "/" });
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Chat</h1>
      <p>
        Welcome back, <span className="text-green-600">{user.name}</span>!
      </p>
      <div className="mt-4 text-sm text-zinc-500">Email: {user.email}</div>
      <button
        onClick={handleLogout}
        className="text-blue-500 hover:underline"
      >
        Logout
      </button>
    </div>
  );
}
