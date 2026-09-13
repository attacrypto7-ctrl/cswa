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

/**
 * Lapisan data tiruan. Semua komponen memanggil fungsi ini, bukan array mentah,
 * supaya nanti tinggal ditukar ke server function tanpa mengubah UI.
 */
const delay = <T>(value: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const getTenants = () => delay(tenants);
export const getTenant = (id: string) => delay(tenants.find((t) => t.id === id) ?? null);
export const getLicenses = () => delay(licenses);
export const getLicensesByTenant = (tenantId: string) =>
  delay(licenses.filter((l) => l.tenantId === tenantId));
export const getWaNumbers = () => delay(waNumbers);
export const getKnowledgeDocs = () => delay(knowledgeDocs);
export const getFaqItems = () => delay(faqItems);
export const getAdTemplates = () => delay(adTemplates);
export const getChatLogs = () => delay(chatLogs);
export const getAuditLog = () => delay(auditLog);
export const getAnalytics = () =>
  delay({ chatHarian, pemakaianToken, pertanyaanTeratas });

export const formatNumber = (n: number) => new Intl.NumberFormat("id-ID").format(n);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const daysLeft = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - new Date("2026-09-13").getTime()) / 86_400_000);
