#!/bin/sh

. ./.env
psql -U ${DB_USER} -h ${DB_SOCKET} ${DB_NAME}
