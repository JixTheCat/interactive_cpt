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

The following commands will help start the web service!

First install the necessary tools:
```bash
sudo yum install -y npm
sudo yum install -y nginx
sudo yum install -y git
```

We clone the files ready to be used:
```bash
cd /usr/share/nginx/html/
git clone https://github.com/JixTheCat/interactive_cpt.git
``` 

We then build the webservices and install the required utilities:
```bash
cd /usr/share/nginx/html/src
npm install
cd ../
npm install
npm run build
```

We update the nginx configuration to include the proxy for the backend hosting and processing services:
```bash
cp -f /usr/share/nginx/html/nginx.conf /etc/nginx/nginx.conf
```

We start the `nginx` service (we also make sure that `httpd` is not running!):
```bash
sudo systemctl stop httpd
sudo systemctl start nginx
```

We install `pm2` to help us continually serve the files from `server.js`:
```bash
npm install -g pm2
pm2 start /usr/share/nginx/html/src/server.js
```

We can test the local hosted server using:
```bash
wget 127.0.0.1:3001/api/config
```

And also view the website to make sure it is running. Errors are logged in the web browser, these are visible by pressing F12 (or inspect page for some web browsers) to view the logs.
