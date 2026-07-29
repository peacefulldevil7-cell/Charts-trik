// rules/statsRule.js
// Frequency, most/least repeated, heatmap data

export default {
  id: 'statistics',
  name: 'Statistics',
  description: 'Generates frequency counts, most/least repeated numbers, action counts, red figure counts, monthly/yearly stats.',
  enabledByDefault: true,
  async run(table, context){
    const freq = {};
    table.rows.forEach(row=>{
      row.values.forEach(v=>{
        if(v === null || v === undefined) return;
        const s = String(v);
        freq[s] = (freq[s]||0) + 1;
      });
    });
    const entries = Object.entries(freq).sort((a,b)=>b[1]-a[1]);
    const most = entries.slice(0,5);
    const least = entries.slice(-5);
    return {
      summary: { totalUnique: entries.length, mostRepeated: most, leastRepeated: least },
      highlights: [],
      annotations: []
    };
  }
};
