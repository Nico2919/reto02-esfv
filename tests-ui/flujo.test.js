import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import { proyectoTdr } from '../tests/fixtures.js';

let server, browser;
const errors = [];
const baseURL = 'http://127.0.0.1:4173';
before(async () => {
  await mkdir('tmp/qa', {recursive:true});
  server = spawn(process.execPath, ['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173','--strictPort'], {stdio:'ignore',windowsHide:true});
  let ready=false;
  for(let i=0;i<50;i++) { try { if((await fetch(baseURL)).ok) {ready=true; break;} } catch { /* server starting */ } await new Promise(r=>setTimeout(r,200)); }
  assert.ok(ready,'Vite preview must start');
  browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL ? {channel:process.env.PLAYWRIGHT_CHANNEL} : {})});
});
after(async () => { await browser?.close(); server?.kill(); });

async function pageTdr(data=proyectoTdr()) {
  const page=await browser.newPage({viewport:{width:1366,height:950}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(baseURL);
  await page.locator('input[type=file]').nth(1).setInputFiles({name:'caso.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await page.getByRole('button',{name:'5 MPPT y baterías'}).click();
  await page.getByText('38.40 kWh · 800.00 Ah',{exact:true}).waitFor();
  return page;
}
test('Pestaña 5: caso TdR, cambio de rama, LFP, ajustes y datos aguas arriba', async () => {
  const page=await pageTdr();
  assert.match(await page.locator('.reto03').innerText(),/200.67/);
  await page.screenshot({path:'tmp/qa/reto03-desktop.png',fullPage:true});
  await page.getByLabel('Rama',{exact:true}).selectOption('sin');
  assert.equal(await page.getByRole('heading',{name:'4. Banco de baterías'}).count(),0);
  assert.match(await page.locator('.reto03').innerText(),/DC\/AC 1.10/);
  await page.getByLabel('Rama',{exact:true}).selectOption('con');
  await page.getByLabel('Batería / tecnología').selectOption('tdr-lfp');
  await page.getByText('25.60 kWh · 500.00 Ah',{exact:true}).waitFor();
  assert.equal(await page.getByLabel('Tensión banco instalada (V)').inputValue(),'51.2');
  assert.equal(await page.getByLabel('Clase nominal regulador (V)').inputValue(),'48');
  await page.getByLabel('Batería / tecnología').selectOption('tdr-agm');
  await page.getByRole('button',{name:'Aceptar ajuste mes crítico'}).click();
  await page.getByText('4S × 2P · 8 módulos',{exact:true}).waitFor();
  assert.match(await page.locator('.reto03').innerText(),/Ningun equipo admite/);
  await page.getByRole('button',{name:'Retirar ajuste y volver al generador heredado'}).click();
  await page.getByRole('button',{name:'4 Generador FV'}).click();
  assert.match(await page.locator('body').innerText(),/2.20 kWp/);
  await page.getByRole('button',{name:'1 Proyecto / contexto'}).click();
  const tipo=page.getByRole('combobox');
  await tipo.selectOption('On-grid');
  await page.getByRole('button',{name:'5 MPPT y baterías'}).click();
  await page.getByLabel('Rama',{exact:true}).selectOption('auto');
  assert.equal(await page.getByRole('heading',{name:'4. Banco de baterías'}).count(),0);
  assert.match(await page.locator('.reto03').innerText(),/On-grid · 30 días\/mes/);
  await page.close();
});
test('Guardar/cargar reconstruye Reto 03 y genera PDF descargable de una pagina', async () => {
  const page=await pageTdr();
  await page.getByLabel('Autonomía (días)').fill('3');
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Guardar proyecto',exact:true}).click();
  const download=await downloadPromise; const saved=JSON.parse(await readFile(await download.path(),'utf8'));
  assert.equal(saved.version,3); assert.equal(saved.reto03.autonomia,3); assert.ok(saved.baseSolar); assert.equal(saved.catalogosReto03.conversion.length,12);
  const expected=await page.locator('.r3-metrics').nth(2).innerText();
  await page.getByLabel('Autonomía (días)').fill('1');
  await page.locator('input[type=file]').nth(1).setInputFiles({name:'guardado.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});
  await expect(page.getByLabel('Autonomía (días)')).toHaveValue('3');
  assert.equal(await page.locator('.r3-metrics').nth(2).innerText(),expected);
  const pdfPromise=page.waitForEvent('download'); await page.getByRole('button',{name:'Informe PDF · 1 página'}).click();
  const pdf=await pdfPromise; await pdf.saveAs('tmp/qa/informe-navegador.pdf');
  const content=await readFile('tmp/qa/informe-navegador.pdf'); assert.equal(content.subarray(0,4).toString(),'%PDF');
  await page.close();
});
test('Catalogo editable valida antes de aplicar y entradas invalidas bloquean', async () => {
  const page=await pageTdr();
  await page.getByRole('button',{name:'Editar / importar catálogos JSON'}).click();
  await page.getByLabel('Catálogos completos (conversion y baterias)').fill('{"conversion":[]}');
  await page.getByRole('button',{name:'Validar y aplicar catálogos'}).click();
  assert.match(await page.getByRole('alert').innerText(),/dos baterias/);
  await page.getByRole('button',{name:'Cancelar',exact:true}).click();
  await page.getByLabel('DoD de diseño (%)').fill('0');
  await page.getByRole('heading',{name:'Corrige las entradas para calcular'}).waitFor();
  assert.equal(await page.getByRole('heading',{name:'4. Banco de baterías'}).count(),0);
  await page.close();
});
test('RF-26: editar cargas y PR en Retos 01/02 actualiza la pestaña 5', async () => {
  const page=await pageTdr();
  await page.getByRole('button',{name:'2 Cuadro de cargas'}).click();
  await page.getByPlaceholder('Ej.: Aire acondicionado').fill('Carga adicional');
  await page.getByText('Potencia [W]',{exact:true}).locator('..').locator('input').fill('100');
  await page.getByPlaceholder('08-12;14-17').fill('17-18');
  await page.getByRole('button',{name:'Agregar carga',exact:true}).click();
  await page.getByRole('button',{name:'5 MPPT y baterías'}).click();
  await expect(page.getByText('7.680 kWh/día',{exact:true})).toBeVisible();
  await expect(page.locator('.r3-metrics').first().getByText('1010 W',{exact:true})).toBeVisible();
  await expect(page.getByText('5.280 / 2.400 kWh',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'4 Generador FV'}).click();
  await page.getByText('Factor global de desempeño (PR)',{exact:true}).locator('..').locator('input').fill('0.6');
  await page.getByRole('button',{name:'5 MPPT y baterías'}).click();
  assert.match(await page.locator('.r3-metrics').first().innerText(),/5.80 \/ 5.20 · 0.6/);
  assert.match(await page.locator('.reto03').innerText(),/3.065/);
  await page.close();
});
test('Retos 01/02 conservados, archivo v2 y pantalla movil sin desborde', async () => {
  const data=proyectoTdr(); data.version=2; delete data.reto03; delete data.catalogosReto03;
  const page=await browser.newPage({viewport:{width:390,height:844}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(baseURL);
  await page.locator('input[type=file]').nth(1).setInputFiles({name:'v2.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await page.getByRole('button',{name:'3 Resultados',exact:true}).click();
  assert.match(await page.locator('body').innerText(),/7.58/); assert.match(await page.locator('body').innerText(),/0.91/);
  await page.getByRole('button',{name:'5 MPPT y baterías'}).click();
  await page.getByText('38.40 kWh · 800.00 Ah',{exact:true}).waitFor();
  await page.screenshot({path:'tmp/qa/reto03-mobile.png',fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
  await page.close();
  assert.deepEqual(errors,[]);
});
