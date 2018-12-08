#!/bin/bash

cd .. && rm -rf ./apidoc && mkdir ./apidoc && ./node_modules/apidoc/bin/apidoc -i . -e node_modules -e ./client/node_modules -o ./apidoc 

