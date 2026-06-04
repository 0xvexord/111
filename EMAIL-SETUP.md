# Email verification codes

Vaultline can send a 6-digit verification code during registration.

## Gmail setup

1. Enable 2-Step Verification on the Gmail account.
2. Create an App Password:
   Google Account -> Security -> App passwords.
3. Put the generated app password into `.env`.

Example:

```env
REQUIRE_EMAIL_CODE=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
MAIL_FROM=Vaultline <your@gmail.com>
```

Then restart Vaultline:

```bat
start-vaultline-domain.bat
```

## Other SMTP providers

Use the SMTP values from your provider:

```env
REQUIRE_EMAIL_CODE=true
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@example.com
SMTP_PASS=password-or-app-password
MAIL_FROM=Vaultline <user@example.com>
```

For port `465`, set:

```env
SMTP_PORT=465
SMTP_SECURE=true
```

## Test

Open:

```text
https://ukrainecommunity.pp.ua/api/health
```

You should see:

```json
{
  "smtp": true,
  "requireEmailCode": true
}
```

On the registration screen:

1. Enter email.
2. Click `Send email code`.
3. Check the mailbox.
4. Enter the 6-digit code.
5. Create the account.
