// ============================================
// عبايات أمل — Storefront (luxury B&G)
// ============================================

let _products = [];
let _activeCategory = "all";
let _cart = JSON.parse(localStorage.getItem("amal_cart") || "[]");
let _cartOpen = false;
let _mobileNavOpen = false;

// ── ICONS ──────────────────────────────────────────────────
const ICONS = {
  cart:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="20" height="20"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  menu:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  close:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  bag:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48"><path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`,
  phone:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  wa:     `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11 11 0 0 0 3.6 17.3L2 22l4.8-1.6A11 11 0 1 0 20.5 3.5zM12 20a8.4 8.4 0 0 1-4.3-1.2l-.3-.2-2.9 1 1-2.8-.2-.3A8.4 8.4 0 1 1 12 20zm4.6-6.2c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.1-.6 0a6.9 6.9 0 0 1-2-1.2 7.6 7.6 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.5l.4-.5.2-.3a.6.6 0 0 0 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1.1 1.1 0 0 0-.8.4 3.3 3.3 0 0 0-1 2.4 5.7 5.7 0 0 0 1.2 3 13 13 0 0 0 5 4.4c.7.3 1.2.5 1.6.6a3.9 3.9 0 0 0 1.7 0 2.7 2.7 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .1-1.3c-.1-.1-.3-.2-.6-.3z"/></svg>`,
  ig:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  pin:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  truck:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  chat:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  hanger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 8a2 2 0 1 1 2-2"/><path d="M12 8v3"/><path d="M3 18L12 11l9 7"/><path d="M2 18h20"/></svg>`,
  sparkle:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 2v6"/><path d="M12 16v6"/><path d="M2 12h6"/><path d="M16 12h6"/><path d="M5 5l4 4"/><path d="M15 15l4 4"/><path d="M19 5l-4 4"/><path d="M9 15l-4 4"/></svg>`,
  diamond:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M11 3 8 9l4 12 4-12-3-6"/><path d="M2 9h20"/></svg>`,
  silhouette: `<svg viewBox="0 0 100 160" fill="none" stroke="currentColor" stroke-width="1"><path d="M50 8C42 8 36 14 36 22c0 4 2 7 5 9L24 50 14 90 8 140h84l-6-50-10-40-17-19c3-2 5-5 5-9 0-8-6-14-14-14z"/><path d="M36 31 50 90l14-59" stroke-dasharray="2,2" opacity=".5"/></svg>`,
};

// ── ENTRY ──────────────────────────────────────────────────
async function loadStorefront() {
  try {
    _products = await Amal.fetchAll("products", { orderBy: ["createdAt", "desc"] });
    window.AmalSettings = await Amal.getSettings();
  } catch (e) {
    console.warn("Load failed:", e);
    _products = [];
    window.AmalSettings = window.AmalSettings || {};
  }
  document.body.classList.remove("theme-pearl");
  document.body.classList.add("theme-luxury");
  renderStorefront();
  // Add overlay containers (rendered once, contents toggled)
  if (!document.getElementById("cart-root")) {
    const root = document.createElement("div");
    root.id = "cart-root";
    document.body.appendChild(root);
  }
  if (!document.getElementById("modal-root")) {
    const root = document.createElement("div");
    root.id = "modal-root";
    document.body.appendChild(root);
  }
  if (!document.getElementById("toast-root")) {
    const root = document.createElement("div");
    root.id = "toast-root";
    root.className = "toast-stack";
    document.body.appendChild(root);
  }
}

// ── HELPERS ────────────────────────────────────────────────
function saveCart() { localStorage.setItem("amal_cart", JSON.stringify(_cart)); refreshCartUI(); }
function cartCount() { return _cart.reduce((n, it) => n + it.quantity, 0); }
function cartSubtotal() { return _cart.reduce((s, it) => s + it.price * it.quantity, 0); }

function calcDiscountedPrice(p) {
  const orig = Number(p.price) || 0;
  const d = p.discount;
  if (!d || !d.value) return { orig, sale: orig, hasDiscount: false, badge: "" };
  const v = Number(d.value);
  const sale = (d.type === "percent")
    ? Math.max(0, orig * (1 - v / 100))
    : Math.max(0, orig - v);
  return {
    orig, sale,
    hasDiscount: sale < orig,
    badge: d.type === "percent" ? `-${v}%` : `-${fmtPrice(orig - sale)}`
  };
}

