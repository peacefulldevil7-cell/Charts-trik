// modules/ui.js
// Basic UI helpers and renderers

const UI = {
  bindUI(handlers = {}){
    document.getElementById('btnUpload').onclick = handlers.onUpload;
    document.getElementById('btnPaste').onclick = handlers.onPasteOpen;
    document.getElementById('btnRunAll').onclick = handlers.onRunAnalysis;
    document.getElementById('btnSaveAnalysis').onclick = handlers.onSaveAnalysis;
    document.getElementById('btnExportExcel').onclick = handlers.onExportExcel;
    document.getElementById('btnPrintReport').onclick = handlers.onPrintReport;
    document.getElementById('btnUploadRule').onclick = handlers.onUploadRule;
    document.getElementById('btnSearchNumber').onclick = handlers.onSearchNumber;
    document.getElementById('darkModeToggle').onchange = handlers.onToggleTheme;
    // paste modal
    const pasteModal = document.getElementById('pasteModal');
    document.getElementById('btnPaste').onclick = () => this.showPasteModal();
    document.getElementById('btnPasteCancel').onclick = () => this.hidePasteModal();
    document.getElementById('btnPasteOk').onclick = () => {
      const t = document.getElementById('pasteArea').value;
      handlers.onPasteImport && handlers.onPasteImport(t);
    };
    // file open
    document.getElementById('btnLoadAnalysis').onclick = async ()=>{
      const analyses = await (await import('../modules/storage.js')).default.listAnalyses();
      const id = prompt('Saved analyses:\n' + analyses.map(a=> `${a.id} - ${a.name} (${a.timestamp})`).join('\n') + '\n\nEnter ID to load:');
      if(id){
        const rec = await (await import('../modules/storage.js')).default.getAnalysis(id);
        if(rec){
          // load data and results into UI
          this.showMessage('Loaded analysis: ' + rec.name, 'success');
          window.location.reload(); // simple approach: reload to reset state; advanced could inject data
        } else {
          this.showMessage('Analysis not found', 'error');
        }
      }
    };
  },

  showPasteModal(){
    document.getElementById('pasteModal').hidden = false;
    document.getElementById('pasteArea').value = '';
  },
  hidePasteModal(){ document.getElementById('pasteModal').hidden = true; },

  renderTable(table, onCellClick){
    const container = document.getElementById('tableContainer');
    container.innerHTML = '';
    const tableEl = document.createElement('table');
    tableEl.className = 'table';
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const first = document.createElement('th'); first.textContent = 'Date/Index'; tr.appendChild(first);
    const headersCount = Math.max(...table.rows.map(r=>r.values.length));
    for(let c=0;c<headersCount;c++){
      const th = document.createElement('th');
      th.textContent = table.columns[c+1] || `C${c+1}`;
      tr.appendChild(th);
    }
    thead.appendChild(tr);
    tableEl.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.rows.forEach((r,ri)=>{
      const tr = document.createElement('tr');
      const tdDate = document.createElement('td'); tdDate.textContent = r.date || ri+1; tr.appendChild(tdDate);
      for(let c=0;c<headersCount;c++){
        const td = document.createElement('td');
        td.textContent = r.values[c] === null || r.values[c] === undefined ? '' : r.values[c];
        td.onclick = ()=> onCellClick && onCellClick({rowIndex:ri,colIndex:c,value:r.values[c]});
        td.dataset.row = ri; td.dataset.col = c;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
    tableEl.appendChild(tbody);
    container.appendChild(tableEl);
  },

  renderRulesList(rules, toggleCb){
    const el = document.getElementById('rulesList');
    el.innerHTML = '';
    rules.forEach(r=>{
      const item = document.createElement('div');
      item.className = 'rule-item';
      const left = document.createElement('div');
      left.style.display='flex'; left.style.alignItems='center';
      const chk = document.createElement('input'); chk.type='checkbox'; chk.checked = !!r.enabled;
      chk.onchange = ()=> toggleCb(r.id, chk.checked);
      left.appendChild(chk);
      const meta = document.createElement('div'); meta.className='meta';
      meta.innerHTML = `<strong>${r.name}</strong><div style="font-size:12px;color:var(--muted)">${r.description || ''}</div>`;
      left.appendChild(meta);
      item.appendChild(left);
      const btns = document.createElement('div');
      const info = document.createElement('button'); info.textContent='Info'; info.onclick = ()=> alert(`${r.name}\n\n${r.description||''}`);
      btns.appendChild(info);
      item.appendChild(btns);
      el.appendChild(item);
    });
  },

  renderReport(report, rules){
    const el = document.getElementById('reportContainer');
    el.innerHTML = '';
    const sum = document.createElement('div');
    sum.innerHTML = `<strong>Rules run:</strong> ${report.summary.rulesRun}<br><strong>Issues found (total highlighted cells):</strong> ${report.summary.issuesFound}`;
    el.appendChild(sum);
    report.perRule.forEach(pr=>{
      const card = document.createElement('div');
      card.style.padding = '8px';
      card.style.borderTop = '1px solid rgba(255,255,255,0.03)';
      if(pr.error){
        card.innerHTML = `<strong>${pr.name}</strong> - Error: ${pr.error}`;
      } else {
        card.innerHTML = `<strong>${pr.name}</strong> - ${JSON.stringify(pr.result.summary || {found: (pr.result.highlights ? pr.result.highlights.length : 0)})}`;
      }
      el.appendChild(card);
    });
  },

  applyHighlights(report){
    // highlights map to table cells by adding a CSS class
    const table = document.querySelector('.table tbody');
    if(!table) return;
    // clear old highlights
    table.querySelectorAll('td').forEach(td=> td.classList.remove('highlight-cell','highlight-action','highlight-redfigure'));
    (report.highlights || []).forEach(h=>{
      const cls = h.type === 'action' ? 'highlight-action' : (h.type==='redfigure' ? 'highlight-redfigure' : 'highlight-cell');
      (h.cells || []).forEach(c=>{
        const selector = `td[data-row="${c.r}"][data-col="${c.c}"]`;
        const td = table.querySelector(selector);
        if(td) td.classList.add(cls);
      });
    });
  },

  renderSearchResults(results){
    const el = document.getElementById('searchResults');
    el.innerHTML = '';
    if(results.length === 0){ el.textContent = 'No occurrences found'; return; }
    results.forEach(r=>{
      const div = document.createElement('div');
      div.textContent = `#${r.value} — Row ${r.row} Col ${r.col} ${r.date ? 'Date: ' + r.date : ''}`;
      el.appendChild(div);
    });
  },

  showMessage(text, level='info'){
    console.log('[UI]',level,text);
    // quick toast using native alert for now or in-page message
    const el = document.createElement('div');
    el.textContent = text;
    el.style.position = 'fixed';
    el.style.right = '20px';
    el.style.bottom = '20px';
    el.style.padding = '12px 18px';
    el.style.borderRadius = '12px';
    el.style.background = level === 'error' ? 'rgba(255,40,40,0.9)' : (level === 'success' ? 'rgba(20,200,120,0.9)' : 'rgba(60,120,255,0.9)');
    el.style.color = '#012';
    el.style.zIndex = 9999;
    document.body.appendChild(el);
    setTimeout(()=> el.remove(), 2600);
  },

  toggleTheme(e){
    document.documentElement.classList.toggle('light', e.target.checked === false);
  }
};

export default UI;
