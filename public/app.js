const app = document.querySelector("#app");

const uk = {
  dashboard: "Панель",
  files: "Файли",
  feed: "Активність",
  shared: "Спільне",
  groups: "Простори",
  stories: "Сторі",
  messages: "Повідомлення",
  profile: "Профіль",
  settings: "Налаштування",
  admin: "Адмінка",
  login: "Вхід",
  register: "Реєстрація",
  reset: "Відновлення",
  email: "Email",
  password: "Пароль",
  name: "Ім'я",
  twofa: "2FA код, якщо увімкнено",
  signIn: "Увійти",
  createAccount: "Створити акаунт",
  sendReset: "Надіслати посилання",
  logout: "Вийти",
  dark: "Темна",
  light: "Світла",
  search: "Пошук файлів, тегів, папок",
  upload: "Завантажити",
  drop: "Перетягніть файли сюди",
  chooseFiles: "або натисніть, щоб вибрати кілька файлів",
  folder: "Папка",
  tags: "Теги",
  visibility: "Видимість",
  private: "Приватний",
  link: "За посиланням",
  public: "Публічний",
  uploadSelected: "Завантажити вибране",
  open: "Відкрити",
  shareLink: "Лінк",
  trash: "Кошик",
  restore: "Відновити",
  noFiles: "Файлів поки немає",
  noActivity: "Активності поки немає",
  noMessages: "Повідомлень поки немає",
  storage: "Використано місця",
  network: "Мережа",
  recent: "Останні файли",
  accessModel: "Модель доступу",
  accessText: "Приватні файли видаються тільки через backend після перевірки прав. Тимчасові посилання мають строк дії. Публічні файли потрапляють у соціальний шар.",
  comments: "Коментарі",
  metadata: "Метадані",
  owner: "Власник",
  addComment: "Додати коментар",
  comment: "Коментувати",
  close: "Закрити",
  workspaceTitle: "Робочі простори",
  workspaceText: "Приватні або публічні простори для команд, сімей і спільнот.",
  createWorkspace: "Створити простір",
  description: "Опис",
  recipient: "Отримувач",
  message: "Повідомлення",
  send: "Надіслати",
  security: "Безпека",
  quota: "Ліміт місця",
  notifications: "Сповіщення",
  plans: "Тарифи",
  enable2fa: "Увімкнути 2FA",
  disable2fa: "Вимкнути 2FA",
  users: "Користувачі",
  role: "Роль",
  status: "Статус",
  block: "Заблокувати",
  unblock: "Розблокувати",
  logs: "Журнал аудиту",
  system: "Система",
  storyTitle: "Назва сторі",
  storyBody: "Коротке оновлення",
  publishStory: "Опублікувати сторі",
  botHint: "Захищений вхід без підказок і демо-логінів.",
  forgotHint: "Якщо email існує, система надішле інструкції через SMTP.",
  hero: "Приватна спільнота для безпечних файлів",
  heroText: "Vaultline поєднує власне серверне сховище, соціальну стрічку, профілі, коментарі, робочі простори та адмін-контроль.",
  featureSecure: "Захист",
  featureSecureText: "CSRF, rate limit, audit logs, signed links, бот-фільтри.",
  featureSocial: "Соціальний шар",
  featureSocialText: "Реакції, коментарі, сторі, підписки і простори.",
  featureDomain: "Свій домен",
  featureDomainText: "Готово для VPS, Nginx, Cloudflare Tunnel і ukrainecommunity.pp.ua."
};

const translations = {
  uk,
  en: { dashboard: "Dashboard", files: "Files", feed: "Activity", shared: "Shared", groups: "Workspaces", stories: "Stories", messages: "Messages", profile: "Profile", settings: "Settings", admin: "Admin", login: "Login", register: "Register", reset: "Reset", email: "Email", password: "Password", name: "Name", twofa: "2FA code, if enabled", signIn: "Sign in", createAccount: "Create account", sendReset: "Send reset link", logout: "Logout", dark: "Dark", light: "Light", search: "Search files, tags, folders", upload: "Upload", drop: "Drop files here", chooseFiles: "or click to choose multiple files", folder: "Folder", tags: "Tags", visibility: "Visibility", private: "Private", link: "Link access", public: "Public", uploadSelected: "Upload selected", open: "Open", shareLink: "Link", trash: "Trash", restore: "Restore", noFiles: "No files yet", noActivity: "No activity yet", noMessages: "No messages yet", storage: "Storage used", network: "Network", recent: "Recent files", accessModel: "Access model", accessText: "Private files are streamed through the backend after permission checks. Temporary links expire. Public files appear in the social layer.", comments: "Comments", metadata: "Metadata", owner: "Owner", addComment: "Add a comment", comment: "Comment", close: "Close", workspaceTitle: "Workspaces", workspaceText: "Private or public spaces for teams, families and communities.", createWorkspace: "Create workspace", description: "Description", recipient: "Recipient", message: "Message", send: "Send", security: "Security", quota: "Quota", notifications: "Notifications", plans: "Plans", enable2fa: "Enable 2FA", disable2fa: "Disable 2FA", users: "Users", role: "Role", status: "Status", block: "Block", unblock: "Unblock", logs: "Audit logs", system: "System", storyTitle: "Story title", storyBody: "Short update", publishStory: "Publish story", botHint: "Protected sign-in without demo credentials.", forgotHint: "If the email exists, SMTP instructions will be sent.", hero: "A private community for secure files", heroText: "Vaultline combines self-hosted storage, social feed, profiles, comments, workspaces and admin control.", featureSecure: "Protection", featureSecureText: "CSRF, rate limits, audit logs, signed links, bot filters.", featureSocial: "Social layer", featureSocialText: "Reactions, comments, stories, follows and spaces.", featureDomain: "Own domain", featureDomainText: "Ready for VPS, Nginx, Cloudflare Tunnel and ukrainecommunity.pp.ua." },
  pl: { login: "Logowanie", register: "Rejestracja", dashboard: "Panel", files: "Pliki", feed: "Aktywność", stories: "Relacje", messages: "Wiadomości", settings: "Ustawienia", signIn: "Zaloguj", logout: "Wyloguj", search: "Szukaj plików", upload: "Prześlij" },
  de: { login: "Anmelden", register: "Registrieren", dashboard: "Dashboard", files: "Dateien", feed: "Aktivität", stories: "Stories", messages: "Nachrichten", settings: "Einstellungen", signIn: "Einloggen", logout: "Abmelden", search: "Dateien suchen", upload: "Hochladen" },
  fr: { login: "Connexion", register: "Inscription", dashboard: "Tableau", files: "Fichiers", feed: "Activité", stories: "Stories", messages: "Messages", settings: "Paramètres", signIn: "Se connecter", logout: "Déconnexion", search: "Rechercher", upload: "Importer" },
  es: { login: "Acceso", register: "Registro", dashboard: "Panel", files: "Archivos", feed: "Actividad", stories: "Historias", messages: "Mensajes", settings: "Ajustes", signIn: "Entrar", logout: "Salir", search: "Buscar", upload: "Subir" },
  it: { login: "Accesso", register: "Registrati", dashboard: "Dashboard", files: "File", feed: "Attività", stories: "Storie", messages: "Messaggi", settings: "Impostazioni", signIn: "Accedi", logout: "Esci", search: "Cerca", upload: "Carica" },
  pt: { login: "Entrar", register: "Registro", dashboard: "Painel", files: "Ficheiros", feed: "Atividade", stories: "Stories", messages: "Mensagens", settings: "Definições", signIn: "Entrar", logout: "Sair", search: "Pesquisar", upload: "Enviar" },
  tr: { login: "Giriş", register: "Kayıt", dashboard: "Panel", files: "Dosyalar", feed: "Etkinlik", stories: "Hikayeler", messages: "Mesajlar", settings: "Ayarlar", signIn: "Giriş yap", logout: "Çıkış", search: "Ara", upload: "Yükle" },
  ro: { login: "Autentificare", register: "Înregistrare", dashboard: "Panou", files: "Fișiere", feed: "Activitate", stories: "Povești", messages: "Mesaje", settings: "Setări", signIn: "Intră", logout: "Ieșire", search: "Caută", upload: "Încarcă" },
  cs: { login: "Přihlášení", register: "Registrace", dashboard: "Panel", files: "Soubory", feed: "Aktivita", stories: "Příběhy", messages: "Zprávy", settings: "Nastavení", signIn: "Přihlásit", logout: "Odhlásit", search: "Hledat", upload: "Nahrát" },
  sk: { login: "Prihlásenie", register: "Registrácia", dashboard: "Panel", files: "Súbory", feed: "Aktivita", stories: "Príbehy", messages: "Správy", settings: "Nastavenia", signIn: "Prihlásiť", logout: "Odhlásiť", search: "Hľadať", upload: "Nahrať" },
  bg: { login: "Вход", register: "Регистрация", dashboard: "Табло", files: "Файлове", feed: "Активност", stories: "Истории", messages: "Съобщения", settings: "Настройки", signIn: "Вход", logout: "Изход", search: "Търсене", upload: "Качване" },
  lt: { login: "Prisijungti", register: "Registracija", dashboard: "Skydelis", files: "Failai", feed: "Veikla", stories: "Istorijos", messages: "Žinutės", settings: "Nustatymai", signIn: "Prisijungti", logout: "Atsijungti", search: "Ieškoti", upload: "Įkelti" },
  lv: { login: "Pieteikties", register: "Reģistrācija", dashboard: "Panelis", files: "Faili", feed: "Aktivitāte", stories: "Stāsti", messages: "Ziņas", settings: "Iestatījumi", signIn: "Ieiet", logout: "Iziet", search: "Meklēt", upload: "Augšupielādēt" },
  et: { login: "Logi sisse", register: "Registreeri", dashboard: "Töölaud", files: "Failid", feed: "Tegevus", stories: "Lood", messages: "Sõnumid", settings: "Seaded", signIn: "Sisene", logout: "Välju", search: "Otsi", upload: "Laadi üles" },
  nl: { login: "Inloggen", register: "Registreren", dashboard: "Dashboard", files: "Bestanden", feed: "Activiteit", stories: "Stories", messages: "Berichten", settings: "Instellingen", signIn: "Inloggen", logout: "Uitloggen", search: "Zoeken", upload: "Uploaden" },
  sv: { login: "Logga in", register: "Registrera", dashboard: "Panel", files: "Filer", feed: "Aktivitet", stories: "Stories", messages: "Meddelanden", settings: "Inställningar", signIn: "Logga in", logout: "Logga ut", search: "Sök", upload: "Ladda upp" },
  da: { login: "Log ind", register: "Registrer", dashboard: "Panel", files: "Filer", feed: "Aktivitet", stories: "Stories", messages: "Beskeder", settings: "Indstillinger", signIn: "Log ind", logout: "Log ud", search: "Søg", upload: "Upload" },
  fi: { login: "Kirjaudu", register: "Rekisteröidy", dashboard: "Kojelauta", files: "Tiedostot", feed: "Toiminta", stories: "Tarinat", messages: "Viestit", settings: "Asetukset", signIn: "Kirjaudu", logout: "Ulos", search: "Hae", upload: "Lataa" },
  ja: { login: "ログイン", register: "登録", dashboard: "ダッシュボード", files: "ファイル", feed: "アクティビティ", stories: "ストーリー", messages: "メッセージ", settings: "設定", signIn: "ログイン", logout: "ログアウト", search: "検索", upload: "アップロード" }
};

