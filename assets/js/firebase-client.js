// ============================================
// AMAL ABAYA — Firebase client (modular SDK)
// ============================================
// This module bootstraps Firebase using CDN modules and exposes
// a simple API used by storefront.js and admin.js.
// ============================================

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, addDoc, setDoc,
  updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot,
  serverTimestamp, increment
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import {
  getAuth, signInAnonymously, signInWithEmailAndPassword,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// firebase-config.js sets window.FIREBASE_CONFIG before this module loads.
const firebaseConfig = window.FIREBASE_CONFIG;
if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("PASTE")) {
  console.error("[AMAL ABAYA] firebase-config.js is missing or contains placeholder values.");
  document.body.innerHTML = `
    <div style="padding:40px;font-family:system-ui;color:#d4af37;background:#0a0a0a;min-height:100vh;">
      <h2>Firebase not configured</h2>
      <p style="color:#a8a195;margin-top:12px;">
        Copy <code>assets/js/firebase-config.example.js</code> to
        <code>assets/js/firebase-config.js</code> and paste your Firebase project's
        web app config. See <code>README.md</code> for setup instructions.
      </p>
    </div>`;
  throw new Error("Firebase config missing");
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// ---------- Auth helpers ----------
async function ensureAnonSignedIn() {
  if (!auth.currentUser) {
    try { await signInAnonymously(auth); }
    catch (e) { console.warn("Anonymous sign-in failed:", e.message); }
  }
}

async function adminLogin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

async function adminLogout() {
  return signOut(auth);
}

function isAdminUser(user) {
  return !!(user && user.email && !user.isAnonymous);
}

// ---------- Generic Firestore wrappers ----------
async function fetchAll(coll, opts = {}) {
  const cs = [collection(db, coll)];
  let q = collection(db, coll);
  if (opts.where) q = query(q, where(opts.where[0], opts.where[1], opts.where[2]));
  if (opts.orderBy) q = query(q, orderBy(opts.orderBy[0], opts.orderBy[1] || "asc"));
  if (opts.limit) q = query(q, limit(opts.limit));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function fetchOne(coll, id) {
  const snap = await getDoc(doc(db, coll, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

async function createDoc(coll, data) {
  const payload = { ...data, createdAt: serverTimestamp() };
  const res = await addDoc(collection(db, coll), payload);
  return res.id;
}

async function setNamedDoc(coll, id, data) {
  await setDoc(doc(db, coll, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
  return id;
}

async function updateDocById(coll, id, data) {
  await updateDoc(doc(db, coll, id), { ...data, updatedAt: serverTimestamp() });
}

async function deleteDocById(coll, id) {
  await deleteDoc(doc(db, coll, id));
}

function subscribe(coll, callback, opts = {}) {
  let q = collection(db, coll);
  if (opts.orderBy) q = query(q, orderBy(opts.orderBy[0], opts.orderBy[1] || "asc"));
  if (opts.limit) q = query(q, limit(opts.limit));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, err => console.warn("subscribe error:", err.message));
}

// ---------- Storage helpers ----------
async function uploadImage(path, file) {
  const r = ref(storage, path);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}

async function deleteImage(path) {
  try { await deleteObject(ref(storage, path)); }
  catch (e) { /* swallow not-found */ }
}

// ---------- Settings (single doc) ----------
const SETTINGS_DOC_ID = "main";
const DEFAULT_SETTINGS = {
  bankName: "Bank of Palestine",
  accountName: "AMAL ABAYA",
  iban: "PS00 0000 0000 0000 0000 0000 0000",
  whatsapp: "970599000000",
  instagram: "@amalabaya",
  shippingFee: 25,
  currency: "₪",
  adminEmail: "admin@amal-abaya.local",
  collectionTag: "SS 2026"
};

async function getSettings() {
  const s = await fetchOne("settings", SETTINGS_DOC_ID);
  return { ...DEFAULT_SETTINGS, ...(s || {}) };
}
async function saveSettings(data) {
  return setNamedDoc("settings", SETTINGS_DOC_ID, data);
}

// ---------- Inventory movements ----------
async function logMovement(productId, type, qty, reason, orderId) {
  await createDoc("movements", {
    productId, type, qty: Number(qty) || 0, reason: reason || "", orderId: orderId || null
  });
}

// ---------- Place order (atomic-ish for static site) ----------
async function placeOrder({ customer, items, shippingFee, paymentProofURL, paymentProofPath, notes }) {
  // 1. Generate order code
  const code = "AMA-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  // 2. Build totals
  const subtotal = items.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0);
  const total = subtotal + Number(shippingFee || 0);

  // 3. Create order doc
  const orderId = await createDoc("orders", {
    code,
    customer,
    items,
    subtotal,
    shippingFee: Number(shippingFee) || 0,
    total,
    status: "new",
    paymentProofURL: paymentProofURL || null,
    paymentProofPath: paymentProofPath || null,
    notes: notes || "",
    courier: null,
    trackingNumber: null
  });

  // 4. Upsert customer (one doc per whatsapp number)
  if (customer && customer.whatsapp) {
    const existing = await fetchAll("customers", { where: ["whatsapp", "==", customer.whatsapp] });
    if (existing.length) {
      const c = existing[0];
      await updateDocById("customers", c.id, {
        name: customer.name || c.name,
        city: customer.city || c.city,
        address: customer.address || c.address,
        orderCount: (c.orderCount || 0) + 1,
        lifetimeSpend: (c.lifetimeSpend || 0) + total,
        lastOrderAt: new Date().toISOString()
      });
    } else {
      await createDoc("customers", {
        ...customer,
        orderCount: 1,
        lifetimeSpend: total,
        lastOrderAt: new Date().toISOString()
      });
    }
  }

  // 5. Decrement stock + log movements (best-effort; not transactional)
  for (const it of items) {
    try {
      await updateDoc(doc(db, "products", it.productId), {
        stock: increment(-Number(it.quantity))
      });
      await logMovement(it.productId, "OUT", it.quantity, "Order " + code, orderId);
    } catch (e) {
      console.warn("Stock decrement failed for", it.productId, e.message);
    }
  }

  return { orderId, code, total };
}

// ---------- Update order status (admin) ----------
async function updateOrderStatus(orderId, newStatus, extra = {}) {
  await updateDocById("orders", orderId, { status: newStatus, ...extra });
}

// ---------- Cancel order (restore stock) ----------
async function cancelOrder(order) {
  for (const it of (order.items || [])) {
    try {
      await updateDoc(doc(db, "products", it.productId), {
        stock: increment(Number(it.quantity))
      });
      await logMovement(it.productId, "IN", it.quantity, "Cancelled " + order.code, order.id);
    } catch (e) { /* skip */ }
  }
  await updateOrderStatus(order.id, "cancelled");
}

// Expose API on window
window.Amal = {
  // auth
  ensureAnonSignedIn, adminLogin, adminLogout, isAdminUser, onAuthStateChanged: (cb) => onAuthStateChanged(auth, cb), auth,
  // generic
  fetchAll, fetchOne, createDoc, setNamedDoc, updateDocById, deleteDocById, subscribe,
  // storage
  uploadImage, deleteImage,
  // domain
  getSettings, saveSettings, placeOrder, updateOrderStatus, cancelOrder, logMovement,
  // raw
  db, storage,
  serverTimestamp, increment
};

// Auto sign-in anonymously so customers can place orders without friction.
ensureAnonSignedIn();
