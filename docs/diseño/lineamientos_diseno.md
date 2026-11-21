# Alimenta — Lineamientos de diseño y contrato visual de implementación

**Baseline de UI:** `Mockup_Alimenta_Taste_v6_Menu_Superior.html`  
**Vigencia:** guía para reproducir el **mockup final aprobado** en una demo funcional; 20 de noviembre de 2026.  
**Lectura conjunta:** `propuesta_mockup.md`. El HTML es la fuente visual primaria; estas reglas explicitan su sistema, no habilitan un rediseño.

## 1. Identidad visual y principios

El lenguaje es **editorial, sobrio, cercano y utilitario**. Las referencias de taste-skill se emplearon para espaciado, jerarquía, paneles de selección, tipografía y microinteracciones; no implican copiar otras pantallas ni cambiar los recorridos definidos por Alimenta.

**Principios obligatorios:**

1. **Continuidad:** público y cuatro áreas de rol usan la misma marca, paleta y geometría.
2. **Una prioridad clara por pantalla:** título, contexto, acción principal y estados visibles.
3. **La navegación no compite con el contenido:** barra superior, no menú lateral.
4. **Transparencia:** mostrar la diferencia entre ofrecido, asignado, transportado y recibido.
5. **Sin promesas visuales engañosas:** casos, empresas, datos, mapas y horarios ficticios rotulados como demo hasta conectar backend.
6. **Accesibilidad antes que decoración:** suficiente contraste, foco visible y equivalentes textuales a colores/íconos.

## 2. Paleta: valores institucionales y efectivos del mockup

### 2.1. Paleta institucional inalterable

| Token de identidad | HEX | Uso principal |
|---|---|---|
| `brand-green` | `#94B43B` | Verde institucional, realces, indicador de selección, detalles de identidad |
| `brand-green-dark` | `#466B3F` | Navegación activa, botones con texto blanco, textos/enlaces de marca |
| `brand-red` | `#A61C31` | Alerta y acentos institucionales, no acciones primarias rutinarias |
| `brand-wine` | `#76232F` | Acento secundario y advertencias sensibles |
| `brand-gray-dark` | `#565A5C` | Texto secundario legible |
| `brand-gray-light` | `#B1B2B0` | Neutros y separadores (no texto pequeño sobre blanco) |

### 2.2. Neutros y colores efectivos observados

| Contexto | Valor del HTML final | Nota |
|---|---|---|
| Fondo general editorial | `#F9FAF6` (también `#F8F9F5`) | Superficie amplia, cálida y de bajo contraste |
| Tarjetas y tablas | `#FFFFFF` | Deben destacar por borde leve, no por sombras intensas |
| Texto principal editorial | `#203B32` | Títulos e información central |
| Acción primaria oscura | `#244532` / `#466B3F` según componente | Blanco encima, revisar contraste |
| Barra de rol activa | `#466B3F` | Subrayado de la pestaña seleccionada |
| Realce brillante en algunos botones y marca | `#91C520` | **Variación que sí está en el HTML**; no confundir con el oficial `#94B43B` |
| Bordes UI | `#DFE4DB`, `#DFE5DA` | Separadores finos |
| Bloque de destacados | `#EDF2E7` | Fondo claro para el carrusel editorial |
| Fondo de rutas / bloque oscuro | `#20382B` | Contraste de sección pública |

**Decisión pendiente menor:** el HTML usa tanto `#94B43B` oficial como `#91C520` aproximado. Para una reproducción visual exacta, mantener ambos donde existen; si el equipo normaliza los acentos al valor institucional, debe aprobarlo y registrar el cambio. No sustituir arbitrariamente el resto de tonos.

### 2.3. Contraste y estados

- Usar texto **oscuro**, no blanco, encima de verde brillante `#94B43B` o `#91C520`.
- Usar texto blanco sobre verdes oscuros **solo tras validar WCAG AA**.
- Los estados no se expresan únicamente con color: acompañarlos con palabras como «Pendiente», «Confirmada», «Incidencia» o «Crítica G5».
- Los verdes de marca **no** deben usarse como único indicador de un riesgo o error; incorporar ícono, texto, borde y mensaje accionable.

