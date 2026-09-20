import { useCountUp } from "../../hooks/useCountUp";
import { useInView } from "../../hooks/useInView";
import { trustMetrics } from "../../mocks/services";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";
import type { Metric } from "../../types/service";

/** Splits "90k" into { target: 90, suffix: "k" } — only the numeric part is animated. */
function parseMetricValue(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  return { target: match ? Number(match[1]) : 0, suffix: match ? match[2] : "" };
}

function MetricItem({ metric, label, startWhen }: { metric: Metric; label: string; startWhen: boolean }) {
  const { target, suffix } = parseMetricValue(metric.value);
  const animatedValue = useCountUp(target, { startWhen });

  return (
    <div className="text-center">
      <p className="font-display text-5xl font-bold text-brand-dark-blue sm:text-6xl">
        <span className="text-brand-orange">+</span>
        {animatedValue}
        {suffix}
      </p>
      <p className="mt-2 text-base text-gray-500">{label}</p>
    </div>
  );
}

/** Grid of the company's real metrics: the numbers count up from 0 to the final value on entering the viewport. */
export function TrustMetrics() {
  const { ref, isInView } = useInView<HTMLDivElement>(0.35);
  const language = useLanguageStore((state) => state.language);
  const t = content[language].trustMetrics;

  return (
    <section className="bg-white px-6 pb-8 pt-20 sm:pb-10 sm:pt-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-center font-display text-4xl font-bold text-brand-dark-blue sm:text-5xl">{t.title}</h2>

        <div ref={ref} className="mt-10 rounded-3xl bg-brand-grey p-10 sm:p-14">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {trustMetrics.map((metric) => (
              <MetricItem key={metric.id} metric={metric} label={t.metrics[metric.id]} startWhen={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
