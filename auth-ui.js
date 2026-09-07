(function () {
  const status = (id, message, type) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message || '';
    el.className = 'auth-message' + (type ? ' ' + type : '');
  };
  const ready = () => {
    if (!window.SpideyAuth || !window.SpideyAuth.configured) {
      status('auth-status', 'Supabase is not configured yet. Open supabase-config.js and add your Project URL + publishable key.', 'error');
      return false;
    }
    return true;
  };

  document.addEventListener('DOMContentLoaded', async () => {
    if (!window.SpideyAuth) return;
    if (!window.SpideyAuth.configured) {
      status('auth-status', 'Supabase setup required — edit supabase-config.js before using account features.', 'error');
      return;
    }

    const path = location.pathname.split('/').pop();
    const session = await window.SpideyAuth.ready;

    if (path === 'dashboard.html') {
      if (!session) location.replace('login.html?next=dashboard.html');
      else {
        const email = session.user.email || '';
        const name = session.user.user_metadata?.full_name || email.split('@')[0];
        document.querySelectorAll('[data-user-email]').forEach(el => el.textContent = email);
        document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = name);
      }
    }

    const register = document.getElementById('register-form');
    if (register) register.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!ready()) return;
      const btn = register.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Creating account…';
      const name = register.name.value.trim();
      const email = register.email.value.trim();
      const password = register.password.value;
      const confirm = register.confirm_password.value;
      if (password !== confirm) { status('auth-status', 'Passwords do not match.', 'error'); btn.disabled = false; btn.textContent = 'Create Account'; return; }
      const { data, error } = await window.SpideyAuth.signUp({ name, email, password });
      if (error) status('auth-status', error.message, 'error');
      else if (data.session) location.replace('dashboard.html');
      else {
        register.reset();
        status('auth-status', 'Account created. Check your email and click the verification link before logging in.', 'success');
        document.getElementById('resend-box')?.classList.remove('hidden');
        const resend = document.getElementById('resend-email'); if (resend) resend.value = email;
      }
      btn.disabled = false; btn.textContent = 'Create Account';
    });

    const resend = document.getElementById('resend-form');
    if (resend) resend.addEventListener('submit', async (e) => {
      e.preventDefault(); if (!ready()) return;
      const { error } = await window.SpideyAuth.resendVerification(resend.email.value.trim());
      status('auth-status', error ? error.message : 'Verification email sent again.', error ? 'error' : 'success');
    });

    const login = document.getElementById('login-form');
    if (login) login.addEventListener('submit', async (e) => {
      e.preventDefault(); if (!ready()) return;
      const btn = login.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Signing in…';
      const { data, error } = await window.SpideyAuth.signIn({ email: login.email.value.trim(), password: login.password.value });
      if (error) status('auth-status', error.message, 'error');
      else location.replace(new URLSearchParams(location.search).get('next') || 'dashboard.html');
      btn.disabled = false; btn.textContent = 'Login';
    });

    if (new URLSearchParams(location.search).get('verified') === '1') status('auth-status', 'Email verified. You can now sign in.', 'success');

    const forgot = document.getElementById('forgot-form');
    if (forgot) forgot.addEventListener('submit', async (e) => {
      e.preventDefault(); if (!ready()) return;
      const { error } = await window.SpideyAuth.resetPassword(forgot.email.value.trim());
      status('auth-status', error ? error.message : 'If the email is registered, a password reset link has been sent.', error ? 'error' : 'success');
    });

    const reset = document.getElementById('reset-form');
    if (reset) {
      const s = await window.SpideyAuth.ready;
      if (!s) status('auth-status', 'Open the password reset link from your email to continue.', 'error');
      reset.addEventListener('submit', async (e) => {
        e.preventDefault(); if (!ready()) return;
        if (reset.password.value !== reset.confirm_password.value) { status('auth-status', 'Passwords do not match.', 'error'); return; }
        const { error } = await window.SpideyAuth.updatePassword(reset.password.value);
        status('auth-status', error ? error.message : 'Password updated. Redirecting to login…', error ? 'error' : 'success');
        if (!error) setTimeout(() => location.replace('login.html'), 900);
      });
    }

    document.querySelectorAll('[data-logout]').forEach(btn => btn.addEventListener('click', async () => {
      await window.SpideyAuth.signOut(); location.replace('login.html');
    }));
  });
})();
