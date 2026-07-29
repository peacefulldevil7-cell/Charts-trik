// rules/patternLibraryRule.js
// Save discovered patterns; basic local storage pattern lib

export default {
  id: 'pattern-library',
  name: 'Pattern Library',
  description: 'Saves patterns discovered by other rules; allows rename/edit/delete/search in UI.',
  enabledByDefault: true,
  async run(table, context){
    // No automatic detection; integration point for UI. Provide an empty stub.
    return { summary: { patternsStored: 0 }, highlights: [], annotations: [] };
  }
};