function totalStock(p) {
  const variants = Array.isArray(p.variants) ? p.variants : [];
  return variants.length
    ? variants.reduce((n, v) => n + (Number(v.stock) || 0), 0)
    : (Number(p.stock) || 0);
}

function variantStock(p, color, size) {
  const variants = Array.isArray(p.variants) ? p.variants : [];
  if (!variants.length) return Number(p.stock) || 0;
  const v = variants.find(v => (!color || v.color === color) && (!size || v.size === size));
  return v ? (Number(v.stock) || 0) : 0;
}

function firstImage(p) {
  const arr = Array.isArray(p.images) ? p.images : [];
  return arr[0]?.url || p.imageURL || null;
}

function imageForColor(p, color) {
  const arr = Array.isArray(p.images) ? p.images : [];
  const found = arr.find(x => x.color === color && x.url);
  return found?.url || p.imageURL || arr[0]?.url || null;
}

function uniqueValues(arr, key) {
  const set = new Set();
  arr.forEach(x => { if (x[key]) set.add(x[key]); });
  return [...set];
}

// ── RENDER ─────────────────────────────────────────────────
function renderStorefront() {
  const app = document.getElementById("app");
  const s = window.AmalSettings || {};
  app.innerHTML = `
    ${renderPromo()}
    ${renderHeader()}
    ${renderHero()}
    ${renderFeatures()}
    ${renderCategories()}
    ${renderCollection(s)}
    ${renderAbout()}
    ${renderContact(s)}
    ${renderFooter(s)}
  `;
  refreshCartUI();
}
window.renderCurrentView = renderStorefront;

function renderPromo() {
  return `<div class="promo-strip">${esc(t("promo"))}</div>`;
}

function renderHeader() {
  const count = cartCount();
  return `
    <header class="store-header" id="top">
      <div class="store-header-inner">
        <nav class="nav-left">
          <a class="nav-link" href="#top" onclick="scrollToId('top',event)">${t("nav_home")}</a>
          <a class="nav-link" href="#collection" onclick="scrollToId('collection',event)">${t("nav_collection")}</a>
          <a class="nav-link" href="#cats" onclick="scrollToId('cats',event)">${t("nav_categories")}</a>
          <a class="nav-link" href="#about" onclick="scrollToId('about',event)">${t("nav_about")}</a>
          <a class="nav-link" href="#contact" onclick="scrollToId('contact',event)">${t("nav_contact")}</a>
          <a class="nav-link" href="javascript:void(0)" onclick="openAdminLogin()">${t("nav_admin")}</a>
        </nav>
        <a href="#top" class="brand-mark" onclick="scrollToId('top',event)">عبايات <span>أمل</span></a>
        <div class="nav-right">
          <button class="lang-btn" onclick="toggleLang()">${getLang() === "ar" ? "EN" : "عربي"}</button>
          <button class="icon-btn cart-btn" onclick="openCart()">
            ${ICONS.cart}
            <span class="label">${t("cart_label")}</span>
            ${count ? `<span class="cart-badge">${count}</span>` : ""}
          </button>
          <button class="mobile-menu-btn" onclick="openMobileNav()">${ICONS.menu}</button>
        </div>
      </div>
    </header>
    <div class="mobile-nav" id="mobileNav">
      <button class="close-btn" style="margin-bottom:18px;" onclick="closeMobileNav()">${ICONS.close}</button>
      <a href="#top" onclick="scrollToId('top',event); closeMobileNav();">${t("nav_home")}</a>
      <a href="#collection" onclick="scrollToId('collection',event); closeMobileNav();">${t("nav_collection")}</a>
      <a href="#cats" onclick="scrollToId('cats',event); closeMobileNav();">${t("nav_categories")}</a>
      <a href="#about" onclick="scrollToId('about',event); closeMobileNav();">${t("nav_about")}</a>
      <a href="#contact" onclick="scrollToId('contact',event); closeMobileNav();">${t("nav_contact")}</a>
      <a href="javascript:void(0)" onclick="closeMobileNav(); openAdminLogin();">${t("nav_admin")}</a>
    </div>
  `;
}

