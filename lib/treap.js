var treap = (typeof exports === 'undefined') ? {} : exports;
var util = require('util');

;(function(module) {

  'use strict';

  var protoTreap = {

    /**
     * Insert an element to the treap 
     *
     * @param {Number} key
     * @param {Object} data
     * @throws
     */
    insert: function(key, data) {
      if (typeof key !== 'number') throw new Error('Keys must be numeric.');

      // Create the node and randomly assign it a priority
      var node = {key: key, _priority: Math.random()};
      if (data) node.data = data;

      // Perform the insertion of the node as for a normal BST
      var parentNode = this._search(key);

      if (parentNode) {

        // Throw an exception if the key has already been used
        if (parentNode.key === key) throw new Error('Duplicate key.');

        parentNode[(parentNode.key > node.key) ? 'left' : 'right'] = node;
        node._parent = parentNode;
      } else {
        this._root = node
      }

      // Rotate until the heap propery is achieved wrt. the node priorities
      while (node._parent && node._priority < node._parent._priority) {
        this._rotate(node);
      }
    } 


    /**
     * Return the node with the given key, or null if the key doesn't exist
     *
     * @param {Number} key
     * @return {Object} 
     */
  , find: function(key) {
      var found = this._search(key);
      return (found.key === key) ? found : null;
    }


    /**
     * Remove an element from the treap 
     *
     * @param {Object} node
     */
  , remove: function(node) {
      var parSide = this._parSide(node);

      // Two children
      if (node.left && node.right) {

        // First, swap this node with its inorder successor
        var succ = this._successor(node);
        this._swapNodes(node, succ);

        // Then remove it from its new location
        this.remove(node);

        // Finally, re-heap the treap  
        while (succ._parent && succ._priority < succ._parent._priority) {
          this._rotate(succ);
        }

      } else {
        var child = node.left || node.right;

        // One child
        if (child) {
          if (parSide) { 
            child._parent = node._parent;
            delete node._parent[parSide];
            node._parent[parSide] = child;
          } else {
            this._root = child;
          }

        // No children
        } else {
          if (parSide) { 
            delete node._parent[parSide];
          } else {
            this._root = null;
          }
        }
      }
    }
    

    /**
     * Return the node with the given key, or the node at which the search 
     * stopped if the key wasn't found.
     *
     * @param {Number} key
     * @return {Object}
     */
  , _search: function(key) { 
      var current = this._root;
      var last;

      while (current && current.key !== key) {
        last = current;
        current = (key < current.key) ? current.left : current.right;
      }

      return (current) ? current : last;
    }


    /**
     * Return the given node's inorder successor, or null if the node doesn't
     * have a successor.
     *
     * @param {Object} node
     * @return {Object}
     */
  , _successor: function(node) { 
      var succ = null;

      if (node.right) {
        succ = node.right;
        while (succ.left) succ = succ.left;

      } else {
        for (var s = node; s._parent; s = s._parent) { 
          if (s._parent.left && s._parent.left.key === s.key) {
            succ =  s._parent;
            break;
          }
        }
      }

      return succ;
    }


    /**
     * Exchange the positions of the two given nodes in the tree
     *
     * @param {Object} n1
     * @param {Object} n2
     */
  , _swapNodes: function(node1, node2) {
      var nodes = [node1, node2];
      var initPositions = nodes.map(this._parSide);

      // Exchange the left, right, and parent pointers of the two nodes
      ['left', 'right', '_parent'].forEach(function(field) {
        var tmp = nodes[1][field];
        nodes[1][field] = nodes[0][field];
        nodes[0][field] = tmp;

        nodes.forEach(function(node, i) {
          if (!node[field]) {
            delete node[field];
          } else if (node[field].key === node.key) {
            node[field] = nodes[i^1];
          }
        });
      });

      nodes.forEach(function(node, i) { 
        if (node._parent) {
          node._parent[initPositions[i^1]] = node;
        } else {
          this._root = node;
        }

        if (node.left) node.left._parent = node;
        if (node.right) node.right._parent = node;
      }.bind(this));
    }


    /**
     * Given a node, tell whether it is the left or right subchild of its 
     * parent. If the node is the root, return null.
     *
     * @param {Object} node
     * @return {Object}
     */
  , _parSide: function(node) {  
       return (node._parent)
        ? (node._parent.left && node._parent.left.key === node.key) ? 'left' : 'right'
        : null;
    }


    /**
     * Perform a rotation on the given pivot
     *
     * @param {Object} pivot
     */
  , _rotate: function(pivot) {
      if (!pivot._parent) return;

      var pivRoot = pivot._parent;
      var pivParent = pivot._parent._parent;

      // Perform a right or left rotation, as appropriate
      if (pivRoot.left && pivRoot.left.key === pivot.key) {
        if (pivot.right) {
          pivRoot.left = pivot.right;
          pivot.right._parent = pivRoot;
        } else {
          delete pivRoot.left;
        } 

        pivot.right = pivRoot;

      } else {
        if (pivot.left) {
          pivRoot.right = pivot.left;
          pivot.left._parent = pivRoot;
        } else {
          delete pivRoot.right;
        }

        pivot.left = pivRoot;
      }

      pivRoot._parent = pivot;

      // Update the child pointer of the node above the rotation; if it doesn't 
      // exist, the pivot is the new root
      if (pivParent) {
        pivot._parent = pivParent;

        if (pivParent.left && pivParent.left.key === pivRoot.key) {
          pivParent.left = pivot;
        } else {
          pivParent.right = pivot;
        }
      } else {
        delete pivot._parent;
        this._root = pivot;
      }
    }
  };


  // Export the treap factory method
  exports.create = function(values) {
    var treap = (Object.create(protoTreap));
    treap._root = null;
    if (values) values.forEach(treap.insert);
    return treap;
  };

})(treap);
