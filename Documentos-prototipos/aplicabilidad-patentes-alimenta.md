# Análisis de aplicabilidad de patentes y antecedentes para Alimenta

Este documento cruza sistemáticamente el acervo de patentes, tecnologías universitarias y literatura científica recopilado en [`bases-datos.md`](bases-datos.md) con el estado actual del proyecto **Alimenta**, tomando como línea base:

* El marco de alcance y restricciones éticas en [`docs/product-brief.md`](../docs/product-brief.md).
* La propuesta funcional versión 2.0 en [`docs/propuesta.md`](../docs/propuesta.md) (roles, tres recorridos de donación, fórmula de priorización, catálogo de cuatro niveles, agendas/transporte y modelo de datos).
* El diseño de pantallas (`P01`–`P23`), recorridos operativos (`F01`–`F05`) y reglas de negocio (`R01`–`R12`) en [`docs/diseño/Propuesta_mockup_Alimenta.md`](../docs/dise%C3%B1o/Propuesta_mockup_Alimenta.md) y [`docs/diseño/Mockup_interactivo_Alimenta.html`](../docs/dise%C3%B1o/Mockup_interactivo_Alimenta.html).
* El corte de datos territoriales de Manizales (`cod_mpio = 17001`, dataset Socrata `ab8a-uwf7`) implementado en [`Bases de datos/download_manizales_data.py`](../Bases%20de%20datos/download_manizales_data.py).

> **Límite de alcance:** Este análisis traduce las ideas y patrones de cada antecedente en **insumos funcionales y de diseño** compatibles con Alimenta. No selecciona una pila tecnológica, no altera las exclusiones del MVP (sin pagos, sin medicamentos, sin datos individuales de beneficiarios) y mantiene el principio rector de decisión humana (*Human-in-the-Loop*): la plataforma recomienda y audita; **el agente evalúa y asigna, el donante transporta y el edil confirma la recepción**.

---

## 1. Matriz maestra de aplicabilidad

Clasificación de los antecedentes recopilados según su grado de pertinencia frente a la problemática actual de Alimenta:

