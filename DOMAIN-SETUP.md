# Vaultline на ukrainecommunity.pp.ua з домашнього ПК

Цей проєкт уже вміє запускатися як звичайний Node.js сайт. Для домену потрібні дві частини:

1. Node.js застосунок локально: `http://127.0.0.1:4173`
2. HTTPS-вхід з інтернету на домен `https://ukrainecommunity.pp.ua`

## Швидкий локальний запуск

```bat
start-vaultline.bat
```

Або вручну:

```bash
node server.js
```

Локальна адреса:

```text
http://localhost:4173
```

Демо-вхід:

```text
admin@vaultline.local / Admin123!
demo@vaultline.local / Demo123!
```

## Конфіг

Файл `.env`:

```env
PORT=4173
HOST=0.0.0.0
PUBLIC_DOMAIN=ukrainecommunity.pp.ua
BASE_URL=https://ukrainecommunity.pp.ua
COOKIE_SECURE=auto
TRUST_PROXY=true
ALLOWED_HOSTS=ukrainecommunity.pp.ua,www.ukrainecommunity.pp.ua,localhost,127.0.0.1,[::1]
```

`BASE_URL` важливий для signed links: посилання будуть створюватися як `https://ukrainecommunity.pp.ua/s/...`.

## Варіант 1: Cloudflare Tunnel

Це найпростіший варіант для домашнього ПК, бо не треба біла IP-адреса і не треба відкривати порти на роутері.

### Автоматичний setup

Запусти один раз:

```bat
setup-cloudflare-tunnel.bat
```

Після успішного setup запускай сайт так:

```bat
start-vaultline-domain.bat
```

### Ручні команди

1. Домен має бути підключений до Cloudflare DNS.
2. Встанови `cloudflared`.
3. Увійди:

```bash
cloudflared tunnel login
```

4. Створи тунель:

```bash
cloudflared tunnel create vaultline
```

5. Прив'яжи DNS:

```bash
cloudflared tunnel route dns vaultline ukrainecommunity.pp.ua
cloudflared tunnel route dns vaultline www.ukrainecommunity.pp.ua
```

6. Запусти:

```bat
start-vaultline-domain.bat
```

Якщо `cloudflared` налаштований, батник запустить Node.js і тунель.

## Варіант 2: Caddy + порт-форвардинг

Цей варіант підходить, якщо в тебе є біла публічна IP-адреса.

1. DNS `A` запис `ukrainecommunity.pp.ua` має вказувати на твою публічну IP.
2. На роутері треба прокинути TCP порти `80` і `443` на твій ПК.
3. Встанови Caddy.
4. Запусти:

```bat
start-vaultline-domain.bat
```

Батник створить `data\Caddyfile` і підніме HTTPS reverse proxy на `127.0.0.1:4173`.

## Важливо

Не відкривай напряму `http://ukrainecommunity.pp.ua:4173` для людей. Для домену використовуй HTTPS через Cloudflare Tunnel, Caddy або Nginx.

Якщо сайт локально відкривається, але домен ні, проблема майже завжди не в коді, а в одному з цих пунктів:

- DNS ще не вказує на правильне місце.
- Роутер не прокинув порти 80/443.
- Провайдер не дає білу IP-адресу.
- Cloudflare Tunnel не запущений або не прив'язаний до домену.
- На ПК firewall блокує вхід.