Object.assign(translations, {
  zh: { login: "登录", register: "注册", dashboard: "仪表盘", files: "文件", feed: "动态", groups: "空间", stories: "故事", messages: "消息", settings: "设置", signIn: "登录", logout: "退出", search: "搜索", upload: "上传" },
  ko: { login: "로그인", register: "가입", dashboard: "대시보드", files: "파일", feed: "활동", groups: "공간", stories: "스토리", messages: "메시지", settings: "설정", signIn: "로그인", logout: "로그아웃", search: "검색", upload: "업로드" },
  ar: { login: "تسجيل الدخول", register: "إنشاء حساب", dashboard: "لوحة التحكم", files: "الملفات", feed: "النشاط", groups: "المساحات", stories: "القصص", messages: "الرسائل", settings: "الإعدادات", signIn: "دخول", logout: "خروج", search: "بحث", upload: "رفع" },
  he: { login: "כניסה", register: "הרשמה", dashboard: "לוח בקרה", files: "קבצים", feed: "פעילות", groups: "מרחבים", stories: "סטוריז", messages: "הודעות", settings: "הגדרות", signIn: "כניסה", logout: "יציאה", search: "חיפוש", upload: "העלאה" },
  hi: { login: "लॉग इन", register: "रजिस्टर", dashboard: "डैशबोर्ड", files: "फ़ाइलें", feed: "गतिविधि", groups: "स्पेस", stories: "स्टोरी", messages: "संदेश", settings: "सेटिंग्स", signIn: "लॉग इन", logout: "लॉग आउट", search: "खोज", upload: "अपलोड" },
  id: { login: "Masuk", register: "Daftar", dashboard: "Dasbor", files: "File", feed: "Aktivitas", groups: "Ruang", stories: "Cerita", messages: "Pesan", settings: "Pengaturan", signIn: "Masuk", logout: "Keluar", search: "Cari", upload: "Unggah" },
  vi: { login: "Đăng nhập", register: "Đăng ký", dashboard: "Bảng điều khiển", files: "Tệp", feed: "Hoạt động", groups: "Không gian", stories: "Tin", messages: "Tin nhắn", settings: "Cài đặt", signIn: "Đăng nhập", logout: "Đăng xuất", search: "Tìm kiếm", upload: "Tải lên" },
  th: { login: "เข้าสู่ระบบ", register: "สมัคร", dashboard: "แดชบอร์ด", files: "ไฟล์", feed: "กิจกรรม", groups: "พื้นที่", stories: "สตอรี่", messages: "ข้อความ", settings: "ตั้งค่า", signIn: "เข้าสู่ระบบ", logout: "ออกจากระบบ", search: "ค้นหา", upload: "อัปโหลด" },
  el: { login: "Σύνδεση", register: "Εγγραφή", dashboard: "Πίνακας", files: "Αρχεία", feed: "Δραστηριότητα", groups: "Χώροι", stories: "Ιστορίες", messages: "Μηνύματα", settings: "Ρυθμίσεις", signIn: "Σύνδεση", logout: "Έξοδος", search: "Αναζήτηση", upload: "Μεταφόρτωση" },
  hu: { login: "Bejelentkezés", register: "Regisztráció", dashboard: "Vezérlőpult", files: "Fájlok", feed: "Aktivitás", groups: "Terek", stories: "Sztorik", messages: "Üzenetek", settings: "Beállítások", signIn: "Belépés", logout: "Kilépés", search: "Keresés", upload: "Feltöltés" },
  no: { login: "Logg inn", register: "Registrer", dashboard: "Panel", files: "Filer", feed: "Aktivitet", groups: "Rom", stories: "Historier", messages: "Meldinger", settings: "Innstillinger", signIn: "Logg inn", logout: "Logg ut", search: "Søk", upload: "Last opp" },
  hr: { login: "Prijava", register: "Registracija", dashboard: "Nadzorna ploča", files: "Datoteke", feed: "Aktivnost", groups: "Prostori", stories: "Priče", messages: "Poruke", settings: "Postavke", signIn: "Prijava", logout: "Odjava", search: "Traži", upload: "Učitaj" },
  sr: { login: "Prijava", register: "Registracija", dashboard: "Kontrolna tabla", files: "Fajlovi", feed: "Aktivnost", groups: "Prostori", stories: "Priče", messages: "Poruke", settings: "Podešavanja", signIn: "Prijavi se", logout: "Odjavi se", search: "Pretraga", upload: "Otpremi" },
  sl: { login: "Prijava", register: "Registracija", dashboard: "Nadzorna plošča", files: "Datoteke", feed: "Aktivnost", groups: "Prostori", stories: "Zgodbe", messages: "Sporočila", settings: "Nastavitve", signIn: "Prijava", logout: "Odjava", search: "Iskanje", upload: "Naloži" }
});

