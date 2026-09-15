import { create } from "zustand";

export type Language = "es" | "en";

type LanguageState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

/** Idioma de la landing de marketing — separado de useAuthStore, no tiene relación con la sesión. */
export const useLanguageStore = create<LanguageState>((set) => ({
  language: "es",
  setLanguage: (language) => set({ language }),
}));
