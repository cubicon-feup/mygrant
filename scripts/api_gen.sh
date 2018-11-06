#!/bin/bash

cd .. && rm -rf ./apidoc && ./node_modules/apidoc/bin/apidoc -i ../t1g1 -e node_modules -e ./client/node_modules -o ./apidoc 

