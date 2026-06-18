export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderRichText(richTexts, pathIndex = {}, fromPath = '') {
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
      const href = resolveHref(rt.href, pathIndex, fromPath);
      text = `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    }
    return text;
  }).join('');
}

function resolveHref(href, pathIndex, fromPath) {
  // Notion internal links end with a 32-char hex page ID
  const m = href.match(/([a-f0-9]{32})(?:[?#].*)?$/);
  if (m) {
    const toPath = pathIndex[m[1]];
    if (toPath) return fromPath ? relPath(fromPath, toPath) : toPath;
    // Unresolved internal link — fall back to notion.so so it doesn't 404
    return `https://www.notion.so/${m[1]}`;
  }
  return href;
}

function relPath(fromHtml, toHtml) {
  const fromParts = fromHtml.split('/');
  fromParts.pop();
  const toParts = toHtml.split('/');
  let shared = 0;
  while (shared < fromParts.length && fromParts[shared] === toParts[shared]) shared++;
  return '../'.repeat(fromParts.length - shared) + toParts.slice(shared).join('/');
}

export function plainText(richTexts) {
  return richTexts?.map(rt => rt.plain_text).join('') || '';
}
