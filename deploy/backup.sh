#!/bin/sh
# Dump MySQL and the uploaded images and PDFs. Run on the server from a cron job.
# Required environment: DB_DATABASE, DB_USERNAME, DB_PASSWORD, BACKEND_DIR, BACKUP_DIR.
set -eu

: "${DB_DATABASE:?}"
: "${DB_USERNAME:?}"
: "${DB_PASSWORD:?}"
: "${BACKEND_DIR:?}"
: "${BACKUP_DIR:?}"

mkdir -p "$BACKUP_DIR"
stamp=$(date +%F-%H%M)

mysqldump --single-transaction --no-tablespaces \
  -u"$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" \
  | gzip > "$BACKUP_DIR/db-$stamp.sql.gz"

tar -czf "$BACKUP_DIR/storage-$stamp.tar.gz" \
  -C "$BACKEND_DIR" storage/app/public storage/app/documents

find "$BACKUP_DIR" -type f -mtime +14 -delete
