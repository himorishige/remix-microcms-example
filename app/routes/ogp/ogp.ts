/* eslint-disable @typescript-eslint/explicit-function-return-type */
import chromium from 'chrome-aws-lambda';
import playwright from 'playwright-core';

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
  // Start the browser with the AWS Lambda wrapper (chrome-aws-lambda)
  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  const page = await browser.newPage({ viewport });

  const templateUrl = request.url.replace('.png', '/ogp');
  await page.goto(templateUrl, { waitUntil: 'domcontentloaded' });

  // スクリーンショットを取得する
  const screenshot = await page.screenshot({ type: 'png' });
  await browser.close();

  return new Response(screenshot, { headers });
}
