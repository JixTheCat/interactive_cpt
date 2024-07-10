sudo rm -r /usr/share/nginx/html/*
sudo yum install -y npm
sudo yum install -y nginx
sudo yum install -y git
cd /usr/share/nginx/html/
sudo git clone https://github.com/JixTheCat/interactive_cpt.git
sudo mv interactive_cpt/* ./
cd /usr/share/nginx/html/src
sudo npm install
cd ../
sudo npm install
sudo npm run build
sudo cp -f /usr/share/nginx/html/nginx.conf /etc/nginx/nginx.conf
sudo systemctl stop httpd
sudo systemctl start nginx
sudo npm install -g pm2
sudo pm2 stop server
sudo pm2 start server.js --cwd /usr/share/nginx/html/src/
sudo apt-get install inotify-tools
cd /usr/share/nginx/html
sudo chmod +x /usr/share/nginx/html/backup.sh
sudo nohup /usr/share/nginx/html/backup.sh &