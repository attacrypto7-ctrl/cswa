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

export const tenants: Tenant[] = [
  {
    id: "t-001",
    nama: "Toko Bunga Melati",
    industri: "Retail",
    plan: "Growth",
    email: "admin@melati.id",
    bergabung: "2026-02-11",
    status: "aktif",
    nomorWa: 2,
    chatBulanIni: 4820,
    kuotaChat: 10000,
    tokenBulanIni: 1_240_000,
    lisensiBerakhir: "2026-10-01",
  },
  {
    id: "t-002",
    nama: "Yayasan Peduli Insan",
    industri: "Donasi",
    plan: "Scale",
    email: "cs@peduliinsan.org",
    bergabung: "2025-11-03",
    status: "aktif",
    nomorWa: 4,
    chatBulanIni: 18240,
    kuotaChat: 40000,
    tokenBulanIni: 6_930_000,
    lisensiBerakhir: "2026-09-20",
  },
  {
    id: "t-003",
    nama: "Klinik Sehat Prima",
    industri: "Kesehatan",
    plan: "Growth",
    email: "info@sehatprima.co.id",
    bergabung: "2026-01-19",
    status: "aktif",
    nomorWa: 1,
    chatBulanIni: 3110,
    kuotaChat: 10000,
    tokenBulanIni: 812_000,
    lisensiBerakhir: "2026-09-15",
  },
  {
    id: "t-004",
    nama: "Kopi Rakyat Nusantara",
    industri: "F&B",
    plan: "Starter",
    email: "halo@kopirakyat.id",
    bergabung: "2026-06-02",
    status: "aktif",
    nomorWa: 1,
    chatBulanIni: 940,
    kuotaChat: 3000,
    tokenBulanIni: 226_000,
    lisensiBerakhir: "2026-09-14",
  },
  {
    id: "t-005",
    nama: "Bengkel Motor Jaya",
    industri: "Otomotif",
    plan: "Starter",
    email: "cs@motorjaya.id",
    bergabung: "2025-08-27",
    status: "suspend",
    nomorWa: 1,
    chatBulanIni: 0,
    kuotaChat: 3000,
    tokenBulanIni: 0,
    lisensiBerakhir: "2026-08-30",
  },
  {
    id: "t-006",
    nama: "Umrah Barokah Travel",
    industri: "Travel",
    plan: "Scale",
    email: "admin@umrahbarokah.com",
    bergabung: "2025-12-15",
    status: "aktif",
    nomorWa: 3,
    chatBulanIni: 11760,
    kuotaChat: 40000,
    tokenBulanIni: 4_120_000,
    lisensiBerakhir: "2027-01-05",
  },
];

export const licenses: License[] = [
  {
    id: "l-101",
    kode: "MLTI-4KD9-2026-XQ7A",
    tenantId: "t-001",
    tenantNama: "Toko Bunga Melati",
    plan: "Growth",
    status: "aktif",
    dibuat: "2026-04-01",
    berakhir: "2026-10-01",
    kuotaChat: 10000,
  },
  {
    id: "l-102",
    kode: "PDLI-8XM2-2026-KR31",
    tenantId: "t-002",
    tenantNama: "Yayasan Peduli Insan",
    plan: "Scale",
    status: "aktif",
    dibuat: "2026-03-20",
    berakhir: "2026-09-20",
    kuotaChat: 40000,
  },
  {
    id: "l-103",
    kode: "SHPR-2LQ7-2026-VB88",
    tenantId: "t-003",
    tenantNama: "Klinik Sehat Prima",
    plan: "Growth",
    status: "aktif",
    dibuat: "2026-03-15",
    berakhir: "2026-09-15",
    kuotaChat: 10000,
  },
  {
    id: "l-104",
    kode: "KPRK-9JD4-2026-TT02",
    tenantId: "t-004",
    tenantNama: "Kopi Rakyat Nusantara",
    plan: "Starter",
    status: "aktif",
    dibuat: "2026-06-14",
    berakhir: "2026-09-14",
    kuotaChat: 3000,
  },
  {
    id: "l-105",
    kode: "BMJY-1ZP6-2026-MN45",
    tenantId: "t-005",
    tenantNama: "Bengkel Motor Jaya",
    plan: "Starter",
    status: "expired",
    dibuat: "2026-05-30",
    berakhir: "2026-08-30",
    kuotaChat: 3000,
  },
  {
    id: "l-106",
    kode: "UMBK-6RT3-2027-PL19",
    tenantId: "t-006",
    tenantNama: "Umrah Barokah Travel",
    plan: "Scale",
    status: "aktif",
    dibuat: "2026-01-05",
    berakhir: "2027-01-05",
    kuotaChat: 40000,
  },
  {
    id: "l-107",
    kode: "DEMO-0000-2026-TEST",
    tenantId: "t-004",
    tenantNama: "Kopi Rakyat Nusantara",
    plan: "Starter",
    status: "revoked",
    dibuat: "2026-05-02",
    berakhir: "2026-08-02",
    kuotaChat: 1000,
  },
];

