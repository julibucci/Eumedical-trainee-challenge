# Eumedical — Frontend & UX Trainee Challenge

Rebranding de la web de Eumedical (**Parte A**, landing de marketing) y prototipo
UX de un área de paciente (**Parte B**). Todo funciona con datos mockeados: no hay
backend.

## Cómo ejecutar el proyecto

Requiere Node **20.19+** (probado con Node 22.12 / npm 10.9).

```bash
git clone https://github.com/julibucci/Eumedical-trainee-challenge.git
cd Eumedical-trainee-challenge
npm install
npm run dev          # http://localhost:5173
```

Otros comandos:

```bash
npm run build        # type-check + build de producción
npm run test         # Vitest (46 tests en 11 archivos)
npm run type-check   # tsc -b
npm run lint         # eslint
```

**Rutas**

| Ruta | Qué es |
|------|--------|
| `/` | Landing de marketing (selector ES/EN) |
| `/login`, `/registro` | Autenticación mockeada |
| `/app` | Inicio del paciente (requiere sesión) |
| `/app/calendario`, `/consultas`, `/historial`, `/documentos`, `/recetas`, `/perfil` | Secciones del área de paciente |

Para entrar a `/app` basta con completar `/login` con cualquier dato que pase la
validación del formulario.

## Decisiones principales

- **Sin backend real, todo mockeado.** El enunciado lo permite, así que los datos
  viven en `src/mocks/` y las acciones (reagendar, cancelar, descargar, subir
  documentos, enviar el formulario de contacto) simulan la respuesta con un toast
  o estado local. Lo que no se persiste se pierde al recargar. En el código y en
  la UI queda claro qué es simulado.
- **Sesión con Zustand + `ProtectedRoute`.** `useAuthStore` guarda el usuario en
  memoria; `ProtectedRoute` envuelve `/app/*` y redirige a `/login` si no hay
  sesión (incluido el botón "atrás" tras cerrar sesión).
- **Marca según el Brand Book.** Se respetó la cruz sin sombras ni degradados
  (solo rotación y opacidad) y se armaron íconos propios en SVG. Donde el color de
  marca no cumple contraste AA (verde y naranja con texto encima) se usó su tinte
  suave con texto oscuro.
- **Tipografía sustituida.** "Dinosaur Book" no está disponible públicamente, así
  que se usa **Varela Round** (la más cercana en forma). Didact Gothic se usa tal
  cual y el cuerpo usa la pila de sistema, como indica el manual.
- **Performance.** La imagen del Hero se optimizó de 1.7 MB (PNG) a ~49 KB (WebP).
  El globo interactivo de Cobertura (SVG + `d3-geo`) se carga con `React.lazy` en un
  chunk aparte, y las animaciones (globo y carrusel) escriben en el DOM por
  `requestAnimationFrame` en vez de re-renderizar React 60 veces por segundo.
  Ambas respetan `prefers-reduced-motion`.
- **i18n propio y liviano.** Un diccionario tipado `{ es, en }` en
  `src/i18n/content.ts` en lugar de una librería. Solo cubre la landing; el área
  de paciente está en español.
- **Tests.** Vitest + Testing Library sobre los flujos principales (login,
  registro, ruta protegida, Inicio, Recetas, Calendario, store y utilidades) y un
  workflow de GitHub Actions que los corre en cada Pull Request.

## Problemas encontrados

- **`npm install` fallaba por versiones incompatibles**: `react@19` junto a
  `react-dom@18` daba `ERESOLVE`.
- **Una dependencia privada inexistente**: `@eumedical/shared` devuelve `404` en
  el registro público, así que no se puede instalar.
- **`tsc --noEmit` no revisaba nada.** El `tsconfig.json` raíz solo tiene
  `references`, por lo que `type-check` y `build` reportaban 0 errores sin compilar
  un solo archivo. Al pasar a `tsc -b` aparecieron errores reales que estaban
  ocultos (variantes de `Badge` faltantes, un array del sidebar mal tipado y falta
  de `src/vite-env.d.ts`), y se corrigieron.
- **`build:dev` no funcionaba en Windows** por usar `NODE_OPTIONS=...` con sintaxis
  de shell POSIX.
