// ============================================
// AMAL ABAYA — Customer-facing storefront
// Pure B&W edition
// ============================================

let _products = [];
let _cart = JSON.parse(localStorage.getItem("amal_cart") || "[]");
let _checkoutStep = 0;
let _checkoutData = {};
let _paymentProofFile = null;
let _paymentProofPreview = null;

function saveCart() { localStorage.setItem("amal_cart", JSON.stringify(_cart)); }
function cartCount() { return _cart.reduce((n, it) => n + it.quantity, 0); }
function cartSubtotal() { return _cart.reduce((s, it) => s + it.price * it.quantity, 0); }

async function loadStorefront() {
  showLoading(true);
  try {
    _products = await Amal.fetchAll("products", { orderBy: ["createdAt", "desc"] });
    window.AmalSettings = await Amal.getSettings();
  } catch (e) {
    showToast("Could not load products: " + e.message, "error");
    _products = [];
  }
  showLoading(false);
  renderStorefront();
  attachStorefrontGlobalListeners();
}

// ---------- SVG ICONS (inline so they stay crisp B&W) ----------
const ICONS = {
  scissor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
  thread: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9"/><path d="M21 12c-2 0-4 2-4 4s2 4 4 4"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>`,
  fabric: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 3h18v18H3z"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>`,
  hanger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 8a2 2 0 1 1 2-2"/><path d="M12 8v3"/><path d="M3 18L12 11l9 7"/><path d="M2 18h20"/></svg>`,
  drop:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3s-7 8-7 13a7 7 0 0 0 14 0c0-5-7-13-7-13z"/></svg>`,
  iron:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 16c0-3 2-6 6-6h10v6H4z"/><path d="M4 16h16v3H4z"/><path d="M10 10V7a2 2 0 0 1 2-2h4"/></svg>`,
  bag:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`,
  moon:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`,
  star:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><polygon points="12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9 12 2"/></svg>`,
  plane:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></svg>`,
  heart:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  mail:   `<svg class="ic" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/></svg>`,
  phone:  `<svg class="ic" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  insta:  `<svg class="ic" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  pin:    `<svg class="ic" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock:  `<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  cart:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  wa:     `<svg viewBox="0 0 24 24"><path d="M20.5 3.5A11 11 0 0 0 3.6 17.3L2 22l4.8-1.6A11 11 0 1 0 20.5 3.5zM12 20a8.4 8.4 0 0 1-4.3-1.2l-.3-.2-2.9 1 1-2.8-.2-.3A8.4 8.4 0 1 1 12 20zm4.6-6.2c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.1-.6 0a6.9 6.9 0 0 1-2-1.2 7.6 7.6 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.5l.4-.5.2-.3a.6.6 0 0 0 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1.1 1.1 0 0 0-.8.4 3.3 3.3 0 0 0-1 2.4 5.7 5.7 0 0 0 1.2 3 13 13 0 0 0 5 4.4c.7.3 1.2.5 1.6.6a3.9 3.9 0 0 0 1.7 0 2.7 2.7 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .1-1.3c-.1-.1-.3-.2-.6-.3z"/></svg>`,
  fb:     `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9V14.9H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9a15.4 15.4 0 0 1 2.2.2v2.5h-1.2c-1.3 0-1.6.7-1.6 1.6V12h2.8l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 6.3a4.8 4.8 0 0 1-2.9-1 4.7 4.7 0 0 1-1.4-2.3h-3v12.2a2.8 2.8 0 1 1-2-2.7V9.5a5.8 5.8 0 1 0 5 5.7V9.4a7.7 7.7 0 0 0 4.3 1.3z"/></svg>`,
  arrowUp:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
  abayaSilhouette: `<svg viewBox="0 0 200 320" fill="none" stroke="currentColor" stroke-width="1"><path d="M100 10 C 88 10 78 18 78 30 C 78 38 82 44 88 48 L 60 70 L 40 110 L 30 160 L 25 210 L 20 270 L 25 310 L 175 310 L 180 270 L 175 210 L 170 160 L 160 110 L 140 70 L 112 48 C 118 44 122 38 122 30 C 122 18 112 10 100 10 Z"/><path d="M88 48 L 100 130 L 112 48" stroke-dasharray="2,3"/><path d="M40 110 L 60 150 L 60 290" stroke-opacity="0.5"/><path d="M160 110 L 140 150 L 140 290" stroke-opacity="0.5"/></svg>`,
};

// ---------- MAIN RENDER ----------
function renderStorefront() {
  const app = document.getElementById("app");
  const s = window.AmalSettings || {};
  app.innerHTML = renderAnnouncement()
    + renderHeader()
    + renderHero()
    + renderAboutAbaya()
    + renderStats()
    + renderTypes()
    + renderCollection(s)
    + renderHeritage()
    + renderFabrics()
    + renderOccasions()
    + renderCare()
    + renderTestimonials()
    + renderFAQ()
    + renderCTAStrip()
    + renderContact(s)
    + renderFooter(s)
    + renderBackToTop()
    + renderWhatsAppFloat(s)
    + renderMobileNav();
}

function renderAnnouncement() {
  const items = [t("ann_1"), t("ann_2"), t("ann_3"), t("ann_4")];
  const block = items.map(x => `<span>✦ ${esc(x)}</span>`).join("");
  return `
    <div class="announcement" aria-hidden="false">
      <div class="marquee-track">${block}${block}</div>
    </div>`;
}

