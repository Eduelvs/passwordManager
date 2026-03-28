importScripts('api-config.js');

const BASE = globalThis.PM_API_BASE;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'SAVE_PASSWORD') {
    return false;
  }

  (async () => {
    try {
      const { accessToken } = await chrome.storage.local.get('accessToken');
      if (!accessToken) {
        sendResponse({
          ok: false,
          error: 'Faça login na extensão (ícone) antes de guardar senhas.',
        });
        return;
      }

      const res = await fetch(`${BASE}/passwords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(message.payload),
      });

      if (!res.ok) {
        let detail = res.statusText;
        try {
          const errBody = await res.json();
          if (typeof errBody.message === 'string') {
            detail = errBody.message;
          } else if (Array.isArray(errBody.message)) {
            detail = errBody.message.join(', ');
          }
        } catch {
          const t = await res.text();
          if (t) detail = t.slice(0, 200);
        }
        sendResponse({ ok: false, error: detail });
        return;
      }

      sendResponse({ ok: true });
    } catch (e) {
      sendResponse({
        ok: false,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  })();

  return true;
});
