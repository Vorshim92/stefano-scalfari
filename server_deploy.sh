#!/bin/sh
set -e

echo "Deploying application ..."

# Install dependencies
npm install

# Build
npm run build

#Backup 
cp -r /var/www/stefanoscalfari /var/www/stefanoscalfari-backup

#Remove
rm -r /var/www/stefanoscalfari/*

# Deploy
cp -r build/* /var/www/stefanoscalfari/
chown -R www-data:www-data /var/www/stefanoscalfari

# Restart Apache
sudo systemctl restart apache2

echo "Application deployed!"
