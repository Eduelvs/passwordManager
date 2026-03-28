const msg = document.getElementById('msg');
const vaultMsg = document.getElementById('vaultMsg');
const glass = document.getElementById('glass');
const loginForm = document.getElementById('loginForm');
const quickSaveForm = document.getElementById('quickSaveForm');
const submitBtn = document.getElementById('submitBtn');
const quickSaveBtn = document.getElementById('quickSaveBtn');
const sessionBar = document.getElementById('sessionBar');
const sessionLabel = document.getElementById('sessionLabel');
const signupFooter = document.getElementById('signupFooter');
const signupLink = document.getElementById('signupLink');
const viewLogin = document.getElementById('viewLogin');
const viewLoggedIn = document.getElementById('viewLoggedIn');
const iframeWrap = document.getElementById('iframeWrap');
const vaultFrame = document.getElementById('vaultFrame');
const iframeHint = document.getElementById('iframeHint');
const vaultSub = document.getElementById('vaultSub');
const logoutBtn = document.getElementById('logoutBtn');

const webOrigin =
  typeof globalThis.PM_WEB_ORIGIN === 'string'
    ? globalThis.PM_WEB_ORIGIN.trim()
    : '';

function setMsg(text, variant) {
  msg.textContent = text || '';
  msg.classList.remove('pm-msg--error', 'pm-msg--ok');
  if (variant === 'error') msg.classList.add('pm-msg--error');
  if (variant === 'ok') msg.classList.add('pm-msg--ok');
}

function setVaultMsg(text, variant) {
  vaultMsg.textContent = text || '';
  vaultMsg.classList.remove('pm-msg--error', 'pm-msg--ok');
  if (variant === 'error') vaultMsg.classList.add('pm-msg--error');
  if (variant === 'ok') vaultMsg.classList.add('pm-msg--ok');
}

function setGlassFocus(on) {
  glass.classList.toggle('pm-glass--focus', on);
}

loginForm.addEventListener('focusin', () => setGlassFocus(true));
loginForm.addEventListener('focusout', (e) => {
  if (!loginForm.contains(e.relatedTarget)) setGlassFocus(false);
});

quickSaveForm.addEventListener('focusin', () => setGlassFocus(true));
quickSaveForm.addEventListener('focusout', (e) => {
  if (!quickSaveForm.contains(e.relatedTarget)) setGlassFocus(false);
});

function formatApiError(data) {
  const m = data?.message;
  if (Array.isArray(m)) return m.join(', ');
  if (typeof m === 'string') return m;
  return 'Erro.';
}

function formatLoginError(data) {
  return formatApiError(data);
}

function setVaultIframe() {
  iframeHint.classList.add('pm-iframe-hint--hidden');
  iframeHint.textContent = '';

  if (webOrigin) {
    try {
      const url = new URL('/password/create', webOrigin).href;
      if (vaultFrame.src !== url) {
        vaultFrame.src = url;
      }
      iframeWrap.classList.remove('pm-iframe-wrap--hidden');
      vaultSub.textContent =
        'Cadastre e gira senhas no site abaixo. Na primeira vez pode ser preciso iniciar sessão dentro da página.';
      document.body.classList.add('pm-body--tall');
    } catch {
      iframeWrap.classList.add('pm-iframe-wrap--hidden');
      vaultFrame.removeAttribute('src');
      iframeHint.classList.remove('pm-iframe-hint--hidden');
      iframeHint.textContent =
        'URL do site inválida. Verifique PM_WEB_ORIGIN em api-config.js.';
      vaultSub.textContent =
        'Use a entrada rápida para guardar credenciais com o token da extensão.';
      document.body.classList.remove('pm-body--tall');
    }
  } else {
    iframeWrap.classList.add('pm-iframe-wrap--hidden');
    vaultFrame.removeAttribute('src');
    iframeHint.classList.remove('pm-iframe-hint--hidden');
    iframeHint.textContent =
      'Defina PM_WEB_ORIGIN em api-config.js (URL do front) para mostrar o cofre aqui.';
    vaultSub.textContent =
      'Sem URL do site: use só a entrada rápida — o token da extensão já está ativo.';
    document.body.classList.remove('pm-body--tall');
  }
}

async function getAccessToken() {
  const { accessToken } = await chrome.storage.local.get('accessToken');
  return accessToken || null;
}

async function refreshSessionUi() {
  const token = await getAccessToken();
  const on = Boolean(token);

  sessionBar.classList.toggle('pm-session-bar--on', on);
  sessionLabel.textContent = on
    ? 'Sessão ativa — cofre desbloqueado'
    : 'Sem sessão — faça login';

  viewLogin.classList.toggle('pm-view--hidden', on);
  viewLoggedIn.classList.toggle('pm-view--hidden', !on);

  if (on) {
    setVaultIframe();
  } else {
    document.body.classList.remove('pm-body--tall');
    iframeWrap.classList.add('pm-iframe-wrap--hidden');
    vaultFrame.removeAttribute('src');
  }

  const emailEl = document.getElementById('email');
  const passEl = document.getElementById('password');
  emailEl.disabled = false;
  passEl.disabled = false;
  submitBtn.disabled = false;
}

if (webOrigin) {
  try {
    signupLink.href = new URL('/sign-up', webOrigin).href;
    signupFooter.classList.remove('pm-footer--hidden');
  } catch {
    /* ignore */
  }
}

refreshSessionUi();

logoutBtn.addEventListener('click', async () => {
  await chrome.storage.local.remove('accessToken');
  setMsg('Sessão terminada.', 'ok');
  setVaultMsg('');
  quickSaveForm.reset();
  await refreshSessionUi();
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    setMsg('Preencha email e senha.', 'error');
    return;
  }

  setMsg('A entrar…');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Entrando…';

  try {
    const res = await fetch(`${globalThis.PM_API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(formatLoginError(data), 'error');
      return;
    }

    if (data.accessToken) {
      await chrome.storage.local.set({ accessToken: data.accessToken });
    } else {
      setMsg('Resposta inválida: sem token.', 'error');
      return;
    }

    setMsg('Sessão iniciada.', 'ok');
    await refreshSessionUi();
  } catch (err) {
    setMsg(err instanceof Error ? err.message : 'Erro de rede.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Entrar';
  }
});

quickSaveForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('entryTitle').value.trim();
  const username = document.getElementById('entryUser').value.trim();
  const secret = document.getElementById('entrySecret').value;
  const notes = document.getElementById('entryNotes').value.trim();

  if (!title || !secret) {
    setVaultMsg('Título e senha são obrigatórios.', 'error');
    return;
  }

  const token = await getAccessToken();
  if (!token) {
    setVaultMsg('Sem sessão.', 'error');
    return;
  }

  setVaultMsg('A guardar…');
  quickSaveBtn.disabled = true;

  const body = {
    title,
    secret,
    ...(username ? { username } : {}),
    ...(notes ? { notes } : {}),
  };

  try {
    const res = await fetch(`${globalThis.PM_API_BASE}/passwords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setVaultMsg(formatApiError(data), 'error');
      return;
    }

    setVaultMsg('Guardado no cofre.', 'ok');
    quickSaveForm.reset();
  } catch (err) {
    setVaultMsg(err instanceof Error ? err.message : 'Erro de rede.', 'error');
  } finally {
    quickSaveBtn.disabled = false;
  }
});