function renderHeader() {
  return `
    <header class="store-header">
      <div class="store-header-inner">
        <nav class="nav-left">
          <a class="nav-link" href="#collection" onclick="scrollToId('collection',event)">${t("nav_collection")}</a>
          <a class="nav-link" href="#about-abaya" onclick="scrollToId('about-abaya',event)">${t("nav_about")}</a>
          <a class="nav-link" href="#fabrics" onclick="scrollToId('fabrics',event)">${t("nav_fabrics")}</a>
          <a class="nav-link" href="#contact" onclick="scrollToId('contact',event)">${t("nav_contact")}</a>
        </nav>
        <a href="#top" onclick="scrollToTop(event)" class="brand-link"><div class="brand">${t("brand")}</div></a>
        <div class="header-actions">
          <button class="lang-toggle" onclick="toggleLang()" aria-label="toggle language">${getLang() === "en" ? "العربية" : "English"}</button>
          <button class="cart-btn" onclick="openCart()" aria-label="cart">
            ${ICONS.cart}
            ${cartCount() ? `<span class="cart-badge">${cartCount()}</span>` : ""}
          </button>
          <button class="mobile-menu-btn" onclick="toggleMobileNav()" aria-label="menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>`;
}

function renderHero() {
  const s = window.AmalSettings || {};
  return `
    <section class="hero" id="top">
      <div class="hero-bg-silhouette">${ICONS.abayaSilhouette}</div>
      <div class="hero-inner">
        <div class="hero-eyebrow">${esc(s.collectionTag || t("hero_eyebrow"))}</div>
        <h1>${t("hero_title_1")} <em>${t("hero_title_2")}</em><br>${t("hero_title_3")}</h1>
        <p>${t("hero_sub")}</p>
        <div class="hero-cta">
          <button class="btn btn-primary" onclick="scrollToId('collection')">${t("shop_now")} <span class="arrow">→</span></button>
          <button class="btn" onclick="scrollToId('about-abaya')">${t("explore_story")}</button>
        </div>
      </div>
      <div class="scroll-hint">${t("scroll_explore")}</div>
    </section>`;
}

function renderAboutAbaya() {
  return `
    <section class="section section-narrow" id="about-abaya">
      <div class="info-split">
        <div class="info-text">
          <div class="section-eyebrow">${t("about_eyebrow")}</div>
          <h3>${t("about_title")} <em>${t("about_title_em")}</em></h3>
          <p class="lead">${t("about_lead")}</p>
          <p>${t("about_p1")}</p>
          <p>${t("about_p2")}</p>
          <p>${t("about_p3")}</p>
        </div>
        <div class="info-visual">${ICONS.abayaSilhouette}</div>
      </div>
    </section>`;
}

function renderStats() {
  const stats = [
    { n: "12,000+", l: t("stat_pieces") },
    { n: "11", l: t("stat_years") },
    { n: "15", l: t("stat_cities") },
    { n: "8,400+", l: t("stat_happy") },
  ];
  return `
    <div class="stat-strip" aria-label="stats">
      ${stats.map(x => `
        <div class="stat-item">
          <div class="stat-num">${x.n}</div>
          <div class="stat-label">${esc(x.l)}</div>
        </div>`).join("")}
    </div>`;
}

function renderTypes() {
  const types = [
    { k: "type_closed",    icon: ICONS.thread },
    { k: "type_open",      icon: ICONS.hanger },
    { k: "type_butterfly", icon: ICONS.heart },
    { k: "type_kimono",    icon: ICONS.fabric },
    { k: "type_farasha",   icon: ICONS.drop },
    { k: "type_belted",    icon: ICONS.scissor },
  ];
  return `
    <section class="section" id="types">
      <div class="section-head">
        <div class="section-eyebrow">${t("types_eyebrow")}</div>
        <h2 class="section-title">${t("types_title")}</h2>
        <p class="section-sub">${t("types_sub")}</p>
      </div>
      <div class="feature-grid">
        ${types.map((tp, i) => `
          <div class="feature-card">
            <div class="num">0${i+1}</div>
            <div class="icon">${tp.icon}</div>
            <h4>${t(tp.k)}</h4>
            <p>${t(tp.k + "_desc")}</p>
          </div>
        `).join("")}
      </div>
    </section>`;
}

function renderCollection(s) {
  return `
    <section class="section" id="collection">
      <div class="section-head">
        <div class="section-eyebrow">${esc(s.collectionTag || "SS 2026")}</div>
        <h2 class="section-title">${t("our_collection")}</h2>
        <p class="section-sub">${t("collection_sub")}</p>
      </div>
      <div class="product-grid" id="productGrid">
        ${_products.length ? _products.map(productCard).join("") :
          `<div class="empty" style="grid-column: 1/-1;">
             <div class="empty-icon">✦</div>
             <div>${t("no_data")}</div>
           </div>`}
      </div>
    </section>`;
}

function renderHeritage() {
  return `
    <section class="heritage-section" id="heritage">
      <div class="heritage-quote">
        <div class="mark">"</div>
        <blockquote>${t("heritage_quote")}</blockquote>
        <cite>${t("heritage_attr")}</cite>
      </div>
    </section>`;
}

function renderFabrics() {
  const fabs = [
    { k: "fab_nida",    icon: ICONS.fabric, tags: ["Medium weight", "Holds shape", "Most popular"] },
    { k: "fab_crepe",   icon: ICONS.drop,   tags: ["Breathable", "Travel-friendly"] },
    { k: "fab_silk",    icon: ICONS.star,   tags: ["Evening", "Premium"] },
    { k: "fab_chiffon", icon: ICONS.heart,  tags: ["Sheer", "Layered"] },
    { k: "fab_linen",   icon: ICONS.thread, tags: ["Summer", "Natural"] },
    { k: "fab_satin",   icon: ICONS.moon,   tags: ["Statement", "High-shine"] },
  ];
  return `
    <section class="section" id="fabrics">
      <div class="section-head">
        <div class="section-eyebrow">${t("fabrics_eyebrow")}</div>
        <h2 class="section-title">${t("fabrics_title")}</h2>
        <p class="section-sub">${t("fabrics_sub")}</p>
      </div>
      <div class="feature-grid">
        ${fabs.map((f, i) => `
          <div class="feature-card">
            <div class="num">0${i+1}</div>
            <div class="icon">${f.icon}</div>
            <h4>${t(f.k)}</h4>
            <p>${t(f.k + "_desc")}</p>
            <div class="tags">${f.tags.map(tg => `<span class="tag">${esc(tg)}</span>`).join("")}</div>
          </div>`).join("")}
      </div>
    </section>`;
}

