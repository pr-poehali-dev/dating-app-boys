import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    emoji: "🔗",
    title: "Найди своё звено",
    desc: "Цепь соединяет людей по интересам, ценностям и характеру. Здесь не просто фото — здесь настоящие люди.",
    bg: "from-spark-pink/20 via-background to-background",
    accent: "#f43f7f",
  },
  {
    emoji: "✨",
    title: "Симпатия — это начало",
    desc: "Поставь симпатию, получи взаимность — и цепочка замкнулась. Общайтесь, назначайте встречи, влюбляйтесь.",
    bg: "from-spark-purple/20 via-background to-background",
    accent: "#a855f7",
  },
  {
    emoji: "🛡️",
    title: "Безопасно и честно",
    desc: "Верифицированные профили, настройки приватности и служба поддержки — мы заботимся о каждом звене цепи.",
    bg: "from-blue-500/20 via-background to-background",
    accent: "#3b82f6",
  },
];

interface OnboardingProps {
  onDone: () => void;
}

export default function Onboarding({ onDone }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  const next = () => {
    if (isLast) {
      setExiting(true);
      setTimeout(onDone, 400);
    } else {
      setStep(s => s + 1);
    }
  };

  const skip = () => {
    setExiting(true);
    setTimeout(onDone, 400);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col bg-background transition-opacity duration-400",
        exiting ? "opacity-0" : "opacity-100"
      )}
      style={{ fontFamily: "'Golos Text', sans-serif" }}
    >
      {/* Background gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-b transition-all duration-500", slide.bg)} />

      {/* Skip */}
      <div className="relative z-10 flex justify-end px-5 pt-5">
        <button
          onClick={skip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-xl hover:bg-secondary"
        >
          Пропустить
        </button>
      </div>

      {/* Logo */}
      <div className="relative z-10 flex items-center justify-center gap-2 mt-4">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="ob-logo" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f43f7f"/>
              <stop offset="1" stopColor="#a855f7"/>
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="10" fill="url(#ob-logo)"/>
          <path d="M9 22 L9 11 C9 9.9 9.9 9 11 9 L15 9 C16.1 9 17 9.9 17 11 L17 22" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22 L19 22" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M19 22 L19 18" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          <ellipse cx="22" cy="14" rx="3" ry="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
        </svg>
        <span className="font-bold text-base gradient-spark-text">Цепь</span>
      </div>

      {/* Slide content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Emoji illustration */}
        <div
          className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl mb-8 animate-scale-in"
          style={{ background: `${slide.accent}18`, boxShadow: `0 0 60px ${slide.accent}30` }}
        >
          {slide.emoji}
        </div>

        {/* Text */}
        <h2
          key={step}
          className="text-2xl font-bold mb-4 animate-fade-in"
        >
          {slide.title}
        </h2>
        <p
          key={`desc-${step}`}
          className="text-muted-foreground text-base leading-relaxed max-w-xs animate-fade-in"
        >
          {slide.desc}
        </p>
      </div>

      {/* Bottom */}
      <div className="relative z-10 px-6 pb-10 space-y-5">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={cn(
                "rounded-full transition-all duration-300",
                i === step
                  ? "w-6 h-2 gradient-spark"
                  : "w-2 h-2 bg-secondary hover:bg-muted-foreground"
              )}
            />
          ))}
        </div>

        {/* Button */}
        <Button
          onClick={next}
          className="w-full h-13 gradient-spark border-0 text-white font-bold rounded-2xl text-base hover:opacity-90 transition-opacity"
          style={{ height: 52 }}
        >
          {isLast ? "Начать знакомства" : "Далее"}
        </Button>
      </div>
    </div>
  );
}
