import { useEffect, useRef, useState } from "react";
import { Bell, BellOff, FileText, MessageCircle, Pill, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { Notification, NotificationType } from "../../types/notification";
import { EumedicalCross } from "../ui/EumedicalCross";

const ICON_SIZE = 18;
const ICON_STROKE_WIDTH = 1.75;

const RECETA_URGENCY_STYLES: Record<NonNullable<Notification["urgency"]>, { bg: string; color: string }> = {
  alta: { bg: "bg-brand-yellow", color: "text-brand-dark-blue" },
  media: { bg: "bg-brand-yellow/20", color: "text-brand-dark-blue" },
};

const TYPE_STYLES: Record<Exclude<NotificationType, "receta">, { icon: LucideIcon; bg: string; color: string }> = {
  consulta: { icon: MessageCircle, bg: "bg-brand-medium-aqua/20", color: "text-brand-dark-blue" },
  documento: { icon: FileText, bg: "bg-brand-pale-sage", color: "text-brand-dark-blue" },
};

function getNotificationStyle(notification: Notification): { icon: LucideIcon; bg: string; color: string } {
  if (notification.type === "receta") {
    return { icon: Pill, ...RECETA_URGENCY_STYLES[notification.urgency ?? "media"] };
  }
  return TYPE_STYLES[notification.type];
}

type NotificationsDropdownProps = {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
};

/** Notifications bell dropdown */
export function NotificationsDropdown({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function handleSelect(notification: Notification) {
    onMarkAsRead(notification.id);
    setIsOpen(false);
    if (notification.href) navigate(notification.href);
  }

  /* View more notifications --> Leads to mock */
  function handleViewAll() {
    setIsOpen(false);
    toast("Vista completa de notificaciones (próximamente)");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={unreadCount > 0 ? `Notificaciones, ${unreadCount} sin leer` : "Notificaciones"}
        onClick={() => setIsOpen((current) => !current)}
        className="relative rounded-full p-2 hover:bg-brand-grey"
      >
        <Bell aria-hidden="true" size={20} strokeWidth={ICON_STROKE_WIDTH} className="text-brand-dark-blue" />
        {unreadCount > 0 && <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-orange" />}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Notificaciones"
          className="absolute right-0 top-full z-50 mt-2 w-[380px] max-w-[90vw] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
        >
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
            <p className="font-display font-medium text-brand-dark-blue">Notificaciones</p>
            <button
              type="button"
              disabled={unreadCount === 0}
              onClick={onMarkAllAsRead}
              className="text-xs font-bold text-brand-dark-blue hover:underline disabled:cursor-not-allowed disabled:text-gray-300 disabled:no-underline"
            >
              Marcar todas como leídas
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="relative flex flex-col items-center gap-2 overflow-hidden px-6 py-10 text-center">
              <EumedicalCross
                size={100}
                color="#1e4865"
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
              />
              <BellOff aria-hidden="true" size={28} strokeWidth={ICON_STROKE_WIDTH} className="text-gray-300" />
              <p className="text-sm text-gray-500">No tenés notificaciones por el momento</p>
            </div>
          ) : (
            <ul role="none" className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => {
                const { icon: Icon, bg, color } = getNotificationStyle(notification);
                return (
                  <li key={notification.id} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelect(notification)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                        notification.read ? "bg-white" : "bg-brand-light-aqua/15"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${notification.read ? "" : "bg-brand-orange"}`}
                      />
                      <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${bg}`}>
                        <Icon size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} className={color} />
                      </span>
                      <span className="flex-1">
                        <span className={`block text-sm ${notification.read ? "text-gray-600" : "font-bold text-gray-900"}`}>
                          {notification.message}
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-400">{notification.timestamp}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="border-t border-gray-100 px-4 py-3 text-center">
            <button type="button" onClick={handleViewAll} className="text-sm font-bold text-brand-dark-blue hover:underline">
              Ver todas las notificaciones
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
