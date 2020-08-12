
#!/bin/bash
# sudo su
cd ..

rm -rf package-lock.json
rm -rf node_modules
rm -rf ~/.node-gyp
rm -rf ~/.npmrc

npm cache clean -f
npm install -g n
npm i -g node-gyp

n 10.16.0
npm install