function renderOccasions() {
  const occs = [
    { k: "occ_everyday", icon: ICONS.hanger },
    { k: "occ_evening",  icon: ICONS.moon   },
    { k: "occ_wedding",  icon: ICONS.heart  },
    { k: "occ_travel",   icon: ICONS.plane  },
    { k: "occ_office",   icon: ICONS.briefcase },
    { k: "occ_prayer",   icon: ICONS.star   },
  ];
  return `
    <section class="section" id="occasions">
      <div class="section-head">
        <div class="section-eyebrow">${t("occasions_eyebrow")}</div>
        <h2 class="section-title">${t("occasions_title")}</h2>
        <p class="section-sub">${t("occasions_sub")}</p>
      </div>
      <div class="occasion-grid">
        ${occs.map((o, i) => `
          <div class="occasion-card" onclick="scrollToId('collection')">
            <div class="occasion-bg">${o.icon}</div>
            <div class="occasion-content">
              <div class="num">0${i+1}</div>
              <h4>${t(o.k)}</h4>
              <p>${t(o.k + "_desc")}</p>
            </div>
          </div>
        `).join("")}
      </div>
    </section>`;
}

function renderCare() {
  const items = [
    { k: "care_wash",  icon: ICONS.drop  },
    { k: "care_dry",   icon: ICONS.hanger },
    { k: "care_iron",  icon: ICONS.iron  },
    { k: "care_store", icon: ICONS.bag   },
  ];
  return `
    <section class="section section-tight" id="care">
      <div class="section-head">
        <div class="section-eyebrow">${t("care_eyebrow")}</div>
        <h2 class="section-title">${t("care_title")}</h2>
        <p class="section-sub">${t("care_sub")}</p>
      </div>
      <div class="feature-grid">
        ${items.map((it, i) => `
          <div class="feature-card">
            <div class="num">0${i+1}</div>
            <div class="icon">${it.icon}</div>
            <h4>${t(it.k)}</h4>
            <p>${t(it.k + "_desc")}</p>
          </div>
        `).join("")}
      </div>
    </section>`;
}

function renderTestimonials() {
  const ts = [
    { q: "t1_quote", n: "t1_name", m: "t1_meta", avatar: "L" },
    { q: "t2_quote", n: "t2_name", m: "t2_meta", avatar: "N" },
    { q: "t3_quote", n: "t3_name", m: "t3_meta", avatar: "S" },
  ];
  return `
    <section class="section" id="testimonials">
      <div class="section-head">
        <div class="section-eyebrow">${t("testimonials_eyebrow")}</div>
        <h2 class="section-title">${t("testimonials_title")}</h2>
        <p class="section-sub">${t("testimonials_sub")}</p>
      </div>
      <div class="testimonial-grid">
        ${ts.map(tt => `
          <div class="testimonial-card">
            <div class="stars">★★★★★</div>
            <blockquote>"${t(tt.q)}"</blockquote>
            <div class="who">
              <div class="avatar">${tt.avatar}</div>
              <div class="who-info">
                <div class="who-name">${t(tt.n)}</div>
                <div class="who-meta">${t(tt.m)}</div>
              </div>
            </div>
          </div>`).join("")}
      </div>
    </section>`;
}

function renderFAQ() {
  const qs = [1,2,3,4,5,6];
  return `
    <section class="section section-narrow" id="faq">
      <div class="section-head">
        <div class="section-eyebrow">${t("faq_eyebrow")}</div>
        <h2 class="section-title">${t("faq_title")}</h2>
        <p class="section-sub">${t("faq_sub")}</p>
      </div>
      <div class="faq">
        ${qs.map(i => `
          <details class="faq-item">
            <summary>${t("faq_q" + i)}<span class="faq-icon"></span></summary>
            <div class="faq-body">${t("faq_a" + i)}</div>
          </details>`).join("")}
      </div>
    </section>`;
}

function renderCTAStrip() {
  return `
    <section class="cta-strip" id="newsletter">
      <div class="eyebrow">${t("cta_eyebrow")}</div>
      <h2>${t("cta_title")}</h2>
      <p>${t("cta_sub")}</p>
      <form class="newsletter-form" onsubmit="subscribeNewsletter(event)">
        <input type="email" id="newsletter_email" placeholder="${t("cta_placeholder")}" required>
        <button type="submit">${t("cta_button")} →</button>
      </form>
    </section>`;
}

