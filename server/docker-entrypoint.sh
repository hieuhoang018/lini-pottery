#!/bin/sh
set -e

npx prisma migrate deploy

if [ "$SEED_DB" = "true" ]; then
  echo "SEED_DB=true — seeding database with test data..."
  node dist/scripts/seedDb.js
fi

exec node dist/server.js
