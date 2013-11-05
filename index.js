(function() {
  var Valid = function(obj) {
    if (!(this instanceof Valid))
      return new Valid(obj);

    if (typeof obj !== 'object' || this._isArray(obj))
      throw new TypeError('Expected object');

    this._obj = obj;
    this._valid = {};

    return this;
  }

  /**
   * Checks that the array of keys passed are present in the object.
   *
   * Usage: Valid(Object).required(Array);
   * 
   * @param {Array} keys Array of keys that have to be present.
   * @return {Object} this
   */
  Valid.prototype.required = function(keys) {
    var valid = true;

    for (var i=0; i<keys.length; i++) {
      if (!this._hasKey(keys[i])) valid = false;
    }

    this._valid.required = valid;
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
    var valid = false;

    for (var i=0; i<keys.length; i++) {
      if (this._hasKey(keys[i])) valid = true;
    }
    this._valid.has = valid;
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
    var found = [];

    for (var i=0; i<keys.length; i++) {
      if (this._hasKey(keys[i])) found.push(keys[i]);
    }

    this._valid.has_one = (found.length == 1);
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
   * Check the object contains the key.
   *
   * @param {String|Array} key The key to check is present. To check nested objects either pass
   *                           a string in dot notation (key = 'foo.bar') or an array ['foo', 'bar'].
   * @return {Boolean} True if the key exists, false if not.
   */
  Valid.prototype._hasKey = function(key, obj) {
    var cur;

    if (!this._isArray(key)) {
      key = key.split('.');
    }

    cur = key.shift();
    obj = obj || this._obj;

    if (!obj.hasOwnProperty(cur)) return false;
    if (typeof obj[cur] == 'object' && key.length > 0)
      return this._hasKey(key, obj[cur]);

    return (key.length === 0);
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
          if (!this._isArray(this._obj[i]))
            return false;
        } else {
          if ((typeof(this._obj[i]) !== schema[i]))
            return false;
        }
      }
    }

    return true;
  };

  /**
   * Util function to check if the passed param is an Array.
   *
   * @param {Mixed} The parameter to check.
   * @return {Boolean} True if parameter is true, false if not. 
   */
  Valid.prototype._isArray = function(param) {
    return (Object.prototype.toString.call(param) === '[object Array]');
  };

  // Expose module to Node.js or the browser.
  if (typeof module != 'undefined' && module.exports) {
    module.exports = Valid;
  } else {
    window.Valid = Valid;
  }

}).call(this);
