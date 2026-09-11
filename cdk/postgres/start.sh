#!/bin/sh
set -eu

# Keep the TLS certificate on the same persistent disk as the database.
cd /var/lib/postgresql/data
if [ ! -s server.key ]; then
    openssl req -x509 -newkey rsa:2048 -nodes -days 3650 \
        -subj /CN=alpine-peak-postgres -keyout server.key -out server.crt
fi
chown postgres:postgres server.key server.crt
chmod 600 server.key

exec docker-entrypoint.sh "$@"
