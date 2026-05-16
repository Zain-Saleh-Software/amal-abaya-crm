// ============================================
// AMAL ABAYA — Admin Panel
// ============================================

const ADMIN_VIEWS = ["dashboard", "products", "sales", "finance", "inventory", "delivery", "customers", "settings"];
let _adminView = "dashboard";
let _adminSubView = null;
let _data = {
  products: [], orders: [], customers: [], expenses: [],
  couriers: [], movements: [], settings: {}
};
let _unsubscribes = [];

async function loadAdmin() {
  showLoading(true);
  unsubscribeAll();
  try {
    // initial fetch
    _data.products  = await Amal.fetchAll("products",  { orderBy: ["createdAt", "desc"] });
    _data.orders    = await Amal.fetchAll("orders",    { orderBy: ["createdAt", "desc"] });
    _data.customers = await Amal.fetchAll("customers", { orderBy: ["lifetimeSpend", "desc"] });
    _data.expenses  = await Amal.fetchAll("expenses",  { orderBy: ["createdAt", "desc"] });
    _data.couriers  = await Amal.fetchAll("couriers",  { orderBy: ["name", "asc"] });
    _data.movements = await Amal.fetchAll("movements", { orderBy: ["createdAt", "desc"], limit: 200 });
    _data.settings  = await Amal.getSettings();
    window.AmalSettings = _data.settings;

    // live subscriptions for the dynamic views
    _unsubscribes.push(Amal.subscribe("orders", arr => { _data.orders = arr.sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0)); renderAdmin(); }, {}));
    _unsubscribes.push(Amal.subscribe("products", arr => { _data.products = arr; renderAdmin(); }, {}));
  } catch (e) {
    showToast("Load failed: " + e.message, "error");
  }
  showLoading(false);
  renderAdmin();
}

function unsubscribeAll() {
  _unsubscribes.forEach(u => { try { u(); } catch (_) {} });
  _unsubscribes = [];
}

function renderAdmin() {
  const app = document.getElementById("app");
  if (!Amal.isAdminUser(Amal.auth.currentUser)) {
    window.location.hash = "";
    return;
  }
  app.innerHTML = `
    <div class="admin-layout">
      ${renderSidebar()}
      <main class="admin-main">
        ${renderAdminView()}
      </main>
    </div>
  `;
}

function renderSidebar() {
  const newCount = _data.orders.filter(o => o.status === "new").length;
  const lowCount = _data.products.filter(p => (p.stock || 0) <= (p.lowThreshold || 3) && (p.stock || 0) > 0).length;
  const shipping = _data.orders.filter(o => ["paid","packed"].includes(o.status)).length;

  const ICONS = {
    dashboard: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    products:  '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
    sales:     '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v4H3zM3 11h18v4H3zM3 19h18v4H3z" transform="scale(1,0.9)"/><path d="M3 3v18M21 3v18"/></svg>',
    finance:   '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 010 7H6"/></svg>',
    inventory: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>',
    delivery:  '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    customers: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
    settings:  '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
  };

  const nav = (key, badge) => `
    <div class="nav-item ${_adminView === key ? 'active' : ''}" onclick="goAdmin('${key}')">
      ${ICONS[key]}
      <span>${t(key)}</span>
      ${badge ? `<span class="nav-badge">${badge}</span>` : ''}
    </div>`;

  return `
    <aside class="sidebar">
      <div class="sidebar-brand"><div class="brand">${t("brand")}</div></div>
      <div class="nav-section-label">${t("overview")}</div>
      ${nav("dashboard")}
      <div class="nav-section-label">${t("sales")}</div>
      ${nav("products")}
      ${nav("sales", newCount || null)}
      ${nav("delivery", shipping || null)}
      <div class="nav-section-label">${t("inventory")}</div>
      ${nav("inventory", lowCount || null)}
      ${nav("finance")}
      <div class="nav-section-label">CRM</div>
      ${nav("customers")}
      ${nav("settings")}
      <div style="padding:18px 22px;margin-top:auto;">
        <button class="btn btn-sm btn-block btn-ghost" onclick="toggleLang();renderAdmin();">${getLang() === "en" ? "العربية" : "English"}</button>
        <button class="btn btn-sm btn-block btn-ghost" style="margin-top:6px;" onclick="adminLogout()">${t("logout")}</button>
      </div>
    </aside>`;
}

function goAdmin(view) {
  _adminView = view;
  _adminSubView = null;
  renderAdmin();
}

function setSub(name) { _adminSubView = name; renderAdmin(); }

async function adminLogout() {
  await Amal.adminLogout();
  unsubscribeAll();
  window.location.hash = "";
}

function renderAdminView() {
  switch (_adminView) {
    case "dashboard": return renderDashboard();
    case "products":  return renderProducts();
    case "sales":     return renderSales();
    case "finance":   return renderFinance();
    case "inventory": return renderInventory();
    case "delivery":  return renderDelivery();
    case "customers": return renderCustomers();
    case "settings":  return renderSettings();
    default: return "";
  }
}

