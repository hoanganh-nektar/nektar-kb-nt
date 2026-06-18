import { renderRichText, plainText, escapeHtml } from './richtext.js';

export function toId(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const KNOWN_CALLOUT_CLASSES = new Set([
  'callout-neutral-info',
  'callout-neutral-technical',
  'callout-neutral-beta',
  'callout-neutral-link',
  'callout-warning',
  'callout-error',
]);

function calloutClass(icon, color) {
  // File icon: extract class name from the filename in the URL
  const fileUrl = icon?.file?.url || icon?.external?.url || '';
  if (fileUrl) {
    const match = fileUrl.match(/\/(callout-[^/?]+)\.svg/);
    if (match && KNOWN_CALLOUT_CLASSES.has(match[1])) return match[1];
  }
  // Emoji fallback
  const emoji = icon?.emoji || '';
  if (['⚙️', '🔧', '🛠️', '🔩', '⚗️', '🔬'].includes(emoji)) return 'callout-neutral-technical';
  if (['⚠️', '🚨', '❗', '❌', '🔴', '🛑'].includes(emoji)) return 'callout-warning';
  // Notion background color fallback
  if (color) {
    if (color.includes('red') || color.includes('orange')) return 'callout-warning';
    if (color.includes('yellow')) return 'callout-warning';
    if (color.includes('gray') || color.includes('grey')) return 'callout-neutral-technical';
  }
  return 'callout-neutral-info';
}

export function renderBlocks(blocks, pathIndex, tocEntries, fromPath = '') {
  const out = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === 'bulleted_list_item') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'bulleted_list_item') {
        items.push(blocks[i++]);
      }
      out.push(renderList('ul', items, pathIndex, tocEntries, fromPath));
      continue;
    }

    if (block.type === 'numbered_list_item') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
        items.push(blocks[i++]);
      }
      out.push(renderList('ol', items, pathIndex, tocEntries, fromPath));
      continue;
    }

    const html = renderBlock(block, pathIndex, tocEntries, fromPath);
    if (html) out.push(html);
    i++;
  }

  return out.join('\n');
}

function renderBlock(block, pathIndex, tocEntries, fromPath = '') {
  const data = block[block.type];
  const rt = data?.rich_text;
  const text = rt ? renderRichText(rt, pathIndex, fromPath) : '';
  const plain = rt ? plainText(rt) : '';

  switch (block.type) {
    case 'paragraph':
      return plain.trim() ? `<p>${text}</p>` : '';

    case 'heading_1': {
      const id = toId(plain);
      tocEntries?.push({ id, text: plain, level: 2 });
      return `<h2 id="${id}">${text}</h2>`;
    }

    case 'heading_2': {
      const id = toId(plain);
      tocEntries?.push({ id, text: plain, level: 2 });
      return `<h2 id="${id}">${text}</h2>`;
    }

    case 'heading_3': {
      const id = toId(plain);
      tocEntries?.push({ id, text: plain, level: 3 });
      return `<h3 id="${id}">${text}</h3>`;
    }

    case 'toggle': {
      const id = toId(plain);
      // Toggles are collapsible sections, not headings — omit from TOC
      const body = block._children
        ? renderBlocks(block._children, pathIndex, null, fromPath)
        : '';
      return `<details id="${id}" class="details-section details-section--h3">
  <summary>${text}</summary>
  ${body}
</details>`;
    }

    case 'callout': {
      const cls = calloutClass(data.icon, data.color);
      const singleLine = !block.has_children ? ' callout-single-line' : '';
      const extra = block._children
        ? '\n' + renderBlocks(block._children, pathIndex, null, fromPath)
        : '';
      return `<div class="callout ${cls}${singleLine}">
  <div class="callout-body"><p>${text}</p>${extra}</div>
</div>`;
    }

    case 'image': {
      const url = data.type === 'external' ? data.external.url : data.file.url;
      const caption = data.caption?.length ? plainText(data.caption) : '';
      const captionHtml = caption ? `\n  <figcaption>${escapeHtml(caption)}</figcaption>` : '';
      return `<figure class="article-image">
  <img src="${url}" alt="${escapeHtml(caption)}" />${captionHtml}
</figure>`;
    }

    case 'code': {
      const lang = data.language || 'plaintext';
      const code = plainText(data.rich_text)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<pre><code class="language-${lang}">${code}</code></pre>`;
    }

    case 'table': {
      if (!block._children?.length) return '';
      return renderTable(block, pathIndex);
    }

    case 'divider':
      return '<hr />';

    case 'quote': {
      const body = block._children
        ? renderBlocks(block._children, pathIndex, null, fromPath)
        : '';
      return `<blockquote><p>${text}</p>${body}</blockquote>`;
    }

    case 'heading_4': {
      const id = toId(plain);
      tocEntries?.push({ id, text: plain, level: 3 });
      return `<h4 id="${id}">${text}</h4>`;
    }

    case 'synced_block':
      // Render the synced content if available
      return block._children
        ? renderBlocks(block._children, pathIndex, tocEntries, fromPath)
        : '';

    // Handled at a higher level or ignored
    case 'child_page':
    case 'child_database':
    case 'column_list':
    case 'column':
      return '';

    default:
      console.warn(`  Unhandled block type: ${block.type}`);
      return '';
  }
}

function renderList(tag, items, pathIndex, tocEntries, fromPath = '') {
  const lis = items.map(item => {
    const data = item[item.type];
    const text = renderRichText(data.rich_text, pathIndex, fromPath);
    const nested = item._children
      ? '\n' + renderBlocks(item._children, pathIndex, tocEntries, fromPath)
      : '';
    return `<li>${text}${nested}</li>`;
  });
  return `<${tag}>\n${lis.join('\n')}\n</${tag}>`;
}

function renderTable(tableBlock, pathIndex) {
  const rows = tableBlock._children;
  const hasHeader = tableBlock.table?.has_column_header;
  const cols = rows[0]?.table_row?.cells?.length || 2;
  const fraction = Math.round(10 / cols);
  const gridCols = Array(cols).fill(`${fraction}fr`).join(' ');

  const rowHtmls = rows.map((row, i) => {
    const cells = row.table_row?.cells || [];
    const isHeader = hasHeader && i === 0;
    const cellHtmls = cells.map(cell => {
      const text = renderRichText(cell, pathIndex);
      return `<div class="data-table-cell">${text}</div>`;
    });
    const headerClass = isHeader ? ' data-table-header' : '';
    return `<div class="data-table-row${headerClass}">\n${cellHtmls.join('\n')}\n</div>`;
  });

  return `<div class="data-table" style="grid-template-columns: ${gridCols}">
${rowHtmls.join('\n')}
</div>`;
}
