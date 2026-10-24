# ESFV - Retos 01, 02 y 03

Aplicación React para dimensionar un sistema fotovoltaico en una sola sesión. Universidad del Magdalena, Energía Solar Fotovoltaica 2026-II.

1. **Proyecto/contexto**: aplicación, integrantes, días de operación y tarifa.
2. **Cuadro de cargas (Reto 01)**: horarios, importación Excel y guardar/cargar JSON.
3. **Resultados (Reto 01)**: perfil de 24 h, energía y demanda máxima.
4. **Generador FV (Reto 02)**: recurso local/NASA POWER, módulo, PR, temperaturas y cadenas.
5. **MPPT y baterías (Reto 03)**: conversión con/sin almacenamiento, banco y balance (RF-25 a RF-36).

La lógica original del generador se conserva en `src/reto02/generador.js`, extraída sin cambiar sus ecuaciones. Reto 03 tiene motor independiente en `src/reto03/calculos.js` y recibe los resultados anteriores automáticamente.

## Ejecutar y verificar

Se recomienda Node.js 24 y pnpm 11.25.0. Se incluye lockfile para instalaciones reproducibles.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm lint
pnpm build
pnpm exec playwright install chromium
pnpm test:ui
```

Los scripts también se pueden ejecutar con npm. Las pruebas de interfaz usan `dist/` y arrancan/cierran su servidor en `127.0.0.1:4173`. En Windows con Edge instalado:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
pnpm test:ui
```

`allowBuilds.core-js: false` omite su script informativo postinstall, innecesario para esta aplicación. No se requieren credenciales para los catálogos ni pruebas.

## Flujo Reto 03

- Rama automática: **con almacenamiento** para off-grid e híbridos; **sin almacenamiento** para on-grid. Se admite selección explícita y volver a automática.
- Energía 06-18 h/fuera reconstruida desde el perfil. El criterio día/noche editable del Reto 01 permanece independiente.
- Cada equipo muestra tensiones, arranque, corrientes, reparto de cadenas por MPPT y veredicto **Cumple / No cumple / Alerta por dato no declarado**.
- Al elegir batería se proponen DoD, eficiencia y tensión compatibles, visibles y editables. LFP usa banco 51,2 V y clase nominal 48 V. No se permiten series fraccionarias.
- **Aceptar ajuste** añade cadenas completas en Reto 03, recalcula el balance y verifica de nuevo todos los equipos. Puede añadir más módulos que el mínimo energético. **Retirar ajuste** restaura el generador heredado. El dimensionamiento original de Reto 02 se mantiene.
- Las propuestas de reconexión conservan el número de módulos. Si ningún equipo individual cumple, se informa que hace falta otro equipo/reparto independiente, reconfigurar o reducir el generador.

## Catálogos externos y trazabilidad

| Archivo en `public/` | Contenido |
|---|---|
| `catalogo_modulos.json` | Catálogo previo de Reto 02, conservado |
| `base_datos_solar.json` | Recurso solar previo, conservado |
| `catalogo_conversion.json` | Seis comerciales: Victron SmartSolar Tr, Deye SUN-SG03LP1-EU y Solis S6 |
| `catalogo_conversion_tdr.json` | CTRL-A/B/C e INV-A/B/C, referencias académicas |
| `catalogo_baterias.json` | AGM/LFP declaradas por el TdR, sin fabricante comercial |

Los equipos reales identifican modelo/revisión, ficha oficial y fecha de consulta. Se incluyen familias utilizadas en Latinoamérica; las variantes EU de 220/230 V no se intercambian con US/LV. La aplicación comprueba compatibilidad CC; la variante de red y el BMS necesitan su comprobación propia.

**Editar/importar catálogos JSON** permite pegar y modificar `{ "conversion": [...], "baterias": [...] }`. La validación es atómica. El atributo `origen` mantiene referencias TdR y productos comerciales separados, incluso en el proyecto guardado.

## Método y supuestos

```text
Voc_frio = Voc * (1 + abs(betaVoc)/100 * (25 - Tmin))
Vmp_caliente = Vmp * (1 - abs(betaVoc)/100 * (Tcelda - 25))
Vmp_frio = Vmp * (1 + abs(betaVoc)/100 * (25 - Tmin))
Ns_max = floor(Vmax / Voc_frio_modulo)
I_banco = Ppico / Vnominal                  # sin 1,25
I_conductores_Reto03 = 1,25 * Isc           # separado del equipo
DC_AC = Ppico / Pac                         # rango inicial 1,0-1,3
Ecc = Ed / etaInv
Cn_Wh = Ecc * N / (DoD * fT)
Cn_Ah = Cn_Wh / Vbanco
Ns_bat = Vbanco / Vunidad                   # debe ser entero
Np_bat = ceil(Cn_Ah / Ah_unidad)
DoD_diario = Ecc / E_instalada
DoD_final = Ecc * N / E_instalada
Egen = Ecc / etaBat
Preq = Egen / (HSP * PR)
trec = N * Ecc / (Ppico * HSP * PR * etaBat - Ecc)
```

Energía interna en Wh, potencia en W y beta en %/°C. Se usa beta Voc también para Vmp, como Reto 02. Arranque verificado conservadoramente con Vmp caliente. PR se interpreta antes de las eficiencias nuevas; cada pérdida se aplica una sola vez. El método TdR aplica etaBat a toda Ed, incluso a cargas diurnas; no simula despacho horario híbrido.

`fT` reduce la capacidad disponible y se muestra `DoD_efectivo = DoD_final/fT`. C de carga usa Ppico/Vnominal antes de limitar el cargador; descarga usa Pmax/(etaInv × Vbanco). La comparación es energía instalada/vida declarada, no energía entregada ni costo por ciclo. El balance con cada HSP es por día de operación; la autonomía representa días consecutivos. Los días de operación del Reto 01 se conservan como contexto de consumo.

Los reguladores TdR no declaran ventana independiente ni Imp máximo: se muestra la envolvente derivada Vbat+5 a Vmax e Imp queda pendiente. Los inversores TdR no declaran arranque: se adopta mínimo MPPT como supuesto visible. Las baterías TdR no declaran límite C de descarga: se calcula la tasa y se alerta. Victron no declara Imp máximo independiente en la ficha citada: no se inventa. Un regulador CC requiere inversor CA independiente; la aplicación lo señala.

El indicador original de Reto 02 (`1,25 × 1,25 × Isc`) se conserva e identifica en su pestaña/informe; el factor de Reto 03 no se aplica al regulador. Quedan fuera conductores, protecciones, puesta a tierra y análisis económico de Reto 03.

## Persistencia e informes

JSON v3 conserva contexto, cargas, generador, recurso solar personalizado/NASA, entradas Reto 03 y catálogos completos. Los resultados se reconstruyen desde entradas. Se aceptan proyectos v1/v2 con valores iniciales de Reto 03. Las respuestas HTTP tardías no sobrescriben los datos restaurados.

El PDF ejecutivo integra tres retos en una página y resume cargas con indicadores/perfil de 24 h. El HTML conserva el cuadro detallado de cargas. El JSON conserva el detalle reconstruible.

Para generar el caso estandarizado y abrirlo con **Cargar proyecto**:

```sh
pnpm ejemplo:tdr
```

Crea `tmp/caso-tdr-reto03.json`. Consulte la [matriz RF y resultados esperados](docs/VALIDACION_RETO03.md).

Desarrollo asistido por IA (Codex); ecuaciones, fuentes, supuestos y pruebas quedan explícitos para revisión y sustentación.
