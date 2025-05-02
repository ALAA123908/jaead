// Audit log utilities for tracking order actions

export function getAuditLog() {
  const data = localStorage.getItem('auditLog');
  return data ? JSON.parse(data) : [];
}

export function saveAuditLog(log) {
  localStorage.setItem('auditLog', JSON.stringify(log));
}

export function addAuditEntry({ action, orderId, username, details }) {
  const log = getAuditLog();
  const entry = {
    action, // "add" | "edit" | "delete" | "status-change"
    orderId,
    username,
    details,
    timestamp: new Date().toLocaleString()
  };
  log.push(entry);
  // احتفظ فقط بآخر 300 عملية
  if (log.length > 300) log.shift();
  saveAuditLog(log);
}
