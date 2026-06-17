import { Client } from '@notionhq/client';

export const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function getPage(pageId) {
  return notion.pages.retrieve({ page_id: pageId });
}

export async function getPageBlocks(blockId) {
  const blocks = [];
  let cursor;
  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });
    blocks.push(...res.results);
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  return blocks;
}

// Block types that may have meaningful nested children
const FETCH_CHILDREN_TYPES = new Set([
  'toggle',
  'heading_1',
  'heading_2',
  'heading_3',
  'heading_4',
  'bulleted_list_item',
  'numbered_list_item',
  'quote',
  'callout',
  'table',
  'column_list',
  'column',
  'synced_block',
]);

export async function fetchBlockTree(blockId) {
  const blocks = await getPageBlocks(blockId);
  for (const block of blocks) {
    if (block.has_children && FETCH_CHILDREN_TYPES.has(block.type)) {
      block._children = await fetchBlockTree(block.id);
    }
  }
  return blocks;
}

export function getPageTitle(page) {
  const titleProp = page.properties?.title || page.properties?.Name;
  if (titleProp?.title?.length) return titleProp.title[0].plain_text;
  if (page.child_page?.title) return page.child_page.title;
  return 'Untitled';
}