function renderContact(s) {
  const wa = (s.whatsapp || "970599000000").replace(/[^0-9]/g, "");
  const insta = (s.instagram || "@amalabaya").replace(/^@/, "");
  return `
    <section class="section" id="contact">
      <div class="section-head">
        <div class="section-eyebrow">${t("contact_eyebrow")}</div>
        <h2 class="section-title">${t("contact_title")}</h2>
        <p class="section-sub">${t("contact_sub")}</p>
      </div>
      <div class="contact-grid">
        <div class="contact-info">
          <ul class="contact-list">
            <li>${ICONS.phone}
              <div>
                <div class="k">${t("contact_whatsapp_label")}</div>
                <a href="https://wa.me/${wa}" target="_blank" class="v">+${wa}</a>
              </div>
            </li>
            <li>${ICONS.mail}
              <div>
                <div class="k">${t("contact_email_label")}</div>
                <a href="mailto:hello@amalabaya.com" class="v">hello@amalabaya.com</a>
              </div>
            </li>
            <li>${ICONS.insta}
              <div>
                <div class="k">${t("contact_instagram_label")}</div>
                <a href="https://instagram.com/${insta}" target="_blank" class="v">@${insta}</a>
              </div>
            </li>
            <li>${ICONS.pin}
              <div>
                <div class="k">${t("contact_location_label")}</div>
                <div class="v">Ramallah, Palestine</div>
              </div>
            </li>
            <li>${ICONS.clock}
              <div>
                <div class="k">${t("contact_hours_label")}</div>
                <div class="v">${t("contact_hours_value")}</div>
              </div>
            </li>
          </ul>
        </div>
        <form class="contact-form" onsubmit="submitContactForm(event)">
          <div class="form-row">
            <label>${t("contact_form_name")}</label>
            <input type="text" id="cf_name" required>
          </div>
          <div class="form-row">
            <label>${t("contact_form_email")}</label>
            <input type="email" id="cf_email" required>
          </div>
          <div class="form-row">
            <label>${t("contact_form_message")}</label>
            <textarea id="cf_message" rows="5" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">${t("contact_form_send")} <span class="arrow">→</span></button>
        </form>
      </div>
    </section>`;
}

function renderFooter(s) {
  const insta = (s.instagram || "@amalabaya").replace(/^@/, "");
  const wa = (s.whatsapp || "970599000000").replace(/[^0-9]/g, "");
  const year = new Date().getFullYear();
  return `
    <footer class="site-footer" id="footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="brand">${t("brand")}</div>
          <p>${t("footer_about_desc")}</p>
          <div class="footer-socials">
            <a href="https://instagram.com/${insta}" target="_blank" aria-label="Instagram">${ICONS.insta}</a>
            <a href="https://wa.me/${wa}" target="_blank" aria-label="WhatsApp">${ICONS.wa}</a>
            <a href="https://facebook.com/" target="_blank" aria-label="Facebook">${ICONS.fb}</a>
            <a href="https://tiktok.com/" target="_blank" aria-label="TikTok">${ICONS.tiktok}</a>
          </div>
        </div>
        <div class="footer-col">
          <h5>${t("footer_shop")}</h5>
          <ul>
            <li><a href="#collection" onclick="scrollToId('collection',event)">${t("footer_link_collection")}</a></li>
            <li><a href="#collection" onclick="scrollToId('collection',event)">${t("footer_link_newin")}</a></li>
            <li><a href="#collection" onclick="scrollToId('collection',event)">${t("footer_link_bestsellers")}</a></li>
            <li><a href="#contact" onclick="scrollToId('contact',event)">${t("footer_link_giftcards")}</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>${t("footer_help")}</h5>
          <ul>
            <li><a href="#faq" onclick="scrollToId('faq',event)">${t("footer_link_shipping")}</a></li>
            <li><a href="#faq" onclick="scrollToId('faq',event)">${t("footer_link_sizing")}</a></li>
            <li><a href="#care" onclick="scrollToId('care',event)">${t("footer_link_care")}</a></li>
            <li><a href="#contact" onclick="scrollToId('contact',event)">${t("footer_link_contact")}</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>${t("footer_company")}</h5>
          <ul>
            <li><a href="#about-abaya" onclick="scrollToId('about-abaya',event)">${t("footer_link_about")}</a></li>
            <li><a href="#testimonials" onclick="scrollToId('testimonials',event)">${t("footer_link_journal")}</a></li>
            <li><a href="#contact" onclick="scrollToId('contact',event)">${t("footer_link_wholesale")}</a></li>
            <li><a href="#contact" onclick="scrollToId('contact',event)">${t("footer_link_privacy")}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div>© ${year} ${t("brand")} · ${t("footer_made")} · ${t("footer_rights")}</div>
        <button class="admin-link" onclick="openAdminLogin()">${t("admin_login")}</button>
      </div>
    </footer>`;
}

function renderBackToTop() {
  return `<button class="back-to-top" id="backToTop" onclick="scrollToTop()" aria-label="back to top">${ICONS.arrowUp}</button>`;
}

function renderWhatsAppFloat(s) {
  const wa = (s.whatsapp || "970599000000").replace(/[^0-9]/g, "");
  return `<a class="whatsapp-float" target="_blank" href="https://wa.me/${wa}" aria-label="Chat on WhatsApp">${ICONS.wa}</a>`;
}

function renderMobileNav() {
  return `
    <div class="mobile-nav" id="mobileNav">
      <a onclick="toggleMobileNav();scrollToId('collection')">${t("nav_collection")}</a>
      <a onclick="toggleMobileNav();scrollToId('about-abaya')">${t("nav_about")}</a>
      <a onclick="toggleMobileNav();scrollToId('fabrics')">${t("nav_fabrics")}</a>
      <a onclick="toggleMobileNav();scrollToId('testimonials')">${t("nav_journal")}</a>
      <a onclick="toggleMobileNav();scrollToId('contact')">${t("nav_contact")}</a>
    </div>`;
}

