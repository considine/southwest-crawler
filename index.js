const puppeteer = require('puppeteer');
const sleep = t => new Promise(res => setTimeout(res, t));


if (process.argv.length < 4) {
  console.error("Please supply two arguments: An airport code for departing airport, and an airport code for arriving airport" );

  process.exit(1);
}



(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
    ]
  });

  const page = await browser.newPage();

  await page.goto('https://southwest.com', { waitUntil: 'networkidle2' });
  // await sleep(100);
  //   await page.

  await page.waitForSelector(
    '#LandingPageAirSearchForm_destinationAirportCode'
  );
  await page.waitForSelector(
    '#LandingPageAirSearchForm_originationAirportCode'
  );

  await page.type('#LandingPageAirSearchForm_destinationAirportCode', process.env.argv[2], {
    delay: 100
  });

  await page.type('#LandingPageAirSearchForm_originationAirportCode', process.env.argv[3], {
    delay: 100
  });

  await page.$eval('#LandingPageAirSearchForm_originationAirportCode', e =>
    e.blur()
  );

  await page.evaluate(() => {
    document.querySelector("input[value='oneway']").click();
  });

  await page.waitForSelector('#LandingPageAirSearchForm_submit-button');

  await page.click('#LandingPageAirSearchForm_submit-button');
  //   await page.evaluate(selector => {
  //     console.log('SUBMITTING');
  //     document.querySelector(selector).click();
  //   }, '#LandingPageAirSearchForm_submit-button');

  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  await page.waitForSelector('.air-booking-select-detail');
  // await Promise.all([
  //   sleep(3000).then(() => page.screenshot({ path: 'out.png' })),
  //   page.waitForSelector('.air-booking-select-detail')
  // ]);

  const dat = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('.air-booking-select-detail')
    ).map(function(i) {
      const priceSelector = Array.from(
        i.querySelectorAll('.fare-button--value-total')
      );
      const timeSelector = i.querySelector("[type='destination']");
      const stopsSelector = i.querySelectorAll('.flight-stops--item');
      const stopData = Array.from(stopsSelector || []).map(stopNode => ({
        stop: stopNode.textContent,
        switchPlanes: !!stopNode.querySelector('.swa-icon_change-planes')
      }));

      return {
        STOP_1: stopData[0] && stopData[0].stop,
        STOP_1_CHANGE: stopData[0] && stopData[0].switchPlanes,
        STOP_2: stopData[1] && stopData[1].stop,
        STOP_2_CHANGE: stopData[1] && stopData[1].switchPlanes,
        PRICE_1: priceSelector[0] && priceSelector[0].textContent,
        PRICE_2: priceSelector[1] && priceSelector[1].textContent,
        PRICE_3: priceSelector[2] && priceSelector[2].textContent,
        TIME: timeSelector && timeSelector.textContent
      };
    });
  });
  console.log(dat);
  //   From this data :
  await browser.close();
})();
