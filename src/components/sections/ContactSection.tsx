import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { FieldError } from "../ui/FieldError";
import { Input } from "../ui/Input";
import { EumedicalCross } from "../ui/EumedicalCross";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";
import type { ContactFormData } from "../../types/contact";

const contactSchema = z.object({
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  email: z.string().min(1).email(),
  mensaje: z.string().min(1),
  aceptaTerminos: z.literal(true),
});

type Field = keyof ContactFormData;

const EMPTY_FORM: ContactFormData = { nombre: "", apellido: "", email: "", mensaje: "", aceptaTerminos: false };

/** Placeholder: no hay una URL real de LinkedIn de la empresa provista para esta prueba — ver README. */
const LINKEDIN_URL: string | undefined = undefined;

/** Contacto asimétrico: info a un lado, formulario como card flotante del otro, sobre un contenedor gris claro con la cruz de marca decorativa. */
export function ContactSection() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].contactSection;

  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM);
  const [errorField, setErrorField] = useState<Field | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function clearError(field: Field) {
    setErrorField((current) => (current === field ? null : current));
  }

  function validateOnBlur(field: Field) {
    const isValid = contactSchema.shape[field].safeParse(form[field]).success;
    setErrorField((current) => {
      if (!isValid) return field;
      return current === field ? null : current;
    });
  }

  function updateField(field: "nombre" | "apellido" | "email" | "mensaje", value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    clearError(field);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      // Solo se muestra el error del primer campo inválido, en el orden del formulario.
      setErrorField(result.error.issues[0].path[0] as Field);
      return;
    }

    setErrorField(null);
    setIsSubmitting(true);
    // Mock: sin backend real. En producción esto dispararía un email real o una
    // integración con un CRM — ver README.
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  }

  function handleReset() {
    setForm(EMPTY_FORM);
    setErrorField(null);
    setIsSubmitted(false);
  }

  return (
    <section id="contacto" className="bg-white px-6 py-20 sm:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-brand-grey p-8 sm:p-12">
        <EumedicalCross
          size={360}
          color="#e79f1a"
          className="pointer-events-none absolute -right-24 -top-24 rotate-[20deg] opacity-[0.08]"
        />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">{t.eyebrow}</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold text-brand-dark-blue sm:text-4xl">{t.title}</h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3 text-sm font-bold text-brand-dark-blue">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Mail size={17} strokeWidth={1.75} />
                </span>
                <a href="mailto:business@eumedical.es" className="hover:underline">
                  business@eumedical.es
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-brand-dark-blue">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Phone size={17} strokeWidth={1.75} />
                </span>
                <a href="tel:+34919227810" className="hover:underline">
                  +34 919 22 78 10
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm font-bold text-brand-dark-blue">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <MapPin size={17} strokeWidth={1.75} />
                </span>
                {t.address}
              </li>
              <li className="mt-2">
                {LINKEDIN_URL ? (
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.linkedinAriaReal}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-dark-blue text-white transition-colors hover:bg-brand-dark-blue/90"
                  >
                    <Linkedin aria-hidden="true" size={17} strokeWidth={1.75} />
                  </a>
                ) : (
                  <span
                    aria-label={t.linkedinAriaPlaceholder}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-dark-blue text-white"
                  >
                    <Linkedin aria-hidden="true" size={17} strokeWidth={1.75} />
                  </span>
                )}
              </li>
            </ul>

            {isSubmitted ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl bg-white p-10 text-center shadow-xl lg:-my-6">
                <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-medium-aqua/20">
                  <Check size={28} strokeWidth={2} className="text-emerald-700" />
                </span>
                <h3 className="font-display text-xl font-bold text-brand-dark-blue">{t.success.title}</h3>
                <p className="text-sm text-gray-500">{t.success.message}</p>
                <button type="button" onClick={handleReset} className="mt-2 text-sm font-bold text-brand-dark-blue hover:underline">
                  {t.success.resetLink}
                </button>
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-6 shadow-xl sm:p-8 lg:-my-6">
                <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label={t.form.nombre}
                      autoComplete="given-name"
                      required
                      aria-required="true"
                      value={form.nombre}
                      onChange={(event) => updateField("nombre", event.target.value)}
                      onBlur={() => validateOnBlur("nombre")}
                      error={errorField === "nombre" ? t.form.errors.nombre : undefined}
                    />
                    <Input
                      label={t.form.apellido}
                      autoComplete="family-name"
                      required
                      aria-required="true"
                      value={form.apellido}
                      onChange={(event) => updateField("apellido", event.target.value)}
                      onBlur={() => validateOnBlur("apellido")}
                      error={errorField === "apellido" ? t.form.errors.apellido : undefined}
                    />
                  </div>

                  <Input
                    label={t.form.email}
                    type="email"
                    placeholder={t.form.emailPlaceholder}
                    autoComplete="email"
                    required
                    aria-required="true"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    onBlur={() => validateOnBlur("email")}
                    error={errorField === "email" ? t.form.errors.email : undefined}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      {t.form.mensaje}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      aria-required="true"
                      aria-invalid={errorField === "mensaje"}
                      aria-describedby={errorField === "mensaje" ? "contact-message-error" : undefined}
                      value={form.mensaje}
                      onChange={(event) => updateField("mensaje", event.target.value)}
                      onBlur={() => validateOnBlur("mensaje")}
                      className={`w-full resize-none rounded-lg border px-3.5 py-2.5 text-brand-dark-blue placeholder:text-gray-400 ${
                        errorField === "mensaje" ? "border-2 border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errorField === "mensaje" && <FieldError id="contact-message-error" message={t.form.errors.mensaje} />}
                  </div>

                  <Checkbox
                    label={
                      <>
                        {t.form.privacyPrefix}
                        <Link to="/privacidad" className="font-bold text-brand-dark-blue underline">
                          {t.form.privacyLink}
                        </Link>
                        {t.form.privacySuffix}
                      </>
                    }
                    checked={form.aceptaTerminos}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, aceptaTerminos: event.target.checked }));
                      clearError("aceptaTerminos");
                    }}
                    onBlur={() => validateOnBlur("aceptaTerminos")}
                    error={errorField === "aceptaTerminos" ? t.form.errors.aceptaTerminos : undefined}
                  />

                  <Button type="submit" fullWidth isLoading={isSubmitting} className="rounded-full">
                    {t.form.submit}
                    {!isSubmitting && <ArrowRight aria-hidden="true" size={16} strokeWidth={2} className="ml-2" />}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
