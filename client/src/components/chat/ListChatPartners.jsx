import { useUserStore } from "../../store/useUserStore";

const ListChatPartners = () => {
  const { user, selectedChatPartner, setSelectedChatPartner } = useUserStore();
  const partners = user?.usersInConversation || [];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-zinc-100">
        <h2 className="text-lg font-bold text-zinc-800">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {partners.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-400">
            No conversations yet. Search for a user to start chatting!
          </div>
        ) : (
          partners.map((partner) => (
            <button
              key={partner._id}
              onClick={() => setSelectedChatPartner(partner)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-b border-zinc-50 hover:bg-zinc-50 ${
                selectedChatPartner?._id === partner._id ? "bg-green-50" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-zinc-200 flex-shrink-0 flex items-center justify-center text-zinc-500 font-bold">
                {partner.name[0].toUpperCase()}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="font-semibold text-zinc-900 truncate">
                  {partner.name}
                </div>
                <div className="text-xs text-zinc-500 truncate">
                  {partner.email}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ListChatPartners;