// ============================================
// Dashboard
// ============================================
function renderDashboard() {
  const today = new Date(); today.setHours(0,0,0,0);
  const todayRevenue = _data.orders
    .filter(o => o.createdAt && new Date(o.createdAt.seconds * 1000) >= today && o.status !== "cancelled")
    .reduce((s,o) => s + (o.total || 0), 0);
  const newOrders = _data.orders.filter(o => o.status === "new").length;
  const lowStock = _data.products.filter(p => (p.stock||0) <= (p.lowThreshold||3)).length;

  // last 7 days
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - i);
    const next = new Date(d); next.setDate(d.getDate() + 1);
    const rev = _data.orders.filter(o => o.createdAt && new Date(o.createdAt.seconds * 1000) >= d && new Date(o.createdAt.seconds * 1000) < next && o.status !== "cancelled")
      .reduce((s,o) => s + (o.total||0), 0);
    days.push({ d, rev });
  }
  const maxRev = Math.max(1, ...days.map(x => x.rev));

  // top sellers
  const sellCount = {};
  _data.orders.forEach(o => (o.items || []).forEach(it => {
    sellCount[it.productId] = (sellCount[it.productId] || 0) + Number(it.quantity || 0);
  }));
  const topSellers = Object.entries(sellCount)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pid, qty]) => ({ p: _data.products.find(x => x.id === pid), qty }));

  return `
    ${adminHead(t("dashboard"), fmtDate(new Date()))}
    <div class="kpi-row">
      <div class="kpi"><div class="kpi-label">${t("today_revenue")}</div><div class="kpi-value">${fmtPrice(todayRevenue)}</div></div>
      <div class="kpi"><div class="kpi-label">${t("new_orders")}</div><div class="kpi-value">${newOrders}</div></div>
      <div class="kpi"><div class="kpi-label">${t("low_stock_items")}</div><div class="kpi-value">${lowStock}</div></div>
      <div class="kpi"><div class="kpi-label">${t("total_customers")}</div><div class="kpi-value">${_data.customers.length}</div></div>
    </div>

    <div class="card">
      <h3 style="font-family:'Cormorant Garamond',serif;font-size:22px;margin-bottom:14px;">${t("last_7_days")}</h3>
      <div style="display:flex;align-items:flex-end;gap:10px;height:160px;padding:10px 0;border-bottom:1px solid var(--border-soft);">
        ${days.map(x => `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;">
            <div style="color:var(--gold);font-size:11px;">${x.rev > 0 ? Math.round(x.rev) : ''}</div>
            <div style="width:100%;background:linear-gradient(180deg,var(--gold),var(--gold-dark));height:${(x.rev/maxRev)*120}px;min-height:2px;border-radius:6px 6px 0 0;"></div>
            <div style="color:var(--text-mute);font-size:10px;">${x.d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
          </div>`).join("")}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
      <div class="card">
        <h3 style="font-family:'Cormorant Garamond',serif;font-size:20px;margin-bottom:12px;">${t("recent_orders")}</h3>
        ${_data.orders.slice(0, 5).map(o => `
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-soft);font-size:13px;" onclick="openOrder('${o.id}')">
            <span style="color:var(--gold);font-family:monospace;">${o.code}</span>
            <span>${esc((o.customer && o.customer.name) || "—")}</span>
            <span class="badge badge-${o.status}">${t("s_"+o.status)}</span>
            <span style="color:var(--gold);">${fmtPrice(o.total)}</span>
          </div>`).join("") || emptyHTML()}
      </div>
      <div class="card">
        <h3 style="font-family:'Cormorant Garamond',serif;font-size:20px;margin-bottom:12px;">${t("top_sellers")}</h3>
        ${topSellers.map(({p, qty}) => p ? `
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-soft);font-size:13px;">
            <span>${esc((getLang()==="ar"?p.nameAr:p.nameEn) || p.nameEn)}</span>
            <span class="badge badge-gold">×${qty}</span>
          </div>` : "").join("") || emptyHTML()}
      </div>
    </div>
  `;
}

function adminHead(title, sub) {
  return `<div class="admin-head"><div><h2>${title}</h2><div class="sub">${sub || ""}</div></div></div>`;
}

function emptyHTML() {
  return `<div class="empty"><div class="empty-icon">✦</div><div>${t("no_data")}</div></div>`;
}

