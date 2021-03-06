# simple-validation [![Build Status](https://travis-ci.org/matiasdoyle/simple-validation.png?branch=master)](https://travis-ci.org/matiasdoyle/simple-validation)

> Simple, chainable object validation

## Installation

	npm install simple-validation

Run with `--save` to save directly to the package.json.

## Example usage

Chain the validators together and append `isValid()` to return a boolean of the validation result.

	var Valid = require('simple-validation');

	var obj = {
		foo: 'bar',
		baz: ['hello', 'world']
	};

	var valid = Valid(obj).required(['foo'])
						  .has(['baz', 'bar'])
						  .values({ foo: 'string', baz: 'array'})
						  .isValid();

	console.log(valid); // true

## Browser support

The module has support for running in the browser. It has been tested in IE6=<, Firefox, Chrome and Opera (12, Blink). To use the module load the `simple-validation.min.js` file and use it as you would on the server.

## API

To start validating an object pass the object in the initialiser:

	var valid = Valid({ key: 'val' });

When the module is initialised you can start chaining the following functions.

### `.required(Array)`

Validates that the elements in the array are present as keys in the object.

Usage:

	Valid({ foo: true, bar: false }).required(['foo', 'bar']); // True

### `.has(Array)`

Checks that one or more of the elements in the array are present as keys in the object.

Usage:

	Valid({ foo: true, bar: false }).has(['foo', 'baz']); // True

### `.hasOne(Array)`

Checks that only one of the elements in the passed array are present in the object.

Usage:

	Valid({ foo: true, bar: false }).hasOne(['foo', 'bar']); // False
	Valid({ foo: true, bar: false }).hasOne(['foo', 'baz']); // True

### `.values(Object)`

Checks that the values of the object matches the schema type object passed in the function. The object should contain the key to check and its type as a string:

	{
	  key: 'string'|'number'|'boolean'|'array'|'object'
	}

If the key does not exist in the object it is ignored.

Usage:

	Valid({ foo: true, bar: 'test' }).values({
	  foo: 'boolean',
	  bar: 'string'
	}); // True

### `.isValid()`

After preforming validations appending `.isValid()` will return a boolean with the results of the previous validations.

Usage:

	var valid = Valid({ foo: true, bar: false }).required(['foo', 'bar']).isValid();
	console.log(valid); // true

### Nested objects

The module has basic support for nested objects. All functions but `.values` have support for nested objects using a string with dot notation or an array.

Example:

	var valid = Valid({
	  foo: 'bar',
	  nested: {
	  	hello: 'you'
	  }
	}).required(['nested.hello']).isValid();

	console.log(valid); // true

## Licence

MIT
