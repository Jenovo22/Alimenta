# Alimenta

**Plataforma de coordinación de donaciones y servicios comunitarios.**

Alimenta es un proyecto que propone conectar a donantes, representantes comunitarios (*ediles*) y agentes encargados de evaluar necesidades y coordinar recursos. Su propósito es facilitar el registro de solicitudes, el seguimiento de aportes y la confirmación de entregas, además de ofrecer información pública sobre servicios de apoyo comunitario.

El proyecto está construyendo una demostración. `app/frontend/` contiene una experiencia pública y vistas cliente para donante, edil, agente y administrador con React, TypeScript y Vite. Usa datos ficticios y estado transitorio: no hay backend, autenticación, persistencia ni operaciones reales. `deploy/` sigue pendiente. **No debe interpretarse que la plataforma está desplegada ni validada en campo**.

## ¿Por qué existe este repositorio?

El repositorio reúne las bases del proyecto, los requisitos y las decisiones de diseño, así como materiales de investigación, scripts de apoyo y pruebas iniciales. Su finalidad es que las personas y agentes de desarrollo trabajen sobre un contexto común y puedan implementar una demostración coherente sin confundir los objetivos del producto con resultados comprobados.

El contexto inicial y los supuestos se encuentran en [`docs/product-brief.md`](docs/product-brief.md); la orientación funcional en [`docs/propuesta.md`](docs/propuesta.md).

## Valor propuesto

Alimenta busca explorar si una plataforma compartida puede ayudar a:

- **Las comunidades y sus representantes:** reportar necesidades por productos y cantidades, ofrecer horarios de recepción y confirmar entregas.
- **Los donantes individuales y organizaciones:** identificar oportunidades de apoyo, comprometer aportes y conocer su estado.
- **Los agentes de coordinación:** evaluar necesidades, consultar inventarios verificados, gestionar asignaciones y coordinar entregas desde un banco de donaciones.
- **El público general:** consultar ubicaciones y horarios informativos de ollas, almuerzos y otros servicios comunitarios publicados y verificados.

Estos beneficios son **hipótesis de producto**, no indicadores de impacto ya demostrados.

## Alcance funcional previsto

### Acceso público

La portada se podrá consultar sin iniciar sesión. De acuerdo con la propuesta de interfaz, incluirá una introducción a Alimenta, las modalidades de donación, un acceso al directorio de servicios comunitarios y una sección de **organizaciones aliadas** dentro de la propia página de inicio.

El directorio mostrará puntos de atención registrados por ediles o administradores y sujetos a revisión antes de hacerse visibles. Los horarios publicados serán informativos; **no representan disponibilidad de raciones o cupos en tiempo real**.

La sección de agradecimientos podrá destacar hasta **diez personas jurídicas donantes**, seleccionadas por el agente con base en un criterio documentado de aportes recibidos y confirmados. La primera organización aparecerá como destacada en un carrusel. La publicación requerirá autorización y no implica publicidad pagada, aval comercial ni una medición automática del impacto social.

### Perfiles y responsabilidades

| Perfil | Responsabilidad prevista |
| --- | --- |
| **Donante** | Elegir necesidades publicadas, donar al banco o realizar aportes dirigidos a un edil; solicitar horarios y hacer seguimiento. |
| **Edil** | Representar una comunidad autorizada, registrar solicitudes, publicar ventanas de recepción, agendar **jornadas de voluntariado comunitario** (atención psicológica, vacunación, atención médica u otra), revisar aportes dirigidos y confirmar cantidades recibidas. |
| **Agente** | Evaluar y priorizar necesidades, coordinar el banco y sus horarios, asignar recursos, gestionar entregas y seleccionar reconocimientos a organizaciones. |
| **Administrador** | Verificar representantes, administrar permisos y catálogo, revisar y aprobar la publicación de puntos comunitarios y **jornadas de voluntariado**, y consultar auditoría. |
| **Comunidad beneficiaria** | Comunicar necesidades a través de su representante y recibir las contribuciones verificadas; no requiere necesariamente una cuenta individual. |

### Modalidades de donación

1. **A una necesidad publicada:** el donante selecciona producto, cantidad y una ventana horaria publicada por el edil.
2. **Al banco de donaciones:** el donante solicita una cita de ingreso; el agente coordina y verifica la recepción. Posteriormente, gestiona la salida de existencias hacia una comunidad.
3. **A un edil específico:** el donante ofrece productos para su comunidad, incluso sin una solicitud registrada. El edil acepta o rechaza el ofrecimiento; este aporte no crea automáticamente una necesidad ni altera sus saldos.

