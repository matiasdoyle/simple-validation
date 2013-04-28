# simple-validator

A simple, chainable way of validating your objects.

Has the following end-points:

- `Valid(Object).required(Array)` Every key in the passed array needs to be present.
- `Valid(Object).has(Array)` One or more keys in the passed array has to be present.
- `Valid(Object).hasOne(Array)` Has only one of the keys in the array.
- `Valid(Object).values(Object)` Checks if the values in the initial object matches the values of the schema type object passed.
- `Valid(Object){.required|.has|hasOne|.values}.isValid()` Returns true or false depending on if the previous validation passed or not.

## Example usage

Just chain the different validators together.

	var Valid = require('simple-validator');

	var obj = {
		foo: 'bar',
		baz: ['hello', 'world']
	};

	var valid = Valid(obj).required(['foo'])
						  .has(['baz'])
						  .values({ foo: 'string', baz: 'array'})
						  .isValid();

	// valid === true
