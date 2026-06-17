import { pageMeta } from '../page-meta.js';
import { findAncestors, findNode, flattenTree } from './discover.js';
import { escapeHtml } from './richtext.js';

// Returns the string of ../ needed to reach site root from this output path
function rootRelative(outputPath) {
  const depth = (outputPath.match(/\//g) || []).length;
  return depth === 0 ? '' : '../'.repeat(depth);
}

// Relative path from one HTML file to another (both relative to site root)
function relPath(fromHtml, toHtml) {
  const fromParts = fromHtml.split('/');
  fromParts.pop(); // drop filename, keep directory parts
  const toParts = toHtml.split('/');
  let shared = 0;
  while (shared < fromParts.length && fromParts[shared] === toParts[shared]) shared++;
  const ups = fromParts.length - shared;
  return '../'.repeat(ups) + toParts.slice(shared).join('/');
}

function breadcrumbHtml(node, tree, R) {
  // Sections don't have a page id — use blockId for ancestor lookup
  const lookupId = node.id || node.blockId;
  const ancestors = findAncestors(lookupId, tree) || [];
  const crumbs = [
    `<a href="${R}index.html">Home</a>`,
    ...ancestors
      .filter(a => a.depth > 0)
      .map(a => `<a href="${R}${a.outputPath}">${escapeHtml(a.title)}</a>`),
    `<span>${escapeHtml(node.title)}</span>`,
  ];
  return crumbs.join('\n          <span class="sep">›</span>\n          ');
}

function autoShort(full) {
  if (!full) return '';
  const dashAt = full.indexOf(' — ');
  if (dashAt > 40) return full.slice(0, dashAt) + '.';
  const dotAt = full.indexOf('. ');
  if (dotAt > 40) return full.slice(0, dotAt + 1);
  return full.length > 90 ? full.slice(0, 87).replace(/\s+\S+$/, '…') : full;
}

export function articleTemplate({ node, body, tocEntries, heroDesc, tree }) {
  const R = rootRelative(node.outputPath);

  // illustration and illustrationBg are set by build.js (from page-meta or node)
  const illSrcRaw = node.illustration || '';
  // Local asset paths need R prefix; absolute URLs (Notion S3, etc.) do not
  const illSrc = illSrcRaw.startsWith('http') ? illSrcRaw : (illSrcRaw ? `${R}${illSrcRaw}` : '');
  const illBg = node.illustrationBg || '';

  if (!illSrc) console.warn(`  No illustration for "${node.title}"`);

  const illustrationStyle = illBg ? ` style="background: ${illBg};"` : '';
  const imgStyle = illBg ? ` style="object-fit: contain; width: 100%; height: 100%;"` : '';
  const illustrationHtml = illSrc
    ? `<div class="hero-illustration"${illustrationStyle}>
        <img src="${illSrc}" alt="${escapeHtml(node.title)}"${imgStyle} />
      </div>`
    : '';

  const tocHtml = tocEntries?.length
    ? `<aside class="article-toc">
        <p class="toc-title">Content</p>
        <div class="toc-list">
          ${tocEntries.map(e => {
            const cls = e.level === 3 ? ' class="toc-h3"' : '';
            return `<a href="#${e.id}"${cls}>${escapeHtml(e.text)}</a>`;
          }).join('\n          ')}
        </div>
      </aside>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(node.title)} – Nektar</title>
  <link rel="stylesheet" href="${R}assets/css/styles.css" />
</head>
<body>
<div id="nav-placeholder"></div>
<div id="main-wrapper">
  <div class="page-content">
    <div class="page-hero">
      <div class="hero-text">
        <div class="breadcrumb">
          ${breadcrumbHtml(node, tree, R)}
        </div>
        <h1>${escapeHtml(node.title)}</h1>
        <p class="hero-desc">${heroDesc}</p>
      </div>
      ${illustrationHtml}
    </div>
    <div class="article-layout">
      <div class="article-body">
        <div class="article-content">
          ${body}
        </div>
      </div>
      ${tocHtml}
    </div>
  </div>
  <div id="footer-placeholder"></div>
</div>
<script src="${R}assets/js/components.js"></script>
</body>
</html>`;
}

export function sectionIndexTemplate({ node, heroDesc, children, tree }) {
  const R = rootRelative(node.outputPath);

  // illustration comes from Notion (section toggle image) or page-meta override
  const illSrcRaw = node.illustration || '';
  const illSrc = illSrcRaw.startsWith('http') ? illSrcRaw : (illSrcRaw ? `${R}${illSrcRaw}` : '');
  const illustrationHtml = illSrc
    ? `<div class="hero-illustration">
        <img src="${illSrc}" alt="${escapeHtml(node.title)}" />
      </div>`
    : '';

  const breadcrumb = node.depth > 0
    ? `<div class="breadcrumb">
          ${breadcrumbHtml(node, tree, R)}
        </div>\n        `
    : '';

  const cardsHtml = children.map(child => {
    const childKey = (child.id || child.blockId || '').replace(/-/g, '');
    const childMeta = pageMeta[childKey] || {};
    // icon comes from Notion (article entry toggle image) or page-meta override
    const iconRaw = childMeta.cardIcon || child.cardIcon || '';
    // Local asset paths need R prefix; Notion S3/absolute URLs do not
    const icon = iconRaw.startsWith('http') ? iconRaw : (iconRaw ? `${R}${iconRaw}` : '');
    const iconBg = childMeta.cardIconBg || 'yellow-bg';
    const descFull = child.descFull || '';
    const descShort = child.descShort || autoShort(descFull);

    const iconHtml = icon
      ? `<div class="card-icon ${iconBg}">
          <img src="${icon}" alt="${escapeHtml(child.title)}" />
        </div>`
      : '';

    const href = relPath(node.outputPath, child.outputPath);

    return `<a href="${href}" class="article-card">
  ${iconHtml}
  <div class="card-body">
    <h3>${escapeHtml(child.title)}</h3>
    <p><span class="desc-full">${descFull}</span><span class="desc-short">${descShort}</span></p>
  </div>
</a>`;
  }).join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(node.title)} – Nektar</title>
  <link rel="stylesheet" href="${R}assets/css/styles.css" />
</head>
<body>
<div id="nav-placeholder"></div>
<div id="main-wrapper">
  <div class="page-content">
    <div class="page-hero">
      <div class="hero-text">
        ${breadcrumb}<h1>${escapeHtml(node.title)}</h1>
        <p class="hero-desc">${heroDesc}</p>
      </div>
      ${illustrationHtml}
    </div>
    <div class="article-cards">
      ${cardsHtml}
    </div>
  </div>
  <div id="footer-placeholder"></div>
</div>
<script src="${R}assets/js/components.js"></script>
</body>
</html>`;
}

export function homeTemplate({ rootNode, tree, pathIndex }) {
  const { homeFeatured } = pageMeta;
  const mostVisited = (homeFeatured?.mostVisited || [])
    .map(id => homeCard(id, tree, pathIndex))
    .filter(Boolean);
  const recentlyUpdated = (homeFeatured?.recentlyUpdated || [])
    .map(id => homeCard(id, tree, pathIndex))
    .filter(Boolean);

  const topicCards = rootNode.children.map(section => {
    const illSrc = section.illustration || '';
    return `<a href="${section.outputPath}" class="topic-card">
  <div class="topic-card-img">
    ${illSrc ? `<img src="${illSrc}" alt="${escapeHtml(section.title)}" />` : ''}
  </div>
  <div class="topic-card-text">
    <h3>${escapeHtml(section.title)}</h3>
    <p>${section.heroDesc || ''}</p>
  </div>
</a>`;
  }).join('\n\n');

  const mostVisitedHtml = mostVisited.length
    ? `<p class="home-section-title">Most visited</p>
        <div class="card-grid-2">
          ${mostVisited.join('\n          ')}
        </div>\n\n        `
    : '';

  const recentlyUpdatedHtml = recentlyUpdated.length
    ? `<p class="home-section-title">Recently updated</p>
        <div class="card-grid-2">
          ${recentlyUpdated.join('\n          ')}
        </div>\n\n        `
    : '';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nektar Knowledge Base</title>
    <link rel="stylesheet" href="assets/css/styles.css" />
  </head>
  <body>
    <div id="nav-placeholder"></div>
    <div id="main-wrapper">
      <div class="home-hero">
        <p class="home-title">
          <span>Explore </span><span class="yellow">Nektar</span>
        </p>
        <div class="home-hero-right">
          <span class="hero-tagline">
            <span class="tagline-full">If you haven't yet</span><span class="tagline-short">Haven't yet?</span>
          </span>
          <a class="btn-dark" href="https://nektar.ai/book-a-demo/" target="_blank" rel="noopener"
            ><span class="btn-full">Get Nektar for your team</span><span class="btn-short">Get Nektar</span></a>
        </div>
      </div>
      <div class="home-sections">
        ${mostVisitedHtml}${recentlyUpdatedHtml}<p class="home-section-title">Topics</p>
        <div class="topics-grid">
          ${topicCards}
        </div>
      </div>
      <div id="footer-placeholder"></div>
    </div>
    <script src="assets/js/components.js"></script>
  </body>
</html>`;
}

function homeCard(pageId, tree, pathIndex) {
  const normId = pageId.replace(/-/g, '');
  const outputPath = pathIndex[normId];
  if (!outputPath) {
    console.warn(`  Home featured page not found in tree: ${pageId}`);
    return '';
  }

  const node = findNode(normId, tree) || flattenTree(tree).find(n => n.id?.replace(/-/g, '') === normId);
  const meta = pageMeta[normId] || {};
  const icon = meta.cardIcon || node?.cardIcon || '';
  const iconBg = meta.cardIconBg || 'yellow-bg';
  const descFull = meta.descFull || node?.descFull || '';
  const descShort = meta.descShort || node?.descShort || autoShort(descFull);
  const title = node?.title || meta.title || '';

  const iconHtml = icon
    ? `<div class="card-icon ${iconBg}">
          <img src="${icon}" alt="" />
        </div>`
    : '';

  return `<a href="${outputPath}" class="article-card">
  ${iconHtml}
  <div class="card-body">
    <h3>${escapeHtml(title)}</h3>
    <p><span class="desc-full">${descFull}</span><span class="desc-short">${descShort}</span></p>
  </div>
</a>`;
}
