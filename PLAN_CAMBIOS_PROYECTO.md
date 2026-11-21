# Plan de cambios y evolución del proyecto Alimenta

Este documento consolida el diagnóstico técnico y documental del repositorio **Alimenta** y plantea los cambios necesarios para:

1. Evolucionar el diseño actual hacia un **prototipo funcional utilizable**.
2. **Aplicar de forma verificable** las patentes, tecnologías universitarias y bases de datos recopiladas en la solución.
3. Cubrir íntegramente los **6 componentes (100 puntos)** definidos en la rúbrica de evaluación ([`docs/Rubrica_requerimientos.jpeg`](docs/Rubrica_requerimientos.jpeg)).

### Documentación base analizada

* Rúbrica de evaluación: [`docs/Rubrica_requerimientos.jpeg`](docs/Rubrica_requerimientos.jpeg)
* Definición inicial y límites éticos: [`docs/product-brief.md`](docs/product-brief.md)
* Propuesta funcional v2.0: [`docs/propuesta.md`](docs/propuesta.md)
* Diseño de pantallas, flujos y reglas (`P01`–`P23`, `F01`–`F05`, `R01`–`R12`): [`docs/diseño/Propuesta_mockup_Alimenta.md`](docs/dise%C3%B1o/Propuesta_mockup_Alimenta.md)
* Prototipo HTML y paleta institucional: [`docs/diseño/Mockup_interactivo_Alimenta.html`](docs/dise%C3%B1o/Mockup_interactivo_Alimenta.html) y [`docs/diseño/alimenta_paleta_colores.json`](docs/dise%C3%B1o/alimenta_paleta_colores.json)
* Descargador reproducible de datos de Manizales (`ab8a-uwf7`, `cod_mpio = 17001`): [`Bases de datos/download_manizales_data.py`](Bases%20de%20datos/download_manizales_data.py)
* Acervo y análisis de aplicabilidad de patentes: [`Documentos-prototipos/bases-datos.md`](Documentos-prototipos/bases-datos.md) y [`Documentos-prototipos/aplicabilidad-patentes-alimenta.md`](Documentos-prototipos/aplicabilidad-patentes-alimenta.md)

---

## 1. Cambios para que el proyecto sea funcional y utilizable (Componente 2 — 25 pts)

Actualmente [`docs/diseño/Mockup_interactivo_Alimenta.html`](docs/dise%C3%B1o/Mockup_interactivo_Alimenta.html) es una demostración estática con datos ficticios en memoria, sin persistencia ni control real de concurrencia. Para que Alimenta pueda operarse y demostrarse como prototipo funcional se requiere:

