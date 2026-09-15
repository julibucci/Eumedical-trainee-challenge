type FieldErrorProps = {
  id: string;
  message: string;
};

/** Globo de error flotante para campos de formulario. Se ancla debajo del input que lo referencia por `aria-describedby`. */
export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <div id={id} role="alert" className="relative mt-2 flex items-start gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md">
      <span
        aria-hidden="true"
        className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white"
      />
      <span
        aria-hidden="true"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-red-500 text-xs font-bold leading-none text-white"
      >
        !
      </span>
      <p className="text-sm text-gray-800">{message}</p>
    </div>
  );
}
