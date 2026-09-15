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
| 7 | `type-check`/`build` corrían `tsc --noEmit` contra el `tsconfig.json` raíz, que solo tiene `references` (sin `files`/`include`) — eso hace que tsc no compile nada y **reporte 0 errores sin haber revisado un solo archivo** | Al correr `tsc -b` directamente aparecieron errores reales que venían pasando desapercibidos: variantes de `Badge`/specialidad faltantes, un array del sidebar mal tipado, y falta el `src/vite-env.d.ts` estándar de Vite (sin él, `import "./index.css"` ni siquiera tipa) | Se cambiaron ambos scripts a `tsc -b` (modo build de project references, que sí desciende a `tsconfig.app.json`/`tsconfig.node.json`) y se agregó `src/vite-env.d.ts` |

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

## Autenticación (login / registro)

`/login` y `/registro` están **completamente mockeados**, sin backend real: cualquier
combinación de datos que pase la validación del formulario simula un login/alta
exitosa y redirige a `/app` después de un pequeño delay artificial (para mostrar el
estado `isLoading` del botón). No hay persistencia real de usuarios en ningún lado.

En producción, `RegisterPage` llamaría a un endpoint real de registro (`POST
/api/auth/register` o similar) que debería, como mínimo:

- Validar de nuevo todo en el servidor (nunca confiar solo en la validación de cliente)
- Enviar un email de confirmación y no dejar entrar hasta verificarlo
- Hashear la contraseña (nunca la maneja el frontend más que para enviarla por HTTPS)
- Devolver errores específicos del servidor (email ya registrado, etc.) que hoy no
  existen porque no hay backend con el que chocar

## Área de paciente (`/app/*`)

`PatientLayout` (sidebar + header) envuelve todas las rutas `/app/*` vía rutas
anidadas de React Router (`<Outlet />`). Las 6 secciones del sidebar (Inicio,
Consultas, Historial, Documentos, Recetas, Perfil y soporte) están
implementadas por completo.

**Sesión y rutas protegidas**: `useAuthStore` (zustand) ya centralizaba
usuario/login/logout — no hizo falta un `AuthContext` nuevo, es la misma pieza
pedida con otro nombre. `ProtectedRoute` (`src/components/layout/ProtectedRoute.tsx`)
envuelve `/app` como ruta padre en `App.tsx`: sin `user` en el store, redirige a
`/login` antes de que `PatientLayout` llegue a montarse — cubre tanto entrar
directo a `/app/*` sin loguearse como volver con "atrás" del navegador después
de cerrar sesión (mismo chequeo en ambos casos). Como la sesión vive solo en
memoria (sin `localStorage` ni backend), "cerrar sesión" es simplemente
`set({ user: null })` — no hay nada persistido que limpiar.

El avatar del header (`Link` a `/app/perfil`, con `aria-label="Ir a mi perfil"`)
y el ítem "Perfil y soporte" del sidebar comparten la misma ruta, así que el
resaltado de "activo" (vía `NavLink`) ya funciona sin código extra sin importar
por cuál de los dos caminos se llegue.

**Cerrar sesión** es un botón siempre visible en el sidebar (no un dropdown
oculto detrás de la tarjeta de usuario, que resultaba poco intuitivo para
usuarios menos familiarizados con interfaces): ancho completo, fondo blanco
contrastando con el azul del sidebar, ícono + texto en rojo. Debajo queda la
tarjeta de usuario (avatar + nombre + estado), ahora puramente informativa —
ya no es interactiva ni tiene dropdown.

**Notificaciones** (`NotificationsDropdown`,
`src/components/layout/NotificationsDropdown.tsx`) es el dropdown de la
campana del header: mismo patrón de trigger + panel flotante que se usaba
para el ex-`UserMenu` (`aria-haspopup="menu"` + `aria-expanded`, cierra con
click afuera o Escape). El estado de leídas/no leídas vive en el hook
`useNotifications` (`src/hooks/useNotifications.ts`), separado de
`useAuthStore` — en memoria (`useState`), se resetea al recargar. El punto
naranja de la campana solo se muestra si `unreadCount > 0`. "Ver todas las
notificaciones" es un placeholder (toast) sin ruta real; en producción
llevaría a una vista completa de notificaciones con paginación/filtros.

**Criterio responsive del sidebar**: por debajo de `lg` (1024px) el sidebar deja
de estar fijo y pasa a un drawer off-canvas — se abre con el botón de
hamburguesa del header, se cierra tocando el fondo oscuro, presionando Escape o
navegando a otra sección. A partir de `lg` vuelve a quedar fijo a la izquierda
(250px) como en desktop.

### Inicio (`/app`)

