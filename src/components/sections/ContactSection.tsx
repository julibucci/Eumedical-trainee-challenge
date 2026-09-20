import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Linkedin } from "lucide-react";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { FieldError } from "../ui/FieldError";
import { Input } from "../ui/Input";
import { EumedicalCross } from "../ui/EumedicalCross";
import { ClockIcon, LocationIcon, MailIcon, PhoneIcon } from "../icons/ContactIcons";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";
import type { ContactFormData } from "../../types/contact";

const contactSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().min(1).email(),
  message: z.string().min(1),
  acceptTerms: z.literal(true),
});

type Field = keyof ContactFormData;

const EMPTY_FORM: ContactFormData = { name: "", lastName: "", email: "", message: "", acceptTerms: false };

const LINKEDIN_URL = "https://www.linkedin.com/company/eumedical/?originalSubdomain=es";

/** Asymmetric contact: info on one side, form as a floating card on the other, over a light gray container with the decorative brand cross. */
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

  function updateField(field: "name" | "lastName" | "email" | "message", value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    clearError(field);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      // Only the error of the first invalid field is shown, in form order.
      setErrorField(result.error.issues[0].path[0] as Field);
      return;
    }

    setErrorField(null);
    setIsSubmitting(true);
    // Mock: no real backend. In production this would trigger a real email or a
    // CRM integration — see README.
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
    <section id="contacto" className="scroll-mt-24 bg-white px-6 py-20 sm:py-24">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-brand-grey p-8 sm:p-12">
        <EumedicalCross
          size={360}
          color="#e79f1a"
          className="pointer-events-none absolute -right-24 -top-24 rotate-[20deg] opacity-[0.08]"
        />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">{t.eyebrow}</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold text-brand-dark-blue sm:text-4xl">{t.title}</h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h3 className="font-display text-lg font-bold text-brand-dark-blue">{t.cardTitle}</h3>

              <ul className="mt-5 flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pale-sage text-brand-dark-blue">
                    <MailIcon size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{t.emailLabel}</p>
                    <a href="mailto:business@eumedical.es" className="font-bold text-brand-dark-blue hover:underline">
                      business@eumedical.es
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pale-sage text-brand-dark-blue">
                    <PhoneIcon size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{t.phoneLabel}</p>
                    <a href="tel:+34919227810" className="font-bold text-brand-dark-blue hover:underline">
                      +34 919 22 78 10
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pale-sage text-brand-dark-blue">
                    <LocationIcon size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{t.addressLabel}</p>
                    <p className="font-bold text-brand-dark-blue">{t.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pale-sage text-brand-dark-blue">
                    <ClockIcon size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{t.hoursLabel}</p>
                    <p className="font-bold text-brand-dark-blue">{t.hours}</p>
                  </div>
                </li>
              </ul>

              <div className="mt-5 border-t border-gray-100 pt-5">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.linkedinAriaReal}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-dark-blue text-white transition-colors hover:bg-brand-dark-blue/90"
                >
                  <Linkedin aria-hidden="true" size={17} strokeWidth={1.75} />
                </a>
              </div>
            </div>

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
                      label={t.form.name}
                      autoComplete="given-name"
                      required
                      aria-required="true"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      onBlur={() => validateOnBlur("name")}
                      error={errorField === "name" ? t.form.errors.name : undefined}
                    />
                    <Input
                      label={t.form.lastName}
                      autoComplete="family-name"
                      required
                      aria-required="true"
                      value={form.lastName}
                      onChange={(event) => updateField("lastName", event.target.value)}
                      onBlur={() => validateOnBlur("lastName")}
                      error={errorField === "lastName" ? t.form.errors.lastName : undefined}
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
                      {t.form.message}
                      <span className="text-red-500" aria-hidden="true">
                        {" "}
                        *
                      </span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      aria-required="true"
                      aria-invalid={errorField === "message"}
                      aria-describedby={errorField === "message" ? "contact-message-error" : undefined}
                      placeholder={t.form.messagePlaceholder}
                      value={form.message}
                      onChange={(event) => updateField("message", event.target.value)}
                      onBlur={() => validateOnBlur("message")}
                      className={`w-full resize-none rounded-lg border px-3.5 py-2.5 text-brand-dark-blue placeholder:text-gray-400 ${
                        errorField === "message" ? "border-2 border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errorField === "message" && <FieldError id="contact-message-error" message={t.form.errors.message} />}
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
                    checked={form.acceptTerms}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, acceptTerms: event.target.checked }));
                      clearError("acceptTerms");
                    }}
                    onBlur={() => validateOnBlur("acceptTerms")}
                    error={errorField === "acceptTerms" ? t.form.errors.acceptTerms : undefined}
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
