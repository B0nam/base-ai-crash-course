import puppeteer from "puppeteer";

const BASE_URL = "https://books.toscrape.com";

(async () => {
  const browser = await puppeteer.launch();
  const bookDataList = [];

  for (let n = 1; n <= 50; n++) {
    const page = await browser.newPage();
    const url = `${BASE_URL}/catalogue/page-${n}.html`;
    await page.goto(url);

    const books = await page.$$eval('article.product_pod', books =>
      books.map(book => {
        const title = book.querySelector('h3 a')?.getAttribute('title');
        const price = book.querySelector('.price_color')?.textContent;
        const availability = book.querySelector('.instock.availability')?.innerText.trim();
        const rating = book.classList.contains('star-rating') 
          ? [...book.classList].find(cls => cls !== 'product_pod' && cls !== 'star-rating')
          : 'Unknown';
        return { title, price, availability, rating };
      })
    );

    bookDataList.push(...books);
    await page.close();
  }

  console.log(bookDataList);
  await browser.close();
})();
