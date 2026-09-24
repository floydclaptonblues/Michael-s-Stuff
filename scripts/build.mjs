import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';import {salePrice} from '../core.mjs';
const products=JSON.parse(await readFile(new URL('../catalog.json',import.meta.url),'utf8'));const photos=JSON.parse(await readFile(new URL('../photos.json',import.meta.url),'utf8'));
for(const p of products)p.priceCents=salePrice(p.marketCents);
await writeFile(new URL('../catalog.js',import.meta.url),`window.CATALOG=${JSON.stringify(products)};\nwindow.PHOTOS=${JSON.stringify(photos)};\n`);
await mkdir(new URL('../dist',import.meta.url),{recursive:true});for(const f of ['index.html','style.css','app.js','core.mjs','catalog.js','catalog.json','photos.json','assets'])await cp(new URL('../'+f,import.meta.url),new URL('../dist/'+f,import.meta.url),{recursive:true});console.log(`Built ${products.length} listings. Priced: ${products.filter(p=>p.priceCents!==null).length}.`);
