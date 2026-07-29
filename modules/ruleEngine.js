// modules/ruleEngine.js
// Loads rule modules (passed in) and runs them sequentially.
// Each rule should be an object with: id, name, description, enabledByDefault, enabled, run(data, context) -> Promise<result>

export default class RuleEngine {
  constructor(rules = []){
    // clone rules and ensure defaults
    this.rules = (rules || []).map(r => ({
      ...r,
      enabled: typeof r.enabled === 'boolean' ? r.enabled : !!r.enabledByDefault
    }));
  }

  async runAll(data, context){
    const report = {
      summary: { rulesRun: 0, issuesFound: 0 },
      perRule: [],
      highlights: [], // collected highlights across rules
      annotations: []
    };

    for(const rule of this.rules){
      if(!rule.enabled) continue;
      report.summary.rulesRun++;
      try{
        const res = await rule.run(data, context);
        const normal = res || {};
        report.perRule.push({ id: rule.id, name: rule.name, result: normal });
        // Merge highlights & annotations
        if(Array.isArray(normal.highlights)){
          report.highlights.push(...normal.highlights.map(h => ({ ruleId:rule.id, ruleName:rule.name, ...h })));
          report.summary.issuesFound += normal.highlights.reduce((s,h)=> s + (h.cells ? h.cells.length : 0), 0);
        }
        if(Array.isArray(normal.annotations)){
          report.annotations.push(...normal.annotations.map(a => ({ ruleId:rule.id, ruleName:rule.name, ...a })));
        }
      }catch(err){
        console.error('Rule error', rule.id, err);
        report.perRule.push({ id: rule.id, name: rule.name, error: String(err) });
      }
    }
    // Aggregate heatmap/frequency etc can be built here or provided by a stats rule
    return report;
  }
}
