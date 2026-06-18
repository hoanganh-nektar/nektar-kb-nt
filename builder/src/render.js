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

// Parse merge groups from a Merge directive string.
// "R5 + R6 + R7, R8 + R9" → [[[5,null],[6,null],[7,null]], [[8,null],[9,null]]]
// "R2C1 + R3C1"            → [[[2,1],[3,1]]]
// Returns a Set of "ri,cj" keys (0-based) whose bottom border should be suppressed.
function parseMerge(mergeStr) {
  const noBorder = new Set();
  const groups = mergeStr.split(',');
  for (const group of groups) {
    const items = group.split('+').map(s => {
      const m = s.trim().match(/^R(\d+)(?:C(\d+))?$/i);
      if (!m) return null;
      return { r: parseInt(m[1]) - 1, c: m[2] != null ? parseInt(m[2]) - 1 : null };
    }).filter(Boolean);
    // Remove bottom border of every item except the last in the group
    for (let k = 0; k < items.length - 1; k++) {
      const { r, c } = items[k];
      noBorder.add(c === null ? `r${r}` : `r${r}c${c}`);
    }
  }
  return noBorder;
}

// Parse a [Directive] paragraph that precedes a table.
// Supports: "Vertical table" (first-row header), "Horizontal table" (first-col header),
// "transpose" (swap rows/columns), a column ratio like "4:1:1", and
// "Merge RN + RN, ..." / "Merge RNCM + RNCM" to suppress dividers between rows/cells.
function parseTableDirective(plain) {
  const m = plain.match(/^\[(.+)\]$/);
  if (!m) return null;
  const text = m[1];
  const opts = {};
  if (/vertical table/i.test(text)) opts.headerRow = true;
  if (/horizontal table/i.test(text)) opts.headerCol = true;
  if (/transpose/i.test(text)) opts.transpose = true;
  const ratio = text.match(/(\d+(?::\d+)+)/);
  if (ratio) opts.ratio = ratio[1].split(':').map(Number);
  const mergeMatch = text.match(/Merge\s+(.+)/i);
  if (mergeMatch) opts.noBorder = parseMerge(mergeMatch[1]);
  return opts;
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

    // Directive paragraph immediately before a table: consume it as table options.
    // Scan past any empty paragraphs that may sit between the directive and the table.
    if (block.type === 'paragraph') {
      const plain = plainText(block.paragraph?.rich_text || []).trim();
      const tableOpts = parseTableDirective(plain);
      if (tableOpts) {
        let j = i + 1;
        while (j < blocks.length && blocks[j].type === 'paragraph' && !plainText(blocks[j].paragraph?.rich_text || []).trim()) j++;
        if (blocks[j]?.type === 'table') {
          i = j; // skip directive + any blank paragraphs
          const html = renderBlock(blocks[i], pathIndex, tocEntries, fromPath, tableOpts);
          if (html) out.push(html);
          i++;
          continue;
        }
      }
    }

    const html = renderBlock(block, pathIndex, tocEntries, fromPath);
    if (html) out.push(html);
    i++;
  }

  return out.join('\n');
}

function renderBlock(block, pathIndex, tocEntries, fromPath = '', tableOpts = null) {
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
      if (block._children) {
        const body = renderBlocks(block._children, pathIndex, tocEntries, fromPath);
        return `<details id="${id}" class="details-section" open>
  <summary>${text}</summary>
  ${body}
</details>`;
      }
      return `<h2 id="${id}">${text}</h2>`;
    }

    case 'heading_3': {
      const id = toId(plain);
      tocEntries?.push({ id, text: plain, level: 3 });
      if (block._children) {
        const body = renderBlocks(block._children, pathIndex, tocEntries, fromPath);
        return `<details id="${id}" class="details-section details-section--h3" open>
  <summary>${text}</summary>
  ${body}
</details>`;
      }
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
      return renderTable(block, pathIndex, tableOpts);
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

// Wrap literal bullet characters in a field-sep span so they render at 50% opacity.
function styleBullets(html) {
  return html.replace(/•/g, '<span class="field-sep">•</span>');
}

// Split a rich-text array on newline characters, returning an array of sub-arrays.
// Each sub-array is a "line" with properly scoped annotations — splitting the
// rendered HTML string instead would break tags that span a newline (e.g. <strong>text\n</strong>).
function splitRichTextLines(richTexts) {
  const lines = [[]];
  for (const rt of richTexts) {
    const parts = rt.plain_text.split('\n');
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) lines.push([]);
      if (parts[i] !== '') lines[lines.length - 1].push({ ...rt, plain_text: parts[i] });
    }
  }
  return lines.filter(line => line.length > 0);
}

