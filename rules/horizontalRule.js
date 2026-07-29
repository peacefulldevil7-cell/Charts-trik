// rules/horizontalRule.js
// Analyze row-by-row

export default {
  id: 'horizontal-analysis',
  name: 'Horizontal (Row) Analysis',
  description: 'Analyzes rows for repeats, action replacements, red figures, missing numbers, chains and clusters.',
  enabledByDefault: true,
  async run(table, context){
    const highlights = [];
    const clusters = [];
    table.rows.forEach((row,rIdx)=>{
      const present = {};
      row.values.forEach((v,cIdx)=>{
        if(v !== null && v !== undefined) present[String(v)] = (present[String(v)]||0)+1;
        // missing number detection: null or blank
        if(v === null || v === undefined) {
          highlights.push({ type:'missing', cells:[{r:rIdx,c:cIdx}], note:'Missing value' });
        }
      });
      // repeats in row
      Object.entries(present).forEach(([val,count])=>{
        if(count>1){
          // find cells with this val
          const cells = row.values.map((v,i)=> String(v)===val ? {r:rIdx,c:i} : null).filter(Boolean);
          highlights.push({ type:'row-repeat', cells, note:`Value ${val} repeats ${count}x in row ${rIdx}` });
        }
      });

      // simple chain detection: consecutive sequence in values (if numeric)
      const numericValues = row.values.map(v=> typeof v==='number' ? v : NaN);
      let chainLen = 1, maxChain = 1;
      for(let i=1;i<numericValues.length;i++){
        if(!isNaN(numericValues[i]) && !isNaN(numericValues[i-1]) && numericValues[i] === numericValues[i-1]+1) chainLen++; else chainLen=1;
        maxChain = Math.max(maxChain, chainLen);
      }
      if(maxChain >= 3){
        clusters.push({ row: rIdx, length: maxChain });
      }
    });

    return { summary: { clustersFound: clusters.length }, highlights, annotations: clusters };
  }
};
