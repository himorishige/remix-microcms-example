import parse from 'html-react-parser';
import {
  HeadersFunction,
  json,
  LoaderFunction,
  MetaFunction,
  useCatch,
  useLoaderData,
} from 'remix';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { client } from '~/libs/client.server';
import { getHostname } from '~/libs/getHostname.server';
import { Layout } from '~/components/Layout';
import {
  titleSeparator,
  description,
  twitterHandle,
  siteName,
} from '~/config/siteConfig';
import { contentSchema, type Content } from '~/types';

type LoaderData = {
  content?: Content;
  domain?: string;
};

// ヘッダーの設定
export const headers: HeadersFunction = ({ loaderHeaders }) => {
  const cacheControl =
    loaderHeaders.get('Cache-Control') ??
    'max-age=0, s-maxage=60, stale-while-revalidate=60';
  return {
    'Cache-Control': cacheControl,
  };
};

// MetaFunctionにはLoaderFunctionで取得したdataの他にparamやlocationを受け取ることができる
// https://remix.run/docs/en/v1/api/conventions#page-context-in-meta-function
export const meta: MetaFunction = ({ params, location, data }) => {
  const { content, domain }: LoaderData = data ?? {};

  const url = `${domain}${location.pathname}`;
  const image = content?.cover
    ? content.cover.url
    : `${domain}/ogimages/${params.postId}.png`;

  return {
    title: `${content?.title}${titleSeparator}${siteName}`,
    description,
    'og:url': url,
    'og:title': `${content?.title}${titleSeparator}${siteName}`,
    'og:description': description,
    'og:image': image,
    'og:site_name': siteName,
    'twitter:card': image ? 'summary_large_image' : 'summary',
    'twitter:creator': twitterHandle,
    'twitter:site': twitterHandle,
  };
};

// microCMS APIから記事詳細を取得する
export const loader: LoaderFunction = async ({ params, request }) => {
  // ドメイン名を取得する。定数で管理できる環境の場合は不要。
  const domain = getHostname(request.headers);

  // params.postIdをassert
  invariant(params.postId);

  // 下書きの場合
  const url = new URL(request.url);
  const draftKey = url.searchParams.get('draftKey');

  const content = await client
    .get<Content>({
      endpoint: 'blog',
      contentId: params.postId,
      queries: { draftKey: draftKey ?? '' },
    })
    .then((response) => {
      contentSchema.parse(response);
      return response;
    })
    .catch((error: unknown) => {
      if (error instanceof z.ZodError) {
        throw json(
          { error: 'Invalid data format', message: error.flatten() },
          500,
        );
      }
      // 記事が404の場合は404ページへリダイレクト
      throw new Response('Content Not Found.', {
        status: 404,
      });
    });

  // 下書きの場合キャッシュヘッダを変更
  const headers = draftKey
    ? { 'Cache-Control': 'no-store, max-age=0' }
    : undefined;

  return json({ content, domain }, { headers });
};

export default function PostsId(): JSX.Element {
  const { content } = useLoaderData<LoaderData>();
  // ここでデータの検証処理などを入れる
  if (!content) return <div>...loading</div>;

  return (
    <Layout>
      <div className="p-4 prose">
        <h1>{content.title}</h1>
        <div>
          <img src={content.image.url} alt="" />
        </div>
        <div>{parse(content.body)}</div>
      </div>
    </Layout>
  );
}

// 404以外はさらにErrorBoundaryへ
export function CatchBoundary(): JSX.Element {
  const caught = useCatch();
  return (
    <Layout>
      <div className="p-4 prose">
        <h1>{caught.data}</h1>
      </div>
    </Layout>
  );
}