function renderHero() {
  const s = window.AmalSettings || {};
  const bannerImg = s.bannerURL
    ? `<img src="${s.bannerURL}" alt="${esc(t("brand"))}" style="max-width:100%;max-height:280px;border-radius:12px;margin-bottom:34px;">`
    : "";
  return `
    <section class="hero">
      <div class="hero-inner">
        ${bannerImg}
        <div class="hero-eyebrow">${esc(t("hero_eyebrow"))}</div>
        <h1>${esc(t("hero_title"))} ${esc(t("hero_title_gold"))}</h1>
        <p class="lead">${esc(t("hero_sub"))}</p>
        <div class="hero-cta">
          <button class="btn btn-primary btn-lg" onclick="scrollToId('collection')">
            ${t("shop_now")}
            <span class="arrow">${getLang()==='ar'?'←':'→'}</span>
          </button>
          <button class="btn btn-ghost btn-lg" onclick="scrollToId('contact')">${t("contact_us")}</button>
        </div>
      </div>
    </section>
  `;
}

function renderCategories() {
  const cats = [
    { id: "practical", icon: ICONS.hanger,  k: "cat_practical" },
    { id: "occasion",  icon: ICONS.sparkle, k: "cat_occasion" },
    { id: "black",     icon: ICONS.diamond, k: "cat_black" },
    { id: "open",      icon: ICONS.silhouette, k: "cat_open" },
  ];
  return `
    <section class="section" id="cats">
      <div class="section-head">
        <h2>${t("cats_title")}</h2>
        <div class="line"></div>
        <p class="sub">${t("cats_sub")}</p>
      </div>
      <div class="categories">
        ${cats.map(c => `
          <div class="cat-card" onclick="setCategory('${c.id}')">
            <div class="icon">${c.icon}</div>
            <h3>${t(c.k)}</h3>
            <p>${t(c.k + "_sub")}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderCollection(s) {
  const visible = _activeCategory === "all"
    ? _products
    : _products.filter(p => (p.category || "") === _activeCategory);
  const cats = ["all", "practical", "occasion", "black", "open"];
  return `
    <section class="section" id="collection">
      <div class="section-head">
        <h2>${t("collection_title")}</h2>
        <div class="line"></div>
        <p class="sub">${t("collection_sub")}</p>
      </div>
      <div class="cat-chips">
        ${cats.map(id => `<button class="opt-chip ${_activeCategory===id?'active':''}" onclick="setCategory('${id}')">${t(id==='all'?'cat_all':'cat_'+id)}</button>`).join("")}
      </div>
      <div class="product-grid">
        ${visible.length ? visible.map(productCard).join("") :
          `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-dim);">
             <div style="font-size:48px;color:var(--gold-deep);margin-bottom:14px;">✦</div>
             <div>${t("no_data")}</div>
           </div>`}
      </div>
    </section>
  `;
}

function productCard(p) {
  const lang = getLang();
  const name = (lang === "ar" ? p.nameAr : p.nameEn) || p.nameAr || p.nameEn || "—";
  const desc = (lang === "ar" ? p.descAr : p.descEn) || "";
  const stock = totalStock(p);
  const lowAt = Number(p.lowThreshold) || 3;
  let stockLabel, stockClass = "";
  if (stock <= 0)        { stockLabel = t("out_of_stock"); stockClass = "out"; }
  else if (stock <= lowAt){ stockLabel = t("low_stock"); stockClass = "low"; }
  else                   { stockLabel = t("in_stock"); }

  const { sale, orig, hasDiscount, badge } = calcDiscountedPrice(p);
  const img = firstImage(p);

  const priceHTML = hasDiscount
    ? `<span><span class="price-original">${fmtPrice(orig)}</span><span class="price">${fmtPrice(sale)}</span></span>`
    : `<span class="price">${fmtPrice(orig)}</span>`;

  return `
    <article class="product-card" onclick="openProduct('${p.id}')">
      <div class="img-wrap">
        ${hasDiscount ? `<div class="discount-badge">${esc(badge)}</div>` : ""}
        ${stock <= 0 ? `<div class="soldout-overlay">${t("out_of_stock")}</div>` : ""}
        ${img ? `<img src="${img}" alt="${esc(name)}" loading="lazy">` : `<div class="placeholder">${ICONS.silhouette}</div>`}
      </div>
      <div class="info">
        <div class="name">${esc(name)}</div>
        ${desc ? `<div class="desc">${esc(desc)}</div>` : ""}
        <div class="meta">
          ${priceHTML}
          <span class="stock ${stockClass}">${stockLabel}</span>
        </div>
      </div>
    </article>
  `;
}

