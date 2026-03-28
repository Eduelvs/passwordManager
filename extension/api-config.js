/** Base da API — alinhar ao backend em produção (ex. Railway). */
globalThis.PM_API_BASE = 'https://passwordmanager.up.railway.app';

/**
 * URL do site Next (iframe do cofre + links). Ex.: https://seu-app.vercel.app
 * Com isto preenchido, após login o popup mostra /password/create embebido.
 * Se o iframe ficar vazio, o deploy do Next precisa de CSP frame-ancestors a incluir chrome-extension:.
 */
globalThis.PM_WEB_ORIGIN = '';
