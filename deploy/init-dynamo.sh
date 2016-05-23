#!/bin/bash

docker pull chagedorn/initialize-local-dynamo
ID=$(docker run -d -p 8000:8000 chagedorn/initialize-local-dynamo -sharedDb)
echo $ID
