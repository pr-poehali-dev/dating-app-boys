import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

type AuthMode = "welcome" | "login" | "register";

interface AuthProps {
  onDone: () => void;
}

export default function Auth({ onDone }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>("welcome");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [exiting, setExiting] = useState(false);

  const finish = () => {
    setExiting(true);
    setTimeout(onDone, 400);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[150] flex flex-col bg-background transition-opacity duration-400",
        exiting ? "opacity-0" : "opacity-100"
      )}
      style={{ fontFamily: "'Golos Text', sans-serif" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-spark-pink/10 via-background to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-spark-purple/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 py-10 max-w-sm mx-auto w-full">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="auth-logo" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f43f7f"/>
                <stop offset="1" stopColor="#a855f7"/>
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="10" fill="url(#auth-logo)"/>
            <path d="M9 22 L9 11 C9 9.9 9.9 9 11 9 L15 9 C16.1 9 17 9.9 17 11 L17 22" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22 L19 22" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M19 22 L19 18" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            <ellipse cx="22" cy="14" rx="3" ry="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
          </svg>
          <span className="font-bold text-base gradient-spark-text">Цепь</span>
        </div>

        {/* WELCOME */}
        {mode === "welcome" && (
          <div className="flex flex-col items-center text-center animate-fade-in">
            <div className="w-24 h-24 rounded-3xl gradient-spark flex items-center justify-center text-5xl mb-6 shadow-lg" style={{ boxShadow: "0 0 60px #f43f7f40" }}>
              🔗
            </div>
            <h1 className="text-3xl font-bold mb-3">Добро пожаловать</h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-2">
              Каждое знакомство — новое звено.<br/>Начни свою цепочку прямо сейчас.
            </p>
          </div>
        )}

        {/* LOGIN */}
        {mode === "login" && (
          <div className="animate-fade-in space-y-2">
            <h2 className="text-2xl font-bold mb-1">Вход</h2>
            <p className="text-muted-foreground text-sm mb-6">Рады снова видеть тебя</p>
            <div className="space-y-3">
              <div className="relative">
                <Icon name="Mail" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 bg-card border-border rounded-2xl h-12"
                />
              </div>
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Пароль"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-card border-border rounded-2xl h-12"
                />
                <button
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>
              <button className="text-sm text-spark-pink hover:underline w-full text-right">
                Забыл пароль?
              </button>
            </div>
          </div>
        )}

        {/* REGISTER */}
        {mode === "register" && (
          <div className="animate-fade-in space-y-2">
            <h2 className="text-2xl font-bold mb-1">Регистрация</h2>
            <p className="text-muted-foreground text-sm mb-6">Создай аккаунт — это займёт минуту</p>
            <div className="space-y-3">
              <div className="relative">
                <Icon name="User" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Твоё имя"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-10 bg-card border-border rounded-2xl h-12"
                />
              </div>
              <div className="relative">
                <Icon name="Mail" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 bg-card border-border rounded-2xl h-12"
                />
              </div>
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Придумай пароль"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-card border-border rounded-2xl h-12"
                />
                <button
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Регистрируясь, ты соглашаешься с{" "}
                <button className="text-spark-pink hover:underline">условиями использования</button>
              </p>
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div className="space-y-3">
          {mode === "welcome" && (
            <>
              <Button
                onClick={() => setMode("register")}
                className="w-full h-13 gradient-spark border-0 text-white font-bold rounded-2xl text-base hover:opacity-90"
                style={{ height: 52 }}
              >
                Создать аккаунт
              </Button>
              <Button
                onClick={() => setMode("login")}
                variant="outline"
                className="w-full rounded-2xl border-border text-foreground font-semibold"
                style={{ height: 52 }}
              >
                Войти
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">или войди через</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Google", icon: "Globe" },
                  { label: "VK", icon: "Users" },
                ].map(s => (
                  <button
                    key={s.label}
                    className="flex items-center justify-center gap-2 h-12 bg-card border border-border rounded-2xl text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    <Icon name={s.icon as "Globe"} size={16} className="text-muted-foreground" />
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {mode === "login" && (
            <>
              <Button
                onClick={finish}
                className="w-full gradient-spark border-0 text-white font-bold rounded-2xl hover:opacity-90"
                style={{ height: 52 }}
              >
                Войти
              </Button>
              <button
                onClick={() => setMode("welcome")}
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                <Icon name="ArrowLeft" size={15} />
                Назад
              </button>
            </>
          )}

          {mode === "register" && (
            <>
              <Button
                onClick={finish}
                className="w-full gradient-spark border-0 text-white font-bold rounded-2xl hover:opacity-90"
                style={{ height: 52 }}
              >
                Зарегистрироваться
              </Button>
              <button
                onClick={() => setMode("welcome")}
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                <Icon name="ArrowLeft" size={15} />
                Назад
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
