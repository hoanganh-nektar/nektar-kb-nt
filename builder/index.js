import 'dotenv/config';

const args = process.argv.slice(2);

if (args.includes('--watch')) {
  const { startWatcher } = await import('./src/watcher.js');
  await startWatcher();
} else {
  const { build } = await import('./src/build.js');
  await build();
}
