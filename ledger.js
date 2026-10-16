export function newestFirst(launches) {
  return [...launches].sort((a, b) => Date.parse(b.launchedAt) - Date.parse(a.launchedAt));
}
export function validLaunch(record) {
  return record && typeof record.name === 'string' && record.name.trim() && typeof record.launchedAt === 'string' && Number.isFinite(Date.parse(record.launchedAt));
}
export function safeLink(value) {
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; }
}
