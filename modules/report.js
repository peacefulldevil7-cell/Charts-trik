// modules/report.js
// Export results to Excel using SheetJS

const Report = {
  exportExcel(report){
    const wb = XLSX.utils.book_new();
    // per-rule sheet
    report.perRule.forEach(pr=>{
      const rows = [];
      rows.push(['Rule', pr.name]);
      if(pr.error){
        rows.push(['Error', pr.error]);
      } else {
        rows.push(['Summary', JSON.stringify(pr.result.summary || {})]);
        const highlights = pr.result.highlights || [];
        if(highlights.length){
          rows.push([]);
          rows.push(['Type','Row','Col','Note']);
          highlights.forEach(h=>{
            (h.cells||[]).forEach(c=>{
              rows.push([h.type, c.r, c.c, h.note || '']);
            });
          });
        }
      }
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, pr.name.substring(0,28));
    });

    // summary sheet
    const sumRows = [
      ['Rules run', report.summary.rulesRun],
      ['Issues found', report.summary.issuesFound],
      ['Generated at', new Date().toISOString()]
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sumRows), 'Summary');

    XLSX.writeFile(wb, 'analysis_report.xlsx');
  }
};

export default Report;
