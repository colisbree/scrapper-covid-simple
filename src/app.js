const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config();

const middlewares = require("./middlewares");
const fetchCovidData = require("./scrapper");

const app = express();

let cacheTime; // permet d'éviter de se faire blacklister par le site à cause du nombre de requêtes
let data;

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/covid", async (req, res) => {
  if (cacheTime && cacheTime > Date.now() - 1000 * 30) {
    // cache de 30 sec
    return res.json(data);
  }
  data = await fetchCovidData();
  cacheTime = Date.now();
  res.json(data);
});

app.get("/covid/:country", async (req, res) => {
  if (!data) {
    data = await fetchCovidData();
  }
  res.json(data.filter((d) => d.country === req.params.country));
});

app.get("/", async (req, res) => {
  res.redirect("/covid");
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
