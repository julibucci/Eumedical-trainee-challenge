import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useNotifications } from "../hooks/useNotifications";
import { notifications as initialNotifications } from "../mocks/notifications";

describe("useNotifications", () => {
  it("starts with the unread count from the initial mock", () => {
    const { result } = renderHook(() => useNotifications());

    const expectedUnread = initialNotifications.filter(
      (notification) => !notification.read,
    ).length;
    expect(result.current.unreadCount).toBe(expectedUnread);
    expect(result.current.notifications).toEqual(initialNotifications);
  });

  it("markAsRead marks only the given notification and lowers the count", () => {
    const { result } = renderHook(() => useNotifications());
    const unreadBefore = result.current.unreadCount;
    const [firstUnread] = result.current.notifications.filter(
      (notification) => !notification.read,
    );

    act(() => {
      result.current.markAsRead(firstUnread.id);
    });

    expect(result.current.unreadCount).toBe(unreadBefore - 1);
    expect(
      result.current.notifications.find(
        (notification) => notification.id === firstUnread.id,
      )?.read,
    ).toBe(true);
  });

  it("markAllAsRead marks all as read and leaves the count at 0", () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.markAllAsRead();
    });

    expect(result.current.unreadCount).toBe(0);
    expect(
      result.current.notifications.every((notification) => notification.read),
    ).toBe(true);
  });
});
