main:
	npm run build:aot
	rm -rf ~/poseidon/public/index.html
	rm -rf ~/poseidon/public/main.*.bundle.js
	rm -rf ~/poseidon/public/polyfills.*.bundle.js
	rm -rf ~/poseidon/public/vendor.*.bundle.js
	rm -rf ~/poseidon/public/webpack-assets.json
	rm -rf ~/poseidon/public/*.chunk.js
	cp -rf ~/webpack/dist/* ~/poseidon/public

clean:
	rm -rf ~/poseidon/public/index.html
	rm -rf ~/poseidon/public/main.*.bundle.js
	rm -rf ~/poseidon/public/polyfills.*.bundle.js
	rm -rf ~/poseidon/public/vendor.*.bundle.js
	rm -rf ~/poseidon/public/webpack-assets.json
	rm -rf ~/poseidon/public/*.chunk.js