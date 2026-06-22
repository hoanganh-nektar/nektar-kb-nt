import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { discoverTree, flattenTree, flattenArticles, buildPathIndex, toSlug } from './discover.js';
import { fetchBlockTree } from './api.js';
import { renderBlocks } from './render.js';
import { plainText } from './richtext.js';
import { articleTemplate, sectionIndexTemplate, homeTemplate } from './template.js';
import { downloadImages, downloadNavIcon } from './images.js';
import { generateComponentsJs } from './generate-components.js';
import { pageMeta } from '../page-meta.js';

const ROOT_PAGE_ID = '3819417ef6ba80758316ce06f2e81518';
const SITE_DIR = path.resolve(fileURLToPath(import.meta.url), '../../../docs');

export async function build() {
  console.log('Discovering page tree...');
  const tree = await discoverTree(ROOT_PAGE_ID);
  const pathIndex = buildPathIndex(tree);

  // Pre-seed pathIndex with explicit outputPath overrides from page-meta so that
  // internal links to sub-articles (e.g. child_pages inside articles) resolve correctly.
  for (const [id, meta] of Object.entries(pageMeta)) {
    if (meta?.outputPath && !pathIndex[id]) pathIndex[id] = meta.outputPath;
  }

  const allNodes = flattenTree(tree);

  console.log(`\nPages to build (${allNodes.length} total):`);
  allNodes.forEach(n => console.log(`  ${n.outputPath}`));
  console.log('');

  for (const node of allNodes) {
    await buildNode(node, tree, pathIndex);
  }

  // Build standalone pages (linked from content but not in root structure)
  for (const id of pageMeta.standalonePages || []) {
    const normId = id.replace(/-/g, '');
    const meta = pageMeta[normId] || {};
    if (!meta.outputPath) { console.warn(`  Standalone page ${id} has no outputPath in page-meta — skipping.`); continue; }
    pathIndex[normId] = meta.outputPath;
    const standaloneNode = {
      type: 'article',
      id,
      title: meta.title || id,
      outputPath: meta.outputPath,
      depth: 2,
      cardIcon: meta.cardIcon || null,
      illustration: meta.illustration || null,
      illustrationBg: meta.illustrationBg || null,
      descFull: '',
      descShort: '',
      children: [],
    };
    await buildNode(standaloneNode, tree, pathIndex);
  }

  // Download nav icons and generate components.js
  console.log('\nGenerating components.js...');
  const navIconPaths = {};
  for (const node of flattenTree(tree)) {
    if (node.cardIcon && node.slug) {
      const localPath = await downloadNavIcon(node.cardIcon, node.slug, SITE_DIR);
      if (localPath) navIconPaths[node.slug] = localPath;
    }
  }
  const componentsJs = generateComponentsJs(tree, navIconPaths);
  await fsp.writeFile(path.join(SITE_DIR, 'assets', 'js', 'components.js'), componentsJs, 'utf8');

  console.log('\nBuild complete.');
  return { tree, pathIndex, pages: flattenArticles(tree) };
}

async function buildNode(node, tree, pathIndex) {
  console.log(`Building ${node.outputPath}...`);
  let html;

  if (node.type === 'root') {
    html = homeTemplate({ rootNode: node, tree, pathIndex });
  } else if (node.type === 'section') {
    const sectionMeta = pageMeta[node.blockId?.replace(/-/g, '') || node.id?.replace(/-/g, '')] || {};
    const effectiveSection = {
      ...node,
      illustration: sectionMeta.illustration || node.illustration,
    };
    html = sectionIndexTemplate({
      node: effectiveSection,
      heroDesc: node.heroDesc || node.descShort || node.descFull || '',
      children: node.children,
      tree,
    });
  } else {
    // article — fetch full content from Notion
    const { html: articleHtml, childPages } = await buildArticlePage(node, tree, pathIndex);
    html = articleHtml;
    // Build any child_page sub-articles embedded in this article
    for (const cp of childPages) {
      const normId = cp.id.replace(/-/g, '');
      const cpMeta = pageMeta[normId] || {};
      const parentDir = node.outputPath.replace(/[^/]+$/, '');
      const cpOutputPath = cpMeta.outputPath || `${parentDir}${toSlug(cp.child_page.title)}.html`;
      pathIndex[normId] = cpOutputPath;
      const cpNode = {
        type: 'article',
        id: cp.id,
        title: cp.child_page.title,
        outputPath: cpOutputPath,
        depth: node.depth + 1,
        cardIcon: cpMeta.cardIcon || null,
        illustration: cpMeta.illustration || null,
        illustrationBg: cpMeta.illustrationBg || null,
        descFull: '',
        descShort: '',
        children: [],
      };
      await buildNode(cpNode, tree, pathIndex);
    }
  }

  // Download Notion-hosted images and rewrite URLs to local paths
  const imageId = node.id ? node.id.replace(/-/g, '') : node.blockId.replace(/-/g, '');
  html = await downloadImages(html, imageId, node.outputPath, SITE_DIR);

  const outPath = path.join(SITE_DIR, node.outputPath);
  await fsp.mkdir(path.dirname(outPath), { recursive: true });
  await fsp.writeFile(outPath, html, 'utf8');
}

async function buildArticlePage(node, tree, pathIndex) {
  const blocks = await fetchBlockTree(node.id);
  const meta = pageMeta[node.id?.replace(/-/g, '')] || {};

  // Extract description fields and first image from Notion content
  let heroDesc = '';
  let firstImageUrl = null;
  const bodyBlocks = [];
  const childPages = [];
  for (const block of blocks) {
    if (block.type === 'paragraph') {
      const plain = plainText(block.paragraph.rich_text);
      if (!heroDesc && (plain.startsWith('Description:') || plain.startsWith('Short description:'))) {
        heroDesc = plain.replace(/^(?:Short )?[Dd]escription:\s*/, '');
        continue;
      }
    }
    if (block.type === 'image' && !firstImageUrl) {
      firstImageUrl = block.image?.type === 'external'
        ? block.image.external?.url
        : block.image?.file?.url;
    }
    if (block.type === 'child_page') {
      childPages.push(block);
    } else {
      bodyBlocks.push(block);
    }
  }

  // Fall back to values discovered from root page structure, then page-meta
  if (!heroDesc) heroDesc = node.descShort || node.descFull || meta.heroDesc || '';
  const tocEntries = [];
  const body = renderBlocks(bodyBlocks, pathIndex, tocEntries, node.outputPath);

  // Illustration: page-meta override → Notion discovery (illustration) → first image in page
  const effectiveNode = {
    ...node,
    illustration: meta.illustration || node.illustration || firstImageUrl,
    illustrationBg: meta.illustrationBg,
  };

  return { html: articleTemplate({ node: effectiveNode, body, tocEntries, heroDesc, tree }), childPages };
}
