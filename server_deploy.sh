#!/bin/sh
set -e

echo "Deploying application ..."

cp server.js /var/www/counter-server

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

cd /var/www/counter-server
npm install express cors
chown -R www-data:www-data /var/www/counter-server
# pm2 start /var/www/counter-server/server.js --name "counter-server"
pm2 restart /var/www/counter-server/server.js --name "counter-server"