Como principio operativo de la propuesta, **el transporte corre por cuenta del donante o de un donante transportador que lo acepte**. El agente coordina horarios y asignaciones desde el banco, pero no se convierte por ello en transportador. Una promesa o una cita no equivalen a una recepción confirmada.

### Inventario, necesidades y trazabilidad

La solución deberá distinguir recursos **comprometidos, recibidos, disponibles, reservados, despachados y entregados**. También deberá permitir entregas parciales, mantener el saldo pendiente de cada producto y registrar quién realizó y confirmó cada operación.

El **grado de necesidad (1 a 5)** lo asigna exclusivamente el agente, con justificación. La fórmula de priorización propuesta —`P = 0.50G + 0.30A + 0.20T`— y sus normalizaciones son **provisionales**: requieren validación antes de utilizarse en decisiones reales. La plataforma puede recomendar, pero el agente decide y deja trazabilidad.

### Agente de ponderación social, patente de referencia, voluntariado y módulos de inclusión

Como definición funcional consolidada en [`docs/propuesta.md`](docs/propuesta.md), la solución complementa el flujo operativo con cinco capacidades que preservan la decisión humana (*Human-in-the-Loop*) y las exclusiones del MVP:

- **Agente propio de ponderación social + herramienta `US8494885B2`:** el agente pondera urgencia (`G`), equidad territorial (con datos agregados de Manizales `ab8a-uwf7`, sin PII) y viabilidad logística, y utiliza el modelo de [`US8494885B2`](Documentos-prototipos/US8494885B2.pdf) (*Banco como área de acopio → Comunidades como puntos de distribución*) como herramienta para sugerir repartos parciales bajo escasez sin auto-reservar stock ni alterar `G`.
- **Jornadas de voluntariado comunitario (agendadas por el Edil):** sección dedicada (`jornadas_edil`) donde el edil registra voluntarios para un horario específico en actividades de **atención psicológica, jornadas de vacunación, atención médica en el barrio u otra**, indicando el **nombre del voluntario encargado** y el **lugar público autorizado** (sin domicilios particulares). Cada jornada pasa por revisión administrativa (`jornadas_admin`) antes de publicarse en el directorio público comunitario y es independiente de las citas de donación.
- **Catálogo de Ayudas Técnicas UNAL:** visibiliza solicitudes y donaciones de **MUUPA** (`NC2021/0010846`), **Muleta axilar plegable** y **Sistema *Anatom*** (cuidadores) dentro de `Salud y asistencia`, respetando la titularidad de la UNAL ante la SIC.
- **Emparejamiento asistido donante–necesidad:** sugiere coincidencias por catálogo y ventanas horarias abiertas (*ReliefMatcher.AI* + `US11037098B2`), cerrando la verificación en terreno mediante ediles verificados.
- **Ruta PAP UNAL y plan a futuro (Fase 2):** derivación desacoplada hacia **Primeros Auxilios Psicológicos (PAP) UNAL** (`WO2021247792A1`, `CN102708284A`) sin almacenar datos clínicos ni identidades. Como **plan a futuro (Fase 2)** se proyecta: (1) **accesibilidad universal en versión de dispositivo móvil** —lengua de señas, interfaces táctiles y auditivas— (`WO2026151479A1`, `US20200133474A1`, `US20170236450A1` / Sistema ECOS) junto con **operación móvil *offline-first* / baja conectividad**; (2) **evolución logística y mapas agregados en emergencias** (`US11393577B2`, `CN110852587A`, `US20200100084A1`, sin domicilios); (3) **validación institucional y trazabilidad ampliada para Jornadas de Voluntariado**; y (4) **módulo de sostenibilidad empresarial B2B / B2G** (perfiles corporativos, expedientes auditables de donación verificada y reportes ESG agregados vinculados a `#aliados`).

## Diseño y experiencia de usuario

El diseño de referencia acordado para la demo contempla:

