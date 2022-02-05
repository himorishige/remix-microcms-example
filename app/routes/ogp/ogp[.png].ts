/* eslint-disable @typescript-eslint/explicit-function-return-type */
// import playwright from 'playwright-aws-lambda';
import chromium from 'chrome-aws-lambda';

export async function loader({ request }: any): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'image/png',
    // can be `inline` or `attachment`
    'Content-Disposition': `inline; filename="ogimage.png"`,
    'x-content-type-options': 'nosniff',
  };

  // サイズの設定
  const viewport = { width: 1200, height: 630 };

  // ブラウザインスタンスの生成
  let browser = null;
  let screenshot = null;

  try {
    // browser = await playwright.launchChromium();
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      defaultViewport: viewport,
      ignoreHTTPSErrors: true,
    });
    // const context = await browser.newContext({ viewport });

    // const page = await context.newPage();
    const page = await browser.newPage();

    const templateUrl = request.url.replace('ogp.png', '');
    await page.goto(templateUrl || '', { waitUntil: 'domcontentloaded' });
    // screenshot = await page.screenshot({ type: 'png' });
    screenshot = await page.screenshot({ type: 'png' });
  } catch (error) {
    console.log(error);
    throw new Error();
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return new Response(screenshot, { headers });
}