- **"Ver receta"** (alerta de receta por vencer) navega a `/app/recetas` con
  `useNavigate` — no filtra ni resalta la receta específica, solo lleva a la
  sección.
- **"Ver más actividad reciente →"** es un placeholder (toast): la timeline
  mezcla consultas, documentos y recetas, y no hay una vista unificada de
  "toda la actividad" en el alcance de esta prueba. En producción llevaría a
  un historial paginado con esos tres tipos de evento.

### Consultas (`/app/consultas`)

"Reagendar", "Cancelar" y "+ Nueva consulta" están mockeados: solo muestran un
toast (`react-hot-toast`, montado una vez en `App.tsx`) y no cambian ningún
dato real. En producción:

- **Reagendar** abriría un flujo real de reprogramación (elegir nuevo
  horario disponible del médico, confirmar, notificar por email)
- **Cancelar** pediría confirmación explícita antes de cancelar (una acción
  destructiva no debería dispararse con un solo click) y liberaría el horario
  para otros pacientes
- **+ Nueva consulta** abriría el flujo completo de reserva (elegir
  especialidad, médico, horario disponible) — fuera del alcance de esta prueba

### Historial (`/app/historial`)

Cada fila es un acordeón (`HistoryItem`): al expandirla muestra un texto fijo
de "Resumen de la consulta". En producción ese panel vendría de datos reales
del backend (motivo de consulta, notas del médico, indicaciones) — hoy es el
mismo texto para cualquier consulta, no hay contenido real detrás.

### Documentos (`/app/documentos`)

- **"Vista previa"** es una simulación: siempre muestra el mismo ícono
  genérico + nombre/peso/formato del archivo, nunca el contenido real. En
  producción mostraría la imagen real o un iframe con el PDF.
- **Subir archivos** (drag & drop o el botón "Seleccionar archivos") sí valida
  formato (PDF/JPG/PNG) y tamaño (10 MB) del lado del cliente, pero el archivo
  nunca sale del navegador: solo se agrega a un `useState` local con los datos
  del `File` (nombre, tamaño). No hay `localStorage` ni backend — se pierde al
  recargar la página, igual que el resto de los mocks de esta app (login,
  registro, y ahora también Recetas y Perfil).

### Recetas (`/app/recetas`)

- **"Solicitar renovación"** simula el envío: el botón pasa a "Solicitud
  enviada" y queda deshabilitado (estado local en `PrescriptionCard`, se
  resetea al recargar). En producción dispararía una notificación real al
  médico emisor y probablemente un estado "pendiente de aprobación" visible
  para el paciente.
- **"Descargar"** solo muestra un toast — no hay PDF real que descargar. En
  producción bajaría el archivo real generado por el backend.
- Las 3 secciones (Vigentes / Por vencer / Vencidas) se ocultan individualmente
  si no tienen recetas, vía `groupPrescriptionsByStatus` — no se muestra un
  título con una lista vacía debajo.

### Perfil y soporte (`/app/perfil`)

- **"Editar"** en Datos personales abre un formulario real (reutiliza `Input`)
  y "Guardar cambios" sí actualiza lo que se ve en pantalla — pero solo en el
  estado de React de esa página; no hay backend que persista el cambio, así
  que se pierde al recargar. En producción sería un `PATCH` real al perfil del
  paciente.
- Los toggles de notificaciones y las opciones de "Chat en vivo"/"Email" son
  mocks (estado local / toast): no hay un canal de soporte real ni un backend
  que guarde la preferencia — en producción el toggle llamaría a un endpoint
  de preferencias y "Chat en vivo" abriría un widget real (Intercom, Zendesk, etc.)

## Landing de marketing — Parte A (`/`)

Reinterpretación propia del rebranding (no una copia del layout actual en Wix
de eumedical.es): bento grid asimétrico para las 4 capacidades, recorrido
horizontal + grid extendido para los 14 servicios reales, y la cruz de marca
(`EumedicalCross`) como recurso decorativo de fondo en Hero y Cobertura —
nunca distorsionada, solo rotada y semi-transparente, tal como indica el
Brand Book. Componentizado en `src/components/sections/`, datos en
`src/mocks/services.ts` y tipos en `src/types/service.ts`.

**Íconos compuestos, no de una sola pieza**: `src/components/icons/`
concentra los íconos ilustrativos armados combinando varias formas outline —
`CapabilityIcons.tsx` (los 4 de la bento, con `tone="light"|"dark"` según el
fondo de su tarjeta) y `ServiceIcon.tsx` (genérico, para los 14 servicios
extendidos: forma principal + insignia con un segundo ícono o con
`CrossBadge`, que reutiliza el propio `EumedicalCross` como acento en vez de
un ícono de cruz genérico de librería).

