#!/bin/sh

if [ ! -f ibeacon ]; then
    curl https://raw.githubusercontent.com/smoyerman/edison-ibeacon/master/ibeacon > ibeacon
    chmod +x ibeacon
fi

