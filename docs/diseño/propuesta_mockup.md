# Alimenta — Propuesta de mockup y especificación para la demo funcional

**Versión del documento:** 4.1 (alineada con mockup v7 · Jornadas de voluntariado)

**Referencia visual congelada:** `Mockup_Alimenta_Taste_v7_Jornadas_Voluntariado.html`
**Fecha de consolidación:** 20 de noviembre de 2026  
**Estado:** especificación de implementación; **no** certifica una aplicación funcional ni servicios reales.

> **Regla de precedencia.** El HTML entregado por el equipo es la **fuente de verdad para navegación, orden visual, pantallas, componentes y microinteracciones**. La propuesta funcional previa (`propuesta.md`, v2.1) sigue siendo la fuente para el problema, las responsabilidades y las reglas operativas, salvo decisión documentada. Este documento convierte las interacciones simuladas del HTML en requisitos verificables para desarrollar la demo; **no cambia el HTML final**. Cuando un requisito adicional no exista en el mockup, se identifica como trabajo de implementación y no como función ya construida.

## 1. Propósito y límites

Alimenta conecta donantes, ediles, agentes y administradores para registrar necesidades comunitarias, coordinar donaciones de productos y sus transportes, verificar recepciones y divulgar servicios comunitarios y jornadas de voluntariado. El principio que no se puede perder es: **el edil reporta, agenda jornadas comunitarias y recibe; el agente evalúa, prioriza y coordina el banco; el donante transporta o acepta transportar; el administrador verifica, revisa publicaciones y audita; el sistema registra sin sustituir decisiones humanas.**

La demo funcional deberá permitir recorrer flujos de punta a punta **entre usuarios con sesiones y roles distintos**, almacenar datos, impedir operaciones inválidas y demostrar consecuencias en otras pantallas. No es necesario ejecutar donaciones físicas para demostrarlo; toda entidad de prueba debe estar rotulada como demostrativa. Se excluyen de esta fase pagos, medicamentos, seguimiento GPS, distribución automática autónoma sin aprobación humana y disponibilidad real de raciones de ollas comunitarias. **Sí se autoriza** implementar en `app/`, siguiendo exclusivamente las directrices del repositorio (`README.md` y `docs/propuesta.md`), el **modelo de ponderación social + herramienta `US8494885B2`** (como sugerencia asistida *Human-in-the-Loop* para el Agente, sin auto-reservar ni alterar `G`), las **jornadas de voluntariado comunitario** (`jornadas_edil` / `jornadas_admin`, independientes de las citas de donación), el **Catálogo de Ayudas Técnicas UNAL**, el **emparejamiento asistido** y la **Ruta PAP UNAL** desacoplada sin datos clínicos, preservando intactas las reglas visuales y de navegación del HTML v7. La **accesibilidad universal para versión móvil** (lengua de señas, interfaces táctiles y auditivas) queda registrada como **plan a futuro (Fase 2)**.

### 1.1. Decisiones de diseño ya cerradas

- **Navegación superior unificada** en todas las áreas internas; **no restaurar menús laterales** de versiones anteriores. La marca queda a la izquierda, las opciones del rol se agrupan en una barra central y las opciones de cuenta/demo a la derecha.
- Portada pública anterior al inicio de sesión. **`Organizaciones aliadas` vive dentro de Inicio, sin apartado público independiente**.
- Inicio público con secciones editoriales: bienvenida y vista previa de necesidades, aliados con donante principal destacado, proceso, tres rutas, servicios comunitarios y preguntas frecuentes.
- Un **mismo patrón de carrusel** para portada, Donante, Edil y Administrador: texto a la izquierda, vista previa a la derecha, **selector al pie izquierdo** del bloque de texto, flechas e indicadores; **sin autoplay**. El Agente mantiene su resumen operativo, sin carrusel en el HTML final.
- El catálogo de necesidades utiliza el **selector de tres paneles**: contexto/filtros, lista seleccionable y detalle. En móvil se adapta a una sola columna.
- Paleta institucional de seis colores, fondos neutrales, tipografía sobria, bordes suaves y composición editorial según el documento `lineamientos_diseno.md`.

