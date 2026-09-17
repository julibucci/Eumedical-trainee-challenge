import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { BadgeCheck, Camera, Mail, MessageCircle, Pencil, User } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Toggle } from "../../components/ui/Toggle";
import { initialNotificationPreferences, patientProfile } from "../../mocks/patientProfile";
import { useAuthStore } from "../../store/authStore";
import type { NotificationPreferences, PatientProfile } from "../../types/patientProfile";

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

const ICON_SIZE = 20;
const ICON_STROKE_WIDTH = 1.75;

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 whitespace-pre-line text-brand-dark-blue">{value}</p>
    </div>
  );
}

function ProfileAvatar({
  avatarUrl,
  initials,
  isEditing,
  onPickPhoto,
}: {
  avatarUrl: string | null;
  initials: string;
  isEditing: boolean;
  onPickPhoto: () => void;
}) {
  return (
    <div className="relative shrink-0">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-medium-aqua text-3xl font-bold text-white">
          {initials}
        </span>
      )}
      {isEditing && (
        <button
          type="button"
          onClick={onPickPhoto}
          aria-label="Cambiar foto de perfil"
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-dark-blue text-white transition-colors hover:bg-brand-dark-blue/90"
        >
          <Camera aria-hidden="true" size={16} strokeWidth={ICON_STROKE_WIDTH} />
        </button>
      )}
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
        <p className="font-heading font-bold text-brand-dark-blue">{label}</p>
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
      <span className="font-heading text-sm font-bold text-brand-dark-blue">{title}</span>
      <span className="text-xs text-gray-500">{subtitle}</span>
    </button>
  );
}

export default function PerfilPage() {
  const setHeaderAvatarUrl = useAuthStore((state) => state.setAvatarUrl);
  const [profile, setProfile] = useState<PatientProfile>(patientProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<PatientProfile>(patientProfile);
  const [preferences, setPreferences] = useState<NotificationPreferences>(initialNotificationPreferences);
  const [supportMessage, setSupportMessage] = useState("");
  const messageId = useId();
  const conditionsId = useId();
  const avatarInputId = useId();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  // Preview sin guardar todavía: se revoca si se reemplaza, se cancela o se abandona la edición.
  // Una vez guardada (handleSaveProfile), la URL pasa a ser del estado global — no se revoca acá.
  const pendingPreviewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (pendingPreviewUrlRef.current) URL.revokeObjectURL(pendingPreviewUrlRef.current);
    };
  }, []);

  function startEditing() {
    setFormValues(profile);
    setIsEditing(true);
  }

  function cancelEditing() {
    if (pendingPreviewUrlRef.current) {
      URL.revokeObjectURL(pendingPreviewUrlRef.current);
      pendingPreviewUrlRef.current = null;
    }
    setIsEditing(false);
  }

  function handleSaveProfile(event: FormEvent) {
    event.preventDefault();
    // Mock: sin backend real, los cambios solo viven en el estado de esta página — ver README.
    setProfile(formValues);
    // La foto también se refleja en el avatar del header/sidebar (estado global de sesión).
    setHeaderAvatarUrl(formValues.avatarUrl);
    pendingPreviewUrlRef.current = null;
    setIsEditing(false);
    toast.success("Cambios guardados (mock)");
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Elegí un archivo de imagen (JPG, PNG)");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      toast.error("La imagen supera el máximo de 5 MB");
      return;
    }

    // Mock: sin backend real, la foto vive como object URL en memoria del navegador.
    if (pendingPreviewUrlRef.current) URL.revokeObjectURL(pendingPreviewUrlRef.current);
    const url = URL.createObjectURL(file);
    pendingPreviewUrlRef.current = url;
    setFormValues((current) => ({ ...current, avatarUrl: url }));
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
        <h2 className="font-display text-2xl font-medium text-brand-dark-blue sm:text-3xl">Perfil y soporte</h2>
        <p className="mt-1 text-gray-500">Datos personales y preferencias</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Datos personales */}
        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-2 font-display text-lg font-medium text-brand-dark-blue">
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
            <ProfileAvatar
              avatarUrl={(isEditing ? formValues.avatarUrl : profile.avatarUrl) ?? null}
              initials={profile.initials}
              isEditing={isEditing}
              onPickPhoto={() => avatarInputRef.current?.click()}
            />
            <label htmlFor={avatarInputId} className="sr-only">
              Foto de perfil
            </label>
            <input
              ref={avatarInputRef}
              id={avatarInputId}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="sr-only"
            />
            <div>
              <p className="font-heading font-bold text-brand-dark-blue">{profile.fullName}</p>
              <p className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
                <span>
                  {profile.status} · ID #{profile.patientId}
                </span>
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 text-brand-dark-blue">
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
                <Input
                  label="EDAD"
                  type="number"
                  min={0}
                  max={120}
                  value={formValues.age ?? ""}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      age: event.target.value === "" ? null : Number(event.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <label htmlFor={conditionsId} className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  Enfermedades preexistentes <span className="font-normal text-gray-400">(opcional)</span>
                </label>
                <textarea
                  id={conditionsId}
                  value={formValues.preexistingConditions}
                  onChange={(event) =>
                    setFormValues((current) => ({ ...current, preexistingConditions: event.target.value }))
                  }
                  placeholder="Ej: Diabetes tipo 2, hipertensión, alergia a la penicilina..."
                  rows={3}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-brand-dark-blue placeholder:text-gray-400"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Compartilo solo si querés — ayuda a tu médico a darte una mejor atención.
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Guardar cambios</Button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-brand-dark-blue transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <ReadOnlyField label="NOMBRE COMPLETO" value={profile.fullName} />
                <ReadOnlyField label="EMAIL" value={profile.email} />
                <ReadOnlyField label="TELÉFONO" value={profile.phone} />
                <ReadOnlyField label="OBRA SOCIAL / SEGURO" value={profile.insurance} />
                <ReadOnlyField label="EDAD" value={profile.age !== null ? `${profile.age} años` : "No especificada"} />
              </div>
              <ReadOnlyField
                label="Enfermedades preexistentes"
                value={profile.preexistingConditions.trim() || "Ninguna registrada"}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {/* Preferencias */}
          <div className="rounded-2xl bg-white p-6">
            <h3 className="font-display text-lg font-medium text-brand-dark-blue">Preferencias de notificaciones</h3>
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
            <h3 className="font-display text-lg font-medium text-brand-dark-blue">Contactar soporte</h3>
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
