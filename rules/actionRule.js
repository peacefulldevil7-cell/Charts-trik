// rules/actionRule.js
// Action Number Analysis
// Mapping: 0<->5,1<->6,2<->7,3<->8,4<->9

const ACTION_MAP = { '0': '5', '1':'6','2':'7','3':'8','4':'9','5':'0','6':'1','7':'2','8':'3','9':'4' };

export default {
  id: 'action-number',
  name: 'Action Number Analysis',
  description: 'Highlights action numbers and replacement positions, finds repeating action patterns.',
  enabledByDefault: true,
  async run(table, context){
    const highlights = [];
    const patterns = [];
    const counts = {};
    table.rows.forEach((row,rIdx)=>{
      row.values.forEach((val,cIdx)=>{
        if(val === null || val === undefined) return;
        const s = String(val);
        if(s.length === 1 && ACTION_MAP.hasOwnProperty(s)){
          // mark action
          counts[s] = (counts[s]||0)+1;
          highlights.push({ type:'action', cells:[{r:rIdx,c:cIdx}], note:`Action ${s} mapped to ${ACTION_MAP[s]}`});
          // look for replacement positions: scan ahead few rows for mapped value
          const mapped = ACTION_MAP[s];
          for(let rr=rIdx+1; rr<Math.min(table.rows.length, rIdx+6); rr++){
            const foundIndex = table.rows[rr].values.findIndex(v=>String(v) === mapped);
            if(foundIndex >= 0){
              highlights.push({ type:'action', cells:[{r:rr,c:foundIndex}], note:`Replacement of ${s} -> ${mapped} (from row ${rIdx})`});
            }
          }
        }
      });
    });

    // find repeating action patterns of length 3
    const repeats = [];
    for(let r=0; r<table.rows.length-2; r++){
      const seq = table.rows.slice(r,r+3).map(rr => rr.values[0]===null ? '' : String(rr.values[0])).join('-');
      if(seq && seq.indexOf('null') === -1){
        // naive check: if later repeats
        for(let k=r+1;k<table.rows.length-2;k++){
          const seq2 = table.rows.slice(k,k+3).map(rr => rr.values[0]===null ? '' : String(rr.values[0])).join('-');
          if(seq === seq2){
            repeats.push({sequence:seq, positions:[r,k]});
          }
        }
      }
    }

    return {
      summary: { actionCounts: counts, repeatingPatterns: repeats.length },
      highlights,
      annotations: repeats.map(r=> ({ type:'repeat', detail:r }))
    };
  }
};
