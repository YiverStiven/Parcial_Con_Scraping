const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const puppeteer = require('puppeteer');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


require('dotenv').config()

const port = process.env.PORT || 3000;

// motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.use(express.static(__dirname + "/public"));

// Rutas Web
app.use('/', require('./router/RutasWeb'));
app.use('/Scraping', require('./router/Scraping'));

app.use((req, res, next) => {
    res.status(404).render("404", {
        titulo: "404",
        descripcion: "Título del sitio web"
    })
})


app.listen(port, () => {
    console.log('servidor a su servicio en el puerto', port)
})