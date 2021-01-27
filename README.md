You need to install NodeJs first and make sure the PATH is available for your respective terminal.

If you are on Linux/macOS, install this https://github.com/nvm-sh/nvm

If you are using Windows, install this https://github.com/coreybutler/nvm-windows

cd client/
npm install
npm start

The server can be started using

cd server/
npm install
npm start

The server should not start as intended, because the lack of the secret MongoDB URL and the SMTP server. 
