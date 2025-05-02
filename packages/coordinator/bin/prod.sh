#!/bin/sh

d1=`dirname $0`
d2=`dirname $d1`
date > prod.log
echo "Starting in directory $d2" >> prod.log
if (test "$d2" = "") then {
  d2="."
} fi;
. $d2/.env
su vtamara -c "cd $d2; yarn build >> prod.log 2>&1 ; yarn start >> prod.log 2>&1 &"
