#!/bin/sh
DB_FILE=${1:-'./database/portal-db.db'}
echo "Checking for the existence of database file: ${DB_FILE}"
if [ ! -f "$DB_FILE" -o ! -s "$DB_FILE" ]; then
  echo "Database not initialized yet..."

  echo "Creating database file..."
  mkdir -p $(dirname "$DB_FILE")
  touch "$DB_FILE"

  echo "Done."
fi

echo "Executing database schema..."
sqlite3 "$DB_FILE" < ./database/init.sql

echo "All set."