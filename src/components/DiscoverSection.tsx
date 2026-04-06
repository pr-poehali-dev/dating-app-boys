import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { INTERESTS, PROFILES, type Profile, type Section } from "@/components/data";

const USERS_URL = "https://functions.poehali.dev/47641443-6779-4930-9263-cd34767d9224";

interface DiscoverSectionProps {
  selectedProfile: Profile | null;
  setSelectedProfile: (p: Profile | null) => void;
  likedProfiles: number[];
  heartedId: number | null;
  handleLike: (id: number) => void;
  filterOpen: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  ageRange: number[];
  setAgeRange: (v: number[]) => void;
  distance: number[];
  setDistance: (v: number[]) => void;
  selectedInterests: string[];
  setSelectedInterests: (v: string[]) => void;
  setSection: (s: Section) => void;
  onOpenChat: (userId: number, name: string, avatarUrl: string) => void;
  viewProfileId?: number | null;
  viewProfileName?: string;
  viewProfileAvatar?: string;
  onClearViewProfile?: () => void;
}

export default function DiscoverSection({
  selectedProfile,
  setSelectedProfile,
  likedProfiles,
  heartedId,
  handleLike,
  filterOpen,
  searchQuery,
  setSearchQuery,
  ageRange,
  setAgeRange,
  distance,
  setDistance,
  selectedInterests,
  setSelectedInterests,
  setSection,
  onOpenChat,
  viewProfileId,
  viewProfileName,
  viewProfileAvatar,
  onClearViewProfile,
}: DiscoverSectionProps) {
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [distances, setDistances] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  // открыть профиль из чата — загружаем данные с бэкенда по ID
  useEffect(() => {
    if (!viewProfileId) return;
    onClearViewProfile?.();
    const token = localStorage.getItem("cep-token");
    fetch(`${USERS_URL}?token=${token}&user_id=${viewProfileId}`)
      .then(r => r.json())
      .then(data => {
        const u = data.user;
        if (u) {
          setSelectedProfile({
            id: u.id,
            name: u.name || "",
            age: u.age || 0,
            city: u.city || "",
            about: u.about || "",
            interests: u.interests || [],
            img: u.avatar_url || `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(u.name || "user")}&backgroundColor=ffb3ba`,
            verified: false,
            online: false,
            match: 0,
          });
        } else {
          // fallback — минимальный профиль из имени/аватара
          setSelectedProfile({
            id: viewProfileId,
            name: viewProfileName || "",
            age: 0, city: "", about: "", interests: [],
            img: viewProfileAvatar || `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(viewProfileName || "user")}&backgroundColor=ffb3ba`,
            verified: false, online: false, match: 0,
          });
        }
      })
      .catch(() => {
        setSelectedProfile({
          id: viewProfileId,
          name: viewProfileName || "",
          age: 0, city: "", about: "", interests: [],
          img: viewProfileAvatar || `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(viewProfileName || "user")}&backgroundColor=ffb3ba`,
          verified: false, online: false, match: 0,
        });
      });
  }, [viewProfileId]);

  const loadUsers = (token: string) => {
    fetch(`${USERS_URL}?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.users && data.users.length > 0) {
          const mapped: Profile[] = data.users.map((u: {
            id: number; name: string; age: number; city: string;
            about: string; interests: string[]; avatar_url: string;
            verified: boolean; online: boolean; match: number; distance: number | null;
          }) => ({
            id: u.id,
            name: u.name,
            age: u.age || 0,
            city: u.city || "",
            about: u.about || "",
            interests: u.interests || [],
            img: u.avatar_url || `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(u.name)}&backgroundColor=ffb3ba`,
            verified: u.verified,
            online: u.online,
            match: u.match,
          }));
          setAllProfiles(mapped);
          setLoading(false);
          const dist: Record<number, number> = {};
          data.users.forEach((u: { id: number; distance: number | null }) => {
            if (u.distance !== null && u.distance !== undefined) dist[u.id] = u.distance;
          });
          setDistances(dist);
        }
      })
      .catch(() => { setLoading(false); });
  };

  useEffect(() => {
    const token = localStorage.getItem("cep-token");
    if (!token) return;

    // запрашиваем геолокацию и отправляем на сервер
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          fetch(`${USERS_URL}?token=${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          }).then(() => loadUsers(token)).catch(() => loadUsers(token));
        },
        () => loadUsers(token) // если отказали — грузим без геолокации
      );
    } else {
      loadUsers(token);
    }
  }, []);

  const filteredProfiles = allProfiles.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.city.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (p.age && (p.age < ageRange[0] || p.age > ageRange[1])) return false;
    if (selectedInterests.length > 0 && !selectedInterests.some(i => p.interests.includes(i))) return false;
    return true;
  });

  if (selectedProfile) {
    return (
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
              onClick={() => {
                onOpenChat(selectedProfile.id, selectedProfile.name, selectedProfile.img);
                setSelectedProfile(null);
              }}
            >
              <Icon name="MessageCircle" size={18} className="mr-2" /> Написать сообщение
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
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
                    onClick={() => setSelectedInterests(
                      selectedInterests.includes(interest)
                        ? selectedInterests.filter(i => i !== interest)
                        : [...selectedInterests, interest]
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
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">
              <Icon name="Loader" size={36} className="mx-auto mb-3 opacity-40 animate-spin" />
              <p>Ищем людей рядом...</p>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-40" />
              <p>Пока никого нет — зарегистрируй друзей!</p>
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
                      <p className="font-bold text-white">
                        {profile.name}{profile.age ? `, ${profile.age}` : ""}
                      </p>
                      <p className="text-white/70 text-xs flex items-center gap-1">
                        <Icon name="MapPin" size={10} />
                        {distances[profile.id] !== undefined
                          ? `${distances[profile.id]} км`
                          : profile.city || ""}
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
  );
}