const languages = [
  ["uk", "Українська"], ["en", "English"], ["pl", "Polski"], ["de", "Deutsch"], ["fr", "Français"], ["es", "Español"], ["it", "Italiano"], ["pt", "Português"], ["tr", "Türkçe"], ["ro", "Română"], ["cs", "Čeština"], ["sk", "Slovenčina"], ["bg", "Български"], ["lt", "Lietuvių"], ["lv", "Latviešu"], ["et", "Eesti"], ["nl", "Nederlands"], ["sv", "Svenska"], ["da", "Dansk"], ["fi", "Suomi"], ["no", "Norsk"], ["hu", "Magyar"], ["el", "Ελληνικά"], ["hr", "Hrvatski"], ["sr", "Srpski"], ["sl", "Slovenščina"], ["zh", "中文"], ["ja", "日本語"], ["ko", "한국어"], ["ar", "العربية"], ["he", "עברית"], ["hi", "हिन्दी"], ["id", "Bahasa Indonesia"], ["vi", "Tiếng Việt"], ["th", "ไทย"]
];

const cleanLanguages = [
  ["uk", "Українська"], ["en", "English"], ["pl", "Polski"], ["de", "Deutsch"], ["fr", "Francais"], ["es", "Espanol"], ["it", "Italiano"], ["pt", "Portugues"], ["tr", "Turkce"], ["ro", "Romana"], ["cs", "Cestina"], ["sk", "Slovencina"], ["bg", "Bulgarski"], ["lt", "Lietuviu"], ["lv", "Latviesu"], ["et", "Eesti"], ["nl", "Nederlands"], ["sv", "Svenska"], ["da", "Dansk"], ["fi", "Suomi"], ["no", "Norsk"], ["hu", "Magyar"], ["el", "Greek"], ["hr", "Hrvatski"], ["sr", "Srpski"], ["sl", "Slovenscina"], ["zh", "Chinese"], ["ja", "Japanese"], ["ko", "Korean"], ["ar", "Arabic"], ["he", "Hebrew"], ["hi", "Hindi"], ["id", "Bahasa Indonesia"], ["vi", "Tieng Viet"], ["th", "Thai"]
];

const fullUk = {
  dashboard: "Панель", files: "Файли", feed: "Активність", shared: "Спільне", groups: "Простори", stories: "Сторі", messages: "Повідомлення", profile: "Профіль", settings: "Налаштування", admin: "Адмінка",
  login: "Вхід", register: "Реєстрація", reset: "Відновлення", email: "Email", password: "Пароль", name: "Ім'я", twofa: "2FA код, якщо увімкнено", signIn: "Увійти", createAccount: "Створити акаунт", sendReset: "Надіслати посилання", logout: "Вийти",
  dark: "Темна", light: "Світла", search: "Пошук файлів, тегів, папок", upload: "Завантажити", drop: "Перетягніть файли сюди", chooseFiles: "або натисніть, щоб вибрати кілька файлів", folder: "Папка", tags: "Теги", visibility: "Видимість",
  private: "Приватний", link: "Доступ за посиланням", public: "Публічний", uploadSelected: "Завантажити вибране", open: "Відкрити", shareLink: "Лінк", trash: "Кошик", restore: "Відновити",
  noFiles: "Файлів поки немає", noActivity: "Активності поки немає", noMessages: "Повідомлень поки немає", noNotifications: "Сповіщень поки немає", noComments: "Коментарів поки немає",
  storage: "Використано місця", network: "Мережа", recent: "Останні файли", accessModel: "Модель доступу", accessText: "Приватні файли віддаються тільки через backend після перевірки прав. Тимчасові посилання мають строк дії. Публічні файли потрапляють у соціальний шар.",
  comments: "Коментарі", metadata: "Метадані", owner: "Власник", addComment: "Додати коментар", comment: "Коментувати", close: "Закрити",
  workspaceTitle: "Робочі простори", workspaceText: "Приватні або публічні простори для команд, сімей і спільнот.", createWorkspace: "Створити простір", description: "Опис", recipient: "Отримувач", message: "Повідомлення", send: "Надіслати",
  security: "Безпека", quota: "Ліміт місця", notifications: "Сповіщення", plans: "Тарифи", enable2fa: "Увімкнути 2FA", disable2fa: "Вимкнути 2FA", users: "Користувачі", role: "Роль", status: "Статус", block: "Заблокувати", unblock: "Розблокувати",
  logs: "Журнал аудиту", system: "Система", storyTitle: "Назва сторі", storyBody: "Коротке оновлення", publishStory: "Опублікувати сторі", botHint: "Захищений вхід без демо-підказок.", forgotHint: "Якщо email існує, система надішле інструкції через SMTP.",
  hero: "Приватна спільнота для безпечних файлів", heroText: "Vaultline поєднує власне серверне сховище, соціальну стрічку, профілі, коментарі, робочі простори та адмін-контроль.",
  featureSecure: "Захист", featureSecureText: "CSRF, rate limit, audit logs, signed links, bot-фільтри.", featureSocial: "Соціальний шар", featureSocialText: "Реакції, коментарі, сторі, підписки і простори.", featureDomain: "Свій домен", featureDomainText: "Готово для VPS, Caddy, Nginx, Cloudflare Tunnel і ukrainecommunity.pp.ua.",
  dashboardIntro: "Огляд сховища, активності, сторі та соціальних сигналів.", filesIntro: "Drag & drop, папки, теги, signed links, preview і кошик.", feedIntro: "Події з публічного шару, підписок і власних файлів.", storiesIntro: "Короткі оновлення спільноти, файлів і просторів, що живуть 24 години.", messagesIntro: "Приватні обговорення навколо файлів і просторів.", settingsIntro: "Профіль, сесії, 2FA, ліміти, приватність і захист.",
  securityText: "App-рівень має CSRF, secure cookies auto mode, rate limiting, anti-spam, bot trap, CSP і audit logs. Для реального DDoS постав Cloudflare Tunnel, Caddy або Nginx перед Node.js.", plansText: "Free, Family, Team, Community Pro, encrypted archives, OCR, AI-search, watermark, drop-zones, PWA і desktop sync.", adminIntro: "Користувачі, ролі, модерація, сервер, логи, безпека і домен.",
  adminAccessRequired: "Потрібен доступ адміністратора", active: "активні", members: "учасники", followers: "підписники", spaces: "простори", all: "Усі", mine: "Мої", refresh: "Оновити", clear: "Очистити", user: "Користувач", storageLabel: "Сховище", reports: "скарги", maxUpload: "Макс. файл", antiDdos: "Anti-DDoS: app rate limit + HTTPS proxy",
  userUpdated: "Користувача оновлено", filesReady: "файлів готово", chooseFileFirst: "Виберіть хоча б один файл", uploadComplete: "Завантаження завершено", previewUnavailable: "Перегляд недоступний", accent: "Акцент"
};

