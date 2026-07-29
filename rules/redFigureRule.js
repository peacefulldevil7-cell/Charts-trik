// rules/redFigureRule.js
// Recognize 00,11,...99

export default {
  id: 'red-figure',
  name: 'Red Figure Analysis',
  description: 'Finds double-digit repeated ("red") figures like 00,11,22,...99.',
  enabledByDefault: true,
  async run(table, context){
    const highlights = [];
    const freq = {};
    table.rows.forEach((row,rIdx)=>{
      row.values.forEach((v,cIdx)=>{
        if(v === null || v === undefined) return;
        const s = String(v).padStart(2,'0');
        if(s[0] === s[1]){
          // red figure found
          highlights.push({ type:'redfigure', cells:[{r:rIdx,c:cIdx}], note: `Red figure ${s}` });
          freq[s] = (freq[s]||0)+1;
        }
      });
    });

    // previous and next value for each red occurrence
    const patternReport = highlights.map(h=>{
      const c = h.cells[0];
      const prevRow = table.rows[c.r-1];
      const nextRow = table.rows[c.r+1];
      return {
        position: c,
        value: table.rows[c.r].values[c.c],
        prev: prevRow ? prevRow.values[c.c] : null,
        next: nextRow ? nextRow.values[c.c] : null
      };
    });

    return {
      summary: { redCount: highlights.length, frequency: freq },
      highlights,
      annotations: patternReport
    };
  }
};
