type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Descripción accesible (el texto visible lo arma el consumidor al lado del toggle). */
  label: string;
};

/** Interruptor on/off reutilizable (preferencias de notificaciones, etc.). */
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-brand-medium-aqua" : "bg-gray-300"
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
