(function () {
  const cfg = window.SPIDEY_SUPABASE_CONFIG || {};
  const configured = cfg.url && !cfg.url.includes('YOUR-PROJECT-REF') && cfg.publishableKey && !cfg.publishableKey.includes('YOUR_SUPABASE');
  window.SpideyAuth = { configured };

  if (!configured) {
    window.SpideyAuth.ready = Promise.resolve(null);
    window.SpideyAuth.requireConfigured = function () {
      throw new Error('Supabase is not configured yet. Edit supabase-config.js with your Project URL and publishable key.');
    };
    return;
  }

  const client = window.supabase.createClient(cfg.url, cfg.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  window.SpideyAuth.client = client;
  window.SpideyAuth.ready = client.auth.getSession().then(({ data }) => data.session);

  window.SpideyAuth.signUp = async function ({ name, email, password }) {
    return client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin + '/login.html?verified=1'
      }
    });
  };

  window.SpideyAuth.signIn = async function ({ email, password }) {
    return client.auth.signInWithPassword({ email, password });
  };

  window.SpideyAuth.signOut = async function () { return client.auth.signOut(); };

  window.SpideyAuth.resendVerification = async function (email) {
    return client.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: window.location.origin + '/login.html?verified=1' }
    });
  };

  window.SpideyAuth.resetPassword = async function (email) {
    return client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password.html'
    });
  };

  window.SpideyAuth.updatePassword = async function (password) {
    return client.auth.updateUser({ password });
  };

  window.SpideyAuth.getUser = async function () {
    const { data, error } = await client.auth.getUser();
    return { user: data && data.user, error };
  };

  window.SpideyAuth.ready.then(() => {
    client.auth.onAuthStateChange((_event, session) => {
      window.dispatchEvent(new CustomEvent('spidey-auth-change', { detail: session }));
    });
  });
})();
