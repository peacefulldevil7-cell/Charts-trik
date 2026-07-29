// rules/searchRule.js
// Search any number and return occurrences and context

export default {
  id: 'search',
  name: 'Search',
  description: 'Searches for numbers and returns occurrences with date/row/col and previous/next values.',
  enabledByDefault: true,
  async run(table, context){
    // This rule is interactive; in automated run we return empty
    return { summary: { interactive: true }, highlights: [], annotations: [] };
  }
};
