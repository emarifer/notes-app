#!/bin/bash

npm i

cd frontend/

sed -i.bak "16iaxios.defaults.baseURL = '$1';" ./src/main.js

npm i

npm run build

cd ..

mv frontend/dist/ .

mv dist/ public/

mv public/ src/

## nginx config

sudo sed -i '$d' /etc/nginx/sites-available/apps_config
sudo sed -i '$d' /etc/nginx/sites-available/apps_config

sudo sed -i -e '$a\\n' /etc/nginx/sites-available/apps_config
sudo sed -i -e '$a\\tlocation /notes-app/ {'  /etc/nginx/sites-available/apps_config
sudo sed -i -e '$a\\t\tproxy_pass http://localhost:3500/;'  /etc/nginx/sites-available/apps_config
sudo sed -i -e '$a\\t\tproxy_http_version 1.1;'  /etc/nginx/sites-available/apps_config
sudo sed -i -e '$a\\t\tproxy_set_header Upgrade $http_upgrade;'  /etc/nginx/sites-available/apps_config
sudo sed -i -e '$a\\t\tproxy_set_header Connection 'upgrade';'  /etc/nginx/sites-available/apps_config
sudo sed -i -e '$a\\t\tproxy_set_header Host $host;'  /etc/nginx/sites-available/apps_config
sudo sed -i -e '$a\\t\tproxy_cache_bypass $http_upgrade;'  /etc/nginx/sites-available/apps_config
sudo sed -i -e '$a\\t}'  /etc/nginx/sites-available/apps_config
sudo sed -i -e '$a\\n' /etc/nginx/sites-available/apps_config
sudo sed -i -e '$a}'  /etc/nginx/sites-available/apps_config

sudo systemctl restart nginx

echo "Successfully deployment!!"
