import { HeadersFunction, Link, LoaderFunction, useLoaderData } from 'remix';
import { client } from '~/libs/client.server';
import type { Content } from '~/types';

// stale-while-revalidateの設定
export const headers: HeadersFunction = () => {
  return {
    'Cache-Control': 'max-age=0, s-maxage=60, stale-while-revalidate=60',
  };
};

export const loader: LoaderFunction = async () => {
  // microcms-js-sdkを使って一覧を取得
  const { contents } = await client.getList<Content[]>({
    endpoint: 'blog',
  });
  return contents;
};

export default function Index() {
  const contents = useLoaderData<Content[]>();
  return (
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
  );
}
