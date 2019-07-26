# Southwest Crawler
Crawls SWA website over the browser. Headless is optional (see index.js line 6).


### WITHOUT DOCKER
```bash
npm install;
node index.js
```


### WITH DOCKER 
```bash
docker build -t puppeteer-chrome-linux .
docker run -i --init --rm --cap-add=SYS_ADMIN \
   --name puppeteer-chrome puppeteer-chrome-linux \
   node -e "`cat index.js`"
```

