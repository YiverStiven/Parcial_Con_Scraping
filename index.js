const puppeteer = require('puppeteer');



function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 100000);
    });
}


async function add1(x) {
    const amaz = amazon();

    const a = await resolveAfter2Seconds(20);
    return amaz;
}
async function add2(x) {
    const ktrox = ktronix();
    const a = await resolveAfter2Seconds(20);
    return ktrox;
}










async function amazon() {

    const pcs = [];
    (async() => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://www.amazon.com/-/es/');

        await page.type('#twotabsearchtextbox', 'computadoras');
        await page.click('#nav-search-submit-button');

        await page.waitForTimeout(3000);
        //await page.screenshot({ path: 'amzaon.jpg' });
        const enlaces = await page.evaluate(() => {
            const elements = document.querySelectorAll('.a-section h2 a');

            const links = [];
            for (let element of elements) {
                links.push(element.href);
            }
            return links;
        });

        console.log(enlaces.length);

        for (let enlace of enlaces) {
            await page.goto(enlace);
            await page.waitForSelector('#productTitle');


            const pc = await page.evaluate(() => {
                const tmp = {};
                tmp.Nombre = document.querySelector('#productTitle').innerText;
                tmp.Precio = document.querySelector('.a-section .a-offscreen').innerText;
                return tmp;
            });
            pcs.push(pc);
        }

        await browser.close()

    })();
    return pcs;
}




async function ktronix() {
    (async() => {
        const browser = await puppeteer.launch( /*{ headless: false }*/ );
        const page = await browser.newPage();
        await page.goto('https://www.ktronix.com/computadores-tablet/computadores-portatiles/c/BI_104_KTRON');


        const enlaces = await page.evaluate(() => {
            const elements = document.querySelectorAll('.product__list--item .product__image a');
            const links = [];
            for (let element of elements) {
                links.push(element.href);
            }
            return links;
        });

        console.log(enlaces.length);
        const pcs = [];
        for (let enlace of enlaces) {
            await page.goto(enlace);
            //  await page.waitForSelector('.product__details-section price-section__sidebar');


            const pc = await page.evaluate(() => {
                const tmp = {};
                tmp.Nombre = document.querySelector('.product__details-section h1').innerText;
                tmp.Precio = document.querySelector('.price-content span').innerText;
                return tmp;
            });
            pcs.push(pc);
        }

        console.log(pcs);
        await browser.close()
    })();
}