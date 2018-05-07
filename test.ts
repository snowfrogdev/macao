type Key = {board: string, player: number};
type Value = {state: Key, score: number};

function generateKeyObject(): Key {
    const board = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const player = Math.random();
    return {board, player}
}

function generateValueObject(key: Key): Value {
    const score = Math.random();
    return {state: {board: key.board, player: key.player}, score}
}

const getRandomIntInclusive = (min: number, max: number) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min // The maximum is inclusive and the minimum is inclusive
  }

let numberOfEntries = 3000000;
// Generate an array of keys
let keys = [];

for (let i = 0; i < numberOfEntries; i++) {
    keys.push(generateKeyObject());
}

// Generate an array of values
let values = [];

for (let i = 0; i < numberOfEntries; i++) {
    values.push(generateValueObject(keys[i]));
}


/********************** MAP **********************************/ 

const map = new Map();

let elapsedTime = 0;
// Set
for (let i = 0; i < numberOfEntries; i++) { 
    const start = Date.now()
    const keyString = JSON.stringify(keys[i]);
    map.set(keyString, values[i]);
    const stop = Date.now()
    elapsedTime += stop-start;
}
console.log(`Map set total time: ${(elapsedTime / 1000)}`);


// Get
elapsedTime = 0;
for (let i = 0; i < numberOfEntries; i++) {
    const index = getRandomIntInclusive(0, numberOfEntries - 1);
    const start = Date.now()
    const keyString = JSON.stringify(keys[index]);
    const result = map.get(keyString);
    const stop = Date.now()
    elapsedTime += stop-start;
    if (result !== values[index]) throw new Error('Oops, there is a problem with the Get operation of Map');
}
console.log(`Map get total time: ${(elapsedTime / 1000)}`);


/********************** HASHTABLE w/ Array ****************************/


class HashTable {
    private buckets_: Map<Key, Value>[] = []
    constructor(private bucketCount_: number) {
        for (let i=0; i< this.bucketCount_;i++){
            this.buckets_.push(new Map());
        }
    }

    hashFunction_(obj: Key) {
        let key = JSON.stringify(obj);
        let hash = 0;
        if (key.length === 0) return hash;
        for (let i = 0; i < key.length; i++) {
            hash = (hash<<5) - hash;
            hash = hash + key.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    getBucketIndex_(obj: Key) {
        return this.hashFunction_(obj) % this.bucketCount_;
    }

    getBucket_(obj: Key) {
        return this.buckets_[this.getBucketIndex_(obj)];
    }

    set(key: Key, value: Value) {
        this.getBucket_(key).set(key, value);
    }
    get(lookupKey: Key) {
        return this.getBucket_(lookupKey).get(lookupKey);
    }
}

const hashTable = new HashTable(numberOfEntries);

elapsedTime = 0;
// Set
for (let i = 0; i < numberOfEntries; i++) { 
    const start = Date.now()    
    hashTable.set(keys[i], values[i]);
    const stop = Date.now()
    elapsedTime += stop-start;
}
console.log(`Hashtable set total time: ${(elapsedTime / 1000)}`);

// Get
elapsedTime = 0;
for (let i = 0; i < numberOfEntries; i++) {
    const index = getRandomIntInclusive(0, numberOfEntries - 1);
    const start = Date.now()
    const result = hashTable.get(keys[index])
    const stop = Date.now()
    elapsedTime += stop-start;
    if (result !== values[index]) throw new Error('Oops, there is a problem with the Get operation of HashTable');
}
console.log(`Hashtable get total time: ${(elapsedTime / 1000)}`);




/********************** SEARCH TREE *************************/


