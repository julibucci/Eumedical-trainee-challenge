import type { Notification } from "../types/notification";

export const notifications: Notification[] = [
  {
    id: "notif-1",
    type: "receta",
    message: "Tu receta de Vitamina D 1000 UI vence en 6 días",
    timestamp: "Hace 2 horas",
    read: false,
    urgency: "media",
    href: "/app/recetas",
  },
  {
    id: "notif-2",
    type: "consulta",
    message: "Nueva consulta confirmada con Dra. Carla Rivas",
    timestamp: "Hace 5 horas",
    read: false,
    href: "/app/consultas",
  },
  {
    id: "notif-3",
    type: "documento",
    message: "Resultado de hemograma disponible",
    timestamp: "Ayer",
    read: true,
    href: "/app/documentos",
  },
  {
    id: "notif-4",
    type: "consulta",
    message: "Consulta con Dr. Sebastián Torres completada",
    timestamp: "28 ago",
    read: true,
    href: "/app/historial",
  },
  {
    id: "notif-5",
    type: "receta",
    message: "Receta de Losartán 50mg renovada",
    timestamp: "1 sep",
    read: true,
    urgency: "media",
    href: "/app/recetas",
  },
];
