import { useCountUp } from "../../hooks/useCountUp";
import { useInView } from "../../hooks/useInView";
import { trustMetrics } from "../../mocks/services";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";
import type { Metric } from "../../types/service";

/** Separa "90k" en { target: 90, suffix: "k" } — solo se anima la parte numérica. */
function parseMetricValue(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  return { target: match ? Number(match[1]) : 0, suffix: match ? match[2] : "" };
}

function MetricItem({ metric, label, startWhen }: { metric: Metric; label: string; startWhen: boolean }) {
  const { target, suffix } = parseMetricValue(metric.value);
  const animatedValue = useCountUp(target, { startWhen });

  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold text-brand-dark-blue sm:text-4xl">
        <span className="text-brand-orange">+</span>
        {animatedValue}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

/** Grid de métricas reales de la empresa: los números cuentan de 0 al valor final al entrar en el viewport. */
export function TrustMetrics() {
  const { ref, isInView } = useInView<HTMLDivElement>(0.35);
  const language = useLanguageStore((state) => state.language);
  const t = content[language].trustMetrics;

  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-bold text-brand-dark-blue sm:text-4xl">{t.title}</h2>

        <div ref={ref} className="mt-10 rounded-3xl bg-brand-grey p-8 sm:p-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {trustMetrics.map((metric) => (
              <MetricItem key={metric.id} metric={metric} label={t.metrics[metric.id]} startWhen={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
