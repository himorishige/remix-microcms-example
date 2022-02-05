/* eslint-disable @typescript-eslint/explicit-function-return-type */
import chromium from 'chrome-aws-lambda';
import { json } from 'remix';

export async function loader({ request }: any): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'image/png',
    'Content-Disposition': `inline; filename="ogp.png"`,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 's-maxage=31536000, stale-while-revalidate',
  };

  const viewport = { width: 1200, height: 630 };

  let browser = null;
  let screenshot = null;

  try {
    browser = await chromium.puppeteer.launch({
      channel: 'chrome',
      defaultViewport: viewport,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    const templateUrl = request.url.replace('ogp.png', '');
    await page.goto(templateUrl || '', { waitUntil: 'networkidle0' });
    screenshot = await page.screenshot({ type: 'png' });
  } catch (error) {
    throw new Error();
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  if (typeof screenshot === 'undefined') {
    throw json({ error: 'Error creating the image' }, 500);
  }

  return new Response(screenshot, { headers });
}
