import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";

// Los mensajes de validación son internos (no se muestran): el texto que ve el
// usuario sale de FIELD_ERROR_MESSAGES, fijo por campo.
const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1).regex(/(?=.*[A-Z])(?=.*[0-9])/),
});

type Field = "email" | "password";

const FIELD_ERROR_MESSAGES: Record<Field, string> = {
  email: "Email inválido, vuelve a intentarlo",
  password: "Contraseña incorrecta, vuelve a intentarlo",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const loginWithEmail = useAuthStore((state) => state.loginWithEmail);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorField, setErrorField] = useState<Field | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearError(field: Field) {
    setErrorField((current) => (current === field ? null : current));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      // Solo se muestra el error del primer campo inválido (email antes que contraseña).
      setErrorField(result.error.issues[0].path[0] as Field);
      return;
    }

    setErrorField(null);
    setIsSubmitting(true);
    // Login mockeado: sin backend real, cualquier combinación válida entra.
    // No hay nombre real que leer, así que se estima a partir del email para el saludo de /app.
    loginWithEmail(email);
    window.setTimeout(() => navigate("/app"), 500);
  }

  return (
    <AuthLayout>
      <h2 className="font-display text-2xl font-bold text-brand-dark-blue">Bienvenido/a de vuelta</h2>
      <p className="mt-1 text-gray-500">Ingresá a tu área de paciente</p>

      <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <Input
          label="EMAIL"
          type="email"
          placeholder="nombre@correo.com"
          autoComplete="email"
          required
          aria-required="true"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            clearError("email");
          }}
          onFocus={() => clearError("email")}
          error={errorField === "email" ? FIELD_ERROR_MESSAGES.email : undefined}
        />

        <Input
          label="CONTRASEÑA"
          labelExtra={
            <a href="/recuperar-contrasena" className="text-xs font-bold text-brand-orange hover:underline">
              Olvidé mi contraseña
            </a>
          }
          type="password"
          autoComplete="current-password"
          required
          aria-required="true"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            clearError("password");
          }}
          onFocus={() => clearError("password")}
          error={errorField === "password" ? FIELD_ERROR_MESSAGES.password : undefined}
        />

        <Checkbox label="Recordarme en este dispositivo" />

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Ingresar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        ¿No tenés cuenta?{" "}
        <a href="/registro" className="font-bold text-brand-dark-blue hover:underline">
          Registrate gratis
        </a>
      </p>
    </AuthLayout>
  );
}
