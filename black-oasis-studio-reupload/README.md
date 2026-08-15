# Black Oasis Studio — Sitio Web

Sitio web profesional para Black Oasis Studio, con landing page y un
asistente de IA por pasos que genera cotizaciones de sitios web y las
envía por correo.

## Requisitos

- [Node.js](https://nodejs.org) 18 o superior
- npm (viene incluido con Node.js)

## Instalación

```bash
npm install
```

## Desarrollo (con recarga en vivo)

```bash
npm run dev
```

Esto abre el sitio en `http://localhost:5173`. Cualquier cambio en los
archivos de `src/` o `index.html` se refleja al instante.

## Compilar para producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para subir a cualquier hosting
(Netlify, Vercel, GitHub Pages, tu propio hosting, etc.).

Para previsualizar esa versión compilada localmente:

```bash
npm run preview
```

## Estructura del proyecto

```
black-oasis-studio/
├─ index.html              → estructura de toda la página + el modal del asistente IA
├─ admin.html               → panel de control (protegido con contraseña)
├─ vite.config.js           → configura que el sitio compile tanto index.html como admin.html
├─ .env.local                → contraseña del panel (no se sube a git)
├─ src/
│  ├─ main.js               → toda la lógica del sitio público: menú, asistente IA, precios, envío de correo
│  ├─ admin.js               → toda la lógica del panel: login, alta/baja de sitios, publicar código
│  ├─ work-store.js          → lista de sitios del portafolio (lo que se ve en "Work")
│  ├─ utils.js               → función compartida para escapar texto de forma segura
│  ├─ style.css              → todos los estilos del sitio público
│  └─ admin.css              → todos los estilos del panel
├─ public/
│  ├─ logo/
│  │  ├─ logo-icon.png       → ícono solo (círculo + palmera), fondo transparente — usado en nav, footer y hero
│  │  └─ logo-full.png       → logo completo con texto, fondo transparente — usado como imagen para redes (og:image)
│  ├─ favicon-16.png, favicon-32.png, favicon-48.png, apple-touch-icon.png, icon-192.png, icon-512.png
│  │                         → ícono de pestaña del navegador y accesos directos, en varios tamaños
│  ├─ site.webmanifest       → metadatos para "agregar a pantalla de inicio" en móvil
│  ├─ robots.txt             → le dice a Google qué puede indexar (ya listo)
│  ├─ sitemap.xml            → mapa del sitio para Google Search Console (ya listo)
│  └─ corals-auto-ranch.png  → captura usada en la tarjeta de Coral's Auto Ranch (sección Work)
└─ package.json
```

## Envío de correos de cotización — ya está listo, sin cuentas

El asistente de IA junta el nombre del negocio, el sector, la
estética y las funciones seleccionadas, calcula el precio, y al
enviar la cotización **abre Gmail directamente** (una pestaña nueva)
con el compositor de correo **ya lleno**: destinatario
`blackoasisstudii@gmail.com`, asunto `Cotización de web` y todos los
datos del cliente en el cuerpo. El cliente solo tiene que darle clic
a "Enviar" dentro de Gmail — no requiere ninguna cuenta, API key, ni
servicio externo, así que nunca falla por configuración pendiente.

El paso de "subir imágenes de referencia" se quitó del asistente —
ahora el cliente solo describe la estética con texto, y también debe
indicar el sector de su negocio (arquitectura, inmobiliaria,
restaurantes, etc.), un campo obligatorio junto al nombre del
negocio en el paso 1.

Si por algún motivo el navegador bloquea la ventana emergente de
Gmail (poco común, ocurre con algunos bloqueadores de pop-ups), el
sitio cae automáticamente en un `mailto:` de respaldo con los mismos
datos, usando el cliente de correo que el visitante tenga configurado
en su computadora.

## Sobre el logo

Ya está integrado tu logo real (el archivo que enviaste), recortado
en dos versiones limpias con fondo transparente:

- `public/logo/logo-icon.png` — solo el círculo con la palmera, usado
  en la barra de navegación, el footer y el visual del hero.
- `public/logo/logo-full.png` — el logo completo con el texto "BLACK
  OASIS", usado como imagen de vista previa al compartir el link en
  redes sociales.

El favicon (ícono de la pestaña del navegador) también sale de ese
mismo logo, generado en varios tamaños (16, 32, 48, 180, 192 y
512px) y ya conectado en `index.html`.

Si en algún momento cambias de logo, solo tienes que reemplazar esos
dos PNG en `public/logo/` (y regenerar los favicons a partir del
nuevo ícono) — no hace falta tocar el resto del código.

## SEO básico — carpetas listas

Ya dejé preparado lo necesario para cuando quieras activar Google
Search Console o una ficha de Google Business:

- `public/robots.txt` y `public/sitemap.xml` — lo mínimo que Google
  pide para rastrear el sitio, ya generados.
- En el `<head>` de `index.html` dejé un comentario donde va tu meta
  tag de verificación en cuanto la generes desde Search Console:
  ```html
  <!-- <meta name="google-site-verification" content="TU_CODIGO_AQUI"> -->
  ```
- Ya están los meta tags Open Graph / Twitter Card (para que el link
  se vea bien al compartirlo) y datos estructurados (Schema.org) para
  que Google entienda que es un negocio de diseño web.

**Importante:** todos esos archivos usan `blackoasisstudio.com` como
dominio de ejemplo, porque el proyecto aún no tiene un dominio real
conectado. En cuanto compres/definas el dominio, avísame para
reemplazar ese texto en `index.html`, `robots.txt` y `sitemap.xml`
por el dominio real — si no, Search Console y las redes sociales no
van a poder verificar el sitio correctamente.

## Panel de control (admin)

Se accede en `/admin.html` (por ejemplo `https://tudominio.com/admin.html`
o `http://localhost:5173/admin.html` en desarrollo). No hay ningún
enlace visible hacia él desde el sitio público — solo tú conoces la
dirección.

La contraseña vive en `.env.local` (variable `VITE_ADMIN_PASSWORD`),
un archivo que **no se sube a git** (ya está en `.gitignore`), así
que no queda visible en tu repositorio de código. Ahora mismo está
puesta como `123a_A54` — puedes cambiarla editando ese archivo.

**Aviso importante sobre la seguridad de este panel:** este sitio es
100% estático (sin servidor propio ni base de datos), así que la
verificación de la contraseña ocurre en el navegador del visitante.
Eso alcanza para que no aparezca en tu código fuente y para que un
visitante normal no la encuentre por accidente — pero no es lo mismo
que una protección real de servidor: alguien con suficiente
conocimiento técnico podría encontrar la contraseña dentro del
archivo JavaScript ya compilado, usando las herramientas de
desarrollador del navegador. No reutilices esta contraseña en nada
más sensible (correo, banco, etc.). Si en algún momento quieres
protección robusta de verdad, eso ya requiere un mini-backend (por
ejemplo una función serverless de Netlify o Vercel) — avísame si
llegas a necesitarlo.

**Cómo funciona subir sitios al portafolio:** desde el panel puedes
añadir un sitio (nombre, categoría, link e imagen) y se guarda en
este navegador para que lo seas capaz de previsualizar de inmediato
en la sección "Work" — pero, como no hay base de datos, esa vista
previa solo existe en tu navegador, no la ven tus visitantes
todavía. Para publicarlo de verdad, el panel tiene un botón
**"Copiar código para publicar"**: copia el código actualizado que
tienes que pegar en `src/work-store.js` (reemplazando
`DEFAULT_WORK_ITEMS`), y luego volver a compilar (`npm run build`) y
subir el sitio a tu hosting. Así el "Coral's Auto Ranch" que ya
tienes seguirá ahí, y cada sitio nuevo que subas desde el panel se
añade de la misma forma.

## Sección "Work" (portafolio)

Por ahora es una sola tarjeta: **Coral's Auto Ranch**
(coralsautoranch.com), usando la captura `public/corals-auto-ranch.png`.
Es un enlace real — al hacer clic abre esa web en una pestaña nueva.
Ahora la lista sale de `src/work-store.js` (antes estaba escrita
directo en el HTML), así que puedes editar ese archivo a mano o usar
el panel de administración (ver sección de arriba) para añadir
sitios nuevos.

## Otras integraciones recomendadas

Para cuando quieras activar las funciones que vendes como extras en
el sitio del cliente:

- **Panel de control / subir imágenes:** Cloudinary o Supabase Storage.
- **Pagos directos:** Stripe Checkout.
- **Asistente de IA dentro del sitio del cliente:** API de Claude (Anthropic).