const fullEn = {
  ...fullUk,
  dashboard: "Dashboard", files: "Files", feed: "Activity", shared: "Shared", groups: "Workspaces", stories: "Stories", messages: "Messages", profile: "Profile", settings: "Settings", admin: "Admin",
  login: "Login", register: "Register", reset: "Reset", password: "Password", name: "Name", twofa: "2FA code, if enabled", signIn: "Sign in", createAccount: "Create account", sendReset: "Send reset link", logout: "Logout",
  dark: "Dark", light: "Light", search: "Search files, tags, folders", upload: "Upload", drop: "Drop files here", chooseFiles: "or click to choose multiple files", folder: "Folder", tags: "Tags", visibility: "Visibility",
  private: "Private", link: "Link access", public: "Public", uploadSelected: "Upload selected", open: "Open", shareLink: "Link", trash: "Trash", restore: "Restore",
  noFiles: "No files yet", noActivity: "No activity yet", noMessages: "No messages yet", noNotifications: "No notifications yet", noComments: "No comments yet",
  storage: "Storage used", network: "Network", recent: "Recent files", accessModel: "Access model", accessText: "Private files are streamed through the backend after permission checks. Temporary links expire. Public files appear in the social layer.",
  comments: "Comments", metadata: "Metadata", owner: "Owner", addComment: "Add a comment", comment: "Comment", close: "Close",
  workspaceTitle: "Workspaces", workspaceText: "Private or public spaces for teams, families and communities.", createWorkspace: "Create workspace", description: "Description", recipient: "Recipient", message: "Message", send: "Send",
  security: "Security", quota: "Quota", notifications: "Notifications", plans: "Plans", enable2fa: "Enable 2FA", disable2fa: "Disable 2FA", users: "Users", role: "Role", status: "Status", block: "Block", unblock: "Unblock",
  logs: "Audit logs", system: "System", storyTitle: "Story title", storyBody: "Short update", publishStory: "Publish story", botHint: "Protected sign-in without demo credentials.", forgotHint: "If this email exists, SMTP instructions will be sent.",
  hero: "A private community for secure files", heroText: "Vaultline combines self-hosted storage, social feed, profiles, comments, workspaces and admin control.",
  featureSecure: "Protection", featureSecureText: "CSRF, rate limits, audit logs, signed links, bot filters.", featureSocial: "Social layer", featureSocialText: "Reactions, comments, stories, follows and spaces.", featureDomain: "Own domain", featureDomainText: "Ready for VPS, Caddy, Nginx, Cloudflare Tunnel and ukrainecommunity.pp.ua.",
  dashboardIntro: "Overview of storage, activity, stories and social signals.", filesIntro: "Drag and drop, folders, tags, signed links, preview and trash.", feedIntro: "Events from the public layer, follows and your own files.", storiesIntro: "Short community, file and workspace updates that live for 24 hours.", messagesIntro: "Private discussions around files and spaces.", settingsIntro: "Profile, sessions, 2FA, quotas, privacy and protection.",
  securityText: "The app layer includes CSRF, secure cookies auto mode, rate limiting, anti-spam, bot trap, CSP and audit logs. For real DDoS protection, put Cloudflare Tunnel, Caddy or Nginx in front of Node.js.", plansText: "Free, Family, Team, Community Pro, encrypted archives, OCR, AI-search, watermark, drop-zones, PWA and desktop sync.", adminIntro: "Users, roles, moderation, server, logs, security and domain.",
  adminAccessRequired: "Admin access required", active: "active", members: "members", followers: "followers", spaces: "spaces", all: "All", mine: "Mine", refresh: "Refresh", clear: "Clear", user: "User", storageLabel: "Storage", reports: "reports", maxUpload: "Max upload", antiDdos: "Anti-DDoS: app rate limit + HTTPS proxy",
  userUpdated: "User updated", filesReady: "files ready", chooseFileFirst: "Choose at least one file", uploadComplete: "Upload complete", previewUnavailable: "Preview unavailable", accent: "Accent"
};

languages.splice(0, languages.length, ...cleanLanguages);
Object.assign(uk, fullUk);
translations.uk = uk;
translations.en = fullEn;
for (const [code] of languages) {
  if (code !== "uk" && code !== "en") translations[code] = { ...fullEn };
}

const state = {
  user: null,
  csrfToken: null,
  files: [],
  feed: [],
  users: [],
  groups: [],
  stories: [],
  notifications: [],
  messages: [],
  search: "",
  scope: "all",
  lang: localStorage.getItem("vaultline_lang") || "uk",
  theme: localStorage.getItem("vaultline_theme") || "light"
};

document.documentElement.dataset.theme = state.theme;
document.documentElement.lang = state.lang;

const routes = [
  ["dashboard", "dashboard"],
  ["files", "files"],
  ["feed", "feed"],
  ["shared", "shared"],
  ["groups", "groups"],
  ["stories", "stories"],
  ["messages", "messages"],
  ["profile", "profile"],
  ["settings", "settings"]
];

const t = (key) => (translations[state.lang] && translations[state.lang][key]) || uk[key] || key;
const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));

