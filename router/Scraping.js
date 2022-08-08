const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/', async(req, res) => {
    try {
        const arrayPc1 = amazon();
        const arrayPc2 = ktronix();
        setTimeout(() => {

            res.render("Pc", {
                arrayPc1: arrayPc1,
                arrayPc2: arrayPc2
            })
        }, 160000);

    } catch (error) {
        console.log(error)
    }

})


function amazon() {

    const pcs = [];
    (async() => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://www.amazon.com/-/es/');

        await page.type('#twotabsearchtextbox', 'computadoras');
        await page.click('#nav-search-submit-button');

        await page.waitForTimeout(3000);

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
            await page.waitForTimeout(2000);
            //await page.waitForSelector('#productTitle');
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



function ktronix() {
    const pcs = [];
    (async() => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://www.ktronix.com/computadores-tablet/computadores-portatiles/c/BI_104_KTRON');

        await page.waitForTimeout(3000);

        const enlaces = await page.evaluate(() => {
            const elements = document.querySelectorAll('.product__list--item .product__image a');
            const links = [];
            for (let element of elements) {
                links.push(element.href);
            }
            return links;
        });

        console.log("En Ktronix " + enlaces.length);
        for (let enlace of enlaces) {
            await page.goto(enlace);
            // await page.waitForSelector('.price-section');
            await page.waitForTimeout(3000);

            const pc = await page.evaluate(() => {
                const tmp = {};
                tmp.Nombre = document.querySelector('.price-section .product-name h1').innerText;
                tmp.Precio = document.querySelector('.product-main-info .session-price .col-xs-12 .price-ktronix').innerText;
                return tmp;
            });
            pcs.push(pc);
        }
        await browser.close()
    })();
    return pcs;
}
module.exports = router;