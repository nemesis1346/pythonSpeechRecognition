### Installation
./deploy.sh

There is no "npm install" involvement. We decompress both react app and server from tar files when install to avoid failure

### Building Frontend - React App
cd react_front_end
npm install 
npm run-script build

### Build server
cd nodejs_server
npm install

### Develop
cd nodejs_server
node server.js

cd react_front_end and do:

yarn start


### Install npm, will also install nodejs, location of node is /usr/bin/node
sudo apt install -y npm

### Node version control
change version of node, this command will also change location of node to /usr/local/bin/node

sudo npm -g install n
sudo n 12.16.3

### IBM watson
curl -X POST -u "apikey:qCI_uusSTXyqAuw73qVhV1DDoMJgJBCgIdIux3S9ldJx" --header "Content-Type: audio/wav" --data-binary @final2_piece001.wav https://api.jp-tok.speech-to-text.watson.cloud.ibm.com/instances/f8cab30e-1f1a-4a2b-8f87-5482d079a97d/v1/recognize

### Production Servers

-zh10cn.npg.io -p 2210

-zh11cn.npg.io -p 2211

-zh14cn.npg.io -p 2214

-zh5cn.npg.io -p 2205 # is retiring

-dev-zh6cn.npg.io

-wa4pl.npg.io #is retired

-wa5pl.npg.io #is retired

-wa7pl.npg.io

-wa8pl.npg.io

### Dev Servers to Deploy

-fl1us.npg.io

-dev-zh2cn.npg.io -p 2202

-zh9cn.npg.io -p 2209

-zh3cn.npg.io -p 2203

-zh1cn.npg.io -p 2201

-zh4cn.npg.io -p 2204

-zh13cn.npg.io

-nu12de.npg.io

-wa3pl.npg.io #seems its down

-wa6pl.npg.io #seems its down