### 1.2. Cambios respecto a la especificación antigua

| Antes / referencia histórica | Decisión del HTML final | Implicación para desarrollo |
|---|---|---|
| Sidebar de administrador, edil y agente | Navbar superior por rol | Una sola navegación reutilizable, con estado activo y pestañas desplazables |
| Aliados como pantalla separada | Bloque dentro de Inicio | La administración del top 10 sigue en Agente, pero la publicación solo se visualiza en la portada |
| Banner/carrusel con distribución variable | Componente `featuredCarousel(scope)` compartido | Conservar geometría, selector y comportamiento en los 4 ámbitos que lo usan |
| Portada con mapa incorporado como pantalla completa | Inicio presenta resumen y CTA; el directorio/mapa público es una vista propia | Mantener ambos sin duplicar toda la cartografía en la portada |
| Navegación por pantallas descrita de modo genérico | Catálogo exacto de páginas por rol | No unir ni borrar vistas por ahorrar implementación |

## 2. Arquitectura de información definitiva

Los identificadores de la columna `page` provienen de `pages` y `renderPage()` del HTML. **Son claves internas del mockup, no URLs de producción**; la demo funcional necesita un enrutador real con autorización por pantalla y operación.

### 2.1. Público / sin autenticación

| ID | Pantalla / bloque | Clave del HTML | Comportamiento |
|---|---|---|---|
| PUB-01 | Inicio público | `portada` | Hero, preview interactiva de necesidades, aliados, proceso, rutas, servicios, preguntas, acceso |
| PUB-02 | Servicios comunitarios | `mapa_publico` | Filtros por comunidad, servicio, día, texto; mapa esquemático, lista, ficha y enlace externo |
| PUB-03 | Aliados dentro de Inicio | `portada` + sección `#aliados` | Carrusel con organización principal primero, hasta diez publicaciones y lista integrada; **no página** |
| PUB-04 | Acceso de demostración | `acceso` | Correo de ejemplo y elección de rol; Google aparece deshabilitado y no existe autenticación real |

La ruta heredada `aliados_publico` del prototipo redirige conceptualmente a `portada` y desplaza el documento a `#aliados`. No debe recuperarse como destino independiente.

### 2.2. Donante — 6 opciones principales + detalle

| ID | Etiqueta visible | `page` | Funcionalidad esperada |
|---|---|---|---|
| DON-01 | Inicio | `inicio` | Carrusel editorial, tres modalidades y necesidades visibles |
| DON-02 | Necesidades | `explorar` | Filtros, selector en paneles, saldo pendiente y aportable |
| DON-03 | Donar a edil | `edil_directa` | Representante verificado, producto, cantidad, descripción y ventana de entrega |
| DON-04 | Banco | `banco` | Registrar ofrecimiento y pedir cita de ingreso al banco |
| DON-05 | Mis donaciones | `seguimiento` | Estados, cancelaciones permitidas, llegada al banco y salida con aporte directo |
| DON-06 | Transportes | `transportes` | Activar disponibilidad, aceptar traslados desde el banco e iniciar recorrido |
| DON-07 | Detalle de necesidad | `detalle` | Solicitud, afectados agregados, pendientes, aportables, elección de fecha/hora y compromiso |

### 2.3. Edil — 8 opciones principales + detalle

| ID | Etiqueta visible | `page` | Funcionalidad esperada |
|---|---|---|---|
| EDI-01 | Inicio | `inicio` | Carrusel editorial, indicadores de su comunidad, próximas jornadas de voluntariado y solicitudes |
| EDI-02 | Servicios | `puntos_servicio` | Crear/editar propuestas de puntos públicos pertenecientes a su comunidad |
| EDI-03 | Voluntariado | `jornadas_edil` | Agendar voluntarios en un horario específico (atención psicológica, jornada de vacunación, atención médica u otra), indicando nombre del voluntario encargado y lugar público autorizado; queda «Pendiente de revisión» |
| EDI-04 | Solicitudes | `peticiones` | Consultar necesidades y entrar al detalle |
| EDI-05 | Nueva solicitud | `nueva` | Registrar varios productos, cantidades, hogares, afectados, justificación y advertencia por duplicados |
| EDI-06 | Agenda | `agenda_edil` | Publicar ventanas de hora, cupos y cierre condicionado por citas activas |
| EDI-07 | Aportes | `aportes_edil` | Aceptar/rechazar donaciones espontáneas y citas ligadas a necesidades |
| EDI-08 | Recepciones | `recibir` | Confirmar cantidades reales y evidencia; admitir parciales |
| EDI-09 | Detalle de solicitud | `detalle_edil` | Actualizar necesidad con motivo, auditoría y nueva evaluación si cambia información relevante |

