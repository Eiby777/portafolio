# Portafolio — Abisay Medina

Portafolio oficial de diseño y desarrollo web de **Abisay Medina**. Reúne 22 sitios
construidos para negocios reales de Santo Domingo, República Dominicana, organizados
por sector y navegables desde una sola página.

## Ver el proyecto

El sitio es estático y no necesita build. Para abrirlo en local:

```bash
python3 -m http.server 8000
```

Luego visita <http://localhost:8000>.

## Estructura

```text
.
├── index.html              # Portafolio: hero, proyectos, servicios, sobre mí y contacto
├── 404.html                # Página de error
├── assets/
│   ├── css/portfolio.css   # Sistema visual completo
│   ├── js/portfolio.js     # Filtros, búsqueda, vista lista y vista rápida
│   ├── fonts/              # Tipografías self-hosted (Bricolage, Instrument Serif, Inter)
│   ├── shots/              # Capturas de escritorio de cada proyecto
│   ├── shots/mobile/       # Capturas móviles para la vista rápida
│   ├── cv/                 # CV en PDF
│   ├── favicon.svg
│   └── og-image.jpg
└── sites/                  # Los 22 sitios navegables
    ├── abogados/
    ├── aires-acondicionados/
    ├── barberias/
    └── ...
```

## Funcionalidad

- Filtros por sector, búsqueda instantánea y contador de resultados.
- Vista de cuadrícula y vista de lista.
- Vista rápida en un diálogo con captura de escritorio y móvil.
- Navegación entre proyectos con las flechas del teclado dentro de la vista rápida.
- Diseño responsive, animaciones de aparición y soporte para `prefers-reduced-motion`.
- Enlaces directos a cada sitio de prueba, abiertos en una pestaña nueva.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo y sube este proyecto.
2. En **Settings → Pages**, selecciona **Deploy from a branch**.
3. Elige la rama `main` y la carpeta `/ (root)`.
4. GitHub publicará el portafolio y los sitios de `sites/` bajo la misma URL.

No hay rutas absolutas ni dependencias de servidor: funciona igual en GitHub Pages,
Netlify, Vercel o cualquier hosting estático.

## Añadir un proyecto

1. Copia la carpeta del sitio dentro de `sites/<slug>/`.
2. Añade una captura en `assets/shots/<slug>.webp` (recomendado: 1200 × 750).
3. Añade su versión móvil en `assets/shots/mobile/<slug>.webp` (390 × 844).
4. Duplica un bloque `<article class="project-card">` en `index.html` y actualiza
   `data-slug`, `data-category`, el nombre, la descripción y las etiquetas.
5. Añade el filtro correspondiente si es un sector nuevo.

## Nota

Los sitios de `sites/` son demos de diseño y desarrollo. Las marcas, nombres,
fotografías y datos de contacto pertenecen a sus respectivos negocios.
