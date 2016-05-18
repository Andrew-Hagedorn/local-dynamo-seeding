#!/bin/bash

IMAGE_NAME=$1

echo $IMAGE_NAME

cd docker
docker build -t $IMAGE_NAME .
cd ..

ID=$(docker run -d -p 8000:8000 $IMAGE_NAME -sharedDb)
echo $ID