## 3. Tipografía

- **Stack observado:** `Inter, Manrope, 'Segoe UI', system-ui, sans-serif`. El archivo HTML no carga tipografía web externa, por lo que la apariencia real depende de las fuentes instaladas.
- **Recomendación de desarrollo:** elegir Inter o Manrope como fuente principal instalada/licenciada en el proyecto y mantener fallback del sistema. Congelar una sola implementación tipográfica después de la primera comparación visual.
- **Títulos editoriales públicos:** alrededor de `37–61 px` según ancho; `line-height` ≈ 1.1; peso medio, tracking negativo suave; acento de palabra con color más claro.
- **Hero de portada:** llega aproximadamente a `70 px` en escritorio; se adapta a ~`41–46 px` en teléfonos pequeños.
- **Títulos de área interna:** normalmente `22–29 px`; encabezados de tarjetas `15–22 px`; texto de interfaz `12–14 px`.
- **Etiquetas de contexto / eyebrow:** `9–11 px`, mayúsculas, espaciado positivo; nunca reemplazan el título de la pantalla.
- Evitar textos de 9–10 px como tamaño funcional obligatorio para la demo: los tamaños diminutos del prototipo son principalmente vistas previas decorativas; en formularios reales priorizar legibilidad y zoom del navegador.

## 4. Retícula, ritmo y contenedores

- Contenedor público de contenido: **máximo ~1180 px** (`.public-wrap`, `.public-content`).
- Área interna por rol: **máximo ~1400 px** (`.workspace-main .content`).
- Barra superior interna: contenido de máximo ~1510 px (`.workspace-nav-inner`).
- Mantener **bordes alineados**, espacios entre secciones, y no introducir paneles flotantes no presentes en el mockup.
- Tarjetas sobrias: radio habitual **8–13 px**, borde delgado verde grisáceo y sombra suave, nunca relieve intenso o gradientes de aplicación financiera.
- La portada utiliza secciones editoriales altas (`.editorial-screen`) con una idea por bloque y separación amplia; no condensarlas en un tablero de tarjetas.
- Para acciones de tablas y formularios, conservar orientación de lectura izquierda → derecha y orden semántico al apilarse en móvil.

## 5. Barra superior definitiva (NO menú lateral)

### 5.1. Público

**Izquierda:** logotipo simple y nombre **Alimenta**. **Centro:** `Inicio`, `Servicios comunitarios`. **Derecha:** `Ingresar`, `Quiero donar`.

- La cabecera pública es **sticky**, fondo claro translúcido, altura mínima aproximadamente **76 px**.
- «Organizaciones aliadas» **no** es ítem de navegación independiente: aparece dentro de `Inicio` después de la bienvenida.
- Selección activa con subrayado discreto, no bloque verde grande.

### 5.2. Áreas internas (Donante, Edil, Agente y Administrador)

**Izquierda:** marca que vuelve a la portada pública. **Centro:** opciones específicas del rol. **Derecha:** selector/identidad de rol de la demo y menú «Opciones» (`⋯`). El Edil muestra, además, selector de comunidad en el mockup para probar cuentas autorizadas.

- Componente de referencia: `workspaceHeader()` con clases `.workspace-navbar`, `.workspace-links`, `.workspace-actions`.
- El ítem seleccionado tiene **subrayado verde oscuro** (`#466B3F`) y peso mayor.
- No reutilizar sidebar o nav dark de v2–v5: aunque sus estilos CSS antiguos todavía existan en el archivo por herencia, **la estructura renderizada final es superior**.
- El menú de opciones de la demo contiene Portada pública, Acceso de demostración y Reiniciar; para el producto reemplazar por Perfil/Salir según permisos, sin fingir persistencia.
- Roles no seleccionables libremente en producción: si se conserva un switcher en entorno interno de pruebas, debe estar **visiblemente etiquetado como modo demo**.

### 5.3. Comportamiento responsive de la barra

