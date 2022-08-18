const puppeteer = require("puppeteer");

async function fetchCovidData() {
  const browser = await puppeteer.launch({ headless: true }); // démarre une instance de Chromium
  const page = await browser.newPage();
  await page.goto("https://www.coronatracker.com/fr/analytics/");

  await page.waitForSelector(
    "table.table-auto:nth-child(1) > tbody:nth-child(2) > tr",
    {
      visble: true,
    }
  ); // atend que le selecteur soit visible

  const data = await page.evaluate(() => {
    let data = [];
    const elements = document.querySelectorAll(
      "table.table-auto:nth-child(1) > tbody:nth-child(2) > tr"
    );
    for (const element of elements) {
      data.push({
        country: element.querySelector("a").text.trim(),
      });
    }
    return data;
  });
  await browser.close();
  return data;
}

module.exports = fetchCovidData;
