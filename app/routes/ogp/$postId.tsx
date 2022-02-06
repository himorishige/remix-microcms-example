import { json, LoaderFunction, useLoaderData } from 'remix';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { client } from '~/libs/client.server';
import type { Content } from '~/types';
import { contentSchema } from '~/types';

type LoaderData = {
  title: Content['title'];
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

  return json({ content });
};

export default function OgImage(): JSX.Element {
  const { title } = useLoaderData<LoaderData>();

  return (
    <>
      <div id="ogimage" className="w-[1200px] h-[630px] bg-black rounded-2xl">
        <div className="p-4 h-full bg-gradient-to-tr rounded-2xl">
          <div className="flex flex-col justify-center items-center p-10 space-y-10 h-full text-zinc-200 bg-zinc-800 rounded-lg border border-zinc-300">
            <h1 className="text-8xl leading-[1.2] text-center">
              {title || 'no title'}
            </h1>
            <img
              src="https://github.com/himorishige.png"
              alt="himorishige"
              className="w-40 h-40"
            />
            <div className="text-5xl font-light text-center">
              http://himorishige.io
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
