# Fix display error because display repository
.PHONY: install code build pack lint test display cov

# Install all dependencies
install:
	docker run -ti --rm \
		-u "node" \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		node:slim \
		npm install

# Run Node.js environement (to add dependencies, run custom npm commands etc.)
code:
	docker run -ti --rm \
		-u "node" \
		-v $(shell pwd):/usr/src/app/extract-colors \
		-w /usr/src/app/extract-colors \
		-p 3001\:3001 \
		node:slim \
		bash

# Build lib (install it before)
build:
	docker run -ti --rm \
		-u "node" \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		node:slim \
		npm run build

# Package lib (install and build it before)
pack:
	docker run -ti --rm \
		-u "node" \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		node:slim \
		npm pack

# Lint all files (and correct it)
lint:
	docker run -ti --rm \
		-u "node" \
		-v $(shell pwd):$(shell pwd) \
		-w $(shell pwd) \
		node:slim \
		npm run lint-fix

# Run tests for dev
test:
	docker run -ti --rm \
		-u "node" \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		node:slim \
		npm run test

# Run test and coverage
cov:
	docker run -ti --rm \
		-u "node" \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		node:slim \
		npm run coverage
