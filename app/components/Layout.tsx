import { Link } from 'remix';

type Props = {
  children: React.ReactNode;
};

export const Layout: React.VFC<Props> = (props) => {
  const { children } = props;

  return (
    <>
      <header className="p-4 mb-4 bg-slate-200">
        <h1 className="text-5xl font-bold">
          <Link to="/">Welcome to Remix</Link>
        </h1>
      </header>
      <div>{children}</div>
    </>
  );
};
