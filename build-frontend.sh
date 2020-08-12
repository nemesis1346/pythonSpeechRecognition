#!/bin/bash

set -x
set -e

cd react_front_end/
npm install
npm run-script build
tar zcf build.tgz build/
cd ..

