import { create } from "zustand";

type SessionUser = {
  firstName: string;
  fullName: string;
  initials: string;
};

type AuthState = {
  user: SessionUser | null;
  /** Foto subida en Perfil y soporte — vive acá para reflejarse también en el avatar del header. */
  avatarUrl: string | null;
  /** Login mockeado: no hay backend, así que el nombre se estima a partir del email. */
  loginWithEmail: (email: string) => void;
  registerWithName: (firstName: string, lastName: string) => void;
  setAvatarUrl: (avatarUrl: string | null) => void;
  logout: () => void;
};

function capitalize(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function initialsFrom(firstName: string, lastName?: string): string {
  const first = firstName.trim().charAt(0).toUpperCase();
  const last = lastName?.trim().charAt(0).toUpperCase() ?? "";
  return `${first}${last}` || "U";
}

function displayNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] ?? "";
  const firstToken = localPart.split(/[._-]+/)[0] || "Usuario";
  return capitalize(firstToken);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  avatarUrl: null,
  setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
  loginWithEmail: (email) => {
    const firstName = displayNameFromEmail(email);
    set({ user: { firstName, fullName: firstName, initials: initialsFrom(firstName) } });
  },
  registerWithName: (firstName, lastName) => {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    set({
      user: {
        firstName: trimmedFirst,
        fullName: `${trimmedFirst} ${trimmedLast}`.trim(),
        initials: initialsFrom(trimmedFirst, trimmedLast),
      },
    });
  },
  logout: () =>
    set((state) => {
      if (state.avatarUrl) URL.revokeObjectURL(state.avatarUrl);
      return { user: null, avatarUrl: null };
    }),
}));
