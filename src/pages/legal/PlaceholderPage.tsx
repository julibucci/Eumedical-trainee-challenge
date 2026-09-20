import { Link } from "react-router-dom";
import { EumedicalLogo } from "../../components/ui/EumedicalLogo";

type PlaceholderPageProps = {
  title: string;
};

/** Placeholder route for legal texts not yet written (terms, privacy). */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
      <EumedicalLogo size={24} />
      <h1 className="font-display text-2xl font-bold text-brand-dark-blue">{title}</h1>
      <p className="max-w-sm text-gray-500">Contenido legal pendiente de redacción.</p>
      <Link to="/registro" className="font-bold text-brand-dark-blue hover:underline">
        Volver al registro
      </Link>
    </div>
  );
}
