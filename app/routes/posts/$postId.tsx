import parse from 'html-react-parser';
import {
  HeadersFunction,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from 'remix';
import { client } from '~/lib/client.server';
import type { Content } from '~/types';

// stale-while-revalidateの設定
export const headers: HeadersFunction = () => {
  return {
    'Cache-Control': 'max-age=0, s-maxage=60, stale-while-revalidate=60',
  };
};

// MetaFunctionにはLoaderFunctionで取得したdataの他にparamやlocationを受け取ることができる
// https://remix.run/docs/en/v1/api/conventions#page-context-in-meta-function
export const meta: MetaFunction = ({ data }: { data?: Content }) => {
  return { title: data?.title ?? '' };
};

// microCMS APIから記事詳細を取得する
export const loader: LoaderFunction = async ({ params }) => {
  const content = await client
    .get<Content>({
      endpoint: 'blog',
      contentId: params.postId,
    })
    // 記事が404の場合は404ページへリダイレクト
    .catch(() => {
      throw new Response('Content Not Found.', {
        status: 404,
      });
    });

  return content;
};

export default function PostsId() {
  const content = useLoaderData<Content>();

  return (
    <div className="prose -p-4">
      <h1>{content.title}</h1>
      <div>
        <img src={content.image.url} />
      </div>
      <div>{parse(content.body)}</div>
    </div>
  );
}
