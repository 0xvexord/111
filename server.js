const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
const ENV_FILE = path.join(ROOT, ".env");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (!key || process.env[key] != null) continue;
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(ENV_FILE);

let nodemailer = null;
try {
  nodemailer = require("nodemailer");
} catch {
  nodemailer = null;
}

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "0.0.0.0";
const PUBLIC_DOMAIN = process.env.PUBLIC_DOMAIN || "ukrainecommunity.pp.ua";
const BASE_URL = process.env.BASE_URL || `https://${PUBLIC_DOMAIN}`;
const COOKIE_SECURE = String(process.env.COOKIE_SECURE || "auto").toLowerCase();
const TRUST_PROXY = String(process.env.TRUST_PROXY || "true").toLowerCase() === "true";
const REQUIRE_EMAIL_CODE = String(process.env.REQUIRE_EMAIL_CODE || "false").toLowerCase() === "true";
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER || `Vaultline <no-reply@${PUBLIC_DOMAIN}>`;
const ALLOWED_HOSTS = new Set(
  String(process.env.ALLOWED_HOSTS || `${PUBLIC_DOMAIN},www.${PUBLIC_DOMAIN},localhost,127.0.0.1,[::1]`)
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
);
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");
const STORAGE_DIR = path.join(ROOT, "storage");
const DB_FILE = path.join(DATA_DIR, "db.json");
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const MAX_JSON_BYTES = 256 * 1024;
const MAX_TEXT_FIELD = 1200;
const MAX_FAILED_LOGIN = 6;
const LOGIN_LOCK_MS = 1000 * 60 * 15;
const ALLOWED_UPLOAD_MIMES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/json",
  "text/csv",
  "application/zip",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
]);
const BLOCKED_EXTENSIONS = new Set([".exe", ".bat", ".cmd", ".ps1", ".sh", ".scr", ".msi", ".com", ".vbs", ".js", ".jar", ".dll"]);
const rateBuckets = new Map();

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(STORAGE_DIR, { recursive: true });

const now = () => new Date().toISOString();
const id = (prefix) => `${prefix}_${crypto.randomBytes(10).toString("hex")}`;
const sha256 = (value) => crypto.createHash("sha256").update(String(value)).digest("hex");
const timingSafe = (a, b) => {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
};

function clientIp(req) {
  if (TRUST_PROXY) {
    const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if (forwarded) return forwarded;
    if (req.headers["x-real-ip"]) return String(req.headers["x-real-ip"]);
  }
  return req.socket.remoteAddress || "unknown";
}

function hostWithoutPort(value) {
  const host = String(value || "").trim().toLowerCase();
  if (!host) return "";
  if (host.startsWith("[")) return host.split("]")[0] + "]";
  return host.split(":")[0];
}

function requestHostAllowed(req) {
  if (!ALLOWED_HOSTS.size) return true;
  const host = hostWithoutPort(req.headers.host);
  if (!host) return false;
  if (ALLOWED_HOSTS.has(host)) return true;
  if (/^(10\.|127\.|172\.(1[6-9]|2\d|3[0-1])\.|192\.168\.)/.test(host)) return true;
  return false;
}

function requestIsSecure(req) {
  if (req.socket.encrypted) return true;
  if (TRUST_PROXY && String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim().toLowerCase() === "https") return true;
  if (TRUST_PROXY && String(req.headers["cf-visitor"] || "").includes('"scheme":"https"')) return true;
  return false;
}

function shouldUseSecureCookie(req) {
  if (COOKIE_SECURE === "true") return true;
  if (COOKIE_SECURE === "false") return false;
  return requestIsSecure(req);
}

function rateLimit(req, res, name, limit, windowMs) {
  const key = `${name}:${clientIp(req)}`;
  const current = Date.now();
  const bucket = rateBuckets.get(key) || { count: 0, resetAt: current + windowMs };
  if (bucket.resetAt <= current) {
    bucket.count = 0;
    bucket.resetAt = current + windowMs;
  }
  bucket.count += 1;
  rateBuckets.set(key, bucket);
  res.setHeader("X-RateLimit-Limit", String(limit));
  res.setHeader("X-RateLimit-Remaining", String(Math.max(0, limit - bucket.count)));
  if (bucket.count > limit) {
    addAudit(null, "security.rate_limited", { name, ip: clientIp(req), path: req.url });
    saveDb(db);
    send(res, 429, { error: "Too many requests. Please slow down." });
    return false;
  }
  return true;
}

function cleanupRateBuckets() {
  const current = Date.now();
  for (const [key, bucket] of rateBuckets.entries()) {
    if (bucket.resetAt <= current) rateBuckets.delete(key);
  }
}

setInterval(cleanupRateBuckets, 60 * 1000).unref();

function hasBotTrap(body) {
  const startedAt = Number(body.form_started_at || body.formStartedAt || 0);
  const submittedTooFast = startedAt > 0 && Date.now() - startedAt < 800;
  return Boolean(body.website || body.homepage || body.company_url || submittedTooFast);
}

