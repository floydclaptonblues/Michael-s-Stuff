export const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export const salePrice=cents=>Number.isInteger(cents)&&cents>0?Math.floor((cents*105+50)/100):null;
export const firstLetter=title=>{const c=normalize(title).charAt(0).toUpperCase();return /[A-Z]/.test(c)?c:'#';};
export function selectProducts(products,f={}){
 const terms=normalize(f.q).split(' ').filter(Boolean);
 let list=products.filter(p=>(!f.category||f.category==='All'||p.category===f.category)&&(!f.platform||p.platform===f.platform)&&(!f.region||p.region===f.region)&&(!f.condition||p.condition===f.condition)&&(!f.decade||(f.decade==='unknown'?!p.year:p.year&&`${Math.floor(p.year/10)*10}s`===f.decade))&&(!f.letter||firstLetter(p.title)===f.letter)&&terms.every(t=>normalize(`${p.title} ${p.platform} ${p.region} ${p.category} ${p.year||''}`).includes(t)));
 const alpha=(a,b)=>a.title.localeCompare(b.title,undefined,{numeric:true})||a.platform.localeCompare(b.platform);
 list.sort((a,b)=>{switch(f.sort){case'az':return alpha(a,b);case'za':return -alpha(a,b);case'old':return (a.year||9999)-(b.year||9999)||alpha(a,b);case'new':return (b.year||0)-(a.year||0)||alpha(a,b);case'low':return (a.priceCents??Infinity)-(b.priceCents??Infinity)||alpha(a,b);case'high':return (b.priceCents??-Infinity)-(a.priceCents??-Infinity)||alpha(a,b);default:return (b.featured||0)-(a.featured||0)||Number(b.priceCents!==null)-Number(a.priceCents!==null)||alpha(a,b)}});
 return list;
}
export function cleanCart(raw,products){return Array.isArray(raw)?[...new Set(raw)].filter(id=>products.some(p=>p.id===id&&p.stock>0)):[];}
export function cartSummary(ids,products){const list=products.filter(p=>ids.includes(p.id));return {list,knownSubtotal:list.reduce((n,p)=>n+(p.priceCents||0),0),pending:list.filter(p=>p.priceCents===null).length};}
