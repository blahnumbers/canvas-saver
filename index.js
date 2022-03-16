const puppeteer = require('puppeteer');
const fs = require('fs');

const args = process.argv.slice(2);
if (typeof args[0] === 'undefined') {
	console.log("Usage: `node index.js username`");
	return;
}

(async () => {
	const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--enable-features=NetworkService'] });
	const page = await browser.newPage();
	await page.goto('http://localhost/playerpreview.php?username=' + args[0]);
	//await page.screenshot({ path: 'example.png' });

	await new Promise(resolve => setTimeout(resolve, 1000));
	const imageUrl = await page.evaluate(() => {
		return document.querySelector('canvas').toDataURL();
	});
	const image = Buffer.from(imageUrl.split(',').pop(), 'base64');
	fs.writeFileSync(args[0] + ".png", image);

	await browser.close();
})();
