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
		-v $(shell pwd):/usr/src/app/extract-colors \
		-w /usr/src/app/extract-colors \
		-p 3000\:3000 \
		-u "root" \
		node:slim \
		bash -c "npm i ; npm run build ; npm link ; cd website ; npm i ; npm link extract-colors ; npm run serve"

code:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app/extract-colors \
		-w /usr/src/app/extract-colors \
		-p 3001\:3001 \
		-u "node" \
		node:slim \
		bash

links:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app/extract-colors \
		-w /usr/src/app/extract-colors \
		-p 3001\:3001 \
		-u "root" \
		node:slim \
		bash -c "npm i ; npm run build ; npm link ; cd website ; npm i ; npm link extract-colors ; cd ../examples/browser-import ; npm i ; npm link extract-colors ; cd ../browser-require ; npm i ; npm link extract-colors ; cd ../node-require ; npm link extract-colors"

rootcode:
	docker run -ti --rm \
		--user $(id -u):$(id -g) \
		-v $(shell pwd):/usr/src/app/extract-colors \
		-w /usr/src/app/extract-colors \
		-p 3001\:3001 \
		-u "root" \
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