### 2.4. Agente — 7 opciones principales + evaluación

| ID | Etiqueta visible | `page` | Funcionalidad esperada |
|---|---|---|---|
| AGE-01 | Inicio | `inicio` | Pendientes de evaluar, críticos G5, citas bancarias y cola de necesidades |
| AGE-02 | Donantes | `reconocimientos` | Elegibles, selección de hasta 10, justificación, publicar/retirar reconocimientos |
| AGE-03 | Evaluación | `bandeja` | Bandeja ordenada y acceso a evaluación individual |
| AGE-04 | Inventario | `inventario` | Prometido, recibido, disponible, reservado, despachado y entregado; verificación de ingresos |
| AGE-05 | Agenda | `agenda_banco` | Crear ventanas del banco y confirmar/proponer otro horario al donante |
| AGE-06 | Asignaciones | `asignar` | Reserva de stock a necesidades evaluadas con justificación |
| AGE-07 | Entregas | `entregas` | Proponer horario de edil y transportador, esperar aceptación, autorizar salida y seguimiento |
| AGE-08 | Evaluación individual | `evaluacion` | `G` 1–5 con motivo, resumen de afectación y antigüedad, puntaje solo ilustrativo |

### 2.5. Administrador — 6 opciones principales

| ID | Etiqueta visible | `page` | Funcionalidad esperada |
|---|---|---|---|
| ADM-01 | Inicio | `inicio` | Carrusel editorial, pendientes de verificación, productos y eventos |
| ADM-02 | Servicios | `puntos_servicio` | Crear/editar puntos, verificar, publicar o suspender |
| ADM-03 | Jornadas | `jornadas_admin` | Revisar y publicar jornadas de voluntariado comunitario registradas por ediles |
| ADM-04 | Verificar ediles | `verificaciones` | Aprobar representantes para comunidades determinadas |
| ADM-05 | Catálogo | `catalogo` | Visualización estructurada; el mantenimiento completo es requisito de la demo, no función editable hoy |
| ADM-06 | Auditoría | `auditoria` | Bitácora de acciones de la sesión; en demo funcional, registros persistentes |

**Conteo:** 27 opciones de navegación principal: 6 Donante + 8 Edil + 7 Agente + 6 Administrador. Las vistas detalle/evaluación, pública y acceso se agregan sobre estas 27. El selector de roles o de edil del HTML es **exclusivamente de prueba**.

## 3. Contratos de interfaz (componentes que NO deben reinventarse)

| Componente | Referencia en HTML | Contrato de comportamiento |
|---|---|---|
| Navbar público | `publicHeader()` | Marca izquierda, enlace Inicio, Servicios comunitarios, acciones Ingresar / Quiero donar |
| Navbar interno por rol | `workspaceHeader()` | Marca izquierda; rutas del rol en el centro; selector de cuenta/demo y opciones a la derecha; estado activo subrayado |
| Contexto de área | `.workspace-context` | Rol y ubicación actual por encima del contenido, sin repetir un sidebar |
| Carrusel principal | `featuredCarousel(scope)` | Misma cuadrícula, título/CTA, vista previa, contador, flechas, indicadores y **selector en pie izquierdo**; sin autoplay |
| Selector de necesidades | `.need-selector`, `explore()` | Panel de contexto, lista y detalle; selección no crea donación; CTA abre ficha |
| Tabla de operaciones | `.table-wrap` / `.table` | Columnas y estados legibles; en móvil permitir desplazamiento de tabla sin desbordar página |
| Ventanas de entrega | `windowsPage()` | Bloques de una hora con cupo; disponibilidad real validada por backend |
| Servicios | `publicMap()`, `serviceEditor()` | Ficha y filtros públicos; moderación por rol; ubicación de sede pública |
| Reconocimiento | `recognitionPanel()`, `featuredSlides('publico')` | Agente selecciona elegibles; solo publicados y consentidos en Inicio |
| Alertas | `.notice`, `.tag`, `notify()` | Estado en texto y color; errores cerca de su operación; confirmación accesible |

