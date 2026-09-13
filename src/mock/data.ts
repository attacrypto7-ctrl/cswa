export type LicenseStatus = "aktif" | "nonaktif" | "revoked" | "expired";
export type WaStatus = "tersambung" | "memindai" | "terputus";
export type Plan = "Starter" | "Growth" | "Scale";

export interface Tenant {
  id: string;
  nama: string;
  industri: string;
  plan: Plan;
  email: string;
  bergabung: string;
  status: "aktif" | "suspend";
  nomorWa: number;
  chatBulanIni: number;
  kuotaChat: number;
  tokenBulanIni: number;
  lisensiBerakhir: string;
}

export interface License {
  id: string;
  kode: string;
  tenantId: string;
  tenantNama: string;
  plan: Plan;
  status: LicenseStatus;
  dibuat: string;
  berakhir: string;
  kuotaChat: number;
}

export interface WaNumber {
  id: string;
  label: string;
  nomor: string;
  status: WaStatus;
  terakhirAktif: string;
  autoChat: boolean;
  autoIklan: boolean;
}

export interface KnowledgeDoc {
  id: string;
  nama: string;
  tipe: "PDF" | "Teks" | "FAQ Manual";
  ukuran: string;
  potongan: number;
  versi: number;
  diperbarui: string;
  status: "terindeks" | "memproses" | "gagal";
}

export interface FaqItem {
  id: string;
  pertanyaan: string;
  jawaban: string;
}

export interface AdTemplate {
  id: string;
  pertanyaan: string;
  jawaban: string;
  mode: "exact" | "fuzzy";
  dipakai: number;
  aktif: boolean;
}

export interface ChatLog {
  id: string;
  kontak: string;
  nomor: string;
  kanal: "Chat" | "Iklan";
  pesanTerakhir: string;
  balasan: string;
  waktu: string;
  keyakinan: number;
  status: "terjawab" | "perlu manusia" | "diambil alih";
}

export interface AuditEntry {
  id: string;
  aktor: string;
  aksi: string;
  target: string;
  waktu: string;
}

export interface DailyChat {
  hari: string;
  chat: number;
  gagal: number;
}

export interface TokenUsage {
  bulan: string;
  token: number;
}

export interface TopQuestion {
  pertanyaan: string;
  jumlah: number;
}

export const tenants: Tenant[] = [
  {
    id: "t-001",
    nama: "Toko Bunga Melati",
    industri: "Retail",
    plan: "Growth",
    email: "kontak@bungamelati.com",
    bergabung: "2026-01-15",
    status: "aktif",
    nomorWa: 2,
    chatBulanIni: 4820,
    kuotaChat: 10000,
    tokenBulanIni: 1.2,
    lisensiBerakhir: "2026-10-01",
  },
];

export const licenses: License[] = [
  {
    id: "l-001",
    kode: "MELATI-2026-PROMO",
    tenantId: "t-001",
    tenantNama: "Toko Bunga Melati",
    plan: "Growth",
    status: "aktif",
    dibuat: "2026-01-01",
    berakhir: "2026-10-01",
    kuotaChat: 10000,
  },
];

export const waNumbers: WaNumber[] = [
  {
    id: "wa-1",
    label: "CS Utama",
    nomor: "6281234567890",
    status: "tersambung",
    terakhirAktif: "Baru saja",
    autoChat: true,
    autoIklan: true,
  },
  {
    id: "wa-2",
    label: "Admin Toko",
    nomor: "6281298765432",
    status: "tersambung",
    terakhirAktif: "5 menit lalu",
    autoChat: true,
    autoIklan: false,
  },
];

export const knowledgeDocs: KnowledgeDoc[] = [
  {
    id: "doc-1",
    nama: "Daftar Harga & Stok 2026.pdf",
    tipe: "PDF",
    ukuran: "1.2 MB",
    potongan: 124,
    versi: 3,
    diperbarui: "2026-09-10",
    status: "terindeks",
  },
];

export const faqItems: FaqItem[] = [
  {
    id: "f-1",
    pertanyaan: "Apakah bisa kirim hari ini?",
    jawaban: "Bisa Kak, untuk order sebelum jam 14.00 WIB kami kirim di hari yang sama.",
  },
];

export const adTemplates: AdTemplate[] = [
  {
    id: "at-1",
    pertanyaan: "Saya tertarik dengan produk ini",
    jawaban: "Halo Kak! Produk ini ready stok. Mau dikirim ke kota mana?",
    mode: "fuzzy",
    dipakai: 120,
    aktif: true,
  },
];

export const chatLogs: ChatLog[] = [
  {
    id: "c-1",
    kontak: "Budi Santoso",
    nomor: "6285511223344",
    kanal: "Chat",
    pesanTerakhir: "Bisa COD ke Jakarta Selatan?",
    balasan: "Bisa Kak, kami melayani COD area Jabodetabek.",
    waktu: "10:45",
    keyakinan: 0.95,
    status: "terjawab",
  },
  {
    id: "c-2",
    kontak: "Sari Wahyuni",
    nomor: "6285566778899",
    kanal: "Iklan",
    pesanTerakhir: "Mau tanya dong",
    balasan: "Silakan Kak, ada yang bisa kami bantu mengenai produk di iklan?",
    waktu: "11:02",
    keyakinan: 0.45,
    status: "perlu manusia",
  },
];

export const auditLog: AuditEntry[] = [];

export const chatHarian: DailyChat[] = [
  { hari: "Sen", chat: 450, gagal: 20 },
  { hari: "Sel", chat: 520, gagal: 15 },
  { hari: "Rab", chat: 480, gagal: 30 },
  { hari: "Kam", chat: 610, gagal: 10 },
  { hari: "Jum", chat: 580, gagal: 25 },
  { hari: "Sab", chat: 720, gagal: 40 },
  { hari: "Min", chat: 680, gagal: 35 },
];

export const pemakaianToken: TokenUsage[] = [
  { bulan: "Apr", token: 0.8 },
  { bulan: "Mei", token: 1.1 },
  { bulan: "Jun", token: 0.9 },
  { bulan: "Jul", token: 1.4 },
  { bulan: "Agu", token: 1.2 },
  { bulan: "Sep", token: 0.5 },
];

export const pertanyaanTeratas: TopQuestion[] = [
  { pertanyaan: "Ongkir ke Surabaya", jumlah: 84 },
  { pertanyaan: "Apakah barang ready?", jumlah: 62 },
  { pertanyaan: "Bisa minta foto asli?", jumlah: 45 },
];

/**
 * Daftar mesin AI yang bisa dipilih tenant. Ini konfigurasi produk, bukan data
 * contoh, jadi tetap tersedia agar pemilih model tetap berfungsi.
 */
export const aiEngines = [
  { id: "deepseek-v4-flash", nama: "DeepSeek V4 Flash", catatan: "Paling hemat — default" },
  { id: "gemini-3.5-flash-lite", nama: "Gemini 3.5 Flash-Lite", catatan: "Latensi rendah" },
  { id: "claude-haiku-4.5", nama: "Claude Haiku 4.5", catatan: "Akurasi tertinggi" },
  { id: "gpt-5.6-luna", nama: "GPT-5.6 Luna", catatan: "Opsi tengah" },
];
