import { useState } from "react";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import axios from "axios";
import ChatInstance from "../components/chat/ChatInstance";
import ListChatPartners from "../components/chat/ListChatPartners";
import { useUserStore } from "../store/useUserStore";

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
      useUserStore.getState().setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // If the token is invalid or expired, clear it and redirect
      localStorage.removeItem("token");
      useUserStore.getState().logout();
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const user = Route.useLoaderData();
  const navigate = useNavigate();

  const [searchUserQuery, setSearchUserQuery] = useState("");

  function handleLogout() {
    localStorage.removeItem("token");
    useUserStore.getState().logout();
    navigate({ to: "/" });
  }

  async function handleAddChatUser() {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/addUserChat`,
        {
          userEmailQuery: searchUserQuery,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Refresh user data from server to get updated conversation list
      const updatedUserResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/getUser`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      useUserStore.getState().setUser(updatedUserResponse.data.user);
      setSearchUserQuery("");
    } catch (error) {
      console.error("Failed to add chat user:", error);
      alert(error.response?.data?.message || "Failed to add user");
    }
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-50 overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-green-600 tracking-tight">
            Messenger
          </h1>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full border border-zinc-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-zinc-600">
              {user.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Find user by email..."
              className="h-9 w-48 sm:w-64 rounded-l-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              value={searchUserQuery}
              onChange={(e) => setSearchUserQuery(e.target.value)}
            />
            <button
              className="h-9 px-4 rounded-r-xl bg-green-600 text-xs font-semibold text-white hover:bg-green-700 active:bg-green-800 transition-colors"
              onClick={handleAddChatUser}
            >
              Add Chat
            </button>
          </div>

          <div className="h-6 w-px bg-zinc-200 mx-2"></div>

          <button
            className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors"
            title="Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-zinc-500 hover:text-red-600 transition-colors uppercase tracking-wider"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-80 flex-shrink-0 border-r border-zinc-200 bg-white hidden md:flex flex-col">
          <ListChatPartners />
        </aside>

        <section className="flex-1 flex flex-col bg-white">
          <ChatInstance />
        </section>
      </main>
    </div>
  );
}
