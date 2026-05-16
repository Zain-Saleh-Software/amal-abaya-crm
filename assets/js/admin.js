// ============================================
// عبايات أمل — Admin Dashboard (pearl white)
// ============================================

const ADMIN_VIEWS = ["dashboard", "products", "inventory", "orders", "delivery", "customers", "settings"];
let _adminView = "dashboard";
let _adminData = { products: [], orders: [], settings: {} };
let _orderFilterCity = "";
let _orderFilterStatus = "";

const A_ICONS = {
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>`,
  products:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  inventory: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  orders:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11h6M9 15h4M5 19V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/></svg>`,
  delivery:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  customers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  settings:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  logout:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  close:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  edit:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>`,
};

// ── ENTRY ──────────────────────────────────────────────────
async function loadAdmin() {
  document.body.classList.remove("theme-luxury");
  document.body.classList.add("theme-pearl");
  // Auth gate
  const user = Amal.auth.currentUser;
  if (!user || user.isAnonymous) {
    renderLogin();
    return;
  }
  await loadAdminData();
  renderAdmin();
}

async function loadAdminData() {
  try {
    const [products, orders, settings] = await Promise.all([
      Amal.fetchAll("products", { orderBy: ["createdAt", "desc"] }),
      Amal.fetchAll("orders",   { orderBy: ["createdAt", "desc"] }),
      Amal.getSettings()
    ]);
    _adminData = { products, orders, settings };
    window.AmalSettings = settings;
  } catch (e) {
    console.warn(e);
  }
}

// ── LOGIN ──────────────────────────────────────────────────
function renderLogin() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="login-shell">
      <div class="login-card">
        <h2>${t("admin_login")}</h2>
        <div class="sub">${t("admin_login_sub")}</div>
        <div class="field"><label>${t("email")}</label><input id="li_email" type="email" autocomplete="email"></div>
        <div class="field"><label>${t("password")}</label><input id="li_pw" type="password" autocomplete="current-password"></div>
        <button class="btn btn-primary" style="width:100%;background:var(--gold);color:#0a0a0a;border-color:var(--gold);" onclick="doAdminLogin()">${t("sign_in")}</button>
        <div id="li_err" style="color:var(--danger);font-size:13px;margin-top:12px;text-align:center;"></div>
      </div>
    </div>
  `;
  setTimeout(() => document.getElementById("li_email")?.focus(), 100);
}

async function doAdminLogin() {
  const email = document.getElementById("li_email").value.trim();
  const pw    = document.getElementById("li_pw").value;
  const err   = document.getElementById("li_err");
  err.textContent = "";
  if (!email || !pw) { err.textContent = t("fill_required"); return; }
  try {
    await Amal.adminLogin(email, pw);
    await loadAdminData();
    renderAdmin();
  } catch (e) {
    err.textContent = t("login_failed") + ": " + e.message;
  }
}
window.doAdminLogin = doAdminLogin;

async function doAdminLogout() {
  try { await Amal.adminLogout(); } catch {}
  location.hash = "";
  location.reload();
}
window.doAdminLogout = doAdminLogout;

