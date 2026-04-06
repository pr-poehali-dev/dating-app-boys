import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const API = "https://functions.poehali.dev/be091fa2-c319-4e0c-8a70-41d2d8a2b839";

function apiUrl(path: string) {
  const token = localStorage.getItem("cep-token");
  return `${API}?token=${token}&${path}`;
}

interface RealUser {
  id: number; name: string; age: number; city: string; avatar_url: string;
}

interface Chat {
  user_id: number; name: string; age: number; city: string; avatar_url: string;
  last_message: string; last_time: string; is_mine: boolean; unread: number;
}

interface Message {
  id: number; from: "me" | "them"; text: string; time: string;
}

interface MatchesSectionProps {
  likedProfiles: number[];
  handleLike: (id: number) => void;
  onOpenChat: (userId: number, name: string, avatarUrl: string) => void;
}

export function MatchesSection({ likedProfiles, handleLike, onOpenChat }: MatchesSectionProps) {
  const [myLikes, setMyLikes] = useState<RealUser[]>([]);
  const [matches, setMatches] = useState<RealUser[]>([]);

  useEffect(() => {
    fetch(apiUrl("action=likes"))
      .then(r => r.json())
      .then(d => {
        if (d.my_likes) setMyLikes(d.my_likes);
        if (d.matches) setMatches(d.matches);
      })
      .catch(() => {});
  }, [likedProfiles]);

  const getAvatar = (u: RealUser) =>
    u.avatar_url || `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(u.name)}&backgroundColor=ffb3ba`;

  return (
    <div className="h-full overflow-y-auto p-4 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-lg font-bold">Симпатии</h2>

        {/* Взаимные совпадения */}
        <div>
          <p className="text-sm text-muted-foreground mb-3">Взаимные совпадения</p>
          {matches.length === 0 ? (
            <div className="bg-card rounded-2xl p-6 text-center text-muted-foreground text-sm">
              <Icon name="Zap" size={32} className="mx-auto mb-2 opacity-30" />
              Пока совпадений нет — ставь симпатии в ленте
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {matches.map(m => (
                <button key={m.id} onClick={() => onOpenChat(m.id, m.name, m.avatar_url)} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className="w-16 h-16 rounded-full p-0.5 gradient-spark">
                    <div className="w-full h-full rounded-full overflow-hidden bg-card">
                      <img src={getAvatar(m)} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <p className="text-xs text-center font-medium">{m.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Кому поставил симпатию */}
        <div>
          <p className="text-sm text-muted-foreground mb-3">Кому поставил симпатию</p>
          <div className="space-y-2">
            {myLikes.length === 0 ? (
              <div className="bg-card rounded-2xl p-6 text-center text-muted-foreground text-sm">
                <Icon name="Heart" size={32} className="mx-auto mb-2 opacity-30" />
                Ты ещё никому не поставил симпатию
              </div>
            ) : (
              myLikes.map(p => (
                <div key={p.id} className="bg-card rounded-2xl p-3 flex items-center gap-3 card-glow">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                    <img src={getAvatar(p)} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{p.name}{p.age ? `, ${p.age}` : ""}</p>
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
  initialChatUserId?: number | null;
  initialChatName?: string;
  initialChatAvatar?: string;
  onClearInitial?: () => void;
  onViewProfile?: (userId: number, name: string, avatarUrl: string) => void;
}

export function MessagesSection({ initialChatUserId, initialChatName, initialChatAvatar, onClearInitial, onViewProfile }: MessagesSectionProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadChats = () => {
    fetch(apiUrl("action=chats"))
      .then(r => r.json())
      .then(d => { if (d.chats) setChats(d.chats); })
      .catch(() => {});
  };

  useEffect(() => {
    loadChats();
  }, []);

  // открыть чат из внешнего вызова (из MatchesSection или профиля)
  useEffect(() => {
    if (initialChatUserId) {
      const fake: Chat = {
        user_id: initialChatUserId,
        name: initialChatName || "",
        age: 0,
        city: "",
        avatar_url: initialChatAvatar || "",
        last_message: "",
        last_time: "",
        is_mine: false,
        unread: 0,
      };
      setActiveChat(fake);
      onClearInitial?.();
    }
  }, [initialChatUserId]);

  const openChat = (chat: Chat) => {
    setActiveChat(chat);
    setMessages([]);
  };

  useEffect(() => {
    if (!activeChat) return;
    fetch(apiUrl(`action=history&with_user=${activeChat.user_id}`))
      .then(r => r.json())
      .then(d => { if (d.messages) setMessages(d.messages); })
      .catch(() => {});
  }, [activeChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !activeChat || sending) return;
    const t = text.trim();
    setText("");
    setSending(true);
    const optimistic: Message = { id: Date.now(), from: "me", text: t, time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => [...prev, optimistic]);
    try {
      await fetch(`${API}?token=${localStorage.getItem("cep-token")}&action=send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to_user_id: activeChat.user_id, text: t }),
      });
      loadChats();
    } catch { /* ignore */ }
    setSending(false);
  };

  const getAvatar = (avatarUrl: string, name: string) =>
    avatarUrl || `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(name)}&backgroundColor=ffb3ba`;

  if (activeChat) {
    return (
      <div className="h-full flex flex-col animate-fade-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50">
          <button onClick={() => { setActiveChat(null); loadChats(); }} className="text-muted-foreground">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <button
            className="relative flex-shrink-0"
            onClick={() => onViewProfile?.(activeChat.user_id, activeChat.name, activeChat.avatar_url)}
          >
            <Avatar className="w-9 h-9">
              <AvatarFallback>{activeChat.name[0]}</AvatarFallback>
              <img src={getAvatar(activeChat.avatar_url, activeChat.name)} alt={activeChat.name} className="w-full h-full object-cover rounded-full" />
            </Avatar>
          </button>
          <button
            className="flex-1 text-left"
            onClick={() => onViewProfile?.(activeChat.user_id, activeChat.name, activeChat.avatar_url)}
          >
            <p className="font-semibold text-sm">{activeChat.name}</p>
            <p className="text-xs text-muted-foreground">{activeChat.city || "нажми чтобы открыть профиль"}</p>
          </button>
          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
              Начни переписку — напиши первым!
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={cn("flex", msg.from === "me" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm",
                msg.from === "me" ? "gradient-spark text-white rounded-br-sm" : "bg-card text-foreground rounded-bl-sm"
              )}>
                <p>{msg.text}</p>
                <p className={cn("text-xs mt-1", msg.from === "me" ? "text-white/60" : "text-muted-foreground")}>{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-border flex items-end gap-2">
          <div className="flex-1 bg-card rounded-2xl px-4 py-3">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Напиши сообщение..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!text.trim() || sending}
            className="w-11 h-11 gradient-spark rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg disabled:opacity-50"
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
        </div>
        {chats.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm">
            <Icon name="MessageCircle" size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium mb-1">Сообщений пока нет</p>
            <p className="text-xs">Найди совпадения в симпатиях и начни общение</p>
          </div>
        ) : (
          chats.map(c => (
            <div
              key={c.user_id}
              onClick={() => openChat(c)}
              className="bg-card rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover-scale card-glow"
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>{c.name[0]}</AvatarFallback>
                  <img src={getAvatar(c.avatar_url, c.name)} alt={c.name} className="w-full h-full object-cover rounded-full" />
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold truncate">{c.name}</p>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{c.last_time}</span>
                </div>
                <p className={cn("text-sm truncate", c.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                  {c.is_mine ? "Вы: " : ""}{c.last_message}
                </p>
              </div>
              {c.unread > 0 && (
                <div className="w-5 h-5 gradient-spark rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{c.unread}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}