function hasDangerousInput(value) {
  const text = String(value || "").toLowerCase();
  if (!text) return false;
  const patterns = [
    /<\s*script/i,
    /javascript\s*:/i,
    /\bonerror\s*=/i,
    /\bonload\s*=/i,
    /\$\s*\(/,
    /`[^`]*`/,
    /&&|\|\|/,
    /;\s*(rm|del|erase|format|shutdown|reboot|curl|wget|powershell|cmd|bash|sh|python|node)\b/i,
    /\b(powershell|cmd\.exe|bash|chmod|chown|sudo|nc -|ncat|sqlmap|union select|drop table)\b/i
  ];
  return patterns.some((pattern) => pattern.test(text));
}

function tooSpammy(value) {
  const text = String(value || "");
  const links = (text.match(/https?:\/\//gi) || []).length;
  const repeats = /(.)\1{12,}/.test(text);
  return links > 3 || repeats;
}

function validateTextFields(body, fields) {
  if (hasBotTrap(body)) return "Bot trap field was filled";
  for (const field of fields) {
    const value = body[field];
    if (value == null) continue;
    if (String(value).length > MAX_TEXT_FIELD) return `${field} is too long`;
    if (hasDangerousInput(value)) return `${field} contains blocked commands or script-like content`;
    if (tooSpammy(value)) return `${field} looks like spam`;
  }
  return null;
}

function normalizeText(value, max = MAX_TEXT_FIELD) {
  return String(value || "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").trim().slice(0, max);
}

function passwordStrengthError(password) {
  if (password.length < 10) return "Password must be at least 10 characters";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) return "Password must include upper and lower case letters";
  if (!/\d/.test(password)) return "Password must include a number";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must include a symbol";
  return null;
}

function requestOriginAllowed(req) {
  const origin = req.headers.origin || req.headers.referer;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function isUploadAllowed(fileName, mime, content) {
  const extension = path.extname(fileName).toLowerCase();
  if (BLOCKED_EXTENSIONS.has(extension)) return false;
  if (mime && ALLOWED_UPLOAD_MIMES.has(mime)) return true;
  if (!mime || mime === "application/octet-stream") {
    const header = content.subarray(0, 16).toString("hex");
    if (header.startsWith("89504e47") || header.startsWith("ffd8ff") || header.startsWith("25504446")) return true;
    return [".txt", ".md", ".csv", ".json", ".zip"].includes(extension);
  }
  return false;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  const [algo, salt, expected] = String(stored || "").split("$");
  if (algo !== "scrypt" || !salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString("hex");
  return timingSafe(actual, expected);
}

function seedDb() {
  const adminId = id("usr");
  const demoId = id("usr");
  const groupId = id("grp");
  return {
    users: [
      {
        id: adminId,
        name: "Admin Vaultline",
        email: "admin@vaultline.local",
        passwordHash: hashPassword("Admin123!"),
        role: "admin",
        status: "active",
        avatar: "AV",
        bio: "Platform owner and security reviewer.",
        quotaBytes: 5 * 1024 * 1024 * 1024,
        twoFactorEnabled: false,
        twoFactorSecret: crypto.randomBytes(12).toString("hex"),
        followers: [],
        following: [],
        createdAt: now()
      },
      {
        id: demoId,
        name: "Demo User",
        email: "demo@vaultline.local",
        passwordHash: hashPassword("Demo123!"),
        role: "user",
        status: "active",
        avatar: "DU",
        bio: "Keeps documents, galleries and shared collections in one calm place.",
        quotaBytes: 2 * 1024 * 1024 * 1024,
        twoFactorEnabled: false,
        twoFactorSecret: crypto.randomBytes(12).toString("hex"),
        followers: [adminId],
        following: [],
        createdAt: now()
      }
    ],
    files: [],
    groups: [
      {
        id: groupId,
        name: "Private Design Space",
        description: "Shared workspace for moodboards, briefs and reviewed assets.",
        ownerId: adminId,
        visibility: "private",
        members: [adminId, demoId],
        createdAt: now()
      }
    ],
    messages: [
      {
        id: id("msg"),
        fromId: adminId,
        toId: demoId,
        body: "Welcome to Vaultline. Upload a few files and try a signed link.",
        createdAt: now(),
        readAt: null
      }
    ],
    notifications: [
      {
        id: id("ntf"),
        userId: demoId,
        body: "Admin Vaultline invited you to Private Design Space.",
        readAt: null,
        createdAt: now()
      }
    ],
    activities: [
      {
        id: id("act"),
        actorId: adminId,
        type: "workspace_created",
        text: "created a private workspace",
        targetId: groupId,
        targetType: "group",
        visibility: "public",
        createdAt: now()
      }
    ],
    sessions: [],
    signedLinks: [],
    emailCodes: [],
    stories: [
      {
        id: id("sty"),
        userId: adminId,
        title: "Secure launch",
        body: "Vaultline is ready for private community files, workspaces and protected sharing.",
        accent: "cyan",
        createdAt: now(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
      }
    ],
    auditLogs: [],
    reports: [],
    settings: {
      appName: "Vaultline",
      domain: PUBLIC_DOMAIN,
      smtpHost: "",
      backups: "daily local snapshot",
      defaultQuotaBytes: 2 * 1024 * 1024 * 1024,
      maxUploadBytes: MAX_UPLOAD_BYTES
    }
  };
}

function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    const db = seedDb();
    saveDb(db);
    return db;
  }
  const loaded = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  loaded.stories ||= [];
  loaded.reports ||= [];
  loaded.settings ||= {};
  loaded.emailCodes = (loaded.emailCodes || [])
    .filter((item) => !item.usedAt && new Date(item.expiresAt).getTime() > Date.now())
    .slice(-200);
  loaded.sessions = (loaded.sessions || [])
    .filter((session) => session.tokenHash && new Date(session.expiresAt).getTime() > Date.now())
    .slice(-1000);
  loaded.signedLinks = (loaded.signedLinks || [])
    .filter((link) => link.tokenHash && new Date(link.expiresAt).getTime() > Date.now())
    .slice(-500);
  loaded.settings.domain ||= PUBLIC_DOMAIN;
  loaded.settings.maxUploadBytes ||= MAX_UPLOAD_BYTES;
  loaded.settings.defaultQuotaBytes ||= 2 * 1024 * 1024 * 1024;
  return loaded;
}

function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

let db = loadDb();

function publicUser(user) {
  if (!user) return null;
  const usedBytes = db.files
    .filter((file) => file.ownerId === user.id && !file.deletedAt)
    .reduce((sum, file) => sum + file.size, 0);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    avatar: user.avatar,
    bio: user.bio,
    quotaBytes: user.quotaBytes,
    usedBytes,
    twoFactorEnabled: Boolean(user.twoFactorEnabled),
    emailVerified: Boolean(user.emailVerifiedAt),
    followersCount: user.followers.length,
    followingCount: user.following.length,
    createdAt: user.createdAt
  };
}

function addAudit(actorId, action, meta = {}) {
  db.auditLogs.unshift({
    id: id("log"),
    actorId,
    action,
    meta,
    createdAt: now()
  });
  db.auditLogs = db.auditLogs.slice(0, 500);
}

function addActivity(actorId, type, text, targetType, targetId, visibility = "public") {
  db.activities.unshift({
    id: id("act"),
    actorId,
    type,
    text,
    targetType,
    targetId,
    visibility,
    createdAt: now()
  });
  db.activities = db.activities.slice(0, 200);
}

function send(res, status, data, headers = {}) {
  const body = typeof data === "string" ? data : JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": typeof data === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
  res.end(body);
}

function setSecurityHeaders(req, res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  if (requestIsSecure(req)) res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'self'");
}

function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [decodeURIComponent(part.slice(0, index)), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function currentSession(req) {
  const token = parseCookies(req).vaultline_session;
  if (!token) return null;
  const tokenHash = sha256(token);
  const session = db.sessions.find((item) => {
    const active = new Date(item.expiresAt).getTime() > Date.now();
    return active && (item.tokenHash === tokenHash || item.token === token);
  });
  if (!session) return null;
  const user = db.users.find((item) => item.id === session.userId && item.status === "active");
  if (!user) return null;
  return { session, user };
}

function requireAuth(req, res, options = {}) {
  const auth = currentSession(req);
  if (!auth) {
    send(res, 401, { error: "Auth required" });
    return null;
  }
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && options.csrf !== false) {
    if (!requestOriginAllowed(req)) {
      addAudit(auth.user.id, "security.origin_blocked", { origin: req.headers.origin || req.headers.referer, host: req.headers.host });
      saveDb(db);
      send(res, 403, { error: "Request origin was rejected" });
      return null;
    }
    const provided = req.headers["x-csrf-token"];
    if (!provided || !timingSafe(provided, auth.session.csrfToken)) {
      send(res, 403, { error: "Invalid CSRF token" });
      return null;
    }
  }
  if (options.role && !options.role.includes(auth.user.role)) {
    send(res, 403, { error: "Insufficient permissions" });
    return null;
  }
  return auth;
}

function readBody(req, max = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > max) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function readJson(req) {
  const buffer = await readBody(req, MAX_JSON_BYTES);
  if (!buffer.length) return {};
  return JSON.parse(buffer.toString("utf8"));
}

function sanitizeName(name) {
  return path.basename(String(name || "file").replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")).slice(0, 180) || "file";
}

function parseMultipart(buffer, contentType) {
  const boundaryMatch = /boundary=([^;]+)/i.exec(contentType || "");
  if (!boundaryMatch) throw new Error("Missing multipart boundary");
  const boundary = Buffer.from(`--${boundaryMatch[1]}`);
  const parts = [];
  let cursor = buffer.indexOf(boundary);
  while (cursor !== -1) {
    cursor += boundary.length;
    if (buffer[cursor] === 45 && buffer[cursor + 1] === 45) break;
    if (buffer[cursor] === 13 && buffer[cursor + 1] === 10) cursor += 2;
    const headerEnd = buffer.indexOf(Buffer.from("\r\n\r\n"), cursor);
    if (headerEnd === -1) break;
    const headerText = buffer.slice(cursor, headerEnd).toString("utf8");
    let next = buffer.indexOf(boundary, headerEnd + 4);
    if (next === -1) next = buffer.length;
    let content = buffer.slice(headerEnd + 4, next);
    if (content.length >= 2 && content[content.length - 2] === 13 && content[content.length - 1] === 10) {
      content = content.slice(0, -2);
    }
    const name = /name="([^"]+)"/.exec(headerText)?.[1];
    const filename = /filename="([^"]*)"/.exec(headerText)?.[1];
    const type = /Content-Type:\s*([^\r\n]+)/i.exec(headerText)?.[1] || "application/octet-stream";
    if (name) parts.push({ name, filename, type, content });
    cursor = next;
  }
  return parts;
}

function canAccessFile(user, file, includeDeleted = false) {
  if (!file) return false;
  if (file.deletedAt && !includeDeleted) return false;
  if (file.ownerId === user.id) return true;
  if (file.visibility === "public") return true;
  if (file.sharedWith?.includes(user.id)) return true;
  return false;
}

function fileDto(file, user) {
  const owner = db.users.find((item) => item.id === file.ownerId);
  return {
    ...file,
    owner: publicUser(owner),
    path: undefined,
    canEdit: file.ownerId === user.id || user.role === "admin",
    comments: file.comments.map((comment) => ({
      ...comment,
      author: publicUser(db.users.find((item) => item.id === comment.userId))
    })),
    reactionsCount: file.reactions.length,
    reacted: file.reactions.includes(user.id)
  };
}

function createSession(req, res, user) {
  const token = crypto.randomBytes(32).toString("hex");
  const csrfToken = crypto.randomBytes(24).toString("hex");
  db.sessions.push({
    id: id("ses"),
    tokenHash: sha256(token),
    csrfToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    createdAt: now()
  });
  addAudit(user.id, "auth.login", { email: user.email });
  saveDb(db);
  const secure = shouldUseSecureCookie(req) ? "; Secure" : "";
  res.setHeader("Set-Cookie", `vaultline_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_MS / 1000}${secure}`);
  return csrfToken;
}

function userStats(userId) {
  const files = db.files.filter((file) => file.ownerId === userId && !file.deletedAt);
  return {
    fileCount: files.length,
    publicCount: files.filter((file) => file.visibility === "public").length,
    sharedCount: files.filter((file) => file.visibility === "link" || file.sharedWith?.length).length,
    usedBytes: files.reduce((sum, file) => sum + file.size, 0)
  };
}

function signedUrlFor(req, token) {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const proto = forwardedProto || (requestIsSecure(req) ? "https" : "http");
  const host = req.headers.host;
  const fallbackBase = `${proto}://${host}`;
  const base = BASE_URL || fallbackBase;
  return `${base.replace(/\/+$/, "")}/s/${token}`;
}

