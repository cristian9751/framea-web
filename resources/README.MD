# Framea Web — Recursos (landing Enterprise)

Carpeta `resources/` del proyecto **framea-web** (Laravel + Inertia + React).
Contiene la landing pública del servidor **Enterprise (SCP: Secret Laboratory)**:
hero con vídeo, sección «¿Por qué Enterprise?», packs de donador, carrusel
de SCPs y pie de página.

## Estructura

- `js/Pages/` — páginas Inertia (`Home`, `About`, `Rules`, `Dashboard`,
  `AdminDashboard`, `Login`, `ProductTable`).
- `js/Components/Enterprise/` — piezas propias de la landing (`TopHeader`,
  `HeroVideoBackground`, `HorizontalCarousel`, `MobileFloatingControls`).
- `js/Components/ui/` — primitivas shadcn/ui · `js/Components/animate-ui/` —
  primitivas de animación.
- `js/assets/` — imágenes (`scp/`, `bg/`), SVG y vídeo del hero.
- `js/{app.jsx,lib/hooks/constants}` — entrada Vite, utilidades, hooks y
  permisos · `css/app.css` — estilos globales · `views/app.blade.php` —
  plantilla raíz.

## Resumen de esta sesión (rama `rework-ui`)

- **Hero**: efecto de escritura de la IP con cursor que se oculta al terminar.
- **Sección «Por qué»**: las tarjetas son ventanas sobre **una sola imagen
  compartida** con ajuste `cover` (sin deformar) y medido por `ResizeObserver`.
- **Packs de donador**: tarjeta popular con **borde e insignia magenta
  neón** (`#ff3ed8` con resplandor); en el resto, todos los textos en
  **gris claro**.
- **Pie**: hovers unificados al **morado corporativo**
  (`enterprise-primary`), igual que la cabecera.
- **Limpieza**: eliminados componentes y recursos sin uso (`Classes`,
  `DonnorPack`, `Hero`, `Features` y un SVG de prueba).

Build verificado con `npx vite build`.
