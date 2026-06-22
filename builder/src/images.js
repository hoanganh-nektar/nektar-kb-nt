import fsp from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';

// Matches Notion S3 image URLs and Google-hosted images embedded by Notion
const NOTION_IMG_RE = /src="(https:\/\/(?:prod-files-secure\.s3[^"]*|s3\.[a-z0-9-]+\.amazonaws\.com[^"]*|lh[0-9]+\.googleusercontent\.com[^"]*))"/g;

export async function downloadNavIcon(url, slug, siteDir) {
  if (!url || !url.startsWith('http')) return null;
  const ext = guessExt(url);
  const filename = `${slug}${ext}`;
  const dir = path.join(siteDir, 'assets', 'images', 'nav-icons');
  await fsp.mkdir(dir, { recursive: true });
  const absPath = path.join(dir, filename);
  try {
    await downloadFile(url, absPath);
    return `assets/images/nav-icons/${filename}`;
  } catch (err) {
    console.warn(`  Could not download nav icon for ${slug}: ${err.message}`);
    return null;
  }
}

export async function downloadImages(html, pageId, outputPath, siteDir) {
  const matches = [...html.matchAll(NOTION_IMG_RE)];
  if (!matches.length) return html;

  const imageDir = path.join(siteDir, 'assets', 'images', 'notion', pageId);
  await fsp.mkdir(imageDir, { recursive: true });

  let result = html;
  for (let i = 0; i < matches.length; i++) {
    const [, url] = matches[i];
    const ext = guessExt(url);
    const filename = `${i}${ext}`;
    const absPath = path.join(imageDir, filename);

    try {
      await downloadFile(url, absPath);
      const relPath = computeRelPath(outputPath, `assets/images/notion/${pageId}/${filename}`);
      result = result.replace(url, relPath);
    } catch (err) {
      console.warn(`  Could not download image: ${url.slice(0, 80)}… (${err.message})`);
    }
  }

  return result;
}

function computeRelPath(fromHtml, toAsset) {
  const fromDir = fromHtml.includes('/') ? fromHtml.replace(/[^/]+$/, '') : '';
  if (!fromDir) return toAsset;
  const fromParts = fromDir.split('/').filter(Boolean);
  const toParts = toAsset.split('/').filter(Boolean);
  let shared = 0;
  while (shared < fromParts.length && shared < toParts.length && fromParts[shared] === toParts[shared]) shared++;
  return '../'.repeat(fromParts.length - shared) + toParts.slice(shared).join('/');
}

function guessExt(url) {
  try {
    const m = new URL(url).pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)(?:[?#]|$)/i);
    return m ? `.${m[1].toLowerCase()}` : '.jpg';
  } catch {
    return '.jpg';
  }
}

function downloadFile(url, dest, redirectCount = 0) {
  if (redirectCount > 5) return Promise.reject(new Error('Too many redirects'));
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        res.resume();
        return downloadFile(res.headers.location, dest, redirectCount + 1)
          .then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const stream = createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
    req.on('error', reject);
  });
}