| Ancho aproximado | Resultado esperado |
|---|---|
| >1100 px | Marca, links del rol y acciones en una fila; tabs compactas centradas |
| ≤1100 px | Marca y acciones arriba; links en **segunda fila** desplazable horizontalmente |
| ≤650 px | Selector de rol compacto, menú `⋯` y pestañas de altura ~45 px con desplazamiento horizontal |
| ≤420 px | Aún menos espacio lateral; no cortar ni hacer inoperables acciones |

Mantener `aria-current="page"`, navegación por teclado, foco visible y pestaña activa desplazada a la zona visible. El scroll horizontal pertenece al conjunto de tabs, **no a la página completa**.

## 6. Portada pública: composición y orden congelados

El render de `publicLanding()` define este orden. **No permutar las secciones durante la primera implementación.**

1. **Bienvenida** (`#inicio`): titular de gran formato a la izquierda y demostración real de listado/detalle de necesidades a la derecha. Dos acciones: servicios y acceso.
2. **Organizaciones aliadas** (`#aliados`): título editorial, carrusel con donante principal como primera diapositiva, lista de hasta diez entidades, nota sobre criterio y datos de prueba.
3. **Proceso** (`#funciones`): tres tarjetas Edil → Agente → Donante, cada una con una mini interfaz ilustrativa.
4. **Rutas** (`#rutas`): sección verde profunda con las tres modalidades y representación de calendario.
5. **Servicios** (`#servicios`): texto editorial y panel con sitios públicos; CTA al directorio/mapa.
6. **Preguntas** (`#preguntas`): preguntas frecuentes a dos columnas, estados diferenciados y límites de la plataforma.
7. **Aviso de prototipo y pie**.

La portada se explora sin iniciar sesión. Los botones que implican comprometer donaciones conducen a acceso, no efectúan una operación anónima.

## 7. Carrusel compartido de destacados

Referencia: `featuredCarousel(scope)`, `featuredSlides(scope)`, `.feature-showcase`, `.feature-grid` y `.feature-controls`.

### Geometría

- Contenedor suave verde grisáceo, borde discreto, sin efectos ostentosos.
- **Dos columnas:** copia editorial a la izquierda (`~0.91fr`), vista previa de producto/organización a la derecha (`~1.09fr`).
- Copia: etiqueta breve → título de varias líneas → descripción → CTA → **selector**.
- Vista previa derecha: pequeño marco tipo navegador, nombre/indicador/tarjeta con jerarquía legible y fuente de los datos.
- El **selector se ubica siempre abajo a la izquierda** del área de copia, con contador `01 / 10`, flechas ← → e indicadores rectangulares. No trasladarlo arriba, a la derecha o al borde exterior de la página.
- Espacio visual mínimo aproximado: 340–375 px en escritorio para la pieza; en móvil se apila y el selector queda después del texto, antes de la vista previa.

### Comportamiento

- Avance/retroceso manual; selección directa por indicadores; índice independiente por ámbito (público, donante, edil, admin).
- **No autoplay, no temporizadores y no cambiar de slide por scroll**.
- Botones con etiqueta accesible, estado seleccionado visible y sin pérdida del foco.
- Los contenidos son específicos de cada ámbito; mantener **idéntica estructura visual y colocación del selector**.
- Organización principal: persona jurídica verificada, con consentimiento, ordenada por aportes **confirmados**, no por promesas. Datos ficticios etiquetados hasta disponer de datos auditables.

### Ámbitos

| Ámbito | Secuencia vigente del HTML |
|---|---|
| Inicio público | Ranking de reconocimientos; principal primero |
| Donante | Necesidad / banco / donar a edil / principal (cuando existe) |
| Edil | Agenda / recepciones / puntos / principal (cuando existe) |
| Administrador | Puntos / representantes / auditoría / principal (cuando existe) |
| Agente | **No usa este carrusel**; conserva resumen operativo |

## 8. Panel de selección de necesidades

Referencia: `explore()`, `.need-selector`.

**Desktop:** tres columnas: (A) carril de contexto ~170 px, (B) listado desplazable/seleccionable, (C) detalle más amplio. Las etiquetas del listado llevan comunidad, producto y saldo; la selección cambia el panel de detalle **sin navegar ni registrar compromiso**. El detalle muestra cantidad pendiente, progreso, una ventana próxima y CTA «Ver necesidad y aportar».

