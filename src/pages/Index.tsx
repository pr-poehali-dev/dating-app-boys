import { useState } from "react";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { type Section, type Match, type Profile } from "@/components/data";
import DiscoverSection from "@/components/DiscoverSection";
import { MatchesSection, MessagesSection } from "@/components/MessagesSection";
import { ProfileSection, SettingsSection, SupportSection } from "@/components/AccountSection";

function LogoVariant1() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f7f"/>
          <stop offset="1" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="10" fill="url(#lg1)"/>
      {/* Звено цепи с сердцем */}
      <path d="M10 13 C10 10.2 12.2 8 15 8 L17 8 C19.8 8 22 10.2 22 13 C22 15.8 19.8 18 17 18 L15 18 C12.2 18 10 15.8 10 13Z" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M14 13 L18 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      {/* Сердце внизу */}
      <path d="M13 21 C13 21 10 19 10 17 C10 15.9 10.9 15 12 15 C12.6 15 13.1 15.3 13.5 15.7 C13.9 15.3 14.4 15 15 15 C16.1 15 17 15.9 17 17 C17 19 14 22 13 22Z" fill="white" fillOpacity="0.9"/>
    </svg>
  );
}

function LogoVariant2() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="lg2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f7f"/>
          <stop offset="1" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="10" fill="url(#lg2)"/>
      {/* Бесконечность из двух колец-звеньев */}
      <ellipse cx="12" cy="16" rx="5" ry="7" stroke="white" strokeWidth="2.2" fill="none"/>
      <ellipse cx="20" cy="16" rx="5" ry="7" stroke="white" strokeWidth="2.2" fill="none"/>
    </svg>
  );
}

function LogoVariant3() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="lg3" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f7f"/>
          <stop offset="1" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="10" fill="url(#lg3)"/>
      {/* Буква Ц стилизована под звено */}
      <path d="M9 22 L9 11 C9 9.9 9.9 9 11 9 L15 9 C16.1 9 17 9.9 17 11 L17 22" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22 L19 22" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M19 22 L19 18" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
      {/* Маленькое звено */}
      <ellipse cx="22" cy="14" rx="3" ry="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
    </svg>
  );
}

function LogoVariant4() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="lg4a" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f7f"/>
          <stop offset="1" stopColor="#a855f7"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="10" fill="url(#lg4a)"/>
      {/* Два пересекающихся круга */}
      <circle cx="13" cy="16" r="6" stroke="white" strokeWidth="2.2" fill="none"/>
      <circle cx="19" cy="16" r="6" stroke="white" strokeWidth="2.2" fill="white" fillOpacity="0.15"/>
    </svg>
  );
}

export default function Index() {
  const [section, setSection] = useState<Section>("discover");
  const [logoChoice, setLogoChoice] = useState<number | null>(null);
  const [showLogoPicker, setShowLogoPicker] = useState(false);
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

      {/* Logo picker modal */}
      {showLogoPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowLogoPicker(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-card rounded-3xl p-6 w-full max-w-sm animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-base mb-1">Выбери логотип</h3>
            <p className="text-xs text-muted-foreground mb-5">Нажми на понравившийся вариант</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: 1, label: "Звено + сердце", node: <LogoVariant1 /> },
                { v: 2, label: "Два кольца", node: <LogoVariant2 /> },
                { v: 3, label: "Монограмма Ц", node: <LogoVariant3 /> },
                { v: 4, label: "Пересечение", node: <LogoVariant4 /> },
              ].map(({ v, label, node }) => (
                <button
                  key={v}
                  onClick={() => { setLogoChoice(v); setShowLogoPicker(false); }}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200",
                    logoChoice === v
                      ? "border-spark-pink bg-spark-pink/10"
                      : "border-border hover:border-spark-pink/40 bg-secondary/40"
                  )}
                >
                  <div className="w-14 h-14 flex items-center justify-center">
                    <svg width="56" height="56" viewBox="0 0 32 32" fill="none" style={{ display: 'block' }}>
                      {v === 1 && <>
                        <defs><linearGradient id="p1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#f43f7f"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
                        <rect width="32" height="32" rx="10" fill="url(#p1)"/>
                        <path d="M10 13 C10 10.2 12.2 8 15 8 L17 8 C19.8 8 22 10.2 22 13 C22 15.8 19.8 18 17 18 L15 18 C12.2 18 10 15.8 10 13Z" stroke="white" strokeWidth="2" fill="none"/>
                        <path d="M14 13 L18 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M13 21 C13 21 10 19 10 17 C10 15.9 10.9 15 12 15 C12.6 15 13.1 15.3 13.5 15.7 C13.9 15.3 14.4 15 15 15 C16.1 15 17 15.9 17 17 C17 19 14 22 13 22Z" fill="white" fillOpacity="0.9"/>
                      </>}
                      {v === 2 && <>
                        <defs><linearGradient id="p2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#f43f7f"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
                        <rect width="32" height="32" rx="10" fill="url(#p2)"/>
                        <ellipse cx="12" cy="16" rx="5" ry="7" stroke="white" strokeWidth="2.2" fill="none"/>
                        <ellipse cx="20" cy="16" rx="5" ry="7" stroke="white" strokeWidth="2.2" fill="none"/>
                      </>}
                      {v === 3 && <>
                        <defs><linearGradient id="p3" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#f43f7f"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
                        <rect width="32" height="32" rx="10" fill="url(#p3)"/>
                        <path d="M9 22 L9 11 C9 9.9 9.9 9 11 9 L15 9 C16.1 9 17 9.9 17 11 L17 22" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 22 L19 22" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                        <path d="M19 22 L19 18" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                        <ellipse cx="22" cy="14" rx="3" ry="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
                      </>}
                      {v === 4 && <>
                        <defs><linearGradient id="p4" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#f43f7f"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
                        <rect width="32" height="32" rx="10" fill="url(#p4)"/>
                        <circle cx="13" cy="16" r="6" stroke="white" strokeWidth="2.2" fill="none"/>
                        <circle cx="19" cy="16" r="6" stroke="white" strokeWidth="2.2" fill="white" fillOpacity="0.15"/>
                      </>}
                    </svg>
                  </div>
                  <span className="text-xs text-center font-medium leading-tight">{label}</span>
                  {logoChoice === v && <div className="w-4 h-4 gradient-spark rounded-full flex items-center justify-center"><Icon name="Check" size={10} className="text-white" /></div>}
                </button>
              ))}
            </div>
            <button onClick={() => setShowLogoPicker(false)} className="mt-4 w-full py-2.5 rounded-xl bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors">
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
        <button className="flex items-center gap-2" onClick={() => setShowLogoPicker(true)}>
          {logoChoice === 1 && <LogoVariant1 />}
          {logoChoice === 2 && <LogoVariant2 />}
          {logoChoice === 3 && <LogoVariant3 />}
          {logoChoice === 4 && <LogoVariant4 />}
          {!logoChoice && (
            <div className="w-8 h-8 gradient-spark rounded-xl flex items-center justify-center ring-2 ring-spark-pink/40 ring-offset-2 ring-offset-background">
              <span className="text-white text-sm font-bold">Ц</span>
            </div>
          )}
          <div className="text-left">
            <span className="font-bold text-lg gradient-spark-text leading-none block">Цепь</span>
            <span className="text-[10px] text-muted-foreground leading-none">найди свою цепочку</span>
          </div>
        </button>
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