// ============================================
// AMAL ABAYA — Customer-facing storefront
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
}

function renderStorefront() {
  const app = document.getElementById("app");
  const s = window.AmalSettings || {};
  app.innerHTML = `
    <header class="store-header">
      <div class="store-header-inner">
        <div class="brand">${t("brand")}</div>
        <div class="header-actions">
          <button class="lang-toggle" onclick="toggleLang()">${getLang() === "en" ? "العربية" : "English"}</button>
          <button class="cart-btn" onclick="openCart()" aria-label="cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            ${cartCount() ? `<span class="cart-badge">${cartCount()}</span>` : ""}
          </button>
        </div>
      </div>
    </header>

    <section class="hero">
      <div class="hero-eyebrow">${s.collectionTag || "NEW COLLECTION"}</div>
      <h1>${t("hero_title")}</h1>
      <p>${t("hero_sub")}</p>
      <button class="btn btn-primary" onclick="document.getElementById('collection').scrollIntoView({behavior:'smooth'})">
        ${t("shop_now")} <span class="arrow">→</span>
      </button>
    </section>

    <section class="section" id="collection">
      <div class="section-head">
        <div class="section-eyebrow">★ ${s.collectionTag || ""} ★</div>
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
    </section>

    <footer class="site-footer">
      <div class="brand">${t("brand")}</div>
      <div class="footer-meta">${s.instagram || ""} · MADE WITH CARE IN PALESTINE</div>
      <button class="btn btn-outline btn-sm" onclick="openAdminLogin()">${t("admin_login")}</button>
    </footer>
  `;
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
        ${p.imageURL ? `<img src="${p.imageURL}" alt="${name}">` : "ع"}
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
        <div class="product-img" style="aspect-ratio:3/4;border-radius:var(--radius);">
          ${p.imageURL ? `<img src="${p.imageURL}" alt="${name}">` : "ع"}
        </div>
        <div>
          <div style="color:var(--gold);font-size:24px;font-weight:700;margin-bottom:8px;">${fmtPrice(p.price)}</div>
          <p style="color:var(--text-dim);margin-bottom:18px;">${esc(desc)}</p>
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

  // close on outside click
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
        ${t("checkout")}
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
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;">
      <button class="btn" onclick="closeModal()">${t("cancel")}</button>
      <button class="btn btn-primary" onclick="checkoutNext()">${t("next")} <span class="arrow">→</span></button>
    </div>`;
}

function renderStep2() {
  const s = window.AmalSettings || {};
  return `
    <div class="bank-info">
      <h4>${t("bank_info")}</h4>
      <div style="color:var(--text-dim);margin:8px 0 14px;font-size:13px;">${t("bank_name")}: <strong>${esc(s.bankName)}</strong></div>
      <div style="color:var(--text-dim);font-size:13px;">${t("account_name")}: <strong>${esc(s.accountName)}</strong></div>
      <div class="iban-chip">${esc(s.iban)}</div>
      <div style="color:var(--gold);margin-top:14px;font-size:18px;font-weight:700;">${t("total")}: ${fmtPrice(cartSubtotal() + Number(s.shippingFee || 0))}</div>
    </div>
    <div class="form-row" style="margin-top:14px;">
      <label>${t("upload_proof")} *</label>
      <div class="upload-zone" onclick="document.getElementById('co_proof').click()" id="proofZone">
        ${_paymentProofPreview
          ? `<img src="${_paymentProofPreview}">`
          : `<div style="font-size:36px;opacity:0.4;margin-bottom:8px;">⬆</div><div>${t("upload_hint")}</div>`}
      </div>
      <input type="file" id="co_proof" accept="image/*" style="display:none;" onchange="onProofSelected(event)">
    </div>
    <div style="display:flex;gap:10px;justify-content:space-between;margin-top:20px;">
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
      <div style="color:var(--gold);font-size:12px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">${t("step_details")}</div>
      <div>${esc(d.name)} · ${esc(d.whatsapp)}</div>
      <div style="color:var(--text-dim);font-size:13px;">${cityLabel(d.city)} — ${esc(d.address)}</div>
    </div>
    <div class="card" style="margin-bottom:14px;">
      <div style="color:var(--gold);font-size:12px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">${t("items")}</div>
      ${_cart.map(it => {
        const name = (lang === "ar" ? it.nameAr : it.nameEn) || it.nameEn || it.nameAr;
        return `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-soft);">
          <div><span>${esc(name)}</span> <span style="color:var(--text-mute);font-size:12px;">×${it.quantity} · ${esc(it.size)} · ${esc(it.color)}</span></div>
          <div style="color:var(--gold);">${fmtPrice(it.price * it.quantity)}</div>
        </div>`;
      }).join("")}
      <div style="margin-top:10px;color:var(--text-dim);font-size:13px;">
        ${t("subtotal")}: <strong>${fmtPrice(subtotal)}</strong> · ${t("shipping")}: <strong>${fmtPrice(shipping)}</strong>
      </div>
      <div style="margin-top:6px;color:var(--gold);font-size:20px;font-weight:700;">${t("total")}: ${fmtPrice(total)}</div>
    </div>
    ${_paymentProofPreview ? `
      <div class="card">
        <div style="color:var(--gold);font-size:12px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">${t("upload_proof")}</div>
        <img src="${_paymentProofPreview}" style="max-width:100%;max-height:200px;border-radius:8px;">
      </div>` : ""}
    <div style="display:flex;gap:10px;justify-content:space-between;margin-top:20px;">
      <button class="btn" onclick="checkoutBack()"><span class="arrow">←</span> ${t("back")}</button>
      <button class="btn btn-primary" id="confirmBtn" onclick="submitOrder()">${t("confirm_order")}</button>
    </div>`;
}

async function onProofSelected(e) {
  const f = e.target.files[0];
  if (!f) return;
  // Show "compressing..." while we work
  const zone = document.getElementById("proofZone");
  if (zone) zone.innerHTML = `<div class="spinner"></div><div style="margin-top:8px;">Compressing…</div>`;
  try {
    // Compress to a base64 data URL that fits Firestore's 1 MB doc limit.
    const dataURL = await compressImage(f, { maxDim: 1200, maxBytes: 650_000, startQuality: 0.8 });
    _paymentProofFile = f;          // keep original ref for filename (not used anymore)
    _paymentProofPreview = dataURL; // both preview and what we'll save are the same string
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

    // Proof is already a compressed base64 data URL (see onProofSelected).
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

    // Clear cart
    _cart = [];
    saveCart();
    closeModal();
    renderStorefront();
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
      <h3 style="color:var(--gold);">✓ ${t("order_placed")}</h3>
      <button class="close-btn" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body" style="text-align:center;">
      <div style="font-size:14px;color:var(--text-dim);margin-bottom:6px;">${t("order_code")}</div>
      <div style="font-family:'Courier New',monospace;font-size:32px;color:var(--gold);letter-spacing:4px;margin-bottom:20px;">${code}</div>
      <p style="color:var(--text-dim);">${t("order_thanks")}</p>
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
    // Surface the actual Firebase auth error so the admin can fix the cause
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