async function api(path, options = {}) {
  const headers = options.headers || {};
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (state.csrfToken && options.method && options.method !== "GET") headers["x-csrf-token"] = state.csrfToken;
  const response = await fetch(path, { credentials: "include", ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function toast(message) {
  let node = document.querySelector(".toast");
  if (!node) {
    node = document.createElement("div");
    node.className = "toast";
    document.body.appendChild(node);
  }
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(window.vaultlineToast);
  window.vaultlineToast = setTimeout(() => node.classList.remove("show"), 2600);
}

async function bootstrap() {
  try {
    const me = await api("/api/me");
    state.user = me.user;
    state.csrfToken = me.csrfToken;
    await refresh();
  } catch {
    renderAuth();
  }
}

async function refresh() {
  const data = await api("/api/bootstrap");
  Object.assign(state, data, { csrfToken: state.csrfToken });
  renderApp();
}

function currentRoute() {
  return (location.hash.replace("#/", "") || "dashboard").split("?")[0];
}

function languageSelect() {
  return `<select class="lang-select" id="langSelect">${languages.map(([code, label]) => `<option value="${code}" ${state.lang === code ? "selected" : ""}>${label}</option>`).join("")}</select>`;
}

function renderAuth(mode = "login") {
  app.innerHTML = `
    <main class="auth-shell">
      <section class="brand-panel">
        <div>
          <div class="brand-mark">VL</div>
          <h1>Vaultline</h1>
          <p>${escapeHtml(t("heroText"))}</p>
        </div>
        <div>
          <h2 class="auth-hero-title">${escapeHtml(t("hero"))}</h2>
          <div class="feature-row">
            <div class="mini-tile"><strong>${escapeHtml(t("featureSecure"))}</strong><span>${escapeHtml(t("featureSecureText"))}</span></div>
            <div class="mini-tile"><strong>${escapeHtml(t("featureSocial"))}</strong><span>${escapeHtml(t("featureSocialText"))}</span></div>
            <div class="mini-tile"><strong>${escapeHtml(t("featureDomain"))}</strong><span>${escapeHtml(t("featureDomainText"))}</span></div>
          </div>
        </div>
      </section>
      <section class="auth-card">
        <div class="auth-top">${languageSelect()}</div>
        <div class="tabs">
          <button class="tab ${mode === "login" ? "active" : ""}" data-auth="login">${escapeHtml(t("login"))}</button>
          <button class="tab ${mode === "register" ? "active" : ""}" data-auth="register">${escapeHtml(t("register"))}</button>
          <button class="tab ${mode === "forgot" ? "active" : ""}" data-auth="forgot">${escapeHtml(t("reset"))}</button>
        </div>
        ${mode === "register" ? registerForm() : mode === "forgot" ? forgotForm() : loginForm()}
      </section>
    </main>
  `;
  bindLanguage();
  document.querySelectorAll("[data-auth]").forEach((button) => button.addEventListener("click", () => renderAuth(button.dataset.auth)));
  document.querySelector("form")?.addEventListener("submit", handleAuth);
  document.querySelector("#sendEmailCode")?.addEventListener("click", sendEmailCode);
}

function honeypot() {
  return `<input class="hp-field" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" /><input type="hidden" name="form_started_at" value="${Date.now()}" />`;
}

function loginForm() {
  return `
    <form class="form" data-mode="login">
      ${honeypot()}
      <div class="field"><label>${escapeHtml(t("email"))}</label><input name="email" type="email" autocomplete="email" required /></div>
      <div class="field"><label>${escapeHtml(t("password"))}</label><input name="password" type="password" autocomplete="current-password" required /></div>
      <div class="field"><label>${escapeHtml(t("twofa"))}</label><input name="code" inputmode="numeric" placeholder="000000" /></div>
      <button class="primary">${escapeHtml(t("signIn"))}</button>
      <p class="muted">${escapeHtml(t("botHint"))}</p>
    </form>
  `;
}

function registerForm() {
  return `
    <form class="form" data-mode="register">
      ${honeypot()}
      <div class="field"><label>${escapeHtml(t("name"))}</label><input name="name" autocomplete="name" required /></div>
      <div class="field"><label>${escapeHtml(t("email"))}</label><input name="email" type="email" autocomplete="email" required /></div>
      <button class="ghost" type="button" id="sendEmailCode">Send email code</button>
      <div class="field"><label>Email code</label><input name="emailCode" inputmode="numeric" maxlength="6" placeholder="000000" /></div>
      <div class="field"><label>${escapeHtml(t("password"))}</label><input name="password" type="password" minlength="8" autocomplete="new-password" required /></div>
      <button class="primary">${escapeHtml(t("createAccount"))}</button>
    </form>
  `;
}

function forgotForm() {
  return `
    <form class="form" data-mode="forgot">
      ${honeypot()}
      <div class="field"><label>${escapeHtml(t("email"))}</label><input name="email" type="email" autocomplete="email" required /></div>
      <button class="primary">${escapeHtml(t("sendReset"))}</button>
      <p class="muted">${escapeHtml(t("forgotHint"))}</p>
    </form>
  `;
}

async function sendEmailCode() {
  const form = document.querySelector("form[data-mode='register']");
  const email = form?.querySelector("input[name='email']")?.value.trim();
  if (!email) {
    toast("Enter email first");
    return;
  }
  try {
    await api("/api/auth/email-code", { method: "POST", body: JSON.stringify({ email }) });
    toast("Email code sent");
  } catch (error) {
    toast(error.message);
  }
}

async function handleAuth(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const body = Object.fromEntries(new FormData(form).entries());
  try {
    const mode = form.dataset.mode;
    if (mode === "forgot") {
      await api("/api/auth/forgot", { method: "POST", body: JSON.stringify(body) });
      toast(t("sendReset"));
      return;
    }
    const data = await api(`/api/auth/${mode}`, { method: "POST", body: JSON.stringify(body) });
    state.user = data.user;
    state.csrfToken = data.csrfToken;
    location.hash = "#/dashboard";
    await refresh();
  } catch (error) {
    toast(error.message);
  }
}

function renderApp() {
  const route = currentRoute();
  const adminRoute = state.user.role === "admin" || state.user.role === "moderator";
  app.innerHTML = `
    <main class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="side-brand"><div class="brand-mark">VL</div><div><strong>Vaultline</strong><div class="muted">ukrainecommunity.pp.ua</div></div></div>
        <nav class="nav">
          ${routes.map(([key, label]) => `<button class="${route === key ? "active" : ""}" data-route="${key}"><span>${escapeHtml(t(label))}</span></button>`).join("")}
          ${adminRoute ? `<button class="${route === "admin" ? "active" : ""}" data-route="admin"><span>${escapeHtml(t("admin"))}</span></button>` : ""}
        </nav>
      </aside>
      <section class="main">
        <header class="topbar">
          <div class="top-actions">
            <button class="icon-btn mobile-menu" id="menuBtn">Menu</button>
            <input class="search" id="globalSearch" placeholder="${escapeHtml(t("search"))}" value="${escapeHtml(state.search)}" />
          </div>
          <div class="top-actions">
            ${languageSelect()}
            <button class="ghost" id="themeBtn">${escapeHtml(state.theme === "dark" ? t("light") : t("dark"))}</button>
            <button class="ghost" id="logoutBtn">${escapeHtml(t("logout"))}</button>
            <div class="avatar">${escapeHtml(state.user.avatar)}</div>
          </div>
        </header>
        <div class="content">${view(route)}</div>
      </section>
    </main>
    <div class="modal" id="modal"></div>
  `;
  bindAppEvents();
}

function bindLanguage() {
  document.querySelector("#langSelect")?.addEventListener("change", (event) => {
    state.lang = event.target.value;
    localStorage.setItem("vaultline_lang", state.lang);
    document.documentElement.lang = state.lang;
    state.user ? renderApp() : renderAuth();
  });
}

function bindAppEvents() {
  bindLanguage();
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      location.hash = `#/${button.dataset.route}`;
      document.querySelector("#sidebar")?.classList.remove("open");
      renderApp();
    });
  });
  document.querySelector("#menuBtn")?.addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
  document.querySelector("#logoutBtn").addEventListener("click", async () => {
    await api("/api/auth/logout", { method: "POST", body: JSON.stringify({}) });
    state.user = null;
    renderAuth();
  });
  document.querySelector("#themeBtn").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("vaultline_theme", state.theme);
    document.documentElement.dataset.theme = state.theme;
    renderApp();
  });
  document.querySelector("#globalSearch").addEventListener("input", (event) => {
    state.search = event.target.value;
    if (currentRoute() === "files") renderApp();
  });
  bindViewEvents();
}

function view(route) {
  if (route === "files") return filesView();
  if (route === "feed") return feedView();
  if (route === "shared") return sharedView();
  if (route === "groups") return groupsView();
  if (route === "stories") return storiesView();
  if (route === "messages") return messagesView();
  if (route === "profile") return profileView(state.user);
  if (route === "settings") return settingsView();
  if (route === "admin") return adminView();
  return dashboardView();
}

