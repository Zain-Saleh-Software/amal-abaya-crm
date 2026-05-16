// ============================================
// عبايات أمل — i18n + Gaza cities + categories
// ============================================

const TRANSLATIONS = {
  ar: {
    // Brand
    brand:              "عبايات أمل",
    brand_sub:          "AMAL ABAYAS",
    tagline:            "عبايات وأكثر",

    // Promo strip
    promo:              "✦  شحن مجاني داخل غزة على الطلبات فوق ٢٠٠ ₪  ✦",

    // Header / Nav
    nav_home:           "الرئيسية",
    nav_collection:     "المجموعة",
    nav_categories:     "التصنيفات",
    nav_about:          "عنّا",
    nav_contact:        "تواصلي معنا",

    cart:               "سلّتك",
    cart_label:         "عربة التسوق",
    cart_empty:         "سلّتك فارغة",
    cart_empty_sub:     "اكتشفي مجموعتنا وأضيفي ما يعجبك",
    subtotal:           "المجموع الفرعي",
    shipping:           "الشحن",
    shipping_free:      "مجاني",
    total:              "المجموع",
    checkout:           "إتمام الشراء",
    continue_shopping:  "متابعة التسوق",

    // Hero
    hero_eyebrow:       "AMAL ABAYAS  •  عبايات أمل",
    hero_title:         "عبايات وأكثر تجدينها لدى",
    hero_title_gold:    "عبايات أمل",
    hero_sub:           "عبايات صُمّمت واختيرت بعناية من الإمارات، لتصل إليكِ في غزة.",
    shop_now:           "تسوّقي الآن",
    contact_us:         "تواصلي معنا",

    // Categories
    cats_title:         "تصنيفاتنا",
    cats_sub:           "اختاري نوع العباية التي تناسب يومك",
    cat_all:            "الكل",
    cat_practical:      "عبايات عملية",
    cat_practical_sub:  "ليومك المريح",
    cat_occasion:       "عبايات مناسبات",
    cat_occasion_sub:   "تألّقي بأناقة",
    cat_black:          "عبايات سوداء",
    cat_black_sub:      "الكلاسيكية الأبدية",
    cat_open:           "عبايات مفتوحة",
    cat_open_sub:       "أناقة عصرية",

    // Collection
    collection_title:   "مجموعتنا المختارة",
    collection_sub:     "قطع منتقاة بعناية، جاهزة للشحن في غزة",

    // Product card
    in_stock:           "متوفر",
    low_stock:          "آخر القطع",
    out_of_stock:       "نفد المخزون",

    // Product detail
    pd_color:           "اللون",
    pd_size:            "المقاس",
    pd_qty:             "الكمية",
    add_to_cart:        "أضيفي للسلة",
    pd_pick_color:      "اختاري اللون أولاً",
    pd_pick_size:       "اختاري المقاس أولاً",
    added:              "تمّت الإضافة للسلة",

    // Checkout
    checkout_title:     "إتمام الطلب",
    name:               "الاسم الكامل",
    whatsapp:           "رقم واتساب",
    phone:              "رقم الهاتف",
    city:               "المدينة",
    address:            "العنوان التفصيلي",
    notes:              "ملاحظات (اختياري)",
    pay_method:         "طريقة الدفع",
    pay_cod:            "الدفع عند الاستلام",
    pay_bank:           "تحويل بنكي",
    place_order:        "أكّدي الطلب",
    order_placed:       "تمّ تأكيد طلبك! سنتواصل معكِ قريباً عبر واتساب",
    fill_required:      "الرجاء تعبئة الحقول المطلوبة",
    select_city:        "— اختاري المدينة —",
    bank_info_title:    "معلومات الحساب البنكي",

    // Promise
    promise_ship_t:     "شحن سريع",
    promise_ship_s:     "خلال ٢٤–٤٨ ساعة في غزة",
    promise_qual_t:     "جودة مضمونة",
    promise_qual_s:     "أقمشة فاخرة وتشطيب احترافي",
    promise_wa_t:       "خدمة واتساب",
    promise_wa_s:       "نحن معكِ في أي وقت",

    // About
    about_eyebrow:      "قصتنا",
    about_title:        "عبايات صُمّمت بعناية، لكِ",
    about_lead:         "عبايات أمل علامة مختصة بانتقاء عبايات أنيقة من الإمارات وإيصالها إلى كل بيت في غزة.",
    about_p1:           "نختار كل قطعة بعين الخبير: أقمشة فاخرة، خياطة دقيقة، وتصاميم تواكب أحدث صيحات الموضة المحتشمة.",
    about_p2:           "هدفنا أن تجدي العباية المثالية لكل مناسبة — اليومية، الزيارات، الأعراس، والسفر — دون أن تغادري بيتك.",

    // Contact
    contact_title:      "تواصلي معنا",
    contact_sub:        "نحن هنا للإجابة على كل أسئلتك",
    contact_phone:      "الهاتف",
    contact_wa:         "واتساب",
    contact_ig:         "إنستغرام",
    contact_addr:       "العنوان",

    // Footer
    footer_about:       "عبايات أمل — عبايات وأكثر، نوصلها لكِ في غزة بأناقة ودقّة.",
    footer_quick:       "روابط سريعة",
    footer_legal:       "معلومات",
    footer_rights:      "© عبايات أمل ٢٠٢٦ · جميع الحقوق محفوظة",

    // Generic
    save:               "حفظ",
    cancel:             "إلغاء",
    close:              "إغلاق",
    confirm:            "تأكيد",
    edit:               "تعديل",
    delete:             "حذف",
    remove:             "حذف",
    add:                "إضافة",
    loading:            "جارٍ التحميل…",
    no_data:            "لا توجد بيانات",
    error_generic:      "حدث خطأ. حاولي مرة أخرى.",

    // Admin (used internally — pearl theme)
    admin_title:        "لوحة عبايات أمل",
    nav_dashboard:      "لوحة القيادة",
    nav_products:       "المنتجات",
    nav_inventory:      "المخزون",
    nav_orders:         "الطلبات",
    nav_delivery:       "التوصيل",
    nav_customers:      "العملاء",
    nav_settings:       "الإعدادات",
    logout:             "تسجيل خروج",

    stat_orders_today:  "طلبات اليوم",
    stat_sales_today:   "مبيعات اليوم",
    stat_products:      "إجمالي المنتجات",
    stat_low_stock:     "تنبيه مخزون",

    status_processing:  "قيد المعالجة",
    status_shipped:     "تم الشحن",
    status_delivered:   "تم التوصيل",
    status_cancelled:   "ملغي",

    products_title:     "المنتجات",
    add_product:        "+ إضافة منتج",
    name_en:            "الاسم (إنجليزي)",
    name_ar:            "الاسم (عربي)",
    desc_en:            "الوصف (إنجليزي)",
    desc_ar:            "الوصف (عربي)",
    price:              "السعر",
    cost:               "التكلفة",
    category:           "التصنيف",
    discount:           "خصم",
    discount_type:      "نوع الخصم",
    discount_percent:   "نسبة %",
    discount_amount:    "مبلغ ثابت",
    stock:              "المخزون",
    low_threshold:      "حدّ التنبيه",
    sizes:              "المقاسات",
    colors:             "الألوان",
    image_main:         "الصورة الرئيسية",
    images_extra:       "صور إضافية حسب اللون",
    variants:           "متغيرات اللون × المقاس",
    add_variant:        "+ إضافة متغير",
    add_image:          "+ إضافة صورة لون",

    inv_title:          "المخزون",
    inv_search:         "بحث في المخزون…",
    inv_low_alert:      "منتجات قاربت على النفاد",

    orders_title:       "الطلبات",
    orders_filter_city: "كل المدن",
    orders_filter_st:   "كل الحالات",
    code:               "الرمز",
    customer:           "الزبون",
    items:              "القطع",
    date:               "التاريخ",
    qty:                "الكمية",
    update_status:      "تحديث الحالة",

    settings_title:     "الإعدادات",
    business_info:      "معلومات النشاط",
    bank_accounts:      "الحسابات البنكية",
    add_bank_account:   "+ إضافة حساب",
    bank_name:          "اسم البنك",
    account_name:       "اسم صاحب الحساب",
    account_number:     "رقم الحساب",
    iban:               "IBAN",
    contact_info:       "بيانات التواصل",
    delivery_cities:    "مدن التوصيل",
    add_city:           "+ إضافة مدينة",
    city_ar:            "المدينة (عربي)",
    city_en:            "City (English)",
    shipping_fee:       "رسوم التوصيل",
    currency:           "العملة",
    banner:             "صورة البانر",
    upload_banner:      "ارفعي صورة البانر",
    instagram:          "إنستغرام",
    saved:              "تمّ الحفظ",

    // Login
    admin_login:        "دخول لوحة الإدارة",
    admin_login_sub:    "أدخلي بيانات المسؤول",
    email:              "البريد الإلكتروني",
    password:           "كلمة المرور",
    sign_in:            "تسجيل الدخول",
    login_failed:       "فشل تسجيل الدخول",
  },

  en: {
    brand:              "Amal Abayas",
    brand_sub:          "عبايات أمل",
    tagline:            "Abaya and more",
    promo:              "✦  Free shipping across Gaza on orders over ₪200  ✦",
    nav_home:           "Home",
    nav_collection:     "Collection",
    nav_categories:     "Categories",
    nav_about:          "About",
    nav_contact:        "Contact",
    cart:               "Cart",
    cart_label:         "Shopping Cart",
    cart_empty:         "Your cart is empty",
    cart_empty_sub:     "Discover our collection and add what you love",
    subtotal:           "Subtotal",
    shipping:           "Shipping",
    shipping_free:      "Free",
    total:              "Total",
    checkout:           "Checkout",
    continue_shopping:  "Continue shopping",
    hero_eyebrow:       "AMAL ABAYAS  •  عبايات أمل",
    hero_title:         "Abayas and more — found at",
    hero_title_gold:    "Amal Abayas",
    hero_sub:           "Abayas designed and selected with care from the UAE, delivered to you in Gaza.",
    shop_now:           "Shop Now",
    contact_us:         "Contact Us",
    cats_title:         "Categories",
    cats_sub:           "Pick the abaya that fits your day",
    cat_all:            "All",
    cat_practical:      "Practical",
    cat_practical_sub:  "For your everyday",
    cat_occasion:       "Occasion",
    cat_occasion_sub:   "Stand out with elegance",
    cat_black:          "Black",
    cat_black_sub:      "Timeless classic",
    cat_open:           "Open",
    cat_open_sub:       "Modern style",
    collection_title:   "Our Collection",
    collection_sub:     "Hand-picked pieces, ready to ship across Gaza",
    in_stock:           "In stock",
    low_stock:          "Last pieces",
    out_of_stock:       "Sold out",
    pd_color:           "Color",
    pd_size:            "Size",
    pd_qty:             "Quantity",
    add_to_cart:        "Add to cart",
    pd_pick_color:      "Pick a color first",
    pd_pick_size:       "Pick a size first",
    added:              "Added to cart",
    checkout_title:     "Place your order",
    name:               "Full name",
    whatsapp:           "WhatsApp number",
    phone:              "Phone",
    city:               "City",
    address:            "Detailed address",
    notes:              "Notes (optional)",
    pay_method:         "Payment method",
    pay_cod:            "Cash on delivery",
    pay_bank:           "Bank transfer",
    place_order:        "Place order",
    order_placed:       "Order placed! We'll reach out via WhatsApp.",
    fill_required:      "Please fill the required fields",
    select_city:        "— Select city —",
    bank_info_title:    "Bank account details",
    promise_ship_t:     "Fast shipping",
    promise_ship_s:     "Within 24–48 hours in Gaza",
    promise_qual_t:     "Quality guaranteed",
    promise_qual_s:     "Premium fabrics, careful finish",
    promise_wa_t:       "WhatsApp support",
    promise_wa_s:       "We're here whenever you need",
    about_eyebrow:      "Our story",
    about_title:        "Abayas selected with care, for you",
    about_lead:         "Amal Abayas curates elegant abayas from the UAE and delivers them to every home in Gaza.",
    about_p1:           "We pick every piece with an expert eye: premium fabrics, careful tailoring, and modest fashion forward designs.",
    about_p2:           "Our goal: find your perfect abaya for any occasion — day, visits, weddings, travel — without leaving home.",
    contact_title:      "Contact Us",
    contact_sub:        "We're here to answer any question",
    contact_phone:      "Phone",
    contact_wa:         "WhatsApp",
    contact_ig:         "Instagram",
    contact_addr:       "Address",
    footer_about:       "Amal Abayas — abayas and more, delivered with elegance across Gaza.",
    footer_quick:       "Quick links",
    footer_legal:       "Info",
    footer_rights:      "© Amal Abayas 2026 · All rights reserved",
    save:               "Save",
    cancel:             "Cancel",
    close:              "Close",
    confirm:            "Confirm",
    edit:               "Edit",
    delete:             "Delete",
    remove:             "Remove",
    add:                "Add",
    loading:            "Loading…",
    no_data:            "No data",
    error_generic:      "Something went wrong. Please try again.",
    admin_title:        "Amal Abayas Dashboard",
    nav_dashboard:      "Dashboard",
    nav_products:       "Products",
    nav_inventory:      "Inventory",
    nav_orders:         "Orders",
    nav_delivery:       "Delivery",
    nav_customers:      "Customers",
    nav_settings:       "Settings",
    logout:             "Logout",
    stat_orders_today:  "Today's orders",
    stat_sales_today:   "Today's sales",
    stat_products:      "Total products",
    stat_low_stock:     "Low stock alerts",
    status_processing:  "Processing",
    status_shipped:     "Shipped",
    status_delivered:   "Delivered",
    status_cancelled:   "Cancelled",
    products_title:     "Products",
    add_product:        "+ Add product",
    name_en:            "Name (EN)",
    name_ar:            "Name (AR)",
    desc_en:            "Description (EN)",
    desc_ar:            "Description (AR)",
    price:              "Price",
    cost:               "Cost",
    category:           "Category",
    discount:           "Discount",
    discount_type:      "Discount type",
    discount_percent:   "Percent %",
    discount_amount:    "Fixed amount",
    stock:              "Stock",
    low_threshold:      "Low-stock threshold",
    sizes:              "Sizes",
    colors:             "Colors",
    image_main:         "Main image",
    images_extra:       "Extra images per color",
    variants:           "Variants (color × size × stock)",
    add_variant:        "+ Add variant",
    add_image:          "+ Add color image",
    inv_title:          "Inventory",
    inv_search:         "Search inventory…",
    inv_low_alert:      "Low-stock products",
    orders_title:       "Orders",
    orders_filter_city: "All cities",
    orders_filter_st:   "All statuses",
    code:               "Code",
    customer:           "Customer",
    items:              "Items",
    date:               "Date",
    qty:                "Qty",
    update_status:      "Update status",
    settings_title:     "Settings",
    business_info:      "Business info",
    bank_accounts:      "Bank accounts",
    add_bank_account:   "+ Add account",
    bank_name:          "Bank name",
    account_name:       "Account holder",
    account_number:     "Account number",
    iban:               "IBAN",
    contact_info:       "Contact info",
    delivery_cities:    "Delivery cities",
    add_city:           "+ Add city",
    city_ar:            "City (AR)",
    city_en:            "City (EN)",
    shipping_fee:       "Shipping fee",
    currency:           "Currency",
    banner:             "Banner image",
    upload_banner:      "Upload banner",
    instagram:          "Instagram",
    saved:              "Saved",
    admin_login:        "Admin login",
    admin_login_sub:    "Enter your admin credentials",
    email:              "Email",
    password:           "Password",
    sign_in:            "Sign in",
    login_failed:       "Sign-in failed",
  }
};

