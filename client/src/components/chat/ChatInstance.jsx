import { useState, useEffect, useRef } from "react";
import { useUserStore } from "../../store/useUserStore";
import { io } from "socket.io-client";
import axios from "axios";

const currentDate = new Date(); // get current date, should be updated somewhat regularly

const ChatInstance = () => {
  const {
    user,
    selectedChatPartner,
    activeConversation,
    setActiveConversation,
  } = useUserStore();
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL);
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!activeConversation || !socketRef.current) return;
    const socket = socketRef.current;
    socket.emit("joinConversation", activeConversation._id);

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveConversation", activeConversation._id);
      socket.off("newMessage", handleNewMessage);
    };
  }, [activeConversation?._id]);

  useEffect(() => {
    if (!user || !selectedChatPartner) return;

    const fetchConversation = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/conversation/byParticipants`,
          {
            params: { user1: user._id, user2: selectedChatPartner._id },
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setActiveConversation(res.data);
      } catch (err) {
        console.error("Failed to fetch conversation:", err);
      }
    };

    fetchConversation();
  }, [selectedChatPartner?._id]);

  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/message/conversation/${activeConversation._id}`,
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };

    setMessages([]);
    fetchMessages();
  }, [activeConversation?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedChatPartner) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 text-zinc-400">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-zinc-900">
          Select a conversation
        </h3>
        <p className="text-sm">
          Choose a friend from the left to start chatting
        </p>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !activeConversation) return;

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/message/createMessage`,
        {
          conversation: activeConversation._id,
          sender: user._id,
          content: chatMessage,
          messageType: "text",
          timestamp: currentDate.toISOString(), // send the current date as timestamp
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setChatMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-3 border-b border-zinc-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
            {selectedChatPartner.name[0]}
          </div>
          <div>
            <div className="font-bold text-zinc-900">
              {selectedChatPartner.name}
            </div>
            <div className="text-xs text-green-500 font-medium">Online</div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-zinc-50 overflow-y-auto p-4 sm:p-6 space-y-4 flex flex-col">
        <div className="flex justify-center mb-4">
          <div className="px-3 py-1 bg-zinc-200/50 rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-zinc-400 text-sm">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="mt-auto text-center text-zinc-400 text-sm italic py-10">
            No messages yet. Say hi to {selectedChatPartner.name}!
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isOwn = msg.sender._id === user._id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className="relative group">
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                        isOwn
                          ? "bg-green-600 text-white rounded-br-md"
                          : "bg-white text-zinc-900 rounded-bl-md shadow-sm border border-zinc-100"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                      <p
                        className={`text-[10px] mt-1 ${
                          isOwn ? "text-green-200" : "text-zinc-400"
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 transition-all duration-200 pointer-events-none z-10">
                      <div className="bg-zinc-800/90 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                        {formatFullDate(msg.createdAt)}
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-zinc-800/90"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 mb-4 bg-white border-t border-zinc-200">
        <form
          className="flex items-center gap-3 max-w-5xl mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            placeholder="Write a message..."
            className="flex-1 h-11 bg-zinc-100 border-none rounded-2xl px-4 text-sm outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={!chatMessage.trim()}
            className="h-11 px-6 rounded-2xl bg-green-600 text-sm font-semibold text-white hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatInstance;