### 3.1. Carruseles del diseño final

- **Público:** 1–10 personas jurídicas verificadas, consentidas y reconocidas; el **puesto 1** es la diapositiva inicial destacada.
- **Donante:** necesidad, banco, aportación directa a edil y, si existe, organización principal.
- **Edil:** agenda comunitaria, confirmación de entrega, servicios públicos y, si existe, organización principal.
- **Administrador:** moderación de servicios, verificación de representantes, auditoría y, si existe, organización principal.
- **Agente:** no se le añade automáticamente este carrusel; su inicio prioriza operaciones. La elección de los reconocimientos sí es responsabilidad del agente.
- La posición de selector **no cambia** entre ámbitos; cada carrusel administra su índice; los controles son manuales y visibles.

## 4. Flujos transaccionales para demostrar

### F-01 · Donación directa a una necesidad

1. Edil crea una solicitud con uno o varios productos, cantidades y afectación agregada.
2. Agente revisa cada necesidad específica, asigna `G` y justifica.
3. La necesidad autorizada se publica y el donante puede filtrar y abrir su detalle.
4. Donante elige cantidad **no superior al saldo aportable** y una ventana con cupo publicada por el edil.
5. Se crea compromiso y cita **pendiente de aceptación**; no cambia aún el saldo real.
6. Edil acepta o rechaza la cita; si rechaza, se libera el compromiso y su cupo.
7. Donante transporta y marca salida; edil verifica cantidad apta y prueba de recepción.
8. Solo lo **efectivamente confirmado** reduce el saldo de la necesidad. Recepción parcial crea incidencia.

### F-02 · Donación espontánea a un edil verificado

1. Donante elige representante de comunidad **verificado**, artículo, cantidad, explicación y hora habilitada.
2. Edil recibe ofrecimiento y acepta/rechaza antes de que el donante salga.
3. Donante transporta y edil confirma su recepción real.
4. El registro pertenece a **aporte dirigido comunitario**: `detalle_solicitud_id = NULL`, no crea ni evalúa una necesidad y no entra por defecto a stock del banco.
5. Si después se vincula a una necesidad, debe ser un **proceso de conciliación explícito, autorizado y auditado**, no un efecto implícito.

### F-03 · Ingreso del donante al banco

1. Donante selecciona producto/cantidad y propone horario de una ventana bancaria.
2. Agente confirma esa cita o propone un nuevo bloque; la alternativa requiere aceptación del donante.
3. Donante lleva productos al banco y registra llegada.
4. Agente/responsable del banco verifica producto, cantidad apta y, cuando aplique, conservación/lote.
5. Solo la cantidad verificada se suma a inventario **disponible**. La diferencia pasa a incidencia; promesa no es existencia.

### F-04 · Salida del banco a la comunidad

1. Agente evalúa necesidad y reserva como máximo unidades verificadas disponibles y saldo sin otras coberturas activas.
2. Selecciona ventana comunitaria abierta y propone un **donante transportador** disponible.
3. Donante transportador acepta la propuesta; sin esa aceptación **no hay despacho**.
4. Agente autoriza el retiro, el transportador inicia recorrido, el edil verifica recepción.
5. El despacho mueve stock entre estados; no reduce el saldo de la solicitud hasta la confirmación de la recepción.

### F-05 · Servicios comunitarios públicos

