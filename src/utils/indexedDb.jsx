export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("SearchTextDB", 1);

    request.onerror = (event) => {
      console.error("Database failed to open", event);
      reject(event);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("searchTexts")) {
        db.createObjectStore("searchTexts", {keyPath: "table_slug"});
      }
    };
  });
};

export const saveOrUpdateSearchText = (db, table_slug, searchText) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["searchTexts"], "readwrite");
    const store = transaction.objectStore("searchTexts");

    const getRequest = store.get(table_slug);

    getRequest.onsuccess = (event) => {
      const data = event.target.result;

      if (data) {
        const updatedData = {...data, searchText};
        const updateRequest = store.put(updatedData);

        updateRequest.onsuccess = () => resolve(true);
        updateRequest.onerror = (event) => reject(event);
      } else {
        const addRequest = store.add({table_slug, searchText});

        addRequest.onsuccess = () => resolve(true);
        addRequest.onerror = (event) => reject(event);
      }
    };

    getRequest.onerror = (event) => reject(event);
  });
};

export const getSearchText = (db, table_slug) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["searchTexts"], "readonly");
    const store = transaction.objectStore("searchTexts");
    const request = store.get(table_slug);

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event);
  });
};
