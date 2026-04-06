import { useState } from "react";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { type Section, type Profile } from "@/components/data";
import DiscoverSection from "@/components/DiscoverSection";
import { MatchesSection, MessagesSection } from "@/components/MessagesSection";
import { ProfileSection, SettingsSection, SupportSection } from "@/components/AccountSection";
import Onboarding from "@/components/Onboarding";
import Auth from "@/components/Auth";

const MESSAGES_API = "https://functions.poehali.dev/be091fa2-c319-4e0c-8a70-41d2d8a2b839";

function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f7f"/>
          <stop offset="1" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="10" fill="url(#logo-grad)"/>
      <path d="M9 22 L9 11 C9 9.9 9.9 9 11 9 L15 9 C16.1 9 17 9.9 17 11 L17 22" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22 L19 22" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M19 22 L19 18" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <ellipse cx="22" cy="14" rx="3" ry="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
    </svg>
  );
}

export default function Index() {
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem("cep-onboarded") === "1");
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("cep-token"));
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string; email: string } | null>(() => {
    const u = localStorage.getItem("cep-user");
    return u ? JSON.parse(u) : null;
  });
  const [section, setSection] = useState<Section>("discover");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [distance, setDistance] = useState([50]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [heartedId, setHeartedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // для открытия профиля из чата
  const [viewProfileId, setViewProfileId] = useState<number | null>(null);
  const [viewProfileName, setViewProfileName] = useState("");
  const [viewProfileAvatar, setViewProfileAvatar] = useState("");

  const handleViewProfile = (userId: number, name: string, avatarUrl: string) => {
    setViewProfileId(userId);
    setViewProfileName(name);
    setViewProfileAvatar(avatarUrl);
    setSection("discover");
  };

  // для открытия чата из MatchesSection
  const [openChatUserId, setOpenChatUserId] = useState<number | null>(null);
  const [openChatName, setOpenChatName] = useState("");
  const [openChatAvatar, setOpenChatAvatar] = useState("");

  const handleLike = (id: number) => {
    const isLiked = likedProfiles.includes(id);
    setHeartedId(id);
    setLikedProfiles(prev => isLiked ? prev.filter(x => x !== id) : [...prev, id]);
    setTimeout(() => setHeartedId(null), 1400);

    // сохраняем в БД
    const token = localStorage.getItem("cep-token");
    fetch(`${MESSAGES_API}?token=${token}&action=like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to_user_id: id, action: isLiked ? "unlike" : "like" }),
    }).catch(() => {});
  };

  const handleOpenChat = (userId: number, name: string, avatarUrl: string) => {
    setOpenChatUserId(userId);
    setOpenChatName(name);
    setOpenChatAvatar(avatarUrl);
    setSection("messages");
  };

  const navItems: { key: Section; icon: string; label: string }[] = [
    { key: "discover", icon: "Compass", label: "Найти" },
    { key: "matches", icon: "Heart", label: "Симпатии" },
    { key: "messages", icon: "MessageCircle", label: "Чаты" },
    { key: "profile", icon: "User", label: "Профиль" },
    { key: "settings", icon: "Settings", label: "Настройки" },
  ];

  const handleOnboardingDone = () => {
    localStorage.setItem("cep-onboarded", "1");
    setOnboarded(true);
  };

  const handleAuthDone = (user: { id: number; name: string; email: string }, token: string) => {
    localStorage.setItem("cep-token", token);
    localStorage.setItem("cep-user", JSON.stringify(user));
    setCurrentUser(user);
    setAuthed(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("cep-token");
    localStorage.removeItem("cep-user");
    setCurrentUser(null);
    setAuthed(false);
    setSection("discover");
  };

  if (!onboarded) return <Onboarding onDone={handleOnboardingDone} />;
  if (!authed) return <Auth onDone={handleAuthDone} />;

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <div className="text-left">
            <span className="font-bold text-lg gradient-spark-text leading-none block">Цепь</span>
            <span className="text-[10px] text-muted-foreground leading-none">соединяем людей</span>
          </div>
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

      <main className="flex-1 overflow-hidden relative">
        {section === "discover" && (
          <DiscoverSection
            selectedProfile={selectedProfile}
            setSelectedProfile={setSelectedProfile}
            likedProfiles={likedProfiles}
            heartedId={heartedId}
            handleLike={handleLike}
            filterOpen={filterOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            ageRange={ageRange}
            setAgeRange={setAgeRange}
            distance={distance}
            setDistance={setDistance}
            selectedInterests={selectedInterests}
            setSelectedInterests={setSelectedInterests}
            setSection={setSection}
            onOpenChat={handleOpenChat}
            viewProfileId={viewProfileId}
            viewProfileName={viewProfileName}
            viewProfileAvatar={viewProfileAvatar}
            onClearViewProfile={() => setViewProfileId(null)}
          />
        )}

        {section === "matches" && (
          <MatchesSection
            likedProfiles={likedProfiles}
            handleLike={handleLike}
            onOpenChat={handleOpenChat}
          />
        )}

        {section === "messages" && (
          <MessagesSection
            initialChatUserId={openChatUserId}
            initialChatName={openChatName}
            initialChatAvatar={openChatAvatar}
            onClearInitial={() => setOpenChatUserId(null)}
            onViewProfile={handleViewProfile}
          />
        )}

        {section === "profile" && (
          <ProfileSection
            likedProfiles={likedProfiles}
            currentUser={currentUser}
            onProfileUpdated={setCurrentUser}
          />
        )}

        {section === "settings" && (
          <SettingsSection onLogout={handleLogout} />
        )}

        {section === "support" && (
          <SupportSection setSection={setSection} />
        )}
      </main>

      <nav className="sticky bottom-0 bg-card/95 backdrop-blur-xl border-t border-border px-2 py-2">
        <div className="max-w-2xl mx-auto flex items-center justify-around">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setSection(item.key); setSelectedProfile(null); }}
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
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}