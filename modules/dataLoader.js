// modules/dataLoader.js
// Parse CSV/Excel/JSON or pasted text into normalized table:
// { columns: ['C1','C2',...], rows: [{date, values:[...], raw}] }

const DataLoader = {
  async loadFile(file){
    const name = file.name.toLowerCase();
    if(name.endsWith('.csv') || name.endsWith('.txt')){
      const txt = await file.text();
      return this.parseCSV(txt);
    }
    if(name.endsWith('.json')){
      const txt = await file.text();
      const obj = JSON.parse(txt);
      return this.parseJSON(obj);
    }
    // Excel
    const arrayBuffer = await file.arrayBuffer();
    const wb = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
    return this.parse2DArray(json);
  },

  parseClipboard(textOrCSV){
    // Heuristics: JSON if starts with { or [
    const text = textOrCSV.trim();
    if(text.startsWith('{') || text.startsWith('[')){
      return this.parseJSON(JSON.parse(text));
    }
    // else CSV/TSV
    return this.parseCSV(text);
  },

  parseJSON(obj){
    // Support array of arrays, or array of objects
    if(Array.isArray(obj)){
      if(obj.length === 0) return { columns:[], rows:[] };
      if(Array.isArray(obj[0])){
        return this.parse2DArray(obj);
      }
      if(typeof obj[0] === 'object'){
        const columns = Object.keys(obj[0]);
        const rows = obj.map(r=>{
          const values = columns.map(c=> this._parseCell(r[c]));
          const date = (r.date || r.Date || r.datetime || r.time) || null;
          return { date, values, raw: r };
        });
        return { columns, rows };
      }
    }
    throw new Error('Unsupported JSON format');
  },

  parseCSV(text){
    // Very simple CSV parse with support for tabs
    const rows = text.split(/\r?\n/).filter(Boolean).map(r => r.split(/\t|,/));
    return this.parse2DArray(rows);
  },

  parse2DArray(arr){
    if(arr.length === 0) return { columns:[], rows:[] };
    // Detect header row: if first row has any non-numeric cell, treat as header
    const header = arr[0].map(String);
    let start = 1;
    // Detect if header contains 'date' or non-numeric
    const hasDate = header.some(h=>/date|time|day|year/i.test(h));
    const isHeader = header.some(h=>isNaN(Number(h)));
    const columns = isHeader ? header : arr[0].map((_,i)=>`C${i+1}`);
    if(!isHeader) start = 0;

    const rows = [];
    for(let i=start;i<arr.length;i++){
      const row = arr[i];
      if(!row || row.every(c => c==='' || c==null)) continue;
      // try to detect first column as date if header indicated date or value parse
      let date = null;
      const values = [];
      row.forEach((cell, idx)=>{
        const v = cell === undefined || cell === null || cell === "" ? null : String(cell).trim();
        if(idx === 0 && hasDate){
          date = v || null;
        } else {
          // try number
          const num = v === null ? null : (v === '' ? null : Number(v));
          values.push(Number.isNaN(num) ? v : num);
        }
      });
      // if we considered first column as date we might have fewer values than columns; align values length
      rows.push({ date, values, raw: row });
    }
    return { columns, rows };
  },

  _parseCell(v){
    if(v===null || v===undefined || v==='') return null;
    const n = Number(v);
    return Number.isNaN(n) ? String(v) : n;
  }
};

export default DataLoader;