- **Navegación superior unificada** para la portada y los espacios de donante, edil, agente y administrador.
- **Diseño editorial y paneles de selección** consistentes, con listados y fichas de detalle.
- **Carruseles destacados** con el mismo lenguaje visual y controles situados de forma consistente; sin rotación automática obligatoria.
- **Interfaz adaptable** a escritorio y móvil, con navegación utilizable mediante teclado.
- **Paleta institucional** de referencia: verde `#94B43B`, verde oscuro `#466B3F`, rojo `#A61C31`, vinotinto `#76232F`, gris oscuro `#565A5C` y gris claro `#B1B2B0`.

Los materiales de diseño —incluida la **versión final aprobada del mockup HTML** ([`docs/diseño/Mockup_Alimenta_Taste_v7_Jornadas_Voluntariado.html`](docs/dise%C3%B1o/Mockup_Alimenta_Taste_v7_Jornadas_Voluntariado.html)), sus lineamientos visuales y la especificación `propuesta_mockup.md`— se organizan en `docs/diseño/`. Por su parte, `Documentos-prototipos/` reúne las patentes, artículos científicos y el análisis de aplicabilidad ([`Documentos-prototipos/aplicabilidad-patentes-alimenta.md`](Documentos-prototipos/aplicabilidad-patentes-alimenta.md)) que fundamentan [`docs/propuesta.md`](docs/propuesta.md). Antes de iniciar la implementación deben contrastarse las propuestas documentales con el HTML aprobado. **El mockup es una referencia visual y de interacción, no un backend funcional.**

## Estado actual del proyecto

A partir de la estructura presente, el repositorio incluye:

- Documentación de contexto, propuesta, requisitos y cambios del proyecto.
- Carpetas destinadas al diseño y a los documentos/prototipos.
- Un script relacionado con la descarga de datos de Manizales, documentación de bases de datos y una prueba asociada.
- Definiciones de tareas que documentan trabajo de fundamentación y datos.

**No se presupone** la existencia de una API operativa, una base de datos desplegada, autenticación real, un sistema de donaciones transaccional o logística ejecutándose en producción. El frontend y sus vistas por rol son una demostración cliente sin backend ni persistencia. El resto de la estructura de `app/` continúa siendo organización de trabajo, no evidencia de servicios implementados.

## Estructura actual del repositorio

```text
Alimenta/
├── .atl/                               # Estado local de herramientas
├── .codegraph/                         # Estado local de herramientas
├── Bases de datos/
│   ├── bases-datos.md                  # Apuntes/documentación de datos
│   ├── download_manizales_data.py      # Script relacionado con datos de Manizales
│   └── README.md                       # Indicaciones propias de la carpeta
├── docs/
│   ├── diseño/                         # Materiales de diseño
│   ├── product-brief.md                # Contexto, supuestos y límites
│   ├── propuesta.md                    # Propuesta funcional
│   └── Rubrica_requerimientos.jpeg     # Rúbrica de referencia
├── Documentos-prototipos/              # Documentos y prototipos
├── odd/
│   └── tasks/
│       ├── initial-repository-foundation.md
│       ├── manizales-data-download.md
│       └── merge-manizales-data.md
├── tests/
│   └── test_manizales_downloader.py    # Prueba del descargador
├── .gitignore
├── CONTRIBUTING.md
├── PLAN_CAMBIOS_PROYECTO.md
└── README.md
```

Esta estructura refleja las **rutas visibles en el estado actual** del proyecto. Las carpetas de `app/` se crean inicialmente vacías para servir de esqueleto; no representan frontend, backend ni infraestructura implementados. `deploy/` continúa pendiente. Los directorios `.atl/` y `.codegraph/` son locales/de herramientas; su seguimiento efectivo depende de `.gitignore` y de la configuración de Git.

## Estructura inicial de carpetas de la aplicación

Se conserva la estructura existente y se agrega `app/` como esqueleto inicial. `deploy/` continúa siendo una propuesta separada:

- **`app/` — código de demostración y organización futura:** frontend público y vistas demostrativas por rol implementados; backend, migraciones y datos ficticios de inicialización siguen pendientes.
- **`deploy/` — infraestructura pendiente:** configuraciones reproducibles para desarrollo y, cuando corresponda, producción. No debe contener lógica funcional de negocio.

El esqueleto de carpetas creado (sin código funcional ni configuración de stack) es:

