# Portafolio de Abisay Medina

**Diseño y desarrollo de páginas web para negocios de Santo Domingo, República Dominicana.**

Este es mi portafolio: una sola página donde se pueden ver, abrir y explorar **22 sitios
web completos** que he diseñado y programado para negocios reales. Cada proyecto se
puede visitar como si fuera el sitio de verdad, tanto en computadora como en teléfono.

## 👉 Ver el portafolio

### **[eiby777.github.io/portafolio](https://eiby777.github.io/portafolio/)**

No hay que instalar nada ni crear una cuenta. Solo abre el enlace en cualquier
navegador (Chrome, Safari, Edge…) y listo.

## ¿Qué vas a encontrar?

El portafolio está dividido en cuatro partes, en este orden:

1. **Proyectos** — los 22 sitios, con una foto de cada uno. Puedes filtrarlos por
   tipo de negocio, buscarlos por nombre y abrirlos en una pestaña nueva.
2. **Cómo trabajo** — los cuatro pasos que sigo, desde la idea inicial hasta la
   publicación: estrategia, diseño, programación y lanzamiento.
3. **Sobre mí** — quién soy, qué herramientas uso y mi experiencia.
4. **Contacto** — correo, WhatsApp y teléfono para pedir una propuesta.

## Los 22 proyectos, por sector

| Sector | Negocios incluidos |
|---|---|
| **Salud** (5) | Clínica dental, dermatología, fisioterapia, psicología y veterinaria |
| **Servicios** (6) | Aire acondicionado, electricidad, fumigación, funeraria, mudanzas y plomería |
| **Automotriz** (4) | Cerrajería, taller mecánico, auto detailing y gomeras |
| **Estilo** (4) | Barbería, salón de belleza, gimnasio y estudio de fotografía |
| **Profesional** (2) | Abogados y contabilidad |
| **Comercio** (1) | Tienda de tecnología |

## ¿Qué puedo hacer por tu negocio?

- **Diseño a medida:** cada negocio tiene su propio estilo; nada de plantillas repetidas.
- **Sitios rápidos y que se ven bien en el teléfono:** la mayoría de tus clientes te
  va a buscar desde el celular.
- **Un camino claro al contacto:** botones de WhatsApp, formularios y llamadas a la
  acción para que la gente te escriba sin complicarse.
- **Preparado para Google:** textos, títulos y datos pensados para que te encuentren
  en las búsquedas de tu zona.

## ¿Tienes un negocio y todavía no tienes página web?

Escríbeme y te respondo con una propuesta clara.

- ✉️ **Correo:** abisaymedinarosario@gmail.com
- 💬 **WhatsApp / Teléfono:** +1 829 723 7899
- 📍 **Ubicación:** Santo Domingo, República Dominicana
- 🐙 **GitHub:** [@Eiby777](https://github.com/Eiby777)

---

## Para quien quiera el detalle técnico

Esta sección es solo para desarrolladores o para quien vaya a mantener el sitio.
Si solo querías ver el portafolio, no necesitas leerla.

**Tecnología:** HTML, CSS y JavaScript sin frameworks ni proceso de compilación.
Es un sitio 100 % estático, por lo que funciona igual en GitHub Pages, Netlify,
Vercel o cualquier hosting estático.

**Estructura del proyecto:**

```text
.
├── index.html              # Portada del portafolio (hero, proyectos, servicios, sobre mí, contacto)
├── 404.html                # Página de error personalizada
├── assets/
│   ├── css/portfolio.css   # Sistema visual completo
│   ├── js/portfolio.js     # Filtros, búsqueda, vistas y diálogo de vista rápida
│   ├── fonts/              # Tipografías propias (Bricolage, Instrument Serif, Inter)
│   ├── shots/              # Capturas de escritorio de cada proyecto
│   │   └── mobile/         # Capturas móviles para la vista rápida
│   ├── cv/                 # CV en PDF
│   ├── favicon.svg
│   └── og-image.jpg
└── sites/                  # Los 22 sitios navegables (uno por carpeta)
    ├── abogados/
    ├── barberias/
    ├── dentistas/
    └── ...
```

**Abrirlo en local:**

```bash
python3 -m http.server 8000
```

Luego visita <http://localhost:8000>.

**Funciones del portafolio:**

- Filtros por sector, búsqueda instantánea y contador de resultados.
- Vista de cuadrícula y de lista.
- Vista rápida en un diálogo con captura de escritorio y móvil.
- Navegación con las flechas del teclado dentro de la vista rápida.
- Diseño responsive, animaciones de aparición y soporte para `prefers-reduced-motion`.

**Añadir un proyecto nuevo:**

1. Copia la carpeta del sitio dentro de `sites/<slug>/`.
2. Añade una captura en `assets/shots/<slug>.webp` (1200 × 750 recomendado).
3. Añade su versión móvil en `assets/shots/mobile/<slug>.webp` (390 × 844).
4. Duplica un bloque `<article class="project-card">` en `index.html` y actualiza
   `data-slug`, `data-category`, el nombre, la descripción y las etiquetas.
5. Añade el filtro correspondiente si es un sector nuevo.

## Nota

Los sitios de `sites/` son demos de diseño y desarrollo. Las marcas, nombres,
fotografías y datos de contacto pertenecen a sus respectivos negocios.
