var treap = require('../lib/treap');
var t = treap.create();

// Insert some keys, augmented with data fields
t.insert(5, {foo: 12});
t.insert(2, {foo: 8});
t.insert(7, {foo: 1000});

// Look up treap elements
var a = t.find(5);
var b = t.findRank(1);

console.log(a.key, a.data); // "5 {foo: 12}"
console.log(b.key, b.data); // "2 {foo: 8}"

// Remove treap elements
t.remove(a); // by reference to node
t.remove(7); // by key

console.log(t.getSize());