// ---------- INTERACTIONS ----------
function scrollToId(id, e) {
  if (e) e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
function scrollToTop(e) {
  if (e) e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function toggleMobileNav() {
  const n = document.getElementById("mobileNav");
  if (n) n.classList.toggle("show");
}

function attachStorefrontGlobalListeners() {
  // Back-to-top visibility
  if (!window._backToTopBound) {
    window._backToTopBound = true;
    window.addEventListener("scroll", () => {
      const btn = document.getElementById("backToTop");
      if (!btn) return;
      if (window.scrollY > 600) btn.classList.add("show");
      else btn.classList.remove("show");
    }, { passive: true });
  }
}

function subscribeNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById("newsletter_email").value.trim();
  if (!email) return;
  // Best-effort: save in localStorage so it doesn't get lost even without a backend wired
  try {
    const list = JSON.parse(localStorage.getItem("amal_newsletter") || "[]");
    if (!list.includes(email)) list.push(email);
    localStorage.setItem("amal_newsletter", JSON.stringify(list));
  } catch (_) {}
  document.getElementById("newsletter_email").value = "";
  showToast(t("cta_success"), "success");
}

function submitContactForm(e) {
  e.preventDefault();
  const n = document.getElementById("cf_name").value.trim();
  const em = document.getElementById("cf_email").value.trim();
  const m = document.getElementById("cf_message").value.trim();
  if (!n || !em || !m) return;
  // Open WhatsApp with the message — most reliable way to reach the shop owner
  const s = window.AmalSettings || {};
  const wa = (s.whatsapp || "970599000000").replace(/[^0-9]/g, "");
  const text = encodeURIComponent(`Hi AMAL ABAYA,\n\nName: ${n}\nEmail: ${em}\n\n${m}`);
  window.open(`https://wa.me/${wa}?text=${text}`, "_blank");
  document.getElementById("cf_name").value = "";
  document.getElementById("cf_email").value = "";
  document.getElementById("cf_message").value = "";
  showToast(t("contact_form_sent"), "success");
}

function productCard(p) {
  const lang = getLang();
  const name = (lang === "ar" ? p.nameAr : p.nameEn) || p.nameEn || p.nameAr || "—";
  const desc = (lang === "ar" ? p.descAr : p.descEn) || "";
  const stock = Number(p.stock) || 0;
  const lowAt = Number(p.lowThreshold) || 3;
  let stockLabel, stockClass = "";
  if (stock <= 0)         { stockLabel = t("out_of_stock"); stockClass = "out"; }
  else if (stock <= lowAt){ stockLabel = t("low_stock", { n: stock }); stockClass = "low"; }
  else                    { stockLabel = t("in_stock"); }

  return `
    <article class="product-card" onclick="openProduct('${p.id}')">
      <div class="product-img">
        ${p.imageURL ? `<img src="${p.imageURL}" alt="${esc(name)}">` : ICONS.abayaSilhouette}
      </div>
      <div class="product-info">
        <h3 class="product-name">${esc(name)}</h3>
        <div class="product-desc">${esc(desc)}</div>
        <div class="product-meta">
          <div class="product-price">${fmtPrice(p.price)}</div>
          <div class="product-stock ${stockClass}">${stockLabel}</div>
        </div>
      </div>
    </article>`;
}

function openProduct(id) {
  const p = _products.find(x => x.id === id);
  if (!p) return;
  const lang = getLang();
  const name = (lang === "ar" ? p.nameAr : p.nameEn) || p.nameEn || p.nameAr;
  const desc = (lang === "ar" ? p.descAr : p.descEn) || "";
  const sizes = (p.sizes || "S,M,L,XL").split(",").map(s => s.trim()).filter(Boolean);
  const colors = (p.colors || "Black").split(",").map(s => s.trim()).filter(Boolean);
  const stock = Number(p.stock) || 0;

  openModal(`
    <div class="modal-head">
      <h3>${esc(name)}</h3>
      <button class="close-btn" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start;">
        <div class="product-img" style="aspect-ratio:3/4;">
          ${p.imageURL ? `<img src="${p.imageURL}" alt="${esc(name)}">` : ICONS.abayaSilhouette}
        </div>
        <div>
          <div style="font-family:var(--ff-display);color:#fff;font-size:28px;font-weight:500;margin-bottom:10px;">${fmtPrice(p.price)}</div>
          <p style="color:var(--text-dim);margin-bottom:24px;line-height:1.7;">${esc(desc)}</p>
          <div class="form-grid">
            <div class="form-row">
              <label>${t("size")}</label>
              <select id="psize">${sizes.map(s => `<option>${s}</option>`).join("")}</select>
            </div>
            <div class="form-row">
              <label>${t("color")}</label>
              <select id="pcolor">${colors.map(s => `<option>${s}</option>`).join("")}</select>
            </div>
            <div class="form-row">
              <label>${t("quantity")}</label>
              <input id="pqty" type="number" min="1" max="${stock || 99}" value="1">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn" onclick="closeModal()">${t("cancel")}</button>
      <button class="btn btn-primary" ${stock <= 0 ? "disabled" : ""} onclick="addToCart('${p.id}')">
        ${stock <= 0 ? t("out_of_stock") : t("add_to_cart")}
      </button>
    </div>
  `);
}

function addToCart(productId) {
  const p = _products.find(x => x.id === productId);
  if (!p) return;
  const size = document.getElementById("psize").value;
  const color = document.getElementById("pcolor").value;
  const qty = Math.max(1, parseInt(document.getElementById("pqty").value) || 1);

  const existingIdx = _cart.findIndex(it => it.productId === productId && it.size === size && it.color === color);
  if (existingIdx >= 0) {
    _cart[existingIdx].quantity += qty;
  } else {
    _cart.push({
      productId: p.id,
      nameAr: p.nameAr, nameEn: p.nameEn,
      price: Number(p.price),
      imageURL: p.imageURL || null,
      size, color, quantity: qty
    });
  }
  saveCart();
  closeModal();
  renderStorefront();
  attachStorefrontGlobalListeners();
  showToast(t("saved"), "success");
  setTimeout(openCart, 200);
}

function openCart() {
  let drawer = document.getElementById("cartDrawer");
  if (!drawer) {
    drawer = document.createElement("div");
    drawer.id = "cartDrawer";
    drawer.className = "drawer";
    document.body.appendChild(drawer);
  }
  drawer.innerHTML = renderCart();
  setTimeout(() => drawer.classList.add("open"), 10);

  document.addEventListener("click", outsideCart, { capture: true });
}

function outsideCart(e) {
  const drawer = document.getElementById("cartDrawer");
  if (drawer && drawer.classList.contains("open")
      && !drawer.contains(e.target)
      && !e.target.closest(".cart-btn")) {
    closeCart();
  }
}
function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  if (drawer) drawer.classList.remove("open");
  document.removeEventListener("click", outsideCart, { capture: true });
}

