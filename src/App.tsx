import { Logo } from "./components/Logo";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between border-b border-brand-grey px-6 py-4">
        <Logo />
        <nav aria-label="Navegación principal" className="hidden gap-6 text-sm font-heading md:flex">
          <a href="#servicios" className="hover:text-brand-medium-aqua">
            Servicios
          </a>
          <a href="#nosotros" className="hover:text-brand-medium-aqua">
            Nosotros
          </a>
          <a href="#contacto" className="hover:text-brand-medium-aqua">
            Contacto
          </a>
        </nav>
      </header>

      <main>
        <section className="bg-brand-pale-sage px-6 py-20 text-center">
          <h1 className="mx-auto max-w-2xl text-4xl md:text-5xl">
            Asistencia sanitaria digital, cerca de ti
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-heading text-lg text-brand-dark-blue/80">
            Proyecto en construcción — scaffold inicial de React + TypeScript + Tailwind
            con los tokens del Brand Book de Eumedical.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
