# INOXPAZ SpA — Sitio Web Corporativo

Plataforma web de ingeniería y montajes industriales para **INOXPAZ SpA** (`inoxpaz.cl`).

![INOXPAZ SpA](assets/logo.webp)

## 🛠️ Tecnologías & Estructura
* **Arquitectura**: Jamstack estático de máximo rendimiento para Cloudflare Pages.
* **Diseño**: *Dark Industrial Precision* con Tailwind CSS, tipografías *Syne*, *Inter* y *JetBrains Mono*.
* **Efectos & Interactividad**:
  * Canvas dinámico de simulación de chispas y arco de soldadura TIG/MIG.
  * Catálogo filtrable de servicios técnicos especializados.
  * Galería técnica de proyectos reales (Plantas Piloto Hárting Coil, Naturalis, spools sanitarios y conexionado de bombas).
  * Cotizador técnico interactivo (RFQ) con autogenerador de solicitudes a WhatsApp y correo.
  * Matriz comparativa de soldadura certificada (ASME Sección IX / AWS D1.1).
* **SEO & Optimización**:
  * Metadatos completos OpenGraph, Twitter Cards y Schema.org JSON-LD (`ProfessionalService` / `Organization`).
  * `sitemap.xml` y `robots.txt` orientados a búsqueda industrial en Chile (`.cl`).
  * `_headers` con directivas de seguridad (CSP, X-Frame-Options) y caché CDN para Cloudflare Pages.

## 🚀 Despliegue en Cloudflare Pages
1. Conectar este repositorio de GitHub con **Cloudflare Pages**.
2. **Build Settings**:
   * Framework preset: `None`
   * Build command: *(vacío)*
   * Output directory: `/`
3. En la pestaña **Custom Domains**, vincular `inoxpaz.cl` y `www.inoxpaz.cl`.

## 📞 Contacto Técnico
* **Liderazgo Técnico**: Alexis Paz
* **Correo**: alexis.paz@inoxpaz.cl
* **Teléfono**: +56 9 5420 2466
