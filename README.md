# Smart Reply Hub

Spesifikasi Produk: SaaS CS AI Multi-Tenant

1. Ringkasan Konsep

Platform SaaS yang memungkinkan banyak bisnis (multi-tenant) menghubungkan WhatsApp mereka ke sistem AI yang membalas chat pelanggan secara otomatis, berdasarkan data/knowledge base yang di-upload masing-masing tenant. Ada dua mode balasan (chat biasa & iklan Facebook), sistem lisensi berbasis token/expiry, dan koneksi WhatsApp via QR code (Baileys).

Stack yang disepakati:

Frontend: Next.js (React)

AI API: lihat rekomendasi di bagian 2

Sumber data bisnis: upload dokumen/FAQ manual per tenant

2. Rekomendasi AI API (per September 2026)

Karena volume chat CS bisa tinggi, biaya per-token sangat menentukan margin. Berdasarkan data harga terbaru:

Model Input ($/1M token) Output ($/1M token) Catatan DeepSeek V4 Flash ~$0.14 ~$0.28 Termurah untuk kelas "capable", context 1M token. Rekomendasi utama untuk auto-reply volume tinggi. Gemini 3.5/2.5 Flash-Lite ~$0.30 ~$2.50 Alternatif kalau mau infra Google, latency rendah. Claude Haiku 4.5 $1 $5 Lebih mahal, tapi kualitas & keandalan instruction-following lebih tinggi (bagus kalau balasan harus sangat presisi, misal fitur Auto Bales Iklan). GPT-5.6 Luna/Nano $0.20 (Luna) / lebih murah untuk Nano $1.20 (Luna) Opsi tengah dari OpenAI.

Rekomendasi saya:

Pakai DeepSeek V4 Flash sebagai default engine (murah, context besar, cukup pintar untuk jawab berdasarkan FAQ).

Sediakan opsi tenant untuk upgrade ke Claude Haiku 4.5 atau GPT-5.6 kalau butuh akurasi lebih tinggi (misal untuk yayasan/donasi yang sensitif terhadap kesalahan jawaban).

Desain sistem model-agnostic dari awal (abstraksi lapisan "AI provider") supaya gampang ganti/tambah provider tanpa refactor besar. Ini penting karena harga API berubah cepat.

Untuk fitur Auto Bales Iklan (jawaban template presisi), sebenarnya tidak wajib pakai LLM mahal — bisa pakai matching/template sederhana + LLM hanya untuk variasi bahasa kalau perlu, supaya biaya makin ditekan.

Catatan: harga di atas bisa berubah kapan saja, cek ulang di dokumentasi resmi masing-masing provider sebelum finalisasi budget.

3. Arsitektur Sistem (High-Level)

[Tenant WhatsApp] <--Baileys(QR)--> [WA Gateway Service]
                                        |
                                        v
                              [Message Router / Queue]
                                        |
                    -----------------------------------------
                    |                                       |
          [Auto Bales Chat Engine]              [Auto Bales Iklan Engine]
          (RAG dari FAQ tenant + LLM)            (Template matching + opsional LLM)
                    |                                       |
                    -----------------------------------------
                                        |
                                v
                        [Database Multi-Tenant]
                    (tenant, FAQ docs, license, chat log)
                                        |
                                        v
                        [Next.js Dashboard (Admin & Tenant)]


Komponen inti:

Frontend (Next.js) — dashboard admin (kelola lisensi semua tenant) & dashboard tenant (kelola bot, upload FAQ, lihat chat log, on/off fitur).

Backend API — Node.js/NestJS atau Express, menangani auth, tenant isolation, license check, orchestration ke AI.

WA Gateway — service terpisah berbasis Baileys (disarankan dipisah sebagai microservice sendiri karena Baileys butuh koneksi socket persisten per akun WA, rawan crash, dan idealnya bisa di-restart independen dari backend utama).

Database — PostgreSQL (relational untuk tenant/license/user) + vector store (misal pgvector, Qdrant, atau Pinecone) untuk RAG dari dokumen FAQ per tenant.

Queue/Job — Redis + BullMQ untuk antrian pesan masuk, supaya tidak nge-block dan bisa retry kalau AI API gagal.

License Service — modul generate & validasi token lisensi (expiry, tenant binding).

4. Detail Fitur

4.1 Auto Bales Chat (on/off, per-tenant)

Tenant upload dokumen (PDF/teks) atau isi form FAQ manual.

Sistem embed dokumen ke vector database → saat ada chat masuk, sistem cari konteks relevan (RAG) → kirim ke LLM sebagai context → LLM jawab sesuai gaya bahasa yang bisa dikustom tenant.

Toggle on/off per nomor WA tenant.

Log semua percakapan untuk review manual & training FAQ selanjutnya.

4.2 Auto Bales Iklan (on/off, terpisah dari fitur 1)

