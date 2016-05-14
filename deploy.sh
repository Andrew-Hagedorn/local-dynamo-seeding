#!/bin/bash

if [ $# -ne 1 ]; then
    echo $0: usage: deploy container-name
    exit 1
fi

IMAGE_NAME=$1

./init-dynamo.sh $IMAGE_NAME


ID=$(docker ps -lq)
echo "ID: $ID"

docker commit $ID $IMAGE_NAME
#docker tag $IMAGE_NAME:latest
#push

docker kill $ID