#!/bin/sh

smalo_home=$(cd $(dirname $0)/.. && pwd)

cd ${smalo_home}

/usr/bin/node app

