# SaaS CS AI Multi-Tenant — Tahap 1: UI dengan Data Contoh

Membangun seluruh tampilan dashboard (admin + tenant) memakai data contoh, supaya alur dan tampilannya bisa direview dulu sebelum disambungkan ke WhatsApp dan AI sungguhan.

## Catatan stack

Proyek ini berjalan di React + TanStack Start (bukan Next.js). Semua kemampuan yang diminta tetap bisa dibuat; hanya kerangka aplikasinya yang berbeda. Untuk tahap berikutnya (database, lisensi, AI, login) tersedia Lovable Cloud, jadi tidak perlu server terpisah kecuali untuk layanan WhatsApp/Baileys yang memang butuh koneksi terus-menerus dan harus dijalankan di VPS sendiri.

## Halaman yang dibuat

**Sisi Admin platform**

- Ringkasan: jumlah tenant, lisensi aktif, lisensi akan kedaluwarsa, total chat bulan ini
- Daftar tenant: cari, status, paket, jumlah nomor WhatsApp, pemakaian
- Detail tenant: info, nomor WhatsApp, pemakaian token, riwayat lisensi
- Lisensi: buat kode lisensi baru (tenant, masa berlaku, paket, kuota), aktif/nonaktif/cabut
- Catatan aktivitas admin (siapa mengubah apa, kapan)

**Sisi Tenant**

- Ringkasan: status bot, sisa masa lisensi, chat hari ini, pertanyaan tak terjawab
- Koneksi WhatsApp: daftar nomor, tombol hubungkan dengan QR code, status (tersambung / memindai / terputus), putus & sambung ulang
- Basis pengetahuan: unggah dokumen PDF/teks, tulis FAQ manual, daftar isi dengan riwayat versi
- Balas Chat Otomatis: tombol nyala/mati, pengaturan gaya bahasa, pilihan mesin AI, ambang batas alih ke manusia
- Balas Iklan Otomatis: tombol nyala/mati terpisah, tabel pasangan pertanyaan–jawaban pasti, mode pencocokan
- Riwayat Chat: daftar percakapan, tanda "AI tidak yakin", tombol ambil alih manual
- Uji Coba Bot: kolom chat untuk mencoba jawaban bot tanpa lewat WhatsApp
- Lisensi: masukkan kode, lihat masa berlaku dan kuota
- Analitik: grafik chat masuk, pertanyaan terpopuler, tingkat gagal jawab, pemakaian token

## Desain

Tema gelap profesional dengan aksen hijau WhatsApp yang diredam, tipografi tegas, sidebar kiri tetap, kartu statistik dan tabel rapi. Semua warna dan gaya didefinisikan sebagai token desain terpusat. Bahasa antarmuka: Indonesia.

## Rincian teknis

- Rute: `/` (landing singkat + masuk), `/admin/*`, `/app/*` dengan tata letak sidebar masing-masing
- Data contoh terpusat di `src/mock/` (tenant, lisensi, percakapan, FAQ, analitik) sehingga penggantian ke data asli hanya menyentuh satu lapisan
- Lapisan pemanggilan data dibungkus fungsi `getX()` async yang meniru API, agar nanti tinggal ditukar ke server function
- Komponen tabel, kartu statistik, badge status, dan dialog dibuat dapat dipakai ulang
- Chart memakai Recharts; upload file hanya simulasi di tahap ini

## Di luar cakupan tahap ini

Sambungan WhatsApp asli (Baileys), pemanggilan model AI, database, login, dan penagihan menyusul setelah tampilan disetujui.
