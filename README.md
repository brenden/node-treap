# node-treap

An implementation of the treap data structure for node.js and the browser

## Treaps
[Treaps](http://en.wikipedia.org/wiki/Treap) are self-balancing binary trees 
which combine the properties of heaps and binary search trees. Each node has a
_key_, which follows binary search tree ordering, and a _priority_, which 
follows heap ordering. Treaps can be used to efficiently implement sets and 
sorted lists, among other things.

## Example

```javascript
var treap = require('treap');
var t = treap.create();

// Insert some keys, augmented with data fields
t.insert(5, {foo: 12});
t.insert(2, {foo: 8});
t.insert(7, {foo: 1000});

// Look up treap elements
var a = t.find(5);
var b = t.findRank(1);

console.log(a.key, a.data); // 5 { foo: 12 }
console.log(b.key, b.data); // 2 { foo: 8 }

// Remove treap elements
t.remove(a); // by reference to node
t.remove(7); // by key
```

## Module Methods
###create()
Factory method to initialize a new, empty treap.

###merge(lTreap, rTreap)
Merges the two treaps into a single treap, given that <code>maxKey(lTreap)</code> &lt; <code>minKey(rTreap)</code>.

## Treap Methods
###insert(key, [data])
Inserts a node with the given <code>key</code> (optionally augmented with an arbitrary <code>data</code> object).

###find(key)
Returns the node with the given key, or null if no such node exists. The node object contains <code>key</code>
and <code>data</code> fields, as wells as fields for navigating the search tree: <code>left</code>, <code>right</code>,
and <code>parent</code>.

###remove(key|node)
Remove the node with the given numeric <code>key</code>, or the given <code>node</code> itself.

###findRange(from, to)
Returns a list containing all nodes with <code>from</code> &lt;= <code>node.key</code> &lt;= <code>to</code>.

###findRank(k)
Returns the node with the kth smallest key.

###split(k)
Splits the treap into two treaps <code>lTreap</code> and <code>rTreap</code> such that <code>maxKey(lTreap)</code> 
&lt; <code>k</code> &lt;= <code>minKey(rTreap)</code>. The two new treaps are retured as the list <code>[lTreap, 
rTreap]</code>.</td>

###traverse(fn)
Performs an inorder traversal of the tree and executes function <code>fn</code> for each node. <code>fn</code>
is passed the arguments <code>(node, i)</code>, where <code>i</code> counts the callings of <code>fn</code>.</td>
The traversal can be aborted before it finishes by <code>fn</code> returning true.

###getRoot()
Returns the root node.

###getSize()
Returns the number of nodes in the treap.

## Tests
Tests are written with [Mocha](http://mochajs.org/) and can be run with `npm test`.

## License
(The MIT License)

Copyright (c) 2012 Brenden Kokoszka

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
