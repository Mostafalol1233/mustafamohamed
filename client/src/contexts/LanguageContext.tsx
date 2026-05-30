import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, type Lang, type TranslationKeys } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationKeys;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
  isRtl: false,
});

function getInitialLang(): Lang {
  try {
    const saved = localStorage.getItem("portfolio-lang");
    if (saved === "ar" || saved === "en") return saved;
  } catch {}
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("portfolio-lang", l); } catch {}
    document.documentElement.setAttribute("lang", l);
    document.documentElement.setAttribute("dir", "ltr");
  };

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", "ltr");
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], isRtl: false }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
