type PatientAvatarProps = {
  initials: string;
  size?: "sm" | "md";
};

/** Avatar circular con iniciales, reutilizado en el header y en el menú de usuario del sidebar. */
export function PatientAvatar({ initials, size = "md" }: PatientAvatarProps) {
  const dimensions = size === "sm" ? "h-9 w-9 text-sm" : "h-11 w-11 text-base";
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-brand-medium-aqua font-bold text-white ${dimensions}`}>
      {initials}
    </span>
  );
}
