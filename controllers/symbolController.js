const puppeteer = require("puppeteer");

const getSymbols = async (req, res) => {
    let browser;
    try {
        const targetUrl = "http://trading-access.infy.uk/get_symbols.php?i=1";
        
        // Enhanced browser configuration for deployment
        const browserOptions = {
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--no-first-run",
                "--no-zygote",
                "--single-process",
                "--disable-gpu",
                "--disable-background-timer-throttling",
                "--disable-backgrounding-occluded-windows",
                "--disable-renderer-backgrounding"
            ]
        };

        // Only set executablePath if explicitly provided via environment variable
        if (process.env.PUPPETEER_EXECUTABLE_PATH) {
            browserOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
        }

        browser = await puppeteer.launch(browserOptions);

        const page = await browser.newPage();
        
        // Set user agent to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
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
        
        // Close browser if it was opened
        if (browser) {
            try {
                await browser.close();
            } catch (closeError) {
                console.error("Error closing browser:", closeError.message);
            }
        }
        
        res.status(500).send(`Error fetching symbols: ${error.message}`);
    }
}

module.exports = { getSymbols }
