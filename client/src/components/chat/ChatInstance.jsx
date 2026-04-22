import { useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import axios from "axios";

const ChatInstance = () => {
  const { selectedChatPartner } = useUserStore();
  const [chatMessage, setChatMessage] = useState("");

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

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
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

      {/* Scrollable Messages Area */}
      <div className="flex-1 bg-zinc-50 overflow-y-auto p-4 sm:p-6 space-y-4 flex flex-col">
        <div className="flex justify-center mb-4">
          <div className="px-3 py-1 bg-zinc-200/50 rounded-full">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Today
            </span>
          </div>
        </div>

        {/* Messages will go here */}
        <div className="mt-auto text-center text-zinc-400 text-sm italic py-10">
          No messages yet. Say hi to {selectedChatPartner.name}!
        </div>
      </div>

      {/* Fixed Footer Input */}
      <footer className="p-4 bg-white border-t border-zinc-200">
        <form
          className="flex items-center gap-3 max-w-5xl mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            if (!chatMessage.trim()) return;
            // TODO: Implementation for sending message
            setChatMessage("");
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
