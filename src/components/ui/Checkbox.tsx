import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from "react";
import { FieldError } from "./FieldError";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  error?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2.5">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`mt-0.5 h-5 w-5 shrink-0 rounded border-gray-400 text-brand-orange ${
              error ? "ring-2 ring-red-500" : ""
            } ${className}`}
            {...props}
          />
          <label htmlFor={inputId} className="text-sm text-gray-700">
            {label}
          </label>
        </div>
        {error && <FieldError id={errorId} message={error} />}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";
