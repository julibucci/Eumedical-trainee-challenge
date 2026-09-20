import { afterEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "../store/authStore";

const INITIAL_STATE = useAuthStore.getState();

afterEach(() => {
  useAuthStore.setState(INITIAL_STATE, true);
  vi.restoreAllMocks();
});

describe("authStore", () => {
  describe("loginWithEmail", () => {
    it("estimates the name from the email's local part", () => {
      useAuthStore.getState().loginWithEmail("juan.perez@correo.com");

      const { user } = useAuthStore.getState();
      expect(user).toEqual({
        firstName: "Juan",
        fullName: "Juan",
        initials: "J",
      });
    });

    it("works with a local part without separators", () => {
      useAuthStore.getState().loginWithEmail("ana@correo.com");

      expect(useAuthStore.getState().user?.firstName).toBe("Ana");
    });

    it("falls back to 'Usuario' when the local part is empty", () => {
      useAuthStore.getState().loginWithEmail("@correo.com");

      expect(useAuthStore.getState().user?.firstName).toBe("Usuario");
    });
  });

  describe("registerWithName", () => {
    it("builds fullName and initials from first and last name", () => {
      useAuthStore.getState().registerWithName("María", "González");

      const { user } = useAuthStore.getState();
      expect(user).toEqual({
        firstName: "María",
        fullName: "María González",
        initials: "MG",
      });
    });

    it("trims whitespace from first and last name", () => {
      useAuthStore.getState().registerWithName("  Pedro  ", "  López  ");

      const { user } = useAuthStore.getState();
      expect(user?.fullName).toBe("Pedro López");
    });

    it("builds initials from the first name only when there is no last name", () => {
      useAuthStore.getState().registerWithName("Lucía", "");

      expect(useAuthStore.getState().user?.initials).toBe("L");
    });
  });

  describe("logout", () => {
    it("clears the user and the avatar", () => {
      useAuthStore.getState().loginWithEmail("juan@correo.com");
      useAuthStore.getState().setAvatarUrl("blob:mock-url");

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.avatarUrl).toBeNull();
    });

    it("revokes the avatar's object URL if there was one", () => {
      const revokeSpy = vi
        .spyOn(URL, "revokeObjectURL")
        .mockImplementation(() => {});
      useAuthStore.getState().setAvatarUrl("blob:mock-url");

      useAuthStore.getState().logout();

      expect(revokeSpy).toHaveBeenCalledWith("blob:mock-url");
    });

    it("does not call revokeObjectURL if there was no avatar", () => {
      const revokeSpy = vi
        .spyOn(URL, "revokeObjectURL")
        .mockImplementation(() => {});

      useAuthStore.getState().logout();

      expect(revokeSpy).not.toHaveBeenCalled();
    });
  });
});
