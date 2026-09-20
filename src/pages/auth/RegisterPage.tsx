import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";

// The visible messages come from FIELD_ERROR_MESSAGES; this schema only decides
// which field is invalid and in what order (see LoginPage for the same pattern).
const registerSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    // Only @gmail.com or @yahoo.com.ar accounts are accepted (specific request, not a general email rule).
    email: z.string().min(1).regex(/^[^\s@]+@(gmail\.com|yahoo\.com\.ar)$/i),
    password: z.string().min(6),
    confirmPassword: z.string(),
    acceptedTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"] })
  .refine((data) => data.acceptedTerms, { path: ["acceptedTerms"] });

type Field = "firstName" | "lastName" | "email" | "password" | "confirmPassword" | "acceptedTerms";

const FIELD_ERROR_MESSAGES: Record<Field, string> = {
  firstName: "Este campo es obligatorio.",
  lastName: "Este campo es obligatorio.",
  email: "Email inválido. Debe ser una cuenta @gmail.com o @yahoo.com.ar.",
  password: "La contraseña debe tener al menos 6 caracteres.",
  confirmPassword: "Las contraseñas no coinciden.",
  acceptedTerms: "Tenés que aceptar los términos para continuar.",
};

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

const INITIAL_VALUES: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerWithName = useAuthStore((state) => state.registerWithName);
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errorField, setErrorField] = useState<Field | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setValue<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function clearError(field: Field) {
    setErrorField((current) => (current === field ? null : current));
  }

  // Re-validates only `field` against the current state; if still invalid, shows it.
  // Used on onBlur to check field by field, in addition to the full check on submit.
  function checkFieldOnBlur(field: Field) {
    return () => {
      const result = registerSchema.safeParse(values);
      if (!result.success && result.error.issues.some((issue) => issue.path[0] === field)) {
        setErrorField(field);
      }
    };
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result = registerSchema.safeParse(values);
    if (!result.success) {
      // Only the error of the first invalid field is shown, top to bottom.
      setErrorField(result.error.issues[0].path[0] as Field);
      return;
    }

    setErrorField(null);
    setIsSubmitting(true);
    // Mocked registration: no real backend, account creation is simulated and the
    // user is signed in directly as if registration had logged them in.
    // In production this would call a real endpoint (with email confirmation, etc.) — see README.
    registerWithName(values.firstName, values.lastName);
    window.setTimeout(() => navigate("/app"), 500);
  }

  return (
    <AuthLayout>
      <h2 className="font-display text-2xl font-bold text-brand-dark-blue">Creá tu cuenta</h2>
      <p className="mt-1 text-gray-500">Empezá a gestionar tu salud en un solo lugar</p>

      <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <Input
          label="NOMBRE"
          autoComplete="given-name"
          required
          aria-required="true"
          value={values.firstName}
          onChange={(event) => {
            setValue("firstName", event.target.value);
            clearError("firstName");
          }}
          onFocus={() => clearError("firstName")}
          onBlur={checkFieldOnBlur("firstName")}
          error={errorField === "firstName" ? FIELD_ERROR_MESSAGES.firstName : undefined}
        />

        <Input
          label="APELLIDO"
          autoComplete="family-name"
          required
          aria-required="true"
          value={values.lastName}
          onChange={(event) => {
            setValue("lastName", event.target.value);
            clearError("lastName");
          }}
          onFocus={() => clearError("lastName")}
          onBlur={checkFieldOnBlur("lastName")}
          error={errorField === "lastName" ? FIELD_ERROR_MESSAGES.lastName : undefined}
        />

        <Input
          label="EMAIL"
          type="email"
          placeholder="nombre@correo.com"
          autoComplete="email"
          required
          aria-required="true"
          value={values.email}
          onChange={(event) => {
            setValue("email", event.target.value);
            clearError("email");
          }}
          onFocus={() => clearError("email")}
          onBlur={checkFieldOnBlur("email")}
          error={errorField === "email" ? FIELD_ERROR_MESSAGES.email : undefined}
        />

        <Input
          label="CONTRASEÑA"
          type="password"
          autoComplete="new-password"
          required
          aria-required="true"
          value={values.password}
          onChange={(event) => {
            setValue("password", event.target.value);
            clearError("password");
          }}
          onFocus={() => clearError("password")}
          onBlur={checkFieldOnBlur("password")}
          error={errorField === "password" ? FIELD_ERROR_MESSAGES.password : undefined}
        />

        <Input
          label="CONFIRMAR CONTRASEÑA"
          type="password"
          autoComplete="new-password"
          required
          aria-required="true"
          value={values.confirmPassword}
          onChange={(event) => {
            setValue("confirmPassword", event.target.value);
            clearError("confirmPassword");
          }}
          onFocus={() => clearError("confirmPassword")}
          onBlur={checkFieldOnBlur("confirmPassword")}
          error={errorField === "confirmPassword" ? FIELD_ERROR_MESSAGES.confirmPassword : undefined}
        />

        <Checkbox
          label={
            <>
              Acepto los{" "}
              <Link to="/terminos" className="font-bold text-brand-dark-blue underline">
                Términos y condiciones
              </Link>{" "}
              y la{" "}
              <Link to="/privacidad" className="font-bold text-brand-dark-blue underline">
                Política de privacidad
              </Link>
            </>
          }
          checked={values.acceptedTerms}
          onChange={(event) => {
            setValue("acceptedTerms", event.target.checked);
            clearError("acceptedTerms");
          }}
          error={errorField === "acceptedTerms" ? FIELD_ERROR_MESSAGES.acceptedTerms : undefined}
        />

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="font-bold text-brand-dark-blue hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
