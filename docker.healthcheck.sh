#!/bin/sh
PORT="${PORT:-3000}"
URL="http://localhost:$PORT/api/healthcheck"
echo "Checking health at $URL"
if curl -fs "$URL"; then
  echo "Health check passed"
  exit 0
else
  echo "Health check failed"
  exit 1
fi