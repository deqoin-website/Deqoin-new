import type { JsonLdSchema } from "@/lib/seo-structured-data";

type SeoJsonLdProps = {
  data: JsonLdSchema | JsonLdSchema[];
};

export default function SeoJsonLd({ data }: SeoJsonLdProps) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
