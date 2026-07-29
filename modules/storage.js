// modules/storage.js
// Lightweight IndexedDB wrapper for saving user rules and analyses. Also use localStorage for simple settings.

const DB_NAME = 'historic-analysis-db';
const DB_VERSION = 1;
const STORE_RULES = 'userRules';
const STORE_ANALYSIS = 'savedAnalysis';

const Storage = {
  db: null,

  async init(){
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = req.result;
        if(!db.objectStoreNames.contains(STORE_RULES)) db.createObjectStore(STORE_RULES, { keyPath: 'id' });
        if(!db.objectStoreNames.contains(STORE_ANALYSIS)) db.createObjectStore(STORE_ANALYSIS, { keyPath: 'id' });
      };
      req.onsuccess = () => {
        this.db = req.result;
        resolve();
      };
      req.onerror = (e) => reject(e);
    });
  },

  async saveUserRule(id, sourceCode){
    const tx = this.db.transaction(STORE_RULES, 'readwrite');
    const store = tx.objectStore(STORE_RULES);
    const rec = { id, sourceCode, createdAt: new Date().toISOString() };
    store.put(rec);
    return tx.complete;
  },

  async getUserRules(){
    const tx = this.db.transaction(STORE_RULES, 'readonly');
    const store = tx.objectStore(STORE_RULES);
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = async () => {
        // import and instantiate rule objects
        const arr = [];
        for(const r of req.result){
          try{
            const blob = new Blob([r.sourceCode], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const module = await import(url);
            URL.revokeObjectURL(url);
            const rule = module.default;
            if(rule && rule.id) arr.push(rule);
          }catch(err){
            console.warn('Failed to load user rule', r.id, err);
          }
        }
        resolve(arr);
      };
      req.onerror = (e)=> reject(e);
    });
  },

  async saveAnalysis(id, record){
    const tx = this.db.transaction(STORE_ANALYSIS, 'readwrite');
    const store = tx.objectStore(STORE_ANALYSIS);
    store.put(record);
    return tx.complete;
  },

  async listAnalyses(){
    const tx = this.db.transaction(STORE_ANALYSIS, 'readonly');
    const store = tx.objectStore(STORE_ANALYSIS);
    return new Promise((resolve, reject)=>{
      const req = store.getAll();
      req.onsuccess = ()=> resolve(req.result);
      req.onerror = (e)=> reject(e);
    });
  },

  async getAnalysis(id){
    const tx = this.db.transaction(STORE_ANALYSIS, 'readonly');
    const store = tx.objectStore(STORE_ANALYSIS);
    return new Promise((resolve, reject)=>{
      const req = store.get(id);
      req.onsuccess = ()=> resolve(req.result);
      req.onerror = (e)=> reject(e);
    });
  }
};

export default Storage;
