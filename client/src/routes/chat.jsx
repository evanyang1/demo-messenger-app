import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import axios from "axios";
import Chat from "../components/chat/Chat";
import ListChatPartners from "../components/chat/ListChatPartners";

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
      <header className="flex flex-row">
        <h1 className="text-xl font-bold">Chat</h1>
        <div className="relative ml-auto">
          <input
            type="text"
            placeholder="Search user.."
            className="bg-gray-100 text-gray-300 placeholder:text-gray-500 border border-gray-600
             focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          />
        </div>
        <button
          onClick={handleLogout}
          className="text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700
          focus:outline-none focus:ring-2 focus:ring-green-300 transition
          ml-auto"
        >
          Logout
        </button>
      </header>
      <section className="flex flex-row">
        <ListChatPartners />
        <Chat />
      </section>
    </div>
  );
}