Tenant input pasangan pertanyaan template → jawaban pasti (bukan RAG bebas, tapi lebih ke sistem matching presisi).

Bisa pakai:

Exact/fuzzy matching dulu (murah, cepat, tidak butuh LLM sama sekali).

Fallback ke LLM kalau tidak ada match, dengan instruksi ketat "jawab HANYA dari daftar jawaban yang disediakan, jangan mengarang".

Toggle terpisah dari Auto Bales Chat, karena tujuannya beda: iklan butuh jawaban 100% konsisten (brand safety), sedangkan chat biasa lebih fleksibel.

4.3 Lisensi Token

Admin platform generate lisensi (kode unik) per tenant dari dashboard admin.

Lisensi punya: tenant_id, expired_at, status (aktif/nonaktif/revoked), plan (opsional: batas jumlah chat/bulan).

Tenant input lisensi di dashboard mereka → sistem validasi ke license service → kalau valid & belum expired, fitur AI bisa dipakai.

Sebaiknya ada job terjadwal (cron) yang otomatis menonaktifkan bot begitu lisensi expired, plus notifikasi (email/WA) ke tenant beberapa hari sebelum expired.

4.4 Kelola WhatsApp (Baileys)

Tenant scan QR code dari dashboard untuk connect WA.

Simpan session Baileys per tenant (biasanya file auth state) — perlu strategi persist yang aman (bukan cuma di local disk kalau nanti scale ke banyak server, pertimbangkan simpan di S3/database terenkripsi).

Status koneksi real-time (connected/disconnected/scanning) ditampilkan di dashboard.

Auto-reconnect kalau session putus, dengan limit retry supaya tidak spam.

5. Ide Tambahan dari Saya

Rate limiting per tenant — supaya satu tenant tidak menghabiskan kuota/biaya AI tenant lain, dan mencegah abuse.

Human handover — kalau AI tidak yakin jawab (confidence rendah / pertanyaan di luar FAQ), otomatis flag ke admin tenant untuk take-over manual, biar tidak ada jawaban ngawur ke pelanggan.

Analytics dashboard — jumlah chat masuk, top pertanyaan, tingkat "AI tidak bisa jawab", biar tenant tahu FAQ mana yang perlu dilengkapi.

Versioning FAQ — histori perubahan dokumen, supaya bisa rollback kalau update FAQ malah bikin jawaban jadi salah.

Multi-nomor WA per tenant — beberapa bisnis besar punya lebih dari 1 nomor CS, pertimbangkan dari awal skema data supaya tidak perlu migrasi besar nanti.

Audit log admin — siapa generate lisensi, siapa ubah expired date, dsb — penting untuk platform yang jual "akses" seperti ini.

Testing sandbox — tenant bisa coba chat dengan bot mereka sendiri di dashboard (tanpa lewat WA asli) sebelum go-live, supaya bisa cek kualitas jawaban dulu.

Biaya AI transparan ke tenant — kalau nanti mau model "bayar sesuai pemakaian", siapkan tracking token usage per tenant sejak awal (jangan ditambah belakangan, karena data historisnya butuh dari awal).

6. Pertanyaan yang Masih Perlu Dijawab

Supaya rencana makin matang, ini beberapa hal yang perlu diputuskan (bukan mendesak untuk dijawab sekarang, tapi sebaiknya dipikirkan sebelum development jalan jauh):

Model bisnis: jual per-lisensi flat (langganan bulanan/tahunan), atau ada batas kuota chat/bulan per paket?

Apakah 1 tenant = 1 nomor WA, atau nanti perlu support banyak nomor per tenant?

Bahasa balasan AI: perlu multi-bahasa atau fokus Bahasa Indonesia dulu?

Hosting: mau di VPS sendiri, atau pakai cloud provider (untuk pertimbangan Baileys yang butuh koneksi persisten, VPS/dedicated container lebih stabil daripada serverless)?

Apakah butuh integrasi channel lain selain WhatsApp ke depannya (Instagram DM, Telegram, dll) — ini akan pengaruh ke desain arsitektur message router dari awal.

7. Rencana Frontend-First (Urutan Build)

UI Dashboard Admin — kelola tenant, generate/lihat lisensi, monitoring semua tenant.

UI Dashboard Tenant — halaman connect WA (QR code), upload FAQ, toggle on/off 2 fitur, input lisensi, lihat chat log.

UI Auto Bales Iklan Manager — form input pasangan pertanyaan-jawaban template.

Mock data / API dummy dulu untuk semua di atas, supaya UI/UX bisa direview tanpa nunggu backend AI selesai.

Setelah UI disetujui → baru sambungkan ke backend real: WA gateway (Baileys), AI engine, license service, database.

Dokumen ini adalah draft awal untuk didiskusikan lebih lanjut — silakan revisi bagian mana pun sebelum masuk tahap desain UI di Next.js.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0557e114-48c3-4f8c-9f15-435395dfdabf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
