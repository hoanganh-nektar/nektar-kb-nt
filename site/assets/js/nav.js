/**
 * Nektar KB – Sidebar Navigation
 * Handles: section toggle, active state detection, mobile hamburger
 */

(function () {
  'use strict';

  // ─── Helpers ──────────────────────────────────────────────────────────
  function normPath(p) {
    // Normalise: strip trailing index.html or trailing slash, lower-case
    return p
      .replace(/\/index\.html$/, '/')
      .replace(/\/$/, '')
      .toLowerCase()
      .split('?')[0];
  }

  function getCurrentPath() {
    // Support both served and file:// protocol
    return normPath(window.location.pathname);
  }

  // ─── Section toggle ───────────────────────────────────────────────────
  function initToggles() {
    document.querySelectorAll('.nav-section-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var section = toggle.closest('.nav-section');
        section.classList.toggle('open');
      });
    });

    document.querySelectorAll('.nav-subgroup-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var group = toggle.closest('.nav-subgroup');
        group.classList.toggle('open');
      });
    });
  }

  // ─── Active state ─────────────────────────────────────────────────────
  function initActiveState() {
    var current = getCurrentPath();

    // Mark active nav items & nav subitems
    document.querySelectorAll('.nav-item[data-path], .nav-subitem[data-path]').forEach(function (el) {
      var p = normPath(el.getAttribute('data-path') || '');
      if (p && current.endsWith(p)) {
        el.classList.add('active');

        // Open the parent section
        var section = el.closest('.nav-section');
        if (section) section.classList.add('open');

        // Open parent subgroup if nested
        var subgroup = el.closest('.nav-subgroup');
        if (subgroup) subgroup.classList.add('open');
      }
    });

    // If no explicit match, open the section whose prefix matches
    var anyActive = document.querySelector('.nav-item.active, .nav-subitem.active');
    if (!anyActive) {
      document.querySelectorAll('.nav-section').forEach(function (section) {
        var sectionPath = section.getAttribute('data-section') || '';
        if (sectionPath && current.includes(sectionPath)) {
          section.classList.add('open');
        }
      });
    }
  }

  // ─── ToC highlight on scroll ──────────────────────────────────────────
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
      hamburger.innerHTML = '&#x2715;'; // ×
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
      hamburger.innerHTML = '&#9776;'; // ☰
    }

    hamburger.addEventListener('click', function () {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    if (overlay) overlay.addEventListener('click', closeSidebar);
  }

  // ─── Sidebar search (client-side filter) ─────────────────────────────
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
        var text = el.textContent.toLowerCase();
        var match = text.includes(q);
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
    initToggles();
    initActiveState();
    initTocHighlight();
    initMobile();
    initSearch();
  });

})();
