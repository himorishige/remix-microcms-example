import { json, LinksFunction, LoaderFunction, useLoaderData } from 'remix';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { client } from '~/libs/client.server';
import type { Content } from '~/types';
import styles from '~/styles/ogimages.css';
import { contentSchema } from '~/types';

type LoaderData = {
  title: Content['title'];
};

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
  if (!host) {
    throw new Error('Could not determine domain URL.');
  }

  invariant(params.postId);
  const postId = params.postId;

  const content = await client
    .get<Content['title']>({
      endpoint: 'blog',
      contentId: postId,
      queries: {
        fields: 'title',
      },
    })
    .then((response) => {
      contentSchema.pick({ title: true }).parse(response);
      return response;
    })
    // 記事が404の場合は404ページへリダイレクト
    .catch((error: unknown) => {
      if (error instanceof z.ZodError) {
        console.log(error.issues);
        throw error;
      }
      throw new Response('Content Not Found.', {
        status: 404,
      });
    });

  return json(content);
};

export default function OgImage(): JSX.Element {
  const { title } = useLoaderData<LoaderData>();

  return (
    <div id="ogimage" className="w-[1200px] h-[630px]">
      <div className="flex flex-col justify-between items-center p-12 space-y-12 h-full text-white bg-gradient-to-b from-cyan-800 to-blue-900">
        <div className="flex items-center w-full h-full">
          <h1 className="text-7xl leading-[1.2]">{title || 'no title'}</h1>
        </div>
        <div className="flex justify-end items-center mt-auto w-full">
          <img
            src="https://github.com/himorishige.png"
            alt="himorishige"
            className="w-24 h-24 rounded-full"
          />
          <p className="pl-4 text-6xl text-right">@_himorishige</p>
        </div>
      </div>
    </div>
  );
}
