#!/bin/bash

IMAGE_NAME=$1

echo $IMAGE_NAME

docker build -t $IMAGE_NAME .

ID=$(docker run -d -p 8000:8000 $IMAGE_NAME -sharedDb)
echo $ID