**Móvil (≤700 px):** el carril contextual se oculta; lista y detalle se apilan verticalmente. Conservar información básica, filtros y acción primaria. El detalle transaccional con cantidad y horario continúa siendo una pantalla separada.

**No mezclar:** porcentaje cubierto, saldo real y saldo aportable. Cada magnitud lleva nombre y unidad; las cifras deben formatearse para `es-CO` y no exceder saldos reales. El `G` se muestra solo como dato evaluado por Agente.

## 9. Formularios, datos y tablas

- Un formulario por tarea clara; etiqueta visible por cada entrada, texto auxiliar solo cuando se necesita explicar regla operativa.
- Botón principal de guardar/confirmar de **alto contraste**. No convertir elementos decorativos en botones.
- Campos de cantidades con unidad, mínimos y máximos mostrados; servidor valida aunque el navegador lo haga.
- Ventanas horarias: fecha legible, bloque de **una hora**, capacidad disponible y estado de aceptación. Diferenciar **solicitud de cita** de **cita confirmada**.
- Múltiples productos en solicitud mediante filas repetibles; duplicados con aviso y motivo de excepción.
- Formularios de servicios: sede **pública**; latitud/longitud, jornadas, horario, declaración de autorización; no domicilios particulares.
- Recepciones: cantidad realmente apta, evidencia, parcial/total y advertencia de incidencia.
- Tablas con cabeceras visibles, números alineados, etiquetas de estado y acciones contextualizadas; en teléfono, scroll horizontal **dentro de `.table-wrap`**.
- Estados esperados en todas las operaciones: **vacío, cargando, éxito, validación fallida, conflicto concurrente, permiso denegado, error de red y reintento seguro**. Los últimos cuatro son ampliaciones necesarias al pasar a backend; no están resueltos por el mockup estático.

## 10. Mapa y servicios comunitarios

- El mockup final muestra una **representación esquemática de pines basada en coordenadas**, **no cartografía real**; debe seguir rotulada como tal mientras no haya proveedor de mapas.
- El directorio ofrece filtros por comunidad, tipo, día y búsqueda libre, con selección sincronizada de pin y ficha.
- Solo publicar sedes autorizadas y revisadas; diferenciar horarios anunciados de disponibilidad real de raciones o cupos.
- Si se integra proveedor cartográfico real, conservar disposición de panel de mapa + lista/ficha y revisar atribución, accesibilidad, internet y privacidad.
- El mapa se abre sin sesión; la edición y publicación usan rutas protegidas de Edil y Admin.

## 11. Estados visuales y lenguaje

| Estado | Tratamiento visual | Texto inequívoco |
|---|---|---|
| Pendiente / sin evaluar | Fondo neutro o ámbar tenue | «Pendiente de evaluación», «Por aceptar» |
| Programado / cita aceptada | Verde moderado | «Programada», «Cita confirmada» |
| Transporte o proceso | Acento sobrio, iconografía de ruta | «En entrega» |
| Confirmado / recibido | Verde oscuro legible | «Recibida y verificada», «Confirmada» |
| Incidencia o G5 | Rojo institucional / vinotinto con texto | «Incidencia parcial», «Crítico G5» |
| Suspendido / rechazado | Neutro o rojo desaturado | «Suspendido», «Rechazada» |

Mantener el tono del producto: claro, empático, sin exagerar impacto ni asegurar disponibilidad. La jerga técnica de inventario se explica al usuario cuando resulta necesaria.

## 12. Motion e interacciones

- Microinteracciones discretas: botón sube aproximadamente `1 px` al hover, sombras casi imperceptibles y subrayado/realce en navegación.
- Entrada suave de la primera vista pública (`soft-arrive`); no hacer depender información esencial de animaciones.
- Respetar `prefers-reduced-motion: reduce` y foco por teclado.
- El carrusel no avanza por sí mismo. Las flechas y los puntos no deben generar salto vertical de página.
- Nada de efectos tridimensionales, desplazamiento parallax o transiciones que retrasen tareas operativas.

## 13. Breakpoints y control visual

