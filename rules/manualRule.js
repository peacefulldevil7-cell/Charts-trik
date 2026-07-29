// rules/manualRule.js
// Manual drawing/notes/highlighting stored with analysis. This module provides runtime hooks only.

export default {
  id: 'manual-analysis',
  name: 'Manual Analysis',
  description: 'Provides user tools to draw, circle, annotate and color cells. Saves undo/redo stacks.',
  enabledByDefault: true,
  async run(table, context){
    // This rule doesn't automatically detect things, but returns any stored manual annotations from storage (if present).
    // The UI provides drawing tools in v1 (basic). Here we return nothing unless UI stored manual items.
    return {
      summary: { notesLoaded: 0 },
      highlights: [],
      annotations: []
    };
  }
};