function dashboardView() {
  const used = state.user.usedBytes || 0;
  const quota = state.user.quotaBytes || 1;
  const latest = state.files.filter((file) => !file.deletedAt).slice(0, 4);
  return `
    <div class="view-head"><div><h1>${escapeHtml(t("dashboard"))}</h1><p class="muted">${escapeHtml(t("dashboardIntro"))}</p></div><button class="primary" data-route="files">${escapeHtml(t("upload"))}</button></div>
    ${storiesStrip()}
    <div class="grid cols-3">
      <div class="panel metric"><span class="muted">${escapeHtml(t("storage"))}</span><strong>${formatBytes(used)}</strong><div class="progress"><span style="width:${Math.min(100, (used / quota) * 100)}%"></span></div></div>
      <div class="panel metric"><span class="muted">${escapeHtml(t("files"))}</span><strong>${state.files.filter((file) => !file.deletedAt).length}</strong><span class="muted">${state.files.filter((file) => file.visibility === "public").length} ${escapeHtml(t("public"))}</span></div>
      <div class="panel metric"><span class="muted">${escapeHtml(t("network"))}</span><strong>${state.user.followersCount}</strong><span class="muted">${state.groups.length} ${escapeHtml(t("spaces"))}</span></div>
    </div>
    <div class="grid cols-2" style="margin-top:14px">
      <div class="panel"><h2>${escapeHtml(t("recent"))}</h2><div class="file-grid" style="margin-top:12px">${latest.map(fileCard).join("") || empty(t("noFiles"))}</div></div>
      <div class="panel"><h2>${escapeHtml(t("feed"))}</h2>${activityList(state.feed.slice(0, 8))}</div>
    </div>
  `;
}

function storiesStrip() {
  const cards = state.stories.slice(0, 8).map((story) => `
    <article class="story-chip ${escapeHtml(story.accent || "cyan")}">
      <div class="avatar">${escapeHtml(story.author?.avatar || "VL")}</div>
      <div><strong>${escapeHtml(story.title)}</strong><span>${escapeHtml(story.author?.name || "Vaultline")}</span></div>
    </article>
  `).join("");
  return `<div class="stories-strip">${cards || `<article class="story-chip cyan"><div class="avatar">VL</div><div><strong>${escapeHtml(t("stories"))}</strong><span>${escapeHtml(t("publishStory"))}</span></div></article>`}</div>`;
}

function filesView(scope = state.scope) {
  const files = state.files
    .filter((file) => scope === "trash" ? file.deletedAt : !file.deletedAt)
    .filter((file) => scope === "mine" ? file.ownerId === state.user.id : true)
    .filter((file) => scope === "shared" ? file.ownerId !== state.user.id || file.visibility !== "private" : true)
    .filter((file) => `${file.name} ${file.folder} ${file.tags.join(" ")}`.toLowerCase().includes(state.search.toLowerCase()));
  return `
    <div class="view-head"><div><h1>${escapeHtml(t("files"))}</h1><p class="muted">${escapeHtml(t("filesIntro"))}</p></div></div>
    <div class="grid cols-2">
      <div class="panel">
        <form id="uploadForm" class="form">
          <div class="dropzone" id="dropzone"><div><strong>${escapeHtml(t("drop"))}</strong><div class="muted">${escapeHtml(t("chooseFiles"))}</div></div><input id="fileInput" name="files" type="file" multiple hidden /></div>
          <div class="grid cols-3">
            <div class="field"><label>${escapeHtml(t("folder"))}</label><input name="folder" value="Inbox" /></div>
            <div class="field"><label>${escapeHtml(t("tags"))}</label><input name="tags" placeholder="docs, personal" /></div>
            <div class="field"><label>${escapeHtml(t("visibility"))}</label><select name="visibility"><option value="private">${escapeHtml(t("private"))}</option><option value="link">${escapeHtml(t("link"))}</option><option value="public">${escapeHtml(t("public"))}</option></select></div>
          </div>
          <button class="primary">${escapeHtml(t("uploadSelected"))}</button>
        </form>
      </div>
      <div class="panel">
        <h2>${escapeHtml(t("accessModel"))}</h2>
        <p class="muted">${escapeHtml(t("accessText"))}</p>
        <div class="pill-row"><span class="pill">CSRF</span><span class="pill">Rate limit</span><span class="pill">Bot trap</span><span class="pill">Audit logs</span><span class="pill">Signed URLs</span></div>
      </div>
    </div>
    <div class="panel" style="margin-top:14px">
      <div class="toolbar">
        <input class="search" id="fileSearch" placeholder="${escapeHtml(t("search"))}" value="${escapeHtml(state.search)}" />
        <select id="scopeSelect"><option value="all">${escapeHtml(t("all"))}</option><option value="mine">${escapeHtml(t("mine"))}</option><option value="shared">${escapeHtml(t("shared"))}</option><option value="trash">${escapeHtml(t("trash"))}</option></select>
        <button class="ghost" id="refreshBtn">${escapeHtml(t("refresh"))}</button>
        <button class="ghost" id="clearSearch">${escapeHtml(t("clear"))}</button>
      </div>
      <div class="file-grid">${files.map(fileCard).join("") || empty(t("noFiles"))}</div>
    </div>
  `;
}

function sharedView() {
  state.scope = "shared";
  return filesView("shared");
}

function fileCard(file) {
  const isImage = file.mime?.startsWith("image/");
  return `
    <article class="file-card">
      <div class="file-thumb">${isImage ? `<img src="/api/files/${file.id}/raw" alt="" />` : escapeHtml(file.name.split(".").pop()?.toUpperCase() || "FILE")}</div>
      <div>
        <div class="file-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</div>
        <div class="muted">${formatBytes(file.size)} · ${escapeHtml(file.folder || "Inbox")}</div>
      </div>
      <div class="pill-row"><span class="pill">${escapeHtml(file.visibility)}</span>${file.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="card-actions">
        <button class="ghost" data-preview="${file.id}">${escapeHtml(t("open"))}</button>
        <button class="heart-btn ${file.reacted ? "liked" : ""}" data-react="${file.id}" title="Reaction"><span class="heart-shape"></span><span>${file.reactionsCount}</span></button>
        ${file.deletedAt ? `<button class="ghost" data-restore="${file.id}">${escapeHtml(t("restore"))}</button>` : `<button class="ghost" data-signed="${file.id}">${escapeHtml(t("shareLink"))}</button>`}
        ${file.canEdit && !file.deletedAt ? `<button class="danger" data-delete="${file.id}">${escapeHtml(t("trash"))}</button>` : ""}
      </div>
    </article>
  `;
}

function feedView() {
  return `<div class="view-head"><div><h1>${escapeHtml(t("feed"))}</h1><p class="muted">${escapeHtml(t("feedIntro"))}</p></div></div><div class="panel">${activityList(state.feed)}</div>`;
}

function activityList(items) {
  return items.map((item) => `
    <div class="activity">
      <div class="avatar">${escapeHtml(item.actor?.avatar || "VL")}</div>
      <div><strong>${escapeHtml(item.actor?.name || "System")}</strong> ${escapeHtml(item.text)}<div class="muted">${new Date(item.createdAt).toLocaleString()}</div></div>
    </div>
  `).join("") || empty(t("noActivity"));
}

function groupsView() {
  return `
    <div class="view-head"><div><h1>${escapeHtml(t("workspaceTitle"))}</h1><p class="muted">${escapeHtml(t("workspaceText"))}</p></div></div>
    <div class="grid cols-2">
      <div class="panel">
        <form id="groupForm" class="form">
          ${honeypot()}
          <div class="field"><label>${escapeHtml(t("name"))}</label><input name="name" required /></div>
          <div class="field"><label>${escapeHtml(t("description"))}</label><textarea name="description"></textarea></div>
          <div class="field"><label>${escapeHtml(t("visibility"))}</label><select name="visibility"><option value="private">${escapeHtml(t("private"))}</option><option value="public">${escapeHtml(t("public"))}</option></select></div>
          <button class="primary">${escapeHtml(t("createWorkspace"))}</button>
        </form>
      </div>
      <div class="grid">${state.groups.map((group) => `<div class="panel"><h3>${escapeHtml(group.name)}</h3><p class="muted">${escapeHtml(group.description)}</p><div class="pill-row"><span class="pill">${escapeHtml(group.visibility)}</span><span class="pill">${group.members.length} ${escapeHtml(t("members"))}</span></div></div>`).join("")}</div>
    </div>
  `;
}

