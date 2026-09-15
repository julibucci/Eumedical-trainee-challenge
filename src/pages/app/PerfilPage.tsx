import { type FormEvent, type ReactNode, useId, useState } from "react";
import { BadgeCheck, Mail, MessageCircle, Pencil, User } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Toggle } from "../../components/ui/Toggle";
import { initialNotificationPreferences, patientProfile } from "../../mocks/patientProfile";
import type { NotificationPreferences, PatientProfile } from "../../types/patientProfile";

const ICON_SIZE = 20;
const ICON_STROKE_WIDTH = 1.75;

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-brand-dark-blue">{value}</p>
    </div>
  );
}

function PreferenceRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div>
        <p className="font-bold text-brand-dark-blue">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

function SupportOption({ icon, title, subtitle, onClick }: { icon: ReactNode; title: string; subtitle: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4 text-center transition-colors hover:bg-gray-50"
    >
      {icon}
      <span className="text-sm font-bold text-brand-dark-blue">{title}</span>
      <span className="text-xs text-gray-500">{subtitle}</span>
    </button>
  );
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<PatientProfile>(patientProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<PatientProfile>(patientProfile);
  const [preferences, setPreferences] = useState<NotificationPreferences>(initialNotificationPreferences);
  const [supportMessage, setSupportMessage] = useState("");
  const messageId = useId();

  function startEditing() {
    setFormValues(profile);
    setIsEditing(true);
  }

  function handleSaveProfile(event: FormEvent) {
    event.preventDefault();
    // Mock: sin backend real, los cambios solo viven en el estado de esta página — ver README.
    setProfile(formValues);
    setIsEditing(false);
    toast.success("Cambios guardados (mock)");
  }

  function updatePreference(key: keyof NotificationPreferences, value: boolean) {
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  function handleSupportOption(channel: string) {
    toast(`Abriendo ${channel} (mock)`);
  }

  function handleSendMessage(event: FormEvent) {
    event.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportMessage("");
    toast.success("Mensaje enviado — te respondemos a la brevedad");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-brand-dark-blue sm:text-3xl">Perfil y soporte</h2>
        <p className="mt-1 text-gray-500">Datos personales y preferencias</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Datos personales */}
        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-brand-dark-blue">
              <User aria-hidden="true" size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
              Datos personales
            </h3>
            {!isEditing && (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-bold text-brand-dark-blue transition-colors hover:bg-gray-50"
              >
                <Pencil aria-hidden="true" size={16} strokeWidth={ICON_STROKE_WIDTH} />
                Editar
              </button>
            )}
          </div>

          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-medium-aqua text-lg font-bold text-white">
              {profile.initials}
            </span>
            <div>
              <p className="font-bold text-brand-dark-blue">{profile.fullName}</p>
              <p className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
                <span>
                  {profile.status} · ID #{profile.patientId}
                </span>
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <BadgeCheck aria-hidden="true" size={16} strokeWidth={ICON_STROKE_WIDTH} />
                    Cuenta verificada
                  </span>
                )}
              </p>
            </div>
          </div>

          <hr className="my-5 border-gray-100" />

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="NOMBRE COMPLETO"
                  value={formValues.fullName}
                  onChange={(event) => setFormValues((current) => ({ ...current, fullName: event.target.value }))}
                />
                <Input
                  label="EMAIL"
                  type="email"
                  value={formValues.email}
                  onChange={(event) => setFormValues((current) => ({ ...current, email: event.target.value }))}
                />
                <Input
                  label="TELÉFONO"
                  value={formValues.phone}
                  onChange={(event) => setFormValues((current) => ({ ...current, phone: event.target.value }))}
                />
                <Input
                  label="OBRA SOCIAL / SEGURO"
                  value={formValues.insurance}
                  onChange={(event) => setFormValues((current) => ({ ...current, insurance: event.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Guardar cambios</Button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-brand-dark-blue transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <ReadOnlyField label="NOMBRE COMPLETO" value={profile.fullName} />
              <ReadOnlyField label="EMAIL" value={profile.email} />
              <ReadOnlyField label="TELÉFONO" value={profile.phone} />
              <ReadOnlyField label="OBRA SOCIAL / SEGURO" value={profile.insurance} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {/* Preferencias */}
          <div className="rounded-2xl bg-white p-6">
            <h3 className="font-display text-lg font-bold text-brand-dark-blue">Preferencias de notificaciones</h3>
            <div className="mt-2 flex flex-col divide-y divide-gray-100">
              <PreferenceRow
                label="Recordatorios de consulta"
                description="24 y 1 hora antes"
                checked={preferences.appointmentReminders}
                onChange={(value) => updatePreference("appointmentReminders", value)}
              />
              <PreferenceRow
                label="Alertas de vencimiento de recetas"
                description="5 días antes"
                checked={preferences.prescriptionAlerts}
                onChange={(value) => updatePreference("prescriptionAlerts", value)}
              />
              <PreferenceRow
                label="Consejos de salud semanales"
                description="Cada lunes"
                checked={preferences.weeklyTips}
                onChange={(value) => updatePreference("weeklyTips", value)}
              />
            </div>
          </div>

          {/* Contactar soporte */}
          <div className="rounded-2xl bg-white p-6">
            <h3 className="font-display text-lg font-bold text-brand-dark-blue">Contactar soporte</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <SupportOption
                icon={<MessageCircle aria-hidden="true" size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-brand-dark-blue" />}
                title="Chat en vivo"
                subtitle="Respuesta inmediata"
                onClick={() => handleSupportOption("chat en vivo")}
              />
              <SupportOption
                icon={<Mail aria-hidden="true" size={22} strokeWidth={ICON_STROKE_WIDTH} className="text-brand-dark-blue" />}
                title="Email"
                subtitle="En menos de 24 hs"
                onClick={() => handleSupportOption("email")}
              />
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 flex flex-col gap-3">
              <label htmlFor={messageId} className="sr-only">
                Mensaje para soporte
              </label>
              <textarea
                id={messageId}
                value={supportMessage}
                onChange={(event) => setSupportMessage(event.target.value)}
                placeholder="Escribí tu consulta o problema..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-brand-dark-blue placeholder:text-gray-400"
              />
              <Button type="submit" fullWidth>
                Enviar mensaje
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
