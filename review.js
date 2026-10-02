import {statuses,exportReview,importReview,markdownReview} from './review-core.mjs';
const catalog=[...window.CATALOG].sort((a,b)=>a.title.localeCompare(b.title)||a.platform.localeCompare(b.platform));
const $=id=>document.getElementById(id), key='michaels-stuff-owner-review-v1';let choices={},page=0;const size=30;
function message(text){$('save-status').textContent=text;}
try{const saved=localStorage.getItem(key);if(saved)choices=importReview(JSON.parse(saved),catalog).choices;message('Ready. Choices save on this browser as you go.');}catch{message('Saved progress could not be loaded. Download a JSON backup before leaving this page.');}
function save(){try{localStorage.setItem(key,JSON.stringify(exportReview(catalog,choices)));message('Saved in this browser. Click Download List Here to download or print your decisions.');return true;}catch{message('Browser storage is unavailable or full. Download JSON now to keep your choices.');return false;}}
function el(tag,text){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;}
for(const name of [...new Set(catalog.map(p=>p.platform))].sort()){$('platform').add(new Option(name,name));}
function render(){
 updateLists();const report=exportReview(catalog,choices);$('counts').textContent=statuses.map(s=>`${s}: ${report.counts[s]}`).join(' · ');
 const query=$('query').value.trim().toLowerCase();const filtered=catalog.filter(p=>(!query||`${p.title} ${p.platform} ${p.id}`.toLowerCase().includes(query))&&(!$('platform').value||p.platform===$('platform').value)&&(!$('decision').value||(choices[p.id]||'Unreviewed')===$('decision').value));
 const pages=Math.max(1,Math.ceil(filtered.length/size));page=Math.min(page,pages-1);$('results').textContent=`${filtered.length} matching items · Downloads always include all ${catalog.length} items.`;$('page').textContent=`Page ${page+1} of ${pages}`;$('previous').disabled=page===0;$('next').disabled=page===pages-1;
 $('review-list').replaceChildren();
 for(const p of filtered.slice(page*size,(page+1)*size)){
  const row=el('article');row.className='review-item';const link=el('a');link.href=p.image;link.target='_blank';link.rel='noopener';link.setAttribute('aria-label',`Open source photo for ${p.title}`);const img=el('img');img.src=p.image;img.alt=`Source photo: ${p.title}`;img.loading='lazy';link.append(img);
  const content=el('div');content.append(el('h2',p.title),el('p',`${p.platform} · ${p.region||''} · ${p.year||'Year unknown'} · ${p.category} · ID: ${p.id}`));
  const field=el('fieldset');field.append(el('legend',`Destination for ${p.title} (${p.platform})`));
  for(const status of statuses.slice(1)){const label=el('label');label.className='choice';const radio=el('input');radio.type='radio';radio.name=p.id;radio.value=status;radio.checked=(choices[p.id]||'Unreviewed')===status;radio.addEventListener('change',()=>{choices[p.id]=status;save();updateLists();if($('decision').value){render();}else{$('counts').textContent=statuses.map(s=>`${s}: ${exportReview(catalog,choices).counts[s]}`).join(' · ');}});label.append(radio,el('span',status));field.append(label);}
  const undo=el('button','Undo choice');undo.className='undo-choice';undo.onclick=()=>{delete choices[p.id];save();render();};content.append(field,undo);row.append(link,content);$('review-list').append(row);
 }
 if(!filtered.length)$('review-list').append(el('p','No matching items. Try another search or decision filter.'));
}
for(const id of ['query','platform','decision'])$(id).addEventListener('input',()=>{page=0;render();});
for(const [id,step] of [['previous',-1],['next',1]])$(id).onclick=()=>{page+=step;render();$('review-list').scrollIntoView({block:'start'});};
function download(ext,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=el('a');a.href=url;a.download=`michaels-stuff-decisions-${new Date().toISOString().slice(0,10)}.${ext}`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
$('json').onclick=()=>download('json',JSON.stringify(exportReview(catalog,choices),null,2),'application/json');
$('markdown').onclick=()=>{download('md',markdownReview(exportReview(catalog,choices)),'text/markdown;charset=utf-8');$('download-status').textContent='Download started. Find michaels-stuff-decisions in Downloads and attach it to your message.';};
$('import').onchange=async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>5000000)throw Error('Choose a review JSON file smaller than 5 MB.');const result=importReview(JSON.parse(await file.text()),catalog);if(!confirm(`Import ${Object.keys(result.choices).length} selections? These replace matching items' current choices; other choices stay unchanged.`))return;choices={...choices,...result.choices};const saved=save();if(saved)message(`Imported ${Object.keys(result.choices).length} selections; ${result.skipped} old item IDs skipped. Download JSON for a fresh backup.`);page=0;render();}catch(error){message(error.message);}finally{event.target.value='';}};
function printReport(){const data=exportReview(catalog,choices),root=$('print-report');root.replaceChildren(el('h1',"Michael's Stuff — inventory decisions"),el('p',`Exported ${data.exportedAt}. Keep = owner keeps; Sell = owner sells personally; SPG = SavePoint Gaming.`));for(const status of statuses){root.append(el('h2',`${status} (${data.counts[status]})`));const table=el('table'),head=el('thead'),tr=el('tr');for(const text of ['ID','Title','Platform','Region'])tr.append(el('th',text));head.append(tr);table.append(head);const body=el('tbody');for(const item of data.items.filter(i=>i.status===status)){const row=el('tr');for(const text of [item.id,item.title,item.platform,item.region])row.append(el('td',text));body.append(row);}table.append(body);root.append(table);}}
window.addEventListener('beforeprint',printReport);$('print').onclick=()=>{printReport();window.print();};render();

function updateLists(){
 const data=exportReview(catalog,choices),sorted=catalog.length-data.counts.Unreviewed;
 $('open-lists').textContent='Download List Here';
 $('list-progress').textContent=`${sorted} of ${catalog.length} sorted. ${data.counts.Unreviewed} still need a decision. Downloads include undecided items separately.`;
 const root=$('list-groups');root.replaceChildren();
 for(const status of ['Keep','Sell','SPG','Unreviewed']){const group=el('details');group.open=status!=='Unreviewed';group.append(el('summary',`${status} · ${data.counts[status]} items`));if(!data.counts[status])group.append(el('p','No items here yet.'));for(const item of data.items.filter(i=>i.status===status))group.append(el('p',`${item.title} — ${item.platform}`));root.append(group);}
}
$('open-lists').onclick=()=>{updateLists();$('lists-dialog').showModal();};
$('close-lists').onclick=()=>$('lists-dialog').close();