- **`build` usa `--minify terser`** pero `terser` no estaba instalado.
- **Falta `@testing-library/dom`**: es peer dependency obligatoria de
  `@testing-library/react@16` y no estaba declarada, así que los tests no podían
  importar Testing Library.
- **`engines.node >=24`** era más estricto de lo necesario: en Node 22 LTS
  `npm install` mostraba un warning `EBADENGINE` (y falla con `engine-strict`),
  aunque Vite 7 solo pide `^20.19 || >=22.12`.
- **Error interno de npm 10** (`Cannot read properties of null (reading
  'edgesOut')`) al resolver los peers de `vitest@4`. No es un error del
  `package.json`: se resolvió con un `.npmrc` (`legacy-peer-deps=true`) incluido en
  el repo, así que `npm install` funciona sin flags.
- **`test:e2e` está roto**: el script apunta a `playwright.e2e.config.ts`, que
  no existe en el repo. Playwright está instalado pero no configurado.
- **`npm run lint` falla si existe la carpeta `coverage/`** (se genera con
  `test:coverage` y git la ignora): `eslint.config.js` solo ignora `dist` y avisa
  de 3 warnings en los `.js` generados. En un clon limpio no ocurre.

## Cambios en el `package.json`

El original se conserva como referencia en `package-trainee-challenge.json`.

**Scripts y `engines`**

| Cambio | Motivo |
|--------|--------|
| `type-check` y `build`: `tsc --noEmit` → `tsc -b` | Ver problema anterior: `--noEmit` no compilaba nada |
| `build:dev`: se antepuso `cross-env` | Funciona en Windows, macOS y Linux |
| `engines.node`: `>=24.0.0` → `>=20.19.0` | Es lo que realmente exige Vite 7 |

**Dependencias corregidas**

- `react-dom`: `^18.3.1` → `^19.2.4` (alineado con `react`).
- Se eliminó `@eumedical/shared` (paquete privado, `404`).

**Dependencias retiradas** por no hacer falta sin backend real: Supabase
(`@supabase/supabase-js`, `@supabase/storage-js`, `supabase`), Twilio
(`@twilio/conversations`, `@twilio/video-processors`, `@twilio/voice-sdk`,
`twilio-video`), `react-google-recaptcha`, `react-avatar-editor`, `qrcode`,
`papaparse`, `jspdf`, `react-ga4`, `react-is` y los `@types` asociados.

**Dependencias agregadas**

- `d3-geo`, `topojson-client`, `world-atlas` (+ `@types/d3-geo`,
  `@types/topojson-client`) para el globo interactivo.
- `terser` (lo requiere `build`), `cross-env`, y `@testing-library/dom` (peer
  dependency de `@testing-library/react`).

**Archivos nuevos:** `.npmrc` (`legacy-peer-deps=true`) y `src/vite-env.d.ts`.

## Mejoras con más tiempo

- **Backend real o MSW.** MSW ya está en `devDependencies` pero no se usa: los
  mocks son módulos TypeScript. Interceptar las llamadas con MSW dejaría el
  frontend listo para cambiar a una API real sin tocar los componentes.
- **Persistencia y flujos completos.** Hoy reagendar, cancelar, reservar, subir
  documentos y editar el perfil solo simulan. Faltan la confirmación antes de
  cancelar, la reserva completa y descargas reales de recetas y documentos.
- **Tests e2e con Playwright**: configurar `playwright.e2e.config.ts` (o quitar el
  script) y cubrir los flujos críticos. Ampliar los tests unitarios a Consultas,
  Documentos y Perfil, que hoy no tienen.
- **Accesibilidad**: auditoría completa (contraste, foco, lectores de pantalla) y
  medir con Lighthouse.
- **Área de paciente en inglés**: hoy solo la landing tiene selector de idioma.
- **Assets de marca reales**: reemplazar el logotipo reconstruido a mano por los
  SVG oficiales y usar la tipografía Dinosaur Book si se consigue la licencia.
- **Contenido real**: los testimonios 2–4, los marcadores del globo (salvo los
  países de "Médicos a domicilio"), el horario de atención y la URL de LinkedIn
  son ilustrativos o están pendientes.
- **Limpieza**: ignorar `coverage/` en ESLint, y usar `knip` y `type-coverage` en
  CI (`quality-check`) como ya prevén los scripts.
