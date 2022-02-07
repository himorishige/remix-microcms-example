import {
  HeadersFunction,
  json,
  Link,
  LoaderFunction,
  useLoaderData,
} from 'remix';
import { z } from 'zod';
import { client } from '~/libs/client.server';
import { Layout } from '~/components/Layout';
import { Contents, contentsSchema } from '~/types';

// stale-while-revalidateの設定
export const headers: HeadersFunction = () => {
  return {
    'Cache-Control': 'max-age=0, s-maxage=60, stale-while-revalidate=60',
  };
};

export const loader: LoaderFunction = async () => {
  // microcms-js-sdkを使って一覧を取得
  const contents = await client
    .getList<Contents>({
      endpoint: 'blog',
    })
    .then((response) => {
      contentsSchema.parse(response);
      return response;
    })
    .catch((error: unknown) => {
      if (error instanceof z.ZodError) {
        throw json({ error: 'Invalid data format' }, 500);
      }
    });
  return contents;
};

export default function Index(): JSX.Element {
  const { contents } = useLoaderData<Contents>();
  // ここでデータの検証処理などを入れる
  if (!contents) return <div>...loading</div>;

  return (
    <Layout>
      <div className="p-4">
        <div className="p-4 prose">
          <h1>Index Page</h1>
          <ul>
            {contents.map((item) => (
              <li key={item.id}>
                <Link to={`/posts/${item.id}`}>{item.title}</Link>{' '}
                {new Date(item.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
