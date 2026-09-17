# Faradilah Ade — Portfolio 2026

Portofolio profesional bergaya Behance: halaman profil gelap dengan grid karya, pop-up detail proyek dengan tombol aksi di samping, panel admin untuk mengelola konten, 4 bahasa otomatis (EN · ID · 日本語 · 中文), dan SEO lengkap.

**Stack:** Vite + React + TypeScript + Tailwind CSS + Supabase (database, auth, storage) → GitHub Pages.

---

## 0. Ringkasan perbaikan di versi ini

| Masalah sebelumnya | Perbaikan |
| --- | --- |
| `ERROR 42710: policy "Public read published" … already exists` saat run SQL | `supabase/schema.sql` sekarang **idempotent** — aman dijalankan berulang kali (drop-if-exists sebelum create, `add column if not exists`, bucket dibuat otomatis). |
| Login admin: `Invalid path specified in request URL` | Penyebabnya `VITE_SUPABASE_URL` diisi `…supabase.co/rest/v1/`. Kode kini **menormalkan URL otomatis** (membuang `/rest/v1/`), jadi login jalan walau secret-nya masih salah. Tetap disarankan memperbaiki secret (lihat §1.3). |
| Layout kaku | Tipografi & spasi **fluid (clamp)**, grid 2/3/4 kolom, sidebar berpindah ke bawah grid di ponsel, modal full-screen di ponsel. |
| URL `…/porto_faradilahade-2026/` | Workflow otomatis memakai base `/` bila repo bernama `faradilahade.github.io` (lihat §2). |
| Kontak | Tombol **Email me** di navbar, sidebar, modal proyek, CTA, dan halaman kontak → `pmb.faradilahade@gmail.com` (subjek & isi terisi otomatis). |
| SEO | Meta/Open Graph/Twitter per halaman, JSON-LD (Person, ItemList, CreativeWork per proyek), canonical, `sitemap.xml` + `robots.txt` dibuat saat build, keyword & tools per proyek. |

---

## 1. Supabase (±10 menit, sekali saja)

### 1.1 Jalankan skema
1. Buka Supabase → **SQL Editor** → **New query**.
2. Paste seluruh isi `supabase/schema.sql` → **Run**.
   - Aman dijalankan lagi kapan pun (misalnya setelah update). Tidak akan muncul error "already exists" lagi.
   - Skrip ini juga membuat bucket storage `portfolio` (public) bila belum ada.

### 1.2 Akun admin
**Authentication → Users → Add user** → isi email (`pmb.faradilahade@gmail.com`) & password → centang **Auto Confirm User**.
Kalau login gagal dengan pesan *Email not confirmed*, buka user tersebut dan konfirmasi emailnya.

### 1.3 Kunci API (untuk GitHub & lokal)
**Project Settings → API**:
- **Project URL** → contoh `https://tkaqcgjlchjympptogmj.supabase.co`
  ⚠️ **Tanpa** `/rest/v1/` di belakang.
- **anon public** key.

Simpan keduanya di GitHub: **repo → Settings → Secrets and variables → Actions**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

> Anon key memang dirancang publik (ikut terkirim ke browser). Keamanan dijaga oleh Row Level Security: pengunjung hanya bisa membaca proyek `published = true`; hanya user login yang bisa menulis.

---

## 2. Deploy ke `https://faradilahade.github.io/`

GitHub hanya melayani alamat root itu dari repo yang **bernama persis** `faradilahade.github.io` (user site). Langkahnya:

1. **Rename repo**: repo → **Settings → General → Repository name** → ganti menjadi `faradilahade.github.io` → **Rename**.
   GitHub otomatis mengarahkan (redirect) alamat repo lama.
2. **Sumber Pages**: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. **Merge** branch ini ke `main` (atau push ke `main`). Workflow `Deploy to GitHub Pages` berjalan otomatis (tab **Actions**).
4. Tunggu ±1–2 menit → buka `https://faradilahade.github.io/`.

Catatan:
- Base path dihitung otomatis di workflow: `/` untuk `faradilahade.github.io`, `/<nama-repo>/` untuk repo lain. Tidak ada yang perlu diubah manual.
- `404.html` dibuat otomatis agar `/work/<slug>` dan `/contact` bisa dibuka/refresh langsung.
- Build **tidak akan gagal** meski secret Supabase belum diisi: situs tetap tampil (grid kosong) dan halaman admin menjelaskan apa yang kurang.
- Ingin domain sendiri (misal `faradilahade.com`)? Tambahkan di **Settings → Pages → Custom domain**; tidak perlu mengubah kode.

---

## 3. Mengisi portofolio (panel admin)

1. Buka `https://faradilahade.github.io/admin` → login.
2. **New project**, lalu isi:

