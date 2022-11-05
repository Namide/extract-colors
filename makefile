install:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		node:slim \
		npm install

serve:
	python3 -m webbrowser http://localhost:3000/extract-colors/
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		-p 3000\:3000 \
		-u "node" \
		node:slim \
		npm run serve-website

dev:
	python3 -m webbrowser http://localhost:3000/
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		-p 3000\:3000 \
		-u "node" \
		node:slim \
		npm run dev

dev-env:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		-p 3001\:3001 \
		-u "node" \
		node:slim \
		bash

build-website:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		-u "node" \
		node:slim \
		npm run build-website

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
		-p 3000\:3000 \
		-u "node" \
		node:slim \
		npm run lint

test:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app \
		-w /usr/src/app \
		-p 3000\:3000 \
		-u "node" \
		node:slim \
		npm run test
