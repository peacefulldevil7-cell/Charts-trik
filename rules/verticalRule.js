// rules/verticalRule.js
// Analyze columns

export default {
  id: 'vertical-analysis',
  name: 'Vertical (Column) Analysis',
  description: 'Analyzes columns for repeats, action replacements, cycles, mirror values, chains.',
  enabledByDefault: true,
  async run(table, context){
    const highlights = [];
    const cols = Math.max(...table.rows.map(r=>r.values.length));
    for(let c=0;c<cols;c++){
      const colVals = table.rows.map(r=> r.values[c] === undefined ? null : r.values[c]);
      // repeats
      const seen = {};
      colVals.forEach((v,idx)=>{
        if(v === null) return;
        const s = String(v);
        if(seen[s] !== undefined){
          highlights.push({ type:'col-repeat', cells:[{r:seen[s],c},{r:idx,c}], note:`Value ${s} repeats in column ${c}`});
        } else seen[s] = idx;
      });
      // simple mirror detection: compare first half and reversed second half
      const half = Math.floor(colVals.length/2);
      let mirrorCount = 0;
      for(let i=0;i<half;i++){
        if(colVals[i] !== null && colVals[colVals.length-1-i] !== null && String(colVals[i]) === String(colVals[colVals.length-1-i])) mirrorCount++;
      }
      if(mirrorCount >= 2) {
        highlights.push({ type:'mirror', cells:[], note:`Column ${c} shows ${mirrorCount} mirrored values`});
      }
    }
    return { summary: { colsAnalyzed: cols }, highlights };
  }
};
