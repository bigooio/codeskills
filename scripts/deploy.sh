#!/bin/bash
# Deploy script - Run on server: ./scripts/deploy.sh

set -e

echo "=========================================="
echo "CodeSkills Deploy Script"
echo "=========================================="

# Configuration
APP_DIR="/var/www/codeskills"
GIT_REPO="https://github.com/bigooio/codeskills.git"
BRANCH="main"

cd $APP_DIR

# Pull latest code
echo "[1/6] Pulling latest code from GitHub..."
git fetch origin $BRANCH
git checkout $BRANCH
git pull origin $BRANCH

# Install dependencies
echo "[2/6] Installing dependencies..."
npm install

# Install better-sqlite3 (native module)
echo "[3/6] Installing native modules..."
npm install better-sqlite3 @types/better-sqlite3

# Initialize database if not exists
echo "[4/6] Checking database..."
if [ ! -f "data/skills.db" ]; then
    echo "Creating database..."
    mkdir -p data
    node scripts/init-db.js
else
    echo "Database already exists, skipping..."
fi

# Build
echo "[5/6] Building..."
rm -rf .next
npm run build

# Restart PM2
echo "[6/6] Restarting PM2..."
pm2 restart 0 || pm2 start npm --name "codeskills" -- start

echo ""
echo "=========================================="
echo "Deploy complete!"
echo "=========================================="
