type PatientAvatarProps = {
  initials: string;
  /** Foto de perfil subida en Perfil y soporte; si no hay, se muestran las iniciales. */
  avatarUrl?: string | null;
  size?: "sm" | "md";
};

/** Avatar circular (foto o iniciales), reutilizado en el header y en el menú de usuario del sidebar. */
export function PatientAvatar({ initials, avatarUrl, size = "md" }: PatientAvatarProps) {
  const dimensions = size === "sm" ? "h-9 w-9 text-sm" : "h-11 w-11 text-base";

  if (avatarUrl) {
    return <img src={avatarUrl} alt="" className={`shrink-0 rounded-full object-cover ${dimensions}`} />;
  }

  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-brand-medium-aqua font-bold text-white ${dimensions}`}>
      {initials}
    </span>
  );
}