| Nivel | Referencia | Archivo / Enlace | Fase recomendada | Módulos / Pantallas / Reglas en Alimenta |
| --- | --- | --- | --- | --- |
| **Alta (Núcleo)** | Arquitectura multi-agente con equidad (*Cureus Journals*, 2026) | [`CureusJournals_2103020260923-125190-35nv82.pdf`](CureusJournals_2103020260923-125190-35nv82.pdf) | MVP (lógica de apoyo) / Fase 2 | Priorización `P = 0.50G + 0.30A + 0.20T`, `P17`, `P18`, `P21`, `R01`, cruce con datos Manizales (`ab8a-uwf7`) |
| **Alta (Núcleo)** | **US11393577B2** — ML + optimización combinatoria bajo escasez | [`US11393577B2.pdf`](US11393577B2.pdf) | MVP (sugerencias) / Fase 2 | Salida del banco (`F04`), entregas parciales (`F05`), `P19`, `P21`, `R06`, `R10` |
| **Alta (Núcleo)** | **US8494885B2** — Modelado de distribución en desastres | [`US8494885B2.pdf`](US8494885B2.pdf) | MVP (heurística) / Fase 2 | Reparto de inventario escaso entre comunidades (`P21`, `asignaciones`) |
| **Alta (Núcleo)** | **ReliefMatcher.AI** (*IJIRT*) | [`IJIRT210234_PAPER.pdf`](IJIRT210234_PAPER.pdf) | MVP | Emparejamiento donante–necesidad (`F01`, `F02`, `P03`–`P06`, `P09`), verificación vía ediles/JAC |
| **Alta (Núcleo)** | **US11037098B2** — Recomendación de destino para donaciones con ML | [`US11037098B2.pdf`](US11037098B2.pdf) | MVP (reglas) / Fase 2 (ML) | Donación directa (`F01`) y oferta espontánea dirigida a edil (`F02`, `P09`, `P15`, `R07`, `R08`) |
| **Alta (Núcleo)** | **WO2023012530A1** — Plataforma trazable de gestión de donaciones | [`WO2023012530A1.pdf`](WO2023012530A1.pdf) | MVP | Ciclos de vida (`F01`–`F05`), trazabilidad, paneles por rol, `P08`, `P22`, `P23`, `R06`, `R09` |
| **Alta (Núcleo)** | **US20050021353A1** — Validación de receptores y liquidación trazable | [`US20050021353A1.pdf`](US20050021353A1.pdf) | MVP | Verificación de ediles/JAC (`P22`, `ediles_comunidades`), auditoría (`P23`, `R08`, `R09`) |
| **Alta (Vertical 6)** | **WO2026151479A1** — Orquestación IA *accessibility-first* | [`WO2026151479A1.pdf`](WO2026151479A1.pdf) | MVP (patrones UX) / Fase 2 (IA) | Capa de accesibilidad en `P01`–`P16`, control por voz y lectura simplificada |
| **Alta (Vertical 6)** | **US20200133474A1** — Interfaz táctil adaptativa | [`US20200133474A1.pdf`](US20200133474A1.pdf) | MVP (diseño responsive) / Fase 2 | Selector de horarios y formularios accesibles para adultos mayores / limitación motora (`P06`, `P09`, `P13`–`P16`) |
| **Alta (Vertical 6)** | **WO2021247792A1** y **CN102708284A** — Triaje y derivación en salud mental | [`WO2021247792A1.pdf`](WO2021247792A1.pdf), [`CN102708284A.pdf`](CN102708284A.pdf) | Fase 1B / Fase 2 | Módulo opcional de enrutamiento hacia **Primeros Auxilios Psicológicos UNAL** bajo `R11` |
| **Alta (Catálogo)** | **MUUPA** (`NC2021/0010846`), **Muleta axilar plegable** y **Sistema Anatom** (UNAL) | [Ver §6 en `bases-datos.md`](bases-datos.md#6-patentes-y-tecnologías-de-la-universidad-nacional-de-colombia-unal) | MVP (catálogo) | Catálogo de 4 niveles: `Salud y asistencia → dispositivos de apoyo` y kits (`P04`, `P07`, `P13`, `P22`) |
| **Media (Fase 2)** | **CN109523314B** — Control de inventarios y predicción de agotamiento | [`CN109523314B.pdf`](CN109523314B.pdf) | Fase 2 | Inventario bancario (`P19`, `inventario_lotes`), alertas de vencimiento y reposición |
| **Media (Fase 2)** | **US20170236450A1** y **Sistema ECOS** (UNIMINUTO, SIC) | [`US20170236450A1.pdf`](US20170236450A1.pdf) / [UNIMINUTO](https://www.uniminuto.edu/noticias/nueva-patente-de-invencion-otorgada-uniminuto-sistema-ecos) | Fase 2 / Alianza | Traducción voz ↔ lengua de señas en canales de orientación comunitaria |
| **Media (Fase 2)** | **CN110852587A** y **US20200100084A1** — Albergues y reportes comunitarios | [`CN110852587A.pdf`](CN110852587A.pdf), [`US20200100084A1.pdf`](US20200100084A1.pdf) | Fase 2 | Priorización de albergues y mapas agregados sin domicilios privados (`R11`) |
| **Media (Catálogo)** | **Centaurum**, **Gafas con sensores** (UNAL Manizales) y **Tabla espinal** (UNIMINUTO) | [Ver §6–§7 en `bases-datos.md`](bases-datos.md#6-patentes-y-tecnologías-de-la-universidad-nacional-de-colombia-unal) | Fase 2 / Convenio | Ampliación del catálogo especializado de ayudas técnicas y respuesta a emergencias |
| **Baja / Referencia** | **JP7834399B1**, **US20050251485A1**, **WO2017125785A1**, **Exp. SIC 13244024** | [Google Patents](https://patents.google.com/patent/JP7834399B1/en), [`US20050251485A1.pdf`](US20050251485A1.pdf), [`WO2017125785A1.pdf`](WO2017125785A1.pdf) | Solo referencia | Antecedentes históricos de *matching* o hardware educativo/Braille externo |
| **Excluidas del MVP** | **US11227325B1**, **US20180276710A1** | [`US11227325B1.pdf`](US11227325B1.pdf), [`US20180276710A1.pdf`](US20180276710A1.pdf) | Excluidas (`R12`) | Implican pagos o intermediación financiera, fuera del alcance del MVP |
| **Excluidas del MVP** | **US12299557B1**, **US12024201B2**, **US9143535B1**, **US11395124B2** | [`US12299557B1.pdf`](US12299557B1.pdf), [`US12024201B2.pdf`](US12024201B2.pdf), [`US9143535B1.pdf`](US9143535B1.pdf), [`US11395124B2.pdf`](US11395124B2.pdf) | Fuera de alcance MVP | Comando de incidentes, sensores de infraestructura y evacuaciones tácticas |
| **Excluidas del MVP** | **CO7290157A1**, **CO2022004788A1** | [Google Patents CO7290157A1](https://patents.google.com/patent/CO7290157A1/es), [CO2022004788A1](https://patents.google.com/patent/CO2022004788A1/es) | Fuera de alcance | Hardware biomédico/robótico especializado no relacionado con gestión de donaciones |

---

## 2. Bloque A — Aplicabilidad directa al núcleo operativo de Alimenta

El corazón de Alimenta ([`docs/propuesta.md`](../docs/propuesta.md)) consiste en coordinar **tres recorridos de donación** (`F01` directa a necesidad, `F02` espontánea a edil y `F03`/`F04` ingreso y salida del banco) con **separación estricta de roles**, **citas atómicas por ventana horaria**, **entregas parciales conciliables** y **priorización auditable**.

### 2.1. Priorización justa y asistente de decisión para el Agente
* **Antecedentes aplicables:**
  * **Arquitectura multi-agente con equidad** ([`CureusJournals_2103020260923-125190-35nv82.pdf`](CureusJournals_2103020260923-125190-35nv82.pdf)) *(literatura abierta, sin restricciones de PI)*.
  * **US11393577B2** ([`US11393577B2.pdf`](US11393577B2.pdf)) y **US8494885B2** ([`US8494885B2.pdf`](US8494885B2.pdf)).
* **Problema concreto que resuelven en Alimenta:**
  * En [`docs/propuesta.md` §7](../docs/propuesta.md#L155-L183), la fórmula inicial `P = 0.50G + 0.30A + 0.20T` advierte explícitamente un riesgo: *«no debe asumirse que el barrio más grande es automáticamente el más prioritario»*. Además, cuando el stock del banco es inferior a la suma de solicitudes activas, el agente necesita decidir cómo fraccionar entregas parciales (`F05`, `R10`) sin descuidar comunidades pequeñas o con alta vulnerabilidad.
* **Cómo aplicarlo en Alimenta:**
  1. **Lógica de tres perspectivas (inspirada en *Cureus Journals*):** Presentar al agente en las pantallas `P18` (*Bandeja/evaluación*) y `P21` (*Asignación y programación desde banco*) tres indicadores complementarios en lugar de una caja negra:
     * *Urgencia (*Triage*):* basada en `G` (asignado exclusivamente por el agente con justificación obligatoria, `R01`, y alerta crítica cuando `G = 5`).
     * *Equidad (*Equity*):* contrastar las personas afectadas (`A`) contra indicadores agregados territoriales de Manizales descargados mediante [`Bases de datos/download_manizales_data.py`](../Bases%20de%20datos/download_manizales_data.py) (corte `cod_mpio = 17001`, variables `zona`, `fex`, `hog001`–`hog027`) y el tiempo de espera (`T`), alertando si una comunidad lleva ciclos sin atención.
     * *Viabilidad logística (*Logistics*):* cruzar existencias físicas disponibles en `inventario_lotes` con ventanas abiertas en `ventanas_disponibilidad` y donantes transportadores disponibles en `P10`.
  2. **Sugerencia de reparto bajo escasez (inspirada en `US11393577B2` y `US8494885B2`):** Cuando haya menos unidades disponibles que las solicitadas (por ejemplo, 40 mercados en banco frente a 100 pedidos repartidos en 3 barrios), el sistema puede proponer una distribución parcial sugerida que maximice cobertura en solicitudes `G = 4–5` y respete saldos pendientes sin reiniciar la antigüedad `T`.
* **Reglas que deben preservarse:** `R01` (el agente siempre valida y justifica `G`), `R06` (nunca asignar stock comprometido no verificado físicamente) y `R10` (entregas parciales e incidencias separadas).

### 2.2. Emparejamiento donante–necesidad y aportes espontáneos dirigidos a ediles
* **Antecedentes aplicables:**
  * **ReliefMatcher.AI** ([`IJIRT210234_PAPER.pdf`](IJIRT210234_PAPER.pdf)) *(marco abierto)*.
  * **US11037098B2** ([`US11037098B2.pdf`](US11037098B2.pdf)).
* **Problema concreto que resuelven en Alimenta:**
  * En los recorridos `F01` (*Donación directa a necesidad*, pantallas `P04`–`P06`) y `F02` (*Donación espontánea dirigida a edil*, pantalla `P09`), un donante frecuentemente tiene un producto concreto (por ejemplo, pañales, mercados o implementos de aseo) y necesita saber rápidamente qué comunidad lo requiere con mayor urgencia y tiene horarios de recepción abiertos (`P14`).
* **Cómo aplicarlo en Alimenta:**
  1. **Motor de emparejamiento por catálogo y agenda:** Emparejar oferta del donante contra `detalle_solicitud` usando el catálogo de cuatro niveles (`categoría → subcategoría → producto → presentación`), cantidad aportable, saldo pendiente real y **ventanas activas con cupo disponible** (`R04`).
  2. **Redirección inteligente para aportes espontáneos (`US11037098B2`):** Si el producto ofrecido en `P09` no tiene una necesidad abierta en la comunidad elegida, informar al donante de dos opciones sin forzar falsas necesidades (`R07`): (a) enviarlo como ofrecimiento espontáneo al edil verificado (`detalle_solicitud_id = NULL`, sujeto a aceptación en `P15`), o (b) mostrarle qué otra comunidad cercana sí tiene una necesidad publicada para ese mismo producto, o canalizarlo al banco (`P07`).
  3. **Cierre de la brecha de *ReliefMatcher.AI*:** El artículo señala que la principal debilidad de los sistemas automáticos de *matching* es la **falta de verificación en terreno**. Alimenta resuelve exactamente ese vacío combinando **ediles verificados por administración (`P22`, `R08`)**, **confirmación obligatoria de recepción física (`P16`)** y **contexto territorial de Manizales**.

### 2.3. Trazabilidad, verificación de representantes y auditoría inmutable
* **Antecedentes aplicables:**
  * **WO2023012530A1** ([`WO2023012530A1.pdf`](WO2023012530A1.pdf)).
  * **US20050021353A1** ([`US20050021353A1.pdf`](US20050021353A1.pdf)).
* **Problema concreto que resuelven en Alimenta:**
  * Evitar la pérdida de confianza comunitaria, la doble contabilización de ayudas y los conflictos de interés en aportes dirigidos a ediles (`docs/propuesta.md` §5.3, §8.5, §9 y §10).
* **Cómo aplicarlo en Alimenta:**
  1. **Verificación previa de receptores (`US20050021353A1`):** Reforzar el flujo administrativo `P22` (`ediles_comunidades`) para validar autorización vigente, comunidad asignada y reglas de custodia antes de habilitar a un edil para publicar ventanas (`R02`) o recibir ofertas espontáneas (`R08`).
  2. **Trazabilidad por eventos y analítica por categoría (`WO2023012530A1`):** Estructurar `auditoria`, `entregas` y `recepciones_aportes_dirigidos` como registro de eventos inmutables (`R09`) que separe: oferta → cita solicitada → cita aceptada → retiro autorizado → tránsito → recepción confirmada total/parcial (`R06`). Esto habilita reportes agregados por categoría y comunidad en Fase 2 sin exponer datos personales (`R11`).

### 2.4. Gestión avanzada de inventarios y control de agotamiento (Fase 2)
* **Antecedentes aplicables:**
  * **CN109523314B** ([`CN109523314B.pdf`](CN109523314B.pdf)).
  * **CN110852587A** ([`CN110852587A.pdf`](CN110852587A.pdf)) y **US20200100084A1** ([`US20200100084A1.pdf`](US20200100084A1.pdf)).
* **Cómo aplicarlo en Fase 2:**
  * **Predicción de agotamiento y perecederos (`CN109523314B`):** Sobre `inventario_lotes` y `movimientos_inventario` (`P19`), generar alertas tempranas de lotes próximos a vencer (perecederos) y productos con alta tasa de rotación para orientar campañas de donación al banco. La lectura asistida por cámara/visión por computador para acelerar la recepción física (`F03`) puede evaluarse en Fase 2.
  * **Albergues y reportes agregados en emergencias (`CN110852587A`, `US20200100084A1`):** Permitir etiquetar puntos comunitarios como albergues temporales durante contingencias y visualizar mapas agregados por barrio/zona (sin divulgar domicilios particulares, cumpliendo `R11` y `docs/propuesta.md` §13 Fase 2).

---

## 3. Bloque B — Aplicabilidad a Accesibilidad Universal y Soporte Psicosocial (Vertical 6)

Uno de los principales diferenciales del proyecto frente a plataformas convencionales de donación es evitar la exclusión de adultos mayores, personas con discapacidad, cuidadores y población con baja alfabetización digital.

### 3.1. Interfaz accesible por diseño (*Accessibility-First*)
* **Antecedentes aplicables:**
  * **WO2026151479A1** ([`WO2026151479A1.pdf`](WO2026151479A1.pdf)).
  * **US20200133474A1** ([`US20200133474A1.pdf`](US20200133474A1.pdf)).
* **Cómo aplicarlo en la UX de Alimenta (`docs/diseño/Mockup_interactivo_Alimenta.html` y MVP):**
  * **Diseño táctil adaptativo (`US20200133474A1`):** En pantallas críticas como el selector de horario (`Fecha y hora de entrega` en `P06`, `P07`, `P09`, `P14`) y la confirmación de entregas (`P16`), usar objetivos táctiles amplios, alto contraste (verificando la paleta definida en [`docs/diseño/alimenta_paleta_colores.json`](../docs/dise%C3%B1o/alimenta_paleta_colores.json)), confirmaciones explícitas para prevenir doble clic/toques accidentales por temblor y flujos paso a paso con baja carga cognitiva.
  * **Interacción asistida por voz y lenguaje claro (`WO2026151479A1`):** Permitir en fases progresivas que ediles o donantes con baja destreza digital dicten solicitudes o consulten el estado de una entrega mediante comandos simples de voz y resúmenes en lenguaje claro, con validación redundante antes de confirmar acciones sensibles (como aceptar una cita o reportar una recepción parcial).

### 3.2. Accesibilidad en lengua de señas
* **Antecedentes aplicables:**
  * **US20170236450A1** ([`US20170236450A1.pdf`](US20170236450A1.pdf)).
  * **Sistema ECOS (UNIMINUTO — Patente SIC)** ([Fuente oficial](https://www.uniminuto.edu/noticias/nueva-patente-de-invencion-otorgada-uniminuto-sistema-ecos)).
* **Cómo aplicarlo en Alimenta:**
  * **Corto plazo (MVP):** Incluir guías visuales breves y videos cortos en Lengua de Señas Colombiana (LSC) en la portada (`P01`) y en los pasos clave de solicitud/confirmación.
  * **Mediano plazo (Fase 2 / Alianza institucional):** En lugar de desarrollar un motor propio desde cero, explorar una articulación o integración referenciada en el **Sistema ECOS** (validado con comunidad sorda colombiana) y los principios bidireccionales de `US20170236450A1` para canales de soporte y orientación.

### 3.3. Soporte psicosocial y enrutamiento a Primeros Auxilios Psicológicos (PAP) UNAL
* **Antecedentes aplicables:**
  * **WO2021247792A1** ([`WO2021247792A1.pdf`](WO2021247792A1.pdf)).
  * **CN102708284A** ([`CN102708284A.pdf`](CN102708284A.pdf)).
* **Cómo aplicarlo en Alimenta sin violar privacidad ni alcance médico:**
  * **Restricción clave:** [`docs/product-brief.md`](../docs/product-brief.md) y [`docs/propuesta.md`](../docs/propuesta.md) (`R11`, `R12`) prohíben almacenar datos clínicos sensibles o identidades de beneficiarios en el flujo estándar de donaciones.
  * **Implementación segura:** Inspirados en el triaje adaptativo (`WO2021247792A1`) y la derivación estructurada (`CN102708284A`), habilitar un **canal de derivación separado** donde un edil o cuidador pueda solicitar activación de acompañamiento psicosocial comunitario (registrando únicamente necesidad agregada o activando el contacto directo con la ruta oficial de **Primeros Auxilios Psicológicos UNAL**), sin almacenar diagnósticos ni historias clínicas dentro de la base de datos de donaciones.

---

## 4. Bloque C — Integración de patentes físicas UNAL y nacionales al Catálogo de Donaciones

Una ventaja clave de la arquitectura de [`docs/propuesta.md` §6 y §11](../docs/propuesta.md#L123-L141) es que el catálogo normalizado de cuatro niveles (`categoría → subcategoría → producto → presentación`) y la entidad `kits` ya incluyen la categoría **`Salud y asistencia → dispositivos de apoyo`**. Esto permite integrar tecnologías físicas de la UNAL **sin forzar cambios en la lógica central del software**:

| Patente / Tecnología | Integración concreta en Alimenta | Recorrido y actores involucrados |
| --- | --- | --- |
| **MUUPA** — Mango universal para puertas (`NC2021/0010846`, UNAL Bogotá) | Producto catalogado bajo `Salud y asistencia → dispositivos de apoyo → accesibilidad en sedes` y en **kits de adecuación de albergues/comedores**. | Ediles solicitan unidades en `P13` para comedores o puntos de acopio; donantes o padrinos aportan lotes por `F01` o `F03`. |
| **Muleta axilar plegable** (UNAL, Patente SIC) | Producto catalogado bajo `Salud y asistencia → dispositivos de apoyo → movilidad reducida` (adultos mayores y personas con discapacidad física). | Ediles reportan necesidad comunitaria agregada en `P13`; agente prioriza en `P18`/`P21`; entrega verificada en `P16`. |
| **Sistema *Anatom*** — Cojines antiescaras (UNAL Palmira, en trámite) | Integrable como **kit para cuidadores** de personas con movilidad reducida o postración. | Visibiliza explícitamente a los **cuidadores** (actor clave de la Vertical 6) dentro del catálogo de donaciones. |
| **Gafas con sensores de obstáculos** (UNAL Manizales, en trámite) y **Silla *Centaurum*** (UNAL Palmira) | Referentes de transferencia tecnológica regional (especialmente Manizales) incorporables en Fase 2 mediante convenios de fabricación/donación institucional. | Articulación universidad–comunidad gestionada desde administración (`P22`). |
| **Tabla de emergencia para columna vertebral** (UNIMINUTO, Res. 21041) | Referente nacional para kits de dotación de puntos comunitarios o brigadas de emergencia en Fase 2. | Solo bajo validación de protocolos con organismos de socorro. |

---

## 5. Bloque D — Patentes NO recomendadas para el MVP (y por qué)

Documentar explícitamente qué antecedentes **no** deben incorporarse evita desviar el MVP y protege las reglas de negocio vigentes (`R01`–`R12`):

1. **Pagos e intermediación financiera (`US11227325B1`, `US20180276710A1`):**
   * *Motivo de exclusión:* Ambas dependen de compras automáticas, tarjetas o incentivos monetarios. Tanto [`docs/product-brief.md` §6](../docs/product-brief.md#L59-L70) como [`docs/propuesta.md` §5.3 y §10](../docs/propuesta.md#L117) (`R12`) excluyen expresamente aportes monetarios y pagos del MVP para evitar cargas regulatorias, fiscales y de custodia financiera.
2. **Comando táctico de incidentes, sensores de infraestructura y mapas satelitales (`US12299557B1`, `US12024201B2`, `US9143535B1`, `US11395124B2`):**
   * *Motivo de exclusión:* Están diseñadas para centros de comando de desastres mayores, despacho de primeros auxilios o redes de sensores IoT. Alimenta es una herramienta de **coordinación comunitaria de donaciones e inventarios**, no un sistema de despacho de emergencias médicas ni de monitoreo satelital. Solo sirven como referencia de contexto para una eventual interoperabilidad futura.
3. **Antecedentes genéricos o de hardware biomédico/educativo especializado (`US20050251485A1`, `JP7834399B1`, `CO7290157A1`, `CO2022004788A1`, `WO2017125785A1`, `Exp. SIC 13244024`):**
   * *Motivo de exclusión:* `US20050251485A1` y `JP7834399B1` ya quedan cubiertos con mayor detalle moderno por `WO2023012530A1` y `ReliefMatcher.AI`. Por su parte, `CO7290157A1` (aseo dental), `CO2022004788A1` (robótica de rehabilitación), `WO2017125785A1` (escritura Braille) y `Exp. SIC 13244024` (hardware educativo de señas) son dispositivos físicos específicos que no requieren implementarse dentro del software de Alimenta, aunque respaldan el ecosistema de innovación inclusiva.

---

## 6. Hoja de ruta de adopción y resguardo de Propiedad Intelectual (*Freedom to Operate*)

### 6.1. Qué adoptar en cada etapa

| Etapa | Elementos aplicables desde los antecedentes | Objetivo verificable |
| --- | --- | --- |
| **Fase 1 — MVP funcional** | • Patrones de verificación de ediles y auditoría inmutable (`WO2023012530A1`, `US20050021353A1`).<br>• Emparejamiento por catálogo y ventanas disponibles (`ReliefMatcher.AI`, `US11037098B2`).<br>• Índice de equidad territorial en `P18`/`P21` apoyado en *Cureus Journals* + datos Manizales (`ab8a-uwf7`), manteniendo `G` 100 % humano (`R01`).<br>• Patrones UX *accessibility-first* y botones amplios (`WO2026151479A1`, `US20200133474A1`).<br>• Subcategoría **"Catálogo de Ayudas Técnicas UNAL"** (MUUPA, muleta axilar plegable, kits cuidadores).<br>• Enlace/derivación externa a **PAP UNAL** sin almacenar datos clínicos. | Validar el flujo completo `F01`–`F05` con ediles, agentes y donantes reales en Manizales sin infringir `R01`–`R12`. |
| **Fase 2 — Escalamiento e inteligencia asistida** | • Recomendación algorítmica de reparto bajo escasez y entregas parciales (`US11393577B2`, `US8494885B2`).<br>• Predicción de agotamiento y alertas de perecederos (`CN109523314B`).<br>• Interacción por voz asistida (`WO2026151479A1`) e integración/alianza en lengua de señas (`Sistema ECOS`, `US20170236450A1`).<br>• Tamizaje psicosocial estructurado en canal independiente (`WO2021247792A1`, `CN102708284A`).<br>• Mapas agregados por zona/albergue sin domicilios (`CN110852587A`, `US20200100084A1`). | Escalar coordinación entre múltiples iniciativas comunitarias manteniendo equidad, accesibilidad y control humano. |

### 6.2. Resguardo legal y ético para la implementación en Colombia
1. **Libertad de operación (*Freedom to Operate*):** Ninguna de las patentes de software o gestión de donaciones estudiadas (`US11393577B2`, `US8494885B2`, `US11037098B2`, `WO2023012530A1`, `CN109523314B`, entre otras) está concedida en Colombia. Además, bajo la **Decisión 486 de la Comunidad Andina**, los programas de ordenador y métodos de gestión en sí mismos no son patentables en Colombia (se protegen por derecho de autor), lo que permite inspirarse libremente en principios generales de diseño y literatura abierta (*Cureus Journals*, *ReliefMatcher.AI*) sin reproducir código ni textos protegidos.
2. **Patentes físicas colombianas (UNAL y UNIMINUTO):** Para incorporar **MUUPA**, la **muleta axilar plegable** o el **Sistema ECOS**, Alimenta no copia ni fabrica las invenciones: actúa exclusivamente como **canal de visibilización, donación o articulación institucional** con los titulares (UNAL / UNIMINUTO), respetando sus derechos de propiedad industrial ante la SIC.
3. **Resguardo ético (*Human-in-the-Loop* y privacidad):** Toda automatización inspirada en estos antecedentes debe operar como **recomendación auditable**, nunca como decisión autónoma que excluya a personas sin huella digital ni exponga información personal de hogares beneficiarios (`R11`).
