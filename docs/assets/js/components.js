(function () {
  'use strict';

  // ─── Root path detection (file:// and http://) ────────────────────────
  function getRootPath() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    var baseIdx = -1;

    if (window.location.hostname.indexOf('github.io') >= 0) {
      // On GitHub Pages, first path segment is the repo name — strip it
      baseIdx = 0;
    } else {
      // Local file:// — find the docs/site folder
      ['site', 'docs'].forEach(function (marker) {
        var idx = parts.lastIndexOf(marker);
        if (idx >= 0) baseIdx = Math.max(baseIdx, idx);
      });
    }

    var dirParts = baseIdx >= 0 ? parts.slice(baseIdx + 1) : parts.slice();
    dirParts.pop(); // strip filename
    return dirParts.map(function () { return '../'; }).join('');
  }

  var R = getRootPath(); // e.g. '' / '../' / '../../'

  // ─── Nav HTML ─────────────────────────────────────────────────────────
  function navHTML() {
    var c = R + 'assets/images/icons/chevron.svg';
    return (
      '<button class="hamburger" id="hamburger" aria-label="Open menu">&#9776;</button>\n' +
      '<div class="sidebar-overlay" id="sidebar-overlay"></div>\n' +
      '<aside id="sidebar">\n' +
      '  <div class="sidebar-logo">\n' +
      '    <a class="home-nav-link" href="' + R + 'index.html"><img src="' + R + 'assets/images/logo.svg" alt="Nektar" /></a>\n' +
      '  </div>\n' +
      '  <div class="sidebar-search">\n' +
      '    <input type="text" id="sidebar-search-input" placeholder="Search" aria-label="Search" />\n' +
      '  </div>\n' +
      '  <nav class="sidebar-nav">\n' +

      '    <div class="nav-section" data-section="getting-started">\n' +
      '      <div class="nav-section-toggle"><a class="nav-section-label" href="' + R + 'getting-started/index.html" data-path="/getting-started/index.html">Getting started</a><img class="chevron-img" src="' + c + '" alt="" /></div>\n' +
      '      <div class="nav-section-items">\n' +
      '        <a class="nav-item" href="' + R + 'getting-started/setup-guide.html" data-path="/getting-started/setup-guide.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/setup-guide.svg" alt="" />Setup guide</a>\n' +
      '      </div>\n' +
      '    </div>\n' +

      '    <div class="nav-section" data-section="understand">\n' +
      '      <div class="nav-section-toggle"><a class="nav-section-label" href="' + R + 'understand/index.html" data-path="/understand/index.html">Understand</a><img class="chevron-img" src="' + c + '" alt="" /></div>\n' +
      '      <div class="nav-section-items">\n' +
      '        <a class="nav-item" href="' + R + 'understand/overview.html" data-path="/understand/overview.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/overview.svg" alt="" />Overview</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/graph-inference.html" data-path="/understand/graph-inference.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/graph-inference.svg" alt="" />Graph inference</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/self-healing.html" data-path="/understand/self-healing.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/self-healing.svg" alt="" />Self healing</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/security.html" data-path="/understand/security.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/security.svg" alt="" />Security</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/sync-latency.html" data-path="/understand/sync-latency.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/sync-latency.svg" alt="" />Sync latency</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/data-transform.html" data-path="/understand/data-transform.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/data-transform.svg" alt="" />Data transform</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/use-cases.html" data-path="/understand/use-cases.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/use-cases.svg" alt="" />Use cases</a>\n' +
      '        <a class="nav-item" href="' + R + 'understand/faqs.html" data-path="/understand/faqs.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/faqs.svg" alt="" />FAQs</a>\n' +
      '      </div>\n' +
      '    </div>\n' +

      '    <div class="nav-section" data-section="connectors">\n' +
      '      <div class="nav-section-toggle"><a class="nav-section-label" href="' + R + 'connectors/index.html" data-path="/connectors/index.html">Connectors</a><img class="chevron-img" src="' + c + '" alt="" /></div>\n' +
      '      <div class="nav-section-items">\n' +
      '        <div class="nav-subgroup" data-section="salesforce">\n' +
      '          <div class="nav-subgroup-toggle">\n' +
      '            <img class="nav-icon" src="' + R + 'assets/images/nav-icons/salesforce.svg" alt="" />\n' +
      '            <a class="subgroup-label" href="' + R + 'connectors/salesforce/index.html" data-path="/connectors/salesforce/index.html">Salesforce</a>\n' +
      '            <img class="chevron-sub-img" src="' + c + '" alt="" />\n' +
      '          </div>\n' +
      '          <div class="nav-subgroup-items">\n' +
      '            <a class="nav-subitem" href="' + R + 'connectors/salesforce/integration-user.html" data-path="/connectors/salesforce/integration-user.html">Integration user</a>\n' +
      '            <a class="nav-subitem" href="' + R + 'connectors/salesforce/connection.html" data-path="/connectors/salesforce/connection.html">Connection</a>\n' +
      '            <a class="nav-subitem" href="' + R + 'connectors/salesforce/sync.html" data-path="/connectors/salesforce/sync.html">Sync</a>\n' +
      '            <a class="nav-subitem" href="' + R + 'connectors/salesforce/api-used.html" data-path="/connectors/salesforce/api-used.html">APIs used</a>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '        <div class="nav-subgroup" data-section="google-workspace">\n' +
      '          <div class="nav-subgroup-toggle">\n' +
      '            <img class="nav-icon" src="' + R + 'assets/images/nav-icons/google-workspace.svg" alt="" />\n' +
      '            <a class="subgroup-label" href="' + R + 'connectors/google-workspace/index.html" data-path="/connectors/google-workspace/index.html">Google Workspace</a>\n' +
      '            <img class="chevron-sub-img" src="' + c + '" alt="" style="display:none" />\n' +
      '          </div>\n' +
      '          <div class="nav-subgroup-items">\n' +
      '            <a class="nav-subitem" href="' + R + 'connectors/google-workspace/marketplace-install.html" data-path="/connectors/google-workspace/marketplace-install.html" data-contextual="true" style="display:none">Installing Nektar from Marketplace</a>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '        <div class="nav-subgroup">\n' +
      '          <div class="nav-subgroup-toggle">\n' +
      '            <img class="nav-icon" src="' + R + 'assets/images/nav-icons/microsoft-365.svg" alt="" />\n' +
      '            <a class="subgroup-label" href="' + R + 'connectors/microsoft-365/index.html" data-path="/connectors/microsoft-365/">Microsoft 365</a>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '        <div class="nav-subgroup">\n' +
      '          <div class="nav-subgroup-toggle">\n' +
      '            <img class="nav-icon" src="' + R + 'assets/images/nav-icons/zoom.svg" alt="" />\n' +
      '            <a class="subgroup-label" href="' + R + 'connectors/zoom/index.html" data-path="/connectors/zoom/">Zoom</a>\n' +
      '          </div>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>\n' +

      '    <div class="nav-section" data-section="administration">\n' +
      '      <div class="nav-section-toggle"><a class="nav-section-label" href="' + R + 'administration/index.html" data-path="/administration/index.html">Administration</a><img class="chevron-img" src="' + c + '" alt="" /></div>\n' +
      '      <div class="nav-section-items">\n' +
      '        <a class="nav-item" href="' + R + 'administration/dashboard.html" data-path="/administration/dashboard.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/dashboard.svg" alt="" />Dashboard</a>\n' +
      '        <a class="nav-item" href="' + R + 'administration/users.html" data-path="/administration/users.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/users.svg" alt="" />Users</a>\n' +
      '        <a class="nav-item" href="' + R + 'administration/data-controls.html" data-path="/administration/data-controls.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/data-controls.svg" alt="" />Data controls</a>\n' +
      '        <a class="nav-item" href="' + R + 'administration/tracker.html" data-path="/administration/tracker.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/tracker.svg" alt="" />Tracker</a>\n' +
      '        <a class="nav-item" href="' + R + 'administration/revenue-signals.html" data-path="/administration/revenue-signals.html"><img class="nav-icon" src="' + R + 'assets/images/nav-icons/revenue-signals.svg" alt="" />Revenue signals</a>\n' +
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
      '        <a href="https://nektar.ai/" target="_blank" rel="noopener"><img src="' + R + 'assets/images/logo.svg" alt="Nektar" /></a>\n' +
      '      </div>\n' +
      '      <div class="footer-social">\n' +
      '        <a href="#" aria-label="X / Twitter"><img src="' + R + 'assets/images/icons/x.svg" width="24" height="24" alt="X" /></a>\n' +
      '        <a href="#" aria-label="YouTube"><img src="' + R + 'assets/images/icons/youtube.svg" width="24" height="24" alt="YouTube" /></a>\n' +
      '        <a href="#" aria-label="LinkedIn"><img src="' + R + 'assets/images/icons/linkedin.svg" width="24" height="24" alt="LinkedIn" /></a>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '    <div class="footer-col"><h4><a href="' + R + 'getting-started/index.html">Getting started</a></h4><ul>\n' +
      '      <li><a href="' + R + 'getting-started/setup-guide.html">Setup guide</a></li>\n' +
      '    </ul></div>\n' +
      '    <div class="footer-col"><h4><a href="' + R + 'understand/index.html">Understand</a></h4><ul>\n' +
      '      <li><a href="' + R + 'understand/overview.html">Overview</a></li>\n' +
      '      <li><a href="' + R + 'understand/graph-inference.html">Graph inference</a></li>\n' +
      '      <li><a href="' + R + 'understand/self-healing.html">Self healing</a></li>\n' +
      '      <li><a href="' + R + 'understand/security.html">Security</a></li>\n' +
      '      <li><a href="' + R + 'understand/sync-latency.html">Sync latency</a></li>\n' +
      '      <li><a href="' + R + 'understand/data-transform.html">Data transform</a></li>\n' +
      '      <li><a href="' + R + 'understand/use-cases.html">Use cases</a></li>\n' +
      '      <li><a href="' + R + 'understand/faqs.html">FAQs</a></li>\n' +
      '    </ul></div>\n' +
      '    <div class="footer-col"><h4><a href="' + R + 'connectors/index.html">Connectors</a></h4><ul>\n' +
      '      <li><a href="' + R + 'connectors/salesforce/index.html">Salesforce</a></li>\n' +
      '      <li><a href="' + R + 'connectors/google-workspace/index.html">Google Workspace</a></li>\n' +
      '      <li><a href="' + R + 'connectors/microsoft-365/index.html">Microsoft 365</a></li>\n' +
      '      <li><a href="' + R + 'connectors/zoom/index.html">Zoom</a></li>\n' +
      '    </ul></div>\n' +
      '    <div class="footer-col"><h4><a href="' + R + 'administration/index.html">Administration</a></h4><ul>\n' +
      '      <li><a href="' + R + 'administration/dashboard.html">Dashboard</a></li>\n' +
      '      <li><a href="' + R + 'administration/users.html">Users</a></li>\n' +
      '      <li><a href="' + R + 'administration/data-controls.html">Data controls</a></li>\n' +
      '      <li><a href="' + R + 'administration/tracker.html">Tracker</a></li>\n' +
      '      <li><a href="' + R + 'administration/revenue-signals.html">Revenue signals</a></li>\n' +
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
        if (e.target.closest('a')) return;
        e.stopPropagation();
        toggle.closest('.nav-subgroup').classList.toggle('open');
      });
    });
  }

  // ─── Active state ─────────────────────────────────────────────────────
  function initActiveState() {
    var current = getCurrentPath();

    // Home page (R is '' only when at the site root index.html)
    if (R === '') {
      var homeLink = document.querySelector('.home-nav-link');
      if (homeLink) homeLink.classList.add('active');
    }

    document.querySelectorAll('.nav-item[data-path], .nav-subitem[data-path], .subgroup-label[data-path], .nav-section-label[data-path]').forEach(function (el) {
      var p = normPath(el.getAttribute('data-path') || '');
      if (p && current.endsWith(p)) {
        el.classList.add('active');
        var subgroupToggle = el.closest('.nav-subgroup-toggle');
        if (subgroupToggle) subgroupToggle.classList.add('active');
        var sectionToggle = el.closest('.nav-section-toggle');
        if (sectionToggle) sectionToggle.classList.add('active');
        var section = el.closest('.nav-section');
        if (section) section.classList.add('open');
        var subgroup = el.closest('.nav-subgroup');
        if (subgroup) subgroup.classList.add('open');
      }
    });

    // Reveal contextual sub-items only when on their page (hidden by default in HTML)
    document.querySelectorAll('.nav-subitem[data-contextual]').forEach(function (el) {
      var p = normPath(el.getAttribute('data-path') || '');
      if (current.endsWith(p)) {
        el.style.display = '';
        var subgroup = el.closest('.nav-subgroup');
        if (subgroup) {
          var chevron = subgroup.querySelector('.chevron-sub-img');
          if (chevron) chevron.style.display = '';
        }
      }
    });

    if (R !== '' && !document.querySelector('.nav-item.active, .nav-subitem.active, .subgroup-label.active, .nav-section-label.active')) {
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

    var clicking = false;
    var clickTimer = null;

    var observer = new IntersectionObserver(function (entries) {
      if (clicking) return;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          tocLinks.forEach(function (a) { a.classList.remove('active'); });
          var active = document.querySelector('.toc-list a[href="#' + id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    // Activate first item on load
    tocLinks[0].classList.add('active');

    tocLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (target) observer.observe(target);

      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        var needsExpand = false;
        if (target) {
          var ancestor = target.parentElement;
          while (ancestor) {
            if (ancestor.tagName.toLowerCase() === 'details' && !ancestor.open) {
              ancestor.open = true;
              needsExpand = true;
            }
            ancestor = ancestor.parentElement;
          }
        }
        tocLinks.forEach(function (l) { l.classList.remove('active'); });
        a.classList.add('active');
        clicking = true;
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(function () { clicking = false; }, 1000);
        if (needsExpand && target) {
          e.preventDefault();
          setTimeout(function () {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
        }
      });
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

  function initDetailsWrap() {
    document.querySelectorAll('details:not(.callout-error)').forEach(function (d) {
      var nonSummary = Array.from(d.children).filter(function (c) {
        return c.tagName.toLowerCase() !== 'summary' && !c.classList.contains('details-content');
      });
      if (!nonSummary.length) return;
      var wrapper = document.createElement('div');
      wrapper.className = 'details-content';
      nonSummary.forEach(function (c) { wrapper.appendChild(c); });
      d.appendChild(wrapper);
    });
  }

  function initCalloutAlignment() {
    var callouts = document.querySelectorAll('.callout');
    if (!callouts.length) return;
    function update() {
      callouts.forEach(function (c) {
        var p = c.querySelector('p');
        if (!p) return;
        var range = document.createRange();
        range.selectNodeContents(p);
        var lines = range.getClientRects().length;
        range.detach && range.detach();
        if (lines <= 1) {
          c.classList.add('callout-single-line');
        } else {
          c.classList.remove('callout-single-line');
        }
      });
    }
    // Run after fonts settle so measurement is accurate
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(update);
    }
    update();
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(update, 100);
    });
  }

  function initTableScroll() {
    var selectors = [
      '.article-content .sync-status-table',
      '.article-content .objects-table',
      '.article-content .std-fields-table',
      '.article-content .cft',
      '.article-content .data-table',
      '.article-content .fields-table',
      '.article-content table'
    ].join(', ');
    document.querySelectorAll(selectors).forEach(function (t) {
      if (t.closest('.table-clip')) return;
      var wrapper = document.createElement('div');
      wrapper.className = 'table-clip';
      t.parentNode.insertBefore(wrapper, t);
      wrapper.appendChild(t);
    });
  }

  function initLightbox() {
    var imgs = Array.from(document.querySelectorAll('figure.article-image img, .step-layout-image img'));
    if (!imgs.length) return;
    var current = 0;

    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    var btnPrev = document.createElement('button');
    btnPrev.className = 'lightbox-arrow lightbox-arrow--prev';
    btnPrev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    btnPrev.setAttribute('aria-label', 'Previous image');

    var btnNext = document.createElement('button');
    btnNext.className = 'lightbox-arrow lightbox-arrow--next';
    btnNext.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6-6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    btnNext.setAttribute('aria-label', 'Next image');

    var lightImg = document.createElement('img');

    var inner = document.createElement('div');
    inner.className = 'lightbox-inner';
    inner.appendChild(btnPrev);
    inner.appendChild(lightImg);
    inner.appendChild(btnNext);
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    inner.addEventListener('click', function (e) { e.stopPropagation(); });

    function show(index) {
      current = (index + imgs.length) % imgs.length;
      lightImg.src = imgs[current].src;
      lightImg.alt = imgs[current].alt;
      btnPrev.style.display = imgs.length > 1 ? '' : 'none';
      btnNext.style.display = imgs.length > 1 ? '' : 'none';
    }

    imgs.forEach(function (el, i) {
      el.addEventListener('click', function () {
        show(i);
        overlay.classList.add('open');
      });
    });

    btnPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      show(current - 1);
    });

    btnNext.addEventListener('click', function (e) {
      e.stopPropagation();
      show(current + 1);
    });

    overlay.addEventListener('click', function () {
      overlay.classList.remove('open');
    });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') overlay.classList.remove('open');
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  function initSyntaxHighlight() {
    if (!document.querySelector('pre code')) return;
    // Inject Prism CSS
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';
    document.head.appendChild(link);
    // Inject Prism core
    var core = document.createElement('script');
    core.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
    core.onload = function () {
      // Inject PowerShell component then highlight
      var ps = document.createElement('script');
      ps.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-powershell.min.js';
      ps.onload = function () { Prism.highlightAll(); };
      document.head.appendChild(ps);
    };
    document.head.appendChild(core);
  }

  // ─── Boot ─────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    inject();
    initToggles();
    initActiveState();
    initTocHighlight();
    initMobile();
    initSearch();
    initDetailsWrap();
    initCalloutAlignment();
    initTableScroll();
    initSyntaxHighlight();
    initLightbox();
  });

})();
