import Head from 'next/head';
import { useRouter } from 'next/router'

export function NextHead({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogType,
  extraNode,
}) {
  const router = useRouter();

  const metaTitle = title || "Daily Torah Study | Ami";
  const metaDescription =
    description ||
    'Ami is a weekly subscription-based publication focused on the daily study cycles of Chumash, Rambam, Tanya & more, & features fresh content from a variety of Torah sources';
  const openGraphImage = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/images/opengraph.png`;

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={metaDescription} />

      <meta property="og:title" content={ogTitle || metaTitle} />
      <meta property="og:description" content={ogDescription || metaDescription} />
      <meta property="og:type" content={ogType ?? 'website'} />
      <meta
        property="og:image"
        content={ogImage || openGraphImage}
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={process.env.NEXT_PUBLIC_FRONTEND_URL} />
      <meta property="twitter:url" content={`${process.env.NEXT_PUBLIC_FRONTEND_URL}${router.asPath}`} />
      <meta name="twitter:title" content={ogTitle || metaTitle} />
      <meta name="twitter:description" content={ogDescription || metaDescription} />
      <meta
        name="twitter:image"
        content={ogImage || openGraphImage}
      />
      {!!extraNode && extraNode}
    </Head>
  );
}
