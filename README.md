# Eumedical — Frontend & UX Trainee Challenge

Rebranding de la web de Eumedical + diseño UX de una sección de paciente.

## Estado actual

Este commit contiene el **setup inicial** del proyecto: stack corregido y funcionando
(dev server, lint, type-check y build en verde), tokens de marca cargados desde el
Brand Book, y un layout mínimo de prueba. La construcción de las secciones de la
Parte A (rebranding) y la Parte B (UX de paciente) es el siguiente paso.

## Cómo ejecutar el proyecto

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de producción
npm run lint        # eslint
npm run type-check  # tsc --noEmit
npm run test        # vitest
```

Requiere Node **20.19+** (probado con Node 22.12 / npm 10.9).

> El repo incluye un `.npmrc` con `legacy-peer-deps=true` (ver sección de
> debugging más abajo) — con él, `npm install` funciona sin flags adicionales.

## Debugging del `package.json` de partida

El enunciado avisaba de que el `package.json` de partida podía contener
inconsistencias deliberadas. Diagnóstico basado en errores reales de `npm
install` / `tsc` / `vite build`, no en suposiciones:

| # | Problema | Evidencia | Cambio realizado |
|---|----------|-----------|-------------------|
| 1 | `react@^19.2.4` junto a `react-dom@^18.3.1` — versiones mayores incompatibles | `npm install` fallaba con `ERESOLVE` (peer `react-dom` exige `react@^18.3.1`, pero el proyecto pedía React 19) | Se alineó `react-dom` a `^19.2.4` (y sus `@types`, que ya estaban en v19) |
| 2 | `@eumedical/shared@^0.24.0` — paquete privado inexistente en el registro público | `npm view @eumedical/shared` → `404 Not Found` | Se eliminó la dependencia. Es un paquete interno al que un candidato no tiene acceso; cualquier utilidad que aportara (tokens compartidos, helpers) se resuelve localmente en este repo |
| 3 | Script `build` usa `--minify terser` pero `terser` no estaba en `devDependencies` | Vite requiere `terser` instalado explícitamente para ese modo desde la v3 | Se añadió `terser` a `devDependencies` |
| 4 | `build:dev` fija `NODE_OPTIONS=...` con sintaxis de shell POSIX | Rompe en `cmd.exe`/PowerShell (Windows) | Se añadió `cross-env` y se antepuso al script para que sea multiplataforma |
| 5 | `engines.node: ">=24.0.0"` bloqueaba el entorno de desarrollo real (Node 22 LTS) sin necesidad | Vite 7 solo requiere Node `^20.19 \|\| >=22.12`; no hay ninguna API del proyecto que exija Node 24 | Se relajó a `>=20.19.0` |
| 6 | `npm install` (sin flags) falla con un error interno de npm (`Cannot read properties of null (reading 'edgesOut')`) al resolver el árbol de peers de `vitest@4` | Bug conocido de npm 10.x/Arborist con grafos de peers opcionales complejos (no es un error del `package.json`) | Se añadió `.npmrc` con `legacy-peer-deps=true` para que la instalación sea reproducible para cualquiera que clone el repo |

### Decisión de alcance: se retiró stack de backend/integraciones reales

El `package.json` de partida (`package-trainee-challenge.json`, conservado en la
raíz como referencia) está pensado para una plataforma de telemedicina completa:
SDKs de video/voz de Twilio, Supabase (auth + storage), reCAPTCHA, editor de
avatar, generación de QR, parseo de CSV y export a PDF. El enunciado es explícito:
**no hace falta backend real, se permiten mocks**, y el objetivo de esta prueba es
un sitio de marketing + un prototipo de UX de paciente, no una app de
teleconsulta funcional.

Mantener esas dependencias habría añadido superficie de instalación, peso de
bundle y complejidad de configuración (credenciales de Supabase, tokens de
Twilio) sin ningún beneficio para lo que se evalúa. Se retiraron:

- `@supabase/supabase-js`, `@supabase/storage-js`, `supabase` (CLI)
- `@twilio/conversations`, `@twilio/video-processors`, `@twilio/voice-sdk`, `twilio-video`
- `react-google-recaptcha` (+ `@types`)
- `react-avatar-editor`, `qrcode`, `papaparse` (+ `@types`), `jspdf`
- `react-is`, `react-ga4` (no usados por ninguna dependencia ni requisito del enunciado)

Se conservó el resto del stack (React Router, TanStack Query, Zustand, Zod,
Tailwind, Headless UI, date-fns, Recharts, react-hot-toast, react-dropzone,
react-datepicker, react-phone-number-input, dompurify) porque encaja con los
requisitos de ambas partes (navegación, formularios, gráficos de métricas,
subida de documentos mockeada, estados de carga/error) y con MSW (ya incluido en
devDependencies) para mockear llamadas a API de forma realista.

### Sustitución tipográfica

El Brand Book especifica **"Dinosaur Book"** como tipografía principal de
titulares. No es una fuente de distribución pública (no está en Google Fonts ni
en ningún CDN habitual), así que se sustituyó por **Varela Round**, la fuente
gratuita más cercana en forma (terminales redondeadas, geometría similar a la
del propio logotipo). La secundaria, **Didact Gothic**, sí es una Google Font
real y se usa tal cual. El cuerpo de texto usa la pila de sistema `Arial,
Helvetica, sans-serif` como indica el manual, evitando cargar una fuente extra
para párrafos largos (mejor rendimiento).

## Próximos pasos

- [ ] Parte A: header/nav, hero, propuesta de valor, servicios, bloque de
      confianza/métricas, sección corporativa, contacto/CTA, footer
- [ ] Parte B: dashboard de paciente, próximas consultas/teleconsulta,
      historial, documentos/informes, recetas, perfil/soporte
- [ ] Mocks de datos (MSW) para las llamadas a API
- [ ] Tests básicos con Vitest + Testing Library
- [ ] Revisión de accesibilidad (contraste — el naranja/amarillo de marca no
      cumple AA sobre fondo blanco para texto, solo para acentos y fondos con
      texto oscuro encima)

## Mejoras con más tiempo

- Tests e2e con Playwright (ya configurado en `devDependencies`) para los
  flujos críticos: reserva de cita, acceso a teleconsulta, descarga de informe
- Auditoría de performance (Lighthouse) y `type-coverage` real por encima del
  95% que exige el script `quality-check`
- Sustituir la reconstrucción manual del logotipo (texto + símbolo "+") por los
  assets vectoriales reales del Brand Book en cuanto estén disponibles en SVG