```text
Alimenta/
├── app/                                 # Frontend público demo; servicios backend pendientes
│   ├── frontend/                        # React + TypeScript + Vite, público cliente
│   │   ├── public/                      # Archivos estáticos
│   │   ├── src/
│   │   │   ├── app/                     # Enrutamiento y configuración
│   │   │   ├── components/              # Navegación superior, carrusel, selector...
│   │   │   ├── layouts/                 # Diseño público y por rol
│   │   │   ├── pages/
│   │   │   │   ├── public/
│   │   │   │   ├── donante/
│   │   │   │   ├── edil/
│   │   │   │   ├── agente/
│   │   │   │   └── administrador/
│   │   │   ├── features/                # Módulos de negocio en frontend
│   │   │   ├── services/                # Cliente de API
│   │   │   ├── hooks/
│   │   │   ├── styles/                  # Tokens y estilos del diseño aprobado
│   │   │   ├── types/
│   │   │   └── assets/
│   │   ├── package.json                 # Scripts y dependencias frontend
│   │   └── Dockerfile                   # Pendiente de implementación; no creado
│   ├── backend/
│   │   ├── app/
│   │   │   ├── api/                     # Endpoints y validación de entrada
│   │   │   ├── core/                    # Configuración y autorización
│   │   │   ├── modules/                 # Reglas de dominio
│   │   │   ├── models/                  # Modelos de persistencia
│   │   │   └── db/                      # Conexión y transacciones
│   │   ├── migrations/                  # Versionado del esquema
│   │   ├── tests/                       # Pruebas del backend
│   │   ├── requirements.txt             # Si se utiliza Python; pendiente, no creado
│   │   └── Dockerfile                   # Pendiente de implementación; no creado
│   ├── database/
│   │   └── seeds/                       # Datos ficticios para la demo
│   ├── .env.example                     # Pendiente; no creado
│   └── README.md                        # Pendiente; no creado
├── deploy/                              # Pendiente: despliegue e infraestructura
│   ├── development/
│   └── production/
├── tests/
│   ├── test_manizales_downloader.py    # Prueba existente
│   └── e2e/                             # Pendiente: recorridos completos de la app
└── compose.yaml                        # Pendiente: orquestación local prevista; no creado
```

Los archivos `.gitkeep` mantienen las carpetas todavía vacías. El frontend cliente usa su propio `package.json` y lockfile; Dockerfiles, backend, migraciones y despliegue siguen pendientes.

El resto de las rutas detalladas en la sección **Estructura actual del repositorio** permanece en su ubicación original: `Bases de datos/`, `docs/`, `Documentos-prototipos/`, `odd/tasks/`, los archivos raíz y las herramientas locales.

### Responsabilidades y límites entre carpetas

| Ruta | Qué debe contener | Qué debe quedar fuera |
| --- | --- | --- |
| `app/frontend/` | Carpeta creada; destinada a interfaces públicas y privadas, componentes compartidos, formularios, navegación superior y consumo de API. | Validaciones de autorización como única barrera de seguridad o SQL de negocio. |
| `app/backend/` | Carpeta creada; destinada a API, reglas de solicitudes y donaciones, evaluación, inventario, agenda, transporte, recepciones, servicios y reconocimientos. | Estilos, maquetas de presentación o credenciales en código fuente. |
| `app/database/` | Carpeta creada; destinada a *seeds* ficticios y recursos reproducibles. Las migraciones de esquema se mantienen en `app/backend/migrations/`. | Descargas exploratorias originales o datos personales reales. |
| `deploy/` *(pendiente)* | Configuración futura de entornos, despliegue, redes, volúmenes y automatización de infraestructura. | Reglas de priorización, asignaciones o lógica de frontend. |
| `docs/diseño/` | El **HTML final aprobado** (`Mockup_Alimenta_Taste_v7_Jornadas_Voluntariado.html`), lineamientos visuales y especificación `propuesta_mockup.md`. | Cambios directos para convertir el mockup en la aplicación de producción. |
| `Documentos-prototipos/` | Patentes de referencia, artículos científicos y análisis de aplicabilidad (`aplicabilidad-patentes-alimenta.md`). | Código fuente de la aplicación o secretos. |
| `Bases de datos/` | Exploración de fuentes y scripts existentes, incluido el trabajo de Manizales. | Esquema transaccional de la plataforma o secretos de infraestructura. |
| `tests/` | Pruebas existentes y futuros recorridos de extremo a extremo; las pruebas unitarias pueden residir junto a cada módulo. | Datos reales sensibles o artefactos generados sin control de versiones. |

