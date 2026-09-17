# Faradilah Ade — Portfolio 2026

Portofolio profesional untuk memulai kerja remote skala internasional. Tema terang & biru: hero, bagian **My work** bergaya profil Behance, katalog karya dengan sidebar filter, pop-up detail proyek dengan rail tombol (Contact · Tools · Files · Share · Next), FAQ, form *Book a call*, **panel admin ala WordPress/Medium** (tambah, edit, hapus, duplikat, urutkan, draft, pratinjau langsung), dan **terjemahan otomatis** ke Inggris · Indonesia · 日本語 · 中文.

**Stack:** Vite + React + TypeScript + Tailwind CSS + Supabase (database, auth, storage) → GitHub Pages.

---

## 0. Ringkasan perbaikan di versi ini

| Masalah sebelumnya | Perbaikan |
| --- | --- |
| `ERROR 42710: policy "Public read published" … already exists` saat run SQL | `supabase/schema.sql` sekarang **idempotent** — aman dijalankan berulang kali (drop-if-exists sebelum create, `add column if not exists`, bucket dibuat otomatis). |
| Login admin: `Invalid path specified in request URL` | Penyebabnya `VITE_SUPABASE_URL` diisi `…supabase.co/rest/v1/`. Kode kini **menormalkan URL otomatis** (membuang `/rest/v1/`), jadi login jalan walau secret-nya masih salah. Tetap disarankan memperbaiki secret (lihat §1.3). |
| Layout | Tata letak mengikuti referensi Behance *Framerate E-commerce* dalam versi terang & bersih dengan palet biru: hero, strip statistik, About, katalog karya dengan **sidebar filter** (tahun, bidang, tools, klien, kata kunci), toolbar hasil (urutkan, grid/list, cari), kartu spesifikasi + tile promo, FAQ, form *Book a call*, footer 4 kolom, dan wordmark raksasa. Tipografi & spasi **fluid (clamp)**. |
| URL `…/porto_faradilahade-2026/` | Workflow otomatis memakai base `/` bila repo bernama `faradilahade.github.io` (lihat §2). |
| Kontak | Tombol **Email me** di navbar, sidebar, modal proyek, CTA, dan halaman kontak → `pmb.faradilahade@gmail.com` (subjek & isi terisi otomatis). |
| Bagian Behance | Diganti **My work**: tata letak profil Behance (banner, avatar, info, statistik, tautan, tab Work/Featured/Data/Finance/Risk, "Most recent works" & "Selected works") berisi karya Anda sendiri. Klik karya → pop-up yang bisa di-scroll dengan tombol **Tools** yang menampilkan tools yang dipakai. |
| Admin | Login dengan **username** (`admin-fara`), dashboard ala WordPress: Overview, Projects (cari, filter status, publish/unpublish, feature, duplikat, urutkan, hapus), editor ala Medium (judul besar, ringkasan, toolbar format, drag-drop gambar, galeri, berkas, pratinjau langsung, autosave lokal), Account (ganti password). |
| Terjemahan | Teks UI 4 bahasa mengikuti bahasa browser. Isi proyek: tombol **Auto-translate** di editor menyimpan terjemahan ID/JA/ZH/EN yang bisa disunting; proyek tanpa terjemahan tersimpan diterjemahkan otomatis di browser pengunjung (dengan tombol "Lihat teks asli"). |
| SEO | Meta/Open Graph/Twitter per halaman, JSON-LD (Person, ItemList, CreativeWork per proyek), canonical, `sitemap.xml` + `robots.txt` dibuat saat build, keyword & tools per proyek. |

---

## 1. Supabase (±10 menit, sekali saja)

### 1.1 Jalankan skema
1. Buka Supabase → **SQL Editor** → **New query**.
2. Paste seluruh isi `supabase/schema.sql` → **Run**.
   - Aman dijalankan lagi kapan pun (misalnya setelah update). Tidak akan muncul error "already exists" lagi.
   - Skrip ini juga membuat bucket storage `portfolio` (public) bila belum ada.

