import { renderToString } from 'react-dom/server';
import { RemixServer } from 'remix';
import { generateImage } from '~/libs/generateImage.server';
import type { EntryContext } from 'remix';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/social-image')) {
    const socialImage = await generateImage({
      title: 'Generating Social Images with Remix',
      author: 'himorishige',
      profileImage: 'app/assets/images/profile.jpg',
    });
    return new Response(socialImage, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=2419200',
      },
    });
  }

  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  );

  responseHeaders.set('Content-Type', 'text/html');

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