function textPreviewSafe(mime, name) {
  return mime.startsWith("text/") || /\.(txt|md|json|csv|log|yaml|yml)$/i.test(name);
}

async function handleApi(req, res, route) {
  try {
    if (route === "/api/health" && req.method === "GET") {
      return send(res, 200, {
        ok: true,
        app: "vaultline",
        domain: PUBLIC_DOMAIN,
        baseUrl: BASE_URL,
        smtp: smtpReady(),
        requireEmailCode: REQUIRE_EMAIL_CODE,
        secure: requestIsSecure(req),
        time: now()
      });
    }

    if (route === "/api/auth/email-code" && req.method === "POST") {
      const body = await readJson(req);
      const validation = validateTextFields(body, ["email"]);
      if (validation || hasDangerousInput(body.email)) return send(res, 400, { error: "Email request was rejected by security checks" });
      const email = String(body.email || "").trim().toLowerCase();
      if (!email.includes("@")) return send(res, 400, { error: "Valid email required" });
      if (db.users.some((user) => user.email === email)) return send(res, 409, { error: "Email already exists" });
      if (!smtpReady()) return send(res, 503, { error: "SMTP is not configured yet" });
      const code = createEmailCode(email, "register");
      await sendMail(
        email,
        "Vaultline verification code",
        `Your Vaultline verification code is: ${code}\n\nIt expires in 10 minutes.\n\n${BASE_URL}`
      );
      addAudit(null, "auth.email_code_sent", { email, ip: clientIp(req) });
      saveDb(db);
      return send(res, 200, { ok: true, message: "Verification code sent" });
    }

    if (route === "/api/auth/register" && req.method === "POST") {
      const body = await readJson(req);
      const validation = validateTextFields(body, ["name", "email"]);
      if (validation) {
        addAudit(null, "security.blocked_register", { reason: validation, ip: clientIp(req) });
        saveDb(db);
        return send(res, 400, { error: "Registration request was rejected by security checks" });
      }
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const name = normalizeText(body.name || email.split("@")[0], 80);
      const passwordError = passwordStrengthError(password);
      if (!email.includes("@") || passwordError) return send(res, 400, { error: passwordError || "Valid email required" });
      if (db.users.some((user) => user.email === email)) return send(res, 409, { error: "Email already exists" });
      let emailVerifiedAt = null;
      if (REQUIRE_EMAIL_CODE) {
        if (!verifyEmailCode(email, body.emailCode, "register")) {
          addAudit(null, "auth.email_code_failed", { email, ip: clientIp(req) });
          saveDb(db);
          return send(res, 400, { error: "Valid email verification code required" });
        }
        emailVerifiedAt = now();
      } else if (body.emailCode && verifyEmailCode(email, body.emailCode, "register")) {
        emailVerifiedAt = now();
      }
      const user = {
        id: id("usr"),
        name,
        email,
        passwordHash: hashPassword(password),
        role: "user",
        status: "active",
        avatar: name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
        bio: "New Vaultline member.",
        quotaBytes: db.settings.defaultQuotaBytes,
        twoFactorEnabled: false,
        twoFactorSecret: crypto.randomBytes(12).toString("hex"),
        followers: [],
        following: [],
        emailVerifiedAt,
        createdAt: now()
      };
      db.users.push(user);
      addActivity(user.id, "user_registered", "joined Vaultline", "user", user.id, "public");
      const csrfToken = createSession(req, res, user);
      return send(res, 201, { user: publicUser(user), csrfToken });
    }

    if (route === "/api/auth/login" && req.method === "POST") {
      const body = await readJson(req);
      if (hasBotTrap(body)) {
        addAudit(null, "security.bot_login", { ip: clientIp(req) });
        saveDb(db);
        return send(res, 401, { error: "Sign-in failed" });
      }
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const user = db.users.find((item) => item.email === email);
      if (user?.lockUntil && new Date(user.lockUntil).getTime() > Date.now()) {
        addAudit(user.id, "auth.locked_attempt", { email, ip: clientIp(req) });
        saveDb(db);
        return send(res, 401, { error: "Sign-in failed" });
      }
      if (!user || !verifyPassword(password, user.passwordHash)) {
        if (user) {
          user.failedLoginCount = Number(user.failedLoginCount || 0) + 1;
          if (user.failedLoginCount >= MAX_FAILED_LOGIN) {
            user.lockUntil = new Date(Date.now() + LOGIN_LOCK_MS).toISOString();
            addAudit(user.id, "auth.account_locked", { ip: clientIp(req), minutes: Math.round(LOGIN_LOCK_MS / 60000) });
          }
        }
        addAudit(null, "auth.failed", { email, ip: clientIp(req) });
        saveDb(db);
        return send(res, 401, { error: "Sign-in failed" });
      }
      if (user.status !== "active") return send(res, 403, { error: "Sign-in failed" });
      if (user.twoFactorEnabled && String(body.code || "") !== generateTotp(user.twoFactorSecret)) {
        user.failedLoginCount = Number(user.failedLoginCount || 0) + 1;
        if (user.failedLoginCount >= MAX_FAILED_LOGIN) user.lockUntil = new Date(Date.now() + LOGIN_LOCK_MS).toISOString();
        addAudit(user.id, "auth.2fa_failed", { ip: clientIp(req) });
        saveDb(db);
        return send(res, 401, { error: "Sign-in failed" });
      }
      user.failedLoginCount = 0;
      user.lockUntil = null;
      const csrfToken = createSession(req, res, user);
      return send(res, 200, { user: publicUser(user), csrfToken });
    }

    if (route === "/api/auth/logout" && req.method === "POST") {
      const auth = requireAuth(req, res);
      if (!auth) return;
      db.sessions = db.sessions.filter((session) => session !== auth.session);
      addAudit(auth.user.id, "auth.logout");
      saveDb(db);
      const secure = shouldUseSecureCookie(req) ? "; Secure" : "";
      res.setHeader("Set-Cookie", `vaultline_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`);
      return send(res, 200, { ok: true });
    }

    if (route === "/api/auth/forgot" && req.method === "POST") {
      const body = await readJson(req);
      if (hasBotTrap(body) || hasDangerousInput(body.email)) return send(res, 200, { ok: true });
      addAudit(null, "auth.password_reset_requested", { email: String(body.email || "").toLowerCase(), ip: clientIp(req) });
      saveDb(db);
      return send(res, 200, { ok: true, message: "If this email exists, a reset link would be sent through SMTP." });
    }

    if (route === "/api/me" && req.method === "GET") {
      const auth = requireAuth(req, res, { csrf: false });
      if (!auth) return;
      return send(res, 200, { user: publicUser(auth.user), csrfToken: auth.session.csrfToken, stats: userStats(auth.user.id) });
    }

    if (route === "/api/bootstrap" && req.method === "GET") {
      const auth = requireAuth(req, res, { csrf: false });
      if (!auth) return;
      const files = db.files.filter((file) => canAccessFile(auth.user, file)).map((file) => fileDto(file, auth.user));
      return send(res, 200, {
        user: publicUser(auth.user),
        stats: userStats(auth.user.id),
        files,
        feed: feedFor(auth.user),
        users: db.users.map(publicUser),
        groups: db.groups.filter((group) => group.visibility === "public" || group.members.includes(auth.user.id)),
        stories: db.stories
          .filter((story) => new Date(story.expiresAt).getTime() > Date.now())
          .slice(0, 20)
          .map((story) => ({ ...story, author: publicUser(db.users.find((item) => item.id === story.userId)) })),
        notifications: db.notifications.filter((item) => item.userId === auth.user.id).slice(0, 30),
        messages: db.messages.filter((item) => item.fromId === auth.user.id || item.toId === auth.user.id).slice(-40)
      });
    }

    if (route === "/api/files" && req.method === "GET") {
      const auth = requireAuth(req, res, { csrf: false });
      if (!auth) return;
      const url = new URL(req.url, `http://${req.headers.host}`);
      const scope = url.searchParams.get("scope") || "all";
      const query = (url.searchParams.get("q") || "").toLowerCase();
      let files = db.files.filter((file) => canAccessFile(auth.user, file));
      if (scope === "mine") files = files.filter((file) => file.ownerId === auth.user.id && !file.deletedAt);
      if (scope === "trash") files = db.files.filter((file) => file.ownerId === auth.user.id && file.deletedAt);
      if (scope === "shared") files = files.filter((file) => file.ownerId !== auth.user.id || file.visibility !== "private");
      if (query) files = files.filter((file) => `${file.name} ${file.tags.join(" ")} ${file.folder}`.toLowerCase().includes(query));
      return send(res, 200, { files: files.map((file) => fileDto(file, auth.user)) });
    }

    if (route === "/api/files" && req.method === "POST") {
      const auth = requireAuth(req, res);
      if (!auth) return;
      const body = await readBody(req, MAX_UPLOAD_BYTES * 4);
      const parts = parseMultipart(body, req.headers["content-type"]);
      const fields = Object.fromEntries(parts.filter((part) => !part.filename).map((part) => [part.name, part.content.toString("utf8")]));
      const validation = validateTextFields(fields, ["folder", "tags", "visibility"]);
      if (validation) return send(res, 400, { error: "Upload metadata was rejected by security checks" });
      const uploads = parts.filter((part) => part.filename);
      if (!uploads.length) return send(res, 400, { error: "No files uploaded" });
      const usedBytes = userStats(auth.user.id).usedBytes;
      const incomingBytes = uploads.reduce((sum, part) => sum + part.content.length, 0);
      if (incomingBytes + usedBytes > auth.user.quotaBytes) return send(res, 413, { error: "User quota exceeded" });
      const created = [];
      for (const part of uploads) {
        if (part.content.length > MAX_UPLOAD_BYTES) return send(res, 413, { error: "Single file exceeds 25 MB demo limit" });
        const fileId = id("fil");
        const cleanName = sanitizeName(part.filename);
        if (!isUploadAllowed(cleanName, part.type, part.content)) {
          addAudit(auth.user.id, "security.upload_blocked", { name: cleanName, mime: part.type, ip: clientIp(req) });
          saveDb(db);
          return send(res, 415, { error: "This file type is not allowed" });
        }
        const extension = path.extname(cleanName);
        const storedName = `${fileId}${extension}`;
        fs.writeFileSync(path.join(STORAGE_DIR, storedName), part.content);
        const file = {
          id: fileId,
          ownerId: auth.user.id,
          name: cleanName,
          mime: part.type,
          size: part.content.length,
          storageName: storedName,
          path: path.join(STORAGE_DIR, storedName),
          folder: String(fields.folder || "Inbox").slice(0, 80),
          tags: String(fields.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 12),
          visibility: ["private", "public", "link"].includes(fields.visibility) ? fields.visibility : "private",
          sharedWith: [],
          comments: [],
          reactions: [],
          createdAt: now(),
          updatedAt: now(),
          deletedAt: null
        };
        db.files.unshift(file);
        created.push(fileDto(file, auth.user));
        addActivity(auth.user.id, "file_uploaded", `uploaded ${cleanName}`, "file", fileId, file.visibility === "public" ? "public" : "private");
        addAudit(auth.user.id, "file.uploaded", { fileId, name: cleanName, size: part.content.length });
      }
      saveDb(db);
      return send(res, 201, { files: created });
    }

    const fileMatch = route.match(/^\/api\/files\/([^/]+)(?:\/([^/]+))?$/);
    if (fileMatch) {
      const auth = requireAuth(req, res, { csrf: req.method !== "GET" });
      if (!auth) return;
      const file = db.files.find((item) => item.id === fileMatch[1]);
      const action = fileMatch[2];
      const includeDeleted = action === "restore";
      if (!canAccessFile(auth.user, file, includeDeleted)) return send(res, 404, { error: "File not found" });

      if (!action && req.method === "GET") return send(res, 200, { file: fileDto(file, auth.user) });

      if (action === "raw" && req.method === "GET") return streamFile(res, file, false);

      if (!["admin", "moderator"].includes(auth.user.role) && file.ownerId !== auth.user.id && req.method !== "POST") {
        return send(res, 403, { error: "Only owner can edit this file" });
      }

      if (!action && req.method === "PATCH") {
        const body = await readJson(req);
        file.name = sanitizeName(body.name || file.name);
        file.visibility = ["private", "public", "link"].includes(body.visibility) ? body.visibility : file.visibility;
        file.folder = String(body.folder || file.folder).slice(0, 80);
        file.tags = Array.isArray(body.tags) ? body.tags.map(String).slice(0, 12) : file.tags;
        file.updatedAt = now();
        addAudit(auth.user.id, "file.updated", { fileId: file.id });
        saveDb(db);
        return send(res, 200, { file: fileDto(file, auth.user) });
      }

      if (!action && req.method === "DELETE") {
        file.deletedAt = now();
        addActivity(auth.user.id, "file_deleted", `moved ${file.name} to trash`, "file", file.id, "private");
        addAudit(auth.user.id, "file.deleted", { fileId: file.id });
        saveDb(db);
        return send(res, 200, { ok: true });
      }

      if (action === "restore" && req.method === "POST") {
        if (file.ownerId !== auth.user.id && auth.user.role !== "admin") return send(res, 403, { error: "Only owner can restore this file" });
        file.deletedAt = null;
        addAudit(auth.user.id, "file.restored", { fileId: file.id });
        saveDb(db);
        return send(res, 200, { file: fileDto(file, auth.user) });
      }

      if (action === "signed" && req.method === "POST") {
        if (file.ownerId !== auth.user.id && auth.user.role !== "admin") return send(res, 403, { error: "Only owner can create signed links" });
        const token = crypto.randomBytes(24).toString("hex");
        const link = {
          id: id("lnk"),
          tokenHash: sha256(token),
          fileId: file.id,
          createdBy: auth.user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
          createdAt: now()
        };
        db.signedLinks.push(link);
        file.visibility = file.visibility === "private" ? "link" : file.visibility;
        addActivity(auth.user.id, "file_shared", `created a protected link for ${file.name}`, "file", file.id, "public");
        addAudit(auth.user.id, "file.signed_link", { fileId: file.id });
        saveDb(db);
        return send(res, 201, { url: signedUrlFor(req, token), expiresAt: link.expiresAt });
      }

      if (action === "comment" && req.method === "POST") {
        const body = await readJson(req);
        const validation = validateTextFields(body, ["text"]);
        if (validation) return send(res, 400, { error: "Comment was rejected by security checks" });
        const text = normalizeText(body.text, 1000);
        if (!text) return send(res, 400, { error: "Comment is empty" });
        file.comments.push({ id: id("com"), userId: auth.user.id, text, createdAt: now() });
        addActivity(auth.user.id, "file_commented", `commented on ${file.name}`, "file", file.id, file.visibility === "public" ? "public" : "private");
        saveDb(db);
        return send(res, 201, { file: fileDto(file, auth.user) });
      }

      if (action === "react" && req.method === "POST") {
        if (file.reactions.includes(auth.user.id)) file.reactions = file.reactions.filter((userId) => userId !== auth.user.id);
        else file.reactions.push(auth.user.id);
        addActivity(auth.user.id, "file_reacted", `reacted to ${file.name}`, "file", file.id, file.visibility === "public" ? "public" : "private");
        saveDb(db);
        return send(res, 200, { file: fileDto(file, auth.user) });
      }
    }

    if (route === "/api/feed" && req.method === "GET") {
      const auth = requireAuth(req, res, { csrf: false });
      if (!auth) return;
      return send(res, 200, { feed: feedFor(auth.user) });
    }

    const userMatch = route.match(/^\/api\/users\/([^/]+)(?:\/follow)?$/);
    if (userMatch) {
      const auth = requireAuth(req, res, { csrf: req.method !== "GET" });
      if (!auth) return;
      const target = db.users.find((item) => item.id === userMatch[1]);
      if (!target) return send(res, 404, { error: "User not found" });
      if (route.endsWith("/follow") && req.method === "POST") {
        if (target.id === auth.user.id) return send(res, 400, { error: "Cannot follow yourself" });
        const follows = auth.user.following.includes(target.id);
        auth.user.following = follows ? auth.user.following.filter((item) => item !== target.id) : [...auth.user.following, target.id];
        target.followers = follows ? target.followers.filter((item) => item !== auth.user.id) : [...target.followers, auth.user.id];
        addActivity(auth.user.id, follows ? "user_unfollowed" : "user_followed", `${follows ? "unfollowed" : "followed"} ${target.name}`, "user", target.id, "public");
        saveDb(db);
      }
      return send(res, 200, { user: publicUser(target), stats: userStats(target.id), following: auth.user.following.includes(target.id) });
    }

    if (route === "/api/groups" && req.method === "GET") {
      const auth = requireAuth(req, res, { csrf: false });
      if (!auth) return;
      return send(res, 200, { groups: db.groups.filter((group) => group.visibility === "public" || group.members.includes(auth.user.id)) });
    }

    if (route === "/api/groups" && req.method === "POST") {
      const auth = requireAuth(req, res);
      if (!auth) return;
      const body = await readJson(req);
      const validation = validateTextFields(body, ["name", "description", "visibility"]);
      if (validation) return send(res, 400, { error: "Workspace was rejected by security checks" });
      const group = {
        id: id("grp"),
        name: normalizeText(body.name || "New workspace", 80),
        description: normalizeText(body.description || "", 240),
        ownerId: auth.user.id,
        visibility: body.visibility === "public" ? "public" : "private",
        members: [auth.user.id],
        createdAt: now()
      };
      db.groups.unshift(group);
      addActivity(auth.user.id, "workspace_created", `created ${group.name}`, "group", group.id, group.visibility);
      saveDb(db);
      return send(res, 201, { group });
    }

    if (route === "/api/stories" && req.method === "GET") {
      const auth = requireAuth(req, res, { csrf: false });
      if (!auth) return;
      return send(res, 200, {
        stories: db.stories
          .filter((story) => new Date(story.expiresAt).getTime() > Date.now())
          .slice(0, 30)
          .map((story) => ({ ...story, author: publicUser(db.users.find((item) => item.id === story.userId)) }))
      });
    }

    if (route === "/api/stories" && req.method === "POST") {
      const auth = requireAuth(req, res);
      if (!auth) return;
      const body = await readJson(req);
      const validation = validateTextFields(body, ["title", "body", "accent"]);
      if (validation) return send(res, 400, { error: "Story was rejected by security checks" });
      const story = {
        id: id("sty"),
        userId: auth.user.id,
        title: normalizeText(body.title || "Story", 80),
        body: normalizeText(body.body || "", 280),
        accent: ["cyan", "pink", "green", "graphite"].includes(body.accent) ? body.accent : "cyan",
        createdAt: now(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
      };
      db.stories.unshift(story);
      db.stories = db.stories.slice(0, 100);
      addActivity(auth.user.id, "story_created", `published a story: ${story.title}`, "story", story.id, "public");
      addAudit(auth.user.id, "story.created", { storyId: story.id });
      saveDb(db);
      return send(res, 201, { story: { ...story, author: publicUser(auth.user) } });
    }

    if (route === "/api/messages" && req.method === "POST") {
      const auth = requireAuth(req, res);
      if (!auth) return;
      const body = await readJson(req);
      const validation = validateTextFields(body, ["body"]);
      if (validation) return send(res, 400, { error: "Message was rejected by security checks" });
      const to = db.users.find((user) => user.id === body.toId);
      if (!to) return send(res, 404, { error: "Recipient not found" });
      const message = { id: id("msg"), fromId: auth.user.id, toId: to.id, body: normalizeText(body.body, 1200), createdAt: now(), readAt: null };
      db.messages.push(message);
      db.notifications.unshift({ id: id("ntf"), userId: to.id, body: `${auth.user.name} sent you a message.`, readAt: null, createdAt: now() });
      addAudit(auth.user.id, "message.sent", { toId: to.id });
      saveDb(db);
      return send(res, 201, { message });
    }

    if (route === "/api/settings/security" && req.method === "PATCH") {
      const auth = requireAuth(req, res);
      if (!auth) return;
      const body = await readJson(req);
      auth.user.twoFactorEnabled = Boolean(body.twoFactorEnabled);
      addAudit(auth.user.id, "settings.2fa", { enabled: auth.user.twoFactorEnabled });
      saveDb(db);
      return send(res, 200, { user: publicUser(auth.user), demoCode: generateTotp(auth.user.twoFactorSecret) });
    }

    if (route.startsWith("/api/admin")) {
      const auth = requireAuth(req, res, { role: ["admin", "moderator"], csrf: req.method !== "GET" });
      if (!auth) return;
      if (route === "/api/admin/stats" && req.method === "GET") {
        const usedBytes = db.files.filter((file) => !file.deletedAt).reduce((sum, file) => sum + file.size, 0);
        return send(res, 200, {
          users: db.users.length,
          activeUsers: db.users.filter((user) => user.status === "active").length,
          files: db.files.filter((file) => !file.deletedAt).length,
          usedBytes,
          publicFiles: db.files.filter((file) => file.visibility === "public" && !file.deletedAt).length,
          reports: db.reports.length,
          logs: db.auditLogs.slice(0, 80),
          settings: db.settings
        });
      }
      if (route === "/api/admin/users" && req.method === "GET") {
        return send(res, 200, { users: db.users.map(publicUser) });
      }
      const adminUserMatch = route.match(/^\/api\/admin\/users\/([^/]+)$/);
      if (adminUserMatch && req.method === "PATCH") {
        const target = db.users.find((user) => user.id === adminUserMatch[1]);
        if (!target) return send(res, 404, { error: "User not found" });
        const body = await readJson(req);
        if (["active", "blocked"].includes(body.status)) target.status = body.status;
        if (auth.user.role === "admin" && ["admin", "moderator", "user"].includes(body.role)) target.role = body.role;
        if (Number(body.quotaBytes) > 0) target.quotaBytes = Number(body.quotaBytes);
        addAudit(auth.user.id, "admin.user_updated", { targetId: target.id, status: target.status, role: target.role });
        saveDb(db);
        return send(res, 200, { user: publicUser(target) });
      }
      if (route === "/api/admin/files" && req.method === "GET") {
        return send(res, 200, { files: db.files.map((file) => fileDto(file, auth.user)) });
      }
      if (route === "/api/admin/logs" && req.method === "GET") {
        return send(res, 200, { logs: db.auditLogs.slice(0, 200) });
      }
    }

    send(res, 404, { error: "Not found" });
  } catch (error) {
    send(res, 500, { error: error.message || "Server error" });
  }
}

function feedFor(user) {
  return db.activities
    .filter((activity) => activity.visibility === "public" || activity.actorId === user.id || user.following.includes(activity.actorId))
    .slice(0, 80)
    .map((activity) => ({ ...activity, actor: publicUser(db.users.find((item) => item.id === activity.actorId)) }));
}

function generateTotp(secret) {
  const step = Math.floor(Date.now() / 30000);
  return crypto.createHmac("sha1", secret).update(String(step)).digest("hex").slice(-6).replace(/[a-f]/g, (letter) => String(letter.charCodeAt(0) % 10));
}

function smtpReady() {
  return Boolean(nodemailer && SMTP_HOST && SMTP_USER && SMTP_PASS);
}

function mailTransport() {
  if (!smtpReady()) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

async function sendMail(to, subject, text) {
  const transport = mailTransport();
  if (!transport) throw new Error("SMTP is not configured");
  await transport.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    text,
    html: `<p>${escapeMail(text).replace(/\n/g, "<br>")}</p>`
  });
}