1. Edil propone nombre, tipo, barrio/comunidad, **sede pública autorizada**, coordenadas, días, horas, condiciones y declaración de autorización.
2. Administración verifica y publica o suspende el punto; un edil no puede publicar directamente.
3. Persona sin sesión consulta el mapa/lista filtrados y la ficha; solo ve registros publicados.
4. El mapa del HTML es esquemático con coordenadas ficticias y salida a OpenStreetMap; **el mapa cartográfico real no está implementado**.
5. **Diferenciar** horarios de servicios comunitarios de las ventanas de recepción de donaciones: son calendarios distintos.

### F-06 · Reconocimiento a organizaciones aliadas

1. Se contabilizan **aportes recibidos y confirmados** de personas jurídicas; promesas no cuentan.
2. Se verifica identidad jurídica y consentimiento para exhibir nombre/logo/indicador.
3. Agente consulta el orden elegible y elige entre las primeras diez elegibles, registra período, indicador y motivo.
4. Publica o retira el reconocimiento con auditoría. Se actualiza la sección de Inicio; la primera reconocida es la destacada.
5. Reconocimientos **no** son publicidad pagada ni influyen en el puntaje de las necesidades ni en asignaciones.

## 5. Reglas de negocio obligatorias (RN)

| ID | Regla / invariante |
|---|---|
| RN-01 | La evaluación G∈{1,…,5} es exclusiva del agente y requiere justificación y autoría. G5 dispara aviso de revisión inmediata. |
| RN-02 | El edil gestiona solicitudes, ventanas y propuestas de servicios únicamente para comunidades donde está autorizado. |
| RN-03 | La necesidad se evalúa por **detalle de producto/kit**, no por barrio completo. |
| RN-04 | `pendiente_real = max(0, requerido − entregado_confirmado_total)`. |
| RN-05 | `aporta_ahora = max(0, pendiente_real − compromisos_directos_activos − reservas_bancarias_activas)`; no confundir con saldo real. |
| RN-06 | Capacidad de ventana, reservas de stock y cantidades pendientes se validan atómicamente en el servidor. |
| RN-07 | El donante es responsable del transporte; el agente coordina horarios del banco pero no se presume transportador. |
| RN-08 | Un cambio de horario propuesto por el agente requiere aceptación del donante antes de autorizar traslado. |
| RN-09 | Aporte espontáneo exige edil verificado; no crea necesidad ni puntaje, y no altera inventario bancario. |
| RN-10 | Prometido, recibido, disponible, reservado, despachado, entregado e incidencia son cantidades/estados distintos. |
| RN-11 | Una recepción parcial conserva diferencia e historial; **no** la vuelve automáticamente a sumar a stock ni libera cantidades incorrectas. |
| RN-12 | Cancelar/rechazar antes de entregar libera cupo y compromisos activos sin borrar la trazabilidad. |
| RN-13 | No publicar datos individuales de beneficiarios, domicilios particulares ni contactos privados de ediles. |
| RN-14 | Los puntos de servicio requieren validación administrativa para su publicación; solo puntos publicados se ven sin sesión. |
| RN-15 | La selección de hasta diez organizaciones queda a cargo del agente y exige identidad, aportes confirmados, período y consentimiento. |
| RN-16 | No crear página independiente de aliados; mostrarlos **en Inicio**, con patrocinador principal destacado solo si cumple requisitos. |
| RN-17 | El top 10 no altera asignación, prioridad, evaluación ni acceso a servicios comunitarios. |
| RN-18 | En producción ningún usuario selecciona libremente un rol para adquirir permisos. Toda operación sensible comprueba autorización backend. |
| RN-19 | Los cambios relevantes en solicitudes requieren nueva evaluación sin perder fecha original ni auditoría. |
| RN-20 | Medicamentos y donaciones de dinero no forman parte de la demo del mockup. |

**Puntaje de la interfaz:** `P = 0,50·G + 0,30·A + 0,20·T`, donde `A` y `T` aparecen normalizados de manera **ilustrativa** en el HTML. No aprobar estos umbrales como política real sin validación participativa. La publicación automática tras evaluar es otro comportamiento de simulación pendiente de decisión de producto.

## 6. Roles, acciones y autorización

