/* PDRM Joomla Administrator — shared layout + small interactions (no build step).
   Layout follows the Joomla 5 "Atum" administrator: logo block + collapsible
   sidebar on the left, dark top bar with page title, site link and user menu.
   Each page sets <body data-page="..." data-title="..." data-icon="...">
   and includes <aside id="sidebar"></aside> and <header id="topbar"></header>. */
(function () {
  "use strict";

  // Same logo the PDRM portal uses. If it can't load, a "PD" badge is shown instead.
  var LOGO_URL = "https://rmp2u.rmp.gov.my/media/36685";
  var VERSION = "5.2.1";

  // Sidebar menu. "dash" is the small grid icon on the right of a group (opens that group's main page).
  var NAV = [
    { id: "dashboard", text: "Home Dashboard", icon: "lucide:house", href: "dashboard.html" },
    { text: "Content", icon: "lucide:file-text", dash: "articles.html", children: [
      { id: "articles", text: "Articles", href: "articles.html", add: "article-edit.html" },
      { id: "categories", text: "Categories", href: "categories.html" },
      { text: "Featured Articles", href: "articles.html" },
      { id: "media", text: "Media", href: "media.html" }
    ]},
    { text: "Menus", icon: "lucide:list", dash: "menus.html", children: [
      { id: "menus", text: "Manage", href: "menus.html" },
      { text: "All Menu Items", href: "menus.html" },
      { text: "Main Menu", href: "menus.html" },
      { text: "Footer Links", href: "menus.html" }
    ]},
    { text: "Components", icon: "lucide:puzzle", dash: "extensions.html", children: [
      { text: "Banners", href: "#", soon: true },
      { text: "Contacts", href: "#", soon: true },
      { text: "News Feeds", href: "#", soon: true },
      { text: "Smart Search", href: "#", soon: true }
    ]},
    { text: "Users", icon: "lucide:users", dash: "users.html", children: [
      { id: "users", text: "Manage", href: "users.html" },
      { text: "Groups", href: "#", soon: true },
      { text: "Access Levels", href: "#", soon: true }
    ]},
    { text: "System", icon: "lucide:wrench", dash: "global-config.html", children: [
      { id: "config", text: "Global Configuration", href: "global-config.html" },
      { id: "extensions", text: "Manage Extensions", href: "extensions.html" }
    ]},
    { text: "Help", icon: "lucide:info", href: "#", soon: true }
  ];

  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  function logoHTML(cls) {
    return '<img class="' + (cls || "") + '" src="' + LOGO_URL + '" alt="PDRM logo" ' +
      'onerror="this.replaceWith(Object.assign(document.createElement(\'span\'),{className:\'brand-badge\',textContent:\'PD\'}))">';
  }
  function brandHTML() {
    return '<a class="brand" href="dashboard.html">' + logoHTML() +
      '<span class="brand-text"><b>PDRM Portal</b><small>Joomla! Administrator</small></span></a>';
  }
  window.PDRM_BRAND = brandHTML;
  window.PDRM_LOGO = logoHTML;
  window.PDRM_VERSION = VERSION;

  function linkAttrs(i) {
    return 'href="' + i.href + '"' + (i.soon ? ' data-toast="' + i.text + ' is not part of this design preview"' : "");
  }

  function buildSidebar(page) {
    var side = $("#sidebar");
    if (!side) return;
    if (page === "article-edit") page = "articles";
    side.className = "sidebar";
    side.setAttribute("aria-label", "Main menu");

    var html = brandHTML() + '<nav class="side-nav">' +
      '<button class="nav-row toggle-row" type="button" data-toggle-sidebar aria-label="Toggle Menu">' +
      '<iconify-icon class="nav-ic" icon="lucide:toggle-left"></iconify-icon><span class="label">Toggle Menu</span></button>';

    NAV.forEach(function (g, gi) {
      if (!g.children) {
        var act = g.id === page;
        html += '<a ' + linkAttrs(g) + (act ? ' class="active" aria-current="page"' : "") + ' title="' + g.text + '">' +
          '<iconify-icon class="nav-ic" icon="' + g.icon + '"></iconify-icon><span class="label">' + g.text + "</span></a>";
        return;
      }
      var hasActive = g.children.some(function (c) { return c.id === page; });
      var subId = "sub-" + gi;
      html += '<div class="nav-group' + (hasActive ? " open has-active" : "") + '">' +
        '<div class="nav-item">' +
          '<button class="nav-row" type="button" aria-expanded="' + hasActive + '" aria-controls="' + subId + '" title="' + g.text + '">' +
            '<iconify-icon class="nav-ic" icon="' + g.icon + '"></iconify-icon><span class="label">' + g.text + "</span>" +
            '<iconify-icon class="chev" icon="lucide:chevron-right"></iconify-icon></button>' +
          '<a class="dash-link" href="' + g.dash + '" title="' + g.text + ' dashboard" aria-label="' + g.text + ' dashboard"><iconify-icon icon="lucide:layout-grid"></iconify-icon></a>' +
        "</div>" +
        '<div class="sub" id="' + subId + '">';
      g.children.forEach(function (c) {
        var a = c.id === page;
        html += '<div class="sub-row"><a ' + linkAttrs(c) + (a ? ' class="active" aria-current="page"' : "") + ">" + c.text + "</a>" +
          (c.add ? '<a class="sub-add" href="' + c.add + '" aria-label="Add new ' + c.text + '" title="Add new"><iconify-icon icon="lucide:plus"></iconify-icon></a>' : "") +
          "</div>";
      });
      html += "</div></div>";
    });

    html += '</nav><div class="side-foot">PDRM &middot; Joomla! ' + VERSION + "</div>";
    side.innerHTML = html;
    document.body.appendChild(el('<div class="backdrop" data-close-nav></div>'));
    if (store("pdrm-sidebar") === "collapsed") document.body.classList.add("sidebar-collapsed");
  }

  function buildTopbar() {
    var top = $("#topbar");
    if (!top) return;
    var title = document.body.dataset.title || "Home Dashboard";
    var icon = document.body.dataset.icon || "lucide:house";
    top.className = "topbar";
    top.innerHTML =
      '<button class="icon-btn menu-toggle" type="button" aria-label="Open menu" data-toggle-nav><iconify-icon icon="lucide:menu"></iconify-icon></button>' +
      '<h1 class="page-title"><iconify-icon icon="' + icon + '"></iconify-icon><span>' + title + "</span></h1>" +
      '<div class="topbar-actions">' +
        '<span class="version" title="Joomla! version"><iconify-icon icon="simple-icons:joomla"></iconify-icon>' + VERSION + "</span>" +
        '<a class="pill" href="#" data-toast="Opens the public PDRM site in a new tab"><span class="pill-ic"><iconify-icon icon="lucide:external-link"></iconify-icon></span><span class="pill-text">PDRM</span></a>' +
        '<div class="user-menu">' +
          '<button class="pill" type="button" aria-haspopup="menu" aria-expanded="false" data-user-btn>' +
            '<span class="pill-ic"><iconify-icon icon="lucide:circle-user-round"></iconify-icon></span><span class="pill-text">User Menu</span><iconify-icon icon="lucide:chevron-down"></iconify-icon></button>' +
          '<div class="dropdown" role="menu">' +
            '<div class="signed"><iconify-icon icon="lucide:circle-user-round"></iconify-icon>Signed in as admin</div>' +
            '<a href="#" role="menuitem" data-toast="Edit Account is not part of this design preview"><iconify-icon icon="lucide:user"></iconify-icon>Edit Account</a>' +
            '<a href="#" role="menuitem" data-toast="Accessibility Settings is not part of this design preview"><iconify-icon icon="lucide:accessibility"></iconify-icon>Accessibility Settings</a>' +
            '<a href="index.html?logout=1" role="menuitem"><iconify-icon icon="lucide:power"></iconify-icon>Log out</a>' +
          "</div></div></div>";
  }

  function buildFooter() {
    var main = $(".main");
    if (!main || $(".footer", main)) return;
    main.appendChild(el('<footer class="footer"><span class="flex"><iconify-icon icon="lucide:keyboard"></iconify-icon>' +
      '<kbd class="kbd">J</kbd> then <kbd class="kbd">X</kbd> Keyboard Shortcuts</span>' +
      '<span>&copy; ' + new Date().getFullYear() + ' Polis Diraja Malaysia &middot; Joomla! ' + VERSION + '</span></footer>'));
  }

  var toastTimer;
  function toast(msg) {
    var t = $(".toast");
    if (!t) { t = el('<div class="toast" role="status" aria-live="polite"><iconify-icon icon="lucide:circle-check"></iconify-icon><span></span></div>'); document.body.appendChild(t); }
    $("span", t).textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
  window.pdrmToast = toast;

  function closeUserMenu() {
    var dd = $(".user-menu .dropdown");
    if (dd) dd.classList.remove("open");
    var b = $("[data-user-btn]");
    if (b) b.setAttribute("aria-expanded", "false");
  }

  function bind() {
    document.addEventListener("click", function (e) {
      var t = e.target;

      if (t.closest("[data-toggle-sidebar]")) {
        if (window.innerWidth <= 1024) { document.body.classList.remove("nav-open"); return; }
        var c = document.body.classList.toggle("sidebar-collapsed");
        store("pdrm-sidebar", c ? "collapsed" : "open");
        return;
      }
      if (t.closest("[data-toggle-nav]")) { document.body.classList.toggle("nav-open"); return; }
      if (t.closest("[data-close-nav]")) { document.body.classList.remove("nav-open"); return; }

      var row = t.closest(".nav-group .nav-row");
      if (row) {
        if (document.body.classList.contains("sidebar-collapsed") && window.innerWidth > 1024) {
          document.body.classList.remove("sidebar-collapsed");
          store("pdrm-sidebar", "open");
        }
        var grp = row.closest(".nav-group");
        var open = grp.classList.toggle("open");
        row.setAttribute("aria-expanded", open);
        return;
      }

      var ub = t.closest("[data-user-btn]");
      var dd = $(".user-menu .dropdown");
      if (ub && dd) {
        var o = dd.classList.toggle("open");
        ub.setAttribute("aria-expanded", o);
        return;
      }
      if (dd && !t.closest(".user-menu")) closeUserMenu();

      var tb = t.closest("[data-toast]");
      if (tb) { e.preventDefault(); toast(tb.getAttribute("data-toast")); }

      var cl = t.closest(".alert .close");
      if (cl) cl.closest(".alert").remove();

      var mi = t.closest(".media-item");
      if (mi) mi.classList.toggle("selected");

      var pw = t.closest("[data-toggle-pw]");
      if (pw) {
        var inp = pw.parentElement.querySelector("input");
        var show = inp.type === "password";
        inp.type = show ? "text" : "password";
        pw.setAttribute("aria-label", show ? "Hide password" : "Show password");
        pw.querySelector("iconify-icon").setAttribute("icon", show ? "lucide:eye-off" : "lucide:eye");
      }
    });

    // "J then X" shows the keyboard shortcuts, like Joomla
    var lastJ = 0;
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { document.body.classList.remove("nav-open"); closeUserMenu(); }
      if (/input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable) return;
      if (e.key === "j" || e.key === "J") { lastJ = Date.now(); return; }
      if ((e.key === "x" || e.key === "X") && Date.now() - lastJ < 1500) toast("Shortcuts: J then A = Save, J then Q = Close, J then S = Search");
    });

    // Check-all boxes
    $$("[data-check-all]").forEach(function (box) {
      box.addEventListener("change", function () {
        var table = box.closest("table");
        $$("tbody input[type=checkbox]", table).forEach(function (c) { c.checked = box.checked; });
      });
    });

    // Tabs
    $$("[role=tablist]").forEach(function (list) {
      var tabs = $$("[role=tab]", list);
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          tabs.forEach(function (o) {
            var sel = o === tab;
            o.setAttribute("aria-selected", sel);
            o.tabIndex = sel ? 0 : -1;
            var p = document.getElementById(o.getAttribute("aria-controls"));
            if (p) p.hidden = !sel;
          });
        });
        tab.addEventListener("keydown", function (e) {
          var i = tabs.indexOf(tab);
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            var n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
            n.focus(); n.click();
          }
        });
      });
    });

    // Live table filter: <input data-filter="#tableId">
    $$("[data-filter]").forEach(function (inp) {
      var table = $(inp.getAttribute("data-filter"));
      if (!table) return;
      inp.addEventListener("input", function () {
        var q = inp.value.trim().toLowerCase();
        $$("tbody tr", table).forEach(function (tr) {
          tr.hidden = q && tr.textContent.toLowerCase().indexOf(q) === -1;
        });
      });
    });

    // Drop zone highlight
    $$(".dropzone").forEach(function (dz) {
      ["dragenter", "dragover"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add("drag"); }); });
      ["dragleave", "drop"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove("drag"); if (ev === "drop") toast("Upload is disabled in this static preview"); }); });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildSidebar(document.body.dataset.page);
    buildTopbar();
    buildFooter();
    bind();
    // Turn on sidebar animations only after the first paint, so pages don't animate on load
    requestAnimationFrame(function () { requestAnimationFrame(function () { document.body.classList.add("ready"); }); });
  });
})();
