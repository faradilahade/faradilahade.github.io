# Faradilah Ade — Portfolio Website

Website portofolio profesional dengan panel admin (seperti Medium/WordPress mini) untuk mengelola pekerjaan: tambah, edit, hapus, upload foto & lampiran. Multi bahasa otomatis: English, Indonesia, 日本語, 中文.

**Stack:** Vite + React + TypeScript + Tailwind CSS + Supabase (database, auth, storage)

---

## 1. Persiapan Supabase (sekali saja, ±10 menit)

1. Buat akun gratis di https://supabase.com lalu **New project**
2. Setelah project jadi, buka **SQL Editor** → paste seluruh isi file `supabase/schema.sql` → **Run**
   - Catatan: bagian storage policy butuh bucket dulu. Kalau error di bagian storage, lanjut ke langkah 3 dulu lalu run ulang bagian storage-nya.
3. Buka **Storage** → **New bucket** → nama: `portfolio` → centang **Public bucket** → Save
4. Buka **Authentication** → **Users** → **Add user** → isi email & password kamu sendiri (ini akun login admin kamu)
5. Buka **Project Settings** → **API** → salin:
   - `Project URL`
   - `anon public` key

## 2. Setup Lokal (VS Code)

```bash
# di folder project ini
cp .env.example .env
# edit .env, isi dengan URL & anon key dari langkah 1.5

npm install
npm run dev
```

Buka http://localhost:5173

- Halaman publik: `/` (home), `/work`, `/work/:slug`, `/contact`
- Panel admin: `/admin` → login dengan akun dari langkah 1.4 → kelola portofolio di `/admin/dashboard`

## 3. Menambah Portofolio

1. Buka `/admin`, login
2. Klik **New project**
3. Isi judul (slug otomatis dibuat), ringkasan, konten (satu paragraf per baris), kategori (Data / Finance / Risk), tags
4. Upload **cover image** dan **attachments** (PDF, gambar, dsb.) — otomatis tersimpan di Supabase Storage
5. Centang **Published** agar tampil di website, **Featured** agar muncul di halaman depan
6. **Create project** — selesai, langsung live

## 4. Deploy ke Internet (gratis)

### Vercel (paling mudah)
1. Push folder ini ke GitHub
2. Buka https://vercel.com → **Import Project** → pilih repo
3. Di **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — dapat URL `namamu.vercel.app`, bisa disambungkan domain sendiri

### Netlify (alternatif)
Sama seperti Vercel: import repo, isi environment variables, build command `npm run build`, publish directory `dist`.

**Penting untuk routing:** kalau refresh di halaman selain `/` menghasilkan 404 di Vercel/Netlify, tambahkan file `vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## 5. Kustomisasi

- **Warna & font:** `tailwind.config.js` (palet: ink, paper, steel, brass, slate, mist)
- **Teks 4 bahasa:** `src/lib/translations.ts`
- **Kontak & sosial media:** `src/pages/Contact.tsx` dan `src/components/Footer.tsx`
- **Statistik hero (240, 92%, dst.):** `src/pages/Home.tsx`

## Keamanan

- Login admin memakai Supabase Auth; hanya user terdaftar yang bisa menulis data (dijaga Row Level Security di database, bukan cuma di tampilan)
- Pengunjung publik hanya bisa membaca project yang `published = true`
- Jangan pernah commit file `.env` ke GitHub (sudah ada di `.gitignore`)
