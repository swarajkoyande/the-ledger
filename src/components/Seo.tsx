import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://theledger.online'
const DEFAULT_IMAGE = 'https://theledger.online/og-image.jpg'

interface Props {
  title: string
  description: string
  path: string
  image?: string
  type?: string
  jsonLd?: object | object[]
}

export function Seo({ title, description, path, image = DEFAULT_IMAGE, type = 'website', jsonLd }: Props) {
  const url = `${SITE_URL}${path}`
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
