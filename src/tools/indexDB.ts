class IndexDBTableWrapper<T> {
  private db: IDBDatabase;
  private tableName: string;
  constructor(db: IDBDatabase, tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  private getTransaction(tableName: string, mode: IDBTransactionMode){
    const transaction = this.db!.transaction(tableName, mode);
    return transaction.objectStore(tableName);
  }

  get<K extends keyof T & IDBValidKey>(key: K): Promise<T[K]> {
    return new Promise((resolve, reject) => {
      const store = this.getTransaction(this.tableName, 'readonly');
      const request = store.get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as T[K]);
    });
  }

  put<K extends keyof T & IDBValidKey>(key: K, value: T[K]): Promise<K> {
    return new Promise((resolve, reject) => {
      const store = this.getTransaction(this.tableName, 'readwrite');
      const request = store.put(value, key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as K);
    });
  }

  delete<K extends keyof T & IDBValidKey>(key: K): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getTransaction(this.tableName, 'readwrite');
      const request = store.delete(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  getAll(): Promise<any[]>{
    return new Promise((resolve, reject) => {
      const store = this.getTransaction(this.tableName, 'readwrite');
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  getAllKeys<K extends keyof T>(): Promise<K[]>{
    return new Promise((resolve, reject) => {
      const store = this.getTransaction(this.tableName, 'readwrite');
      const request = store.getAllKeys();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as K[]);
    });
  }

  openCursor(callBacl: (res:IDBCursorWithValue)=> void){
    const store = this.getTransaction(this.tableName, 'readonly');
    const request = store.openCursor();
    request.onsuccess = (e:any) => {
      const res = e.target!.result;
      if(res) {
          callBacl(res);
          res.continue();
      }
    }
  }

  getKeyAndValue<K extends keyof T>(): Promise<T>{
    const datas = {} as T;
    return new Promise((resolve, reject) => {
      const store = this.getTransaction(this.tableName, 'readonly');
      const request = store.openCursor();
      request.onerror = (e) => reject(e.target);
      request.onsuccess = (e:any) => {
        const res = e.target!.result;
        if(res) {
          datas[res.key as K] = res.value;
          res.continue();
        }else{
          resolve(datas);
        }
      }
    })
  }
}

class IndexedDBWrapper<T> {
  private name: string;
  private objectStoreNames: Array<string>;
  private version: number;
  private db: IDBDatabase | null;

  constructor(name: string, objectStoreNames: Array<string>, version: number = 1) {
    this.name = name;
    this.objectStoreNames = objectStoreNames;
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
          this.objectStoreNames.forEach(name => this.db!.createObjectStore(name));
      };
    });
  }

  getTableTransaction<K extends keyof T & string>(tableName: K){
    if(this.db==null) throw('Please call the open method first to open the indexDB database');
    return new IndexDBTableWrapper<T[K]>(this.db,tableName);
  }
}

const dbWrapper = new IndexedDBWrapper<MyTable>('myDatabase',['test','item','objectName']);
// Open the database
dbWrapper.open().then(() => {
  const testTable = dbWrapper.getTableTransaction('objectName')
  // Put some data
  testTable.put('studioId', { foo: 'bar' }).then(() => {
    // Get the data
    testTable.get('studioId').then(value => {
        const data = value;
        console.log(data)
    });
    // testTable.delete('studioId').then(() => {

    // });
    testTable.getAll().then((data) => {
      console.log('getAll: ',data)
    });

    testTable.getAllKeys().then((data) => {
      console.log('getAllKeys: ', data)
    });

    testTable.getKeyAndValue().then((data) => {
      console.log('getKeyAndValue: ', data)
      // data.studioId
    });
  });
  // testTable.put('keyd2', { foo: 'bar' }).then(() => {
  //   // Get the data
  //   testTable.openCursor((res)=>{
  //     // console.log("Key:", res.key);
  //     // console.log("Data:", res.value);
  //     // console.log('res: ', res)
  //   });
  // });

  // const itemTable = dbWrapper.getTableTransaction('item')
  // // Put some data
  // itemTable.put('keyditem', { foo: 'bar_keyditem' }).then(() => {
  //   // Get the data
  //   itemTable.get('keyditem').then(value => {
  //       const data = value;
  //       console.log(data)
  //   });
  // });
  // itemTable.put('keyd2_keyditem', { foo: 'bar_keyditem' }).then(() => {
  //   // Get the data
  //   itemTable.openCursor((res)=>{
  //     console.log("Key:", res.key);
  //     console.log("Data:", res.value);
  //     // console.log('res: ', res)
  //   });
  // });
});

interface MyTable {
  test: InterfaceData
  item: unknown;
  objectName: InterfaceData;
}

interface InterfaceData {
  studioId:        { foo: string};
  courseName:      string;
  studioOrderTime: string;
  teacherName:     string;
  cityName:        string;
  studioName:      string;
  studioLocation:  string;
  studioOrderDate: string;
  useTime:         string;
  lessonId:        number;
  lessonName:      string;
  applyStartTime:  string;
  applyEndTime:    string;
  useStartTime:    string;
  useEndTime:      string;
  mapUrl:          string;
}