function storiesView() {
  return `
    <div class="view-head"><div><h1>${escapeHtml(t("stories"))}</h1><p class="muted">${escapeHtml(t("storiesIntro"))}</p></div></div>
    <div class="grid cols-2">
      <div class="panel">
        <form id="storyForm" class="form">
          ${honeypot()}
          <div class="field"><label>${escapeHtml(t("storyTitle"))}</label><input name="title" required /></div>
          <div class="field"><label>${escapeHtml(t("storyBody"))}</label><textarea name="body" required></textarea></div>
          <div class="field"><label>${escapeHtml(t("accent"))}</label><select name="accent"><option value="cyan">Cyan</option><option value="pink">Pink</option><option value="green">Green</option><option value="graphite">Graphite</option></select></div>
          <button class="primary">${escapeHtml(t("publishStory"))}</button>
        </form>
      </div>
      <div class="story-grid">${state.stories.map((story) => `<article class="story-card ${escapeHtml(story.accent)}"><div class="avatar">${escapeHtml(story.author?.avatar || "VL")}</div><h3>${escapeHtml(story.title)}</h3><p>${escapeHtml(story.body)}</p><span>${escapeHtml(story.author?.name || "Vaultline")}</span></article>`).join("") || empty(t("noActivity"))}</div>
    </div>
  `;
}

function messagesView() {
  const recipients = state.users.filter((user) => user.id !== state.user.id);
  return `
    <div class="view-head"><div><h1>${escapeHtml(t("messages"))}</h1><p class="muted">${escapeHtml(t("messagesIntro"))}</p></div></div>
    <div class="grid cols-2">
      <div class="panel">
        <form id="messageForm" class="form">
          ${honeypot()}
          <div class="field"><label>${escapeHtml(t("recipient"))}</label><select name="toId">${recipients.map((user) => `<option value="${user.id}">${escapeHtml(user.name)}</option>`).join("")}</select></div>
          <div class="field"><label>${escapeHtml(t("message"))}</label><textarea name="body" required></textarea></div>
          <button class="primary">${escapeHtml(t("send"))}</button>
        </form>
      </div>
      <div class="panel">${state.messages.slice().reverse().map((message) => {
        const from = state.users.find((user) => user.id === message.fromId);
        const to = state.users.find((user) => user.id === message.toId);
        return `<div class="activity"><div class="avatar">${escapeHtml(from?.avatar)}</div><div><strong>${escapeHtml(from?.name)}</strong> → ${escapeHtml(to?.name)}<p>${escapeHtml(message.body)}</p><div class="muted">${new Date(message.createdAt).toLocaleString()}</div></div></div>`;
      }).join("") || empty(t("noMessages"))}</div>
    </div>
  `;
}

function profileView(user) {
  const stats = {
    files: state.files.filter((file) => file.ownerId === user.id && !file.deletedAt).length,
    public: state.files.filter((file) => file.ownerId === user.id && file.visibility === "public").length
  };
  return `
    <div class="panel">
      <div class="view-head">
        <div style="display:flex;gap:14px;align-items:center"><div class="avatar" style="width:72px;height:72px">${escapeHtml(user.avatar)}</div><div><h1>${escapeHtml(user.name)}</h1><p class="muted">${escapeHtml(user.bio)}</p></div></div>
      </div>
      <div class="grid cols-3">
        <div class="mini-tile"><strong>${stats.files}</strong><span>${escapeHtml(t("files"))}</span></div>
        <div class="mini-tile"><strong>${stats.public}</strong><span>${escapeHtml(t("public"))}</span></div>
        <div class="mini-tile"><strong>${user.followersCount}</strong><span>${escapeHtml(t("followers"))}</span></div>
      </div>
    </div>
  `;
}

function settingsView() {
  return `
    <div class="view-head"><div><h1>${escapeHtml(t("settings"))}</h1><p class="muted">${escapeHtml(t("settingsIntro"))}</p></div></div>
    <div class="grid cols-2">
      <div class="panel"><h2>${escapeHtml(t("security"))}</h2><p class="muted">${escapeHtml(t("securityText"))}</p><button class="primary" id="toggle2fa">${escapeHtml(state.user.twoFactorEnabled ? t("disable2fa") : t("enable2fa"))}</button></div>
      <div class="panel"><h2>${escapeHtml(t("quota"))}</h2><p class="muted">${formatBytes(state.user.usedBytes)} / ${formatBytes(state.user.quotaBytes)}</p><div class="progress"><span style="width:${Math.min(100, (state.user.usedBytes / state.user.quotaBytes) * 100)}%"></span></div></div>
      <div class="panel"><h2>${escapeHtml(t("notifications"))}</h2>${state.notifications.map((item) => `<div class="activity"><div class="avatar">NT</div><div>${escapeHtml(item.body)}<div class="muted">${new Date(item.createdAt).toLocaleString()}</div></div></div>`).join("") || empty(t("noNotifications"))}</div>
      <div class="panel"><h2>${escapeHtml(t("plans"))}</h2><p class="muted">${escapeHtml(t("plansText"))}</p></div>
    </div>
  `;
}

function adminView() {
  if (state.user.role !== "admin" && state.user.role !== "moderator") return empty(t("adminAccessRequired"));
  return `
    <div class="view-head"><div><h1>${escapeHtml(t("admin"))}</h1><p class="muted">${escapeHtml(t("adminIntro"))}</p></div><button class="ghost" id="loadAdmin">${escapeHtml(t("refresh"))}</button></div>
    <div id="adminContent" class="grid"></div>
  `;
}

function renderAdmin(data, users) {
  document.querySelector("#adminContent").innerHTML = `
    <div class="grid cols-3">
      <div class="panel metric"><span class="muted">${escapeHtml(t("users"))}</span><strong>${data.users}</strong><span>${data.activeUsers} ${escapeHtml(t("active"))}</span></div>
      <div class="panel metric"><span class="muted">${escapeHtml(t("files"))}</span><strong>${data.files}</strong><span>${data.publicFiles} ${escapeHtml(t("public"))}</span></div>
      <div class="panel metric"><span class="muted">${escapeHtml(t("storageLabel"))}</span><strong>${formatBytes(data.usedBytes)}</strong><span>${data.reports} ${escapeHtml(t("reports"))}</span></div>
    </div>
    <div class="panel"><h2>${escapeHtml(t("users"))}</h2><table class="table"><thead><tr><th>${escapeHtml(t("user"))}</th><th>${escapeHtml(t("role"))}</th><th>${escapeHtml(t("status"))}</th><th>${escapeHtml(t("quota"))}</th><th></th></tr></thead><tbody>
      ${users.map((user) => `<tr><td>${escapeHtml(user.name)}<div class="muted">${escapeHtml(user.email)}</div></td><td>${user.role}</td><td>${user.status}</td><td>${formatBytes(user.quotaBytes)}</td><td><button class="ghost" data-block="${user.id}" data-status="${user.status === "active" ? "blocked" : "active"}">${escapeHtml(user.status === "active" ? t("block") : t("unblock"))}</button></td></tr>`).join("")}
    </tbody></table></div>
    <div class="panel"><h2>${escapeHtml(t("logs"))}</h2>${data.logs.map((log) => `<div class="activity"><div class="avatar">LG</div><div><strong>${escapeHtml(log.action)}</strong><div class="muted">${new Date(log.createdAt).toLocaleString()} · ${escapeHtml(JSON.stringify(log.meta || {}))}</div></div></div>`).join("")}</div>
    <div class="panel"><h2>${escapeHtml(t("system"))}</h2><div class="pill-row"><span class="pill">Domain: ${escapeHtml(data.settings.domain)}</span><span class="pill">Backups: ${escapeHtml(data.settings.backups)}</span><span class="pill">${escapeHtml(t("maxUpload"))}: ${formatBytes(data.settings.maxUploadBytes)}</span><span class="pill">${escapeHtml(t("antiDdos"))}</span></div></div>
  `;
  document.querySelectorAll("[data-block]").forEach((button) => {
    button.addEventListener("click", async () => {
      await api(`/api/admin/users/${button.dataset.block}`, { method: "PATCH", body: JSON.stringify({ status: button.dataset.status }) });
      toast(t("userUpdated"));
      await loadAdmin();
    });
  });
}