// Gaza Strip cities (default — admin can edit in Settings)
const DEFAULT_CITIES = [
  { ar: "غزة",         en: "Gaza" },
  { ar: "خانيونس",      en: "Khan Yunis" },
  { ar: "رفح",          en: "Rafah" },
  { ar: "دير البلح",    en: "Deir al-Balah" },
  { ar: "شمال غزة",     en: "North Gaza" },
  { ar: "جباليا",       en: "Jabalia" },
  { ar: "النصيرات",     en: "Nuseirat" },
  { ar: "البريج",       en: "Bureij" },
  { ar: "المغازي",      en: "Maghazi" },
  { ar: "بيت لاهيا",    en: "Beit Lahia" },
  { ar: "بيت حانون",    en: "Beit Hanoun" }
];

let CURRENT_LANG = localStorage.getItem("amal_lang") || "ar";

function t(key, vars = {}) {
  let s = (TRANSLATIONS[CURRENT_LANG] && TRANSLATIONS[CURRENT_LANG][key]) ||
          TRANSLATIONS.ar[key] || key;
  Object.keys(vars).forEach(k => { s = s.replace("{" + k + "}", vars[k]); });
  return s;
}

function setLang(lang) {
  CURRENT_LANG = lang;
  localStorage.setItem("amal_lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";
  document.body.dir = (lang === "ar") ? "rtl" : "ltr";
}

function toggleLang() {
  setLang(CURRENT_LANG === "ar" ? "en" : "ar");
  if (window.renderCurrentView) window.renderCurrentView();
}

function getLang() { return CURRENT_LANG; }

function fmtPrice(n) {
  const cur = (window.AmalSettings && window.AmalSettings.currency) || "₪";
  const v = Number(n) || 0;
  return v.toLocaleString(CURRENT_LANG === "ar" ? "ar-EG" : "en-US",
    { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " " + cur;
}

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(CURRENT_LANG === "ar" ? "ar-EG" : "en-US",
    { year: "numeric", month: "short", day: "numeric" });
}

function getCities() {
  const s = window.AmalSettings;
  return (s && Array.isArray(s.cities) && s.cities.length) ? s.cities : DEFAULT_CITIES;
}

function cityLabel(key) {
  const list = getCities();
  const c = list.find(x => x.en === key || x.ar === key);
  if (!c) return key || "—";
  return CURRENT_LANG === "ar" ? c.ar : c.en;
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

window.t = t;
window.setLang = setLang;
window.toggleLang = toggleLang;
window.getLang = getLang;
window.fmtPrice = fmtPrice;
window.fmtDate = fmtDate;
window.getCities = getCities;
window.cityLabel = cityLabel;
window.DEFAULT_CITIES = DEFAULT_CITIES;
window.esc = esc;

// Apply initial lang
setLang(CURRENT_LANG);
