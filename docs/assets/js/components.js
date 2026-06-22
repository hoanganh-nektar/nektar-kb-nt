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

  // ─── Generated nav tree ───────────────────────────────────────────────
  var NAV_TREE = [
  {
    "slug": "getting-started",
    "title": "Getting started",
    "path": "getting-started/index.html",
    "children": [
      {
        "title": "Setup guide",
        "path": "getting-started/setup-guide.html",
        "icon": "assets/images/nav-icons/setup-guide.svg"
      }
    ]
  },
  {
    "slug": "understand",
    "title": "Understand",
    "path": "understand/index.html",
    "children": [
      {
        "title": "Overview",
        "path": "understand/overview.html",
        "icon": "assets/images/nav-icons/overview.svg"
      },
      {
        "title": "Graph inference",
        "path": "understand/graph-inference.html",
        "icon": "assets/images/nav-icons/graph-inference.svg"
      },
      {
        "title": "Self healing",
        "path": "understand/self-healing.html",
        "icon": "assets/images/nav-icons/self-healing.svg"
      },
      {
        "title": "Security",
        "path": "understand/security.html",
        "icon": "assets/images/nav-icons/security.svg"
      },
      {
        "title": "Sync latency",
        "path": "understand/sync-latency.html",
        "icon": "assets/images/nav-icons/sync-latency.svg"
      },
      {
        "title": "Data transform",
        "path": "understand/data-transform.html",
        "icon": "assets/images/nav-icons/data-transform.svg"
      },
      {
        "title": "Use cases",
        "path": "understand/use-cases.html",
        "icon": "assets/images/nav-icons/use-cases.svg"
      },
      {
        "title": "FAQs",
        "path": "understand/faqs.html",
        "icon": "assets/images/nav-icons/faqs.svg"
      }
    ]
  },
  {
    "slug": "connectors",
    "title": "Connectors",
    "path": "connectors/index.html",
    "children": [
      {
        "slug": "salesforce",
        "title": "Salesforce",
        "path": "connectors/salesforce/index.html",
        "icon": "assets/images/nav-icons/salesforce.svg",
        "type": "section",
        "children": [
          {
            "title": "Integration user",
            "path": "connectors/salesforce/integration-user.html"
          },
          {
            "title": "Connection",
            "path": "connectors/salesforce/connection.html"
          },
          {
            "title": "Sync",
            "path": "connectors/salesforce/sync.html"
          },
          {
            "title": "APIs used",
            "path": "connectors/salesforce/apis-used.html"
          }
        ]
      },
      {
        "title": "Google Workspace",
        "path": "connectors/google-workspace/index.html",
        "icon": "assets/images/nav-icons/google-workspace.svg"
      },
      {
        "title": "Microsoft 365",
        "path": "connectors/microsoft-365/index.html",
        "icon": "assets/images/nav-icons/microsoft-365.svg"
      },
      {
        "title": "Zoom",
        "path": "connectors/zoom/index.html",
        "icon": "assets/images/nav-icons/zoom.svg"
      },
      {
        "title": "Gong",
        "path": "connectors/gong.html",
        "icon": "assets/images/nav-icons/gong.svg"
      },
      {
        "title": "Gong 2",
        "path": "connectors/gong-2.html",
        "icon": "assets/images/nav-icons/gong-2.svg"
      }
    ]
  },
  {
    "slug": "administration",
    "title": "Administration",
    "path": "administration/index.html",
    "children": [
      {
        "title": "Dashboard",
        "path": "administration/dashboard.html",
        "icon": "assets/images/nav-icons/dashboard.svg"
      },
      {
        "title": "Users",
        "path": "administration/users.html",
        "icon": "assets/images/nav-icons/users.svg"
      },
      {
        "title": "Data controls",
        "path": "administration/data-controls.html",
        "icon": "assets/images/nav-icons/data-controls.svg"
      },
      {
        "title": "Tracker",
        "path": "administration/tracker.html",
        "icon": "assets/images/nav-icons/tracker.svg"
      },
      {
        "title": "Revenue signals",
        "path": "administration/revenue-signals.html",
        "icon": "assets/images/nav-icons/revenue-signals.svg"
      }
    ]
  }
];

  // ─── Nav HTML ─────────────────────────────────────────────────────────
  function navHTML() {
    var c = R + 'assets/images/icons/chevron.svg';
    var html = '';
    html += '<button class="hamburger" id="hamburger" aria-label="Open menu">&#9776;</button>\n';
    html += '<div class="sidebar-overlay" id="sidebar-overlay"></div>\n';
    html += '<aside id="sidebar">\n';
    html += '  <div class="sidebar-logo">\n';
    html += '    <a class="home-nav-link" href="' + R + 'index.html"><img src="' + R + 'assets/images/logo.svg" alt="Nektar" /></a>\n';
    html += '  </div>\n';
    html += '  <div class="sidebar-search">\n';
    html += '    <input type="text" id="sidebar-search-input" placeholder="Search" aria-label="Search" />\n';
    html += '  </div>\n';
    html += '  <nav class="sidebar-nav">\n';

    NAV_TREE.forEach(function (section) {
      var grouped = section.children.some(function (ch) { return ch.type === 'section'; });
      html += '    <div class="nav-section" data-section="' + section.slug + '">\n';
      html += '      <div class="nav-section-toggle">';
      html += '<a class="nav-section-label" href="' + R + section.path + '" data-path="/' + section.path + '">' + esc(section.title) + '</a>';
      html += '<img class="chevron-img" src="' + c + '" alt="" />';
      html += '</div>\n';
      html += '      <div class="nav-section-items">\n';

      section.children.forEach(function (child) {
        if (child.type === 'section' || grouped) {
          var iconHtml = child.icon ? '<img class="nav-icon" src="' + R + child.icon + '" alt="" />' : '';
          var hasChildren = child.children && child.children.length > 0;
          var chevronHtml = hasChildren ? '<img class="chevron-sub-img" src="' + c + '" alt="" />' : '';
          html += '        <div class="nav-subgroup"' + (child.slug ? ' data-section="' + child.slug + '"' : '') + '>\n';
          html += '          <div class="nav-subgroup-toggle">';
          html += iconHtml;
          html += '<a class="subgroup-label" href="' + R + child.path + '" data-path="/' + child.path + '">' + esc(child.title) + '</a>';
          html += chevronHtml;
          html += '</div>\n';
          if (hasChildren) {
            html += '          <div class="nav-subgroup-items">\n';
            child.children.forEach(function (sub) {
              html += '            <a class="nav-subitem" href="' + R + sub.path + '" data-path="/' + sub.path + '">' + esc(sub.title) + '</a>\n';
            });
            html += '          </div>\n';
          }
          html += '        </div>\n';
        } else {
          var iconHtml = child.icon ? '<img class="nav-icon" src="' + R + child.icon + '" alt="" />' : '';
          html += '        <a class="nav-item" href="' + R + child.path + '" data-path="/' + child.path + '">' + iconHtml + esc(child.title) + '</a>\n';
        }
      });

      html += '      </div>\n';
      html += '    </div>\n';
    });

    html += '  </nav>\n';
    html += '</aside>';
    return html;
  }

  // ─── Footer HTML ──────────────────────────────────────────────────────
  function footerHTML() {
    var html = '';
    html += '<footer>\n';
    html += '  <div class="footer-inner">\n';
    html += '    <div class="footer-brand">\n';
    html += '      <div class="footer-logo">\n';
    html += '        <a href="https://nektar.ai/" target="_blank" rel="noopener"><img src="' + R + 'assets/images/logo.svg" alt="Nektar" /></a>\n';
    html += '      </div>\n';
    html += '      <div class="footer-social">\n';
    html += '        <a href="#" aria-label="X / Twitter"><img src="' + R + 'assets/images/icons/x.svg" width="24" height="24" alt="X" /></a>\n';
    html += '        <a href="#" aria-label="YouTube"><img src="' + R + 'assets/images/icons/youtube.svg" width="24" height="24" alt="YouTube" /></a>\n';
    html += '        <a href="#" aria-label="LinkedIn"><img src="' + R + 'assets/images/icons/linkedin.svg" width="24" height="24" alt="LinkedIn" /></a>\n';
    html += '      </div>\n';
    html += '    </div>\n';

    NAV_TREE.forEach(function (section) {
      html += '    <div class="footer-col"><h4><a href="' + R + section.path + '">' + esc(section.title) + '</a></h4><ul>\n';
      section.children.forEach(function (child) {
        html += '      <li><a href="' + R + child.path + '">' + esc(child.title) + '</a></li>\n';
      });
      html += '    </ul></div>\n';
    });

    html += '  </div>\n';
    html += '  <div class="footer-bottom">&copy; 2025 Nektar.ai &mdash; All rights reserved.</div>\n';
    html += '</footer>';
    return html;
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
    var imgs = Array.from(document.querySelectorAll('figure.article-image img, .step-layout-image img, .photo-grid img'));
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