function escapeMail(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function createEmailCode(email, purpose = "register") {
  const code = String(crypto.randomInt(100000, 1000000));
  db.emailCodes ||= [];
  db.emailCodes = db.emailCodes
    .filter((item) => new Date(item.expiresAt).getTime() > Date.now() && !item.usedAt)
    .slice(-200);
  db.emailCodes.push({
    id: id("emc"),
    email,
    purpose,
    codeHash: sha256(`${email}:${purpose}:${code}`),
    attempts: 0,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
    createdAt: now(),
    usedAt: null
  });
  return code;
}

function verifyEmailCode(email, code, purpose = "register") {
  db.emailCodes ||= [];
  const hash = sha256(`${email}:${purpose}:${String(code || "").trim()}`);
  const item = db.emailCodes.find((entry) => {
    return entry.email === email && entry.purpose === purpose && !entry.usedAt && new Date(entry.expiresAt).getTime() > Date.now();
  });
  if (!item) return false;
  item.attempts = Number(item.attempts || 0) + 1;
  if (item.attempts > 6) return false;
  if (!timingSafe(item.codeHash, hash)) return false;
  item.usedAt = now();
  return true;
}

function streamFile(res, file, download) {
  if (!fs.existsSync(file.path)) return send(res, 404, { error: "Stored file is missing" });
  res.writeHead(200, {
    "Content-Type": file.mime || "application/octet-stream",
    "Content-Length": file.size,
    "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${encodeURIComponent(file.name)}"`,
    "Cache-Control": "private, max-age=60"
  });
  fs.createReadStream(file.path).pipe(res);
}

function serveSigned(req, res, token) {
  const tokenHash = sha256(token);
  const link = db.signedLinks.find((item) => (item.tokenHash === tokenHash || item.token === token) && new Date(item.expiresAt).getTime() > Date.now());
  if (!link) return send(res, 404, "Signed link expired or not found");
  const file = db.files.find((item) => item.id === link.fileId && !item.deletedAt);
  if (!file) return send(res, 404, "File not found");
  addAudit(link.createdBy, "file.signed_link_used", { fileId: file.id });
  saveDb(db);
  return streamFile(res, file, false);
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
  }[ext] || "application/octet-stream";
}

function serveStatic(req, res, pathname) {
  let decodedPath = "/";
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return send(res, 400, "Bad path");
  }
  const relativePath = decodedPath === "/" || decodedPath === "" ? "index.html" : decodedPath.replace(/^[/\\]+/, "");
  let filePath = path.resolve(PUBLIC_DIR, relativePath);
  const publicRoot = path.resolve(PUBLIC_DIR);
  if (filePath !== publicRoot && !filePath.startsWith(publicRoot + path.sep)) return send(res, 403, "Forbidden");
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) filePath = path.join(PUBLIC_DIR, "index.html");
  const cache = path.basename(filePath) === "index.html" ? "no-store" : "public, max-age=300";
  res.writeHead(200, { "Content-Type": contentType(filePath), "Cache-Control": cache });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  setSecurityHeaders(req, res);
  if (!requestHostAllowed(req)) {
    addAudit(null, "security.host_rejected", { host: req.headers.host, ip: clientIp(req) });
    saveDb(db);
    return send(res, 421, { error: "Host is not allowed for this Vaultline instance" });
  }
  const pathOnly = new URL(req.url, `http://${req.headers.host}`).pathname;
  if (!rateLimit(req, res, "global", 360, 60 * 1000)) return;
  if (pathOnly.startsWith("/api/auth/") && !rateLimit(req, res, "auth", 12, 10 * 60 * 1000)) return;
  if (req.method !== "GET" && !rateLimit(req, res, "write", 90, 60 * 1000)) return;
  if (pathOnly === "/api/files" && req.method === "POST" && !rateLimit(req, res, "upload", 30, 60 * 60 * 1000)) return;
  if (pathOnly.startsWith("/s/") && !rateLimit(req, res, "signed_link", 120, 60 * 1000)) return;
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/")) return handleApi(req, res, url.pathname);
  if (url.pathname.startsWith("/s/")) return serveSigned(req, res, url.pathname.slice(3));
  return serveStatic(req, res, url.pathname);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error("");
    console.error(`Vaultline cannot start because ${HOST}:${PORT} is already in use.`);
    console.error(`Open http://127.0.0.1:${PORT} first - Vaultline may already be running.`);
    console.error("If another app uses this port, close it or start Vaultline with another PORT value.");
    console.error("");
    process.exit(1);
  }
  throw error;
});

server.listen(PORT, HOST, () => {
  console.log(`Vaultline running on http://${HOST}:${PORT}`);
  console.log(`Public domain hint: ${PUBLIC_DOMAIN}`);
});