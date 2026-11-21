# Alimenta — recursos gráficos listos para integrar

Este paquete contiene recursos **independientes**, con fondo **transparente**. Los archivos SVG tienen únicamente trazados vectoriales (no incrustan imágenes rasterizadas ni requieren fuentes instaladas). Se derivaron de la versión simplificada que aprobaste, adaptando los rellenos a la paleta institucional. Son una vectorización de la referencia, no un archivo maestro original del generador.

## Archivos SVG

| Archivo | Uso sugerido |
| --- | --- |
| `svg/alimenta-logo-horizontal.svg` | Logo completo (isotipo + nombre), encabezado web |
| `svg/alimenta-logo-horizontal-oscuro.svg` | Logo completo con tipografía clara para fondos oscuros |
| `svg/alimenta-logo-vertical.svg` | Logo completo, formato apilado para inicio/presentaciones |
| `svg/alimenta-isotipo.svg` | Solo símbolo, sin texto, para aplicación, componentes y avatar |
| `svg/alimenta-tipografia.svg` | Solo el nombre y hoja tipográfica |
| `svg/favicon.svg` | Icono vectorial para pestaña de navegador |
| `favicon.ico` | Icono clásico en varios tamaños |

## PNG transparentes

La carpeta `png/` incluye múltiples tamaños de cada composición. Recomendación: usar **SVG** para la interfaz responsiva, y PNG para integraciones que lo requieran.

## Integración en Alimenta (React + Vite)

1. Copia el contenido de `svg/` y `favicon.ico` en `app/frontend/public/brand/` del repositorio.
2. Modifica el encabezado de React, sustituyendo el contenido textual de la marca por una imagen:

```tsx
import { Link } from 'react-router-dom';

<Link to="/" className="brand" aria-label="Alimenta, inicio">
  <img src="/brand/alimenta-logo-horizontal.svg" alt="Alimenta" width={170} height={36} />
</Link>
```

3. En `app/frontend/index.html`, dentro de `<head>`:

```html
<link rel="icon" type="image/svg+xml" href="/brand/favicon.svg" />
<link rel="alternate icon" href="/brand/favicon.ico" />
```

4. Para usar solo el símbolo en un componente:

```tsx
<img src="/brand/alimenta-isotipo.svg" alt="" width={44} height={44} />
```

5. Si quieres que el logo se ajuste a su caja sin deformarse:

```css
.brand img { display: block; max-width: 100%; height: auto; object-fit: contain; }
```

> Nota: dado que los SVG tienen fondo transparente, la variante oscura se diseñó para fondos verde oscuro o de texto oscuro. Verifica el contraste en la navegación final, sobre todo a tamaños pequeños.

## Paleta institucional

- Verde principal: `#94B43B`
- Verde oscuro: `#466B3F`
- Rojo: `#A61C31`
- Vino: `#76232F`
- Marfil: `#F8F9F6`
- Texto oscuro: `#26342A`

La identidad mantiene el significado del símbolo simplificado: comunidad, protección, nutrición y colaboración. Se usan curvas y figuras planas; no hay degradados. Se recomienda no usar el logo completo a menos de 110 px de ancho; para tamaños muy pequeños utilizar el isotipo o favicon.
