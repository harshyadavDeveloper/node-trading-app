const express = require("express");
require('dotenv').config();
const puppeteer = require("puppeteer");
const cors = require("cors");
const symbolRouter = require('./routes/symbolRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Proxy server is running. Use /get_symbols");
});

app.use('/get_symbols', symbolRouter);





app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
