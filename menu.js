/* The Game Øf Now — site menu
   Single source of truth for site navigation.
   To add a page: set its href below. `href: null` renders it dimmed
   and unclickable, so nothing on the site ever links to a 404. */
(function () {
  "use strict";

  var ITEMS = [
    { label: "Home",    href: "/" },
    { label: "About",   href: null },
    { label: "Play",    href: null },
    { label: "Games",   href: "/games/" },
    { label: "Donate",  href: "/donate.html" },
    { label: "Connect", href: "/booking.html" }
  ];

  var CSS = [
    '.gon-menu-btn{position:fixed;right:34px;z-index:400;width:52px;height:52px;',
    'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;',
    'background:none;border:0;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}',
    '.gon-menu-btn span{display:block;width:30px;height:1.5px;background:#111;',
    'transition:transform 260ms cubic-bezier(.4,0,.2,1),opacity 180ms ease}',
    '.gon-menu-btn:hover span{background:#990033}',
    '.gon-menu-btn[aria-expanded="true"] span{background:#111}',
    '.gon-menu-btn[aria-expanded="true"] span:nth-child(1){transform:translateY(8.5px) rotate(45deg)}',
    '.gon-menu-btn[aria-expanded="true"] span:nth-child(2){opacity:0}',
    '.gon-menu-btn[aria-expanded="true"] span:nth-child(3){transform:translateY(-8.5px) rotate(-45deg)}',
    '.gon-menu-panel{position:fixed;inset:0;z-index:390;background:#fff;',
    'display:flex;align-items:center;justify-content:center;',
    'opacity:0;visibility:hidden;transition:opacity 300ms ease,visibility 300ms ease}',
    '.gon-menu-panel.is-open{opacity:1;visibility:visible}',
    '.gon-menu-panel nav{text-align:center;padding:40px}',
    '.gon-menu-panel a,.gon-menu-panel span.gon-soon{',
    'display:block;font-family:"Cormorant Garamond",Georgia,serif;',
    'font-size:clamp(30px,5.5vw,52px);font-weight:300;line-height:1.5;',
    'letter-spacing:.01em;text-decoration:none;color:#111;',
    'transition:color 180ms ease,opacity 180ms ease}',
    '.gon-menu-panel a:hover{color:#990033}',
    '.gon-menu-panel span.gon-soon{color:rgba(17,17,17,.22);cursor:default}',
    '.gon-menu-panel .gon-mark{margin-top:44px;font-family:"Space Grotesk",sans-serif;',
    'font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:rgba(17,17,17,.35)}',
    '@media (max-width:700px){.gon-menu-btn{right:20px;width:46px;height:46px}',
    '.gon-menu-btn span{width:26px}}',
    '@media (prefers-reduced-motion:reduce){.gon-menu-btn span,.gon-menu-panel{transition:none}}'
  ].join('');

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.className = 'gon-menu-btn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'gon-menu-panel');
    btn.innerHTML = '<span></span><span></span><span></span>';

    var panel = document.createElement('div');
    panel.className = 'gon-menu-panel';
    panel.id = 'gon-menu-panel';

    var nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main');

    // Mark the page we are on so it does not link to itself.
    var here = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '') || '/';

    ITEMS.forEach(function (item) {
      var node;
      var target = item.href
        ? item.href.replace(/index\.html$/, '').replace(/\/+$/, '') || '/'
        : null;

      if (!item.href || target === here) {
        node = document.createElement('span');
        node.className = 'gon-soon';
        node.textContent = item.label;
        if (target === here) { node.setAttribute('aria-current', 'page'); }
      } else {
        node = document.createElement('a');
        node.href = item.href;
        node.textContent = item.label;
      }
      nav.appendChild(node);
    });

    var mark = document.createElement('p');
    mark.className = 'gon-mark';
    mark.textContent = 'play@gameofnow.com';
    nav.appendChild(mark);

    panel.appendChild(nav);
    document.body.appendChild(panel);
    document.body.appendChild(btn);

    // Sit the button clear of the donation banner, whatever height it renders at.
    function place() {
      var banner = document.querySelector('.top-banner');
      var top = banner ? banner.getBoundingClientRect().height + 16 : 28;
      btn.style.top = Math.round(top) + 'px';
    }
    place();
    window.addEventListener('resize', place);

    var open = false;
    function setOpen(next) {
      open = next;
      panel.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        var first = panel.querySelector('a');
        if (first) { first.focus(); }
      }
    }

    btn.addEventListener('click', function () { setOpen(!open); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) { setOpen(false); btn.focus(); }
    });
    panel.addEventListener('click', function (e) {
      if (e.target === panel) { setOpen(false); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
