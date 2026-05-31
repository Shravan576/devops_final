#!/bin/bash

# ==============================================================================
# Database Backup to AWS S3 Storage Script
# ==============================================================================

# Script Variables
DATE=$(date +%Y-%m-%d_%H%M%S)
BACKUP_DIR="/tmp/mongodb_backups"
ARCHIVE_NAME="mongodb_backup_$DATE.tar.gz"
S3_BUCKET="shravan-devops-2026-bucket1"
MONGODB_HOST=${MONGODB_HOST:-"localhost"}
MONGODB_PORT=${MONGODB_PORT:-"27017"}

echo "----------------------------------------------------"
echo "Starting Database Backup Pipeline: $DATE"
echo "Target MongoDB: $MONGODB_HOST:$MONGODB_PORT"
echo "----------------------------------------------------"

# 1. Clean and recreate temp backup directory
rm -rf "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# 2. Run MongoDB dump
echo "Executing database dump..."
mongodump --host "$MONGODB_HOST" --port "$MONGODB_PORT" --out "$BACKUP_DIR/dump"

if [ $? -ne 0 ]; then
    echo "ERROR: Database dump failed. Exiting backup pipeline."
    exit 1
fi

# 3. Create compressed tar archive
echo "Packaging database archive..."
tar -czf "$BACKUP_DIR/$ARCHIVE_NAME" -C "$BACKUP_DIR" dump

if [ $? -ne 0 ]; then
    echo "ERROR: Archive packaging failed. Exiting backup pipeline."
    exit 1
fi

# 4. Upload to AWS S3 Bucket
echo "Uploading backup to AWS S3 bucket: s3://$S3_BUCKET/database-backups/$ARCHIVE_NAME"
aws s3 cp "$BACKUP_DIR/$ARCHIVE_NAME" "s3://$S3_BUCKET/database-backups/$ARCHIVE_NAME"

if [ $? -ne 0 ]; then
    echo "ERROR: Upload to AWS S3 failed. Please check AWS keys or network status."
    exit 1
fi

# 5. Clean up temporary directory paths
echo "Cleaning up local files..."
rm -rf "$BACKUP_DIR"

echo "----------------------------------------------------"
echo "Database Backup Pipeline Completed Successfully."
echo "----------------------------------------------------"
