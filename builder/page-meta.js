// Visual assets and path overrides for each Notion page.
//
// Keys are Notion page IDs (without dashes).
//
// Descriptions (heroDesc, descFull, descShort) are pulled automatically from
// Notion content — do not set them here. Only set visual/path overrides:
//
//   outputPath      – override the auto-generated output path
//   illustration    – path to hero illustration, relative to site root
//   illustrationBg  – CSS background value for the illustration div
//   cardIcon        – path to card icon, relative to site root
//   cardIconBg      – CSS class for card icon background ('yellow-bg' | 'teal-bg')
//
// The builder warns in the console for pages missing illustration or cardIcon.
// Add new pages here as you create them in Notion.

export const pageMeta = {

  // ── Getting started ──────────────────────────────────────────────────────

  // Setup guide
  '3819417ef6ba8106bc76f276928bc061': {
    illustration: 'assets/images/articles/setup-guide.svg',
    cardIcon: 'assets/images/articles/setup-guide.svg',
  },

  // ── Understand ───────────────────────────────────────────────────────────

  // Overview
  '3819417ef6ba81c283c6e85fe3d272b2': {
    illustration: 'assets/images/articles/overview.svg',
    cardIcon: 'assets/images/articles/overview.svg',
  },

  // Graph inference
  '3819417ef6ba8194b8d2df08b8a8d229': {
    illustration: 'assets/images/articles/graph-inference.svg',
    cardIcon: 'assets/images/articles/graph-inference.svg',
  },

  // Self-healing
  '3819417ef6ba816eabf3c1bf96f5798d': {
    illustration: 'assets/images/articles/self-healing.svg',
    cardIcon: 'assets/images/articles/self-healing.svg',
  },

  // Security
  '3819417ef6ba8146be8ee5c3282330f3': {
    illustration: 'assets/images/articles/security.svg',
    cardIcon: 'assets/images/articles/security.svg',
  },

  // Sync latency
  '3819417ef6ba819285c4fe0597aab6dc': {
    illustration: 'assets/images/articles/sync-latency.svg',
    cardIcon: 'assets/images/articles/sync-latency.svg',
  },

  // Data transform
  '3819417ef6ba81f09332c5a290c1163e': {
    illustration: 'assets/images/articles/data-transform.svg',
    cardIcon: 'assets/images/articles/data-transform.svg',
  },

  // Use cases
  '3819417ef6ba815e9b8de1f0abaae61b': {
    illustration: 'assets/images/articles/use-cases.svg',
    cardIcon: 'assets/images/articles/use-cases.svg',
  },

  // FAQs
  '3819417ef6ba8157af9fe563b8e6b757': {
    illustration: 'assets/images/articles/faqs.svg',
    cardIcon: 'assets/images/articles/faqs.svg',
  },

  // ── Connectors ───────────────────────────────────────────────────────────

  // Salesforce (sub-section index)
  '9b1903498e1f49df960bdf977f6886d4': {
    illustration: 'assets/images/articles/salesforce.svg',
    cardIcon: 'assets/images/articles/salesforce.svg',
  },

  // Salesforce – Integration user
  '3819417ef6ba811fbeb4e7991f6c5610': {
    illustration: 'assets/images/articles/integration-user.svg',
    cardIcon: 'assets/images/articles/integration-user.svg',
    cardIconBg: 'teal-bg',
  },

  // Salesforce – Connection
  '3819417ef6ba800b9da9f4f610a0a1e1': {
    illustration: 'assets/images/articles/salesforce.svg',
    cardIcon: 'assets/images/articles/salesforce.svg',
    cardIconBg: 'teal-bg',
  },

  // Salesforce – Sync
  '3819417ef6ba80528e61d50bb2216724': {
    illustration: 'assets/images/articles/sync.svg',
    cardIcon: 'assets/images/articles/sync.svg',
    cardIconBg: 'teal-bg',
  },

  // Salesforce – APIs used
  '3819417ef6ba8032b605f2561f3a023b': {
    illustration: 'assets/images/articles/salesforce.svg',
    cardIcon: 'assets/images/articles/salesforce.svg',
    cardIconBg: 'teal-bg',
  },

  // Google Workspace — path override: directory with marketplace-install child
  '3819417ef6ba812280a5d2007237d192': {
    outputPath: 'connectors/google-workspace/index.html',
    illustration: 'assets/images/articles/google-workspace.svg',
    illustrationBg: 'rgba(255,204,0,0.3)',
    cardIcon: 'assets/images/articles/google-workspace.svg',
  },

  // Google Workspace – Marketplace install
  '3819417ef6ba81238421d6664937f71f': {
    illustration: 'assets/images/articles/google-workspace.svg',
    illustrationBg: 'rgba(255,204,0,0.3)',
    cardIcon: 'assets/images/articles/google-workspace.svg',
    cardIconBg: 'yellow-bg',
  },

  // Microsoft 365 — path override: expected at connectors/microsoft-365/index.html
  '3819417ef6ba816394d8ce003719323c': {
    outputPath: 'connectors/microsoft-365/index.html',
    illustration: 'assets/images/articles/microsoft-365.svg',
    illustrationBg: 'rgba(255,204,0,0.3)',
    cardIcon: 'assets/images/articles/microsoft-365.svg',
  },

  // Zoom — path override: expected at connectors/zoom/index.html
  '3819417ef6ba8131bf91c1f437ee69b7': {
    outputPath: 'connectors/zoom/index.html',
    illustration: 'assets/images/articles/zoom.svg',
    illustrationBg: 'rgba(255,204,0,0.3)',
    cardIcon: 'assets/images/articles/zoom.svg',
  },

  // ── Administration ───────────────────────────────────────────────────────

  // Dashboard
  '3819417ef6ba817d88d9c46e93697939': {
    illustration: 'assets/images/articles/dashboard.svg',
    cardIcon: 'assets/images/articles/dashboard.svg',
  },

  // Users
  '3819417ef6ba81fa9dd1f065600a60fb': {
    illustration: 'assets/images/articles/users.svg',
    cardIcon: 'assets/images/articles/users.svg',
  },

  // Data controls
  '3819417ef6ba81ba9d7fd2e696eb87ce': {
    illustration: 'assets/images/articles/data-controls.svg',
    cardIcon: 'assets/images/articles/data-controls.svg',
  },

  // Tracker
  '3819417ef6ba8190a22df3172ef18ec4': {
    illustration: 'assets/images/articles/tracker.svg',
    illustrationBg: '#1f3a5f',
    cardIcon: 'assets/images/articles/tracker.svg',
  },

  // Revenue signals
  '3819417ef6ba81bf8da3fbcbd4fdaa61': {
    illustration: 'assets/images/articles/revenue-signals.svg',
    cardIcon: 'assets/images/articles/revenue-signals.svg',
  },

  // ── Home page featured sections ──────────────────────────────────────────

  // homeFeatured controls which articles appear in "Most visited" and
  // "Recently updated" on the home page. Titles, icons, and descriptions
  // are pulled from Notion automatically.
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