### Arquitectura y tecnologías

Para una demo de alcance controlado, la opción recomendada es **un monolito modular**: un frontend web, una API y una base de datos relacional. No se necesitan microservicios inicialmente.

| Capa | Alternativa propuesta |
| --- | --- |
| Frontend | React + TypeScript + Vite |
| Estilos | CSS modular con los tokens y lineamientos institucionales ya acordados |
| Backend | Python + FastAPI |
| Persistencia | PostgreSQL y migraciones con Alembic |
| Pruebas | Pytest para API, Playwright para flujos de extremo a extremo |
| Desarrollo local | Docker Compose mediante `compose.yaml` en la raíz |

React + TypeScript + Vite están aprobados e instalados para la experiencia pública y las vistas demostrativas por rol. Las opciones de backend, persistencia, pruebas de backend y desarrollo integrado siguen siendo propuestas y no forman parte de la demo implementada. La arquitectura futura deberá preservar los permisos por rol en el servidor, las transacciones de inventario, la auditoría y la distinción entre donación comprometida y recepción confirmada.

### Frontend cliente disponible

La portada (`/`) presenta las rutas de aporte como vistas previas, organizaciones aliadas ficticias en un carrusel manual y una muestra de servicios. El directorio (`/servicios`) permite filtrar por comunidad, tipo, día y texto, y ofrece una lista accesible como alternativa a la representación esquemática.

La ruta `/acceso` abre vistas demostrativas con navegación superior para `/demo/donante`, `/demo/edil`, `/demo/agente` y `/demo/administrador`. Incluyen ejemplos de seguimiento de donaciones, inventario por estados y jornadas de voluntariado con registro local por el edil y moderación local por administración. Elegir una vista **no autentica ni concede permisos**. Todas las acciones usan estado transitorio del navegador, no llegan a un servidor, no cambian inventario real y se pierden al recargar.

Desde `app/frontend/`, con Node.js 24.18.0 y npm 11.16.0:

```bash
npm ci
npm run dev
npm run test -- --run
npm run build
```

El proyecto usa Vitest con jsdom y React Testing Library. El build ejecuta TypeScript y genera los recursos estáticos de Vite en `dist/`.

### Ejecución local prevista

Una vez se creen el código, los Dockerfiles, la configuración y las migraciones, el flujo de arranque deseado será:

```bash
cp app/.env.example app/.env
# Ajustar variables locales; app/.env debe estar ignorado por Git.
docker compose up --build
```

**Los comandos anteriores son una meta de implementación, no instrucciones ejecutables en el estado actual del repositorio.** No se deben incluir contraseñas, tokens ni datos privados en `.env.example` o en commits. El despliegue de producción requerirá configuración independiente, gestión segura de secretos, migraciones y respaldos de la base de datos.

### Regla para implementar a partir del mockup final

El HTML aprobado en [`docs/diseño/Mockup_Alimenta_Taste_v7_Jornadas_Voluntariado.html`](docs/dise%C3%B1o/Mockup_Alimenta_Taste_v7_Jornadas_Voluntariado.html) es la **referencia visual**; el producto se construye en `app/frontend/`. Deben mantenerse la navegación superior unificada, el diseño editorial, los paneles de selección, la paleta institucional y los carruseles con controles consistentes. Los flujos funcionales se desarrollan en `app/backend/` y no se validan únicamente desde el navegador. Las diferencias respecto del diseño o de la propuesta se documentan antes de implementarse.

## Dónde encontrar cada información