// ── ADMIN SHELL ────────────────────────────────────────────
function renderAdmin() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="admin-shell">
      ${renderAdminSidebar()}
      <main class="admin-main">${renderAdminView()}</main>
    </div>
    <div id="modal-root"></div>
    <div id="toast-root" class="toast-stack"></div>
  `;
}
window.renderCurrentView = renderAdmin;

function renderAdminSidebar() {
  const user = Amal.auth.currentUser;
  return `
    <aside class="admin-sidebar">
      <div class="brand">
        ${t("brand")}
        <span class="sub">${t("admin_title")}</span>
      </div>
      <nav class="admin-nav">
        ${ADMIN_VIEWS.map(v => `
          <a class="${_adminView===v?'active':''}" onclick="setAdminView('${v}')">
            ${A_ICONS[v]}
            <span>${t('nav_'+v)}</span>
          </a>
        `).join("")}
      </nav>
      <div class="admin-foot">
        <div class="who">${esc(user?.email || '')}</div>
        <button class="btn btn-sm" style="display:flex;gap:8px;align-items:center;justify-content:center;" onclick="doAdminLogout()">
          ${A_ICONS.logout} ${t("logout")}
        </button>
      </div>
    </aside>
  `;
}

function setAdminView(v) {
  _adminView = v;
  const main = document.querySelector(".admin-main");
  if (main) main.innerHTML = renderAdminView();
  document.querySelectorAll(".admin-nav a").forEach((el, i) => el.classList.toggle("active", ADMIN_VIEWS[i] === v));
}
window.setAdminView = setAdminView;

function renderAdminView() {
  switch (_adminView) {
    case "dashboard": return renderDashboard();
    case "products":  return renderProductsView();
    case "inventory": return renderInventoryView();
    case "orders":    return renderOrdersView();
    case "delivery":  return renderDeliveryView();
    case "customers": return renderCustomersView();
    case "settings":  return renderSettingsView();
  }
  return "";
}

// ── DASHBOARD ──────────────────────────────────────────────
function renderDashboard() {
  const today = new Date().toISOString().slice(0,10);
  const todays = _adminData.orders.filter(o => {
    const d = o.createdAt?.toDate ? o.createdAt.toDate().toISOString().slice(0,10) : (o.createdAt || "").slice(0,10);
    return d === today;
  });
  const salesToday = todays.reduce((s, o) => s + (Number(o.total)||0), 0);
  const lowStockN = _adminData.products.filter(p => {
    const stock = totalStockA(p);
    return stock <= (Number(p.lowThreshold)||3);
  }).length;
  const recent = _adminData.orders.slice(0, 6);

  return `
    <div class="admin-head">
      <h1>${t("nav_dashboard")}</h1>
      <div class="meta">${new Date().toLocaleDateString(getLang()==='ar'?'ar-EG':'en-US', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
    </div>
    <div class="stat-grid">
      <div class="stat-card"><div class="label">${t("stat_orders_today")}</div><div class="val">${todays.length}</div></div>
      <div class="stat-card"><div class="label">${t("stat_sales_today")}</div><div class="val">${fmtPrice(salesToday)}</div></div>
      <div class="stat-card"><div class="label">${t("stat_products")}</div><div class="val">${_adminData.products.length}</div></div>
      <div class="stat-card"><div class="label">${t("stat_low_stock")}</div><div class="val" style="color:${lowStockN?'#b14a1f':'#0a0a0a'};">${lowStockN}</div></div>
    </div>
    <div class="card">
      <h3>${t("nav_orders")} — ${recent.length}</h3>
      ${recent.length ? renderOrdersTable(recent, false) : `<div style="color:#888;">${t("no_data")}</div>`}
    </div>
  `;
}

function totalStockA(p) {
  const variants = Array.isArray(p.variants) ? p.variants : [];
  return variants.length
    ? variants.reduce((n, v) => n + (Number(v.stock) || 0), 0)
    : (Number(p.stock) || 0);
}

// ── PRODUCTS ───────────────────────────────────────────────
function renderProductsView() {
  return `
    <div class="admin-head">
      <h1>${t("products_title")}</h1>
      <button class="btn btn-primary" onclick="openProductForm()">${t("add_product")}</button>
    </div>
    <div class="card" style="padding:0;overflow:hidden;">
      <table class="tbl">
        <thead><tr>
          <th></th><th>${t("name_ar")}</th><th>${t("category")}</th><th>${t("price")}</th><th>${t("stock")}</th><th></th>
        </tr></thead>
        <tbody>
          ${_adminData.products.length ? _adminData.products.map(p => {
            const stock = totalStockA(p);
            const lowAt = Number(p.lowThreshold)||3;
            return `<tr>
              <td>${p.imageURL || (p.images?.[0]?.url) ? `<img class="thumb-sm" src="${p.imageURL||p.images?.[0]?.url}">` : `<div class="thumb-sm" style="display:flex;align-items:center;justify-content:center;color:#bbb;">—</div>`}</td>
              <td><strong>${esc(p.nameAr||p.nameEn||'—')}</strong><br><span style="color:#888;font-size:12px;">${esc(p.nameEn||'')}</span></td>
              <td>${p.category ? t('cat_'+p.category) : '—'}</td>
              <td>${fmtPrice(p.price)}</td>
              <td>${stock} ${stock<=0?`<span class="pill cancelled">${t("out_of_stock")}</span>`: stock<=lowAt?`<span class="pill low">${t("low_stock")}</span>`:''}</td>
              <td class="actions">
                <button onclick="openProductForm('${p.id}')">${A_ICONS.edit}</button>
                <button class="del" onclick="deleteProduct('${p.id}')">${A_ICONS.trash}</button>
              </td>
            </tr>`;
          }).join("") : `<tr><td colspan="6" style="text-align:center;padding:40px;color:#888;">${t("no_data")}</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function openProductForm(id) {
  const p = id ? _adminData.products.find(x=>x.id===id) : null;
  window._pfImg = p?.imageURL || null;
  window._pfImages = JSON.parse(JSON.stringify(p?.images || []));
  window._pfVariants = JSON.parse(JSON.stringify(p?.variants || []));

  openModal(`
    <div class="modal-head">
      <h3>${id ? t("edit") : t("add")} — ${t("products_title")}</h3>
      <button class="close-btn" onclick="closeModal()">${A_ICONS.close}</button>
    </div>
    <div class="modal-body">
      <div class="field-grid">
        <div class="field"><label>${t("name_ar")}</label><input id="pf_ar" value="${esc(p?.nameAr||'')}"></div>
        <div class="field"><label>${t("name_en")}</label><input id="pf_en" value="${esc(p?.nameEn||'')}"></div>
      </div>
      <div class="field-grid">
        <div class="field"><label>${t("desc_ar")}</label><textarea id="pf_dAr" rows="2">${esc(p?.descAr||'')}</textarea></div>
        <div class="field"><label>${t("desc_en")}</label><textarea id="pf_dEn" rows="2">${esc(p?.descEn||'')}</textarea></div>
      </div>
      <div class="field-grid">
        <div class="field"><label>${t("price")}</label><input id="pf_price" type="number" step="0.01" value="${p?.price||''}"></div>
        <div class="field"><label>${t("cost")}</label><input id="pf_cost" type="number" step="0.01" value="${p?.cost||''}"></div>
      </div>
      <div class="field-grid">
        <div class="field">
          <label>${t("category")}</label>
          <select id="pf_cat">
            <option value="" ${!p?.category?'selected':''}>—</option>
            <option value="practical" ${p?.category==='practical'?'selected':''}>${t("cat_practical")}</option>
            <option value="occasion"  ${p?.category==='occasion'?'selected':''}>${t("cat_occasion")}</option>
            <option value="black"     ${p?.category==='black'?'selected':''}>${t("cat_black")}</option>
            <option value="open"      ${p?.category==='open'?'selected':''}>${t("cat_open")}</option>
          </select>
        </div>
        <div class="field">
          <label>${t("discount")}</label>
          <div style="display:flex;gap:6px;">
            <select id="pf_disc_type" style="flex:0 0 120px;">
              <option value="percent" ${(p?.discount?.type||'percent')==='percent'?'selected':''}>${t("discount_percent")}</option>
              <option value="amount" ${p?.discount?.type==='amount'?'selected':''}>${t("discount_amount")}</option>
            </select>
            <input id="pf_disc_val" type="number" step="0.01" min="0" value="${p?.discount?.value||0}" placeholder="0">
          </div>
        </div>
      </div>
      <div class="field-grid">
        <div class="field"><label>${t("stock")} (${t("variants")} optional)</label><input id="pf_stock" type="number" value="${p?.stock||0}"></div>
        <div class="field"><label>${t("low_threshold")}</label><input id="pf_low" type="number" value="${p?.lowThreshold||3}"></div>
      </div>
      <div class="field-grid">
        <div class="field"><label>${t("sizes")} (comma)</label><input id="pf_sizes" value="${esc(p?.sizes||'S,M,L,XL')}"></div>
        <div class="field"><label>${t("colors")} (comma)</label><input id="pf_colors" value="${esc(p?.colors||'أسود')}"></div>
      </div>

      <div class="field">
        <label>${t("variants")}</label>
        <div id="pf_variants_list">${renderVariantsList()}</div>
        <button class="btn btn-sm" type="button" onclick="addVariantRow()">${t("add_variant")}</button>
      </div>

      <div class="field">
        <label>${t("image_main")}</label>
        <div class="upload-zone" onclick="document.getElementById('pf_img').click()" id="pf_imgZone">
          ${p?.imageURL ? `<img src="${p.imageURL}">` : `<div>اضغطي لرفع الصورة</div>`}
        </div>
        <input type="file" id="pf_img" accept="image/*" style="display:none;" onchange="onProductImg(event)">
      </div>

      <div class="field">
        <label>${t("images_extra")}</label>
        <div id="pf_images_list">${renderColorImagesList()}</div>
        <input type="file" id="pf_color_img" accept="image/*" style="display:none;" onchange="onColorImgUpload(event)">
        <button class="btn btn-sm" type="button" onclick="document.getElementById('pf_color_img').click()">${t("add_image")}</button>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeModal()">${t("cancel")}</button>
      <button class="btn btn-primary" onclick="saveProduct('${id||''}')">${t("save")}</button>
    </div>
  `);
}
window.openProductForm = openProductForm;

function renderVariantsList() {
  const v = window._pfVariants || [];
  if (!v.length) return `<div style="color:#888;font-size:13px;margin-bottom:6px;">— ${t("no_data")} —</div>`;
  return v.map((row, i) => `
    <div class="variant-row">
      <input data-vi="${i}" data-vk="color" placeholder="${t("pd_color")}" value="${esc(row.color||'')}">
      <input data-vi="${i}" data-vk="size"  placeholder="${t("pd_size")}"  value="${esc(row.size||'')}">
      <input data-vi="${i}" data-vk="stock" placeholder="${t("stock")}" type="number" value="${row.stock||0}">
      <button class="icon-x" type="button" onclick="rmVariantRow(${i})">${A_ICONS.close}</button>
    </div>
  `).join("");
}
function collectVariants() {
  document.querySelectorAll('[data-vi]').forEach(inp => {
    const i = Number(inp.dataset.vi);
    const k = inp.dataset.vk;
    if (!window._pfVariants[i]) window._pfVariants[i] = {};
    window._pfVariants[i][k] = (k === "stock") ? (Number(inp.value)||0) : inp.value;
  });
}
function addVariantRow() {
  collectVariants();
  window._pfVariants = window._pfVariants || [];
  window._pfVariants.push({ color: "", size: "", stock: 0 });
  document.getElementById("pf_variants_list").innerHTML = renderVariantsList();
}
function rmVariantRow(i) {
  collectVariants();
  window._pfVariants.splice(i, 1);
  document.getElementById("pf_variants_list").innerHTML = renderVariantsList();
}
window.addVariantRow = addVariantRow;
window.rmVariantRow = rmVariantRow;

function renderColorImagesList() {
  const list = window._pfImages || [];
  if (!list.length) return `<div style="color:#888;font-size:13px;margin-bottom:6px;">— ${t("no_data")} —</div>`;
  return list.map((im, i) => `
    <div class="image-pair">
      <img src="${im.url}">
      <input data-ii="${i}" data-ik="color" placeholder="${t("pd_color")}" value="${esc(im.color||'')}">
      <span style="font-size:11px;color:#888;">${im.url.startsWith('data:')?'inline':'url'}</span>
      <button class="icon-x" type="button" onclick="rmColorImg(${i})">${A_ICONS.close}</button>
    </div>
  `).join("");
}
function collectColorImages() {
  document.querySelectorAll('[data-ii]').forEach(inp => {
    const i = Number(inp.dataset.ii);
    if (window._pfImages[i]) window._pfImages[i].color = inp.value;
  });
}
async function onColorImgUpload(e) {
  const f = e.target.files[0]; if (!f) return;
  try {
    const dataURL = await compressImage(f, { maxDim: 1400, maxBytes: 700000, startQuality: 0.85 });
    collectColorImages();
    window._pfImages.push({ color: "", url: dataURL });
    document.getElementById("pf_images_list").innerHTML = renderColorImagesList();
  } catch (err) { showToast(err.message, "error"); }
  e.target.value = "";
}
function rmColorImg(i) {
  collectColorImages();
  window._pfImages.splice(i, 1);
  document.getElementById("pf_images_list").innerHTML = renderColorImagesList();
}
window.onColorImgUpload = onColorImgUpload;
window.rmColorImg = rmColorImg;

async function onProductImg(e) {
  const f = e.target.files[0]; if (!f) return;
  const zone = document.getElementById("pf_imgZone");
  zone.innerHTML = `<div class="spinner"></div>`;
  try {
    const dataURL = await compressImage(f, { maxDim: 1400, maxBytes: 700000, startQuality: 0.85 });
    window._pfImg = dataURL;
    zone.innerHTML = `<img src="${dataURL}">`;
  } catch (err) {
    zone.innerHTML = `<div style="color:var(--danger);">${err.message}</div>`;
  }
}
window.onProductImg = onProductImg;

async function saveProduct(id) {
  collectVariants();
  collectColorImages();
  try {
    const data = {
      nameAr:  document.getElementById("pf_ar").value.trim(),
      nameEn:  document.getElementById("pf_en").value.trim(),
      descAr:  document.getElementById("pf_dAr").value.trim(),
      descEn:  document.getElementById("pf_dEn").value.trim(),
      price:   Number(document.getElementById("pf_price").value)||0,
      cost:    Number(document.getElementById("pf_cost").value)||0,
      category: document.getElementById("pf_cat").value || "",
      discount: {
        type:  document.getElementById("pf_disc_type").value,
        value: Number(document.getElementById("pf_disc_val").value)||0
      },
      stock:   Number(document.getElementById("pf_stock").value)||0,
      lowThreshold: Number(document.getElementById("pf_low").value)||3,
      sizes:   document.getElementById("pf_sizes").value.trim(),
      colors:  document.getElementById("pf_colors").value.trim(),
      variants: window._pfVariants || [],
      images:   window._pfImages   || [],
      imageURL: window._pfImg      || null
    };
    if (id) await Amal.updateDocById("products", id, data);
    else    await Amal.createDoc("products", data);
    closeModal();
    await loadAdminData();
    setAdminView("products");
    showToast(t("saved"), "success");
  } catch (e) {
    showToast(e.message, "error");
  }
}
window.saveProduct = saveProduct;

async function deleteProduct(id) {
  if (!confirm(t("delete") + "?")) return;
  try {
    await Amal.deleteDocById("products", id);
    await loadAdminData();
    setAdminView("products");
    showToast(t("saved"), "success");
  } catch (e) { showToast(e.message, "error"); }
}
window.deleteProduct = deleteProduct;

// ── INVENTORY ──────────────────────────────────────────────
function renderInventoryView() {
  const low = _adminData.products.filter(p => totalStockA(p) <= (Number(p.lowThreshold)||3));
  return `
    <div class="admin-head"><h1>${t("inv_title")}</h1></div>
    ${low.length ? `
      <div class="card" style="border-inline-start:4px solid #b14a1f;">
        <h3>${t("inv_low_alert")} (${low.length})</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;">
          ${low.map(p => `<div style="padding:10px;border:1px solid rgba(0,0,0,0.06);border-radius:8px;background:#faf9f6;">
            <strong>${esc(p.nameAr||p.nameEn)}</strong>
            <div style="font-size:13px;color:#888;margin-top:4px;">${t("stock")}: ${totalStockA(p)}</div>
          </div>`).join("")}
        </div>
      </div>` : ""}
    <div class="card" style="padding:0;overflow:hidden;">
      <table class="tbl">
        <thead><tr>
          <th></th><th>${t("name_ar")}</th><th>${t("stock")}</th><th>${t("variants")}</th>
        </tr></thead>
        <tbody>
          ${_adminData.products.map(p => {
            const stock = totalStockA(p);
            const lowAt = Number(p.lowThreshold)||3;
            const variants = Array.isArray(p.variants) ? p.variants : [];
            return `<tr>
              <td>${p.imageURL ? `<img class="thumb-sm" src="${p.imageURL}">` : `<div class="thumb-sm"></div>`}</td>
              <td><strong>${esc(p.nameAr||p.nameEn)}</strong></td>
              <td><span style="font-size:18px;font-weight:700;">${stock}</span> ${stock<=0?`<span class="pill cancelled">${t("out_of_stock")}</span>`: stock<=lowAt?`<span class="pill low">${t("low_stock")}</span>`:''}</td>
              <td>${variants.length
                ? variants.map(v => `<span class="pill" style="background:#f3f1eb;color:#444;margin:2px;">${esc(v.color||'')} · ${esc(v.size||'')} · ${v.stock||0}</span>`).join("")
                : `<span style="color:#888;">— ${t("stock")} ${stock} —</span>`}</td>
            </tr>`;
          }).join("") || `<tr><td colspan="4" style="text-align:center;padding:40px;color:#888;">${t("no_data")}</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

// ── ORDERS ─────────────────────────────────────────────────
function renderOrdersView() {
  const cities = [...new Set(_adminData.orders.map(o => o.customer?.city).filter(Boolean))];
  let filtered = _adminData.orders;
  if (_orderFilterCity)   filtered = filtered.filter(o => o.customer?.city === _orderFilterCity);
  if (_orderFilterStatus) filtered = filtered.filter(o => o.status === _orderFilterStatus);
  return `
    <div class="admin-head"><h1>${t("orders_title")}</h1></div>
    <div class="card">
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
        <select onchange="_orderFilterCity=this.value; setAdminView('orders')" style="padding:8px 12px;border:1px solid rgba(0,0,0,0.12);border-radius:8px;background:#fff;">
          <option value="">${t("orders_filter_city")}</option>
          ${cities.map(c => `<option value="${esc(c)}" ${_orderFilterCity===c?'selected':''}>${cityLabel(c)}</option>`).join("")}
        </select>
        <select onchange="_orderFilterStatus=this.value; setAdminView('orders')" style="padding:8px 12px;border:1px solid rgba(0,0,0,0.12);border-radius:8px;background:#fff;">
          <option value="">${t("orders_filter_st")}</option>
          <option value="processing" ${_orderFilterStatus==='processing'?'selected':''}>${t("status_processing")}</option>
          <option value="shipped"    ${_orderFilterStatus==='shipped'?'selected':''}>${t("status_shipped")}</option>
          <option value="delivered"  ${_orderFilterStatus==='delivered'?'selected':''}>${t("status_delivered")}</option>
          <option value="cancelled"  ${_orderFilterStatus==='cancelled'?'selected':''}>${t("status_cancelled")}</option>
        </select>
      </div>
      ${renderOrdersTable(filtered, true)}
    </div>
  `;
}

function renderOrdersTable(orders, withActions) {
  if (!orders.length) return `<div style="color:#888;padding:20px;">${t("no_data")}</div>`;
  return `
    <div style="overflow-x:auto;"><table class="tbl">
      <thead><tr>
        <th>${t("code")}</th><th>${t("customer")}</th><th>${t("city")}</th><th>${t("items")}</th><th>${t("total")}</th><th>${t("nav_orders")}</th>${withActions?`<th></th>`:''}
      </tr></thead>
      <tbody>
        ${orders.map(o => {
          const items = (o.items||[]).length;
          const code = o.code || (o.id?.slice(-6) || '—');
          return `<tr>
            <td><strong>${esc(code)}</strong></td>
            <td>${esc(o.customer?.name||'—')}<br><span style="font-size:12px;color:#888;" dir="ltr">${esc(o.customer?.whatsapp||'')}</span></td>
            <td>${cityLabel(o.customer?.city)}</td>
            <td>${items}</td>
            <td><strong>${fmtPrice(o.total)}</strong></td>
            <td><span class="pill ${o.status||'processing'}">${t('status_'+(o.status||'processing'))}</span></td>
            ${withActions ? `<td>
              <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding:5px 8px;border:1px solid rgba(0,0,0,0.12);border-radius:6px;font-size:12px;">
                <option value="" disabled selected>${t("update_status")}</option>
                <option value="processing">${t("status_processing")}</option>
                <option value="shipped">${t("status_shipped")}</option>
                <option value="delivered">${t("status_delivered")}</option>
                <option value="cancelled">${t("status_cancelled")}</option>
              </select>
            </td>` : ''}
          </tr>`;
        }).join("")}
      </tbody>
    </table></div>
  `;
}

async function updateOrderStatus(id, status) {
  if (!status) return;
  try {
    await Amal.updateOrderStatus(id, status);
    await loadAdminData();
    setAdminView("orders");
    showToast(t("saved"), "success");
  } catch (e) { showToast(e.message, "error"); }
}
window.updateOrderStatus = updateOrderStatus;

// ── DELIVERY (by city) ─────────────────────────────────────
function renderDeliveryView() {
  const groups = {};
  _adminData.orders
    .filter(o => o.status !== "delivered" && o.status !== "cancelled")
    .forEach(o => {
      const c = o.customer?.city || "—";
      (groups[c] ||= []).push(o);
    });
  const keys = Object.keys(groups);
  return `
    <div class="admin-head"><h1>${t("nav_delivery")}</h1></div>
    ${keys.length ? keys.map(c => `
      <div class="card">
        <h3>${cityLabel(c)} <span style="color:#888;font-size:13px;font-weight:400;">— ${groups[c].length} ${t("nav_orders")}</span></h3>
        ${renderOrdersTable(groups[c], true)}
      </div>
    `).join("") : `<div class="card" style="color:#888;text-align:center;padding:40px;">${t("no_data")}</div>`}
  `;
}

// ── CUSTOMERS ──────────────────────────────────────────────
function renderCustomersView() {
  const map = new Map();
  _adminData.orders.forEach(o => {
    if (!o.customer?.whatsapp) return;
    const k = o.customer.whatsapp.replace(/[^0-9]/g, "");
    if (!map.has(k)) {
      map.set(k, { name: o.customer.name, whatsapp: o.customer.whatsapp, city: o.customer.city, orders: 0, total: 0 });
    }
    const c = map.get(k);
    c.orders++;
    c.total += Number(o.total)||0;
  });
  const list = [...map.values()].sort((a,b) => b.total - a.total);
  return `
    <div class="admin-head"><h1>${t("nav_customers")}</h1></div>
    <div class="card" style="padding:0;overflow:hidden;">
      <table class="tbl">
        <thead><tr>
          <th>${t("name")}</th><th>${t("whatsapp")}</th><th>${t("city")}</th><th>${t("nav_orders")}</th><th>${t("total")}</th><th></th>
        </tr></thead>
        <tbody>
          ${list.map(c => `<tr>
            <td>${esc(c.name||'—')}</td>
            <td dir="ltr">${esc(c.whatsapp||'—')}</td>
            <td>${cityLabel(c.city)}</td>
            <td>${c.orders}</td>
            <td><strong>${fmtPrice(c.total)}</strong></td>
            <td><a class="btn btn-sm" target="_blank" href="https://wa.me/${c.whatsapp.replace(/[^0-9]/g,'')}">WA</a></td>
          </tr>`).join("") || `<tr><td colspan="6" style="text-align:center;padding:40px;color:#888;">${t("no_data")}</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

// ── SETTINGS ───────────────────────────────────────────────
function renderSettingsView() {
  const s = _adminData.settings || {};
  window._sAccounts = JSON.parse(JSON.stringify(Array.isArray(s.bankAccounts) && s.bankAccounts.length
    ? s.bankAccounts
    : (s.bankName ? [{ bankName: s.bankName, accountName: s.accountName||'', accountNumber: s.accountNumber||'', iban: s.iban||'' }] : [])));
  window._sCities = JSON.parse(JSON.stringify(Array.isArray(s.cities) && s.cities.length ? s.cities : DEFAULT_CITIES));
  window._sBanner = s.bannerURL || null;

  return `
    <div class="admin-head"><h1>${t("settings_title")}</h1></div>
    <div class="card">
      <h3>${t("business_info")}</h3>
      <div class="field-grid">
        <div class="field"><label>${t("whatsapp")}</label><input id="set_wa" value="${esc(s.whatsapp||'')}" dir="ltr"></div>
        <div class="field"><label>${t("phone")}</label><input id="set_phone" value="${esc(s.phone||'')}" dir="ltr"></div>
        <div class="field"><label>${t("instagram")}</label><input id="set_ig" value="${esc(s.instagram||'')}" dir="ltr"></div>
        <div class="field"><label>${t("shipping_fee")}</label><input id="set_ship" type="number" value="${s.shippingFee||25}"></div>
        <div class="field"><label>${t("currency")}</label><input id="set_cur" value="${esc(s.currency||'₪')}"></div>
        <div class="field"><label>Admin email</label><input id="set_email" value="${esc(s.adminEmail||'')}" dir="ltr"></div>
      </div>
    </div>

    <div class="card">
      <h3>${t("banner")}</h3>
      <div class="upload-zone" onclick="document.getElementById('set_banner_file').click()" id="set_bannerZone">
        ${s.bannerURL ? `<img src="${s.bannerURL}" style="max-height:180px;">` : `<div>${t("upload_banner")}</div>`}
      </div>
      <input type="file" id="set_banner_file" accept="image/*" style="display:none;" onchange="onBannerUpload(event)">
      ${s.bannerURL ? `<button class="btn btn-sm" style="margin-top:8px;" onclick="window._sBanner=null; document.getElementById('set_bannerZone').innerHTML='<div>${t('upload_banner')}</div>';">${t("delete")}</button>` : ""}
    </div>

    <div class="card">
      <h3>${t("bank_accounts")}</h3>
      <div id="bankList">${renderBankList()}</div>
      <button class="btn btn-sm" onclick="addBank()">${t("add_bank_account")}</button>
    </div>

    <div class="card">
      <h3>${t("delivery_cities")}</h3>
      <div id="cityList">${renderCityList()}</div>
      <button class="btn btn-sm" onclick="addCity()">${t("add_city")}</button>
    </div>

    <div style="display:flex;justify-content:flex-end;">
      <button class="btn btn-primary" onclick="saveSettings()">${t("save")}</button>
    </div>
  `;
}

function renderBankList() {
  const accs = window._sAccounts || [];
  if (!accs.length) return `<div style="color:#888;margin-bottom:10px;">— ${t("no_data")} —</div>`;
  return accs.map((a, i) => `
    <div class="acc-row">
      <div class="field"><label>${t("bank_name")}</label><input data-bi="${i}" data-bk="bankName" value="${esc(a.bankName||'')}"></div>
      <div class="field"><label>${t("account_name")}</label><input data-bi="${i}" data-bk="accountName" value="${esc(a.accountName||'')}"></div>
      <div class="field"><label>${t("account_number")}</label><input data-bi="${i}" data-bk="accountNumber" value="${esc(a.accountNumber||'')}" dir="ltr"></div>
      <button class="icon-x" onclick="rmBank(${i})">${A_ICONS.close}</button>
      <div class="full-row field"><label>${t("iban")}</label><input data-bi="${i}" data-bk="iban" value="${esc(a.iban||'')}" dir="ltr"></div>
    </div>
  `).join("");
}
function collectBanks() {
  document.querySelectorAll('[data-bi]').forEach(inp => {
    const i = Number(inp.dataset.bi);
    if (!window._sAccounts[i]) window._sAccounts[i] = {};
    window._sAccounts[i][inp.dataset.bk] = inp.value;
  });
}
function addBank() {
  collectBanks();
  window._sAccounts = window._sAccounts || [];
  window._sAccounts.push({ bankName: "", accountName: "", accountNumber: "", iban: "" });
  document.getElementById("bankList").innerHTML = renderBankList();
}
function rmBank(i) {
  collectBanks();
  window._sAccounts.splice(i, 1);
  document.getElementById("bankList").innerHTML = renderBankList();
}
window.addBank = addBank;
window.rmBank = rmBank;

function renderCityList() {
  const cs = window._sCities || [];
  return cs.map((c, i) => `
    <div class="city-row">
      <input data-ci="${i}" data-ck="ar" placeholder="${t("city_ar")}" value="${esc(c.ar||'')}">
      <input data-ci="${i}" data-ck="en" placeholder="${t("city_en")}" value="${esc(c.en||'')}" dir="ltr">
      <button class="icon-x" onclick="rmCity(${i})">${A_ICONS.close}</button>
    </div>
  `).join("");
}
function collectCities() {
  document.querySelectorAll('[data-ci]').forEach(inp => {
    const i = Number(inp.dataset.ci);
    if (!window._sCities[i]) window._sCities[i] = {};
    window._sCities[i][inp.dataset.ck] = inp.value;
  });
}
function addCity() {
  collectCities();
  window._sCities = window._sCities || [];
  window._sCities.push({ ar: "", en: "" });
  document.getElementById("cityList").innerHTML = renderCityList();
}
function rmCity(i) {
  collectCities();
  window._sCities.splice(i, 1);
  document.getElementById("cityList").innerHTML = renderCityList();
}
window.addCity = addCity;
window.rmCity = rmCity;

async function onBannerUpload(e) {
  const f = e.target.files[0]; if (!f) return;
  const zone = document.getElementById("set_bannerZone");
  zone.innerHTML = `<div class="spinner"></div>`;
  try {
    const dataURL = await compressImage(f, { maxDim: 1920, maxBytes: 800000, startQuality: 0.85 });
    window._sBanner = dataURL;
    zone.innerHTML = `<img src="${dataURL}" style="max-height:180px;">`;
  } catch (err) { zone.innerHTML = `<div style="color:var(--danger);">${err.message}</div>`; }
}
window.onBannerUpload = onBannerUpload;

async function saveSettings() {
  collectBanks();
  collectCities();
  const first = (window._sAccounts || [])[0] || {};
  const data = {
    whatsapp:    document.getElementById("set_wa").value,
    phone:       document.getElementById("set_phone").value,
    instagram:   document.getElementById("set_ig").value,
    shippingFee: Number(document.getElementById("set_ship").value)||0,
    currency:    document.getElementById("set_cur").value,
    adminEmail:  document.getElementById("set_email").value,
    bannerURL:   window._sBanner || null,
    bankAccounts: window._sAccounts || [],
    cities:      window._sCities || [],
    // legacy mirror
    bankName: first.bankName || "",
    accountName: first.accountName || "",
    accountNumber: first.accountNumber || "",
    iban: first.iban || ""
  };
  try {
    await Amal.saveSettings(data);
    window.AmalSettings = { ...window.AmalSettings, ...data };
    _adminData.settings = window.AmalSettings;
    showToast(t("saved"), "success");
  } catch (e) { showToast(e.message, "error"); }
}
window.saveSettings = saveSettings;

// ── MODAL / TOAST (same as storefront if loaded) ───────────
if (!window.openModal) {
  window.openModal = function(html) {
    const root = document.getElementById("modal-root");
    root.innerHTML = `<div class="modal-backdrop" onclick="if(event.target===this)closeModal()"><div class="modal">${html}</div></div>`;
    requestAnimationFrame(() => root.querySelector(".modal-backdrop").classList.add("open"));
  };
  window.closeModal = function() {
    const root = document.getElementById("modal-root");
    const bd = root.querySelector(".modal-backdrop");
    if (!bd) return;
    bd.classList.remove("open");
    setTimeout(() => { root.innerHTML = ""; }, 300);
  };
}
if (!window.showToast) {
  window.showToast = function(msg, type = "info") {
    const root = document.getElementById("toast-root");
    if (!root) return;
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 250); }, 2800);
  };
}

window.loadAdmin = loadAdmin;
