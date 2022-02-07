// Headersからホスト名を取得する
export const getHostname = (headers: Headers): string => {
  const host = headers.get('X-Forwarded-Host') ?? headers.get('host');
  if (!host) {
    throw new Error('Could not determine domain URL.');
  }
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const domain = `${protocol}://${host}`;
  return domain;
};
