// ============================================
// AMAL ABAYA — App router (hash-based)
// ============================================

console.log("[AMAL] app.js starting. Amal global:", !!window.Amal);
setLang(getLang());

window.renderCurrentView = function () {
  if (window.location.hash === "#admin" && Amal.isAdminUser(Amal.auth.currentUser)) {
    renderAdmin();
  } else {
    renderStorefront();
  }
};

// Safety: if Firebase never resolves an auth state within 4s,
// render the empty storefront anyway so the page isn't blank.
let _routerFired = false;
function route() {
  if (_routerFired) return;
  _routerFired = true;
  console.log("[AMAL] router firing. Hash:", window.location.hash, "Admin:", Amal.isAdminUser(Amal.auth.currentUser));
  if (window.location.hash === "#admin" && Amal.isAdminUser(Amal.auth.currentUser)) {
    loadAdmin();
  } else {
    loadStorefront();
  }
}

if (window.Amal) {
  Amal.onAuthStateChanged(user => {
    console.log("[AMAL] auth state:", user ? (user.isAnonymous ? "anon" : "admin:" + user.email) : "none");
    _routerFired = false;
    route();
  });
} else {
  console.error("[AMAL] window.Amal not defined — firebase-client.js failed to init.");
  loadStorefront();
}

// Failsafe: render something within 4 seconds no matter what
setTimeout(() => {
  if (!_routerFired) {
    console.warn("[AMAL] auth state never resolved — rendering storefront anyway.");
    route();
  }
}, 4000);

window.addEventListener("hashchange", () => {
  _routerFired = false;
  route();
});