function renderFeatures() {
  const items = [
    { emoji: "✨", title: t("feat_design_t"),  sub: t("feat_design_s") },
    { emoji: "🚚", title: t("feat_ship_t"),    sub: t("feat_ship_s") },
    { emoji: "💳", title: t("feat_cod_t"),     sub: t("feat_cod_s") },
  ];
  return `
    <section class="features">
      ${items.map(i => `
        <div class="feature">
          <div class="icon">${i.emoji}</div>
          <h4>${i.title}</h4>
          <p>${i.sub}</p>
        </div>
      `).join("")}
    </section>
  `;
}

function renderAbout() {
  return `
    <section class="section" id="about">
      <div class="about-split">
        <div class="visual">${ICONS.silhouette}</div>
        <div>
          <div class="section-eyebrow">${t("about_eyebrow")}</div>
          <h2 style="font-family:var(--ff-display-ar);font-size:clamp(26px,3.5vw,38px);font-weight:800;margin:0 0 12px;">${t("about_title")}</h2>
          <div style="width:60px;height:3px;background:linear-gradient(90deg,var(--gold),transparent);margin-bottom:18px;"></div>
          <p class="lead">${t("about_lead")}</p>
          <p>${t("about_p1")}</p>
          <p>${t("about_p2")}</p>
        </div>
      </div>
    </section>
  `;
}

function renderContact(s) {
  const wa = (s.whatsapp || "").replace(/[^0-9]/g, "");
  const phone = s.phone || s.whatsapp || "";
  const ig = s.instagram || "amal.abayas";
  return `
    <section class="section" id="contact">
      <div class="section-head">
        <h2>${t("contact_title")}</h2>
        <div class="line"></div>
        <p class="sub">${t("contact_sub")}</p>
      </div>
      <div class="contact-grid">
        <a href="tel:${phone}" class="contact-card">
          <div class="icon">${ICONS.phone}</div>
          <div class="label">${t("contact_phone")}</div>
          <div class="val">${esc(phone || "—")}</div>
        </a>
        <a href="https://wa.me/${wa}" target="_blank" class="contact-card">
          <div class="icon">${ICONS.wa}</div>
          <div class="label">${t("contact_wa")}</div>
          <div class="val">${esc(s.whatsapp || "—")}</div>
        </a>
        <a href="https://instagram.com/${ig}" target="_blank" class="contact-card">
          <div class="icon">${ICONS.ig}</div>
          <div class="label">${t("contact_ig")}</div>
          <div class="val">@${esc(ig)}</div>
        </a>
        <div class="contact-card">
          <div class="icon">${ICONS.pin}</div>
          <div class="label">${t("contact_addr")}</div>
          <div class="val ar">${esc(t("city"))}: غزة</div>
        </div>
      </div>
    </section>
  `;
}

function renderFooter(s) {
  return `
    <footer class="store-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <h4>${t("brand")}</h4>
          <p>${t("footer_about")}</p>
        </div>
        <div class="footer-col">
          <h5>${t("footer_quick")}</h5>
          <a href="#collection" onclick="scrollToId('collection',event)">${t("nav_collection")}</a>
          <a href="#cats" onclick="scrollToId('cats',event)">${t("nav_categories")}</a>
          <a href="#about" onclick="scrollToId('about',event)">${t("nav_about")}</a>
          <a href="#contact" onclick="scrollToId('contact',event)">${t("nav_contact")}</a>
        </div>
        <div class="footer-col">
          <h5>${t("contact_info")||t("contact_title")}</h5>
          <a href="tel:${esc(s.phone||s.whatsapp||'')}">${esc(s.phone||s.whatsapp||"—")}</a>
          <a href="https://wa.me/${(s.whatsapp||'').replace(/[^0-9]/g,'')}" target="_blank">${t("contact_wa")}</a>
          <a href="https://instagram.com/${esc(s.instagram||'amal.abayas')}" target="_blank">${t("contact_ig")}</a>
          <a href="javascript:void(0)" onclick="openAdminLogin()">${t("nav_admin")}</a>
        </div>
      </div>
      <div class="footer-bottom">${t("footer_rights")}</div>
    </footer>
  `;
}

