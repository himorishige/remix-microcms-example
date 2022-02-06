import chromium from 'chrome-aws-lambda';
import { json, type LoaderFunction } from 'remix';

// Vercel環境（aws環境）の判定
const isDev = !process.env.AWS_REGION;

export const loader: LoaderFunction = async ({
  request,
}): Promise<Response> => {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
  if (!host) {
    throw new Error('Could not determine domain URL.');
  }

  const headers: HeadersInit = {
    'Content-Type': 'image/png',
    'Content-Disposition': `inline; filename="ogp.png"`,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control':
      'public, immutable, no-transform, s-maxage=31536000, max-age=31536000',
  };

  let browser = null;
  let screenshot = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: isDev ? [] : chromium.args,
      channel: isDev ? 'chrome' : undefined,
      executablePath: isDev ? undefined : await chromium.executablePath,
      headless: isDev ? true : chromium.headless,
      defaultViewport: { width: 1200, height: 630 },
    });

    const page = await browser.newPage();

    const templateUrl = request.url.replace(`.png`, '');
    await page.goto(templateUrl, { waitUntil: 'domcontentloaded' });

    screenshot = await page.screenshot({ type: 'png' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw json({ error: error.message }, 500);
    }
    throw new Error('Error creating the screenshot');
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  if (typeof screenshot === 'undefined') {
    throw json({ error: 'Error creating the image' }, 500);
  }

  return new Response(screenshot, { headers });
};
