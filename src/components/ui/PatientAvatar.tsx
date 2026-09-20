type PatientAvatarProps = {
  initials: string;
  /** Profile photo uploaded in Perfil y soporte; if there is none, the initials are shown. */
  avatarUrl?: string | null;
  size?: "sm" | "md";
};

/** Circular avatar (photo or initials), reused in the header and in the sidebar user menu. */
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