// ============================================
// Products
// ============================================
function renderProducts() {
  const stats = {
    total: _data.products.length,
    inStock: _data.products.filter(p => (p.stock||0) > (p.lowThreshold||3)).length,
    low: _data.products.filter(p => (p.stock||0) > 0 && (p.stock||0) <= (p.lowThreshold||3)).length,
    out: _data.products.filter(p => (p.stock||0) <= 0).length,
  };
  return `
    ${adminHead(t("products"), _data.products.length + " items")}
    <div class="kpi-row">
      <div class="kpi"><div class="kpi-label">Total</div><div class="kpi-value">${stats.total}</div></div>
      <div class="kpi"><div class="kpi-label">${t("in_stock")}</div><div class="kpi-value">${stats.inStock}</div></div>
      <div class="kpi"><div class="kpi-label">Low</div><div class="kpi-value" style="color:var(--warning);">${stats.low}</div></div>
      <div class="kpi"><div class="kpi-label">${t("out_of_stock")}</div><div class="kpi-value" style="color:var(--danger);">${stats.out}</div></div>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-bottom:14px;">
      <button class="btn btn-primary" onclick="openProductForm()">+ ${t("add")} ${t("products")}</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>${t("image")}</th><th>${t("name")}</th><th>${t("price")}</th><th>${t("cost")}</th><th>${t("stock")}</th><th>${t("actions")}</th></tr></thead>
        <tbody>
          ${_data.products.map(p => `
            <tr>
              <td><div style="width:48px;height:48px;background:var(--surface-2);border-radius:6px;overflow:hidden;display:flex;align-items:center;justify-content:center;color:var(--gold);">
                ${p.imageURL ? `<img src="${p.imageURL}" style="width:100%;height:100%;object-fit:cover;">` : "ع"}</div></td>
              <td><strong>${esc(p.nameEn || p.nameAr)}</strong><br><span style="color:var(--text-mute);font-size:11px;">${esc(p.nameAr || "")}</span></td>
              <td style="color:var(--gold);">${fmtPrice(p.price)}</td>
              <td>${fmtPrice(p.cost || 0)}</td>
              <td>${(p.stock || 0) <= 0 ? `<span class="badge badge-cancelled">${t("out_of_stock")}</span>` :
                  (p.stock <= (p.lowThreshold||3) ? `<span class="badge badge-packed">${p.stock}</span>` : p.stock)}</td>
              <td>
                <button class="btn btn-sm" onclick="openProductForm('${p.id}')">${t("edit")}</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct('${p.id}')">${t("delete")}</button>
              </td>
            </tr>
          `).join("") || `<tr><td colspan="6">${emptyHTML()}</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function openProductForm(id) {
  const p = id ? _data.products.find(x => x.id === id) : null;
  const isEdit = !!p;
  openModal(`
    <div class="modal-head">
      <h3>${isEdit ? t("edit") : t("add")} ${t("products")}</h3>
      <button class="close-btn" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="form-grid form-grid-2">
        <div class="form-row"><label>${t("name_en")}</label><input id="pf_en" value="${esc(p?.nameEn || "")}"></div>
        <div class="form-row"><label>${t("name_ar")}</label><input id="pf_ar" value="${esc(p?.nameAr || "")}"></div>
      </div>
      <div class="form-grid form-grid-2" style="margin-top:12px;">
        <div class="form-row"><label>${t("desc_en")}</label><textarea id="pf_dEn" rows="2">${esc(p?.descEn || "")}</textarea></div>
        <div class="form-row"><label>${t("desc_ar")}</label><textarea id="pf_dAr" rows="2">${esc(p?.descAr || "")}</textarea></div>
      </div>
      <div class="form-grid form-grid-2" style="margin-top:12px;">
        <div class="form-row"><label>${t("price")}</label><input id="pf_price" type="number" step="0.01" value="${p?.price || ""}"></div>
        <div class="form-row"><label>${t("cost")}</label><input id="pf_cost" type="number" step="0.01" value="${p?.cost || ""}"></div>
      </div>
      <div class="form-grid form-grid-2" style="margin-top:12px;">
        <div class="form-row"><label>${t("stock")}</label><input id="pf_stock" type="number" value="${p?.stock || 0}"></div>
        <div class="form-row"><label>${t("low_threshold")}</label><input id="pf_low" type="number" value="${p?.lowThreshold || 3}"></div>
      </div>
      <div class="form-grid form-grid-2" style="margin-top:12px;">
        <div class="form-row"><label>Sizes (comma)</label><input id="pf_sizes" value="${esc(p?.sizes || "S,M,L,XL")}"></div>
        <div class="form-row"><label>Colors (comma)</label><input id="pf_colors" value="${esc(p?.colors || "Black")}"></div>
      </div>
      <div class="form-row" style="margin-top:12px;">
        <label>${t("image")}</label>
        <div class="upload-zone" onclick="document.getElementById('pf_img').click()" id="pf_imgZone">
          ${p?.imageURL ? `<img src="${p.imageURL}">` : `<div>Click to choose image</div>`}
        </div>
        <input type="file" id="pf_img" accept="image/*" style="display:none;" onchange="onProductImg(event)">
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn" onclick="closeModal()">${t("cancel")}</button>
      <button class="btn btn-primary" id="pfSave" onclick="saveProduct('${id || ''}')">${t("save")}</button>
    </div>
  `);
  window._pfImg = p?.imageURL || null;
  window._pfImgPath = p?.imagePath || null;
  window._pfImgFile = null;
}

async function onProductImg(e) {
  const f = e.target.files[0]; if (!f) return;
  const zone = document.getElementById("pf_imgZone");
  if (zone) zone.innerHTML = `<div class="spinner"></div><div style="margin-top:8px;">Compressing…</div>`;
  try {
    // Compress to base64 data URL that fits inside Firestore (1 MB doc cap)
    const dataURL = await compressImage(f, { maxDim: 1400, maxBytes: 700_000, startQuality: 0.85 });
    window._pfImg = dataURL;
    if (zone) zone.innerHTML = `<img src="${dataURL}">`;
  } catch (err) {
    if (zone) zone.innerHTML = `<div style="color:var(--danger);">Image error: ${err.message}</div>`;
  }
}

async function saveProduct(id) {
  const btn = document.getElementById("pfSave");
  btn.disabled = true; btn.innerHTML = `<span class="spinner"></span>`;
  try {
    // Image is already a compressed base64 data URL on window._pfImg
    const data = {
      nameEn: document.getElementById("pf_en").value.trim(),
      nameAr: document.getElementById("pf_ar").value.trim(),
      descEn: document.getElementById("pf_dEn").value.trim(),
      descAr: document.getElementById("pf_dAr").value.trim(),
      price:  Number(document.getElementById("pf_price").value) || 0,
      cost:   Number(document.getElementById("pf_cost").value) || 0,
      stock:  Number(document.getElementById("pf_stock").value) || 0,
      lowThreshold: Number(document.getElementById("pf_low").value) || 3,
      sizes:  document.getElementById("pf_sizes").value.trim(),
      colors: document.getElementById("pf_colors").value.trim(),
      imageURL: window._pfImg || null
    };

    if (id) await Amal.updateDocById("products", id, data);
    else    await Amal.createDoc("products", data);

    closeModal();
    showToast(t("saved"), "success");
    loadAdmin();
  } catch (e) {
    showToast("Save failed: " + e.message, "error");
    btn.disabled = false; btn.textContent = t("save");
  }
}

async function deleteProduct(id) {
  if (!confirm(t("confirm_delete"))) return;
  try {
    await Amal.deleteDocById("products", id);
    showToast(t("deleted"), "success");
    loadAdmin();
  } catch (e) { showToast("Delete failed: " + e.message, "error"); }
}

// ============================================
// Sales (Orders / Pipeline / By City)
// ============================================
function renderSales() {
  const sub = _adminSubView || "list";
  const tabs = `<div class="tabs">
    <button class="tab ${sub==='list'?'active':''}" onclick="setSub('list')">${t("orders_list")}</button>
    <button class="tab ${sub==='pipeline'?'active':''}" onclick="setSub('pipeline')">${t("pipeline")}</button>
    <button class="tab ${sub==='city'?'active':''}" onclick="setSub('city')">${t("by_city")}</button>
  </div>`;

  let body = "";
  if (sub === "list") body = renderOrdersList();
  else if (sub === "pipeline") body = renderPipeline();
  else if (sub === "city") body = renderByCity();

  return `${adminHead(t("sales"), _data.orders.length + " orders")}${tabs}${body}`;
}

function renderOrdersList() {
  const orders = _data.orders;
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Code</th><th>${t("date")}</th><th>${t("customer")}</th><th>${t("city")}</th><th>${t("items")}</th><th>${t("total")}</th><th>${t("status")}</th><th></th></tr></thead>
        <tbody>
          ${orders.map(o => `
            <tr onclick="openOrder('${o.id}')" style="cursor:pointer;">
              <td style="color:var(--gold);font-family:monospace;">${o.code}</td>
              <td>${o.createdAt ? fmtDate(new Date(o.createdAt.seconds*1000)) : "—"}</td>
              <td>${esc(o.customer?.name || "—")}<br><span style="color:var(--text-mute);font-size:11px;">${esc(o.customer?.whatsapp||"")}</span></td>
              <td>${cityLabel(o.customer?.city)}</td>
              <td>${(o.items||[]).reduce((s,it)=>s+it.quantity,0)}</td>
              <td style="color:var(--gold);">${fmtPrice(o.total)}</td>
              <td><span class="badge badge-${o.status}">${t("s_"+o.status)}</span></td>
              <td><button class="btn btn-sm">→</button></td>
            </tr>`).join("") || `<tr><td colspan="8">${emptyHTML()}</td></tr>`}
        </tbody>
      </table>
    </div>`;
}

function renderPipeline() {
  const cols = ["new","paid","packed","shipped","delivered"];
  return `
    <div class="kanban">
      ${cols.map(st => {
        const items = _data.orders.filter(o => o.status === st);
        return `<div class="column">
          <div class="column-head"><h4>${t("s_"+st)}</h4><span>${items.length}</span></div>
          ${items.map(o => `
            <div class="kanban-card" onclick="openOrder('${o.id}')">
              <div class="code">${o.code}</div>
              <div>${esc(o.customer?.name || "—")}</div>
              <div class="meta">${cityLabel(o.customer?.city)} · ${fmtPrice(o.total)}</div>
            </div>`).join("")}
        </div>`;
      }).join("")}
    </div>`;
}

function renderByCity() {
  const totals = {};
  _data.orders.filter(o => o.status !== "cancelled").forEach(o => {
    const c = o.customer?.city || "Unknown";
    totals[c] = (totals[c] || 0) + (o.total || 0);
  });
  const entries = Object.entries(totals).sort((a,b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map(e => e[1]));
  return `<div class="card">
    ${entries.map(([c, v]) => `
      <div class="bar-row">
        <div class="bar-label">${cityLabel(c)}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${(v/max)*100}%;"></div></div>
        <div class="bar-value">${fmtPrice(v)}</div>
      </div>`).join("") || emptyHTML()}
  </div>`;
}

function openOrder(id) {
  const o = _data.orders.find(x => x.id === id);
  if (!o) return;
  const s = window.AmalSettings || {};
  const waNumber = (o.customer?.whatsapp || "").replace(/[^0-9]/g, "");
  const lang = getLang();
  openModal(`
    <div class="modal-head">
      <h3>${o.code}</h3>
      <button class="close-btn" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
        <div class="card" style="margin:0;">
          <div style="color:var(--gold);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">${t("customer")}</div>
          <div><strong>${esc(o.customer?.name)}</strong></div>
          <div style="color:var(--text-dim);font-size:13px;">${esc(o.customer?.whatsapp)}</div>
          <div style="color:var(--text-dim);font-size:13px;margin-top:4px;">${cityLabel(o.customer?.city)} — ${esc(o.customer?.address)}</div>
          ${o.customer?.notes ? `<div style="color:var(--text-mute);font-size:12px;margin-top:8px;">${esc(o.customer.notes)}</div>` : ""}
        </div>
        <div class="card" style="margin:0;">
          <div style="color:var(--gold);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">${t("status")}</div>
          <select id="ord_status" onchange="updateStatus('${o.id}', this.value)" style="max-width:200px;">
            ${["new","paid","packed","shipped","delivered","cancelled"].map(st => `<option value="${st}" ${o.status===st?'selected':''}>${t("s_"+st)}</option>`).join("")}
          </select>
          ${o.courier ? `<div style="margin-top:10px;color:var(--text-dim);font-size:13px;">${t("courier")}: ${esc(o.courier)} · ${esc(o.trackingNumber||'')}</div>` : ""}
        </div>
      </div>
      <div class="table-wrap" style="margin-bottom:14px;">
        <table>
          <thead><tr><th>${t("items")}</th><th>${t("price")}</th><th>Qty</th><th>${t("total")}</th></tr></thead>
          <tbody>
            ${(o.items||[]).map(it => `
              <tr><td>${esc((lang==="ar"?it.nameAr:it.nameEn) || it.nameEn)} <span style="color:var(--text-mute);font-size:11px;">${esc(it.size||'')} · ${esc(it.color||'')}</span></td>
              <td>${fmtPrice(it.price)}</td><td>${it.quantity}</td><td style="color:var(--gold);">${fmtPrice(it.price*it.quantity)}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div style="display:flex;justify-content:space-between;color:var(--text-dim);font-size:13px;">
        <div>${t("subtotal")}: ${fmtPrice(o.subtotal)} · ${t("shipping")}: ${fmtPrice(o.shippingFee)}</div>
        <div style="color:var(--gold);font-size:18px;font-weight:700;">${t("total")}: ${fmtPrice(o.total)}</div>
      </div>
      ${o.paymentProofURL ? `
        <div class="card" style="margin-top:14px;">
          <div style="color:var(--gold);font-size:11px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">${t("upload_proof")}</div>
          <a href="${o.paymentProofURL}" target="_blank"><img src="${o.paymentProofURL}" style="max-width:100%;max-height:280px;border-radius:8px;"></a>
        </div>` : ""}
    </div>
    <div class="modal-foot">
      <button class="btn btn-danger" onclick="cancelOrderAdmin('${o.id}')">${t("delete")}</button>
      <a class="btn" target="_blank" href="https://wa.me/${waNumber}">${t("contact_whatsapp")}</a>
      <button class="btn" onclick="printInvoice('${o.id}')">${t("print_invoice")}</button>
      <button class="btn btn-primary" onclick="closeModal()">OK</button>
    </div>
  `);
}

async function updateStatus(id, status) {
  try {
    await Amal.updateOrderStatus(id, status);
    showToast(t("saved"), "success");
  } catch (e) { showToast("Failed: " + e.message, "error"); }
}

async function cancelOrderAdmin(id) {
  if (!confirm(t("confirm_delete"))) return;
  try {
    const o = _data.orders.find(x => x.id === id);
    await Amal.cancelOrder(o);
    closeModal();
    showToast(t("deleted"), "success");
    loadAdmin();
  } catch (e) { showToast("Failed: " + e.message, "error"); }
}

function printInvoice(id) {
  const o = _data.orders.find(x => x.id === id);
  if (!o) return;
  const w = window.open("", "_blank");
  const s = window.AmalSettings || {};
  const lang = getLang();
  w.document.write(`
    <html><head><title>Invoice ${o.code}</title>
    <style>body{font-family:Georgia,serif;padding:40px;color:#222;}
    h1{color:#a8841d;letter-spacing:6px;}table{width:100%;border-collapse:collapse;margin:20px 0;}
    th,td{padding:8px;border-bottom:1px solid #aaa;text-align:left;}.tot{font-size:20px;color:#a8841d;}</style></head>
    <body>
    <h1>${s.accountName || "AMAL ABAYA"}</h1>
    <div>${t("invoice")} #${o.code}</div>
    <div>${o.createdAt ? fmtDate(new Date(o.createdAt.seconds*1000)) : ""}</div>
    <hr><h3>${o.customer?.name}</h3>
    <div>${o.customer?.whatsapp}<br>${cityLabel(o.customer?.city)} — ${o.customer?.address}</div>
    <table><tr><th>${t("items")}</th><th>${t("price")}</th><th>Qty</th><th>${t("total")}</th></tr>
    ${(o.items||[]).map(it => `<tr><td>${(lang==="ar"?it.nameAr:it.nameEn) || it.nameEn} (${it.size} · ${it.color})</td><td>${fmtPrice(it.price)}</td><td>${it.quantity}</td><td>${fmtPrice(it.price*it.quantity)}</td></tr>`).join("")}
    </table>
    <div>${t("subtotal")}: ${fmtPrice(o.subtotal)}</div>
    <div>${t("shipping")}: ${fmtPrice(o.shippingFee)}</div>
    <div class="tot"><strong>${t("total")}: ${fmtPrice(o.total)}</strong></div>
    <script>window.print();</script></body></html>`);
  w.document.close();
}

// ============================================
// Finance
// ============================================
function renderFinance() {
  const sub = _adminSubView || "overview";
  const tabs = `<div class="tabs">
    <button class="tab ${sub==='overview'?'active':''}" onclick="setSub('overview')">${t("overview")}</button>
    <button class="tab ${sub==='proofs'?'active':''}" onclick="setSub('proofs')">${t("payment_proofs")}</button>
    <button class="tab ${sub==='exp'?'active':''}" onclick="setSub('exp')">${t("expenses")}</button>
  </div>`;
  let body = "";
  if (sub === "overview") body = renderFinanceOverview();
  else if (sub === "proofs") body = renderProofs();
  else if (sub === "exp") body = renderExpenses();
  return `${adminHead(t("finance"), "")}${tabs}${body}`;
}

function renderFinanceOverview() {
  const settled = _data.orders.filter(o => o.status !== "cancelled");
  const revenue = settled.reduce((s,o) => s + (o.total||0), 0);
  let cogs = 0;
  settled.forEach(o => (o.items||[]).forEach(it => {
    const p = _data.products.find(x => x.id === it.productId);
    if (p) cogs += (Number(p.cost)||0) * Number(it.quantity);
  }));
  const exp = _data.expenses.reduce((s,e) => s + Number(e.amount||0), 0);
  const profit = revenue - cogs - exp;
  const margin = revenue ? (profit / revenue * 100) : 0;
  const max = Math.max(revenue, cogs, exp, Math.abs(profit), 1);

  return `
    <div class="card">
      <div class="bar-row"><div class="bar-label">${t("revenue")}</div><div class="bar-track"><div class="bar-fill" style="width:${revenue/max*100}%;"></div></div><div class="bar-value">${fmtPrice(revenue)}</div></div>
      <div class="bar-row"><div class="bar-label">${t("cogs")}</div><div class="bar-track"><div class="bar-fill" style="width:${cogs/max*100}%;background:linear-gradient(90deg,#dc2626,#ef4444);"></div></div><div class="bar-value">${fmtPrice(cogs)}</div></div>
      <div class="bar-row"><div class="bar-label">${t("expenses")}</div><div class="bar-track"><div class="bar-fill" style="width:${exp/max*100}%;background:linear-gradient(90deg,#a78bfa,#c4b5fd);"></div></div><div class="bar-value">${fmtPrice(exp)}</div></div>
      <div class="bar-row"><div class="bar-label" style="color:var(--gold);font-weight:700;">${t("net_profit")}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.abs(profit)/max*100}%;background:linear-gradient(90deg,#16a34a,#4ade80);"></div></div><div class="bar-value" style="color:${profit>=0?'var(--success)':'var(--danger)'};">${fmtPrice(profit)}</div></div>
    </div>
    <div class="kpi" style="margin-top:14px;text-align:center;">
      <div class="kpi-label">${t("margin")}</div>
      <div class="kpi-value">${margin.toFixed(1)}%</div>
    </div>`;
}

function renderProofs() {
  const ordersWithProofs = _data.orders.filter(o => o.paymentProofURL);
  return `<div class="card">
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;">
      ${ordersWithProofs.map(o => `
        <div style="background:var(--surface-2);border:1px solid var(--border-soft);border-radius:8px;overflow:hidden;cursor:pointer;" onclick="openOrder('${o.id}')">
          <img src="${o.paymentProofURL}" style="width:100%;height:160px;object-fit:cover;">
          <div style="padding:8px;font-size:12px;">
            <div style="color:var(--gold);font-family:monospace;">${o.code}</div>
            <div style="color:var(--text-mute);">${esc(o.customer?.name||'')}</div>
          </div>
        </div>`).join("") || emptyHTML()}
    </div>
  </div>`;
}

function renderExpenses() {
  const total = _data.expenses.reduce((s,e) => s + Number(e.amount||0), 0);
  return `
    <div style="display:flex;justify-content:space-between;margin-bottom:14px;">
      <div class="kpi" style="margin:0;flex:1;max-width:260px;"><div class="kpi-label">${t("expenses")}</div><div class="kpi-value">${fmtPrice(total)}</div></div>
      <button class="btn btn-primary" onclick="openExpenseForm()">+ ${t("add")}</button>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>${t("date")}</th><th>Category</th><th>${t("description")}</th><th>Amount</th><th></th></tr></thead>
      <tbody>${_data.expenses.map(e => `
        <tr>
          <td>${e.createdAt?fmtDate(new Date(e.createdAt.seconds*1000)):'—'}</td>
          <td><span class="badge badge-gold">${esc(e.category||'-')}</span></td>
          <td>${esc(e.description||'')}</td>
          <td style="color:var(--gold);">${fmtPrice(e.amount)}</td>
          <td><button class="btn btn-sm btn-danger" onclick="deleteExpense('${e.id}')">×</button></td>
        </tr>`).join("") || `<tr><td colspan="5">${emptyHTML()}</td></tr>`}
      </tbody>
    </table></div>`;
}

function openExpenseForm() {
  const cats = ["Marketing","Raw Materials","Salaries","Rent","Utilities","Other"];
  openModal(`
    <div class="modal-head"><h3>${t("add")} ${t("expenses")}</h3><button class="close-btn" onclick="closeModal()">×</button></div>
    <div class="modal-body">
      <div class="form-grid">
        <div class="form-row"><label>Category</label><select id="ex_cat">${cats.map(c=>`<option>${c}</option>`).join("")}</select></div>
        <div class="form-row"><label>${t("description")}</label><input id="ex_desc"></div>
        <div class="form-row"><label>Amount</label><input id="ex_amt" type="number" step="0.01"></div>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn" onclick="closeModal()">${t("cancel")}</button>
      <button class="btn btn-primary" onclick="saveExpense()">${t("save")}</button>
    </div>`);
}

async function saveExpense() {
  try {
    await Amal.createDoc("expenses", {
      category: document.getElementById("ex_cat").value,
      description: document.getElementById("ex_desc").value.trim(),
      amount: Number(document.getElementById("ex_amt").value) || 0
    });
    closeModal();
    showToast(t("saved"), "success");
    loadAdmin();
  } catch (e) { showToast("Failed: " + e.message, "error"); }
}
async function deleteExpense(id) {
  if (!confirm(t("confirm_delete"))) return;
  await Amal.deleteDocById("expenses", id);
  loadAdmin();
}

// ============================================
// Inventory
// ============================================
function renderInventory() {
  const sub = _adminSubView || "stock";
  const tabs = `<div class="tabs">
    <button class="tab ${sub==='stock'?'active':''}" onclick="setSub('stock')">${t("stock_levels")}</button>
    <button class="tab ${sub==='alerts'?'active':''}" onclick="setSub('alerts')">${t("alerts")}</button>
    <button class="tab ${sub==='mov'?'active':''}" onclick="setSub('mov')">${t("movements")}</button>
  </div>`;
  let body = "";
  if (sub === "stock") body = renderStockLevels();
  else if (sub === "alerts") body = renderAlerts();
  else if (sub === "mov") body = renderMovements();
  return `${adminHead(t("inventory"), "")}${tabs}${body}`;
}

function renderStockLevels() {
  const totalValue = _data.products.reduce((s,p) => s + (Number(p.cost)||0) * (Number(p.stock)||0), 0);
  return `
    <div class="kpi" style="margin-bottom:14px;text-align:center;max-width:320px;">
      <div class="kpi-label">Total Stock Value (at cost)</div>
      <div class="kpi-value">${fmtPrice(totalValue)}</div>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>${t("name")}</th><th>${t("stock")}</th><th>${t("cost")}</th><th>${t("price")}</th><th>Value</th></tr></thead>
      <tbody>${_data.products.map(p => `
        <tr><td>${esc(p.nameEn||p.nameAr)}</td><td>${p.stock||0}</td><td>${fmtPrice(p.cost||0)}</td>
        <td>${fmtPrice(p.price)}</td><td style="color:var(--gold);">${fmtPrice((p.cost||0)*(p.stock||0))}</td></tr>`).join("") || `<tr><td colspan="5">${emptyHTML()}</td></tr>`}
      </tbody>
    </table></div>`;
}

function renderAlerts() {
  const out = _data.products.filter(p => (p.stock||0) <= 0);
  const low = _data.products.filter(p => (p.stock||0) > 0 && (p.stock||0) <= (p.lowThreshold||3));
  return `
    <div class="card">
      <h3 style="font-family:'Cormorant Garamond',serif;color:var(--danger);margin-bottom:12px;">${t("out_of_stock")} (${out.length})</h3>
      ${out.map(p => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-soft);">
        <span>${esc(p.nameEn||p.nameAr)}</span>
        <button class="btn btn-sm" onclick="quickRestock('${p.id}')">${t("add")} +</button>
      </div>`).join("") || "<div style='color:var(--text-mute);'>All good</div>"}
    </div>
    <div class="card">
      <h3 style="font-family:'Cormorant Garamond',serif;color:var(--warning);margin-bottom:12px;">${t("low_stock_items")} (${low.length})</h3>
      ${low.map(p => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-soft);">
        <span>${esc(p.nameEn||p.nameAr)} <span style="color:var(--text-mute);font-size:12px;">(${p.stock} left)</span></span>
        <button class="btn btn-sm" onclick="quickRestock('${p.id}')">${t("add")} +</button>
      </div>`).join("") || "<div style='color:var(--text-mute);'>All good</div>"}
    </div>`;
}

async function quickRestock(id) {
  const qty = prompt("How many units to add?", "10");
  if (!qty) return;
  const n = parseInt(qty);
  if (!n) return;
  const p = _data.products.find(x => x.id === id);
  try {
    await Amal.updateDocById("products", id, { stock: (p.stock||0) + n });
    await Amal.logMovement(id, "IN", n, "Manual restock", null);
    showToast(t("saved"), "success");
    loadAdmin();
  } catch (e) { showToast("Failed: " + e.message, "error"); }
}

function renderMovements() {
  return `<div class="table-wrap"><table>
    <thead><tr><th>${t("date")}</th><th>Product</th><th>Type</th><th>Qty</th><th>Reason</th></tr></thead>
    <tbody>${_data.movements.map(m => {
      const p = _data.products.find(x => x.id === m.productId);
      return `<tr>
        <td>${m.createdAt?fmtDate(new Date(m.createdAt.seconds*1000)):'—'}</td>
        <td>${p?esc(p.nameEn||p.nameAr):"(deleted)"}</td>
        <td><span class="badge badge-${m.type==='IN'?'paid':(m.type==='OUT'?'cancelled':'gold')}">${m.type}</span></td>
        <td>${m.qty}</td><td style="color:var(--text-mute);">${esc(m.reason)}</td></tr>`;
    }).join("") || `<tr><td colspan="5">${emptyHTML()}</td></tr>`}
    </tbody></table></div>`;
}

// ============================================
// Delivery
// ============================================
function renderDelivery() {
  const sub = _adminSubView || "active";
  const tabs = `<div class="tabs">
    <button class="tab ${sub==='active'?'active':''}" onclick="setSub('active')">${t("active_shipments")}</button>
    <button class="tab ${sub==='zone'?'active':''}" onclick="setSub('zone')">${t("by_zone")}</button>
    <button class="tab ${sub==='cour'?'active':''}" onclick="setSub('cour')">${t("couriers")}</button>
  </div>`;
  let body = "";
  if (sub === "active") body = renderShipments();
  else if (sub === "zone") body = renderShipmentsByZone();
  else if (sub === "cour") body = renderCouriers();
  return `${adminHead(t("delivery"), "")}${tabs}${body}`;
}

function renderShipments() {
  const cols = ["paid","packed","shipped"];
  return `<div class="kanban" style="grid-template-columns:repeat(3,1fr);">
    ${cols.map(st => {
      const items = _data.orders.filter(o => o.status === st);
      return `<div class="column">
        <div class="column-head"><h4>${t("s_"+st)}</h4><span>${items.length}</span></div>
        ${items.map(o => `<div class="kanban-card" onclick="openOrder('${o.id}')">
          <div class="code">${o.code}</div>
          <div>${esc(o.customer?.name||'')}</div>
          <div class="meta">${cityLabel(o.customer?.city)}</div>
          ${o.courier ? `<div class="meta" style="color:var(--gold);">${esc(o.courier)} · ${esc(o.trackingNumber||'')}</div>` : ""}
          ${st === "paid" ? `<button class="btn btn-sm" style="margin-top:6px;width:100%;" onclick="event.stopPropagation();assignCourier('${o.id}')">${t("assign")}</button>` : ""}
        </div>`).join("")}
      </div>`;
    }).join("")}
  </div>`;
}

function assignCourier(orderId) {
  const couriers = _data.couriers;
  openModal(`
    <div class="modal-head"><h3>${t("assign")} ${t("courier")}</h3><button class="close-btn" onclick="closeModal()">×</button></div>
    <div class="modal-body"><div class="form-grid">
      <div class="form-row"><label>${t("courier")}</label>
        <select id="ac_c">${couriers.map(c=>`<option>${esc(c.name)}</option>`).join("") || '<option>Aramex</option>'}</select>
      </div>
      <div class="form-row"><label>${t("tracking_number")}</label><input id="ac_tn"></div>
    </div></div>
    <div class="modal-foot">
      <button class="btn" onclick="closeModal()">${t("cancel")}</button>
      <button class="btn btn-primary" onclick="doAssign('${orderId}')">${t("save")}</button>
    </div>`);
}

async function doAssign(orderId) {
  try {
    await Amal.updateOrderStatus(orderId, "packed", {
      courier: document.getElementById("ac_c").value,
      trackingNumber: document.getElementById("ac_tn").value.trim()
    });
    closeModal();
    showToast(t("saved"), "success");
  } catch (e) { showToast("Failed: " + e.message, "error"); }
}

function renderShipmentsByZone() {
  const totals = {};
  _data.orders.filter(o => ["paid","packed","shipped","delivered"].includes(o.status)).forEach(o => {
    const c = o.customer?.city || "Unknown";
    totals[c] = (totals[c] || 0) + 1;
  });
  const entries = Object.entries(totals).sort((a,b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map(e => e[1]));
  return `<div class="card">
    ${entries.map(([c, n]) => `
      <div class="bar-row">
        <div class="bar-label">${cityLabel(c)}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${(n/max)*100}%;"></div></div>
        <div class="bar-value">${n}</div>
      </div>`).join("") || emptyHTML()}
  </div>`;
}

function renderCouriers() {
  return `
    <div style="display:flex;justify-content:flex-end;margin-bottom:14px;">
      <button class="btn btn-primary" onclick="openCourierForm()">+ ${t("add")}</button>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>${t("name")}</th><th>Phone</th><th>Active shipments</th><th></th></tr></thead>
      <tbody>${_data.couriers.map(c => {
        const n = _data.orders.filter(o => o.courier === c.name && ["packed","shipped"].includes(o.status)).length;
        return `<tr><td>${esc(c.name)}</td><td>${esc(c.phone||'')}</td><td><span class="badge badge-gold">${n}</span></td>
        <td><button class="btn btn-sm btn-danger" onclick="deleteCourier('${c.id}')">×</button></td></tr>`;
      }).join("") || `<tr><td colspan="4">${emptyHTML()}</td></tr>`}
      </tbody>
    </table></div>`;
}

function openCourierForm() {
  openModal(`
    <div class="modal-head"><h3>${t("add")} ${t("courier")}</h3><button class="close-btn" onclick="closeModal()">×</button></div>
    <div class="modal-body"><div class="form-grid">
      <div class="form-row"><label>${t("name")}</label><input id="cf_n"></div>
      <div class="form-row"><label>Phone</label><input id="cf_p"></div>
    </div></div>
    <div class="modal-foot">
      <button class="btn" onclick="closeModal()">${t("cancel")}</button>
      <button class="btn btn-primary" onclick="saveCourier()">${t("save")}</button>
    </div>`);
}
async function saveCourier() {
  await Amal.createDoc("couriers", {
    name: document.getElementById("cf_n").value.trim(),
    phone: document.getElementById("cf_p").value.trim()
  });
  closeModal(); loadAdmin();
}
async function deleteCourier(id) {
  if (!confirm(t("confirm_delete"))) return;
  await Amal.deleteDocById("couriers", id);
  loadAdmin();
}

// ============================================
// Customers
// ============================================
function renderCustomers() {
  return `${adminHead(t("customers"), _data.customers.length + "")}
    <div class="table-wrap"><table>
      <thead><tr><th>${t("name")}</th><th>${t("whatsapp")}</th><th>${t("city")}</th><th>Orders</th><th>${t("lifetime_value")}</th><th></th></tr></thead>
      <tbody>${_data.customers.map(c => `
        <tr><td><strong>${esc(c.name||'—')}</strong>${(c.orderCount||0)>=3?` <span class="badge badge-gold">${t("vip")}</span>`:''}</td>
        <td>${esc(c.whatsapp||'')}</td><td>${cityLabel(c.city)}</td>
        <td>${c.orderCount||0}</td><td style="color:var(--gold);">${fmtPrice(c.lifetimeSpend||0)}</td>
        <td><a class="btn btn-sm" target="_blank" href="https://wa.me/${(c.whatsapp||'').replace(/[^0-9]/g,'')}">WA</a></td></tr>`).join("") || `<tr><td colspan="6">${emptyHTML()}</td></tr>`}
      </tbody>
    </table></div>`;
}

// ============================================
// Settings
// ============================================
function renderSettings() {
  const s = _data.settings || {};
  return `${adminHead(t("settings"), "")}
    <div class="card">
      <h3 style="font-family:'Cormorant Garamond',serif;margin-bottom:14px;">${t("business")}</h3>
      <div class="form-grid form-grid-2">
        <div class="form-row"><label>Collection Tag</label><input id="set_tag" value="${esc(s.collectionTag||'')}"></div>
        <div class="form-row"><label>${t("instagram_handle")}</label><input id="set_ig" value="${esc(s.instagram||'')}"></div>
        <div class="form-row"><label>${t("whatsapp")}</label><input id="set_wa" value="${esc(s.whatsapp||'')}"></div>
        <div class="form-row"><label>${t("shipping_fee")}</label><input id="set_ship" type="number" value="${s.shippingFee||25}"></div>
        <div class="form-row"><label>${t("currency")}</label><input id="set_cur" value="${esc(s.currency||'₪')}"></div>
        <div class="form-row"><label>Admin email</label><input id="set_email" value="${esc(s.adminEmail||'')}"></div>
      </div>
    </div>
    <div class="card">
      <h3 style="font-family:'Cormorant Garamond',serif;margin-bottom:14px;">${t("bank_details")}</h3>
      <div class="form-grid form-grid-2">
        <div class="form-row"><label>${t("bank_name")}</label><input id="set_bank" value="${esc(s.bankName||'')}"></div>
        <div class="form-row"><label>${t("account_name")}</label><input id="set_acc" value="${esc(s.accountName||'')}"></div>
      </div>
      <div class="form-row" style="margin-top:12px;"><label>${t("iban")}</label><input id="set_iban" value="${esc(s.iban||'')}"></div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;">
      <button class="btn btn-primary" onclick="saveSettings()">${t("save")}</button>
    </div>`;
}

async function saveSettings() {
  try {
    const data = {
      collectionTag: document.getElementById("set_tag").value,
      instagram: document.getElementById("set_ig").value,
      whatsapp: document.getElementById("set_wa").value,
      shippingFee: Number(document.getElementById("set_ship").value) || 0,
      currency: document.getElementById("set_cur").value,
      adminEmail: document.getElementById("set_email").value,
      bankName: document.getElementById("set_bank").value,
      accountName: document.getElementById("set_acc").value,
      iban: document.getElementById("set_iban").value
    };
    await Amal.saveSettings(data);
    window.AmalSettings = { ...window.AmalSettings, ...data };
    showToast(t("saved"), "success");
  } catch (e) { showToast("Failed: " + e.message, "error"); }
}

// Expose globals
window.loadAdmin = loadAdmin;
window.renderAdmin = renderAdmin;
window.goAdmin = goAdmin;
window.setSub = setSub;
window.adminLogout = adminLogout;
window.openProductForm = openProductForm;
window.onProductImg = onProductImg;
window.saveProduct = saveProduct;
window.deleteProduct = deleteProduct;
window.openOrder = openOrder;
window.updateStatus = updateStatus;
window.cancelOrderAdmin = cancelOrderAdmin;
window.printInvoice = printInvoice;
window.openExpenseForm = openExpenseForm;
window.saveExpense = saveExpense;
window.deleteExpense = deleteExpense;
window.quickRestock = quickRestock;
window.assignCourier = assignCourier;
window.doAssign = doAssign;
window.openCourierForm = openCourierForm;
window.saveCourier = saveCourier;
window.deleteCourier = deleteCourier;
window.saveSettings = saveSettings;