**Ajuste de contraste sobre el pedido original**: donde el brief pedía un
color de marca sólido y saturado como fondo con texto encima (tarjetas
"verde"/"amarillo" de la bento, categorías del grid extendido), se usó en
cambio el tinte suave del mismo color + texto oscuro
— el mismo criterio que ya aplican `Badge.tsx`/`PrescriptionCard` en el resto
del proyecto, porque el verde y el naranja/amarillo de marca no cumplen AA
como color de texto ni como fondo sólido con texto claro encima (ver
limitación ya señalada en "Próximos pasos" más abajo). El azul marca sólido sí
se mantuvo donde se pidió (tarjeta destacada de la bento, Cobertura,
Contacto) porque blanco sobre azul marca sí pasa AA cómodo.

**Foto del Hero** (`src/assets/images/hero-teleconsulta.webp`): imagen provista
por el cliente (teleconsulta real desde un hotel, con el logo de eumedical en
pantalla), no un banner de fondo — entra como tarjeta flotante propia al
costado del texto, con esquinas redondeadas. Para que resalte sin agregar
texto/insignias encima de la foto (se probó con una insignia superpuesta y se
sacó: tapaba parte de la imagen y competía con ella), tiene dos formas
redondeadas de color de marca (verde/naranja, semi-transparentes) apenas
rotadas detrás, a modo de "backdrop" — el mismo truco visual que ya usan las
tarjetas del bento. Se optimizó antes de sumarla al repo: el archivo original
(PNG, 1.7 MB) se redujo a WebP 1200×800 a calidad 82 (~49 KB) — sin esto el
Hero, que es lo primero que carga, hubiera sumado más peso que el resto de la
página junta.

**Selector de idioma** (`MarketingHeader`) cambia el idioma real de toda la
landing (ES/EN), no solo la bandera. `useLanguageStore` (zustand, en
`src/store/languageStore.ts`) guarda el idioma actual — separado de
`useAuthStore`, sin relación con la sesión del paciente. Todo el copy vive en
`src/i18n/content.ts`, un diccionario `{ es: {...}, en: {...} }` tipado
(`SiteContent`) con la misma forma para ambos idiomas; cada sección lee
`content[language].suSección` y los mocks con texto por id (`capabilities`,
`journeySteps`, `services`, `trustMetrics`, `testimonials`) se recortaron a
solo lo estructural (id, ícono, categoría) — el texto se busca en el
diccionario por ese mismo id. Alcance: solo la landing de marketing (`/`); el
área de paciente (`/app/*`) sigue en español fijo, no tiene selector.

**Globo interactivo de Cobertura** (`InteractiveGlobe`,
`src/components/ui/InteractiveGlobe.tsx`) reemplaza el ícono estático que
tenía antes esa sección: proyección ortográfica en SVG puro (sin canvas, sin
imágenes) con fronteras reales de países, dataset Natural Earth 110m vía
`world-atlas` + `topojson-client` (la resolución más liviana del paquete —
`countries-110m.json` pesa ~108 KB crudos, las de 50m/10m no se importan en
ningún lado). Rotación por drag (Pointer Events, mouse y touch con el mismo
código) y autorotate lento vía `requestAnimationFrame` que se frena al
arrastrar y se reanuda a los 3s de inactividad; respeta
`prefers-reduced-motion` (sin autorotate ni pulso de los marcadores, pero el
drag manual sigue andando). Los ~177 países se re-renderizan escribiendo su
atributo `d` directamente en el DOM en cada frame (no vía JSX/React) para que
la animación no dispare un re-render de React 60 veces por segundo — ver el
comentario en el archivo. `d3-geo` + `topojson-client` + el dataset pesan
~50 KB gzip, así que `CoverageBlock` los carga con `React.lazy`/`Suspense` en
un chunk aparte (`InteractiveGlobe-*.js`) en vez de sumarlos al bundle
principal.

Los marcadores (`src/mocks/globeMarkers.ts`, tipados en
`src/types/globeMarker.ts`) son mockeados: España/Portugal/Italia/Francia son
los países reales que menciona "Médicos a domicilio", el resto (Argentina,
Estados Unidos, Japón, Sudáfrica) son una muestra ilustrativa de otros
continentes para representar "80+ países" — en producción esta lista
debería salir de un dataset real de cobertura de la empresa, si existe. El
componente acepta un prop `interactive` (default `true`); pasarlo en `false`
deja el globo estático (sin drag, autorotate ni pulso) — útil para validar
la paleta de colores aislada de la animación.

