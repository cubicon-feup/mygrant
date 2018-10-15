#!/bin/bash

if [ $1 = "develop" ]
then
    REMOTE=$DEV_NANOBOX
elif [ $1 = "master" ]
then
    REMOTE=$PROD_NANOBOX
fi

nanobox remote add $REMOTE 
nanobox deploy