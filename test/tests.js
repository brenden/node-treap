var treap = require('../lib/treap')
  , should = require('should');

describe('performing insertions', function() {
  var t = treap.create();

  it('inserts valid nodes without error', function() {
    (function(){
      t.insert(4, {foo: 'bar'});
    }).should.not.throw();
  });

  it('throws an error for repeat keys', function() {
    (function(){
      t.insert(9001);
      t.insert(9001);
    }).should.throw();
  });

  it('throws an error for non-numeroc keys', function() {
    (function(){
      t.insert('foo');
    }).should.throw();
  });
});
