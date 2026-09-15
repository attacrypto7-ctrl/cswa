import {
  adTemplates,
  auditLog,
  chatHarian,
  chatLogs,
  faqItems,
  knowledgeDocs,
  licenses,
  pemakaianToken,
  pertanyaanTeratas,
  tenants,
  waNumbers,
} from "./data";
import { apiFetch, getToken, AnyRecord } from "@/lib/api-client";

/**
 * Lapisan data tiruan. Jika token ada (user sudah login), panggil API asli.
 * Jika belum login, gunakan data tiruan lokal.
 */
const delay = <T>(value: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

function isLoggedIn(): boolean {
  try {
    return getToken() !== null;
  } catch {
    return false;
  }
}

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    return await apiFetch<T>(path);
  } catch {
    return fallback;
  }
}

export const getTenants = () => {
  if (isLoggedIn()) return safeFetch<AnyRecord[]>("/admin/tenants", tenants);
  return delay(tenants);
};
export const getTenant = (id: string) => {
  if (isLoggedIn())
    return safeFetch<AnyRecord>(`/admin/tenants/${id}`, tenants.find((t) => t.id === id) ?? null);
  return delay(tenants.find((t) => t.id === id) ?? null);
};
export const getLicenses = () => {
  if (isLoggedIn()) return safeFetch<AnyRecord[]>("/admin/licenses", licenses);
  return delay(licenses);
};
export const getLicensesByTenant = (tenantId: string) => {
  if (isLoggedIn())
    return safeFetch<AnyRecord[]>(
      `/admin/licenses?tenantId=${tenantId}`,
      licenses.filter((l) => l.tenantId === tenantId),
    );
  return delay(licenses.filter((l) => l.tenantId === tenantId));
};
export const getWaNumbers = () => {
  if (isLoggedIn()) return safeFetch<AnyRecord[]>("/whatsapp/numbers", waNumbers);
  return delay(waNumbers);
};
export const getKnowledgeDocs = () => {
  if (isLoggedIn()) return safeFetch<AnyRecord[]>("/knowledge/docs", knowledgeDocs);
  return delay(knowledgeDocs);
};
export const getFaqItems = () => {
  if (isLoggedIn()) return safeFetch<AnyRecord[]>("/knowledge/faq", faqItems);
  return delay(faqItems);
};
export const getAdTemplates = () => {
  if (isLoggedIn()) return safeFetch<AnyRecord[]>("/ad-templates", adTemplates);
  return delay(adTemplates);
};
export const getChatLogs = () => {
  if (isLoggedIn()) return safeFetch<AnyRecord[]>("/chat/logs?limit=100", chatLogs);
  return delay(chatLogs);
};
export const getAuditLog = () => {
  if (isLoggedIn()) return safeFetch<AnyRecord[]>("/admin/audit?limit=100", auditLog);
  return delay(auditLog);
};
export const getAnalytics = () => {
  if (isLoggedIn())
    return safeFetch<AnyRecord>("/analytics/overview", {
      chatHarian,
      pemakaianToken,
      pertanyaanTeratas,
    });
  return delay({ chatHarian, pemakaianToken, pertanyaanTeratas });
};
export const formatNumber = (n: number) => new Intl.NumberFormat("id-ID").format(n);
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
export const daysLeft = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - new Date("2026-09-13").getTime()) / 86_400_000);
