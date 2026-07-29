// modules/chartView.js
// Wrap Chart.js display and simple interactions

export default class ChartView {
  constructor(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chart = null;
    this.loadedTable = null;
    this.highlighted = { cells: [] };
    // register zoom plugin if available
    if(window.Chart && window.Chart.registry && window['chartjs_plugin_zoom']){
      // plugin auto-registered by CDN script
    }
    this._initEmptyChart();
  }

  _initEmptyChart(){
    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'nearest', intersect: false },
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { enabled: true },
          zoom: {
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: 'x'
            },
            pan: {
              enabled: true,
              mode: 'x'
            }
          }
        },
        scales: {
          x: { title: { display: true, text: 'Index/Date' } },
          y: { title: { display: true, text: 'Value' } }
        }
      }
    });
  }

  loadData(table){
    this.loadedTable = table;
    // convert columns: each column -> dataset
    const labels = table.rows.map((r,i)=> r.date || String(i+1));
    const datasets = [];
    // If table.columns indicates headers and rows.values length equals columns length-? We will assume each value index is a series.
    const maxCols = Math.max(...table.rows.map(r=>r.values.length), 0);
    for(let c=0;c<maxCols;c++){
      const data = table.rows.map(r=> typeof r.values[c] === 'number' ? r.values[c] : null);
      datasets.push({
        label: table.columns[c+1] || `Series ${c+1}`,
        data,
        borderColor: this._colorFor(c),
        backgroundColor: this._colorFor(c,0.12),
        spanGaps: true,
        pointRadius: 3
      });
    }
    this.chart.data.labels = labels;
    this.chart.data.datasets = datasets;
    this.chart.update();
    this._renderSeriesList();
  }

  _colorFor(i,alpha=1){
    const palette = ['#4ad2ff','#7ef1c6','#ffd166','#ff7ab6','#b28cff','#ffb77a','#7dd3fc','#a6ffcb'];
    const c = palette[i % palette.length];
    if(alpha===1) return c;
    // hex to rgba quick
    const r = parseInt(c.substr(1,2),16);
    const g = parseInt(c.substr(3,2),16);
    const b = parseInt(c.substr(5,2),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  _renderSeriesList(){
    const el = document.getElementById('seriesList');
    el.innerHTML = '';
    this.chart.data.datasets.forEach((ds,i)=>{
      const btn = document.createElement('button');
      btn.className = 'series-btn';
      btn.style.border = 'none';
      btn.style.background = 'transparent';
      btn.style.color = '#cfeff6';
      btn.textContent = ds.label || `S${i+1}`;
      btn.onclick = ()=> {
        ds.hidden = !ds.hidden;
        this.chart.update();
      };
      el.appendChild(btn);
    });
  }

  highlightCell(rowIndex, colIndex){
    // set an overlay highlight on a point (if exists)
    if(!this.chart || !this.chart.data.datasets[colIndex]) return;
    const meta = this.chart.getDatasetMeta(colIndex);
    const point = meta.data[rowIndex];
    if(!point) return;
    // temporary highlight by changing point radius & border
    const ds = this.chart.data.datasets[colIndex];
    ds.pointRadius = ds.pointRadius || 3;
    // animate by toggling size
    const original = ds.pointRadius;
    ds.pointRadius = 8;
    this.chart.update();
    setTimeout(()=>{
      ds.pointRadius = original;
      this.chart.update();
    }, 800);
  }

  applyHighlights(results){
    // results: { highlights: [ { type, cells: [{r,c}] } ], annotations: [...] }
    if(!results) return;
    this.highlighted = results.highlights || {};
    // For a simple visual link, change dataset background or border for series with many highlights
    const counts = {};
    (results.highlights || []).forEach(h=>{
      (h.cells||[]).forEach(cell=>{
        counts[cell.c] = (counts[cell.c]||0)+1;
      });
    });
    this.chart.data.datasets.forEach((ds,i)=>{
      const cnt = counts[i]||0;
      ds.borderWidth = cnt > 0 ? 3 : 2;
      ds.borderDash = cnt>0 ? [6,4] : [];
    });
    this.chart.update();
  }

  resetZoom(){
    if(this.chart.resetZoom) this.chart.resetZoom();
  }
}
