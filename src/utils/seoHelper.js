/**
 * SEO & Meta Tags Real-time Updater
 * Updates document title, meta tags, OpenGraph properties, and favicon
 */
export function updateSeoMeta(seoData) {
  if (typeof document === 'undefined' || !seoData) return;

  // 1. Title
  if (seoData.siteTitle) {
    document.title = seoData.siteTitle;
  }

  // Helper to get or create meta tag
  const setMeta = (attribute, attrValue, content) => {
    if (!content) return;
    let meta = document.querySelector(`meta[${attribute}="${attrValue}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, attrValue);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Helper to get or create link tag
  const setLink = (rel, href, type) => {
    if (!href) return;
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
    if (type) link.setAttribute('type', type);
  };

  // 2. Standard Meta Tags
  setMeta('name', 'description', seoData.siteDescription);
  setMeta('name', 'keywords', seoData.keywords);
  setMeta('name', 'author', seoData.author || '주식회사 슬기로운 반려생활');
  setMeta('name', 'robots', seoData.robots || 'index, follow');

  // 3. OpenGraph / Kakao Talk / SNS Meta Tags
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', seoData.fullName || '슬기로운 반려생활');
  setMeta('property', 'og:title', seoData.siteTitle);
  setMeta('property', 'og:description', seoData.siteDescription);
  setMeta('property', 'og:url', seoData.canonicalUrl || 'https://www.seulbanlife.com');
  setMeta('property', 'og:image', seoData.ogImage);
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('property', 'og:image:alt', seoData.siteTitle || '슬반생 공식 대표 이미지');

  // 4. Twitter Cards
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', seoData.siteTitle);
  setMeta('name', 'twitter:description', seoData.siteDescription);
  setMeta('name', 'twitter:image', seoData.ogImage);

  // 5. Canonical Link
  setLink('canonical', seoData.canonicalUrl || 'https://www.seulbanlife.com');

  // 6. Favicon
  if (seoData.favicon) {
    const isSvg = seoData.favicon.startsWith('data:image/svg+xml') || seoData.favicon.endsWith('.svg');
    setLink('icon', seoData.favicon, isSvg ? 'image/svg+xml' : undefined);
  }
}