| Tamaño de validación | Lo que debe comprobarse |
|---|---|
| 1440 × 900 | Portada editorial, navbar una fila y destacado dos columnas |
| 1024 × 768 | Navbar en dos niveles; listas, cards y formularios sin montarse |
| 768 × 1024 | Inicio por secciones, destacado apilado, formularios adaptados |
| 390 × 844 | Barra superior compacta, tabs desplazables, carrusel sin recortes |
| 320 × 700 | Menú `⋯` accesible, ninguna pérdida de CTA o título, sin scroll horizontal global |

Los puntos de quiebre exactos observados son aproximadamente `1190`, `1100`, `950`, `800`, `700`, `650`, `450`, `420` y `390 px`, según componente. No crear otra rejilla de puntos de ruptura sin justificarla por contenido.

## 14. Accesibilidad mínima exigida en la demo

- Navegación operable mediante Tab, Shift+Tab, Enter y Space; foco claro y orden lógico.
- Área interactiva táctil adecuada (recomendación de implementación: **al menos 44 × 44 px** cuando sea viable, especialmente flechas y puntos de carrusel).
- Texto de tablas, estado y formularios no depende solo de una tonalidad.
- Indicadores del carrusel con `aria-label` descriptivo y anuncio prudente de cambio; sin movimiento automático.
- Formularios con `<label>` y error junto al campo; resumen de errores cuando corresponda.
- Modal, menú o diálogo (si se añade en desarrollo) con gestión del foco y tecla Escape.
- Alternativa textual y navegación por lista para puntos del mapa.
- No publicar direcciones privadas ni revelar información de beneficiarios en ejemplos.
- Verificación automatizada de contraste y criterios WCAG 2.2 AA como **objetivo de calidad**; el mockup original no constituye auditoría completa de accesibilidad.

## 15. Tokens portables de implementación

Además del documento, se entrega `tokens_diseno.json` con valores de referencia. Extracto CSS recomendado para iniciar el sistema visual **sin sustituir** el contraste o el contenido del HTML:

```css
:root {
  --brand-green: #94B43B;
  --brand-green-dark: #466B3F;
  --brand-red: #A61C31;
  --brand-wine: #76232F;
  --brand-gray-dark: #565A5C;
  --brand-gray-light: #B1B2B0;
  --ui-accent-bright-mockup: #91C520;
  --ui-background: #F9FAF6;
  --ui-surface: #FFFFFF;
  --ui-ink: #203B32;
  --ui-border: #DFE4DB;
  --ui-feature-background: #EDF2E7;
  --ui-primary-action: #244532;
  --ui-active-navigation: #466B3F;
}
```

Los componentes deben consumir tokens y variantes, no copiar docenas de valores hardcodeados entre roles.

## 16. Control de cambios y definición de terminado visual

El equipo de implementación debe conservar una copia íntegra del HTML recibido y una captura de referencia por pantalla. Cada PR que cambie la interfaz debe documentar **pantalla, motivo, captura antes/después y tamaño de pantalla**.

**Criterios de aceptación visual:**

- [ ] Todos los roles usan **navbar superior**; ningún sidebar histórico reaparece.
- [ ] Aliados se ubican en Inicio y muestran un principal destacado; no hay página independiente.
- [ ] Carrusel público/Donante/Edil/Admin conserva **misma geometría y ubicación del selector**.
- [ ] Inicio de Agente mantiene su resumen operacional.
- [ ] Portada conserva el orden de sus seis secciones públicas.
- [ ] Necesidades conserva selector de tres paneles en escritorio y versión apilada en móvil.
- [ ] Filtros, formularios y tablas tienen estados vacíos/de error y no dependen de datos inventados de operación.
- [ ] Se validaron pantallas en 1440, 1024, 768, 390 y 320 px; sin scroll horizontal global.
- [ ] Cumple contraste, teclado, reducción de movimiento y semántica de estados.
- [ ] Los colores institucionales se respetan y cualquier normalización de `#91C520` se aprueba explícitamente.

**No son cambios autorizados por este documento:** reestructurar la navegación por roles, mover aliados a otro apartado, agregar autoplay, reinterpretar la calificación como automática, cambiar al agente por transportador o usar el ranking comercial para ordenar necesidades.
