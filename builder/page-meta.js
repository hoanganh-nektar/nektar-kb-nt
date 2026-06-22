// Per-page overrides — visual/structural only.
//
// Descriptions (heroDesc, descFull, descShort), illustrations, and card icons
// are all pulled automatically from Notion. Only add entries here for things
// that cannot come from Notion:
//
//   outputPath  – override the auto-generated output path

export const pageMeta = {

  // ── Path overrides ───────────────────────────────────────────────────────

  // Google Workspace — lives in its own directory (has a child article)
  '3819417ef6ba812280a5d2007237d192': {
    outputPath: 'connectors/google-workspace/index.html',
  },

  // Google Workspace – Marketplace install
  // subArticleOf: show as a hidden nav item under the parent page when active
  '3819417ef6ba81238421d6664937f71f': {
    title: 'Marketplace Install',
    outputPath: 'connectors/google-workspace/marketplace-install.html',
    subArticleOf: '3819417ef6ba812280a5d2007237d192', // Google Workspace
  },

  // Microsoft 365
  '3819417ef6ba816394d8ce003719323c': {
    outputPath: 'connectors/microsoft-365/index.html',
  },

  // Zoom
  '3819417ef6ba8131bf91c1f437ee69b7': {
    outputPath: 'connectors/zoom/index.html',
  },

  // ── Home page featured sections ──────────────────────────────────────────
  homeFeatured: {
    mostVisited: [
      '3819417ef6ba81bf8da3fbcbd4fdaa61', // Revenue signals
      '3819417ef6ba8190a22df3172ef18ec4', // Tracker
    ],
    recentlyUpdated: [
      '3819417ef6ba8157af9fe563b8e6b757', // FAQs
      '3819417ef6ba816394d8ce003719323c', // Microsoft 365
      '3819417ef6ba812280a5d2007237d192', // Google Workspace
      '3819417ef6ba8131bf91c1f437ee69b7', // Zoom
    ],
  },
};
