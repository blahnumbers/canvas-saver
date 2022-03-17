const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./config.json');

const args = process.argv.slice(2);
if (typeof args[0] === 'undefined') {
	console.log("Usage: `node canvas-saver.js username|userid`");
	return;
}

(async () => {
	const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--enable-features=NetworkService'] });
	const page = await browser.newPage();
	await page.goto('http://localhost/playerpreview.php?u=' + args[0]);
	
	await page.waitForFunction('window.status === "ready"');

	const imageUrl = await page.evaluate(() => {
		return document.querySelector('canvas').toDataURL();
	});
	const userid = await page.evaluate(() => {
		return document.querySelector('#userid').textContent;
	});
	const image = Buffer.from(imageUrl.split(',').pop(), 'base64');
	fs.writeFileSync(config.path + userid + ".png", image);

	await browser.close();
})();