| Ruta | Uso dentro del proyecto |
| --- | --- |
| [`docs/product-brief.md`](docs/product-brief.md) | Punto de partida del problema, alcance, supuestos y preguntas abiertas. |
| [`docs/propuesta.md`](docs/propuesta.md) | Propuesta funcional que debe mantenerse alineada con el mockup final. |
| [`docs/diseño/`](docs/dise%C3%B1o/) | Materiales y lineamientos de diseño. |
| [`Documentos-prototipos/`](Documentos-prototipos/) | Referencias documentales y de prototipado. |
| [`docs/Rubrica_requerimientos.jpeg`](docs/Rubrica_requerimientos.jpeg) | Rúbrica de requisitos incluida en el repositorio. |
| [`Bases de datos/README.md`](Bases%20de%20datos/README.md) | Instrucciones y contexto del trabajo con datos. |
| [`Bases de datos/bases-datos.md`](Bases%20de%20datos/bases-datos.md) | Información disponible sobre el frente de datos. |
| [`tests/test_manizales_downloader.py`](tests/test_manizales_downloader.py) | Prueba relacionada con el descargador de Manizales. |
| [`odd/tasks/`](odd/tasks/) | Registro de tareas de fundamentación y procesamiento de datos. |
| [`PLAN_CAMBIOS_PROYECTO.md`](PLAN_CAMBIOS_PROYECTO.md) | Planificación y registro de cambios previsto en el repositorio. |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Pautas de contribución y revisión de propuestas. |
| `app/` | Esqueleto de carpetas vacío para el futuro frontend, backend y datos de inicialización de la demo. |
| `deploy/` y `compose.yaml` *(propuestos)* | Infraestructura y ejecución local; pendientes de implementar. |

## Trabajo con datos y pruebas

El directorio `Bases de datos/` contiene un script asociado a Manizales. **No se asume en este README cuál es su fuente de datos, qué parámetros acepta ni qué archivos genera**; estos detalles deben consultarse en su documentación y en el código antes de ejecutarlo. El hecho de disponer de datos de una ciudad no acredita que las ubicaciones de servicios comunitarios sean operativas o estén verificadas.

Con Python 3 (usando el módulo estándar `unittest`, sin dependencias externas), puede ejecutarse la prueba unitaria existente desde la raíz del repositorio:

```bash
python3 -m unittest discover -s tests -p 'test_manizales_downloader.py' -v
```

Este comando **ejecuta únicamente pruebas unitarias con transportes simulados**: no realiza descargas reales ni valida la API en vivo. Evita incluir credenciales, datos personales o archivos de gran tamaño sin revisar su procedencia y las reglas de publicación.

## Próximos pasos para la demo funcional

1. **Consolidar las fuentes de verdad:** contrastar [`docs/propuesta.md`](docs/propuesta.md) (incluidos los módulos fundamentados en patentes: Catálogo de Ayudas Técnicas UNAL, asistencia de equidad con datos agregados de Manizales `ab8a-uwf7` y reparto bajo escasez, emparejamiento donante–necesidad, capa accesible y Ruta PAP UNAL), los documentos de `docs/diseño/` y el mockup HTML final; registrar cualquier diferencia.
2. **Completar entregables de evaluación y transición de fase:** documentar los elementos pendientes de [`PLAN_CAMBIOS_PROYECTO.md`](PLAN_CAMBIOS_PROYECTO.md) (Plan 30–60–90 días, viabilidad/aliados e indicadores piloto) y formalizar en [`CONTRIBUTING.md`](CONTRIBUTING.md) el paso a fase de implementación antes de escribir código en `app/`.
3. **Preparar `app/` y `deploy/`:** aprobar o ajustar el stack sugerido; crear la estructura propuesta, los contratos API, la configuración de entorno, el arranque local y las migraciones sin mover las carpetas preexistentes.
4. **Implementar acceso y permisos:** desarrollar en `app/` la autenticación, verificación del edil y autorización de acciones por rol; no reutilizar el selector libre de rol del mockup como mecanismo real de seguridad.
5. **Completar un recorrido verificable:** solicitud → evaluación → ofrecimiento/asignación → horario → transporte → recepción confirmada → actualización de saldo.
6. **Extender la demo:** banco e inventario, aportes espontáneos, directorio público de servicios, reconocimientos y auditoría.
7. **Validar y preparar despliegue:** pruebas automatizadas (incluidas `tests/e2e/`), comparación visual con el HTML final, casos de citas simultáneas y entregas parciales; configurar `deploy/` y verificar migraciones, respaldos y variables de entorno.

Hasta que estos pasos se completen, los datos y escenarios utilizados para mostrar la interfaz deben etiquetarse como **demostrativos**, sin atribuirles disponibilidad o impacto real.

## Contribuciones

Antes de proponer cambios, revisa [`CONTRIBUTING.md`](CONTRIBUTING.md), el contexto de producto y el plan de cambios. Mantén diferenciadas las funcionalidades **propuestas**, las **implementadas** y las **validadas**. Documenta decisiones que afecten permisos, datos, asignaciones o la experiencia visual para que la futura demo mantenga coherencia con el diseño acordado.
