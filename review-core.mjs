export const statuses = ['Unreviewed', 'Keep', 'Sell', 'SPG'];
export function exportReview(catalog, choices, now = new Date().toISOString()) {
  const items = catalog.map(({id,title,platform,region,category,year,photo}) => ({id,title,platform,region,category,year,photo,status:statuses.includes(choices[id]) ? choices[id] : 'Unreviewed'}));
  return {schema:'michaels-stuff-review',version:1,exportedAt:now,legend:{Keep:'Owner keeps',Sell:'Owner sells personally',SPG:'SavePoint Gaming',Unreviewed:'No decision yet'},counts:Object.fromEntries(statuses.map(s=>[s,items.filter(i=>i.status===s).length])),items};
}
export function importReview(data, catalog) {
  if(data?.schema!=='michaels-stuff-review'||data.version!==1||!Array.isArray(data.items)) throw Error('Choose a JSON file exported by this review page.');
  const ids=new Set(catalog.map(i=>i.id)), seen=new Set(), choices={};let skipped=0;
  for(const item of data.items){
    if(!item||typeof item.id!=='string'||!statuses.includes(item.status)||seen.has(item.id)) throw Error('The file contains invalid or duplicate selections. Nothing was imported.');
    seen.add(item.id);if(ids.has(item.id))choices[item.id]=item.status;else skipped++;
  }
  return {choices,skipped};
}
const cell = value => String(value??'').replace(/\|/g,'\\|').replace(/[\r\n]+/g,' ').replace(/</g,'&lt;').replace(/>/g,'&gt;');
export function markdownReview(data){
  return `# Michael's Stuff — inventory decisions\n\nExported: ${data.exportedAt}\n\nKeep = owner keeps. Sell = owner sells personally. SPG = SavePoint Gaming.\n\n`+statuses.map(status=>`## ${status} (${data.counts[status]})\n\n| Item ID | Title | Console / platform | Region |\n| --- | --- | --- | --- |\n`+data.items.filter(i=>i.status===status).map(i=>`| ${[i.id,i.title,i.platform,i.region].map(cell).join(' | ')} |`).join('\n')).join('\n\n')+'\n';
}
