import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { discoverTree, flattenTree, flattenArticles, buildPathIndex } from './discover.js';
import { fetchBlockTree } from './api.js';
import { renderBlocks } from './render.js';
import { plainText } from './richtext.js';
import { articleTemplate, sectionIndexTemplate, homeTemplate } from './template.js';
import { downloadImages } from './images.js';
import { pageMeta } from '../page-meta.js';

const ROOT_PAGE_ID = '3819417ef6ba80758316ce06f2e81518';
const SITE_DIR = path.resolve(fileURLToPath(import.meta.url), '../../../docs');

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

  // Extract description fields from Notion content (paragraphs prefixed with field name)
  let heroDesc = '';
  const bodyBlocks = [];
  for (const block of blocks) {
    if (block.type === 'paragraph') {
      const plain = plainText(block.paragraph.rich_text);
      if (!heroDesc && (plain.startsWith('Description:') || plain.startsWith('Short description:'))) {
        heroDesc = plain.replace(/^(?:Short )?[Dd]escription:\s*/, '');
        continue;
      }
    }
    if (block.type !== 'child_page') bodyBlocks.push(block);
  }

  // Fall back to values discovered from root page structure, then page-meta
  if (!heroDesc) heroDesc = node.descShort || node.descFull || meta.heroDesc || '';
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
