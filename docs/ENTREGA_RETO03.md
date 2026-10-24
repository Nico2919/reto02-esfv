# Entrega del proyecto - Reto 03 ESFV

## Objeto de la entrega

Dimensionamiento del regulador/inversor MPPT y banco de baterías. Una sola aplicación conserva las cargas y los paneles de los Retos 01/02 e incorpora las dos ramas del Reto 03. El alcance funcional y los resultados esperados se documentan en [VALIDACION_RETO03.md](VALIDACION_RETO03.md).

La versión 3.2.1 contiene el [paquete completo de revisión](../entrega/reto03/README.md), contrastado con la guía de tres páginas: [matriz de criterios y RF](../entrega/reto03/MATRIZ_ENTREGABLES.md). Incluye un recorrido guiado y nueve inversores comerciales con documentación oficial, descritos en [CATALOGO_INVERSORES.md](CATALOGO_INVERSORES.md).

## Demostración sugerida

1. Ejecutar `pnpm install --frozen-lockfile` y `pnpm dev`.
2. Abrir la dirección local y pulsar **Probar con un ejemplo**.
3. Verificar el caso AGM: 16 baterías y 38,40 kWh instalados; revisar el déficit en el mes con menos sol.
4. Cambiar a LFP: 5 baterías y 25,60 kWh. Abrir los ajustes para ver banco de 51,2 V y clase nominal de 48 V.
5. Elegir **No, usaré conexión a la red**: desaparece el banco y se comparan inversores sin almacenamiento.
6. Volver a baterías, añadir paneles para el escenario de menor sol y mostrar que se revisan otra vez los equipos. Deshacer la ampliación.
7. Guardar el JSON, cambiar un dato y abrirlo de nuevo. Descargar el informe PDF.

La demostración usa referencias TdR, identificadas como académicas. El catálogo comercial se selecciona en **Elige el equipo**. Allí se pueden actualizar los equipos de proyectos anteriores y filtrar inversores/reguladores. Los datos que no estén declarados en las fichas permanecen como pendientes; no se presentan como aprobados.

## Archivos para presentar

- Aplicación web integrada, código e instrucciones de la raíz; es la única versión funcional pedida por la guía.
- [Cinco proyectos JSON e informes PDF](../entrega/reto03/README.md#proyectos-que-se-pueden-abrir-e-informes): TdR AGM/LFP/sin baterías y caso propio propuesto antes/después del cierre.
- [Memoria del caso propio y sensibilidad](../entrega/reto03/MEMORIA_CASO_PROPIO.md), con resultados completos y tabla CSV.
- Guía de uso, método, matriz RF, catálogo y fuentes; [correspondencia con cada criterio](../entrega/reto03/MATRIZ_ENTREGABLES.md).
- Historial de versiones, pruebas y manifest de integridad verificado por GitHub Actions.

Los informes publicados incluyen Nicolas Paz, como consta en el proyecto local guardado. Los nombres, fecha e integrantes pueden corregirse en **Proyecto** antes de volver a exportar. El caso propio es una propuesta de estudio explícita; no se presenta como medición real. El uso de IA está declarado en el índice de entrega.

## Comprobaciones de una actualización

```sh
pnpm test
pnpm entrega:verificar
pnpm lint
pnpm build
pnpm exec playwright install chromium
pnpm test:ui
```

En Windows se puede usar Edge con `$env:PLAYWRIGHT_CHANNEL = 'msedge'`. Las pruebas de navegador comprueban el recorrido inicial, el ejemplo, ambas ramas, baterías, ampliación reversible, entradas inválidas, lectura de proyectos anteriores, PDF y pantallas pequeñas. El cálculo físico conserva sus pruebas de regresión.

El repositorio conserva su URL histórica y los retos anteriores. Si cambian las entradas de los casos, los catálogos de origen o el motor, ejecutar `pnpm entrega:generar`, revisar los cinco PDF y verificar la entrega antes de publicar. La rama `main` mantiene el código y sus evidencias actuales.
