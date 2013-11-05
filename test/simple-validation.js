var assert = require('assert'),
    Valid = require('../');

var obj = {
  foo: 'bar',
  bar: 'foo',
  'test': true,
  baz: ['hello', 'world'],
  nested: {
    hello: 'world'
  }
};

describe('Valid', function() {
  describe('init', function() {
    it('should create an instance without needing the new keyword', function() {
      var v = Valid({ 'test': true });
      assert(v instanceof Valid);
    });

    it('should throw a TypeError if the init does not get an object', function() {
      assert.throws(
        function() {
          Valid();
        },
        function(err) {
          return (err.name === 'TypeError');
        });
    });

    it('should throw a TypeError if the init gets an array', function() {
      assert.throws(
        function() {
          Valid(['foo', 'bar']);
        },
        function(err) {
          return (err.name == 'TypeError');
        });
    });
  });

  describe('.required()', function() {
    it('should set the _valid.required boolean to true when all keys are present', function() {
      var v = Valid(obj).required(['foo', 'test', 'baz']);
      assert(v._valid.required);
    });

    it('should set the _valid.required bool to false when some keys are missing', function() {
      var v = Valid(obj).required(['foo', 'test', 'hello']);
      assert(!v._valid.required);
    });

    it('should support nested objects', function() {
      var v = Valid(obj).required(['foo', 'nested.hello']);
      assert(v._valid.required);
    });
  });

  describe('.has()', function() {
    it('should set the _valid.has to true when the object includes one of the keys in the passed array', function() {
      var v = Valid(obj).has(['foo', 'test', 'hello']);
      assert(v._valid.has);
    });

    it('should set the _valid.has to false when the object does not include one of the keys in the passed array', function() {
      var v = Valid(obj).has(['hello', 'wooo']);
      assert(!v._valid.has);
    });

    it('should support nested objects', function() {
      var v = Valid(obj).has(['foo', 'nested.hello']);
      assert(v._valid.has);
    });
  });

  describe('.has_one()', function() {
    it('should set the _valid.has_one to true when only one of the passed keys are present in the object', function() {
      var v = Valid(obj).hasOne(['foo']);
      assert(v._valid.has_one);
    });

    it('should set the _valid.has_one to false when more of the passed keys are present in the object', function() {
      var v = Valid(obj).hasOne(['foo', 'test']);
      assert(!v._valid.has_one);
    });

    it('should support nested objects', function() {
      var v = Valid(obj).hasOne(['nested.hello', 'blimp']);
      assert(v._valid.has_one);
    });
  });

  describe('.validate()', function() {
    it('should set the _valid.values to true when the object values matches the schema', function() {
      var v = Valid(obj).values({
        foo: 'string',
        test: 'boolean',
        baz: 'array'
      });

      assert(v._valid.values);
    });

    it('should ignore unknown keys', function() {
      var v = Valid(obj).values({
        foo: 'string',
        test: 'boolean',
        baz: 'array',
        hello: 'number'
      });

      assert(v._valid.values);
    });

    it('should set the _valid.values to false when the objet values does not maches the schema', function() {
      var v = Valid(obj).values({
        foo: 'string',
        test: 'object',
        baz: 'array'
      });

      assert(!v._valid.values);
    });
  });

  describe('.isValid()', function() {
    it('should return ture if the checks are valid', function() {
      assert(Valid(obj).required(['foo', 'test']).isValid());
    });

    it('should return false if the checks are not valid', function() {
      assert(!Valid(obj).required(['woo']).isValid());
    });
  });

  describe('chaining validations', function() {
    it('should return true when checking multiple valid validations', function() {
      var v = Valid(obj).required(['foo', 'test']).has(['baz']);

      assert(v._valid.required);
      assert(v._valid.has);
      assert(v.isValid());
    });
  });
});