// Render a table cell's rich text.
// - Horizontal table body cells: split newlines into bullet-separated items.
// - All other cells: preserve newlines via cell-line spans so content stacks.
function renderTableCell(cell, pathIndex, isBulletCell, isHeader) {
  if (isBulletCell) {
    // Strip any leading bullet the user typed — the field-sep separator between
    // items provides the visual bullet, so leading ones are redundant.
    const parts = plainText(cell).split('\n')
      .map(s => s.trim().replace(/^•\s*/, '').trim())
      .filter(Boolean);
    const bull = '<span class="field-sep">•</span>';
    if (parts.length > 1) return parts.map(p => escapeHtml(p)).join(` ${bull} `);
    // Single-item cell: render rich text, strip any leading bullet.
    return renderRichText(cell, pathIndex).replace(/^•\s*/, '');
  }
  // For non-header data cells, split on newlines and wrap each line in a block
  // span so content stacks. (cells use display:flex which ignores <br>)
  // Skip for header cells: splitting mid-tag breaks inline HTML like <strong>.
  if (isHeader) return renderRichText(cell, pathIndex);
  // Split on newlines at the rich-text level (not on the rendered HTML string) so
  // tags that span a newline (e.g. <strong>text\n</strong>) don't get split mid-tag.
  const lines = splitRichTextLines(cell);
  return lines
    .map(line => {
      // Lines starting with • are treated as list items with a hanging indent.
      // Strip the leading bullet from the rich-text tokens and use ::before CSS.
      const firstPlain = line[0]?.plain_text || '';
      if (firstPlain.trimStart().startsWith('•')) {
        const stripped = [
          { ...line[0], plain_text: firstPlain.replace(/^\s*•\s*/, '') },
          ...line.slice(1),
        ].filter(rt => rt.plain_text);
        const content = renderRichText(stripped, pathIndex);
        return `<span class="cell-line cell-line--bullet">${content}</span>`;
      }
      return `<span class="cell-line">${styleBullets(renderRichText(line, pathIndex))}</span>`;
    })
    .filter(s => s.replace(/<[^>]+>/g, '').trim())
    .join('');
}

function transposeRows(rows) {
  const numCols = rows[0]?.table_row?.cells?.length || 0;
  const transposed = [];
  for (let c = 0; c < numCols; c++) {
    const cells = rows.map(row => (row.table_row?.cells || [])[c] || []);
    transposed.push({ table_row: { cells } });
  }
  return transposed;
}

function renderTable(tableBlock, pathIndex, opts = null) {
  let rows = tableBlock._children;

  // Transpose: swap rows and columns (e.g. object-as-column → object-as-row)
  if (opts?.transpose) rows = transposeRows(rows);
  const cols = rows[0]?.table_row?.cells?.length || 2;

  // Column widths: use ratio from directive, else equal fractions
  const gridCols = opts?.ratio
    ? opts.ratio.map(n => `${n}fr`).join(' ')
    : Array(cols).fill(`${Math.round(10 / cols)}fr`).join(' ');

  // Header detection: directive overrides Notion table settings.
  // hasColHeader (bullet separators) only activates via explicit [Horizontal table] directive.
  const hasRowHeader = opts?.headerRow ?? tableBlock.table?.has_column_header ?? false;
  const hasColHeader = opts?.headerCol ?? false;

  const noBorder = opts?.noBorder || new Set();

  // Detect symbol-only columns: every data cell is empty or contains a single
  // token with no whitespace (e.g. ✓). These get centered header + cell content.
  const dataRows = hasRowHeader ? rows.slice(1) : rows;
  const centeredCols = new Set();
  for (let j = hasColHeader ? 1 : 0; j < cols; j++) {
    const isSymbolCol = dataRows.every(row => {
      const text = plainText(row.table_row?.cells?.[j] || []).trim();
      return !text || !/\s/.test(text);
    });
    if (isSymbolCol) centeredCols.add(j);
  }

  const rowHtmls = rows.map((row, i) => {
    const cells = row.table_row?.cells || [];
    const isRowHeader = hasRowHeader && i === 0;
    const rowNoBorder = noBorder.has(`r${i}`);
    const cellHtmls = cells.map((cell, j) => {
      const isColHeader = hasColHeader && j === 0;
      const isBulletCell = hasColHeader && !isColHeader && !isRowHeader;
      const isHeader = isRowHeader || isColHeader;
      const text = renderTableCell(cell, pathIndex, isBulletCell, isHeader);
      const noBottom = rowNoBorder || noBorder.has(`r${i}c${j}`);
      const cls = [
        'data-table-cell',
        (isRowHeader || isColHeader) ? 'data-table-header-cell' : '',
        noBottom ? 'data-table-cell--no-bottom' : '',
        centeredCols.has(j) ? 'data-table-cell--centered' : '',
      ].filter(Boolean).join(' ');
      return `<div class="${cls}">${text}</div>`;
    });
    const rowCls = isRowHeader ? ' data-table-header' : '';
    return `<div class="data-table-row${rowCls}">\n${cellHtmls.join('\n')}\n</div>`;
  });

  const tableClass = hasColHeader ? 'data-table data-table--horizontal' : 'data-table';
  return `<div class="${tableClass}" style="grid-template-columns: ${gridCols}">
${rowHtmls.join('\n')}
</div>`;
}
