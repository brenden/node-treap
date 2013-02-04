var treap = (typeof exports === 'undefined') ? {} : exports;

;(function(module) {

  'use strict';

  var protoTreap = {

    /*
     * Insert an element to the treap 
     */
    insert: function(val) {
      console.log('inserted', val);
    }
  };

  exports.create = function(values) {
    var treap = (Object.create(protoTreap));
    if (values) values.forEach(treap.insert);
    return treap;
  };

})(treap);
