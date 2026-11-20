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

## 5. Conclusiones clave para el proyecto

1. **Sin bloqueo de patentes de software en Colombia:** Bajo la Decisión 486 de la Comunidad Andina, los programas de ordenador y modelos algorítmicos en sí mismos no son patentables en Colombia (se protegen por derecho de autor), por lo que las patentes extranjeras listadas no impiden el despliegue local en Manizales.
2. **Brecha frente al estado del arte:** Varios sistemas previos (`US11393577B2`, `US11037098B2`, `CN109523314B`) dependen de señales digitales y tienden a excluir a personas con baja huella digital (adultos mayores, población informal o personas con discapacidad).
3. **Diferencial de enfoque:** Combinar IA orientada a equidad con validación humana local (*Human-in-the-Loop* mediante JAC y SISBÉN IV), interfaces accesibles (voz/señas) y articulación con recursos locales de apoyo psicosocial y asistivo.