### 1.1. Backend ligero y persistencia real
* **Implementar el esquema de datos** de [`docs/propuesta.md` §11](docs/propuesta.md#L252-L275) en una base de datos relacional (p. ej., SQLite para piloto rápido o PostgreSQL): `usuarios`, `comunidades`, `ediles_comunidades`, `categorias`/`subcategorias`/`productos`/`presentaciones`, `kits`/`kits_componentes`, `solicitudes`/`detalle_solicitud`, `evaluaciones`, `donaciones`/`detalle_donacion`, `donaciones_dirigidas`, `ventanas_disponibilidad`, `citas_entrega`, `transportes`, `inventario_lotes`/`movimientos_inventario`, `asignaciones`, `entregas`, `recepciones_aportes_dirigidos` y `auditoria`.
* **Hacer cumplir en servidor las reglas `R01`–`R12`** ([`Propuesta_mockup_Alimenta.md` §6](docs/dise%C3%B1o/Propuesta_mockup_Alimenta.md#L134-L150)):
  * Reserva atómica de cupos en ventanas horarias para impedir sobreagendamiento concurrente (`R04`).
  * Calificación de urgencia `G` (1–5) exclusiva del **Agente** con justificación obligatoria (`R01`) y alerta inmediata para `G = 5`.
  * Separación estricta de estados en banco: *comprometida ≠ recibida/verificada ≠ disponible ≠ reservada ≠ despachada ≠ entregada* (`R06`).
  * Aportes espontáneos dirigidos a edil con `detalle_solicitud_id = NULL`, sin alterar saldos de necesidades ni stock bancario (`R07`), restringidos a ediles verificados (`R08`).
  * Manejo de entregas parciales e incidencias separadas (`R10`) y auditoría inmutable (`R09`).
  * Privacidad estricta: nunca exponer domicilios ni listas de beneficiarios en vistas públicas (`R11`), y mantener pagos/medicamentos fuera del MVP (`R12`).
* **Autenticación y permisos reales por rol:** Reemplazar el selector libre de roles del mockup por sesiones reales diferenciadas para *Donante*, *Edil*, *Agente* y *Administrador*.

### 1.2. Integración de la paleta institucional y accesibilidad en la interfaz
* Aplicar los tokens de [`docs/diseño/alimenta_paleta_colores.json`](docs/dise%C3%B1o/alimenta_paleta_colores.json) en toda la interfaz (`#94B43B`, `#466B3F`, `#A61C31`, `#76232F`, `#F8F9F6`, `#26342A`).
* Cumplir su nota explícita de accesibilidad: evitar texto blanco normal sobre `#94B43B` (usar texto oscuro `#26342A`), reservar texto blanco para `#466B3F` y acompañar siempre los estados con texto/iconos además del color.

---

## 2. Integración concreta de las patentes y datos en la solución (Componente 3 — 15 pts)

Hoy las patentes están documentadas en `Documentos-prototipos/` y el script de Manizales está aislado en `Bases de datos/`. Para pasar de *citar antecedentes* a **aplicarlos de forma demostrable** dentro de la solución, se proponen cuatro integraciones específicas:

| Patente / Recurso aplicado | Cambio concreto a implementar | Impacto en el prototipo y documentos |
| --- | --- | --- |
| **Patentes físicas UNAL:** **MUUPA** (`NC2021/0010846`), **Muleta axilar plegable** y **Sistema *Anatom*** | Incorporar la subcategoría **"Catálogo de Ayudas Técnicas UNAL"** dentro de `Salud y asistencia → dispositivos de apoyo` y `kits`. Permite que ediles soliciten lotes para adecuar albergues/comedores (MUUPA) o apoyar adultos mayores y cuidadores (muletas, cojines *Anatom*), y que padrinos/donantes los financien o donen. | Actualización de [`docs/propuesta.md` §6](docs/propuesta.md#L123-L141), datos semilla de la BD y pantallas `P04`, `P07`, `P13` y `P22`. |
| **Multi-agente con equidad** ([`CureusJournals_2103020260923-125190-35nv82.pdf`](Documentos-prototipos/CureusJournals_2103020260923-125190-35nv82.pdf)) + **US11393577B2** / **US8494885B2** + **Dataset Manizales (`ab8a-uwf7`)** | Conectar estadísticas territoriales agregadas de Manizales (obtenidas con [`download_manizales_data.py`](Bases%20de%20datos/download_manizales_data.py), sin exponer hogares individuales) como contexto de equidad junto a `P = 0.50G + 0.30A + 0.20T`. Añadir en `P21` una **sugerencia de reparto parcial bajo escasez** cuando el stock del banco no alcance para el 100 % de la demanda, preservando la decisión final humana (`R01`). | Panel del Agente (`P18` y `P21`) y módulo de cálculo orientativo de equidad y reparto parcial. |
| **ReliefMatcher.AI** ([`IJIRT210234_PAPER.pdf`](Documentos-prototipos/IJIRT210234_PAPER.pdf)) + **US11037098B2** | Implementar un **recomendador de emparejamiento** para donantes: según el producto y cantidad ofrecidos, sugerir necesidades compatibles con ventanas horarias abiertas (`P14`). En ofertas espontáneas (`P09`), ofrecer alternativas si el edil elegido no tiene solicitud abierta, sin crear necesidades artificiales (`R07`). | Panel del Donante (`P03`, `P04`, `P09`), resolviendo además la brecha de *verificación en terreno* de ReliefMatcher.AI mediante ediles/JAC. |
| **WO2026151479A1** + **US20200133474A1** (Accesibilidad) y **WO2021247792A1** / **CN102708284A** (Psicosocial) | 1) Añadir un **modo accesible** en la UI (botones táctiles amplios, lectura simplificada, alto contraste y dictado por voz nativo del navegador).<br>2) Incluir un flujo separado de **derivación a Primeros Auxilios Psicológicos (PAP) UNAL** para ediles o cuidadores, sin almacenar diagnósticos ni datos clínicos en la BD (`R11`). | Capa transversal de UX (`P01`–`P16`) y sección/botón dedicado de enrutamiento a PAP UNAL. |

> **Exclusiones que deben mantenerse:** No incorporar patentes de pagos automáticos (`US11227325B1`, `US20180276710A1`), comando táctico de incidentes (`US12299557B1`, `US12024201B2`, `US9143535B1`, `US11395124B2`) ni hardware biomédico especializado (`CO7290157A1`, `CO2022004788A1`), ya que contradicen el alcance del MVP y las reglas `R11`–`R12`.

---

## 3. Cambios documentales para cubrir el 100 % de la rúbrica (Componentes 1, 4, 5 y 6 — 60 pts)

Al cruzar el estado actual del repositorio con [`docs/Rubrica_requerimientos.jpeg`](docs/Rubrica_requerimientos.jpeg), se identifican cuatro vacíos documentales prioritarios:

### 3.1. Problema y Vertical 6 (Componente 1 — 20 pts)
* **Brecha actual:** [`docs/product-brief.md`](docs/product-brief.md) y [`docs/propuesta.md`](docs/propuesta.md) describen la coordinación alimentaria general, pero aún no explicitan la conexión con la **Vertical 6** (adultos mayores, personas con discapacidad, cuidadores, albergues y soporte psicosocial en Manizales) ni incorporan evidencia cuantitativa agregada del dataset `ab8a-uwf7`.
* **Cambio sugerido:** Agregar una sección explícita de *Contextualización territorial (Manizales) y alineación con Vertical 6* con cifras agregadas reproducibles desde `Bases de datos/download_manizales_data.py`.

### 3.2. Plan de 30 a 90 días (Componente 4 — 15 pts) — *faltante*
* **Brecha actual:** No existe un cronograma de 30, 60 y 90 días; [`docs/propuesta.md` §13](docs/propuesta.md#L291-L307) solo enumera una Fase 1 y Fase 2 genéricas.
* **Cambio sugerido:** Crear `docs/plan-30-60-90.md` (o sección dedicada) especificando:
  * **Días 1–30:** Cierre de backend MVP + BD relacional, carga del *Catálogo de Ayudas Técnicas UNAL*, modo accesible y pruebas internas de los 12 criterios de aceptación ([`Propuesta_mockup_Alimenta.md` §8](docs/dise%C3%B1o/Propuesta_mockup_Alimenta.md#L165-L178)).
  * **Días 31–60:** Piloto controlado en campo con 2–3 ediles/JAC de Manizales, 1 punto de acopio/banco y donantes voluntarios, midiendo tiempos de cita, entregas parciales y usabilidad.
  * **Días 61–90:** Ajustes de priorización con equidad (`P` + datos Manizales), validación formal de ruta PAP UNAL y preparación de escalamiento a más comunidades.
  * Incluir explícitamente **hitos, entregables, responsables, recursos y mecanismo de validación**.

### 3.3. Viabilidad y Aliados (Componente 5 — 15 pts)
* **Brecha actual:** Solo existe un resumen general de viabilidad en [`Propuesta_mockup_Alimenta.md` §2](docs/dise%C3%B1o/Propuesta_mockup_Alimenta.md#L20-L35); faltan mapa de aliados/padrinos, estimación básica de recursos y matriz operativa de riesgos.
* **Cambio sugerido:** Documentar:
  * **Aliados institucionales y técnicos:** UNAL Sede Manizales (VRI para transferencia de MUUPA/muleta/gafas, programa PAP UNAL para soporte psicosocial), JAC y ediles de Manizales, y potencial articulación con UNIMINUTO (*Sistema ECOS* para lengua de señas).
  * **Posibles padrinos y patrocinadores:** Supermercados y proveedores locales, bancos de alimentos, fundaciones empresariales y entidades territoriales de gestión del riesgo.
  * **Matriz de riesgos operativos y mitigación:** Ausencia de transportadores voluntarios, manejo de perecederos, custodia ética en aportes dirigidos a ediles y brecha digital.

### 3.4. Impactos Esperados e Indicadores Verificables (Componente 6 — 10 pts)
* **Brecha actual:** El repositorio evita correctamente afirmaciones de impacto sin evidencia, pero la rúbrica evalúa **beneficiarios, resultados esperados, magnitud estimada e indicadores verificables**.
* **Cambio sugerido:** Definir una tabla de **metas piloto verificables (KPIs)** sin confundirlas con resultados ya logrados:
  * Porcentaje de compromisos que llegan a recepción confirmada (`entregado / comprometido`).
  * Tiempo promedio de atención por grado de urgencia (`G = 4–5` vs. `G = 1–3`).
  * Número de comunidades/ediles activos y hogares beneficiados (en cifras agregadas) en el piloto de 90 días.
  * Lotes de ayudas técnicas UNAL (MUUPA / muletas / kits cuidadores) gestionados e instalados en puntos comunitarios.
  * Derivaciones efectivas realizadas hacia la ruta PAP UNAL.

---

## 4. Ajustes de coherencia y gobernanza del repositorio

1. **Actualizar [`README.md`](README.md):** Incorporar en la tabla de estructura del repositorio las carpetas y archivos ya existentes (`docs/propuesta.md`, `docs/diseño/`, `docs/Rubrica_requerimientos.jpeg`, `Bases de datos/`, `Documentos-prototipos/` y `tests/`).
2. **Actualizar la transición de fase en [`CONTRIBUTING.md`](CONTRIBUTING.md):** Actualmente prohíbe elegir pila tecnológica porque el proyecto estaba en fase exclusiva de documentación. Antes de iniciar el código del MVP, se debe formalizar la aprobación del paso a fase de implementación y fijar el stack técnico acordado.
3. **Resguardo de Propiedad Intelectual (*Freedom to Operate*):** Mantener documentado que, bajo la **Decisión 486 de la Comunidad Andina**, las patentes extranjeras de software analizadas no tienen efecto restrictivo en Colombia, y que la integración de patentes físicas de la UNAL y UNIMINUTO se realiza exclusivamente como canal de donación/articulación institucional respetando la titularidad ante la SIC.

---

## 5. Orden de ejecución recomendado

1. **Etapa 1 — Cierre documental para rúbrica:** Actualizar `docs/propuesta.md`, `docs/product-brief.md` y `README.md`, y crear el paquete de **Plan 30–60–90 días, Viabilidad/Aliados e Impactos/KPIs**.
2. **Etapa 2 — Transición a MVP utilizable:** Actualizar `CONTRIBUTING.md` con el stack elegido y construir el backend + base de datos relacional cumpliendo `R01`–`R12`.
3. **Etapa 3 — Integración diferenciadora (patentes + datos):** Conectar los 4 módulos derivados de las patentes (Catálogo UNAL, equidad con `ab8a-uwf7` + reparto parcial sugerido, emparejamiento donante–necesidad y modo accesible + ruta PAP UNAL) con la paleta institucional aplicada.
