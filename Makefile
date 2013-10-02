
build:
	@./node_modules/.bin/uglifyjs index.js -o simple-validation.min.js

test:
	@./node_modules/.bin/mocha

.PHONY: build test
