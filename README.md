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



## Docs
Currently this project just supports scraping flights from airport A => airport B like so:
```bash
node index.js AUS MDW
```


If you're interested in adding functionality don't hesitate to PR