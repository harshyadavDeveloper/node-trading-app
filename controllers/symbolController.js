const { default: puppeteer } = require("puppeteer");

const getSymbols = async (req, res) => {
    try {
        const targetUrl = "http://trading-access.infy.uk/get_symbols.php?i=1";
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.goto(targetUrl, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        await new Promise(resolve => setTimeout(resolve, 5000));
        try {
            await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 });
        } catch (_) {
            // It's okay if redirect didn't happen in time
        }

        const content = await page.content();
        await browser.close();

        res.send(content);
    } catch (error) {
        console.error("❌ Puppeteer Error:", error.message);
        res.status(500).send(`Error fetching symbols: ${error.message}`);
    }
}

module.exports = { getSymbols }