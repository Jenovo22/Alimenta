# Instrucciones para agentes que desarrollen la demo de Alimenta

## Referencias normativas, en orden

1. `Mockup_Alimenta_Taste_v6_Menu_Superior.html` — **diseño aprobado**, estructura de pantallas y microinteracciones. No modificar este archivo: usarlo como patrón de comparación.
2. `propuesta_mockup.md` — alcance, roles, reglas, flujos y criterios AC-01…AC-20.
3. `lineamientos_diseno.md` — identidad, navegación, carruseles, componentes, tamaños y accesibilidad.
4. `alimenta_paleta_colores.json` — valores reutilizables de identidad y UI.
5. `../../README.md` y `../propuesta.md` — estructura de `app/` y `deploy/`, stack sugerido para la generación de código y módulos asistidos autorizados (**modelo de ponderación social + herramienta `US8494885B2`**, Catálogo de Ayudas Técnicas UNAL, emparejamiento asistido y Ruta PAP UNAL desacoplada sin datos clínicos).

> **Regla de implementación:** al generar código en `app/` y `deploy/`, usar **exclusivamente** las directrices ya escritas en los archivos del repositorio (incluyendo la pila tecnológica sugerida en `README.md` para construir la demo) sin alterar ni sobrescribir las directrices vigentes ni el HTML v6 congelado. Los módulos asistidos de `docs/propuesta.md` deben integrarse respetando el menú superior, la paleta y el control humano (*Human-in-the-Loop*).

## Restricciones de desarrollo

- No introducir sidebar: **menú superior en las cuatro áreas privadas**.
- No crear ruta pública independiente para aliados: el destacado y el listado de 10 van en **Inicio**.
- Compartir carrusel en público/donante/edil/admin, con selector **abajo a la izquierda**; no autoplay.
- Mantener al agente como responsable de G, inventario, agenda del banco y publicación del ranking; el agente no transporta por defecto.
- Transporte a cargo del donante, o de otro donante que acepte el transporte desde el banco.
- No descontar saldo pendiente ni aumentar inventario bancario a partir de una promesa.
- No crear una necesidad a partir de una donación espontánea a edil.
- Usuarios y organizaciones de desarrollo serán ficticios; no publicar datos reales o domicilios personales.
- No permitir elección de rol como forma de elevar permisos en entornos funcionales.
- No ocultar errores de red/servidor simulando que una operación se guardó.

## Secuencia sugerida

1. Inventariar pantallas y construir shell de navegador con rutas y barra superior.
2. Implementar tokens y componentes compartidos antes de duplicar vistas.
3. Modelar tablas, roles y máquinas de estados; probar validaciones de dominio.
4. Implementar escenarios P0 verticales: solicitud → evaluación → aporte → cita → transporte → recepción.
5. Implementar banco → reserva → transportador → confirmación, servicios públicos y Top 10.
6. Automatizar escenarios AC y comparar capturas con el HTML en 1440, 1024, 768, 390 y 320 px.

## Política de cambios

Cualquier divergencia respecto al HTML final se presenta con captura, justificación funcional o accesibilidad, y autorización del equipo. **No** simplificar quitando vistas o mezclando estados de negocio. Las decisiones abiertas indicadas en `propuesta_mockup.md` no se resolverán como hechos sin revisión del responsable del producto.
