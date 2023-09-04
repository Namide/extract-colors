install:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		node:slim \
		npm install

code:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app/extract-colors \
		-w /usr/src/app/extract-colors \
		-p 3001\:3001 \
		-u "node" \
		node:slim \
		bash

rootcode:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app/extract-colors \
		-w /usr/src/app/extract-colors \
		-p 3001\:3001 \
		-u "root" \
		node:slim \
		bash

build:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		-u "node" \
		node:slim \
		npm run build

pack:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		-u "node" \
		node:slim \
		npm pack

lint:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		-u "node" \
		node:slim \
		npm run lint

test:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		-u "node" \
		node:slim \
		npm run test

cov:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		-u "node" \
		node:slim \
		npm run coverage