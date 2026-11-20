# Prototipos y antecedentes de referencia

Toda la documentación que pueda servir de base para nuestro programa funcional y/o que pueda generar una idea redundante o ya existente.

Esta carpeta recopila patentes y artículos científicos relevantes sobre el uso de modelos de Inteligencia Artificial para la gestión de recursos en emergencias, coordinación de donaciones e inventarios, priorización de poblaciones vulnerables y tamizaje psicosocial. Ninguna de las patentes listadas está concedida en Colombia ni combina **IA + datos del SISBÉN IV + verificación local vía JAC + accesibilidad universal**.

---

## 1. Patentes con IA para gestión de recursos y respuesta en emergencias

Antecedentes más cercanos a la asignación inteligente de recursos limitados en contextos de desastre:

| Documento | Archivo local | País / Estado | Aspectos clave del modelo de IA | Enlace |
| --- | --- | --- | --- | --- |
| **US11393577B2** | [`US11393577B2.pdf`](US11393577B2.pdf) | EE. UU. (Activa) | Machine learning y optimización combinatoria para asignar recursos escasos; predice demanda y tiempos de atención para priorizar tareas e insumos en tiempo real. | [Google Patents](https://patents.google.com/patent/US11393577B2/en) |
| **US12299557B1** *(GovernmentGPT Inc.)* | [`US12299557B1.pdf`](US12299557B1.pdf) | EE. UU. (Activa, 2025) | IA generativa para planes de acción en emergencias; analiza datos del entorno en tiempo real y ajusta despliegues de recursos y recomendaciones de evacuación. | [Google Patents](https://patents.google.com/patent/US12299557B1/en) |
| **US11395124B2** *(Kant AI Solutions)* | [`US11395124B2.pdf`](US11395124B2.pdf) | EE. UU. (Activa) | Asistencia y triaje en emergencias mediante detección de patrones y anomalías en reportes entrantes para clasificar urgencia y enrutar despachos. | [Google Patents](https://patents.google.com/patent/US11395124B2/en) |
| **US12024201B2** | [`US12024201B2.pdf`](US12024201B2.pdf) | EE. UU. (Activa) | Redes de respuesta con clasificadores de machine learning sobre sensores y reportes de infraestructura para decidir asignación de recursos de contención y apoyo. | [Google Patents](https://patents.google.com/patent/US12024201B2/en) |
| **US9143535B1** | [`US9143535B1.pdf`](US9143535B1.pdf) | EE. UU. (Concedida) | Red situacional asistida por IA que genera mapas dinámicos geolocalizados para evaluar daños y priorizar dónde se requieren suministros de socorro. | [Google Patents](https://patents.google.com/patent/US9143535B1/en) |

---

## 2. Patentes con IA para donaciones, inventario y emparejamiento

Antecedentes centrados en recibir, clasificar y emparejar artículos donados con destinatarios o gestionar inventarios:

| Documento | Archivo local | País / Estado | Aspectos clave del modelo de IA | Enlace |
| --- | --- | --- | --- | --- |
| **US11037098B2** | [`US11037098B2.pdf`](US11037098B2.pdf) | EE. UU. (Activa) | Sistema de disposición y donación de artículos basado en machine learning que evalúa características del objeto y recomienda el mejor destino según demanda y viabilidad. | [Google Patents](https://patents.google.com/patent/US11037098B2/en) |
| **US20180276710A1** | [`US20180276710A1.pdf`](US20180276710A1.pdf) | EE. UU. (Solicitud) | Motor de recomendación con IA que empareja transacciones e incentivos con organizaciones y causas benéficas afines. | [Google Patents](https://patents.google.com/patent/US20180276710A1/en) |
| **CN109523314B** | [`CN109523314B.pdf`](CN109523314B.pdf) | China (Concedida) | Control de cadena de suministro e inventarios con visión por computador para leer existencias en tiempo real, predecir agotamiento y priorizar reposiciones por punto de entrega. | [Google Patents](https://patents.google.com/patent/CN109523314B/en) |

---

## 3. Patentes con IA en accesibilidad, discapacidad y salud mental

Antecedentes relevantes para la atención a poblaciones vulnerables y el componente de soporte psicosocial:

| Documento | Archivo local | Alcance | Aspectos clave del modelo de IA | Enlace |
| --- | --- | --- | --- | --- |
| **WO2026151479A1** | [`WO2026151479A1.pdf`](WO2026151479A1.pdf) | Internacional PCT (2026) | Orquestación de múltiples servicios de IA para tecnología asistiva con arquitectura *accessibility-first* (control por voz sin conocimientos técnicos, compensación de temblor y retraso cognitivo, y priorización de emergencias para personas con discapacidad). | [Google Patents](https://patents.google.com/patent/WO2026151479A1/en) |
| **WO2021247792A1** | [`WO2021247792A1.pdf`](WO2021247792A1.pdf) | Internacional PCT | Atención y triaje en salud mental mediante IA; procesa cuestionarios adaptativos con ML para detectar afectaciones emocionales/psicológicas, evaluar riesgo y orientar la derivación profesional. | [Google Patents](https://patents.google.com/patent/WO2021247792A1/en) |

---

## 4. Literatura científica reciente (no patentada)

Artículos de acceso abierto que respaldan el enfoque técnico sin restricciones de propiedad intelectual:

* **Arquitectura multi-agente con equidad (*Cureus Journals*, 2026)** — [`CureusJournals_2103020260923-125190-35nv82.pdf`](CureusJournals_2103020260923-125190-35nv82.pdf) ([Fuente original](https://assets.cureusjournals.com/artifacts/upload/original_article/pdf/21030/CureusJournals_2103020260923-125190-35nv82.pdf))
  * Propone un marco de negociación multi-agente con roles diferenciados: *Triage Agent* (urgencia), *Equity Agent* (garantiza que ninguna comunidad vulnerable quede rezagada) y *Logistics Agent*.
  * Reporta una mejora del **44,3 %** en satisfacción de metas frente a esquemas de asignación puramente voraces.

* **ReliefMatcher.AI (*IJIRT*)** — [`IJIRT210234_PAPER.pdf`](IJIRT210234_PAPER.pdf) ([Fuente original](https://ijirt.org/publishedpaper/IJIRT210234_PAPER.pdf))
  * Marco abierto de emparejamiento asistido por IA entre ofertas de donantes y solicitudes de damnificados por categoría, cantidad, ubicación y urgencia.
  * Identifica explícitamente la **verificación en terreno** como una brecha pendiente, punto clave que puede abordarse mediante validación comunitaria local (JAC) y datos del SISBÉN IV.

---

## 5. Patentes adicionales sobre gestión de donaciones y ayudas en emergencias

Antecedentes extranjeros sobre modelado de distribución, emparejamiento donante–beneficiario y gestión operativa en desastres:

| Documento | Archivo local | Enfoque técnico y similitud con la idea | Enlace |
| --- | --- | --- | --- |
| **US8494885B2** *(antes US20110087514A1)* | [`US8494885B2.pdf`](US8494885B2.pdf) | **Modelado de distribución de suministros de emergencia en desastres.** Optimiza cómo asignar y distribuir bienes críticos según la demanda de zonas afectadas. | [Google Patents](https://patents.google.com/patent/US8494885B2/en) |
| **US11227325B1** *(Wells Fargo, vigente)* | [`US11227325B1.pdf`](US11227325B1.pdf) | **Sistema automático de transacciones basadas en eventos.** Detecta la geolocalización de un desastre y activa automáticamente la compra/provisión de suministros básicos en el área afectada. | [Google Patents](https://patents.google.com/patent/US11227325B1/en) |
| **CN110852587A** | [`CN110852587A.pdf`](CN110852587A.pdf) | **Asignación de recursos y ubicación de albergues de emergencia.** Algoritmos de reparto de suministros orientados a familias en albergues. | [Google Patents](https://patents.google.com/patent/CN110852587A/zh) |
| **JP7834399B1** | *(Sin PDF en Google Patents)* | **Dispositivo/sistema de emparejamiento (*matching*) de donaciones.** Empareja automáticamente bienes o servicios disponibles para donación con destinatarios registrados. | [Google Patents](https://patents.google.com/patent/JP7834399B1/en) |
| **WO2023012530A1** | [`WO2023012530A1.pdf`](WO2023012530A1.pdf) | **Plataforma de software para gestión de donaciones caritativas.** Incluye campañas, trazabilidad en tiempo real, panel para organizaciones receptoras y analítica de categorías donadas. | [Google Patents](https://patents.google.com/patent/WO2023012530A1/en) |
| **US20050251485A1** | [`US20050251485A1.pdf`](US20050251485A1.pdf) | **Sistemas en red para solicitud y distribución de donaciones en desastres.** Arquitectura temprana de recaudación y canalización rápida ante emergencias. | [Google Patents](https://patents.google.com/patent/US20050251485A1/en) |
| **US20050021353A1** | [`US20050021353A1.pdf`](US20050021353A1.pdf) | **Sistema y método de gestión de donaciones.** Motor de validación de organizaciones receptoras, filtros de cumplimiento y liquidación trazable de aportes. | [Google Patents](https://patents.google.com/patent/US20050021353A1/en) |
| **US20200100084A1** | [`US20200100084A1.pdf`](US20200100084A1.pdf) | **Uso de reportes ciudadanos/redes para gestión de emergencias.** Recopila reportes geolocalizados de comunidades afectadas para priorizar el envío de insumos básicos. | [Google Patents](https://patents.google.com/patent/US20200100084A1/en) |

---

## 6. Patentes y tecnologías de la Universidad Nacional de Colombia (UNAL)

### A. Patentes asignadas directamente a la Vertical 6

* **Mango universal para operar puertas con pies o antebrazos — MUUPA (Radicado SIC: NC2021/0010846, TRL 5, Sede Bogotá):** Dispositivo mecánico instalable sin perforar la puerta (ajuste a presión), operable con el pie o el antebrazo y con pasador de seguridad. Adecuado para entregar vía donación e instalar en albergues, comedores comunitarios y locales comerciales.
  * [Ficha oficial VRI UNAL](https://viceinvestigacion.unal.edu.co/patente/mango-universal-para-operar-puertas-utilizado-por-pies-o-antebrazos/)
  * [Artículo Periódico UNAL (agosto 2026)](https://periodico.unal.edu.co/articulos/dispositivo-mecanico-para-puertas-reduce-laexposicion-a-bacterias-en-espacios-publicos)
* **Silla para competencia y entrenamiento de lanzamiento paralímpico — *Centaurum* (Patente de invención SIC, Sede Palmira):** Diseñada con ergonomía participativa para personas con amputaciones o diplejía (estructura metálica, fibra de vidrio y sujeción segura).
  * [Agencia de Noticias UNAL](https://agenciadenoticias.unal.edu.co/detalle/patente-de-invencion-para-silla-paralimpica-disenada-en-la-un-sede-palmira)
* **Muleta axilar plegable con medio elástico en los perfiles de soporte (Patente de invención SIC):** Ayuda técnica de movilidad reducida con amortiguación elástica y diseño plegable, pertinente para kits de donación dirigidos a adultos mayores y personas con discapacidad física.
  * [Referencia en UN Periódico No. 224](https://issuu.com/mediosdigitales/docs/unperiodico224)

### B. Otras tecnologías UNAL en trámite de patente afines a la Vertical 6

* **Sistema *Anatom* de posicionamiento antiescaras (Sede Palmira, en proceso de patente):** Conjunto modular de siete cojines ergonómicos para adultos mayores o personas con movilidad reducida y apoyo a cuidadores.
  * [Agencia de Noticias UNAL](https://agenciadenoticias.unal.edu.co/detalle/sistema-previene-ulceras-en-pacientes-con-poca-o-nula-movilidad)
* **Gafas con sensores de obstáculos para personas con discapacidad visual (Sede Manizales, en proceso de patente):** Desarrolladas por estudiantes de Ingeniería Electrónica de la Sede Manizales para detectar obstáculos a la altura de la cabeza en entornos complejos o con escombros.
  * [Agencia de Noticias UNAL](https://agenciadenoticias.unal.edu.co/detalle/gafas-con-sensores-de-movimiento-guiarian-a-personas-con-discapacidad-visual)

---

## 7. Patentes a nivel nacional (Colombia — SIC / Instituciones colombianas)

Patentes concedidas o tramitadas ante la Superintendencia de Industria y Comercio (SIC) que respaldan inclusión, discapacidad, lengua de señas y atención en emergencias:

* **Sistema ECOS — Interpretación en tiempo real de voz a lengua de señas (Patente de invención SIC — UNIMINUTO):** Captura voz y la traduce mediante un avatar a lengua de señas con biblioteca colaborativa validada por la comunidad sorda.
  * [Fuente oficial UNIMINUTO](https://www.uniminuto.edu/noticias/nueva-patente-de-invencion-otorgada-uniminuto-sistema-ecos)
* **Dispositivo electrónico portátil para aprendizaje inicial de lenguaje de señas (Patente de Modelo de Utilidad SIC, Exp. 13244024):** Hardware educativo orientado a inclusión comunicativa de población infantil con discapacidad auditiva. *(Descarga directa desde SIPI-SIC requiere sesión de navegador)*
  * [Registro SIPI-SIC](https://sipi.sic.gov.co/sipi/View.ashx?707341)
* **Tabla de emergencia para columna vertebral (Patente de invención SIC, Res. 21041 — UNIMINUTO):** Dispositivo que permite trasladar heridos en emergencias con menos personal y menor riesgo de lesión secundaria.
  * [Fuente oficial UNIMINUTO](https://www.uniminuto.edu/noticias/patente-uniminuto-tabla-de-emergencia-para-al-columna-vertebral)
* **CO7290157A1 — Sistema para el aseo dental de personas con discapacidad de miembros superiores:** Solicitud colombiana orientada a autonomía cotidiana de personas con discapacidad motriz. *(Sin PDF en Google Patents)*
  * [Google Patents](https://patents.google.com/patent/CO7290157A1/es)
* **CO2022004788A1 — Efector final adaptable para robot de rehabilitación:** Solicitud en Colombia enfocada en rehabilitación física asistida. *(Sin PDF en Google Patents)*
  * [Google Patents](https://patents.google.com/patent/CO2022004788A1/es)

---

## 8. Patentes en el extranjero afines a la Vertical 6 (accesibilidad y soporte psicosocial)

Antecedentes internacionales para los pilares de accesibilidad universal (lengua de señas, interfaces táctiles/auditivas) y soporte psicosocial estructurado:

| Documento | Archivo local | Qué protege y cómo aporta | Enlace |
| --- | --- | --- | --- |
| **US20170236450A1** | [`US20170236450A1.pdf`](US20170236450A1.pdf) | **Traducción bidireccional en tiempo real lengua de señas ↔ voz.** Usa cámara y micrófono para comunicación inclusiva sin intérprete permanente. | [Google Patents](https://patents.google.com/patent/US20170236450A1/en) |
| **US20200133474A1** | [`US20200133474A1.pdf`](US20200133474A1.pdf) | **Interfaz táctil adaptativa para dispositivos móviles.** Ajusta zonas de contacto según morfología, tamaño de mano o limitaciones motoras del usuario. | [Google Patents](https://patents.google.com/patent/US20200133474A1/en) |
| **WO2017125785A1** *(UCSC, Chile)* | [`WO2017125785A1.pdf`](WO2017125785A1.pdf) | **Dispositivo electrónico de escritura Braille / código Morse auditivo.** Referente latinoamericano para interacción accesible en personas con discapacidad visual o motora. | [Google Patents](https://patents.google.com/patent/WO2017125785A1/es) |
| **CN102708284A** | [`CN102708284A.pdf`](CN102708284A.pdf) | **Método y plataforma automatizada de gestión de salud psicológica.** Integra tamizaje masivo, consulta y derivación a intervención psicológica continua. | [Google Patents](https://patents.google.com/patent/CN102708284A/en) |

---

## 9. Conclusiones clave y estrategia de Propiedad Intelectual (*Freedom to Operate*)

1. **Libertad de operación en Colombia (*Freedom to Operate*):** Bajo la Decisión 486 de la Comunidad Andina, los programas de ordenador y modelos algorítmicos en sí mismos no son patentables en Colombia (se protegen por derecho de autor), y las patentes de gestión de donaciones encontradas (`US8494885B2`, `US11227325B1`, `JP7834399B1`, `CN110852587A`) tienen alcance territorial fuera de Colombia, por lo que no impiden el despliegue local en Manizales.
2. **Brecha frente al estado del arte:** Varios sistemas previos (`US11393577B2`, `US11037098B2`, `CN109523314B`) dependen de señales digitales y tienden a excluir a personas con baja huella digital (adultos mayores, población informal o personas con discapacidad).
3. **Diferencial de enfoque:** Combinar IA orientada a equidad con validación humana local (*Human-in-the-Loop* mediante JAC y SISBÉN IV), interfaces accesibles (voz/señas) y enrutamiento a los **Primeros Auxilios Psicológicos UNAL**.
4. **Integración de patentes UNAL:** El gestor puede contemplar un módulo de **"Catálogo de Ayudas Técnicas UNAL"** donde donantes o padrinos financien lotes de **MUUPA (NC2021/0010846)** para adecuar albergues/comedores y **muletas axilares plegables** para adultos mayores reportados por las JAC.
