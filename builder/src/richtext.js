export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderRichText(richTexts, pathIndex = {}) {
  if (!richTexts?.length) return '';
  return richTexts.map(rt => {
    let text = escapeHtml(rt.plain_text);
    if (!text) return '';
    const ann = rt.annotations;
    if (ann.code) text = `<code>${text}</code>`;
    if (ann.bold) text = `<strong>${text}</strong>`;
    if (ann.italic) text = `<em>${text}</em>`;
    if (ann.strikethrough) text = `<s>${text}</s>`;
    if (rt.href) {
      const href = resolveHref(rt.href, pathIndex);
      text = `<a href="${escapeHtml(href)}">${text}</a>`;
    }
    return text;
  }).join('');
}

function resolveHref(href, pathIndex) {
  // Notion internal links end with a 32-char hex page ID
  const m = href.match(/([a-f0-9]{32})(?:[?#].*)?$/);
  if (m) {
    const path = pathIndex[m[1]];
    if (path) return `/${path}`;
  }
  return href;
}

export function plainText(richTexts) {
  return richTexts?.map(rt => rt.plain_text).join('') || '';
}
