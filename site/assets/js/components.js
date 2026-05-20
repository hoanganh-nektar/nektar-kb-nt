(function () {
  'use strict';

  // ─── Root path detection (file:// and http://) ────────────────────────
  function getRootPath() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    var siteIdx = parts.indexOf('site');
    var dirParts = siteIdx >= 0 ? parts.slice(siteIdx + 1) : parts.slice();
    dirParts.pop(); // strip filename
    return dirParts.map(function () { return '../'; }).join('');
  }

  var R = getRootPath(); // e.g. '' / '../' / '../../'

  // ─── Nav HTML ─────────────────────────────────────────────────────────
  function navHTML() {
    var c = R + 'assets/images/v3-icon-chevron.svg';
    return (
      '<button class="hamburger" id="hamburger" aria-label="Open menu">&#9776;</button>\n' +
      '<div class="sidebar-overlay" id="sidebar-overlay"></div>\n' +
      '<aside id="sidebar">\n' +
      '  <div class="sidebar-logo">\n' +
      '    <a href="' + R + 'index.html"><img src="' + R + 'assets/images/v3-logo.svg" alt="Nektar" /></a>\n' +
      '  </div>\n' +
      '  <div class="sidebar-search">\n' +
      '    <input type="text" id="sidebar-search-input" placeholder="Search docs…" aria-label="Search" />\n' +
      '    <img class="search-icon-img" src="' + R + 'assets/images/v3-icon-search.svg" alt="" />\n' +
      '  </div>\n' +
      '  <nav class="sidebar-nav">\n' +

      '    <div class="nav-section" data-section="getting-started">\n' +
      '      <div class="nav-section-toggle"><a class="nav-section-label" href="' + R + 'getting-started/index.html">Getting started</a><img class="chevron-img" src="' + c + '" alt="" /></div>\n' +
      '      <div class="nav-section-items">\n' +
      '        <a class="nav-item" href="' + R + 'getting-started/setup-guide.html" data-path="/getting-started/setup-guide.html">Setup guide</a>\n' +
      '      </div>\n' +
      '    </div>\n' +

      '    <div class="nav-section" data-section="understand">\n' +
      '      <div class="nav-section-toggle"><a class="nav-section-label" href="' + R + 'understand/index.html">Understand</a><img class="chevron-img" src="' + c + '" alt="" /></div>\n' +
      '      <div class="nav-section-items">\n' +
      '        <a class="nav-item" href="' + R + 'understand/overview.html" data-path="/understand/overview.html">Overview</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/graph-inference.html" data-path="/understand/graph-inference.html">Graph inference</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/self-healing.html" data-path="/understand/self-healing.html">Self healing</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/security.html" data-path="/understand/security.html">Security</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/sync-latency.html" data-path="/understand/sync-latency.html">Sync latency</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/data-transform.html" data-path="/understand/data-transform.html">Data transform</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/use-cases.html" data-path="/understand/use-cases.html">Use cases</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/faqs.html" data-path="/understand/faqs.html">FAQs</a>\n' +
      '      </div>\n' +
      '    </div>\n' +

      '    <div class="nav-section" data-section="connectors">\n' +
      '      <div class="nav-section-toggle"><a class="nav-section-label" href="' + R + 'connectors/index.html">Connectors</a><img class="chevron-img" src="' + c + '" alt="" /></div>\n' +
      '      <div class="nav-section-items">\n' +
      '        <div class="nav-subgroup" data-section="salesforce">\n' +
      '          <div class="nav-subgroup-toggle">\n' +
      '            <img class="nav-icon" src="' + R + 'assets/images/v3-sf-header.png" alt="" />\n' +
      '            <span class="subgroup-label">Salesforce</span>\n' +
      '            <img class="chevron-sub-img" src="' + c + '" alt="" />\n' +
      '          </div>\n' +
      '          <div class="nav-subgroup-items">\n' +
      '            <a class="nav-subitem" href="' + R + 'connectors/salesforce/integration-user.html" data-path="/connectors/salesforce/integration-user.html">Integration user</a>\n' +
      '            <a class="nav-subitem" href="' + R + 'connectors/salesforce/connection.html" data-path="/connectors/salesforce/connection.html">Connection</a>\n' +
      '            <a class="nav-subitem" href="' + R + 'connectors/salesforce/sync.html" data-path="/connectors/salesforce/sync.html">Sync</a>\n' +
      '            <a class="nav-subitem" href="' + R + 'connectors/salesforce/api-used.html" data-path="/connectors/salesforce/api-used.html">APIs used</a>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '        <div class="nav-subgroup">\n' +
      '          <div class="nav-subgroup-toggle">\n' +
      '            <img class="nav-icon" src="' + R + 'assets/images/v3-nav-google.png" alt="" />\n' +
      '            <a class="subgroup-label" href="' + R + 'connectors/google-workspace/index.html" data-path="/connectors/google-workspace/">Google Workspace</a>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '        <div class="nav-subgroup">\n' +
      '          <div class="nav-subgroup-toggle">\n' +
      '            <img class="nav-icon" src="' + R + 'assets/images/v3-nav-ms365.png" alt="" />\n' +
      '            <a class="subgroup-label" href="' + R + 'connectors/microsoft-365/index.html" data-path="/connectors/microsoft-365/">Microsoft 365</a>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '        <div class="nav-subgroup">\n' +
      '          <div class="nav-subgroup-toggle">\n' +
      '            <img class="nav-icon" src="' + R + 'assets/images/v3-nav-zoom.png" alt="" />\n' +
      '            <a class="subgroup-label" href="' + R + 'connectors/zoom/index.html" data-path="/connectors/zoom/">Zoom</a>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>\n' +

      '    <div class="nav-section" data-section="administration">\n' +
      '      <div class="nav-section-toggle"><a class="nav-section-label" href="' + R + 'administration/index.html">Administration</a><img class="chevron-img" src="' + c + '" alt="" /></div>\n' +
      '      <div class="nav-section-items">\n' +
      '        <a class="nav-item" href="' + R + 'administration/dashboard.html" data-path="/administration/dashboard.html">Dashboard</a>\n' +
      '        <a class="nav-item" href="' + R + 'administration/users.html" data-path="/administration/users.html">Users</a>\n' +
      '        <a class="nav-item" href="' + R + 'administration/data-controls.html" data-path="/administration/data-controls.html">Data controls</a>\n' +
      '        <a class="nav-item" href="' + R + 'administration/tracker.html" data-path="/administration/tracker.html">Tracker</a>\n' +
      '        <a class="nav-item" href="' + R + 'administration/revenue-signals.html" data-path="/administration/revenue-signals.html">Revenue signals</a>\n' +
      '      </div>\n' +
      '    </div>\n' +

      '  </nav>\n' +
      '</aside>'
    );
  }

  // ─── Footer HTML ──────────────────────────────────────────────────────
  function footerHTML() {
    return (
      '<footer>\n' +
      '  <div class="footer-inner">\n' +
      '    <div class="footer-brand">\n' +
      '      <div class="footer-logo">\n' +
      '        <a href="' + R + 'index.html"><img src="' + R + 'assets/images/v3-logo.svg" alt="Nektar" /></a>\n' +
      '      </div>\n' +
      '      <div class="footer-social">\n' +
      '        <a href="#" aria-label="X / Twitter"><img src="' + R + 'assets/images/v3-icon-x.svg" width="24" height="24" alt="X" /></a>\n' +
      '        <a href="#" aria-label="YouTube"><img src="' + R + 'assets/images/v3-icon-youtube.svg" width="24" height="24" alt="YouTube" /></a>\n' +
      '        <a href="#" aria-label="LinkedIn"><img src="' + R + 'assets/images/v3-icon-linkedin.svg" width="24" height="24" alt="LinkedIn" /></a>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '    <div class="footer-col"><h4>Getting started</h4><ul>\n' +
      '      <li><a href="' + R + 'getting-started/setup-guide.html">Setup guide</a></li>\n' +
      '    </ul></div>\n' +
      '    <div class="footer-col"><h4>Understand</h4><ul>\n' +
      '      <li><a href="' + R + 'understand/index.html">Overview</a></li>\n' +
      '      <li><a href="' + R + 'understand/index.html#graph-inference">Graph inference</a></li>\n' +
      '      <li><a href="' + R + 'understand/index.html#self-healing">Self healing</a></li>\n' +
      '      <li><a href="' + R + 'understand/index.html#security">Security</a></li>\n' +
      '      <li><a href="' + R + 'understand/index.html#sync-latency">Sync latency</a></li>\n' +
      '      <li><a href="' + R + 'understand/index.html#data-transform">Data transform</a></li>\n' +
      '      <li><a href="' + R + 'understand/index.html#use-cases">Use cases</a></li>\n' +
      '      <li><a href="' + R + 'understand/index.html#faqs">FAQs</a></li>\n' +
      '    </ul></div>\n' +
      '    <div class="footer-col"><h4>Connectors</h4><ul>\n' +
      '      <li><a href="' + R + 'connectors/salesforce/index.html">Salesforce</a></li>\n' +
      '      <li><a href="' + R + 'connectors/google-workspace/index.html">Google Workspace</a></li>\n' +
      '      <li><a href="' + R + 'connectors/microsoft-365/index.html">Microsoft 365</a></li>\n' +
      '      <li><a href="' + R + 'connectors/zoom/index.html">Zoom</a></li>\n' +
      '    </ul></div>\n' +
      '    <div class="footer-col"><h4>Administration</h4><ul>\n' +
      '      <li><a href="' + R + 'administration/index.html#dashboard">Dashboard</a></li>\n' +
      '      <li><a href="' + R + 'administration/index.html#users">Users</a></li>\n' +
      '      <li><a href="' + R + 'administration/index.html#data-controls">Data controls</a></li>\n' +
      '      <li><a href="' + R + 'administration/index.html#tracker">Tracker</a></li>\n' +
      '      <li><a href="' + R + 'administration/index.html#revenue-signals">Revenue signals</a></li>\n' +
      '    </ul></div>\n' +
      '  </div>\n' +
      '  <div class="footer-bottom">&copy; 2025 Nektar.ai &mdash; All rights reserved.</div>\n' +
      '</footer>'
    );
  }

  // ─── Inject into placeholders ─────────────────────────────────────────
  function inject() {
    var navEl = document.getElementById('nav-placeholder');
    if (navEl) navEl.outerHTML = navHTML();

    var footerEl = document.getElementById('footer-placeholder');
    if (footerEl) footerEl.outerHTML = footerHTML();
  }

  // ─── Nav helpers ──────────────────────────────────────────────────────
  function normPath(p) {
    return p.replace(/\/index\.html$/, '/').replace(/\/$/, '').toLowerCase().split('?')[0];
  }

  function getCurrentPath() {
    return normPath(window.location.pathname);
  }

  // ─── Section toggles ──────────────────────────────────────────────────
  function initToggles() {
    document.querySelectorAll('.nav-section-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        toggle.closest('.nav-section').classList.toggle('open');
      });
    });

    document.querySelectorAll('.nav-subgroup-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        toggle.closest('.nav-subgroup').classList.toggle('open');
      });
    });
  }

  // ─── Active state ─────────────────────────────────────────────────────
  function initActiveState() {
    var current = getCurrentPath();

    document.querySelectorAll('.nav-item[data-path], .nav-subitem[data-path]').forEach(function (el) {
      var p = normPath(el.getAttribute('data-path') || '');
      if (p && current.endsWith(p)) {
        el.classList.add('active');
        var section = el.closest('.nav-section');
        if (section) section.classList.add('open');
        var subgroup = el.closest('.nav-subgroup');
        if (subgroup) subgroup.classList.add('open');
      }
    });

    if (!document.querySelector('.nav-item.active, .nav-subitem.active')) {
      document.querySelectorAll('.nav-section').forEach(function (section) {
        var sp = section.getAttribute('data-section') || '';
        if (sp && current.includes(sp)) section.classList.add('open');
      });
    }
  }

  // ─── ToC scroll highlight ─────────────────────────────────────────────
  function initTocHighlight() {
    var tocLinks = document.querySelectorAll('.toc-list a[href^="#"]');
    if (!tocLinks.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          tocLinks.forEach(function (a) { a.classList.remove('active'); });
          var active = document.querySelector('.toc-list a[href="#' + id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    tocLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (target) observer.observe(target);
    });
  }

  // ─── Mobile hamburger ─────────────────────────────────────────────────
  function initMobile() {
    var hamburger = document.getElementById('hamburger');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    if (!hamburger || !sidebar) return;

    function openSidebar() {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('visible');
      hamburger.innerHTML = '&#x2715;';
    }
    function closeSidebar() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
      hamburger.innerHTML = '&#9776;';
    }

    hamburger.addEventListener('click', function () {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    if (overlay) overlay.addEventListener('click', closeSidebar);
  }

  // ─── Sidebar search ───────────────────────────────────────────────────
  function initSearch() {
    var input = document.getElementById('sidebar-search-input');
    if (!input) return;

    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var items = document.querySelectorAll('.nav-item, .nav-subitem');

      if (!q) {
        items.forEach(function (el) { el.style.display = ''; });
        document.querySelectorAll('.nav-section').forEach(function (s) {
          s.classList.remove('search-open');
        });
        return;
      }

      items.forEach(function (el) {
        var match = el.textContent.toLowerCase().includes(q);
        el.style.display = match ? '' : 'none';
        if (match) {
          var section = el.closest('.nav-section');
          if (section) section.classList.add('open');
          var subgroup = el.closest('.nav-subgroup');
          if (subgroup) subgroup.classList.add('open');
        }
      });
    });
  }

  // ─── Boot ─────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    inject();
    initToggles();
    initActiveState();
    initTocHighlight();
    initMobile();
    initSearch();
  });

})();
