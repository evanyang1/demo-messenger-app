import { useUserStore } from "../../store/useUserStore";

const ChatInstance = () => {
  const { selectedChatPartner } = useUserStore();

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

      {/* Messages Area */}
      <div className="flex-1 bg-zinc-50 p-6 overflow-y-auto">
        <div className="text-center py-4">
          <span className="text-xs bg-zinc-200 text-zinc-600 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
            Today
          </span>
        </div>
        {/* Messages will go here */}
      </div>
    </div>
  );
};

export default ChatInstance;
