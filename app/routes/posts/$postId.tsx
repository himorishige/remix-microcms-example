import parse from 'html-react-parser';
import {
  HeadersFunction,
  json,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from 'remix';
import { client } from '~/libs/client.server';
import type { Content } from '~/types';

// stale-while-revalidateの設定
export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const cacheControl =
    loaderHeaders.get('Cache-Control') ??
    'max-age=0, s-maxage=60, stale-while-revalidate=60';
  return {
    'cache-control': cacheControl,
  };
};

// MetaFunctionにはLoaderFunctionで取得したdataの他にparamやlocationを受け取ることができる
// https://remix.run/docs/en/v1/api/conventions#page-context-in-meta-function
export const meta: MetaFunction = ({ data }: { data?: Content }) => {
  return { title: data?.title ?? 'Not Found' };
};

// microCMS APIから記事詳細を取得する
export const loader: LoaderFunction = async ({ params, request }) => {
  // 下書きの場合
  const url = new URL(request.url);
  const draftKey = url.searchParams.get('draftKey');

  const content = await client
    .get<Content>({
      endpoint: 'blog',
      contentId: params.postId,
      queries: { draftKey: draftKey ?? '' },
    })
    // 記事が404の場合は404ページへリダイレクト
    .catch(() => {
      throw new Response('Content Not Found.', {
        status: 404,
      });
    });

  // 下書きの場合キャッシュヘッダを変更
  const headers = draftKey ? { 'Cache-Control': 'no-store' } : undefined;

  return json(content, { headers });
};

export default function PostsId() {
  const content = useLoaderData<Content>();

  return (
    <div className="p-4 prose">
      <h1>{content.title}</h1>
      <div>
        <img src={content.image.url} alt="" />
      </div>
      <div>{parse(content.body)}</div>
    </div>
  );
}