export const waNumbers: WaNumber[] = [
  {
    id: "wa-1",
    label: "CS Utama",
    nomor: "+62 812-1100-2233",
    status: "tersambung",
    terakhirAktif: "Baru saja",
    autoChat: true,
    autoIklan: true,
  },
  {
    id: "wa-2",
    label: "CS Iklan Facebook",
    nomor: "+62 813-5566-7788",
    status: "memindai",
    terakhirAktif: "3 menit lalu",
    autoChat: false,
    autoIklan: true,
  },
  {
    id: "wa-3",
    label: "Nomor Cadangan",
    nomor: "+62 856-2244-9900",
    status: "terputus",
    terakhirAktif: "2 hari lalu",
    autoChat: false,
    autoIklan: false,
  },
];

export const knowledgeDocs: KnowledgeDoc[] = [
  {
    id: "d-1",
    nama: "Katalog Produk 2026.pdf",
    tipe: "PDF",
    ukuran: "2,4 MB",
    potongan: 184,
    versi: 3,
    diperbarui: "2026-09-08",
    status: "terindeks",
  },
  {
    id: "d-2",
    nama: "Kebijakan Pengiriman.pdf",
    tipe: "PDF",
    ukuran: "640 KB",
    potongan: 42,
    versi: 2,
    diperbarui: "2026-08-29",
    status: "terindeks",
  },
  {
    id: "d-3",
    nama: "FAQ Pembayaran",
    tipe: "FAQ Manual",
    ukuran: "18 entri",
    potongan: 18,
    versi: 5,
    diperbarui: "2026-09-11",
    status: "terindeks",
  },
  {
    id: "d-4",
    nama: "Panduan Retur.txt",
    tipe: "Teks",
    ukuran: "12 KB",
    potongan: 9,
    versi: 1,
    diperbarui: "2026-09-12",
    status: "memproses",
  },
];

export const faqItems: FaqItem[] = [
  {
    id: "f-1",
    pertanyaan: "Berapa lama pengiriman ke luar kota?",
    jawaban: "Pengiriman luar kota 2-4 hari kerja lewat ekspedisi rekanan kami.",
  },
  {
    id: "f-2",
    pertanyaan: "Apakah bisa bayar di tempat?",
    jawaban: "Bisa, COD tersedia untuk area Jabodetabek dengan minimal belanja Rp150.000.",
  },
  {
    id: "f-3",
    pertanyaan: "Jam operasional toko?",
    jawaban: "Setiap hari pukul 08.00-20.00 WIB, termasuk akhir pekan.",
  },
];

export const adTemplates: AdTemplate[] = [
  {
    id: "a-1",
    pertanyaan: "Berapa harga promo paket hemat?",
    jawaban: "Paket hemat promo September Rp149.000 sudah termasuk ongkir Jabodetabek.",
    mode: "fuzzy",
    dipakai: 612,
    aktif: true,
  },
  {
    id: "a-2",
    pertanyaan: "Masih ada stok?",
    jawaban: "Stok masih tersedia, Kak. Silakan sebutkan jumlah dan alamat pengiriman.",
    mode: "fuzzy",
    dipakai: 1284,
    aktif: true,
  },
  {
    id: "a-3",
    pertanyaan: "Lokasi toko di mana?",
    jawaban: "Toko kami di Jl. Mawar No. 12, Bandung. Buka 08.00-20.00 WIB.",
    mode: "exact",
    dipakai: 233,
    aktif: true,
  },
  {
    id: "a-4",
    pertanyaan: "Ada garansi?",
    jawaban: "Garansi tukar barang 7 hari sejak paket diterima, syarat berlaku.",
    mode: "exact",
    dipakai: 96,
    aktif: false,
  },
];

