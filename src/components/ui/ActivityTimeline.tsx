import { FileText, MessageCircle, Pill } from "lucide-react";
import type { ActivityEvent, ActivityEventType } from "../../types/activity";

const ICON_SIZE = 18;
const ICON_STROKE_WIDTH = 1.75;

const TYPE_STYLES: Record<ActivityEventType, { icon: typeof MessageCircle; circle: string; icon_color: string }> = {
  consulta: { icon: MessageCircle, circle: "bg-brand-light-aqua/60", icon_color: "text-brand-dark-blue" },
  documento: { icon: FileText, circle: "bg-brand-grey", icon_color: "text-brand-dark-blue" },
  receta: { icon: Pill, circle: "bg-brand-yellow/25", icon_color: "text-brand-orange" },
};

type ActivityTimelineProps = {
  events: ActivityEvent[];
};

/** Generic vertical timeline: one circular icon per event type + date/title/subtitle. */
export function ActivityTimeline({ events }: ActivityTimelineProps) {
  return (
    <ol className="relative flex flex-col gap-6">
      <div aria-hidden="true" className="absolute bottom-1 left-[17px] top-1 w-px bg-brand-grey" />
      {events.map((event) => {
        const { icon: Icon, circle, icon_color } = TYPE_STYLES[event.type];
        return (
          <li key={event.id} className="relative flex gap-4">
            <span className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${circle}`}>
              <Icon aria-hidden="true" size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} className={icon_color} />
            </span>
            <div className="pt-0.5">
              <p className="text-xs text-gray-500">{event.date}</p>
              <p className="font-bold text-brand-dark-blue">{event.title}</p>
              <p className="text-sm text-gray-500">{event.subtitle}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
