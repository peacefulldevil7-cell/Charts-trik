// rules/customRuleBuilder.js
// Basic custom rule builder interface stub (no-code builder first version)
// Example stored rule JSON could be saved to IndexedDB and executed here.

export default {
  id: 'custom-builder',
  name: 'Custom Rule Builder',
  description: 'Let users create simple rules (no-code): condition -> result. Example: if values contain 46 and 68 then highlight.',
  enabledByDefault: true,
  async run(table, context){
    // In v1, load rules from localStorage (key: customRules) and execute simple conditions
    const raw = localStorage.getItem('customRules');
    if(!raw) return { summary: { customRules: 0 }, highlights: [], annotations: [] };
    let rules = [];
    try { rules = JSON.parse(raw); } catch(e){ rules = []; }
    const highlights = [];
    for(const r of rules){
      // r: { id, name, conditions: [{value:46}], result: { highlight: true } }
      table.rows.forEach((row,ri)=>{
        row.values.forEach((v,ci)=>{
          if(r.conditions.some(c=> String(c.value) === String(v))){
            highlights.push({ type:'custom', cells:[{r:ri,c:ci}], note:`Custom rule ${r.name}` });
          }
        });
      });
    }
    return { summary: { customRules: rules.length }, highlights, annotations: [] };
  }
};
