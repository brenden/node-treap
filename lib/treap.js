var treap = (typeof exports === 'undefined') ? {} : exports;

;(function(exports) {

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
      var node = {key: key, priority: Math.random(), size: 1};
      if (data) node.data = data;

      // Perform the insertion of the node as for a normal BST
      var parentNode = this._search(key);

      if (parentNode) {

        // Throw an exception if the key has already been used
        if (parentNode.key === key) throw new Error('Duplicate key.');

        parentNode[(parentNode.key > node.key) ? 'left' : 'right'] = node;
        node.parent = parentNode;
      } else {
        this._root = node;
      }

      // Update the subtree sizes of all ancestor nodes
      for (var s = node.parent; s; s = s.parent) s.size++;

      // Rotate until the heap propery is achieved wrt. the node priorities
      while (node.parent && node.priority < node.parent.priority) {
        this._rotate(node);
      }
    } 


    /**
     * Return the node with the given key, or null if the key doesn't exist
     *
     * @param {Number} key
     * @return {Object}
     * @throws
     */
  , find: function(key) {
      if (typeof key !== 'number') throw new Error('Keys must be numeric.');
      var found = this._search(key);
      return (found.key === key) ? found : null;
    }


    /**
     * Return a list of all nodes with lKey <= key <= rKey
     *
     * @param {Number} lKey
     * @param {Number} rKey
     * @return {Array}
     * @throws
     */
  , findRange: function(lKey, rKey) {
      if (typeof lKey !== 'number' || typeof rKey !== 'number') {
        throw new Error('Keys must be numeric.');
      }

      if (lKey >= rKey) throw new Error('lKey must be less than rKey.');

      var found = [];

      // Helper function to recursively search each candidate branch
      var rangeSearch = function(node) {
        if (!node) return;

        if (node.key < lKey) {
          rangeSearch(node.right);

        } else if (node.key > rKey) {
          rangeSearch(node.left);  

        } else {
          rangeSearch(node.left);
          found.push(node);
          rangeSearch(node.right);
        }
      };

      rangeSearch(this._root);
      return found;
    }


    /**
     * Return the node with the given rank, or null if the rank is greater than
     * the nummer of elements in the tree
     *
     * @param {Number} rank
     * @return {Object}
     * @throws
     */
  , findRank: function(rank) {
      if (typeof rank !== 'number') throw new Error('Rank must be numeric.');

      var current = this._root;

      if (rank > current.size || rank < 1) return null;

      while (((current.left) ? current.left.size : 0) + 1 !== rank) {
        if (current.left && current.left.size >= rank) {
          current = current.left;
        } else {
          rank -= 1 + ((current.left) ? current.left.size : 0);
          current = current.right;
        }
      }

      return current;
    }


    /**
     * Remove an element from the treap given either an actual node or a key
     *
     * @param {Object|Number} node
     * @throws
     */
  , remove: function(nodeOrKey) {
      var node = (typeof nodeOrKey === 'object')
        ? nodeOrKey
        : this.find(nodeOrKey);

      // Rotate the node to be deleted to the bottom of the treap
      while (node.left || node.right) {
        var swapWith = (!node.left ||
          (node.right && node.left.priority > node.right.priority))
          ? node.right
          : node.left;
        this._rotate(swapWith);
      }

      // Perform the removal
      var parSide = this._parSide(node);
      
      if (parSide) {

        // Update the subtree sizes of all ancestor nodes
        for (var s = node.parent; s; s = s.parent) s.size--;
        delete node.parent[parSide];

      } else {
        this._root = null;
      }
    }


    /**
     * Performs an inorder traversal of the nodes and executes the given 
     * function on every visited node. If `fn` returns true, the traversal
     * will stop.
     *
     * @param (Function) fn
     */
  , traverse: function(fn) {
      var i = 0;
      var trav = function(node) {
        if (!node) return false;
        return trav(node.left) || fn(node, i++) || trav(node.right);
      };

      trav(this._root);
    }


    /**
     * Returns the root node 
     *
     * @return {Object}
     */
  , getRoot: function() {
      return this._root;
    }


    /**
     * Returns the number of nodes in the treap
     *
     * @return {Number}
     */
  , getSize: function() {
      return this._root.size;
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
     * Given a node, tell whether it is the left or right subchild of its 
     * parent. If the node is the root, return null.
     *
     * @param {Object} node
     * @return {Object}
     */
  , _parSide: function(node) {  
       return (node.parent)
        ? (node.parent.left && node.parent.left.key === node.key) 
          ? 'left' 
          : 'right'
        : null;
    }


    /**
     * Perform a rotation on the given pivot
     *
     * @param {Object} pivot
     */
  , _rotate: function(pivot) {
      if (!pivot.parent) return;

      var pivRoot = pivot.parent;
      var pivParent = pivot.parent.parent;

      // Perform a right or left rotation, as appropriate
      if (pivRoot.left && pivRoot.left.key === pivot.key) {
        if (pivot.right) {
          pivRoot.left = pivot.right;
          pivot.right.parent = pivRoot;
        } else {
          delete pivRoot.left;
        } 

        pivot.right = pivRoot;

      } else {
        if (pivot.left) {
          pivRoot.right = pivot.left;
          pivot.left.parent = pivRoot;
        } else {
          delete pivRoot.right;
        }

        pivot.left = pivRoot;
      }

      pivRoot.parent = pivot;

      // Update the child pointer of the node above the rotation; if it doesn't 
      // exist, the pivot is the new root
      if (pivParent) {
        pivot.parent = pivParent;

        if (pivParent.left && pivParent.left.key === pivRoot.key) {
          pivParent.left = pivot;
        } else {
          pivParent.right = pivot;
        }
      } else {
        delete pivot.parent;
        this._root = pivot;
      }

      // Update the subtree sizes
      pivRoot.size = 1 + ((pivRoot.left) ? pivRoot.left.size : 0)
        + ((pivRoot.right) ? pivRoot.right.size : 0);
      pivot.size = 1 + ((pivot.left) ? pivot.left.size : 0)
        + ((pivot.right) ? pivot.right.size : 0);
    }
  };


  // Export the treap factory method
  exports.create = function() {
    var treap = (Object.create(protoTreap));
    treap._root = null;
    return treap;
  };

})(treap);
