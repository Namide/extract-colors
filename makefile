install:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		node:slim \
		npm install
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app/website \
		node:slim \
		npm install

serve:
	python3 -m webbrowser http://localhost:3000/
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app/website \
		-p 3000\:3000 \
		-u "node" \
		node:slim \
		npm run serve

code:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		-p 3001\:3001 \
		-u "node" \
		node:slim \
		bash

site:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app/website \
		-u "node" \
		node:slim \
		npm run build

build:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		-u "node" \
		node:slim \
		npm run build

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