export const chatLogs: ChatLog[] = [
  {
    id: "c-1",
    kontak: "Rina Wulandari",
    nomor: "+62 811-2200-1188",
    kanal: "Iklan",
    pesanTerakhir: "Masih ada stok yang warna merah?",
    balasan: "Stok masih tersedia, Kak. Silakan sebutkan jumlah dan alamat pengiriman.",
    waktu: "10:24",
    keyakinan: 0.96,
    status: "terjawab",
  },
  {
    id: "c-2",
    kontak: "Bayu Prakoso",
    nomor: "+62 812-9987-3311",
    kanal: "Chat",
    pesanTerakhir: "Kalau saya mau kerja sama reseller gimana caranya?",
    balasan: "Maaf, saya belum menemukan informasi itu. Saya sambungkan ke tim ya.",
    waktu: "10:02",
    keyakinan: 0.31,
    status: "perlu manusia",
  },
  {
    id: "c-3",
    kontak: "Siti Aminah",
    nomor: "+62 857-4412-9080",
    kanal: "Chat",
    pesanTerakhir: "Pengiriman ke Surabaya berapa hari ya?",
    balasan: "Pengiriman luar kota 2-4 hari kerja lewat ekspedisi rekanan kami.",
    waktu: "09:47",
    keyakinan: 0.91,
    status: "terjawab",
  },
  {
    id: "c-4",
    kontak: "Andi Kurniawan",
    nomor: "+62 813-7788-2020",
    kanal: "Iklan",
    pesanTerakhir: "Promonya sampai tanggal berapa?",
    balasan: "Diambil alih oleh Dewi (admin) pukul 09.30.",
    waktu: "09:30",
    keyakinan: 0.44,
    status: "diambil alih",
  },
  {
    id: "c-5",
    kontak: "Maya Lestari",
    nomor: "+62 878-1234-5566",
    kanal: "Chat",
    pesanTerakhir: "Bisa COD?",
    balasan: "Bisa, COD tersedia untuk area Jabodetabek dengan minimal belanja Rp150.000.",
    waktu: "08:58",
    keyakinan: 0.94,
    status: "terjawab",
  },
];

export const auditLog: AuditEntry[] = [
  {
    id: "au-1",
    aktor: "admin@platform.id",
    aksi: "Membuat lisensi",
    target: "KPRK-9JD4-2026-TT02 (Kopi Rakyat Nusantara)",
    waktu: "14 Jun 2026, 09:12",
  },
  {
    id: "au-2",
    aktor: "admin@platform.id",
    aksi: "Mencabut lisensi",
    target: "DEMO-0000-2026-TEST",
    waktu: "02 Agu 2026, 16:44",
  },
  {
    id: "au-3",
    aktor: "owner@platform.id",
    aksi: "Mengubah masa berlaku",
    target: "UMBK-6RT3-2027-PL19 → 05 Jan 2027",
    waktu: "05 Jan 2026, 11:20",
  },
  {
    id: "au-4",
    aktor: "admin@platform.id",
    aksi: "Menangguhkan tenant",
    target: "Bengkel Motor Jaya",
    waktu: "31 Agu 2026, 08:03",
  },
];

export const chatHarian = [
  { hari: "Sen", chat: 1240, gagal: 88 },
  { hari: "Sel", chat: 1480, gagal: 96 },
  { hari: "Rab", chat: 1310, gagal: 74 },
  { hari: "Kam", chat: 1620, gagal: 120 },
  { hari: "Jum", chat: 1890, gagal: 104 },
  { hari: "Sab", chat: 2140, gagal: 138 },
  { hari: "Min", chat: 1720, gagal: 91 },
];

export const pemakaianToken = [
  { bulan: "Apr", token: 3.2 },
  { bulan: "Mei", token: 4.1 },
  { bulan: "Jun", token: 5.4 },
  { bulan: "Jul", token: 6.0 },
  { bulan: "Agu", token: 7.8 },
  { bulan: "Sep", token: 9.3 },
];

export const pertanyaanTeratas = [
  { pertanyaan: "Masih ada stok?", jumlah: 1284 },
  { pertanyaan: "Berapa ongkir ke kota saya?", jumlah: 977 },
  { pertanyaan: "Bisa COD?", jumlah: 864 },
  { pertanyaan: "Promo sampai kapan?", jumlah: 612 },
  { pertanyaan: "Jam buka toko?", jumlah: 431 },
];

export const aiEngines = [
  { id: "deepseek-v4-flash", nama: "DeepSeek V4 Flash", catatan: "Paling hemat — default" },
  { id: "gemini-3.5-flash-lite", nama: "Gemini 3.5 Flash-Lite", catatan: "Latensi rendah" },
  { id: "claude-haiku-4.5", nama: "Claude Haiku 4.5", catatan: "Akurasi tertinggi" },
  { id: "gpt-5.6-luna", nama: "GPT-5.6 Luna", catatan: "Opsi tengah" },
];
