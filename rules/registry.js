// rules/registry.js
// Expose built-in rules. New rules can be added to app at runtime via upload or by editing this file at development time.

import actionRule from './actionRule.js';
import redFigureRule from './redFigureRule.js';
import horizontalRule from './horizontalRule.js';
import verticalRule from './verticalRule.js';
import manualRule from './manualRule.js';
import searchRule from './searchRule.js';
import statsRule from './statsRule.js';
import patternLibraryRule from './patternLibraryRule.js';
import customRuleBuilder from './customRuleBuilder.js';

const builtIns = [
  actionRule,
  redFigureRule,
  horizontalRule,
  verticalRule,
  manualRule,
  searchRule,
  statsRule,
  patternLibraryRule,
  customRuleBuilder
];

export default {
  async getAllRules(){
    // normalize
    return builtIns.map(r => ({ ...r, enabled: !!r.enabledByDefault }));
  }
};