| Field | Untuk apa |
| --- | --- |
| Title, Slug | Judul & URL `/work/<slug>` (slug dibuat otomatis). |
| Summary (≤220 karakter) | Muncul di kartu & jadi *meta description* → masukkan kata kunci utama di sini. |
| Case study | Satu paragraf per baris. `## Judul` untuk subjudul, `- poin` untuk daftar. |
| Field | Data / Finance / Risk (tab filter). |
| Year, Client, Role | Ditampilkan di kartu & modal, masuk ke JSON-LD. |
| **Tools used** | Contoh `Python, SQL, Airflow, dbt, BigQuery`. Muncul sebagai badge (seperti ikon Ps/Ai di Behance) di kartu, modal, dan ringkasan di atas grid. |
| **SEO keywords** | Frasa yang ingin dicari orang: `time series forecasting, dam safety, IFRS 17 transition`. Masuk ke meta keywords & JSON-LD, dan bisa dicari di kotak pencarian situs. |
| Tags | Label pendek (jadi chip filter di atas grid). |
| External link | Behance / GitHub / laporan → tombol **Open** di rail modal. |
| Behance embed | Tempel kode `<iframe …>` dari Behance (atau URL `src`-nya) → tampil di dalam modal. |
| Cover (4:3), Gallery, Files | Upload ke Supabase Storage. Gambar galeri tampil bertumpuk seperti Behance; file PDF/dll tampil di bagian **Files**. |
| Published / Featured / Order | Featured tampil di bagian atas; Order angka kecil tampil lebih dulu. |

Tips konten agar mudah ditemukan mesin pencari:
- Judul deskriptif dengan kata kunci: *"National dam early-warning forecasting system (240 sites)"* lebih kuat daripada *"Project 1"*.
- Summary menyebut hasil terukur (92% akurasi, 70% lebih cepat) dan nama institusi.
- Isi Tools & Keywords di **setiap** proyek — keduanya jadi filter, badge, dan sinyal SEO.

---

## 4. Foto profil, gambar share, favicon

- **Foto profil**: simpan foto persegi sebagai `public/avatar.jpg` → otomatis tampil di lingkaran profil (tanpa foto tampil monogram "FA").
- **Gambar share (OG)**: `public/og.png` (1200×630) dibuat oleh `npm run images`. Ganti dengan desain sendiri bila mau — cukup timpa filenya.
- **Favicon**: `public/favicon.svg`, `public/apple-touch-icon.png`.

---

## 5. SEO yang sudah aktif

- `<title>`, description, canonical, Open Graph, Twitter card berubah per halaman & per proyek (`src/lib/seo.ts`).
- JSON-LD: **Person** (nama, jabatan, lokasi, `sameAs` ke LinkedIn/Behance/dll), **ItemList** semua proyek, **CreativeWork** per proyek (keywords, tools, klien).
- `sitemap.xml` dibuat saat build dari daftar proyek yang published; `robots.txt` menunjuk ke sitemap dan memblokir `/admin`.
- Teks 4 bahasa, `lang` HTML mengikuti bahasa aktif, `og:locale:alternate`.
- Setelah live: daftarkan di **Google Search Console** → tambahkan property `https://faradilahade.github.io/` → kirim `https://faradilahade.github.io/sitemap.xml`.

---

## 6. Kustomisasi

| Ingin mengubah | File |
| --- | --- |
| Nama, email, WhatsApp, link sosial, embed Behance, kata kunci SEO | `src/lib/site.ts` |
| Teks UI 4 bahasa (judul, tombol, bio, sorotan 240/92%/15.000/350+) | `src/lib/translations.ts` |
| Palet warna & skala tipografi | `tailwind.config.js` (ink, paper, steel, brass, slate, mist + night, graphite, ocean, tide, sand, fog, clay) dan token `--fs-*` di `src/index.css` |
| Banner "data bands" | `src/components/Banner.tsx` |
| Singkatan badge tools (Py, SQL, PBI…) | `src/components/ToolBadge.tsx` |

---

## 7. Menjalankan lokal

```bash
cp .env.example .env     # isi VITE_SUPABASE_URL (tanpa /rest/v1/) & VITE_SUPABASE_ANON_KEY
npm install
npm run dev              # http://localhost:5173
npm run build            # tsc + vite build + 404.html/.nojekyll/sitemap/robots
npm run preview
```

Rute: `/` (profil + grid karya), `/work/<slug>` (modal proyek, bisa dibagikan), `/contact`, `/admin`, `/admin/dashboard`.

---

## 8. Struktur

```
index.html                  meta SEO statis, JSON-LD Person, font
public/                     favicon.svg, og.png, apple-touch-icon.png, (avatar.jpg)
scripts/postbuild.mjs       404.html, .nojekyll, sitemap.xml, robots.txt
scripts/make-images.mjs     generator og.png & apple-touch-icon.png
supabase/schema.sql         skema + RLS + storage (idempotent)
src/lib/site.ts             data diri & konfigurasi situs
src/lib/supabase.ts         klien Supabase (normalisasi URL), tipe Project
src/lib/seo.ts              hook <head> per halaman
src/lib/translations.ts     kamus 4 bahasa
src/pages/Profile.tsx       halaman utama bergaya Behance (+ modal via /work/:slug)
src/pages/Contact.tsx       kontak + form yang membuka aplikasi email
src/pages/admin/*           login & dashboard admin
src/components/*            Navbar, Footer, Banner, Avatar, ProjectCard, ProjectModal, ToolBadge, Icons
```