function renderCart() {
  const s = window.AmalSettings || {};
  const subtotal = cartSubtotal();
  const shipping = _cart.length ? Number(s.shippingFee || 0) : 0;
  const total = subtotal + shipping;
  const lang = getLang();

  return `
    <div class="drawer-head">
      <h3>${t("cart")}</h3>
      <button class="close-btn" onclick="closeCart()">×</button>
    </div>
    <div class="cart-items">
      ${_cart.length ? _cart.map((it, i) => {
        const name = (lang === "ar" ? it.nameAr : it.nameEn) || it.nameEn || it.nameAr;
        return `
        <div class="cart-item">
          <div class="cart-item-img">${it.imageURL ? `<img src="${it.imageURL}">` : "ع"}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${esc(name)}</div>
            <div class="cart-item-meta">${esc(it.size)} · ${esc(it.color)}</div>
            <div class="cart-item-price">${fmtPrice(it.price * it.quantity)}</div>
            <div class="qty-ctl">
              <button onclick="adjCart(${i}, -1)">−</button>
              <span>${it.quantity}</span>
              <button onclick="adjCart(${i}, 1)">+</button>
              <button onclick="removeCart(${i})" style="margin-left:auto;color:var(--danger);">✕</button>
            </div>
          </div>
        </div>`;
      }).join("") : `<div class="empty"><div class="empty-icon">✦</div><div>${t("empty_cart")}</div></div>`}
    </div>
    <div class="drawer-foot">
      <div class="cart-row"><span>${t("subtotal")}</span><span>${fmtPrice(subtotal)}</span></div>
      <div class="cart-row"><span>${t("shipping")}</span><span>${fmtPrice(shipping)}</span></div>
      <div class="cart-row total"><span>${t("total")}</span><span>${fmtPrice(total)}</span></div>
      <button class="btn btn-primary btn-block" style="margin-top:14px;" ${_cart.length ? "" : "disabled"} onclick="startCheckout()">
        ${t("checkout")} <span class="arrow">→</span>
      </button>
    </div>`;
}

function adjCart(i, delta) {
  _cart[i].quantity = Math.max(1, _cart[i].quantity + delta);
  saveCart();
  openCart();
}
function removeCart(i) {
  _cart.splice(i, 1);
  saveCart();
  renderStorefront();
  attachStorefrontGlobalListeners();
  openCart();
}

// ---------- Checkout ----------
function startCheckout() {
  _checkoutStep = 0;
  _checkoutData = {};
  _paymentProofFile = null;
  _paymentProofPreview = null;
  closeCart();
  renderCheckout();
}

function renderCheckout() {
  const stepHTML = [renderStep1, renderStep2, renderStep3][_checkoutStep]();
  openModal(`
    <div class="modal-head">
      <h3>${t("checkout")}</h3>
      <button class="close-btn" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="steps">
        <div class="step ${_checkoutStep === 0 ? 'active' : (_checkoutStep > 0 ? 'done' : '')}">1. ${t("step_details")}</div>
        <div class="step ${_checkoutStep === 1 ? 'active' : (_checkoutStep > 1 ? 'done' : '')}">2. ${t("step_payment")}</div>
        <div class="step ${_checkoutStep === 2 ? 'active' : ''}">3. ${t("step_review")}</div>
      </div>
      ${stepHTML}
    </div>
  `);
}

