// Visual assets and metadata for each Notion page.
//
// Keys are Notion page IDs (without dashes).
//
// Per-page fields (all optional):
//   outputPath      – override the auto-generated output path
//   illustration    – path to hero illustration, relative to site root
//   illustrationBg  – CSS background value for the illustration div
//   cardIcon        – path to card icon, relative to site root
//   cardIconBg      – CSS class for card icon background ('yellow-bg' | 'teal-bg')
//   heroDesc        – override the hero description (default: first Notion paragraph)
//   descFull        – full card description shown in parent index
//   descShort       – short card description shown in parent index
//   title           – used only for home featured cards when title can't be looked up
//
// The builder warns in the console for pages missing illustration or cardIcon.
// Add new pages here as you create them in Notion.

export const pageMeta = {

  // ── Section indexes ──────────────────────────────────────────────────────

  // Getting started – Setup guide
  '3819417ef6ba8106bc76f276928bc061': {
    illustration: 'assets/images/articles/setup-guide.svg',
    cardIcon: 'assets/images/articles/setup-guide.svg',
  },

  // Understand
  // 'UNDERSTAND_ID': {
  //   illustration: 'assets/images/topics/understand.png',
  //   heroDesc: 'How Nektar works — from sync behavior and security to key concepts and use cases.',
  // },

  // Connectors
  // 'CONNECTORS_ID': {
  //   illustration: 'assets/images/topics/connectors.png',
  //   heroDesc: 'How to set up and manage Nektar\'s integrations with your connected tools.',
  // },

  // Administration
  // 'ADMINISTRATION_ID': {
  //   illustration: 'assets/images/topics/administration.png',
  //   heroDesc: 'Manage Nektar settings, users, data controls, activity tracking, and revenue signal configuration.',
  // },

  // ── Understand ───────────────────────────────────────────────────────────

  // Overview
  '3819417ef6ba81c283c6e85fe3d272b2': {
    illustration: 'assets/images/articles/overview.svg',
    cardIcon: 'assets/images/articles/overview.svg',
    descFull: 'The Nektar Graph, Readers, Builders, Writers, and Self-healing — how all the pieces fit together.',
    descShort: 'How the Nektar Graph, Readers, Builders, and Writers fit together.',
  },

  // Graph inference
  '3819417ef6ba8194b8d2df08b8a8d229': {
    illustration: 'assets/images/articles/graph-inference.svg',
    cardIcon: 'assets/images/articles/graph-inference.svg',
    descFull: 'How Nektar\'s ML models identify missing relationships, de-duplicate records, and connect activities to the right opportunities.',
    descShort: 'How Nektar identifies missing relationships and maps activities to opportunities.',
  },

  // Self-healing
  '3819417ef6ba816eabf3c1bf96f5798d': {
    illustration: 'assets/images/articles/self-healing.svg',
    cardIcon: 'assets/images/articles/self-healing.svg',
    descFull: 'How Nektar automatically corrects past decisions as new data arrives — no manual intervention required.',
    descShort: 'How Nektar auto-corrects past decisions as new data arrives.',
  },

  // Security
  '3819417ef6ba8146be8ee5c3282330f3': {
    illustration: 'assets/images/articles/security.svg',
    cardIcon: 'assets/images/articles/security.svg',
    descFull: 'Infrastructure, data retention, encryption, and compliance — SOC 2 Type II, ISO 27001, and GDPR.',
    descShort: 'SOC 2 Type II, ISO 27001, GDPR — infrastructure and encryption.',
  },

  // Sync latency
  '3819417ef6ba819285c4fe0597aab6dc': {
    illustration: 'assets/images/articles/sync-latency.svg',
    cardIcon: 'assets/images/articles/sync-latency.svg',
    descFull: 'Typical end-to-end sync times for contacts, activities, and opportunity-contact roles, and what affects them.',
    descShort: 'Typical sync times and what affects them.',
  },

  // Data transform
  '3819417ef6ba81f09332c5a290c1163e': {
    illustration: 'assets/images/articles/data-transform.svg',
    cardIcon: 'assets/images/articles/data-transform.svg',
    descFull: 'Configure how Nektar maps engagement data into your Salesforce fields using transform rules and formulae.',
    descShort: 'Map engagement data into Salesforce fields with transform rules.',
  },

  // Use cases
  '3819417ef6ba815e9b8de1f0abaae61b': {
    illustration: 'assets/images/articles/use-cases.svg',
    cardIcon: 'assets/images/articles/use-cases.svg',
    descFull: 'Ways customers use Nektar Transform to auto-populate engagement scores, multi-threading levels, dates, and more.',
    descShort: 'Auto-populate scores, multi-threading levels, dates, and more.',
  },

  // FAQs
  '3819417ef6ba8157af9fe563b8e6b757': {
    illustration: 'assets/images/articles/faqs.svg',
    cardIcon: 'assets/images/articles/faqs.svg',
    descFull: 'Answers to common questions about activities, contacts, admin controls, and security.',
    descShort: 'Common questions about activities, contacts, admin, and security.',
  },

  // ── Connectors ───────────────────────────────────────────────────────────

  // Salesforce (sub-section index)
  '9b1903498e1f49df960bdf977f6886d4': {
    illustration: 'assets/images/articles/salesforce.svg',
    cardIcon: 'assets/images/articles/salesforce.svg',
    descFull: 'Set up the integration user, establish a connection, configure sync, and review APIs used by Nektar in your Salesforce org.',
    descShort: 'Integration user, connection, sync, and APIs for your Salesforce org.',
    heroDesc: 'Everything you need to connect Nektar to your Salesforce org — from creating the integration user to configuring sync and understanding which APIs are used.',
  },

  // Salesforce – Integration user
  '3819417ef6ba811fbeb4e7991f6c5610': {
    illustration: 'assets/images/articles/integration-user.svg',
    cardIcon: 'assets/images/articles/integration-user.svg',
    cardIconBg: 'teal-bg',
    descFull: 'Create and configure the dedicated Salesforce user Nektar uses to read and write data to your org securely.',
    descShort: 'Set up the dedicated Salesforce user for Nektar.',
  },

  // Salesforce – Sync
  '3819417ef6ba80528e61d50bb2216724': {
    illustration: 'assets/images/articles/sync.svg',
    cardIcon: 'assets/images/articles/sync.svg',
    cardIconBg: 'teal-bg',
    descFull: 'Understand how Nektar syncs engagement data into Salesforce objects, and how to control sync frequency and scope.',
    descShort: 'How Nektar syncs engagement data into Salesforce objects.',
  },

  // Google Workspace — path override: directory with marketplace-install child
  '3819417ef6ba812280a5d2007237d192': {
    outputPath: 'connectors/google-workspace/index.html',
    illustration: 'assets/images/articles/google-workspace.svg',
    illustrationBg: 'rgba(255,204,0,0.3)',
    cardIcon: 'assets/images/articles/google-workspace.svg',
    descFull: 'Connect Gmail and Google Calendar to automatically capture customer interactions and write them to Salesforce.',
    descShort: 'Capture Gmail and Google Calendar interactions into Salesforce.',
  },

  // Google Workspace – Marketplace install
  '3819417ef6ba81238421d6664937f71f': {
    illustration: 'assets/images/articles/google-workspace.svg',
    illustrationBg: 'rgba(255,204,0,0.3)',
    cardIcon: 'assets/images/articles/google-workspace.svg',
    cardIconBg: 'yellow-bg',
    descFull: 'Step-by-step instructions for a Google Workspace administrator to install Nektar from the Google Marketplace.',
    descShort: 'Install Nektar from the Google Marketplace.',
  },

  // Microsoft 365 — path override: expected at connectors/microsoft-365/index.html
  '3819417ef6ba816394d8ce003719323c': {
    outputPath: 'connectors/microsoft-365/index.html',
    illustration: 'assets/images/articles/microsoft-365.svg',
    illustrationBg: 'rgba(255,204,0,0.3)',
    cardIcon: 'assets/images/articles/microsoft-365.svg',
    descFull: 'Connect Outlook and Microsoft Teams to capture email and meeting engagement without any change to how your reps work.',
    descShort: 'Capture Outlook and Teams engagement without rep behavior change.',
  },

  // Zoom — path override: expected at connectors/zoom/index.html
  '3819417ef6ba8131bf91c1f437ee69b7': {
    outputPath: 'connectors/zoom/index.html',
    illustration: 'assets/images/articles/zoom.svg',
    illustrationBg: 'rgba(255,204,0,0.3)',
    cardIcon: 'assets/images/articles/zoom.svg',
    descFull: 'Capture Zoom meeting data and sync it natively into your CRM — contact, account, and opportunity records stay current automatically.',
    descShort: 'Sync Zoom meeting data to contacts, accounts, and opportunities.',
  },

  // ── Administration ───────────────────────────────────────────────────────

  // Dashboard
  '3819417ef6ba817d88d9c46e93697939': {
    illustration: 'assets/images/articles/dashboard.svg',
    cardIcon: 'assets/images/articles/dashboard.svg',
    descFull: 'Monitor the quality and volume of data Nektar has synced into your CRM — contacts, emails, events, and contact roles.',
    descShort: 'Monitor data quality and sync volume in your CRM.',
  },

  // Users
  '3819417ef6ba81fa9dd1f065600a60fb': {
    illustration: 'assets/images/articles/users.svg',
    cardIcon: 'assets/images/articles/users.svg',
    descFull: 'Add, remove, and manage users, link them to their connected service accounts, and control per-user sync.',
    descShort: 'Manage users and control per-user sync.',
  },

  // Data controls
  '3819417ef6ba81ba9d7fd2e696eb87ce': {
    illustration: 'assets/images/articles/data-controls.svg',
    cardIcon: 'assets/images/articles/data-controls.svg',
    descFull: 'Configure screening rules, special domains, and write rules to precisely control what Nektar captures and syncs.',
    descShort: 'Control what Nektar captures with screening and write rules.',
  },

  // Tracker
  '3819417ef6ba8190a22df3172ef18ec4': {
    illustration: 'assets/images/articles/tracker.svg',
    illustrationBg: '#1f3a5f',
    cardIcon: 'assets/images/articles/tracker.svg',
    descFull: 'Look up the journey of a specific email or calendar event through Nektar\'s pipeline to understand why it was or wasn\'t synced.',
    descShort: 'Trace why an email or event was or wasn\'t synced.',
  },

  // Revenue signals
  '3819417ef6ba81bf8da3fbcbd4fdaa61': {
    illustration: 'assets/images/articles/revenue-signals.svg',
    cardIcon: 'assets/images/articles/revenue-signals.svg',
    descFull: 'Configure auto-updating Salesforce fields using Nektar\'s signal templates or custom rules.',
    descShort: 'Auto-update Salesforce fields with signal templates or custom rules.',
  },

  // ── Home page featured sections ──────────────────────────────────────────

  // homeFeatured controls which articles appear in "Most visited" and
  // "Recently updated" on the home page. Use page IDs (with or without dashes).
  // Titles, icons, and descriptions are pulled from the entries above.
  homeFeatured: {
    mostVisited: [
      // Setup guide (add ID after first build)
      // Salesforce (add ID after first build)
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
