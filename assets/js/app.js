// ============================================
// AMAL ABAYA — App router (hash-based)
// ============================================
console.log("[AMAL] app.js starting. Amal global:", !!window.Amal);
setLang(getLang());

window.renderCurrentView = function () {
  if (window.location.hash === "#admin") renderAdmin();
  else renderStorefront();
};

let _routerFired = false;
function route() {
  if (_routerFired) return;
  _routerFired = true;
  console.log("[AMAL] router firing. Hash:", window.location.hash);
  // Admin route ALWAYS loads loadAdmin — it shows login if user isn't signed in
  if (window.location.hash === "#admin") loadAdmin();
  else loadStorefront();
}

if (window.Amal) {
  Amal.onAuthStateChanged(user => {
    console.log("[AMAL] auth:", user ? (user.isAnonymous?"anon":"admin:"+user.email) : "none");
    _routerFired = false;
    route();
  });
} else {
  console.error("[AMAL] window.Amal not defined");
  loadStorefront();
}
setTimeout(() => { if (!_routerFired) { console.warn("[AMAL] auth never resolved"); route(); } }, 4000);
window.addEventListener("hashchange", () => { _routerFired = false; route(); });