**Testimonios** (`TestimonialsCarousel`, datos en `src/mocks/testimonials.ts`):
solo `testimonial-1` es el testimonio real de la empresa (atención en viajes
al exterior); `testimonial-2/3/4` son ilustrativos, en el mismo tono
(teleconsulta, coordinación con clínicas, tiempo de respuesta), para que el
carrusel tenga sentido visual con varias tarjetas — reemplazar por reseñas
reales cuando estén disponibles. Ninguno muestra nombre de usuario a
propósito (el tipo `Testimonial` ni siquiera tiene ese campo), pero sí
muestra `location` (ciudad, país) a propósito — 4 ciudades de 4 continentes
distintos, para transmitir alcance global sin identificar a nadie.
Desplazamiento automático **continuo y lento** (no saltos discretos cada
tanto): la posición vive en un `ref` y se escribe directamente en el
`transform` del track por `requestAnimationFrame`, sin pasar por React en
cada frame (mismo criterio de performance que el globo). Loop infinito con
la misma técnica de triple copia del array (sin librería externa); las
flechas/el swipe hacen un salto puntual con su propia transición y pausan el
autoplay continuo unos segundos. Se pausa con el mouse/foco encima y respeta
`prefers-reduced-motion`.

**Formulario de contacto** (`ContactSection`) valida con `zod`, un solo
tooltip de error visible a la vez (mismo patrón que `LoginPage`/
`RegisterPage`: se toma el primer campo inválido) pero además valida al
perder el foco de cada campo, no solo al enviar. Los campos obligatorios
llevan un asterisco en el label. Al enviar con todo válido no hay backend
real: se simula el envío (botón deshabilitado ~600ms) y el formulario se
reemplaza por un estado de éxito ("¡Gracias! Te vamos a contactar a la
brevedad.", con opción de "Enviar otro mensaje"). En producción esto
dispararía un email real o una integración con un CRM. El ícono de
**LinkedIn** queda sin `href` (`LINKEDIN_URL` en `ContactSection.tsx` está en
`undefined` a propósito) porque no hay una URL real de la empresa provista
para esta prueba — apenas se tenga, cambia a un `<a target="_blank"
rel="noopener noreferrer">` real, el componente ya está preparado para ese
caso. "Únete a nuestro equipo" en el footer enlaza a la sección de Contacto
como placeholder — no hay un flujo de postulación real en el alcance de
esta prueba. El horario de atención (`t.hours`) es ilustrativo, no viene de
un dato real de la empresa.

**Revisión de marca en Contacto** (a pedido explícito, siguiendo el manual):
- **Tipografías**: `Didact Gothic` (subtítulos) ya está cargada de verdad vía
  Google Fonts en `index.html`, no hay que tocar nada ahí. `Dinosaur Book`
  (titulares) no está disponible públicamente (no es una Google Font ni está
  en ningún CDN) — ya se había sustituido por `Varela Round` desde el setup
  inicial del proyecto (ver sección "Sustitución tipográfica" más abajo);
  esta revisión no cambió esa decisión, solo la confirma.
- **Cruz sin efectos**: el Brand Book pide el símbolo sin sombras ni
  degradados. Se sacó el `shadow-sm` de `CrossBadge.tsx` (afectaba a la
  cruz en las 4 capacidades de la bento y en los 14 servicios extendidos,
  todos de una sola vez al ser un componente compartido) y el `shadow-lg`
  del sello circular de `ClosingCta.tsx`. Los usos grandes de fondo
  decorativo (Hero, Cobertura, Contacto, Cierre) ya no tenían sombra —
  solo rotación y opacidad, que sí están permitidas.
- **Íconos de contacto propios**: `src/components/icons/ContactIcons.tsx`
  (`MailIcon`, `PhoneIcon`, `LocationIcon`, `ClockIcon`) reemplazan los
  íconos de Lucide que había antes — SVG a mano, formas simples con radios
  grandes (mismo criterio de construcción que `EumedicalCross`), un solo
  color vía `currentColor`, sin sombra en sus insignias.
- **Card de contacto**: los datos (email, teléfono, ubicación, horario,
  LinkedIn) ahora viven agrupados en una tarjeta blanca propia dentro del
  bloque lateral, en vez de una lista suelta sobre el fondo gris.

## Próximos pasos

- [x] Parte A: header/nav, hero, propuesta de valor, servicios, bloque de
      confianza/métricas, sección corporativa, contacto/CTA, footer (ver
      "Landing de marketing" arriba para el detalle de qué es mock)
- [x] Parte B: Inicio, Consultas, Historial, Documentos, Recetas y Perfil/soporte
      implementadas (ver "Área de paciente" arriba para el detalle de qué es mock en cada una)
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
