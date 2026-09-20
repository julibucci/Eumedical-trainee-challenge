import { create } from "zustand";

export type Language = "es" | "en";

type LanguageState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

/** Language of the marketing landing — separate from useAuthStore, unrelated to the session. */
export const useLanguageStore = create<LanguageState>((set) => ({
  language: "es",
  setLanguage: (language) => set({ language }),
}));
