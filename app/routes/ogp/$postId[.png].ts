/* eslint-disable @typescript-eslint/explicit-function-return-type */
// import { mkdir, writeFile } from 'fs/promises';
// import { join } from 'path';
import chromium from 'chrome-aws-lambda';
import { json, type LoaderFunction } from 'remix';
// import invariant from 'tiny-invariant';

const defaultViewport = { width: 1200, height: 630 };

export const loader: LoaderFunction = async ({
  request,
  // params,
}): Promise<Response> => {
  // invariant(params.postId);
  // const { postId } = params;

  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
  if (!host) {
    throw new Error('Could not determine domain URL.');
  }

  const headers: HeadersInit = {
    'Content-Type': 'image/png',
    'Content-Disposition': `inline; filename="ogp.png"`,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 's-maxage=31536000, stale-while-revalidate',
  };

  // const ogCache = join(process.cwd(), '.cache', 'ogimages');
  // const imagePath = `${ogCache}/ogp_${postId}.png`;
  // const browserCache = join(process.cwd(), '.cache', 'browser');
  // await Promise.all([
  //   mkdir(browserCache, { recursive: true }).catch((error) => {
  //     console.log(error);
  //   }),
  //   mkdir(ogCache, { recursive: true }).catch((error) => {
  //     console.log(error);
  //   }),
  // ]);
  // const cachedImage = await readFile(imagePath)
  //   .then((image) => {
  //     return image;
  //   })
  //   .catch(() => {
  //     return null;
  //   });
  // if (cachedImage) {
  //   return new Response(cachedImage, { headers });
  // }

  let browser = null;
  let screenshot = null;

  try {
    browser = await chromium.puppeteer.launch({
      channel: 'chrome',
      defaultViewport,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    const templateUrl = request.url.replace(`.png`, '');
    await page.goto(templateUrl || '', { waitUntil: 'domcontentloaded' });
    const element = await page.$('#ogimage');
    if (!element) {
      console.error("Could'nt get #ogimage");
      throw json({ error: 'Error creating the image' }, 500);
    }
    const boundingBox = await element.boundingBox();
    if (!boundingBox) {
      console.error("Could'nt get element.boundingBox");
      throw json({ error: 'Error creating the image' }, 500);
    }
    screenshot = await page.screenshot({ type: 'png' });
  } catch (error) {
    throw json({ error }, 404);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  if (typeof screenshot === 'undefined') {
    throw json({ error: 'Error creating the image' }, 500);
  }

  // await writeFile(imagePath, screenshot);

  return new Response(screenshot, { headers });
};
