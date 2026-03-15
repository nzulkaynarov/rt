(function () {'use strict';
const STORAGE_KEY = 'railtech_lang';
const DEFAULT_LANG = 'ru';
const SUPPORTED = ['ru', 'en', 'uz'];
const INLINE = {ru: {nav_about:"О компании", nav_services:"Услуги", nav_platform:"Платформа",
nav_contacts:"Контакты", nav_cabinet:"Войти",
hero_title:"Комплексные поставки <br><span class='text-blue-400'>промышленного оборудования</span>",
hero_desc:"Обеспечиваем бесперебойную работу вашего производства в Узбекистане. Официальная гарантия, полная таможенная очистка и доставка до склада.",
btn_contact:"Связаться с нами", btn_catalog:"Перейти в каталог",
stats_years:"лет на рынке", stats_clients:"партнёров", stats_sku:"SKU в каталоге", stats_countries:"страны",
adv_1_title:"Официальный дилер", adv_1_desc:"Партнёр ведущих мировых производителей промышленного и железнодорожного оборудования.",
adv_2_title:"Сертификация", adv_2_desc:"Импорт и реализация исключительно сертифицированной продукции с полным пакетом документов.",
adv_3_title:"Консалтинг", adv_3_desc:"Профессиональные услуги для международных компаний, работающих в РУз.",
srv_main_title:"Наши направления", srv_main_desc:"RailTech создана опытными специалистами для оказания профессиональных услуг в области поставок и реализации инженерных проектов.",
srv_1_title:"Поставка оборудования", srv_1_desc:"Продажа и продвижение комплектующих изделий для систем железнодорожной безопасности на территории РУз.",
srv_2_title:"Техническая экспертиза", srv_2_desc:"Техническое консультирование, предпроектная поддержка, участие в пилотных проектах.",
srv_3_title:"Локализация производства", srv_3_desc:"Адаптация продукции к нормативным требованиям РУз, организация сборки компонентов.",
srv_4_title:"Представительство", srv_4_desc:"Представление интересов международных компаний, развитие технологического сотрудничества.",
platform_label:"Цифровая платформа", platform_title:"Весь цикл поставки — в одном окне",
platform_desc:"Мы перевели каждый этап работы с клиентом в цифровой формат.",
platform_f1_tag:"Каталог", platform_f1_title:"500+ позиций оборудования",
platform_f1_desc:"Ж/Д комплектующие, промышленные товары, услуги — всё в одном каталоге с фильтрами по домену, категории и наличию.",
platform_f2_tag:"Сделки", platform_f2_title:"CRM для управления заказами",
platform_f2_desc:"Менеджеры видят все сделки, статусы, документы и историю переписки. Клиент — свои заявки в личном кабинете.",
platform_f3_tag:"Коммерческие предложения", platform_f3_title:"КП с расчётом Landed Cost",
platform_f3_desc:"Цена автоматически включает логистику, таможенные пошлины, маржу и НДС 12%. Никакого ручного пересчёта.",
platform_f4_tag:"Верификация", platform_f4_title:"KYC и управление доступом",
platform_f4_desc:"Цены и документы видны только верифицированным партнёрам. Гость видит каталог, клиент — свои сделки, менеджер — назначенные заявки.",
platform_cta:"Открыть B2B каталог",
partners_title:"Работаем с лидерами отрасли", partners_desc:"Официальные дилерские соглашения и долгосрочные партнёрства.",
faq_title:"Частые вопросы", faq_desc:"Если не нашли ответ — напишите нам, и мы ответим в течение одного рабочего дня.",
faq_1_q:"Как оформить заявку на коммерческое предложение?",
faq_1_a:"Зарегистрируйтесь в личном кабинете, пройдите быструю верификацию компании (KYC), выберите нужные позиции в каталоге и нажмите «Запросить КП».",
faq_2_q:"Работаете ли вы с нерезидентами Узбекистана?",
faq_2_a:"Да, мы сотрудничаем с компаниями из Казахстана, России и других стран СНГ. Доступны условия поставки DAP и CIF.",
faq_3_q:"Какие сроки поставки?",
faq_3_a:"Позиции «В наличии» — от 3 до 10 рабочих дней. Под заказ — уточняется при формировании КП.",
faq_4_q:"Есть ли сертификаты на оборудование?",
faq_4_a:"Да, вся продукция сопровождается сертификатами соответствия, паспортами качества и декларациями производителей.",
faq_5_q:"Можно ли вернуть товар?",
faq_5_a:"Возврат возможен в течение 14 дней при ненарушенной упаковке. Условия прописаны в договоре поставки.",
form_title:"Свяжитесь с нами", form_desc:"Оставьте заявку, и профильный специалист RailTech свяжется с вами.",
form_name:"Ваше имя *", form_company:"Компания", form_phone:"Телефон *", form_email:"Email *", form_msg:"Сообщение или суть задачи",
btn_send:"Отправить запрос", form_success:"Запрос успешно отправлен! Мы свяжемся с вами в ближайшее время.",
form_error:"Ошибка при отправке. Пожалуйста, попробуйте позже.", form_sending:"Отправка...",
footer_desc:"Инновационно-технологическая компания, оказывающая профессиональные услуги в области поставки комплектующих и реализации инженерных проектов в РУз.",
footer_copy:"© 2021–2026 ООО «RailTech». Все права защищены.",
footer_address:"г. Ташкент, Index,<br>Офис B2-2097",
footer_eco:"Экосистема", footer_cat:"B2B Каталог оборудования", footer_cab:"Личный кабинет партнёра",
nav_services_link:"Наши услуги", nav_faq:"FAQ", footer_privacy:"Политика конфиденциальности", footer_terms:"Условия использования",
srv_badge:"Направления",
hero_chip_1:"120+ активных партнёров", hero_chip_2:"500+ SKU в каталоге", hero_chip_3:"5 лет на рынке",
tw_1:"Ж/Д комплектующие", tw_2:"Промышленное оборудование", tw_3:"Технический консалтинг", tw_4:"Таможенное оформление", tw_5:"Официальные поставки",
cta_title:"Готовы оптимизировать закупки?", cta_desc:"Более 120 партнёров уже доверяют RailTech поставку промышленного оборудования в Узбекистане.",
cta_primary:"Связаться с нами", cta_secondary:"Открыть каталог",
err_title:"Страница не найдена", err_desc:"Ссылка устарела или страница перемещена. Вернитесь на главную.", err_home:"← На главную", err_quick:"Популярные разделы"},
en: {nav_about:"About", nav_services:"Services", nav_platform:"Platform",
nav_contacts:"Contact", nav_cabinet:"Sign In",
hero_title:"Comprehensive supply of <br><span class='text-blue-400'>industrial equipment</span>",
hero_desc:"We ensure the uninterrupted operation of your production in Uzbekistan. Official warranty, full customs clearance, and warehouse delivery.",
btn_contact:"Contact us", btn_catalog:"Go to Catalog",
stats_years:"years on the market", stats_clients:"partners", stats_sku:"SKUs in catalog", stats_countries:"countries",
adv_1_title:"Official Dealer", adv_1_desc:"Partner of the world's leading industrial and railway equipment manufacturers.",
adv_2_title:"Certification", adv_2_desc:"Import and sale of exclusively certified products with a full documentation package.",
adv_3_title:"Consulting", adv_3_desc:"Professional services for international companies operating in Uzbekistan.",
srv_main_title:"Our Services", srv_main_desc:"RailTech was created by experienced specialists to provide professional services in the supply and implementation of engineering projects.",
srv_1_title:"Equipment Supply", srv_1_desc:"Sale and promotion of components and technical solutions for railway safety systems in Uzbekistan.",
srv_2_title:"Technical Expertise", srv_2_desc:"Technical consulting, pre-project support, participation in pilot projects and trial operation.",
srv_3_title:"Production Localization", srv_3_desc:"Adaptation of products to regulatory requirements of Uzbekistan, organization of component assembly.",
srv_4_title:"Representation", srv_4_desc:"Representing the interests of international companies, developing technological cooperation.",
platform_label:"Digital Platform", platform_title:"The full supply cycle — in one window",
platform_desc:"We digitized every stage of working with a client.",
platform_f1_tag:"Catalog", platform_f1_title:"500+ equipment items",
platform_f1_desc:"Railway components, industrial goods, services — all in one catalog with filters by domain, category, and availability.",
platform_f2_tag:"Deals", platform_f2_title:"CRM for order management",
platform_f2_desc:"Managers see all deals, statuses, documents, and correspondence history. Clients see their requests in the personal cabinet.",
platform_f3_tag:"Quotes", platform_f3_title:"Proposals with Landed Cost",
platform_f3_desc:"Price automatically includes logistics, customs duties, margin, and 12% VAT. No manual recalculation needed.",
platform_f4_tag:"Verification", platform_f4_title:"KYC and access control",
platform_f4_desc:"Prices and documents are visible only to verified partners. Guests see the catalog, clients see their deals.",
platform_cta:"Open B2B Catalog",
partners_title:"We work with industry leaders", partners_desc:"Official dealership agreements and long-term partnerships.",
faq_title:"Frequently Asked Questions", faq_desc:"If you didn't find an answer — write to us.",
faq_1_q:"How do I submit a request for a commercial proposal?",
faq_1_a:"Register in the personal cabinet, complete quick company verification (KYC), select items in the catalog, and click 'Request Proposal'.",
faq_2_q:"Do you work with non-residents of Uzbekistan?",
faq_2_a:"Yes, we work with companies from Kazakhstan, Russia, and other CIS countries. DAP and CIF delivery terms are available.",
faq_3_q:"What are the delivery timelines?",
faq_3_a:"'In Stock' items — 3 to 10 business days. Made to Order — specified when preparing the commercial proposal.",
faq_4_q:"Do you have equipment certificates?",
faq_4_a:"Yes, all products are accompanied by conformity certificates, quality passports, and manufacturer declarations.",
faq_5_q:"Can goods be returned?",
faq_5_a:"Returns are possible within 14 days if packaging is intact. Terms are specified in the supply contract.",
form_title:"Contact Us", form_desc:"Leave a request, and a specialized RailTech expert will contact you.",
form_name:"Your Name *", form_company:"Company", form_phone:"Phone *", form_email:"Email *", form_msg:"Message or task description",
btn_send:"Send Request", form_success:"Request successfully sent! We will contact you shortly.",
form_error:"Error sending. Please try again later.", form_sending:"Sending...",
footer_desc:"An innovative technology company providing professional services in the supply of components and engineering projects in Uzbekistan.",
footer_copy:"© 2021–2026 LLC RailTech. All rights reserved.",
footer_address:"Tashkent, Index,<br>Office B2-2097",
footer_eco:"Ecosystem", footer_cat:"B2B Equipment Catalog", footer_cab:"Partner Cabinet",
nav_services_link:"Our Services", nav_faq:"FAQ", footer_privacy:"Privacy Policy", footer_terms:"Terms of Use",
srv_badge:"Services",
hero_chip_1:"120+ active partners", hero_chip_2:"500+ SKUs in catalog", hero_chip_3:"5 years on market",
tw_1:"Railway Components", tw_2:"Industrial Equipment", tw_3:"Technical Consulting", tw_4:"Customs Clearance", tw_5:"Official Supply",
cta_title:"Ready to streamline procurement?", cta_desc:"Over 120 partners already trust RailTech for industrial equipment supply in Uzbekistan.",
cta_primary:"Get in Touch", cta_secondary:"View Catalog",
err_title:"Page not found", err_desc:"The link may be outdated or the page has been moved. Return to the homepage.", err_home:"← Back to Home", err_quick:"Popular sections"},
uz: {nav_about:"Kompaniya", nav_services:"Xizmatlar", nav_platform:"Platforma",
nav_contacts:"Aloqa", nav_cabinet:"Kirish",
hero_title:"Sanoat uskunalarini <br><span class='text-blue-400'>kompleks yetkazib berish</span>",
hero_desc:"O'zbekistonda ishlab chiqarishingizning uzluksiz ishlashini ta'minlaymiz. Rasmiy kafolat, to'liq bojxona rasmiylashtiruvi.",
btn_contact:"Biz bilan bog'lanish", btn_catalog:"Katalogga o'tish",
stats_years:"yil bozorda", stats_clients:"hamkorlar", stats_sku:"SKU katalogda", stats_countries:"davlat",
adv_1_title:"Rasmiy diler", adv_1_desc:"Jahonning yetakchi sanoat va temir yo'l uskunalari ishlab chiqaruvchilarining hamkori.",
adv_2_title:"Sertifikatlashtirish", adv_2_desc:"Faqatgina to'liq hujjatlar paketi bilan sertifikatlangan mahsulotlarni import qilish.",
adv_3_title:"Konsalting", adv_3_desc:"O'zbekistonda faoliyat yuritayotgan xalqaro kompaniyalar uchun professional xizmatlar.",
srv_main_title:"Bizning xizmatlarimiz", srv_main_desc:"RailTech tajribali mutaxassislar tomonidan muhandislik loyihalarini yetkazib berish va amalga oshirish uchun tashkil etilgan.",
srv_1_title:"Uskunalarni yetkazib berish", srv_1_desc:"O'zbekiston hududida temir yo'l xavfsizligi tizimlari uchun butlovchi qismlar va texnik yechimlarni sotish.",
srv_2_title:"Texnik ekspertiza", srv_2_desc:"Texnik maslahat berish, loyihadan oldingi qo'llab-quvvatlash, tajriba loyihalarida ishtirok etish.",
srv_3_title:"Ishlab chiqarishni mahalliylashtirish", srv_3_desc:"Mahsulotlarni O'zbekistonning me'yoriy talablariga moslashtirish, butlovchi qismlarni yig'ish.",
srv_4_title:"Vakolatxona", srv_4_desc:"Xalqaro kompaniyalarning manfaatlarini ifodalash, texnologik hamkorlikni rivojlantirish.",
platform_label:"Raqamli platforma", platform_title:"Butun ta'minot sikli — bitta oynada",
platform_desc:"Mijoz bilan ishlashning har bir bosqichini raqamli formatga o'tkazdik.",
platform_f1_tag:"Katalog", platform_f1_title:"500+ uskuna pozitsiyasi",
platform_f1_desc:"Temir yo'l butlovchi qismlari, sanoat tovarlari, xizmatlar — barchasi bitta katalogda filtrlar bilan.",
platform_f2_tag:"Bitimlar", platform_f2_title:"Buyurtmalarni boshqarish uchun CRM",
platform_f2_desc:"Menejerlar barcha bitimlar, statuslar, hujjatlar va yozishmalar tarixini ko'radi.",
platform_f3_tag:"Tijorat takliflari", platform_f3_title:"Landed Cost hisobi bilan TT",
platform_f3_desc:"Narxga avtomatik ravishda logistika, bojxona bojlari, marja va 12% QQS kiritiladi.",
platform_f4_tag:"Verifikatsiya", platform_f4_title:"KYC va kirishni boshqarish",
platform_f4_desc:"Narxlar va hujjatlar faqat tasdiqlangan hamkorlarga ko'rinadi.",
platform_cta:"B2B katalogni ochish",
partners_title:"Soha yetakchilari bilan ishlaymiz", partners_desc:"Rasmiy dilerlik shartnomalari va uzoq muddatli hamkorliklar.",
faq_title:"Ko'p so'raladigan savollar", faq_desc:"Javobni topa olmadingizmi — bizga yozing.",
faq_1_q:"Tijorat taklifi uchun qanday so'rov yuborish mumkin?",
faq_1_a:"Shaxsiy kabinetda ro'yxatdan o'ting, tezkor kompaniya verifikatsiyasini (KYC) o'ting, katalogdan kerakli pozitsiyalarni tanlang.",
faq_2_q:"O'zbekiston rezidentlari bo'lmaganlar bilan ishlaysizmi?",
faq_2_a:"Ha, Qozog'iston, Rossiya va boshqa MDH davlatlarining kompaniyalari bilan hamkorlik qilamiz.",
faq_3_q:"Yetkazib berish muddatlari qancha?",
faq_3_a:"'Mavjud' pozitsiyalar — 3 dan 10 ish kunigacha. 'Buyurtma bo'yicha' — TT shakllantirishda aniqlanadi.",
faq_4_q:"Uskunalar sertifikatlari bormi?",
faq_4_a:"Ha, barcha mahsulotlar muvofiqlik sertifikatlari, sifat pasportlari va ishlab chiqaruvchi deklaratsiyalari bilan birga keladi.",
faq_5_q:"Tovarni qaytarish mumkinmi?",
faq_5_a:"Qadoqlash buzilmagan holda 14 kun ichida qaytarish mumkin.",
form_title:"Biz bilan bog'lanish", form_desc:"So'rov qoldiring va RailTech mutaxassisi siz bilan bog'lanadi.",
form_name:"Ismingiz *", form_company:"Kompaniya", form_phone:"Telefon *", form_email:"Email *", form_msg:"Xabar yoki vazifaning mohiyati",
btn_send:"So'rov yuborish", form_success:"So'rov muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.",
form_error:"Yuborishda xatolik. Keyinroq urinib ko'ring.", form_sending:"Yuborilmoqda...",
footer_desc:"O'zbekistonda butlovchi qismlarni yetkazib berish va muhandislik loyihalarini amalga oshirish sohasida xizmat ko'rsatuvchi innovatsion-texnologik kompaniya.",
footer_copy:"© 2021–2026 «RailTech» MChJ. Barcha huquqlar himoyalangan.",
footer_address:"Toshkent sh., Index,<br>Ofis B2-2097",
footer_eco:"Ekotizim", footer_cat:"B2B Uskunalar katalogi", footer_cab:"Hamkor kabineti",
nav_services_link:"Bizning xizmatlarimiz", nav_faq:"FAQ", footer_privacy:"Maxfiylik siyosati", footer_terms:"Foydalanish shartlari",
srv_badge:"Xizmatlar",
hero_chip_1:"120+ faol hamkorlar", hero_chip_2:"500+ SKU katalogda", hero_chip_3:"5 yil bozorda",
tw_1:"Temir yo'l qismlari", tw_2:"Sanoat uskunalari", tw_3:"Texnik konsalting", tw_4:"Bojxona rasmiylashtiruvi", tw_5:"Rasmiy yetkazib berish",
cta_title:"Xaridlarni optimallashtirmoqchimisiz?", cta_desc:"120 dan ortiq hamkorlar RailTech'ga O'zbekistonda sanoat uskunalarini yetkazib berish uchun ishonadi.",
cta_primary:"Biz bilan bog'lanish", cta_secondary:"Katalogni ochish",
err_title:"Sahifa topilmadi", err_desc:"Havola eskirgan yoki sahifa ko'chirilgan. Bosh sahifaga qaytib, boshlang.", err_home:"← Bosh sahifaga", err_quick:"Mashhur bo'limlar"}};
let currentLang = DEFAULT_LANG;
let translations = {};
var localeBase = (function () {try {var scripts = document.querySelectorAll('script[src*="i18n.js"]');
var src = scripts[scripts.length - 1].getAttribute('src');
var jsDir = src.substring(0, src.lastIndexOf('/') + 1);
return jsDir + '../locales/';} catch (e) {return 'locales/';}})();
async function loadLocale(lang) {if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
try {var resp = await fetch(localeBase + lang + '.json');
if (!resp.ok) throw new Error('HTTP ' + resp.status);
var data = await resp.json();
return Object.assign({}, INLINE[lang] || {}, data);} catch (e) {return INLINE[lang] || INLINE[DEFAULT_LANG];}}
function t(key) {return translations[key] !== undefined ? translations[key] : key;}
function applyTranslations() {document.querySelectorAll('[data-i18n]').forEach(el => {const val = t(el.getAttribute('data-i18n'));
if (val !== el.getAttribute('data-i18n')) el.textContent = val;});
document.querySelectorAll('[data-i18n-html]').forEach(el => {const val = t(el.getAttribute('data-i18n-html'));
if (val !== el.getAttribute('data-i18n-html')) el.innerHTML = val;});
document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {const val = t(el.getAttribute('data-i18n-placeholder'));
if (val !== el.getAttribute('data-i18n-placeholder')) el.placeholder = val;});
document.documentElement.lang = currentLang;}
async function setLanguage(lang) {if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
currentLang = lang;
translations = await loadLocale(lang);
applyTranslations();
localStorage.setItem(STORAGE_KEY, lang);
document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));}
async function init() {const saved = localStorage.getItem(STORAGE_KEY);
const browser = (navigator.language || '').slice(0, 2);
const lang = saved || (SUPPORTED.includes(browser) ? browser : DEFAULT_LANG);
document.querySelectorAll('.js-lang-switcher').forEach(el => {el.value = lang;
el.addEventListener('change', e => setLanguage(e.target.value));});
await setLanguage(lang);}
window.i18n = { t, setLanguage, getCurrentLang: () => currentLang };
if (document.readyState === 'loading') {document.addEventListener('DOMContentLoaded', init);} else {init();}})();