### 1.2 Akun admin (username `admin-fara`)
Halaman `/admin` menerima **username**. Username dipetakan ke email `username@faradilahade.github.io`
(domain diatur di `src/lib/site.ts` → `adminEmailDomain`), jadi `admin-fara` = `admin-fara@faradilahade.github.io`.

Buat user itu **sekali** dengan salah satu cara:
- **Dashboard:** Authentication → Users → **Add user** → email `admin-fara@faradilahade.github.io`, password pilihan Anda, centang **Auto Confirm User**.
- **SQL:** buka `supabase/admin-user.sql`, ganti `CHANGE_ME_PASSWORD` dengan password Anda, paste di SQL Editor → Run.

⚠️ Repo ini publik. **Jangan pernah menulis password di file yang di-commit.** Setelah login pertama, ganti password di tab **Account** panel admin.

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

### Kenapa halaman masih kosong (blank)?
Repo sudah di-rename menjadi `faradilahade.github.io`, tetapi:
1. Branch `main` masih berisi kode lama — branch `claude/modest-goodall-r5aesu` belum di-merge.
2. Satu-satunya deploy yang ada adalah **re-run** dari push lama. Re-run memakai data event lama, sehingga build dibuat dengan base path `/porto_faradilahade-2026/`. Di alamat root semua aset menjadi 404 → halaman putih kosong.

Workflow yang baru membaca base path langsung dari konfigurasi GitHub Pages (`actions/configure-pages`), jadi rename repo atau re-run tidak lagi bisa menghasilkan path yang salah.

### Langkah memperbaiki (±5 menit)
1. **Merge** branch `claude/modest-goodall-r5aesu` ke `main`
   (GitHub → tab **Pull requests** → **New pull request** → base `main`, compare `claude/modest-goodall-r5aesu` → **Create** → **Merge**; atau `git checkout main && git merge claude/modest-goodall-r5aesu && git push`).
2. Pastikan **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. Pastikan **Settings → Secrets and variables → Actions** berisi `VITE_SUPABASE_URL` (tanpa `/rest/v1/`) dan `VITE_SUPABASE_ANON_KEY`.
4. Push ke `main` memicu workflow **Deploy to GitHub Pages** otomatis. Kalau perlu, jalankan manual: tab **Actions → Deploy to GitHub Pages → Run workflow**.
5. Tunggu ±1–2 menit, lalu buka `https://faradilahade.github.io/` (tekan Ctrl+Shift+R untuk melewati cache).

Catatan:
- `404.html` dibuat otomatis agar `/work/<slug>` dan `/contact` bisa dibuka/refresh langsung.
- Build **tidak akan gagal** meski secret Supabase belum diisi: situs tetap tampil (grid kosong) dan halaman admin menjelaskan apa yang kurang.
- Ingin domain sendiri (misal `faradilahade.com`)? Tambahkan di **Settings → Pages → Custom domain**; base path terdeteksi otomatis.

---

## 3. Panel admin (seperti WordPress, untuk portofolio Anda sendiri)

Buka `https://faradilahade.github.io/admin` → username `admin-fara` + password → **Dashboard**.

| Menu | Isi |
| --- | --- |
| **Overview** | Jumlah published/draft/featured/tools, daftar yang baru diubah, panduan 10 menit, daftar proyek yang terjemahannya belum lengkap. |
| **Projects** | Tabel semua proyek: cari, filter All/Published/Draft/Featured, urutkan ↑↓, **Publish/Unpublish**, **Feature**, **Preview**, **Duplicate**, **Edit**, **Delete**. Badge bahasa menunjukkan terjemahan yang tersimpan. |
| **New project / Edit** | Editor ala Medium: judul besar, ringkasan (≤220 karakter, jadi meta description), toolbar format (H2, **bold**, *italic*, list, quote, link), hitung kata & waktu baca, **pratinjau langsung** di kanan, **autosave lokal** (kalau tab tertutup, draft bisa dipulihkan). |
| ↳ Media | Drag-drop **cover**, **galeri** (tampil bertumpuk di pop-up, bisa diurutkan), **berkas** PDF/slide/notebook. Tersimpan di Supabase Storage. |
| ↳ Details | Field (Data/Finance/Risk), tahun, klien, peran, **Tools** (jadi badge & filter), **SEO keywords**, tags, tautan eksternal, embed Behance, slug. |
| ↳ Translations | Pilih bahasa sumber → **Auto-translate to all languages** → tinjau/sunting tab Indonesia · 日本語 · 中文 · English → publish. |
| ↳ Publishing | Published, Featured, urutan. Tombol **Save draft** / **Publish** / **Update**. |
| **Account** | Username, email login, **ganti password**, sign out. |

