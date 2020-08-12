#!/bin/bash

set -x
set -e

cd nodejs_server
npm cache verify
npm install
tar zcf node_modules.tar.gz node_modules
cd ../react_front_end/
pwd
npm cache verify
npm install
npm run-script build
tar zcf build.tgz build/
cd ..

