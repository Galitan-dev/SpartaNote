#!/bin/bash

echo
echo Refreshing code
rm -fr /app
mkdir -p /app
cd /app
git clone https://galitan-dev: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@github.com/Galitan-dev/SpartaNote /app
cd /app/api

echo Installing packages
yarn --production

_term() {
    echo "Caught SIGTERM signal!" 
    kill -TERM "$child" 2>/dev/null
}

catch() {
    echo "Caught ERROR signal!"
}

trap '_term' SIGTERM
trap 'catch' ERR

echo Launching app
yarn run dev &

child=$!
wait "$child"