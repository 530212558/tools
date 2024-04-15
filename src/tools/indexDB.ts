class IndexedDBWrapper {
    private name: string;
    public version: number;
    public db: IDBDatabase | null;
  
    constructor(name: string, version: number = 1) {
      this.name = name;
      this.version = version;
      this.db = null;
    }
  
    open(): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.name, this.version);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.db = request.result;
          resolve(request.result);
        };
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            this.db = (event.target as IDBOpenDBRequest).result;
            this.db!.createObjectStore(this.name)
        };
      });
    }
  
    get(key: IDBValidKey): Promise<any> {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(this.name);
        const store = transaction.objectStore(this.name);
        const request = store.get(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result as any);
      });
    }
  
    put(key: IDBValidKey, value): Promise<string> {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(this.name, 'readwrite');
        const store = transaction.objectStore(this.name);
        const request = store.put(value, key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result as string);
      });
    }
  
    delete(key: IDBValidKey): Promise<void> {
        return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(this.name, 'readwrite');
        const store = transaction.objectStore(this.name);
        const request = store.delete(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
        });
    }

    cursor(){
      const transaction = this.db!.transaction([this.name], "readonly");
      const store = transaction.objectStore(this.name);

      const cursor = store.openCursor();
      cursor.onsuccess = function(e: any) {
        const res = e.target.result;
        if(res) {
            console.log("Key:", res.key);
            console.log("Data:", res.value);
            res.continue();
        }
      }
    }
}
  
const dbWrapper = new IndexedDBWrapper('myDatabase');
// Open the database
dbWrapper.open().then(() => {
  // Put some data
  dbWrapper.put('keyd', { foo: 'bar' }).then(() => {
    // Get the data
    dbWrapper.get('keyd').then(value => {
        const data = value;
        console.log(data)
    });
  });
  dbWrapper.put('keyd2', { foo: 'bar' }).then(() => {
    // Get the data
    dbWrapper.cursor();
  });
});