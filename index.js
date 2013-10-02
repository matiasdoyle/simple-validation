
(function() {
  function Valid(obj) {
    if (!(this instanceof Valid))
      return new Valid(obj);

    if (typeof(obj) !== 'object' || Array.isArray(obj))
      throw new TypeError('Expected object');

    this._obj = obj;
    this._valid = {};

    return this;
  }

  /**
   * The 'static' maps for the different validations of keys.
   *
   * @type {Object}
   */
  var TYPES = {
    REQUIRED: 'every',
    HAS: 'some',
    HAS_ONE: 'map'
  };

  /**
   * Checks that the array of keys passed are present in the object.
   *
   * Usage: Valid(Object).required(Array);
   * 
   * @param {Array} keys Array of keys that have to be present.
   * @return {Object} this
   */
  Valid.prototype.required = function(keys) {
    this._valid.required = this._keys(keys, TYPES.REQUIRED);
    return this;
  };

  /**
   * Checks that at least one of the array of keys passed are present in the object.
   *
   * Usage: Valid(Object).has(Array);
   * 
   * @param {Array} keys Array of keys that one or more have to be present.
   * @return {Object} this
   */
  Valid.prototype.has = function(keys) {
    this._valid.has = this._keys(keys, TYPES.HAS);
    return this;
  };

  /**
   * Checks that only one of the keys in the passed array are present in the object.
   *
   * Usage: Valid(Object).hasOne(Array);
   * 
   * @param {Array} keys Array of keys that it should only be one of in the object.
   * @return {Object} this
   */
  Valid.prototype.hasOne = function(keys) {
    this._valid.has_one = (this._keys(keys, TYPES.HAS_ONE).length === 1);
    return this;
  };

  /**
   * Check the values match the 'schema' passed.
   *
   * The 'schema' should contain the key of the object and the value of the
   * schema is the type the key should be.
   *
   * The object should look like:
   *
   * {
   *   key_1: 'string',
   *   key_2: 'object',
   *   key_3: 'array',
   *   key_4: 'number'
   * }
   * 
   * @param {Object} schema
   * @return {Object} this
   */
  Valid.prototype.values = function(schema) {
    this._valid.values = this._values(schema);
    return this;
  };

  /**
   * After running any of the functions above running this will return a boolean
   * based on the results of the previous validations.
   *
   * @return {Boolean} True if they succeed, false if not 
   */
  Valid.prototype.isValid = function() {
    for (var i in this._valid) {
      if (!this._valid[i]) return false;
    }

    return true;
  };

  /**
   * Checks that the keys are present in the object.
   *
   * @param {Array} keys The keys to check
   * @param {Number} type
   * @return {Mixed}
   */
  Valid.prototype._keys = function(keys, type) {
    var self = this;

    return keys[type](function(key) {
      return (self._obj[key] !== undefined);
    });
  };

  /**
   * Checks that the values in the object matches the types passed in the
   * schema type object.
   * 
   * @param  {Object} schema
   * @return {Boolean}
   */
  Valid.prototype._values = function(schema) {
    for (var i in schema) {
      if (this._obj[i]) {
        if (schema[i] === 'array') {
          if (!Array.isArray(this._obj[i]))
            return false;
        } else {
          if ((typeof(this._obj[i]) !== schema[i]))
            return false;
        }
      }
    }

    return true;
  };

  // Expose module to Node.js or the browser.
  if (typeof module != 'undefined' && module.exports) {
    module.exports = Valid;
  } else {
    this.Valid = Valid;
  }

}).call(this);
