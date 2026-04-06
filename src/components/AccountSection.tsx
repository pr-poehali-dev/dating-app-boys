import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { INTERESTS, type Section } from "@/components/data";

const PROFILE_URL = "https://functions.poehali.dev/cd62eb2f-9ab4-4319-abaf-48444ad46033";

interface UserProfile {
  id: number; name: string; email: string;
  city: string; about: string; interests: string; age: number;
}

interface ProfileSectionProps {
  likedProfiles: number[];
  currentUser: { id: number; name: string; email: string } | null;
  onProfileUpdated: (user: { id: number; name: string; email: string }) => void;
}

export function ProfileSection({ likedProfiles, currentUser, onProfileUpdated }: ProfileSectionProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editInterests, setEditInterests] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("cep-token");
    if (!token) return;
    fetch(PROFILE_URL, { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.id) setProfile(data); })
      .catch(() => {});
  }, []);

  const openEdit = () => {
    if (!profile) return;
    setEditName(profile.name);
    setEditCity(profile.city);
    setEditAbout(profile.about);
    setEditAge(profile.age ? String(profile.age) : "");
    setEditInterests(profile.interests ? profile.interests.split(",").map(s => s.trim()).filter(Boolean) : []);
    setSaveError("");
    setEditing(true);
  };

  const handleSave = async () => {
    setSaveError("");
    if (!editName.trim()) { setSaveError("Имя не может быть пустым"); return; }
    setSaving(true);
    const token = localStorage.getItem("cep-token");
    try {
      const res = await fetch(PROFILE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          name: editName.trim(), city: editCity.trim(),
          about: editAbout.trim(), age: parseInt(editAge) || 0,
          interests: editInterests.join(", ")
        }),
      });
      const data = await res.json();
      if (!data.ok) { setSaveError(data.error || "Ошибка сохранения"); return; }
      setProfile(data.user);
      onProfileUpdated({ id: data.user.id, name: data.user.name, email: data.user.email });
      const saved = { ...JSON.parse(localStorage.getItem("cep-user") || "{}"), name: data.user.name };
      localStorage.setItem("cep-user", JSON.stringify(saved));
      setEditing(false);
    } catch {
      setSaveError("Нет соединения. Попробуй ещё раз.");
    } finally {
      setSaving(false);
    }
  };

  const displayProfile = profile ?? { name: currentUser?.name ?? "", email: currentUser?.email ?? "", city: "", about: "", interests: "", age: 0 };
  const activeInterests = displayProfile.interests ? displayProfile.interests.split(",").map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="h-full overflow-y-auto animate-fade-in">

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4" onClick={() => setEditing(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">Редактировать профиль</h3>
              <button onClick={() => setEditing(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">
                <Icon name="X" size={15} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Имя</label>
                <Input value={editName} onChange={e => setEditName(e.target.value)} className="bg-secondary border-0 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Город</label>
                  <Input value={editCity} onChange={e => setEditCity(e.target.value)} placeholder="Москва" className="bg-secondary border-0 rounded-xl" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Возраст</label>
                  <Input value={editAge} onChange={e => setEditAge(e.target.value)} placeholder="25" type="number" className="bg-secondary border-0 rounded-xl" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">О себе</label>
                <Textarea value={editAbout} onChange={e => setEditAbout(e.target.value)} placeholder="Расскажи о себе..." className="bg-secondary border-0 rounded-xl resize-none" rows={3} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Интересы</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(i => (
                    <button key={i} onClick={() => setEditInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                      className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all",
                        editInterests.includes(i) ? "gradient-spark text-white" : "bg-secondary text-muted-foreground hover:text-foreground"
                      )}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              {saveError && <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">{saveError}</p>}

              <Button onClick={handleSave} disabled={saving} className="w-full gradient-spark border-0 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-60" style={{ height: 48 }}>
                {saving ? "Сохраняем..." : "Сохранить изменения"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto pb-6">
        <div className="relative">
          <div className="h-44 gradient-spark opacity-20 absolute inset-x-0 top-0" />
          <div className="relative pt-8 pb-4 px-4">
            <div className="flex items-end gap-4 mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl overflow-hidden bg-card border-4 border-background shadow-xl">
                  <img src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(displayProfile.name || "Me")}&backgroundColor=ffb3ba`} alt="Я" className="w-full h-full object-cover" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 gradient-spark rounded-xl flex items-center justify-center shadow-lg">
                  <Icon name="Camera" size={13} className="text-white" />
                </button>
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{displayProfile.name || "Профиль"}</h2>
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Icon name="Check" size={10} className="text-white" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {[displayProfile.age ? `${displayProfile.age} лет` : null, displayProfile.city].filter(Boolean).join(" · ") || displayProfile.email}
                </p>
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
            <p className="text-sm font-semibold mb-2">О себе</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {displayProfile.about || "Расскажи о себе — нажми «Редактировать профиль»"}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-4">
            <p className="text-sm font-semibold mb-3">Интересы</p>
            <div className="flex flex-wrap gap-2">
              {activeInterests.length > 0
                ? activeInterests.map(i => (
                    <span key={i} className="px-3 py-1.5 gradient-spark text-white rounded-full text-xs font-medium">{i}</span>
                  ))
                : <span className="text-xs text-muted-foreground">Не указаны — добавь в редактировании</span>
              }
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

          <Button onClick={openEdit} className="w-full h-12 gradient-spark border-0 text-white font-semibold rounded-2xl hover:opacity-90">
            <Icon name="Edit" size={16} className="mr-2" /> Редактировать профиль
          </Button>
        </div>
      </div>
    </div>
  );
}

interface SettingsSectionProps {
  onLogout: () => void;
}

export function SettingsSection({ onLogout }: SettingsSectionProps) {
  return (
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
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-border/50 last:border-0 cursor-pointer hover:bg-secondary/30 transition-colors" onClick={item.label === "Удалить аккаунт" ? undefined : undefined}>
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

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-card rounded-2xl card-glow hover:bg-secondary/30 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon name="LogOut" size={16} className="text-muted-foreground" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">Выйти из аккаунта</p>
            <p className="text-xs text-muted-foreground">Сессия будет завершена</p>
          </div>
        </button>
      </div>
    </div>
  );
}

interface SupportSectionProps {
  setSection: (s: Section) => void;
}

export function SupportSection({ setSection }: SupportSectionProps) {
  return (
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
  );
}