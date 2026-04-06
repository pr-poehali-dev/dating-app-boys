import Icon from "@/components/ui/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MATCHES, PROFILES, CHAT_MESSAGES, type Match } from "@/components/data";

interface MatchesSectionProps {
  likedProfiles: number[];
  handleLike: (id: number) => void;
}

export function MatchesSection({ likedProfiles, handleLike }: MatchesSectionProps) {
  return (
    <div className="h-full overflow-y-auto p-4 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-lg font-bold">Взаимные симпатии</h2>

        <div>
          <p className="text-sm text-muted-foreground mb-3">Новые совпадения</p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {MATCHES.map(m => (
              <div key={m.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full p-0.5 gradient-spark">
                    <div className="w-full h-full rounded-full overflow-hidden bg-card">
                      <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  {m.online && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-background" />
                  )}
                </div>
                <p className="text-xs text-center font-medium">{m.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-3">Кому ты поставил симпатию</p>
          <div className="space-y-2">
            {PROFILES.filter(p => likedProfiles.includes(p.id)).length === 0 ? (
              <div className="bg-card rounded-2xl p-6 text-center text-muted-foreground text-sm">
                <Icon name="Heart" size={32} className="mx-auto mb-2 opacity-30" />
                Ты ещё никому не поставил симпатию
              </div>
            ) : (
              PROFILES.filter(p => likedProfiles.includes(p.id)).map(p => (
                <div key={p.id} className="bg-card rounded-2xl p-3 flex items-center gap-3 card-glow">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{p.name}, {p.age}</p>
                    <p className="text-xs text-muted-foreground">{p.city}</p>
                  </div>
                  <button
                    onClick={() => handleLike(p.id)}
                    className="w-9 h-9 rounded-xl bg-spark-pink/15 text-spark-pink flex items-center justify-center hover:bg-spark-pink hover:text-white transition-colors"
                  >
                    <Icon name="Heart" size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MessagesSectionProps {
  activeChat: Match | null;
  setActiveChat: (m: Match | null) => void;
  message: string;
  setMessage: (v: string) => void;
}

export function MessagesSection({ activeChat, setActiveChat, message, setMessage }: MessagesSectionProps) {
  if (activeChat) {
    return (
      <div className="h-full flex flex-col animate-fade-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50">
          <button onClick={() => setActiveChat(null)} className="text-muted-foreground">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className="relative">
            <Avatar className="w-9 h-9">
              <AvatarImage src={activeChat.img} />
              <AvatarFallback>{activeChat.name[0]}</AvatarFallback>
            </Avatar>
            {activeChat.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-card" />}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{activeChat.name}, {activeChat.age}</p>
            <p className="text-xs text-green-400">{activeChat.online ? "онлайн" : "был недавно"}</p>
          </div>
          <button className="text-muted-foreground">
            <Icon name="MoreVertical" size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {CHAT_MESSAGES.map(msg => (
            <div key={msg.id} className={cn("flex", msg.from === "me" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm",
                msg.from === "me"
                  ? "gradient-spark text-white rounded-br-sm"
                  : "bg-card text-foreground rounded-bl-sm"
              )}>
                <p>{msg.text}</p>
                <p className={cn("text-xs mt-1", msg.from === "me" ? "text-white/60" : "text-muted-foreground")}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border flex items-end gap-2">
          <div className="flex-1 bg-card rounded-2xl px-4 py-3">
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Напиши сообщение..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onKeyDown={e => { if (e.key === "Enter") setMessage(""); }}
            />
          </div>
          <button
            onClick={() => setMessage("")}
            className="w-11 h-11 gradient-spark rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg"
          >
            <Icon name="Send" size={17} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold flex-1">Сообщения</h2>
          <Icon name="Search" size={18} className="text-muted-foreground" />
        </div>
        {MATCHES.map(m => (
          <div
            key={m.id}
            onClick={() => setActiveChat(m)}
            className="bg-card rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover-scale card-glow"
          >
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={m.img} />
                <AvatarFallback>{m.name[0]}</AvatarFallback>
              </Avatar>
              {m.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold truncate">{m.name}</p>
                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{m.time}</span>
              </div>
              <p className={cn("text-sm truncate", m.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                {m.lastMsg}
              </p>
            </div>
            {m.unread > 0 && (
              <div className="w-5 h-5 gradient-spark rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{m.unread}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
