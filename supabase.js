/**
 * Cliente Supabase via REST puro (fetch) — sem WebSocket, sem pg, sem SDK
 */
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zzsnltnxonttilruiloc.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function api(path, opts = {}) {
  const url = SUPABASE_URL + '/rest/v1/' + path;
  const headers = {
    'apikey': SERVICE_KEY,
    'Authorization': 'Bearer ' + SERVICE_KEY,
    'Content-Type': 'application/json',
    ...opts.headers
  };
  return fetch(url, { ...opts, headers });
}

module.exports = { api, SUPABASE_URL };
