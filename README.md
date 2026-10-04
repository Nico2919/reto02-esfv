# Reto 02 — Dimensionamiento del Generador Fotovoltaico

Aplicación web desarrollada para el **Reto 02 de Energía Solar Fotovoltaica (ESFV)** de Ingeniería Electrónica — Universidad del Magdalena.

La aplicación constituye la segunda etapa del Reto 01 y permite utilizar automáticamente los resultados del dimensionamiento de cargas para realizar el dimensionamiento del generador fotovoltaico.

---

## 1. Descripción

El sistema integra los resultados obtenidos en el Reto 01 con la información del recurso solar y un catálogo de módulos fotovoltaicos comerciales.

A partir de la energía diaria requerida, el recurso solar disponible, el factor global de desempeño y las restricciones eléctricas declaradas, la aplicación calcula:

- Potencia pico requerida del generador.
- Número entero de módulos.
- Potencia instalada.
- Excedente o déficit de potencia.
- Número de módulos en serie.
- Número de cadenas en paralelo.
- Tensión de circuito abierto corregida a temperatura mínima.
- Tensión de operación del generador.
- Corriente de cortocircuito.
- Corriente de diseño.
- Temperatura estimada de célula mediante modelo NOCT.
- Área requerida por el generador.
- Energía diaria estimada del generador.

La aplicación también permite comparar diferentes módulos comerciales y seleccionar automáticamente una alternativa viable.

---

## 2. Funcionalidades principales

### Reto 01

La aplicación conserva las funcionalidades relacionadas con el cuadro de cargas y permite obtener:

- Energía diaria.
- Perfil horario de 24 horas.
- Demanda máxima.
- Hora de máxima demanda.
- Energía dentro y fuera de la ventana solar.
- Información general del proyecto.

Los resultados necesarios para el Reto 02 son heredados automáticamente, evitando que el usuario tenga que volver a introducir la información de las cargas.

### Reto 02

El módulo de dimensionamiento permite:

- Seleccionar el recurso solar mediante una base de datos local.
- Consultar NASA POWER.
- Trabajar con los datos solares en el plano del generador.
- Utilizar el promedio anual o el mes crítico.
- Configurar el PR.
- Configurar la tensión máxima del sistema.
- Configurar la temperatura mínima.
- Configurar la temperatura de operación.
- Declarar el área disponible.
- Seleccionar automáticamente un módulo comercial.
- Forzar manualmente un módulo del catálogo.
- Verificar la viabilidad eléctrica de las cadenas.
- Generar informes en PDF y HTML.

---

## 3. Tecnologías utilizadas

- React
- Vite
- JavaScript / JSX
- Recharts
- XLSX
- jsPDF
- jsPDF-AutoTable
- Lucide React

---

## 4. Requisitos

Para ejecutar el proyecto se requiere:

- Node.js
- npm
- Navegador web moderno

El proyecto fue desarrollado y probado mediante Vite.

---

## 5. Instalación

Clonar o descargar el repositorio y entrar en la carpeta del proyecto:

```bash
cd Reto02_ESFV
