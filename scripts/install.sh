#!/bin/sh

if [ ! -f config/local.json -a -f config/local.json_sample ]; then
    cp config/local.json_sample config/local.json
fi

if [ ! -f ibeacon ]; then
    curl https://raw.githubusercontent.com/smoyerman/edison-ibeacon/master/ibeacon > ibeacon
    chmod +x ibeacon
fi

