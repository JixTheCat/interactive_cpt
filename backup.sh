#!/bin/bash

FILE="/usr/share/nginx/html/src/data.json"
BACKUP_DIR="/usr/share/nginx/html/src/backup"

inotifywait -m -e modify "$FILE" | while read path action file; do
    cp "$FILE" "$BACKUP_DIR/$(date +%Y%m%d%H%M%S)"
    echo "Backup of $FILE created at $(date)"
done
