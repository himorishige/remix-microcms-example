import {
  HeadersFunction,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from 'remix';
import type { MetaFunction } from 'remix';
import { siteName, description } from '~/config/siteConfig';
import styles from '~/tailwind.css';

export const meta: MetaFunction = () => {
  return {
    title: siteName,
    description,
  };
};

export const headers: HeadersFunction = () => {
  return {
    'Cache-Control': 'max-age=0, s-maxage=60, stale-while-revalidate=60',
  };
};

export function links(): { rel: string; href: string }[] {
  return [{ rel: 'stylesheet', href: styles }];
}

export const loader: LoaderFunction = async () => {
  return null;
};

export default function App(): JSX.Element {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* Outlet部分にページがレンダリングされます */}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// エラーがここでキャッチされる
// 404以外はさらにErrorBoundaryへ
export function CatchBoundary(): JSX.Element {
  const caught = useCatch();
  if (caught.status === 404) {
    return (
      <div className="prose">
        <h1>{caught.statusText}</h1>
      </div>
    );
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

// CatchBoundaryでキャッチできなかったエラーはこちらでキャッチする
export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
  return (
    <div className="prose">
      <h1>{error.message}</h1>
    </div>
  );
}
