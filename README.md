# Interactive BN webapp

This is a tool that is used to help build Bayesian Networks with assistance from expert knowledge.

The tool is a `JavaScript` web application with a `C++` back end.

The application is run using `npm`, from the parent directory.
```bash
npm start
```

The backend server file is found in `src/server.js` and can be launched using:
```bash
node src/server.js
```

The backend serves the data and processes it. This means that a proxy is required for the front end to access the files served. This is done using `nginx`. The configuration for the proxy in `nginx` is found in the repo's `nginx.conf` file.

# Setup
The following commands will help start the web service! And keep it running indefinitely from within an AWS ec2 instance.

First install the necessary tools:
```bash
sudo yum install -y npm
sudo yum install -y nginx
sudo yum install -y git
```

We clone the files ready to be used:
```bash
cd /usr/share/nginx/html/
sudo git clone https://github.com/JixTheCat/interactive_cpt.git
sudo mv interactive_cpt/* ./
``` 

We then build the web services and install the required utilities (note sudo is required due to the location - you could change this requirement through changing user or privileges):
```bash
cd /usr/share/nginx/html/src
sudo npm install
cd ../
sudo npm install
sudo npm run build
```

We update the nginx configuration to include the proxy for the backend hosting and processing services:
```bash
sudo cp -f /usr/share/nginx/html/nginx.conf /etc/nginx/nginx.conf
```

We start the `nginx` service (we also make sure that `httpd` is not running!):
```bash
sudo systemctl stop httpd
sudo systemctl start nginx
```

We install `pm2` to help us continually serve the files from `server.js`:
```bash
sudo npm install -g pm2
pm2 start server.js --cwd /usr/share/nginx/html/src
```

We can test the local hosted server using:
```bash
wget 127.0.0.1:3001/api/config
```

And also view the website to make sure it is running. Errors are logged in the web browser, these are visible by pressing F12 (or inspect page for some web browsers) to view the logs.
