import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { discoverTree, flattenArticles } from './discover.js';
import { getPage } from './api.js';
import { build } from './build.js';

const STATE_FILE = path.resolve(fileURLToPath(import.meta.url), '../../../../.builder-state.json');
const ROOT_PAGE_ID = '3819417ef6ba80758316ce06f2e81518';

const POLL_INTERVAL_MS = 60_000;      // check last_edited_time every 60 s
const REDISCOVER_INTERVAL_MS = 600_000; // re-traverse tree every 10 min

async function loadState() {
  try {
    return JSON.parse(await fsp.readFile(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

async function saveState(state) {
  await fsp.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}

async function snapshotTree(pages) {
  const state = {};
  for (const page of pages) {
    const p = await getPage(page.id);
    state[page.id] = p.last_edited_time;
  }
  return state;
}

export async function startWatcher() {
  console.log('Running initial build...');
  const { tree, pages } = await build();
  const articles = flattenArticles(tree);

  console.log('\nSnapshotting page timestamps...');
  let knownState = await snapshotTree(articles);
  await saveState(knownState);

  let lastDiscoverTime = Date.now();
  let knownArticles = articles;

  console.log(`\nWatching for Notion changes (poll every ${POLL_INTERVAL_MS / 1000}s)...\n`);

  setInterval(async () => {
    try {
      // Periodically re-discover in case pages were added/removed
      if (Date.now() - lastDiscoverTime > REDISCOVER_INTERVAL_MS) {
        console.log('Re-discovering page tree...');
        const newTree = await discoverTree(ROOT_PAGE_ID);
        knownArticles = flattenArticles(newTree);
        lastDiscoverTime = Date.now();
      }

      // Check the root page and every article page for changes
      let changed = false;
      const rootPage = await getPage(ROOT_PAGE_ID);
      if (knownState[ROOT_PAGE_ID] !== rootPage.last_edited_time) {
        console.log('Root page changed (sections may have updated)');
        knownState[ROOT_PAGE_ID] = rootPage.last_edited_time;
        changed = true;
      }

      for (const article of knownArticles) {
        const p = await getPage(article.id);
        if (knownState[article.id] !== p.last_edited_time) {
          console.log(`Changed: ${article.title}`);
          knownState[article.id] = p.last_edited_time;
          changed = true;
        }
      }

      if (changed) {
        await saveState(knownState);
        console.log('Rebuilding...');
        const { tree: newTree } = await build();
        knownArticles = flattenArticles(newTree);
      }
    } catch (err) {
      console.error('Watcher error:', err.message);
    }
  }, POLL_INTERVAL_MS);
}
