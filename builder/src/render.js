import { renderRichText, plainText, escapeHtml } from './richtext.js';

export function toId(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function calloutClass(icon) {
  const emoji = icon?.emoji || '';
  if (['⚙️', '🔧', '🛠️', '🔩', '⚗️', '🔬'].includes(emoji)) return 'callout-neutral-technical';
  if (['⚠️', '🚨', '❗', '❌', '🔴', '🛑'].includes(emoji)) return 'callout-warning';
  return 'callout-neutral-info';
}

export function renderBlocks(blocks, pathIndex, tocEntries) {
  const out = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === 'bulleted_list_item') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'bulleted_list_item') {
        items.push(blocks[i++]);
      }
      out.push(renderList('ul', items, pathIndex, tocEntries));
      continue;
    }

    if (block.type === 'numbered_list_item') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
        items.push(blocks[i++]);
      }
      out.push(renderList('ol', items, pathIndex, tocEntries));
      continue;
    }

    const html = renderBlock(block, pathIndex, tocEntries);
    if (html) out.push(html);
    i++;
  }

  return out.join('\n');
}

function renderBlock(block, pathIndex, tocEntries) {
  const data = block[block.type];
  const rt = data?.rich_text;
  const text = rt ? renderRichText(rt, pathIndex) : '';
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
      tocEntries?.push({ id, text: plain, level: 3 });
      const body = block._children
        ? renderBlocks(block._children, pathIndex)
        : '';
      return `<details id="${id}" class="details-section details-section--h3">
  <summary>${text}</summary>
  ${body}
</details>`;
    }

    case 'callout': {
      const cls = calloutClass(data.icon);
      const singleLine = !block.has_children ? ' callout-single-line' : '';
      const extra = block._children
        ? '\n' + renderBlocks(block._children, pathIndex)
        : '';
      return `<div class="callout ${cls}${singleLine}">
  <p>${text}</p>${extra}
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
        ? renderBlocks(block._children, pathIndex)
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
        ? renderBlocks(block._children, pathIndex, tocEntries)
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

function renderList(tag, items, pathIndex, tocEntries) {
  const lis = items.map(item => {
    const data = item[item.type];
    const text = renderRichText(data.rich_text, pathIndex);
    const nested = item._children
      ? '\n' + renderBlocks(item._children, pathIndex, tocEntries)
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