| Recurso/acción | Anónimo | Donante | Edil | Agente | Admin |
|---|---:|---:|---:|---:|---:|
| Portada, mapa, servicios publicados, aliados autorizados | ✓ | ✓ | ✓ | ✓ | ✓ |
| Consultar necesidades públicas / comprometer donación | — | ✓ | — | — | — |
| Ofrecer a edil y aceptar transporte voluntario | — | ✓ | — | — | — |
| Registrar necesidades / ventanas comunitarias | — | — | ✓* | — | — |
| Aceptar ofrecimientos / confirmar recepción comunitaria | — | — | ✓* | — | — |
| Evaluar G, gestionar banco y asignar inventario | — | — | — | ✓ | — |
| Gestionar y publicar reconocimientos Top 10 | — | — | — | ✓ | — |
| Proponer puntos comunitarios | — | — | ✓* | — | ✓ |
| Publicar / suspender puntos | — | — | — | — | ✓ |
| Verificar representantes, catálogo y auditoría administrativa | — | — | — | — | ✓ |

`✓*` = únicamente comunidades autorizadas. **Matriz objetivo propuesta:** la autorización del backend es requisito de la demo funcional, no una propiedad que el selector de roles de HTML ya garantice. El administrador no recibe facultad automática de modificar evaluaciones o simular recepciones.

## 7. Contrato de información mínimo para la demo

Se recomienda un modelo relacional. Los identificadores de ejemplo no son claves definitivas. El equipo puede escoger su stack, siempre que mantenga integridad, historial y autorizaciones.

| Entidad | Campos críticos / relaciones |
|---|---|
| `usuarios`, `roles`, `usuarios_roles` | Identidad, estado, sesión, permisos |
| `comunidades`, `ediles_comunidades` | Comunidad, edil verificado y alcance autorizado |
| `categorias`, `productos`, `presentaciones`, `kits`, `kits_componentes` | Catálogo consistente y unidades compatibles |
| `solicitudes`, `detalle_solicitud` | Comunidad, fecha, producto, requerido, confirmado, estado y justificación |
| `evaluaciones` | Detalle, grado G, agente, motivo, fecha y versión |
| `ventanas_disponibilidad`, `citas` | Dueño (edil/banco), fecha, inicio/fin, capacidad, confirmación y cambios |
| `donaciones`, `detalle_donacion` | Modalidad, donante, producto, cantidad, solicitud opcional, edil destino opcional |
| `inventario_lotes`, `movimientos_inventario`, `reservas` | Stock verificable, salida, devolución, vencimiento/aptitud si aplica |
| `asignaciones`, `transportes`, `entregas`, `recepciones` | Propuesta de transportador, aceptación, liberación, entrega, prueba y parciales |
| `puntos_servicio`, `horarios_servicio`, `revisiones_punto` | Datos públicos, ubicación, operador, aprobación, vigencia y responsable |
| `organizaciones_juridicas`, `aportes_confirmados`, `consentimientos`, `periodos_ranking`, `reconocimientos` | Elegibilidad, criterio trazable, clasificación y publicación |
| `eventos_auditoria` | Actor, entidad, acción, fecha, antes/después cuando aplique, motivo y correlación |

**Restricciones estructurales:** el aporte a edil sin solicitud admite `detalle_solicitud_id` nulo; los datos sensibles del operador y beneficiarios no están expuestos en endpoints públicos; la existencia de dos perfiles comunitarios no autoriza al edil a gestionar ambos por defecto. Usar ID de operación e idempotencia para reintentos de confirmación y reservas.

## 8. Diferenciar la simulación del objetivo funcional

