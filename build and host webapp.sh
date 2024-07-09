
git clone https://github.com/JixTheCat/interactive_cpt.git

sudo yum install npm

cd /var/www/html
npm install
cd src
npm install
cd ../
npm run build
mv ./build/* ./


sudo systemctl stop httpd
sudo systemctl start httpd

# we can test the local hosted server:
cd src
node server.js
wget 127.0.0.1:3001/api/config
# You might need to open more than one terminal for this test. one to host and one to test!
