import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from 'remix';
import styles from './tailwind.css';
import type { MetaFunction } from 'remix';

export const meta: MetaFunction = () => {
  return { title: 'New Remix App' };
};

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="p-4 mb-4 bg-slate-200">
          <h1 className="text-5xl font-bold">
            <Link to="/">Welcome to Remix</Link>
          </h1>
        </header>
        <div className="p-4">
          {/* Outlet部分にページがレンダリングされます */}
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        {/* 次バージョンから環境変数での分岐は不要になるようです */}
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

// エラーがここでキャッチされる
// 404以外はさらにErrorBoundaryへ送っています
export function CatchBoundary() {
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
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="prose">
      <h1>{error.message}</h1>
    </div>
  );
}
