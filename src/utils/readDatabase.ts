export function readDatabase(text: Blob) {
  const reader = new FileReader();
  reader.readAsText(text);
  reader.onload = function() {
    console.log(reader.result);
  }
}

export function readDatabasePromise(text: Blob) {
  return new Promise( (resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(text);
    reader.onload = function() {
      resolve(reader.result);
    }
    reader.onerror = function() {
        reject('Cannot read file');
    }
  })
}