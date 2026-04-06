import { useState } from "react";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { type Section, type Match, type Profile } from "@/components/data";
import DiscoverSection from "@/components/DiscoverSection";
import { MatchesSection, MessagesSection } from "@/components/MessagesSection";
import { ProfileSection, SettingsSection, SupportSection } from "@/components/AccountSection";

export default function Index() {
  const [section, setSection] = useState<Section>("discover");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [activeChat, setActiveChat] = useState<Match | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [distance, setDistance] = useState([50]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [heartedId, setHeartedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
          />
        )}

        {section === "matches" && (
          <MatchesSection
            likedProfiles={likedProfiles}
            handleLike={handleLike}
          />
        )}

        {section === "messages" && (
          <MessagesSection
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            message={message}
            setMessage={setMessage}
          />
        )}

        {section === "profile" && (
          <ProfileSection likedProfiles={likedProfiles} />
        )}

        {section === "settings" && (
          <SettingsSection />
        )}

        {section === "support" && (
          <SupportSection setSection={setSection} />
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
