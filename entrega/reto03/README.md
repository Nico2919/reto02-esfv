# Entrega del Reto 03 ESFV

**Versión 3.2.1 · 24 de octubre de 2026 · Nicolas Paz**

Esta carpeta reúne los archivos de revisión de la aplicación web. La guía pide una sola versión funcional: la aplicación de la [raíz del repositorio](../../README.md). Los informes y datos siguientes son sus salidas y evidencias, no versiones alternativas del programa.

## Índice de la entrega

| Elemento | Archivo o ubicación |
|---|---|
| Aplicación integrada, instalación y ejecución | [README principal](../../README.md), `src/` y `public/` |
| Contraste con la guía, sección por sección | [Matriz de entregables y requisitos](MATRIZ_ENTREGABLES.md) |
| Caso propio, método, selección y sensibilidad | [Memoria del caso propuesto](MEMORIA_CASO_PROPIO.md) |
| Manual para el usuario | [Guía de uso](../../docs/GUIA_USO.md) |
| Método y unidades | [Método de cálculo](../../docs/METODO_CALCULO.md) |
| Resultados numéricos de referencia | [Validación RF-25 a RF-36](../../docs/VALIDACION_RETO03.md) |
| Catálogos y fuentes de los fabricantes | [Catálogo documentado](../../docs/CATALOGO_INVERSORES.md), `public/catalogo_*.json` |
| Sensibilidad: seis escenarios | [Tabla CSV](resultados/sensibilidad.csv), [datos JSON](resultados/sensibilidad.json) |
| Integridad y versiones de las fuentes | [Manifest SHA-256](manifest.json) |
| Pruebas y verificación | `tests/`, `tests-ui/`, `scripts/verificar-entrega.mjs` y [GitHub Actions](https://github.com/Nico2919/reto02-esfv/actions) |
| Historial y uso de IA | [CHANGELOG](../../CHANGELOG.md) y declaración al final de esta página |

## Proyectos que se pueden abrir e informes

Los cinco PDF se generaron con la misma función de informe de la aplicación y tienen **una página cada uno**. Cada JSON contiene las entradas, horarios, recurso y catálogos usados; el JSON de resultados permite revisar todos los criterios de todos los equipos.

| Caso | Abrir en la aplicación | Informe de una página | Cálculos completos |
|---|---|---|---|
| TdR con AGM | [Proyecto JSON](casos/tdr-agm.json) | [Informe PDF](informes/tdr-agm.pdf) | [Resultados](resultados/tdr-agm.json) |
| TdR con LFP | [Proyecto JSON](casos/tdr-lfp.json) | [Informe PDF](informes/tdr-lfp.pdf) | [Resultados](resultados/tdr-lfp.json) |
| TdR sin almacenamiento | [Proyecto JSON](casos/tdr-sin-almacenamiento.json) | [Informe PDF](informes/tdr-sin-almacenamiento.pdf) | [Resultados](resultados/tdr-sin-almacenamiento.json) |
| Caso propuesto, generador de partida | [Proyecto JSON](casos/propio-partida.json) | [Informe PDF](informes/propio-partida.pdf) | [Resultados](resultados/propio-partida.json) |
| Caso propuesto, cierre con más paneles | [Proyecto JSON](casos/propio-cierre.json) | [Informe PDF](informes/propio-cierre.pdf) | [Resultados](resultados/propio-cierre.json) |

Para reproducir: descarga el proyecto JSON, ejecuta la aplicación, pulsa **Abrir proyecto** y revisa **5. Inversor y baterías**. No reingreses los datos. **Descargar informe** genera nuevamente su PDF.

Los reguladores y baterías TdR no son productos comerciales. Los límites no publicados por la guía permanecen pendientes y visibles: no se inventa Imp de reguladores ni límite continuo C de descarga. En el caso sin baterías, el balance negativo del mes crítico representa energía que debe aportar la red; no se promete autonomía.

## Regenerar y comprobar los archivos

```sh
pnpm install --frozen-lockfile
pnpm entrega:generar
pnpm entrega:verificar
pnpm test
pnpm lint
pnpm build
pnpm exec playwright install chromium
pnpm test:ui
```

La generación usa datos locales y no consulta servicios meteorológicos. La verificación compara las fuentes por SHA-256, reconstruye cada resultado desde su proyecto, revisa los cinco PDF y contrasta la sensibilidad. Si cambian el motor, las entradas o los catálogos de origen, se debe regenerar la entrega y revisar los informes antes del commit. GitHub Actions comprueba que los archivos publicados no queden desactualizados.

## Procedencia y sustentación

La matriz se contrastó con `TdR_Reto03_ESFV_2026II.pdf`, tres páginas, secciones 1 a 8. Su SHA-256 está registrado en el manifest para identificar la guía revisada. Las fechas oficiales se consultan en Campus Virtual; no figuran en el documento ni se inventan aquí.

El nombre Nicolas Paz se tomó del proyecto local previamente guardado. El perfil estandarizado de tres cargas reproduce los 7,580 kWh/día, 910 W a las 17 h y 5,180/2,400 kWh dentro/fuera de la ventana solar. El aula rural es un **caso de diseño propuesto con supuestos explícitos**, no una instalación ni una campaña de medición.

Se utilizó **IA (Codex)** en desarrollo, búsqueda y transcripción de fichas, documentación, preparación del caso y pruebas. En la sustentación, el integrante debe explicar las entradas, ecuaciones, redondeos, selección, límites pendientes y resultados. No se atribuyen los resultados calculados a valores de referencia reservados del docente.