// ── Helpers ────────────────────────────────────────────────
function scrollToId(id, ev) {
  if (ev) ev.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
window.scrollToId = scrollToId;

function setCategory(id) {
  _activeCategory = id;
  renderStorefront();
  setTimeout(() => scrollToId("collection"), 80);
}
window.setCategory = setCategory;

function openMobileNav() { document.getElementById("mobileNav")?.classList.add("open"); }
function closeMobileNav() { document.getElementById("mobileNav")?.classList.remove("open"); }
window.openMobileNav = openMobileNav;
window.closeMobileNav = closeMobileNav;

// ── CART ───────────────────────────────────────────────────
function openCart() {
  _cartOpen = true;
  refreshCartUI();
}
function closeCart() {
  _cartOpen = false;
  refreshCartUI();
}
window.openCart = openCart;
window.closeCart = closeCart;

function refreshCartUI() {
  const root = document.getElementById("cart-root");
  if (!root) return;
  root.innerHTML = `
    <div class="cart-backdrop ${_cartOpen?'open':''}" onclick="closeCart()"></div>
    <aside class="cart-panel ${_cartOpen?'open':''}">
      <div class="cart-head">
        <h3>${t("cart_label")}</h3>
        <button class="close-btn" onclick="closeCart()">${ICONS.close}</button>
      </div>
      <div class="cart-body">${renderCartBody()}</div>
      ${_cart.length ? renderCartFoot() : ""}
    </aside>
  `;
  // Update header badge if header is in DOM
  const badge = document.querySelector(".cart-badge");
  const count = cartCount();
  if (badge) badge.textContent = count;
  else if (count > 0) {
    const cartBtn = document.querySelector(".cart-btn");
    if (cartBtn) {
      const b = document.createElement("span");
      b.className = "cart-badge";
      b.textContent = count;
      cartBtn.appendChild(b);
    }
  }
}

function renderCartBody() {
  if (!_cart.length) {
    return `
      <div class="cart-empty">
        <div class="icon">${ICONS.bag}</div>
        <h4 style="font-family:var(--ff-display-ar);font-size:20px;color:var(--text);margin-bottom:6px;">${t("cart_empty")}</h4>
        <p>${t("cart_empty_sub")}</p>
        <button class="btn btn-primary" style="margin-top:24px;" onclick="closeCart()">${t("continue_shopping")}</button>
      </div>
    `;
  }
  return _cart.map((it, i) => `
    <div class="cart-item">
      <img class="thumb" src="${it.image||''}" alt="${esc(it.name)}" onerror="this.style.display='none';">
      <div class="info">
        <div class="name">${esc(it.name)}</div>
        <div class="opts">${esc(it.color||'')}${it.color&&it.size?' · ':''}${esc(it.size||'')}</div>
        <div class="qty">
          <button onclick="changeQty(${i},-1)">−</button>
          <span>${it.quantity}</span>
          <button onclick="changeQty(${i},1)">+</button>
        </div>
      </div>
      <div class="right">
        <div class="price">${fmtPrice(it.price * it.quantity)}</div>
        <button class="rm" onclick="removeFromCart(${i})">${t("remove")}</button>
      </div>
    </div>
  `).join("");
}

function renderCartFoot() {
  const s = window.AmalSettings || {};
  const sub = cartSubtotal();
  const free = sub >= 200; // Free shipping threshold
  const ship = free ? 0 : (Number(s.shippingFee) || 25);
  return `
    <div class="cart-foot">
      <div class="totals">
        <div class="row"><span>${t("subtotal")}</span><span>${fmtPrice(sub)}</span></div>
        <div class="row"><span>${t("shipping")}</span><span>${free ? `<span style="color:var(--gold);font-weight:600;">${t("shipping_free")}</span>` : fmtPrice(ship)}</span></div>
        <div class="row grand"><span>${t("total")}</span><span>${fmtPrice(sub + ship)}</span></div>
      </div>
      <button class="btn btn-primary" style="width:100%;" onclick="openCheckout()">${t("checkout")}</button>
    </div>
  `;
}

function addToCart(item) {
  const idx = _cart.findIndex(c =>
    c.productId === item.productId &&
    (c.color||'') === (item.color||'') &&
    (c.size||'') === (item.size||''));
  if (idx > -1) {
    _cart[idx].quantity += item.quantity;
  } else {
    _cart.push(item);
  }
  saveCart();
  showToast(t("added"), "success");
}
window.addToCart = addToCart;

function changeQty(i, delta) {
  if (!_cart[i]) return;
  _cart[i].quantity = Math.max(1, _cart[i].quantity + delta);
  saveCart();
}
window.changeQty = changeQty;

function removeFromCart(i) {
  _cart.splice(i, 1);
  saveCart();
}
window.removeFromCart = removeFromCart;

// ── PRODUCT DETAIL ─────────────────────────────────────────
function openProduct(id) {
  const p = _products.find(x => x.id === id);
  if (!p) return;
  const lang = getLang();
  const name = (lang === "ar" ? p.nameAr : p.nameEn) || p.nameAr || p.nameEn || "—";
  const desc = (lang === "ar" ? p.descAr : p.descEn) || "";
  const sizes  = (p.sizes  || "S,M,L,XL").split(",").map(s=>s.trim()).filter(Boolean);
  const colors = (p.colors || "أسود").split(",").map(s=>s.trim()).filter(Boolean);
  const { sale, orig, hasDiscount, badge } = calcDiscountedPrice(p);

  window._pdState = {
    productId: id,
    color: colors[0] || "",
    size:  sizes[0]  || "",
    quantity: 1
  };

  const priceHTML = hasDiscount
    ? `<span class="pd-original">${fmtPrice(orig)}</span>${fmtPrice(sale)}`
    : fmtPrice(orig);

  const mainImg = imageForColor(p, window._pdState.color);

  openModal(`
    <div class="modal-head">
      <h3>${esc(name)}</h3>
      <button class="close-btn" onclick="closeModal()">${ICONS.close}</button>
    </div>
    <div class="modal-body">
      <div class="pd-grid">
        <div>
          <div class="pd-img" id="pdImg">${mainImg ? `<img src="${mainImg}">` : `<div class="placeholder">${ICONS.silhouette}</div>`}</div>
        </div>
        <div>
          <div class="pd-name">${esc(name)}</div>
          ${hasDiscount ? `<div style="display:inline-block;background:var(--gold);color:#0a0a0a;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;margin-bottom:10px;">${esc(badge)}</div>` : ""}
          <div class="pd-price">${priceHTML}</div>
          ${desc ? `<div class="pd-desc">${esc(desc)}</div>` : ""}
          <div class="pd-group">
            <label>${t("pd_color")}</label>
            ${colors.map(c => `<button class="opt-chip ${c===window._pdState.color?'active':''}" onclick="pdSelectColor('${esc(c)}')">${esc(c)}</button>`).join("")}
          </div>
          <div class="pd-group">
            <label>${t("pd_size")}</label>
            ${sizes.map(sz => `<button class="opt-chip ${sz===window._pdState.size?'active':''}" onclick="pdSelectSize('${esc(sz)}')">${esc(sz)}</button>`).join("")}
          </div>
          <div class="pd-group">
            <label>${t("pd_qty")}</label>
            <div class="qty" style="background:var(--surface);">
              <button onclick="pdChangeQty(-1)">−</button>
              <span id="pdQty">${window._pdState.quantity}</span>
              <button onclick="pdChangeQty(1)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeModal()">${t("close")}</button>
      <button class="btn btn-primary" onclick="pdAddToCart()">${t("add_to_cart")}</button>
    </div>
  `);
}
window.openProduct = openProduct;

function pdSelectColor(c) {
  if (!window._pdState) return;
  window._pdState.color = c;
  const p = _products.find(x => x.id === window._pdState.productId);
  const img = imageForColor(p, c);
  const imgEl = document.getElementById("pdImg");
  if (imgEl && img) imgEl.innerHTML = `<img src="${img}">`;
  document.querySelectorAll(".pd-group:nth-of-type(1) .opt-chip").forEach(el => el.classList.remove("active"));
  event && event.target && event.target.classList.add("active");
}
window.pdSelectColor = pdSelectColor;

function pdSelectSize(s) {
  if (!window._pdState) return;
  window._pdState.size = s;
  document.querySelectorAll(".pd-group:nth-of-type(2) .opt-chip").forEach(el => el.classList.remove("active"));
  event && event.target && event.target.classList.add("active");
}
window.pdSelectSize = pdSelectSize;

function pdChangeQty(delta) {
  if (!window._pdState) return;
  window._pdState.quantity = Math.max(1, window._pdState.quantity + delta);
  const q = document.getElementById("pdQty");
  if (q) q.textContent = window._pdState.quantity;
}
window.pdChangeQty = pdChangeQty;

function pdAddToCart() {
  const st = window._pdState;
  if (!st) return;
  const p = _products.find(x => x.id === st.productId);
  if (!p) return;
  const lang = getLang();
  const name = (lang === "ar" ? p.nameAr : p.nameEn) || p.nameAr || p.nameEn || "—";
  const { sale } = calcDiscountedPrice(p);
  addToCart({
    productId: p.id,
    name,
    image: imageForColor(p, st.color),
    color: st.color,
    size: st.size,
    quantity: st.quantity,
    price: sale
  });
  closeModal();
  openCart();
}
window.pdAddToCart = pdAddToCart;

// ── CHECKOUT ───────────────────────────────────────────────
function openCheckout() {
  if (!_cart.length) return;
  closeCart();
  const s = window.AmalSettings || {};
  const cities = getCities();
  const accounts = Array.isArray(s.bankAccounts) && s.bankAccounts.length
    ? s.bankAccounts
    : (s.bankName ? [{ bankName: s.bankName, accountName: s.accountName, accountNumber: s.accountNumber, iban: s.iban }] : []);
  const sub = cartSubtotal();
  const free = sub >= 200;
  const ship = free ? 0 : (Number(s.shippingFee) || 25);

  openModal(`
    <div class="modal-head">
      <h3>${t("checkout_title")}</h3>
      <button class="close-btn" onclick="closeModal()">${ICONS.close}</button>
    </div>
    <div class="modal-body">
      <div class="field-grid">
        <div class="field"><label>${t("name")} *</label><input id="ck_name" required></div>
        <div class="field"><label>${t("whatsapp")} *</label><input id="ck_wa" required dir="ltr"></div>
      </div>
      <div class="field-grid">
        <div class="field"><label>${t("phone")}</label><input id="ck_phone" dir="ltr"></div>
        <div class="field">
          <label>${t("city")} *</label>
          <select id="ck_city" required>
            <option value="">${t("select_city")}</option>
            ${cities.map(c => `<option value="${esc(c.en||c.ar)}">${getLang()==='ar'?esc(c.ar):esc(c.en)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="field"><label>${t("address")} *</label><textarea id="ck_addr" rows="2" required></textarea></div>
      <div class="field"><label>${t("notes")}</label><textarea id="ck_notes" rows="2"></textarea></div>
      <div class="field">
        <label>${t("pay_method")}</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="opt-chip active" id="pm_cod" onclick="pickPay('cod')">${t("pay_cod")}</button>
          <button class="opt-chip" id="pm_bank" onclick="pickPay('bank')">${t("pay_bank")}</button>
        </div>
      </div>
      <div id="bankInfoBox" style="display:none;background:var(--surface);border:1px solid var(--hairline);border-radius:8px;padding:14px;margin-bottom:14px;">
        <div style="font-size:13px;color:var(--gold);font-weight:600;margin-bottom:8px;">${t("bank_info_title")}</div>
        ${accounts.length ? accounts.map(a => `
          <div style="font-size:13px;color:var(--text-dim);line-height:1.9;margin-bottom:6px;">
            <strong style="color:var(--text);">${esc(a.bankName||'—')}</strong><br>
            ${a.accountName ? `${esc(a.accountName)}<br>` : ""}
            ${a.accountNumber ? `${t("account_number")}: <span dir="ltr">${esc(a.accountNumber)}</span><br>` : ""}
            ${a.iban ? `IBAN: <span dir="ltr">${esc(a.iban)}</span>` : ""}
          </div>
        `).join("<hr style='border-color:var(--hairline);margin:8px 0;'>") : `<div style="color:var(--text-dim);">${t("no_data")}</div>`}
      </div>
      <div style="background:var(--surface);border:1px solid var(--hairline);border-radius:8px;padding:14px;font-size:14px;">
        <div style="display:flex;justify-content:space-between;padding:4px 0;"><span>${t("subtotal")}</span><span>${fmtPrice(sub)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:4px 0;"><span>${t("shipping")}</span><span>${free?`<span style="color:var(--gold);">${t("shipping_free")}</span>`:fmtPrice(ship)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0 0;border-top:1px dashed var(--hairline);margin-top:6px;font-weight:700;color:var(--gold);font-size:16px;">
          <span>${t("total")}</span><span>${fmtPrice(sub + ship)}</span>
        </div>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeModal()">${t("cancel")}</button>
      <button class="btn btn-primary" onclick="submitOrder()">${t("place_order")}</button>
    </div>
  `);
  window._payMethod = "cod";
}
window.openCheckout = openCheckout;

function pickPay(m) {
  window._payMethod = m;
  document.getElementById("pm_cod").classList.toggle("active", m === "cod");
  document.getElementById("pm_bank").classList.toggle("active", m === "bank");
  const box = document.getElementById("bankInfoBox");
  if (box) box.style.display = m === "bank" ? "block" : "none";
}
window.pickPay = pickPay;

async function submitOrder() {
  const name  = document.getElementById("ck_name").value.trim();
  const wa    = document.getElementById("ck_wa").value.trim();
  const phone = document.getElementById("ck_phone").value.trim();
  const city  = document.getElementById("ck_city").value;
  const addr  = document.getElementById("ck_addr").value.trim();
  const notes = document.getElementById("ck_notes").value.trim();
  if (!name || !wa || !city || !addr) {
    showToast(t("fill_required"), "error");
    return;
  }
  const s = window.AmalSettings || {};
  const sub = cartSubtotal();
  const free = sub >= 200;
  const ship = free ? 0 : (Number(s.shippingFee) || 25);
  const order = {
    items: _cart.map(it => ({
      productId: it.productId, name: it.name,
      color: it.color, size: it.size,
      price: it.price, quantity: it.quantity
    })),
    customer: { name, whatsapp: wa, phone, city, address: addr },
    notes,
    paymentMethod: window._payMethod || "cod",
    subtotal: sub,
    shipping: ship,
    total: sub + ship,
    status: "processing"
  };
  try {
    await Amal.placeOrder(order);
    _cart = []; saveCart();
    closeModal();
    showToast(t("order_placed"), "success");
  } catch (e) {
    showToast(e.message || t("error_generic"), "error");
  }
}
window.submitOrder = submitOrder;

// ── MODAL / TOAST ──────────────────────────────────────────
function openModal(html) {
  const root = document.getElementById("modal-root");
  root.innerHTML = `<div class="modal-backdrop" onclick="if(event.target===this)closeModal()"><div class="modal">${html}</div></div>`;
  requestAnimationFrame(() => root.querySelector(".modal-backdrop").classList.add("open"));
}
function closeModal() {
  const root = document.getElementById("modal-root");
  const bd = root.querySelector(".modal-backdrop");
  if (!bd) return;
  bd.classList.remove("open");
  setTimeout(() => { root.innerHTML = ""; }, 300);
}
window.openModal = openModal;
window.closeModal = closeModal;

function showToast(msg, type = "info") {
  const root = document.getElementById("toast-root");
  if (!root) return;
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 250); }, 2800);
}
window.showToast = showToast;


// ── ADMIN LOGIN MODAL (inline) ─────────────────────────────
function openAdminLogin() {
  openModal(`
    <div class="modal-head">
      <h3>${t("admin_login")}</h3>
      <button class="close-btn" onclick="closeModal()">${ICONS.close}</button>
    </div>
    <div class="modal-body">
      <p style="color:var(--muted); font-size:14px; margin-bottom:18px;">${t("admin_login_sub")}</p>
      <div class="field">
        <label>${t("email")}</label>
        <input id="al_email" type="email" autocomplete="email" dir="ltr" />
      </div>
      <div class="field">
        <label>${t("password")}</label>
        <input id="al_pw" type="password" autocomplete="current-password" dir="ltr" />
      </div>
      <div id="al_err" style="color:var(--danger); font-size:13px; min-height:18px; margin-top:8px;"></div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeModal()">${t("cancel")}</button>
      <button class="btn btn-primary" id="al_btn" onclick="submitAdminLogin()">${t("sign_in")}</button>
    </div>
  `);
  setTimeout(() => document.getElementById("al_email")?.focus(), 200);
  // Allow Enter to submit
  setTimeout(() => {
    const onEnter = (e) => { if (e.key === "Enter") submitAdminLogin(); };
    document.getElementById("al_email")?.addEventListener("keydown", onEnter);
    document.getElementById("al_pw")?.addEventListener("keydown", onEnter);
  }, 100);
}
window.openAdminLogin = openAdminLogin;

async function submitAdminLogin() {
  const email = document.getElementById("al_email")?.value.trim();
  const pw    = document.getElementById("al_pw")?.value;
  const err   = document.getElementById("al_err");
  const btn   = document.getElementById("al_btn");
  if (err) err.textContent = "";
  if (!email || !pw) { if (err) err.textContent = t("fill_required"); return; }
  if (btn) { btn.disabled = true; btn.innerHTML = `<span class="spinner"></span>`; }
  try {
    await Amal.adminLogin(email, pw);
    closeModal();
    showToast("✨", "success");
    // route to admin
    location.hash = "#admin";
  } catch (e) {
    if (err) err.textContent = t("login_failed") + ": " + (e.message || "");
    if (btn) { btn.disabled = false; btn.textContent = t("sign_in"); }
  }
}
window.submitAdminLogin = submitAdminLogin;


window.loadStorefront = loadStorefront;
