import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { discoverTree, flattenTree, flattenArticles, buildPathIndex } from './discover.js';
import { fetchBlockTree } from './api.js';
import { renderBlocks } from './render.js';
import { renderRichText } from './richtext.js';
import { articleTemplate, sectionIndexTemplate, homeTemplate } from './template.js';
import { downloadImages } from './images.js';
import { pageMeta } from '../page-meta.js';

const ROOT_PAGE_ID = '3819417ef6ba80758316ce06f2e81518';
const SITE_DIR = path.resolve(fileURLToPath(import.meta.url), '../../../site');

export async function build() {
  console.log('Discovering page tree...');
  const tree = await discoverTree(ROOT_PAGE_ID);
  const pathIndex = buildPathIndex(tree);
  const allNodes = flattenTree(tree);

  console.log(`\nPages to build (${allNodes.length} total):`);
  allNodes.forEach(n => console.log(`  ${n.outputPath}`));
  console.log('');

  for (const node of allNodes) {
    await buildNode(node, tree, pathIndex);
  }

  console.log('\nBuild complete.');
  return { tree, pathIndex, pages: flattenArticles(tree) };
}

async function buildNode(node, tree, pathIndex) {
  console.log(`Building ${node.outputPath}...`);
  let html;

  if (node.type === 'root') {
    html = homeTemplate({ rootNode: node, tree, pathIndex });
  } else if (node.type === 'section') {
    html = sectionIndexTemplate({
      node,
      heroDesc: node.heroDesc || '',
      children: node.children,
      tree,
    });
  } else {
    // article — fetch full content from Notion
    html = await buildArticlePage(node, tree, pathIndex);
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

  // First paragraph → hero description
  let heroDesc = meta.heroDesc || '';
  let bodyStart = 0;
  if (!heroDesc && blocks[0]?.type === 'paragraph') {
    heroDesc = renderRichText(blocks[0].paragraph.rich_text, pathIndex);
    bodyStart = 1;
  }

  const bodyBlocks = blocks.slice(bodyStart).filter(b => b.type !== 'child_page');
  const tocEntries = [];
  const body = renderBlocks(bodyBlocks, pathIndex, tocEntries);

  // Illustration comes from page-meta; fall back to the card icon from discovery
  const effectiveNode = {
    ...node,
    illustration: meta.illustration || node.illustration || node.cardIcon,
    illustrationBg: meta.illustrationBg,
  };

  return articleTemplate({ node: effectiveNode, body, tocEntries, heroDesc, tree });
}