Format teks studi kasus (satu paragraf per baris):
```
## Judul bagian
Paragraf biasa dengan **tebal**, *miring*, dan [tautan](https://…).
- poin
1. langkah
> kutipan atau hasil utama
```

Tips agar mudah ditemukan mesin pencari: judul berisi hasil terukur, ringkasan menyebut institusi, isi Tools & Keywords di setiap proyek.

---

## 3b. Terjemahan otomatis (EN · ID · JA · ZH)

- **Bahasa situs** mengikuti bahasa browser pengunjung (bisa diganti di menu EN/ID/JA/ZH). Semua teks antarmuka, FAQ, dan SEO sudah tersedia dalam 4 bahasa.
- **Isi proyek** ditulis sekali dalam bahasa sumber. Di editor, **Auto-translate** memakai layanan terjemahan mesin gratis (Google, cadangan MyMemory) dari browser Anda, hasilnya disimpan di kolom `translations` dan bisa disunting sebelum publish.
- Proyek yang belum punya terjemahan tersimpan **tetap diterjemahkan otomatis di browser pengunjung** (judul, ringkasan, peran, dan isi saat pop-up dibuka), dengan label *Auto-translated* dan tombol *Lihat teks asli*. Hasil di-cache di browser. Matikan lewat `autoTranslate: false` di `src/lib/site.ts` bila ingin hanya terjemahan yang sudah ditinjau.
- Nama klien dan tools tidak diterjemahkan.

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
| Nama, email, WhatsApp, link sosial, domain username admin, saklar auto-translate, kata kunci SEO | `src/lib/site.ts` |
| Teks UI 4 bahasa (judul, tombol, bio, sorotan 240/92%/15.000/350+) | `src/lib/translations.ts` |
| Palet warna & skala tipografi | `tailwind.config.js` (ink, paper, steel, brass, slate, mist + ocean, tide, frost, line, fog, clay) dan token `--fs-*` di `src/index.css` |
| Visual hero & banner "data bands" | `src/components/HeroVisual.tsx`, `src/components/Banner.tsx` |
| FAQ (8 tanya-jawab, 4 bahasa) | kunci `faq.q1…a8` di `src/lib/translations.ts` |
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

Rute: `/` (hero + katalog karya; `/?field=data#work` membuka filter bidang), `/work/<slug>` (modal proyek, bisa dibagikan), `/contact`, `/admin`, `/admin/dashboard`.

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
src/pages/Home.tsx          halaman utama (hero, statistik, My work, katalog+filter, about, FAQ, book a call; modal via /work/:slug)
src/pages/Contact.tsx       kontak + form yang membuka aplikasi email
src/pages/admin/*           Login (username), Dashboard (shell), Overview, ProjectsTable, ProjectEditor, AccountPanel, shared.ts
src/lib/translate.ts        terjemahan mesin (Google gtx → MyMemory), cache, pemotongan teks
src/lib/richtext.tsx        renderer teks (## / - / 1. / > / **bold** / *italic* / [link]) untuk pop-up & pratinjau
src/hooks/useLocalized.ts   proyek dalam bahasa pengunjung (tersimpan → otomatis → asli)
supabase/admin-user.sql     (opsional) membuat user admin lewat SQL
src/components/*            Navbar, Footer, Wordmark, HeroVisual, Showcase (My work), Filters, RangeSlider, ProjectCard, ProjectModal, Faq, BookCall, ToolBadge, Icons
```
