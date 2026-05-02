type SeoHeadProps = {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string[];
  image?: string;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.deqoin.com";

const absoluteUrl = (path: string) => new URL(path.startsWith("/") ? path : `/${path}`, SITE_URL).toString();

export default function SeoHead({ title, description, canonicalPath, keywords = [], image = "/images/logo-new.jpeg" }: SeoHeadProps) {
  const canonical = absoluteUrl(canonicalPath);
  const imageUrl = absoluteUrl(image);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 ? <meta name="keywords" content={keywords.join(", ")} /> : null}
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </>
  );
}
