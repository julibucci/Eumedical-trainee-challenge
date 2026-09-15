import { type InputHTMLAttributes, type ReactNode, forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FieldError } from "./FieldError";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /** Elemento adicional en la misma fila que el label (p. ej. un link "Olvidé mi contraseña"). */
  labelExtra?: ReactNode;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelExtra, error, id, className = "", type, required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const isPassword = type === "password";
    const [isRevealed, setIsRevealed] = useState(false);

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-wide text-gray-500">
            {label}
            {required && (
              <span className="text-red-500" aria-hidden="true">
                {" "}
                *
              </span>
            )}
          </label>
          {labelExtra}
        </div>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (isRevealed ? "text" : "password") : type}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-brand-dark-blue placeholder:text-gray-400 ${
              isPassword ? "pr-10" : ""
            } ${error ? "border-2 border-red-500" : "border-gray-300"} ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setIsRevealed((current) => !current)}
              aria-label={isRevealed ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-brand-dark-blue"
            >
              {isRevealed ? (
                <Eye aria-hidden="true" size={18} strokeWidth={1.75} />
              ) : (
                <EyeOff aria-hidden="true" size={18} strokeWidth={1.75} />
              )}
            </button>
          )}
        </div>
        {error && <FieldError id={errorId} message={error} />}
      </div>
    );
  },
);
Input.displayName = "Input";