function empty(text) {
  return `<div class="muted" style="padding:18px 0">${escapeHtml(text)}</div>`;
}

function bindViewEvents() {
  const dropzone = document.querySelector("#dropzone");
  const fileInput = document.querySelector("#fileInput");
  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());
    ["dragenter", "dragover"].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add("drag");
    }));
    ["dragleave", "drop"].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.remove("drag");
    }));
    dropzone.addEventListener("drop", (event) => {
      fileInput.files = event.dataTransfer.files;
      toast(`${fileInput.files.length} ${t("filesReady")}`);
    });
    document.querySelector("#uploadForm").addEventListener("submit", uploadFiles);
  }
  document.querySelector("#fileSearch")?.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderApp();
  });
  document.querySelector("#scopeSelect")?.addEventListener("change", (event) => {
    state.scope = event.target.value;
    renderApp();
  });
  document.querySelector("#clearSearch")?.addEventListener("click", () => {
    state.search = "";
    renderApp();
  });
  document.querySelector("#refreshBtn")?.addEventListener("click", refresh);
  document.querySelectorAll("[data-preview]").forEach((button) => button.addEventListener("click", () => openPreview(button.dataset.preview)));
  document.querySelectorAll("[data-react]").forEach((button) => button.addEventListener("click", async () => {
    button.classList.add("pop");
    await api(`/api/files/${button.dataset.react}/react`, { method: "POST", body: JSON.stringify({}) });
    await refresh();
  }));
  document.querySelectorAll("[data-signed]").forEach((button) => button.addEventListener("click", async () => {
    const data = await api(`/api/files/${button.dataset.signed}/signed`, { method: "POST", body: JSON.stringify({}) });
    await navigator.clipboard?.writeText(data.url).catch(() => {});
    toast(data.url);
    await refresh();
  }));
  document.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", async () => {
    await api(`/api/files/${button.dataset.delete}`, { method: "DELETE", body: JSON.stringify({}) });
    toast(t("trash"));
    await refresh();
  }));
  document.querySelectorAll("[data-restore]").forEach((button) => button.addEventListener("click", async () => {
    await api(`/api/files/${button.dataset.restore}/restore`, { method: "POST", body: JSON.stringify({}) });
    toast(t("restore"));
    await refresh();
  }));
  document.querySelector("#groupForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await api("/api/groups", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
    await refresh();
  });
  document.querySelector("#storyForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await api("/api/stories", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
    await refresh();
  });
  document.querySelector("#messageForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await api("/api/messages", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
    toast(t("send"));
    await refresh();
  });
  document.querySelector("#toggle2fa")?.addEventListener("click", async () => {
    const data = await api("/api/settings/security", { method: "PATCH", body: JSON.stringify({ twoFactorEnabled: !state.user.twoFactorEnabled }) });
    state.user = data.user;
    toast(data.user.twoFactorEnabled ? `2FA: ${data.demoCode}` : "2FA off");
    renderApp();
  });
  document.querySelector("#loadAdmin")?.addEventListener("click", loadAdmin);
  if (currentRoute() === "admin") loadAdmin();
}

async function uploadFiles(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  if (!formData.getAll("files").some((file) => file instanceof File && file.size)) {
    toast(t("chooseFileFirst"));
    return;
  }
  try {
    await api("/api/files", { method: "POST", body: formData, headers: {} });
    form.reset();
    toast(t("uploadComplete"));
    await refresh();
  } catch (error) {
    toast(error.message);
  }
}

async function openPreview(fileId) {
  const file = state.files.find((item) => item.id === fileId);
  if (!file) return;
  const modal = document.querySelector("#modal");
  const raw = `/api/files/${file.id}/raw`;
  let preview = `<div class="preview"><span class="muted">${escapeHtml(t("previewUnavailable"))}</span></div>`;
  if (file.mime?.startsWith("image/")) preview = `<div class="preview"><img src="${raw}" alt="${escapeHtml(file.name)}" /></div>`;
  else if (file.mime?.startsWith("video/")) preview = `<div class="preview"><video src="${raw}" controls></video></div>`;
  else if (file.mime === "application/pdf") preview = `<div class="preview"><iframe src="${raw}"></iframe></div>`;
  else if (file.mime?.startsWith("text/") || /\.(txt|md|json|csv|log)$/i.test(file.name)) {
    const text = await fetch(raw, { credentials: "include" }).then((response) => response.text()).catch(() => "");
    preview = `<pre class="preview" style="place-items:start;white-space:pre-wrap;padding:18px">${escapeHtml(text.slice(0, 12000))}</pre>`;
  }
  modal.innerHTML = `
    <div class="modal-panel">
      <div class="view-head"><div><h2>${escapeHtml(file.name)}</h2><p class="muted">${formatBytes(file.size)} · ${escapeHtml(file.mime)}</p></div><button class="ghost" id="closeModal">${escapeHtml(t("close"))}</button></div>
      ${preview}
      <div class="grid cols-2" style="margin-top:14px">
        <div class="panel"><h3>${escapeHtml(t("comments"))}</h3>${file.comments.map((comment) => `<div class="activity"><div class="avatar">${escapeHtml(comment.author?.avatar)}</div><div><strong>${escapeHtml(comment.author?.name)}</strong><p>${escapeHtml(comment.text)}</p><div class="muted">${new Date(comment.createdAt).toLocaleString()}</div></div></div>`).join("") || empty(t("noComments"))}
        <form id="commentForm" class="form">${honeypot()}<textarea name="text" placeholder="${escapeHtml(t("addComment"))}"></textarea><button class="primary">${escapeHtml(t("comment"))}</button></form></div>
        <div class="panel"><h3>${escapeHtml(t("metadata"))}</h3><p class="muted">${escapeHtml(t("owner"))}: ${escapeHtml(file.owner?.name)}<br />${escapeHtml(t("folder"))}: ${escapeHtml(file.folder)}<br />${escapeHtml(t("visibility"))}: ${escapeHtml(file.visibility)}</p><div class="pill-row">${file.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}</div></div>
      </div>
    </div>
  `;
  modal.classList.add("open");
  document.querySelector("#closeModal").addEventListener("click", () => modal.classList.remove("open"));
  document.querySelector("#commentForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await api(`/api/files/${file.id}/comment`, { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
    await refresh();
    openPreview(file.id);
  });
}

async function loadAdmin() {
  try {
    const [stats, users] = await Promise.all([api("/api/admin/stats"), api("/api/admin/users")]);
    renderAdmin(stats, users.users);
  } catch (error) {
    toast(error.message);
  }
}

window.addEventListener("hashchange", () => state.user ? renderApp() : renderAuth());
bootstrap();