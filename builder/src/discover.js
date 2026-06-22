import { getPage, fetchBlockTree } from './api.js';
import { plainText } from './richtext.js';
import { pageMeta } from '../page-meta.js';

export function toSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Root Notion page uses heading_2 for sections.
// Each section uses heading_3 for article entries or sub-sections.
// Sub-sections (like Salesforce) use heading_4 for their articles.

export async function discoverTree(rootId) {
  const page = await getPage(rootId);
  const blocks = await fetchBlockTree(rootId);

  const children = [];
  for (const block of blocks) {
    if (block.type === 'heading_2' && block.has_children) {
      const node = parseSectionBlock(block, '', 1);
      if (node) children.push(node);
    }
  }

  return {
    type: 'root',
    id: rootId,
    title: 'Knowledgebase',
    slug: '',
    outputPath: 'index.html',
    depth: 0,
    lastEditedTime: page.last_edited_time,
    children,
  };
}

// Parses a section (heading_2) or sub-section (heading_3) block.
// Returns a section node whose children are article nodes.
function parseSectionBlock(block, parentDir, depth) {
  const title = getBlockText(block);
  if (!title) return null;

  const slug = toSlug(title);
  const outDir = parentDir ? `${parentDir}${slug}/` : `${slug}/`;
  const outputPath = `${outDir}index.html`;
  const innerBlocks = block._children || [];

  const sectionImageUrls = [];
  let descFull = '';
  let descShort = '';
  const children = [];

  // Determine child heading level (sections use h3, sub-sections use h4)
  const articleHeadingType = depth === 1 ? 'heading_3' : 'heading_4';

  for (const child of innerBlocks) {
    if (child.type === 'image') {
      sectionImageUrls.push(getImageUrl(child));
    } else if (child.type === 'paragraph') {
      const text = getBlockText(child).trim();
      if (text.startsWith('Long description:')) descFull = text.replace(/^Long description:\s*/, '');
      else if (text.startsWith('Short description:')) descShort = text.replace(/^Short description:\s*/, '');
    } else if (child.type === articleHeadingType && child.has_children) {
      const innerChildren = child._children || [];
      const hasChildPage = innerChildren.some(b => b.type === 'child_page');

      if (hasChildPage) {
        const article = parseArticleBlock(child, outDir, depth + 1);
        if (article) children.push(article);
      } else {
        // Sub-section (e.g. Salesforce inside Connectors)
        const sub = parseSectionBlock(child, outDir, depth + 1);
        if (sub) children.push(sub);
      }
    }
  }

  // Use second image for illustration (colored/bg version); fall back to first
  const illustration = sectionImageUrls[1] || sectionImageUrls[0] || null;

  return {
    type: 'section',
    id: null,
    blockId: block.id,
    title,
    slug,
    outputPath,
    childDir: outDir,
    depth,
    illustration,
    descFull,
    descShort,
    cardIcon: illustration,
    children,
  };
}

// Parses an article entry (heading_3 or heading_4) that contains a child_page.
function parseArticleBlock(block, parentDir, depth) {
  const title = getBlockText(block);
  if (!title) return null;

  const innerBlocks = block._children || [];
  let pageId = null;
  const imageUrls = [];
  let descFull = '';
  let descShort = '';

  for (const child of innerBlocks) {
    if (child.type === 'child_page' && !pageId) {
      pageId = child.id;
    } else if (child.type === 'image') {
      imageUrls.push(getImageUrl(child));
    } else if (child.type === 'paragraph') {
      const text = getBlockText(child).trim();
      if (text.startsWith('Long description:')) descFull = text.replace(/^Long description:\s*/, '');
      else if (text.startsWith('Short description:')) descShort = text.replace(/^Short description:\s*/, '');
    }
  }

  if (!pageId) return null;

  // 1st image = article illustration; 2nd image = nav icon (only when 2 images present)
  const illustration = imageUrls[0] || null;
  const cardIcon = imageUrls.length >= 2 ? imageUrls[1] : null;

  const slug = toSlug(title);
  const normId = pageId.replace(/-/g, '');
  const pm = pageMeta[normId] || {};
  const outputPath = pm.outputPath || `${parentDir}${slug}.html`;

  return {
    type: 'article',
    id: pageId,
    blockId: block.id,
    title,
    slug,
    outputPath,
    depth,
    cardIcon,
    illustration,
    descFull,
    descShort,
    children: [],
  };
}

function getBlockText(block) {
  const data = block[block.type];
  return plainText(data?.rich_text || []);
}

function getImageUrl(imageBlock) {
  if (!imageBlock?.image) return null;
  return imageBlock.image.type === 'external'
    ? imageBlock.image.external?.url
    : imageBlock.image.file?.url;
}

export function flattenTree(node) {
  const pages = [node];
  for (const child of node.children) {
    pages.push(...flattenTree(child));
  }
  return pages;
}

export function flattenArticles(node) {
  const articles = [];
  if (node.id) articles.push(node);
  for (const child of node.children) {
    articles.push(...flattenArticles(child));
  }
  return articles;
}

export function buildPathIndex(tree) {
  const index = {};
  for (const page of flattenTree(tree)) {
    if (page.id) index[page.id.replace(/-/g, '')] = page.outputPath;
  }
  return index;
}

export function findNode(id, node) {
  if (node.id === id) return node;
  for (const child of node.children) {
    const found = findNode(id, child);
    if (found) return found;
  }
  return null;
}

export function findAncestors(id, node, path = []) {
  if (node.id === id || node.blockId === id) return path;
  for (const child of node.children) {
    const result = findAncestors(id, child, [...path, node]);
    if (result) return result;
  }
  return null;
}
