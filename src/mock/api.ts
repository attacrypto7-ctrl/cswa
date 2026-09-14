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
  return getToken() !== null;
}

export const getTenants = () => {
  if (isLoggedIn()) return apiFetch<AnyRecord[]>("/admin/tenants");
  return delay(tenants);
};
export const getTenant = (id: string) => {
  if (isLoggedIn()) return apiFetch<AnyRecord>(`/admin/tenants/${id}`);
  return delay(tenants.find((t) => t.id === id) ?? null);
};
export const getLicenses = () => apiFetch<AnyRecord[]>("/admin/licenses");
export const getLicensesByTenant = (tenantId: string) =>
<<<<<<< HEAD
  isLoggedIn() ? apiFetch<AnyRecord[]>(`/admin/licenses?tenantId=${tenantId}`) : delay(licenses.filter((l) => l.tenantId === tenantId));
export const getWaNumbers = () => {
  if (isLoggedIn()) return apiFetch<AnyRecord[]>("/whatsapp/numbers");
  return delay(waNumbers);
};
export const getKnowledgeDocs = () => {
  if (isLoggedIn()) return apiFetch<AnyRecord[]>("/knowledge/docs");
  return delay(knowledgeDocs);
};
export const getFaqItems = () => {
  if (isLoggedIn()) return apiFetch<AnyRecord[]>("/knowledge/faq");
  return delay(faqItems);
};
export const getAdTemplates = () => {
  if (isLoggedIn()) return apiFetch<AnyRecord[]>("/ad-templates");
  return delay(adTemplates);
};
export const getChatLogs = () => {
  if (isLoggedIn()) return apiFetch<AnyRecord[]>("/chat/logs?limit=100");
  return delay(chatLogs);
};
export const getAuditLog = () => {
  if (isLoggedIn()) return apiFetch<AnyRecord[]>("/admin/audit?limit=100");
  return delay(auditLog);
};
export const getAnalytics = () => {
  if (isLoggedIn()) return apiFetch<AnyRecord>("/analytics/overview");
  return delay({ chatHarian, pemakaianToken, pertanyaanTeratas });
};
=======
  delay(licenses.filter((l) => l.tenantId === tenantId));
export const getWaNumbers = () => delay(waNumbers);
export const getKnowledgeDocs = () => delay(knowledgeDocs);
export const getFaqItems = () => delay(faqItems);
export const getAdTemplates = () => delay(adTemplates);
export const getChatLogs = () => delay(chatLogs);
export const getAuditLog = () => delay(auditLog);
export const getAnalytics = () => delay({ chatHarian, pemakaianToken, pertanyaanTeratas });

>>>>>>> f3af05c (debug error, desain UI, dan alur kerja)
export const formatNumber = (n: number) => new Intl.NumberFormat("id-ID").format(n);
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
export const daysLeft = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - new Date("2026-09-13").getTime()) / 86_400_000);