function renderStep1() {
  const d = _checkoutData;
  const lang = getLang();
  return `
    <div class="form-grid">
      <div class="form-row">
        <label>${t("full_name")} *</label>
        <input id="co_name" value="${esc(d.name || "")}" required>
      </div>
      <div class="form-grid form-grid-2">
        <div class="form-row">
          <label>${t("whatsapp")} *</label>
          <input id="co_whatsapp" value="${esc(d.whatsapp || "")}" placeholder="970599..." required>
        </div>
        <div class="form-row">
          <label>${t("city")} *</label>
          <select id="co_city">
            ${PALESTINIAN_CITIES.map(c => `<option value="${c.en}" ${d.city === c.en ? 'selected' : ''}>${lang === "ar" ? c.ar : c.en}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="form-row">
        <label>${t("address")} *</label>
        <input id="co_address" value="${esc(d.address || "")}" required>
      </div>
      <div class="form-row">
        <label>${t("notes")}</label>
        <textarea id="co_notes" rows="2">${esc(d.notes || "")}</textarea>
      </div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:24px;">
      <button class="btn" onclick="closeModal()">${t("cancel")}</button>
      <button class="btn btn-primary" onclick="checkoutNext()">${t("next")} <span class="arrow">→</span></button>
    </div>`;
}

function renderStep2() {
  const s = window.AmalSettings || {};
  return `
    <div class="bank-info">
      <h4>${t("bank_info")}</h4>
      <div style="color:var(--text-dim);margin:8px 0 14px;font-size:13px;">${t("bank_name")}: <strong style="color:#fff;">${esc(s.bankName)}</strong></div>
      <div style="color:var(--text-dim);font-size:13px;">${t("account_name")}: <strong style="color:#fff;">${esc(s.accountName)}</strong></div>
      <div class="iban-chip">${esc(s.iban)}</div>
      <div style="color:#fff;margin-top:14px;font-size:20px;font-family:var(--ff-display);font-weight:500;">${t("total")}: ${fmtPrice(cartSubtotal() + Number(s.shippingFee || 0))}</div>
    </div>
    <div class="form-row" style="margin-top:18px;">
      <label>${t("upload_proof")} *</label>
      <div class="upload-zone" onclick="document.getElementById('co_proof').click()" id="proofZone">
        ${_paymentProofPreview
          ? `<img src="${_paymentProofPreview}">`
          : `<div style="font-size:36px;opacity:0.4;margin-bottom:8px;">⬆</div><div>${t("upload_hint")}</div>`}
      </div>
      <input type="file" id="co_proof" accept="image/*" style="display:none;" onchange="onProofSelected(event)">
    </div>
    <div style="display:flex;gap:10px;justify-content:space-between;margin-top:24px;">
      <button class="btn" onclick="checkoutBack()"><span class="arrow">←</span> ${t("back")}</button>
      <button class="btn btn-primary" onclick="checkoutNext()">${t("next")} <span class="arrow">→</span></button>
    </div>`;
}

function renderStep3() {
  const d = _checkoutData;
  const s = window.AmalSettings || {};
  const lang = getLang();
  const subtotal = cartSubtotal();
  const shipping = Number(s.shippingFee || 0);
  const total = subtotal + shipping;
  return `
    <div class="card" style="margin-bottom:14px;">
      <div style="color:var(--text-dim);font-size:11px;letter-spacing:0.28em;text-transform:uppercase;margin-bottom:10px;">${t("step_details")}</div>
      <div style="color:#fff;">${esc(d.name)} · ${esc(d.whatsapp)}</div>
      <div style="color:var(--text-dim);font-size:13px;margin-top:4px;">${cityLabel(d.city)} — ${esc(d.address)}</div>
    </div>
    <div class="card" style="margin-bottom:14px;">
      <div style="color:var(--text-dim);font-size:11px;letter-spacing:0.28em;text-transform:uppercase;margin-bottom:10px;">${t("items")}</div>
      ${_cart.map(it => {
        const name = (lang === "ar" ? it.nameAr : it.nameEn) || it.nameEn || it.nameAr;
        return `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--hairline);">
          <div style="color:#fff;"><span>${esc(name)}</span> <span style="color:var(--text-mute);font-size:12px;">×${it.quantity} · ${esc(it.size)} · ${esc(it.color)}</span></div>
          <div style="color:#fff;">${fmtPrice(it.price * it.quantity)}</div>
        </div>`;
      }).join("")}
      <div style="margin-top:12px;color:var(--text-dim);font-size:13px;">
        ${t("subtotal")}: <strong style="color:#fff;">${fmtPrice(subtotal)}</strong> · ${t("shipping")}: <strong style="color:#fff;">${fmtPrice(shipping)}</strong>
      </div>
      <div style="margin-top:6px;color:#fff;font-size:22px;font-family:var(--ff-display);font-weight:500;">${t("total")}: ${fmtPrice(total)}</div>
    </div>
    ${_paymentProofPreview ? `
      <div class="card">
        <div style="color:var(--text-dim);font-size:11px;letter-spacing:0.28em;text-transform:uppercase;margin-bottom:10px;">${t("upload_proof")}</div>
        <img src="${_paymentProofPreview}" style="max-width:100%;max-height:200px;">
      </div>` : ""}
    <div style="display:flex;gap:10px;justify-content:space-between;margin-top:24px;">
      <button class="btn" onclick="checkoutBack()"><span class="arrow">←</span> ${t("back")}</button>
      <button class="btn btn-primary" id="confirmBtn" onclick="submitOrder()">${t("confirm_order")}</button>
    </div>`;
}

async function onProofSelected(e) {
  const f = e.target.files[0];
  if (!f) return;
  const zone = document.getElementById("proofZone");
  if (zone) zone.innerHTML = `<div class="spinner"></div><div style="margin-top:8px;">Compressing…</div>`;
  try {
    const dataURL = await compressImage(f, { maxDim: 1200, maxBytes: 650_000, startQuality: 0.8 });
    _paymentProofFile = f;
    _paymentProofPreview = dataURL;
    renderCheckout();
  } catch (err) {
    showToast("Could not process image: " + err.message, "error");
    renderCheckout();
  }
}

function checkoutNext() {
  if (_checkoutStep === 0) {
    const n = document.getElementById("co_name").value.trim();
    const w = document.getElementById("co_whatsapp").value.trim();
    const c = document.getElementById("co_city").value;
    const a = document.getElementById("co_address").value.trim();
    const notes = document.getElementById("co_notes").value.trim();
    if (!n || !w || !a) { showToast("Please fill all required fields", "error"); return; }
    _checkoutData = { name: n, whatsapp: w, city: c, address: a, notes };
  } else if (_checkoutStep === 1) {
    if (!_paymentProofFile) { showToast("Please upload payment proof", "error"); return; }
  }
  _checkoutStep++;
  renderCheckout();
}
function checkoutBack() { if (_checkoutStep > 0) { _checkoutStep--; renderCheckout(); } }

async function submitOrder() {
  const btn = document.getElementById("confirmBtn");
  if (btn) { btn.disabled = true; btn.innerHTML = `<span class="spinner"></span> …`; }
  try {
    await Amal.ensureAnonSignedIn();
    const s = window.AmalSettings || {};

    const res = await Amal.placeOrder({
      customer: _checkoutData,
      items: _cart.map(it => ({
        productId: it.productId,
        nameAr: it.nameAr, nameEn: it.nameEn,
        price: it.price,
        size: it.size, color: it.color,
        quantity: it.quantity
      })),
      shippingFee: Number(s.shippingFee || 0),
      paymentProofDataURL: _paymentProofPreview,
      notes: _checkoutData.notes
    });

    _cart = [];
    saveCart();
    closeModal();
    renderStorefront();
    attachStorefrontGlobalListeners();
    showOrderSuccess(res.code);
  } catch (e) {
    showToast("Order failed: " + e.message, "error");
    if (btn) { btn.disabled = false; btn.textContent = t("confirm_order"); }
  }
}

function showOrderSuccess(code) {
  const s = window.AmalSettings || {};
  const waNumber = (s.whatsapp || "").replace(/[^0-9]/g, "");
  const waText = encodeURIComponent(`Hi! My order code is ${code}`);
  openModal(`
    <div class="modal-head">
      <h3>✓ ${t("order_placed")}</h3>
      <button class="close-btn" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body" style="text-align:center;">
      <div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:var(--text-dim);margin-bottom:10px;">${t("order_code")}</div>
      <div style="font-family:var(--ff-display);font-size:42px;color:#fff;letter-spacing:6px;margin-bottom:24px;">${code}</div>
      <p style="color:var(--text-dim);line-height:1.7;">${t("order_thanks")}</p>
    </div>
    <div class="modal-foot">
      <button class="btn" onclick="closeModal()">${t("continue_shopping")}</button>
      <a class="btn btn-primary" target="_blank" href="https://wa.me/${waNumber}?text=${waText}">${t("contact_whatsapp")}</a>
    </div>
  `);
}

// ---------- Admin login from storefront ----------
function openAdminLogin() {
  openModal(`
    <div class="modal-head">
      <h3>${t("admin_pin")}</h3>
      <button class="close-btn" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-row">
          <label>Email</label>
          <input id="al_email" type="email" value="${(window.AmalSettings && window.AmalSettings.adminEmail) || 'admin@amal-abaya.local'}">
        </div>
        <div class="form-row">
          <label>${t("pin")}</label>
          <input id="al_pin" type="password" placeholder="••••••">
        </div>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn" onclick="closeModal()">${t("cancel")}</button>
      <button class="btn btn-primary" id="loginBtn" onclick="doAdminLogin()">${t("login")}</button>
    </div>
  `);
  setTimeout(() => document.getElementById("al_pin").focus(), 80);
}

async function doAdminLogin() {
  const email = document.getElementById("al_email").value.trim();
  const pin = document.getElementById("al_pin").value;
  const btn = document.getElementById("loginBtn");
  btn.disabled = true; btn.innerHTML = `<span class="spinner"></span>`;
  try {
    await Amal.adminLogin(email, pin);
    closeModal();
    showToast("Welcome back", "success");
    window.location.hash = "#admin";
  } catch (e) {
    const code = (e && e.code) || "";
    const map = {
      "auth/wrong-password":       "Wrong password",
      "auth/invalid-credential":   "Wrong email or password",
      "auth/user-not-found":       "No account with that email",
      "auth/invalid-email":        "Invalid email format",
      "auth/too-many-requests":    "Too many tries — wait a few minutes",
      "auth/unauthorized-domain":  "This domain is not authorized in Firebase Auth settings",
      "auth/operation-not-allowed":"Email/Password sign-in is disabled in Firebase",
      "auth/network-request-failed":"Network error — check connection"
    };
    const msg = map[code] || (code ? code : (e.message || t("wrong_pin")));
    console.error("[AMAL] login failed:", code, e.message);
    showToast(msg, "error");
    btn.disabled = false; btn.textContent = t("login");
  }
}

// ---------- helpers ----------
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function openModal(html) {
  let ov = document.getElementById("overlay");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "overlay";
    ov.className = "overlay";
    document.body.appendChild(ov);
  }
  ov.innerHTML = `<div class="modal">${html}</div>`;
  ov.classList.add("show");
}
function closeModal() {
  const ov = document.getElementById("overlay");
  if (ov) ov.classList.remove("show");
}

function showToast(msg, type = "") {
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function showLoading(on) {
  let l = document.getElementById("loading");
  if (on) {
    if (!l) {
      l = document.createElement("div");
      l.id = "loading";
      l.className = "loading-screen";
      l.innerHTML = `
        <div class="brand">AMAL ABAYA</div>
        <div class="spinner"></div>
        <div class="label">LOADING…</div>`;
      document.body.appendChild(l);
    }
  } else {
    if (l) l.remove();
  }
}

// ---------- global exports ----------
window.openCart = openCart;
window.closeCart = closeCart;
window.openProduct = openProduct;
window.addToCart = addToCart;
window.adjCart = adjCart;
window.removeCart = removeCart;
window.startCheckout = startCheckout;
window.checkoutNext = checkoutNext;
window.checkoutBack = checkoutBack;
window.onProofSelected = onProofSelected;
window.submitOrder = submitOrder;
window.openAdminLogin = openAdminLogin;
window.doAdminLogin = doAdminLogin;
window.closeModal = closeModal;
window.openModal = openModal;
window.showToast = showToast;
window.showLoading = showLoading;
window.esc = esc;
window.loadStorefront = loadStorefront;
window.renderStorefront = renderStorefront;
window.scrollToId = scrollToId;
window.scrollToTop = scrollToTop;
window.toggleMobileNav = toggleMobileNav;
window.subscribeNewsletter = subscribeNewsletter;
window.submitContactForm = submitContactForm;
