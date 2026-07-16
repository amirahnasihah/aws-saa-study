# Supabase Email Templates

Copy these into **Supabase Dashboard → Authentication → Email Templates** after setting up custom SMTP.

Each `.html` file matches a template slot in the dashboard:

| File | Dashboard slot | When sent |
|------|---------------|-----------|
| `magic-link-otp.html` | Magic link or OTP | User signs in with `signInWithOtp` |
| `confirm-signup.html` | Confirm sign up | New user signs up (email confirmation) |
| `reset-password.html` | Reset password | User requests password reset |
| `invite-user.html` | Invite user | Admin invites a user |
| `change-email.html` | Change email address | User changes their email |

## Template variables (from Supabase)

| Variable | What it contains |
|----------|-----------------|
| `{{ .Token }}` | 6-digit OTP code |
| `{{ .ConfirmationURL }}` | Clickable magic link / confirmation link |
| `{{ .TokenHash }}` | Hashed token (for building custom links) |
| `{{ .SiteURL }}` | Your app's Site URL (set in Auth → URL Configuration) |
| `{{ .RedirectTo }}` | Redirect URL passed from client code |
| `{{ .Email }}` | User's email address |

## Setup: Custom SMTP (required to edit templates)

Free tier requires custom SMTP. Recommended: **Resend** (100 emails/day free).

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use the sandbox for testing)
3. Get an API key
4. In Supabase Dashboard → Authentication → SMTP Settings:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: your Resend API key
   - Sender email: `noreply@yourdomain.com`

After SMTP is configured, paste each template into the matching dashboard slot.
