// ============================================
// AMAL ABAYA — App router (hash-based)
// ============================================

setLang(getLang());

window.renderCurrentView = function () {
  if (window.location.hash === "#admin" && Amal.isAdminUser(Amal.auth.currentUser)) {
    renderAdmin();
  } else {
    renderStorefront();
  }
};

Amal.onAuthStateChanged(user => {
  if (window.location.hash === "#admin") {
    if (Amal.isAdminUser(user)) loadAdmin();
    else {
      window.location.hash = "";
      loadStorefront();
    }
  } else {
    loadStorefront();
  }
});

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#admin" && Amal.isAdminUser(Amal.auth.currentUser)) {
    loadAdmin();
  } else {
    loadStorefront();
  }
});
