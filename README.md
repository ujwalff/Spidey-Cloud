# Spidey Cloud — GitHub Pages + Supabase Auth

Premium static frontend for Spidey Cloud with real Supabase email/password authentication, email verification, password reset, session persistence and a protected customer dashboard.

## Files added for real authentication

- `supabase-config.js` — your Supabase Project URL + browser publishable key
- `auth.js` — Supabase client/auth functions
- `auth-ui.js` — registration, verification resend, login, password reset and dashboard guard
- `forgot-password.html`
- `reset-password.html`

## 1. Create a Supabase project

Create a project in Supabase and open **Settings → API Keys**. For browser code, use the **publishable key**. Never put a secret/service-role key in this website.

## 2. Put your public Supabase values in the site

Open `supabase-config.js` and replace:

```js
window.SPIDEY_SUPABASE_CONFIG = {
  url: 'https://YOUR-PROJECT-REF.supabase.co',
  publishableKey: 'YOUR_SUPABASE_PUBLISHABLE_KEY'
};
```

Use the publishable browser key, not a secret key.

## 3. Turn on email confirmation

In Supabase Auth settings, enable email signups and **Confirm Email**. New users will receive a verification email and cannot sign in normally until the email is confirmed.

## 4. Configure redirect URLs

In Supabase Auth URL configuration, set your Site URL to your real website, for example:

`https://yourdomain.com`

Add these redirect URLs if needed:

`https://yourdomain.com/login.html`

`https://yourdomain.com/reset-password.html`

For a GitHub Pages project site, also add the full GitHub Pages URL, for example:

`https://USERNAME.github.io/REPOSITORY/login.html`

`https://USERNAME.github.io/REPOSITORY/reset-password.html`

The code automatically uses the current site's origin for redirects.

## 5. GitHub Pages

Upload the complete folder to the repository and enable GitHub Pages. Do not upload only `index.html`; the auth scripts, CSS, logo and HTML pages are required.

## Security

The publishable key is intended for browser applications. It does not replace database Row Level Security. If you add customer/profile/order tables later, enable RLS and write policies for authenticated users. Never expose a Supabase secret/service-role key in GitHub Pages or browser JavaScript.

## Important: Pterodactyl

Supabase Auth does NOT automatically create Minecraft servers. Keep Pterodactyl API secrets on a backend/Edge Function. The browser should call your backend, and the backend should create/manage servers through Pterodactyl.

## Supabase configuration

This build is configured with the Supabase Project URL and browser-safe publishable key supplied for Spidey Cloud. Do not add a secret/service-role key to the frontend or commit one to GitHub.

In Supabase Auth, enable Email provider + email confirmation, and add your GitHub Pages/custom-domain URL to the Auth URL configuration. The auth code redirects to `login.html` after verification and `reset-password.html` for password recovery.
