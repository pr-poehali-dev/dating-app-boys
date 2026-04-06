import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { INTERESTS, type Section } from "@/components/data";

interface ProfileSectionProps {
  likedProfiles: number[];
}

export function ProfileSection({ likedProfiles }: ProfileSectionProps) {
  return (
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
  );
}

export function SettingsSection() {
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
