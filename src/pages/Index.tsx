import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Section = "discover" | "matches" | "messages" | "profile" | "settings" | "support";

const INTERESTS = [
  "Путешествия", "Кино", "Музыка", "Спорт", "Кулинария", "Книги",
  "Искусство", "Йога", "Танцы", "Фото", "Природа", "Игры", "Кофе", "Театр"
];

const PROFILES = [
  { id: 1, name: "Алина", age: 26, city: "Москва", verified: true, online: true, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Alina&backgroundColor=ffb3ba", interests: ["Путешествия", "Йога", "Кино"], about: "Люблю утренний кофе, длинные прогулки и новые открытия. Ищу человека, с которым интересно молчать.", match: 94 },
  { id: 2, name: "Соня", age: 24, city: "Санкт-Петербург", verified: true, online: false, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Sonya&backgroundColor=c9b8f5", interests: ["Книги", "Театр", "Кофе"], about: "Читаю запоем, пью чай вёдрами. Обожаю Достоевского и шведский минимализм.", match: 88 },
  { id: 3, name: "Маша", age: 28, city: "Казань", verified: false, online: true, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Masha&backgroundColor=b8f5c9", interests: ["Спорт", "Природа", "Фото"], about: "Фотограф, бегун, немного перфекционист. Ищу приключения и хорошую компанию.", match: 81 },
  { id: 4, name: "Катя", age: 23, city: "Новосибирск", verified: true, online: false, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Katya&backgroundColor=f5d0b8", interests: ["Музыка", "Танцы", "Искусство"], about: "Играю на виолончели, люблю джаз и импрессионизм. Ищу того, кто не боится настоящего.", match: 76 },
  { id: 5, name: "Вика", age: 27, city: "Москва", verified: true, online: true, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Vika&backgroundColor=f5b8e8", interests: ["Кулинария", "Игры", "Кино"], about: "Шеф-повар по призванию и геймер по ночам. Хочу встретить умного и тёплого человека.", match: 92 },
  { id: 6, name: "Дима", age: 29, city: "Москва", verified: true, online: true, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Dima&backgroundColor=b8d4f5", interests: ["Спорт", "Путешествия", "Фото"], about: "Спортсмен и путешественник. Объездил 30 стран, ищу компаньона для следующих.", match: 87 },
];

const MATCHES = [
  { id: 1, name: "Алина", age: 26, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Alina&backgroundColor=ffb3ba", lastMsg: "Привет! Как ты? 😊", time: "сейчас", unread: 2, online: true },
  { id: 5, name: "Вика", age: 27, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Vika&backgroundColor=f5b8e8", lastMsg: "Отличная идея, давай попробуем!", time: "5 мин", unread: 0, online: true },
  { id: 6, name: "Дима", age: 29, img: "https://api.dicebear.com/7.x/lorelei/svg?seed=Dima&backgroundColor=b8d4f5", lastMsg: "Можем встретиться в субботу?", time: "1 ч", unread: 1, online: false },
];

const CHAT_MESSAGES = [
  { id: 1, from: "them", text: "Привет! Видела ты тоже любишь путешествия?", time: "14:20" },
  { id: 2, from: "me", text: "Да! Только вернулась из Бали 🌴", time: "14:21" },
  { id: 3, from: "them", text: "О, обожаю Бали! Где останавливалась?", time: "14:22" },
  { id: 4, from: "me", text: "В Убуде, там такая атмосфера... Хочется вернуться", time: "14:23" },
  { id: 5, from: "them", text: "Привет! Как ты? 😊", time: "14:35" },
];

export default function Index() {
  const [section, setSection] = useState<Section>("discover");
  const [selectedProfile, setSelectedProfile] = useState<typeof PROFILES[0] | null>(null);
  const [activeChat, setActiveChat] = useState<typeof MATCHES[0] | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [distance, setDistance] = useState([50]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [heartedId, setHeartedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProfiles = PROFILES.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.city.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (p.age < ageRange[0] || p.age > ageRange[1]) return false;
    if (selectedInterests.length > 0 && !selectedInterests.some(i => p.interests.includes(i))) return false;
    return true;
  });

  const handleLike = (id: number) => {
    setHeartedId(id);
    setLikedProfiles(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setTimeout(() => setHeartedId(null), 1400);
  };

  const navItems: { key: Section; icon: string; label: string; badge?: number }[] = [
    { key: "discover", icon: "Compass", label: "Найти" },
    { key: "matches", icon: "Heart", label: "Симпатии", badge: 3 },
    { key: "messages", icon: "MessageCircle", label: "Чаты", badge: 2 },
    { key: "profile", icon: "User", label: "Профиль" },
    { key: "settings", icon: "Settings", label: "Настройки" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-spark rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="font-bold text-lg gradient-spark-text">Spark</span>
        </div>
        <div className="flex items-center gap-2">
          {section === "discover" && (
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={cn(
                "p-2 rounded-xl transition-all duration-200",
                filterOpen ? "bg-spark-pink/20 text-spark-pink" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon name="SlidersHorizontal" size={18} />
            </button>
          )}
          <button
            onClick={() => setSection("support")}
            className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="HelpCircle" size={18} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden relative">

        {/* DISCOVER */}
        {section === "discover" && !selectedProfile && (
          <div className="h-full flex flex-col">
            {filterOpen && (
              <div className="bg-card border-b border-border p-4 animate-fade-in">
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon name="Search" size={16} className="text-muted-foreground" />
                    <Input
                      placeholder="Имя или город..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="bg-secondary border-0 h-9 text-sm"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Возраст</span>
                      <span className="text-spark-pink font-medium">{ageRange[0]}–{ageRange[1]} лет</span>
                    </div>
                    <Slider value={ageRange} onValueChange={setAgeRange} min={18} max={60} step={1} className="my-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Расстояние</span>
                      <span className="text-spark-pink font-medium">{distance[0]} км</span>
                    </div>
                    <Slider value={distance} onValueChange={setDistance} min={5} max={500} step={5} className="my-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Интересы</p>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map(interest => (
                        <button
                          key={interest}
                          onClick={() => setSelectedInterests(prev =>
                            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
                          )}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
                            selectedInterests.includes(interest)
                              ? "gradient-spark text-white"
                              : "bg-secondary text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Рядом с тобой</h2>
                  <span className="text-sm text-muted-foreground">{filteredProfiles.length} человек</span>
                </div>
                {filteredProfiles.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-40" />
                    <p>Никого не нашли по фильтрам</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {filteredProfiles.map((profile, idx) => (
                      <div
                        key={profile.id}
                        onClick={() => setSelectedProfile(profile)}
                        className="bg-card rounded-3xl overflow-hidden cursor-pointer hover-scale card-glow relative profile-card-shine animate-fade-in"
                        style={{ animationDelay: `${idx * 0.06}s`, opacity: 0 }}
                      >
                        <div className="aspect-[3/4] relative bg-gradient-to-br from-secondary to-muted overflow-hidden">
                          <img src={profile.img} alt={profile.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute top-2 left-2">
                            <div className="px-2 py-0.5 rounded-full gradient-spark text-white text-xs font-bold">
                              {profile.match}%
                            </div>
                          </div>
                          {profile.verified && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Icon name="Check" size={12} className="text-white" />
                            </div>
                          )}
                          {profile.online && (
                            <div className="absolute bottom-[60px] right-3 w-3 h-3 bg-green-400 rounded-full border-2 border-card" />
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="font-bold text-white">{profile.name}, {profile.age}</p>
                            <p className="text-white/70 text-xs flex items-center gap-1">
                              <Icon name="MapPin" size={10} />
                              {profile.city}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); handleLike(profile.id); }}
                          className={cn(
                            "absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                            likedProfiles.includes(profile.id)
                              ? "bg-spark-pink text-white scale-110"
                              : "bg-black/40 backdrop-blur-sm text-white/80 hover:bg-spark-pink hover:text-white"
                          )}
                        >
                          <Icon
                            name="Heart"
                            size={16}
                            className={cn(heartedId === profile.id && "animate-heartbeat")}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE DETAIL */}
        {section === "discover" && selectedProfile && (
          <div className="h-full overflow-y-auto">
            <div className="max-w-2xl mx-auto pb-6 animate-fade-in">
              <div className="relative aspect-[4/5] bg-gradient-to-br from-secondary to-muted">
                <img src={selectedProfile.img} alt={selectedProfile.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-4 left-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                >
                  <Icon name="ArrowLeft" size={18} />
                </button>
                <div className="absolute bottom-6 left-4 right-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-3xl font-bold text-white">{selectedProfile.name}, {selectedProfile.age}</h2>
                        {selectedProfile.verified && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon name="Check" size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-white/70 flex items-center gap-1 text-sm">
                        <Icon name="MapPin" size={13} />
                        {selectedProfile.city}
                        {selectedProfile.online && <span className="ml-2 text-green-400 text-xs">● онлайн</span>}
                      </p>
                    </div>
                    <div className="gradient-spark rounded-2xl px-3 py-1.5 text-white font-bold text-lg">
                      {selectedProfile.match}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="bg-card rounded-2xl p-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">{selectedProfile.about}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Интересы</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.interests.map(i => (
                      <span key={i} className="px-3 py-1.5 bg-spark-pink/15 text-spark-pink rounded-full text-sm font-medium">{i}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-2xl border-border"
                    onClick={() => setSelectedProfile(null)}
                  >
                    <Icon name="X" size={18} className="mr-2" /> Пропустить
                  </Button>
                  <Button
                    className="flex-1 h-12 rounded-2xl gradient-spark border-0 text-white font-bold hover:opacity-90"
                    onClick={() => { handleLike(selectedProfile.id); setSelectedProfile(null); }}
                  >
                    <Icon name="Heart" size={18} className="mr-2" /> Симпатия
                  </Button>
                </div>
                <Button
                  className="w-full h-12 rounded-2xl bg-accent/20 text-accent border-0 hover:bg-accent/30 font-semibold"
                  onClick={() => { setSelectedProfile(null); setSection("messages"); }}
                >
                  <Icon name="MessageCircle" size={18} className="mr-2" /> Написать сообщение
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MATCHES */}
        {section === "matches" && (
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
        )}

        {/* MESSAGES */}
        {section === "messages" && !activeChat && (
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
        )}

        {/* CHAT */}
        {section === "messages" && activeChat && (
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
        )}

        {/* MY PROFILE */}
        {section === "profile" && (
          <div className="h-full overflow-y-auto animate-fade-in">
            <div className="max-w-2xl mx-auto pb-6">
              <div className="relative">
                <div className="h-44 gradient-spark opacity-20 absolute inset-x-0 top-0" />
                <div className="relative pt-8 pb-4 px-4">
                  <div className="flex items-end gap-4 mb-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden bg-card border-4 border-background shadow-xl">
                        <img src="https://api.dicebear.com/7.x/lorelei/svg?seed=Me&backgroundColor=ffb3ba" alt="Я" className="w-full h-full object-cover" />
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-7 h-7 gradient-spark rounded-xl flex items-center justify-center shadow-lg">
                        <Icon name="Camera" size={13} className="text-white" />
                      </button>
                    </div>
                    <div className="pb-2">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">Анна</h2>
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Icon name="Check" size={10} className="text-white" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">25 лет · Москва</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-xs text-green-400">Онлайн</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Симпатии", value: likedProfiles.length + 12, icon: "Heart" },
                      { label: "Совпадений", value: 3, icon: "Zap" },
                      { label: "Просмотров", value: 148, icon: "Eye" },
                    ].map(stat => (
                      <div key={stat.label} className="bg-card rounded-2xl p-3 text-center card-glow">
                        <Icon name={stat.icon as "Heart"} size={18} className="text-spark-pink mx-auto mb-1" />
                        <p className="font-bold text-lg">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 space-y-4">
                <div className="bg-card rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">О себе</p>
                    <button className="text-spark-pink text-xs">Изменить</button>
                  </div>
                  <Textarea
                    defaultValue="Люблю кофе и длинные прогулки. Ищу человека, с которым можно говорить ни о чём часами."
                    className="bg-transparent border-0 resize-none text-sm text-muted-foreground p-0 focus-visible:ring-0"
                    rows={3}
                  />
                </div>

                <div className="bg-card rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Мои интересы</p>
                    <button className="text-spark-pink text-xs">+ Добавить</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Путешествия", "Кино", "Кулинария", "Йога"].map(i => (
                      <span key={i} className="px-3 py-1.5 gradient-spark text-white rounded-full text-xs font-medium">{i}</span>
                    ))}
                    {INTERESTS.slice(4, 7).map(i => (
                      <span key={i} className="px-3 py-1.5 bg-secondary text-muted-foreground rounded-full text-xs">{i}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name="ShieldCheck" size={20} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-300">Профиль верифицирован</p>
                    <p className="text-xs text-muted-foreground">Другие пользователи видят галочку</p>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                </div>

                <Button className="w-full h-12 gradient-spark border-0 text-white font-semibold rounded-2xl hover:opacity-90">
                  <Icon name="Edit" size={16} className="mr-2" /> Редактировать профиль
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {section === "settings" && (
          <div className="h-full overflow-y-auto p-4 animate-fade-in">
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-lg font-bold mb-4">Настройки</h2>

              <div className="bg-card rounded-2xl overflow-hidden card-glow">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Приватность и безопасность</p>
                </div>
                {[
                  { label: "Показывать онлайн-статус", desc: "Другие видят, когда ты онлайн", checked: true, icon: "Eye" },
                  { label: "Показывать расстояние", desc: "Примерное расстояние до тебя", checked: false, icon: "MapPin" },
                  { label: "Двухфакторная аутентификация", desc: "Дополнительная защита аккаунта", checked: true, icon: "Lock" },
                  { label: "Скрывать профиль", desc: "Тебя не найдут в поиске", checked: false, icon: "EyeOff" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50 last:border-0">
                    <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon as "Eye"} size={16} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.checked} />
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-2xl overflow-hidden card-glow">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Уведомления</p>
                </div>
                {[
                  { label: "Новые симпатии", icon: "Heart", checked: true },
                  { label: "Новые сообщения", icon: "MessageCircle", checked: true },
                  { label: "Взаимные совпадения", icon: "Zap", checked: true },
                  { label: "Промо и новости", icon: "Bell", checked: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50 last:border-0">
                    <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon as "Heart"} size={16} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium flex-1">{item.label}</p>
                    <Switch defaultChecked={item.checked} />
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-2xl overflow-hidden card-glow">
                {[
                  { label: "Верификация профиля", icon: "ShieldCheck", color: "text-blue-400", desc: "Подтверди личность" },
                  { label: "Блокировки", icon: "Ban", color: "text-muted-foreground", desc: "Заблокированные пользователи" },
                  { label: "Удалить аккаунт", icon: "Trash2", color: "text-destructive", desc: "Это действие необратимо" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50 last:border-0 cursor-pointer hover:bg-secondary/30 transition-colors">
                    <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon as "ShieldCheck"} size={16} className={item.color} />
                    </div>
                    <div className="flex-1">
                      <p className={cn("text-sm font-medium", item.color)}>{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Icon name="ChevronRight" size={15} className="text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUPPORT */}
        {section === "support" && (
          <div className="h-full overflow-y-auto p-4 animate-fade-in">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setSection("discover")} className="text-muted-foreground">
                  <Icon name="ArrowLeft" size={20} />
                </button>
                <h2 className="text-lg font-bold">Помощь и поддержка</h2>
              </div>

              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Поиск по вопросам..." className="pl-10 bg-card border-0 rounded-2xl h-11" />
              </div>

              <div className="bg-card rounded-2xl overflow-hidden card-glow">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Частые вопросы</p>
                </div>
                {[
                  { q: "Как верифицировать профиль?", icon: "ShieldCheck" },
                  { q: "Как работает система совпадений?", icon: "Zap" },
                  { q: "Как удалить или заблокировать пользователя?", icon: "Ban" },
                  { q: "Как изменить настройки приватности?", icon: "Lock" },
                  { q: "Как отменить подписку?", icon: "CreditCard" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50 last:border-0 cursor-pointer hover:bg-secondary/30 transition-colors">
                    <Icon name={item.icon as "ShieldCheck"} size={16} className="text-spark-pink flex-shrink-0" />
                    <p className="text-sm flex-1">{item.q}</p>
                    <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-2xl p-4 card-glow">
                <p className="text-sm font-semibold mb-3">Написать в поддержку</p>
                <Textarea
                  placeholder="Опишите вашу проблему подробно..."
                  className="bg-secondary border-0 rounded-xl text-sm mb-3 resize-none"
                  rows={4}
                />
                <Button className="w-full gradient-spark border-0 text-white rounded-xl h-11 font-semibold hover:opacity-90">
                  <Icon name="Send" size={16} className="mr-2" /> Отправить обращение
                </Button>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full pulse-pink flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-300">Все системы работают</p>
                  <p className="text-xs text-muted-foreground">Среднее время ответа: 2 часа</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="sticky bottom-0 bg-card/95 backdrop-blur-xl border-t border-border px-2 py-2">
        <div className="max-w-2xl mx-auto flex items-center justify-around">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setSection(item.key); setSelectedProfile(null); setActiveChat(null); }}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 relative min-w-[56px]",
                section === item.key ? "text-spark-pink" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                section === item.key && "bg-spark-pink/15"
              )}>
                <Icon name={item.icon as "Compass"} size={20} />
              </div>
              <span className={cn(
                "text-[10px] font-medium leading-none transition-all duration-200",
                section === item.key ? "opacity-100" : "opacity-60"
              )}>
                {item.label}
              </span>
              {item.badge && item.badge > 0 && (
                <div className="absolute top-1 right-2 w-4 h-4 gradient-spark rounded-full flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">{item.badge}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