| En el HTML final (observable) | Para una demo funcional posterior (debe construirse) |
|---|---|
| `s=initial()` y arreglos JS en memoria | Backend y base de datos con datos persistentes; fixtures reiniciables |
| Selección abierta de roles y ediles | Sesiones reales de prueba y autorización por usuario/comunidad; usuarios precargados para cada rol |
| `today='2026-11-20'` fijo | Fechas dinámicas en zona de despliegue definida, validación de vencimientos |
| `go()` cambia vista en JS | URLs/rutas reales, enlaces profundos, navegación atrás/adelante y recuperación de sesión |
| Filtrado/selección local de necesidades y servicios | Consultas y filtros con paginación, acceso público limitado y estados de carga/vacío/error |
| `timeSlots()` reserva usando arreglos locales | Reserva transaccional de cupo y control de concurrencia |
| `stock` y saldos calculados en navegador | Movimientos transaccionales en servidor, compensaciones y conciliación de incidencias |
| `audit` es un arreglo por sesión | Eventos persistentes, actor autenticado y protección frente a alteración |
| Mapa de posiciones esquemáticas | Mapa cartográfico real **opcional para la demo**, con fichas verificadas y estado de publicación |
| Organizaciones y cantidades de ejemplo | Entidades legales ficticias de demo, consentimiento registrado y recálculo auditable del top |
| Botón Google deshabilitado | Elegir proveedor o conservar login de pruebas; no fingir autenticación federada |
| Catálogo ilustrativo principalmente de lectura | Altas/ediciones y validación de unidades si se incluye en la demo objetivo |

## 9. Alcance recomendado del desarrollo

### P0 — Demo funcional mínima y demostrable

- [ ] Proyecto ejecutable, configuración reproducible, fixtures ficticios y roles de prueba aislados.
- [ ] Navbar superior responsive, portada pública, servicios, bloque de aliados y carruseles fieles al HTML.
- [ ] Sesión y permisos de Donante, Edil, Agente y Administrador, con rutas protegidas.
- [ ] CRUD de solicitudes por comunidad y evaluación G con justificación e historial.
- [ ] Ventanas de edil/banco, citas, cupos y aprobación de horarios.
- [ ] Tres modalidades de donación, seguimiento, aceptación/rechazo y cancelaciones válidas.
- [ ] Inventario del banco, verificaciones, reservas, asignaciones y transporte donante → comunidad.
- [ ] Confirmación de recepción completa/parcial, reconciliación simple y auditoría persistente.
- [ ] Registro y moderación de puntos públicos, con directorio consultable anónimamente.
- [ ] Ranking autorizado de hasta diez personas jurídicas y destacado de la principal en Inicio.
- [ ] Pruebas de permisos, cantidades, cupos y recorridos E2E.

### P1 — Endurecimiento de la demo antes de ensayos externos

- [ ] Notificaciones in-app persistentes y reprogramación completa por ambas partes.
- [ ] Gestión de incidencias parciales con resolución formal, reversos y devoluciones.
- [ ] Catálogo editable completo, presentaciones, kits y lotes/fechas de vencimiento.
- [ ] Mejoras de carga, búsqueda, paginación y exportación de auditoría.
- [ ] Auditoría de consentimientos y vigencia periódica de puntos comunitarios.

### Fuera del alcance inicial

Pagos y dinero; medicamentos; entrega logística hecha por la plataforma; motores de optimización; promesas de cupos reales de comida; geolocalización continua; métricas de impacto social deducidas automáticamente del ranking.

## 10. Escenarios de aceptación de la demo (AC)

