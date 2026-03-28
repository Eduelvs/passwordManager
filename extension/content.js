/**
 * Captura genérica: qualquer formulário com campo de senha preenchido.
 * Utilizador é opcional (API aceita só `secret`).
 */

function getFieldValue(el) {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el.value;
  }
  if (el instanceof HTMLSelectElement) {
    return el.value;
  }
  return '';
}

/** Campos na ordem do DOM (inclui password) para saber o que fica “antes” da senha. */
function getOrderedFields(form) {
  return Array.from(form.querySelectorAll('input, textarea, select')).filter(
    (el) => {
      if (el.disabled) return false;
      if (el instanceof HTMLInputElement) {
        if (
          ['hidden', 'submit', 'button', 'image', 'reset'].includes(el.type)
        ) {
          return false;
        }
      }
      return true;
    },
  );
}

/**
 * Com vários `type=password`, escolhe o mais provável (login atual vs confirmação).
 */
function pickPasswordInput(form) {
  const raw = Array.from(form.querySelectorAll('input[type="password"]')).filter(
    (el) => !el.disabled && el.value.trim(),
  );
  if (raw.length === 0) return null;
  if (raw.length === 1) return raw[0];

  const lower = (a) => (a || '').toLowerCase();
  const byAuto = (v) => raw.find((c) => lower(c.autocomplete) === v);
  const cur = byAuto('current-password');
  if (cur) return cur;
  const neu = byAuto('new-password');
  if (neu) return neu;

  const same = raw.every((c) => c.value === raw[0].value);
  if (same) return raw[0];

  const preferNew = raw.find((c) => {
    const blob = `${c.name} ${c.id} ${c.placeholder}`.toLowerCase();
    return (
      /new|nova|neu|confirm|confirma|repeat|repet|again/.test(blob) &&
      !/old|atual|current|previous|antiga|former/.test(blob)
    );
  });
  if (preferNew) return preferNew;

  return raw[0];
}

/**
 * Tenta obter identificador (email, utilizador, telefone, etc.) — o mais genérico possível.
 */
function guessUsername(form, passwordEl) {
  const all = getOrderedFields(form);
  const pwdIdx = all.indexOf(passwordEl);

  const emailFilled = all.find(
    (el) =>
      el instanceof HTMLInputElement &&
      el.type === 'email' &&
      getFieldValue(el).trim(),
  );
  if (emailFilled) return getFieldValue(emailFilled).trim();

  const before = pwdIdx >= 0 ? all.slice(0, pwdIdx) : all;

  for (let i = before.length - 1; i >= 0; i--) {
    const el = before[i];
    if (el instanceof HTMLInputElement && el.type === 'password') continue;
    const v = getFieldValue(el).trim();
    if (!v) continue;
    if (el instanceof HTMLInputElement && el.type === 'search') continue;
    return v;
  }

  for (const el of all) {
    if (el === passwordEl) continue;
    if (el instanceof HTMLInputElement && el.type === 'password') continue;
    const v = getFieldValue(el).trim();
    if (!v) continue;
    if (el instanceof HTMLInputElement && el.type === 'search') continue;
    return v;
  }

  return '';
}

function buildEntryTitle() {
  const host = window.location.hostname;
  const t = (document.title || '').trim();
  if (!t || t.length < 2) return host;
  const short = t.length > 48 ? `${t.slice(0, 45)}…` : t;
  return `${host} — ${short}`;
}

function showSavePrompt(hostname, usernamePreview) {
  return new Promise((resolve) => {
    const wrap = document.createElement('div');
    wrap.className = 'pm-ext-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'pm-ext-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'pm-ext-title');

    const title = document.createElement('p');
    title.id = 'pm-ext-title';
    title.className = 'pm-ext-title';
    title.textContent = 'Guardar no cofre?';

    const site = document.createElement('p');
    site.className = 'pm-ext-site';
    site.textContent = hostname;

    const hint = document.createElement('p');
    hint.className = 'pm-ext-hint';
    hint.textContent = usernamePreview
      ? `Incluir utilizador: ${usernamePreview.slice(0, 80)}${usernamePreview.length > 80 ? '…' : ''}`
      : 'Só a senha será guardada (sem utilizador detetado neste formulário).';

    const actions = document.createElement('div');
    actions.className = 'pm-ext-actions';

    const btnNo = document.createElement('button');
    btnNo.type = 'button';
    btnNo.className = 'pm-ext-btn pm-ext-btn--ghost';
    btnNo.textContent = 'Não';

    const btnYes = document.createElement('button');
    btnYes.type = 'button';
    btnYes.className = 'pm-ext-btn pm-ext-btn--primary';
    btnYes.textContent = 'Guardar';

    actions.append(btnNo, btnYes);
    dialog.append(title, site, hint, actions);
    wrap.appendChild(dialog);
    document.body.appendChild(wrap);

    requestAnimationFrame(() => wrap.classList.add('pm-ext-overlay--visible'));

    function cleanup(result) {
      wrap.classList.remove('pm-ext-overlay--visible');
      document.removeEventListener('keydown', onKey);
      setTimeout(() => {
        wrap.remove();
        resolve(result);
      }, 200);
    }

    function onKey(e) {
      if (e.key === 'Escape') cleanup(false);
    }

    btnNo.addEventListener('click', () => cleanup(false));
    btnYes.addEventListener('click', () => cleanup(true));
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) cleanup(false);
    });
    document.addEventListener('keydown', onKey);
  });
}

function showSavedToast() {
  return new Promise((resolve) => {
    const wrap = document.createElement('div');
    wrap.className = 'pm-ext-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'pm-ext-dialog';

    const title = document.createElement('p');
    title.className = 'pm-ext-title';
    title.style.margin = '0';
    title.textContent = 'Senha guardada';

    const hint = document.createElement('p');
    hint.className = 'pm-ext-hint';
    hint.style.marginTop = '0.65rem';
    hint.textContent = 'Pode continuar o envio do formulário.';

    const actions = document.createElement('div');
    actions.className = 'pm-ext-actions';
    actions.style.marginTop = '1.1rem';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pm-ext-btn pm-ext-btn--primary';
    btn.style.flex = '1';
    btn.textContent = 'Continuar';

    actions.appendChild(btn);
    dialog.append(title, hint, actions);
    wrap.appendChild(dialog);
    document.body.appendChild(wrap);

    requestAnimationFrame(() => wrap.classList.add('pm-ext-overlay--visible'));

    function close() {
      wrap.classList.remove('pm-ext-overlay--visible');
      setTimeout(() => {
        wrap.remove();
        resolve();
      }, 200);
    }

    btn.addEventListener('click', close);
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) close();
    });
  });
}

document.addEventListener(
  'submit',
  (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    const passInput = pickPasswordInput(form);
    if (!passInput) return;

    const password = passInput.value;
    const username = guessUsername(form, passInput);

    event.preventDefault();

    (async () => {
      const salvar = await showSavePrompt(
        window.location.hostname,
        username,
      );
      if (!salvar) {
        form.submit();
        return;
      }

      const payload = {
        title: buildEntryTitle(),
        secret: password,
        ...(username ? { username } : {}),
      };

      chrome.runtime.sendMessage(
        { type: 'SAVE_PASSWORD', payload },
        (response) => {
          if (chrome.runtime.lastError) {
            alert('Erro: ' + chrome.runtime.lastError.message);
            form.submit();
            return;
          }
          if (response?.ok) {
            void showSavedToast().then(() => form.submit());
            return;
          }
          alert(response?.error || 'Falha ao guardar.');
          form.submit();
        },
      );
    })();
  },
  true,
);