| ID | Escenario | Resultado verificable |
|---|---|---|
| AC-01 | Abrir Inicio sin sesión | Hero, bloque de aliados, proceso, rutas, servicios y preguntas visibles; acceso opcional |
| AC-02 | Navegar como cada rol | Navbar **superior**, enlaces propios y ruta activa; sin menú lateral |
| AC-03 | Usar carruseles en público, donante, edil y admin | Contador, flechas y puntos funcionales; selector alineado al pie izquierdo; sin autoplay |
| AC-04 | Ver Top 10 | El #1 aparece primero; solo jurídicas verificadas/consentidas; no hay página aparte |
| AC-05 | Crear punto como edil | Queda pendiente y no aparece públicamente hasta validar administración |
| AC-06 | Suspender punto como admin | Se elimina del listado/mapa público, pero conserva historial |
| AC-07 | Filtrar necesidades y seleccionar fila | El detalle cambia sin crear compromiso; muestra saldo y próxima ventana |
| AC-08 | Crear solicitud de dos productos | Dos detalles vinculados, sin G; advertencia por duplicados |
| AC-09 | Evaluar con G5 sin motivo | Rechazo; con motivo registra evaluación y aviso crítico |
| AC-10 | Solicitar misma ventana con cupo 1 en dos sesiones | Solo una reserva activa se confirma; la otra recibe aviso válido |
| AC-11 | Directa de 10 unidades, recibir 7 | Se descuentan 7 confirmadas; 3 quedan en incidencia y pendientes de resolver |
| AC-12 | Aporte espontáneo a edil | No crea solicitud, G ni inventario bancario; requiere aceptación antes de transportar |
| AC-13 | Banco: prometer 12, recibir 9 | Solo 9 aptas aumentan inventario; 3 quedan en incidencia |
| AC-14 | Salida de banco sin transportador aceptado | Bloqueada; al aceptar y autorizar, cambia estado de despacho |
| AC-15 | Edil recibe desde banco | Se cierra entrega y descuenta saldo exactamente una vez |
| AC-16 | Donante propone hora que agente cambia | No se habilita traslado hasta aceptar alternativa |
| AC-17 | Usuario no autorizado modifica otra comunidad o grado G | Backend deniega, incluso por petición directa |
| AC-18 | Reabrir navegador después de un cambio | Datos persisten, sesión sigue reglas definidas y no se duplican efectos |
| AC-19 | Intentar confirmar recepción dos veces | Segunda operación es idempotente o rechazada sin duplicar movimientos |
| AC-20 | Revisar en 1440, 1024, 768, 390 y 320 px | Sin desbordamientos de página; navbar desplazable; carrusel y selector legibles |

Los criterios anteriores son el **objetivo para la futura demo**, no pruebas aprobadas hoy. De cada AC debe guardarse evidencia automática o manual, versión probada, usuario y resultado.

## 11. Riesgos, decisiones abiertas y requisitos no inferibles del HTML

1. **Operación física:** sedes de banco, responsables de recepción, condiciones de transporte y pérdida/daño requieren definición organizativa.
2. **Seguridad:** autenticación, verificación real de ediles, autorización de transportadores, consentimiento y conservación de evidencias no están resueltos por el HTML.
3. **Prioridad:** el peso 50/30/20 y normalización A/T no han sido validados; no tratar la cifra como política definitiva.
4. **Publicación automática:** el HTML publica una necesidad al guardar su evaluación; decidir si requiere paso separado de aprobación.
5. **Top 10:** aclarar período, criterio de empate, definición de «aporte», qué se hará si se retira consentimiento y frecuencia de actualización.
6. **Mapa:** definir proveedor y costos si se decide usar cartografía real; no reemplazar el mapa esquemático por datos inventados de instituciones.
7. **Datos de beneficiarios:** recolectar agregados; definir tratamiento de contacto y evidencia privada.
8. **Experiencia de demo:** decidir entre autenticación local de usuarios precargados o proveedor federado; Google no está integrado.
9. **Fechas:** las ventanas de muestra son de noviembre de 2026; fixtures de demo futura deben usar fechas relativas o un reloj de prueba controlado.

## 12. Orden recomendado para trabajo con agentes

1. **Congelar referencia**: guardar el HTML suministrado sin cambios, comparar hash, capturar pantallas base de escritorio y móvil.
2. **Construir shell**: rutas públicas/protegidas, navbar superior, layout, tokens, componentes de carrusel y selector de necesidades.
3. **Modelar entidades y estados**: migrations, fixtures y transacciones con pruebas de dominio.
4. **Implementar roles en vertical**: Edil registra → Agente evalúa → Donante compromete → Edil confirma; después banco/transportador.
5. **Completar inicio público**: lugares y Top 10 con moderación y auditoría real.
6. **Cerrar controles**: permisos, concurrencia, idempotencia, validaciones y estados de error.
7. **Validación visual/E2E**: comprobar AC-01 a AC-20 comparando con HTML a anchos definidos, documentar diferencias justificadas.

**Definición de terminado:** una persona puede seguir las tres rutas de donación en cuentas de prueba distintas y observar cambios coherentes, persistentes y auditables; el visitante anónimo encuentra servicios publicados y reconoce al principal donante autorizado en Inicio; la navegación y componentes compartidos reproducen el diseño final sin funciones simuladas presentadas como reales.
