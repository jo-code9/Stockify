# Product API

REST API sederhana untuk mengelola data produk menggunakan **Node.js**, **Express.js**, dan **SQLite3**. Project ini dibuat untuk mempelajari konsep dasar REST API, pemisahan tanggung jawab antara routes, controllers, dan models, serta penggunaan database SQLite.

## Fitur

- Mengambil semua produk.
- Mengambil detail produk berdasarkan ID.
- Menambahkan satu produk.
- Menambahkan banyak produk sekaligus (*bulk insert*).
- Memperbarui data produk.
- Menghapus produk.
- Membuat tabel database secara otomatis saat server dijalankan.

## Teknologi

- [Node.js](https://nodejs.org/) — runtime JavaScript.
- [Express.js](https://expressjs.com/) — framework untuk membuat REST API.
- [SQLite3](https://www.npmjs.com/package/sqlite3) — database.
- [dotenv](https://www.npmjs.com/package/dotenv) — membaca konfigurasi dari file `.env`.
- [cors](https://www.npmjs.com/package/cors) — mengatur akses lintas origin.

## Struktur Project

```text
project/
├── server.js
├── database.sqlite
├── .env
├── package.json
├── sql_scripts/
│   └── init.sql
└── src/
    ├── config/
    │   └── database.js
    ├── controllers/
    │   └── productController.js
    ├── models/
    │   └── productModel.js
    ├── routes/
    │   ├── productRoutes.js
    │   └── test.js
    └── middlewares_helpers/
        └── sqlite3_helpers.js
```

**Catatan:** `database.sqlite` akan dibuat secara otomatis jika belum tersedia, bergantung pada konfigurasi koneksi database. Sesuaikan struktur di atas jika lokasi file di project berbeda.

## Instalasi

### 1. Clone atau download project

Jika project sudah ada di komputer, buka terminal di folder project tersebut.

### 2. Install dependencies

```bash
npm install
```

Jika dependencies belum tercantum di `package.json`, install paket yang dibutuhkan:

```bash
npm install express sqlite3 cors dotenv
```

### 3. Konfigurasi environment

Buat file `.env` di root project:

```env
PORT=3000
```

### 4. Jalankan server

Jika `package.json` sudah memiliki script `start`:

```bash
npm start
```

Atau jalankan langsung:

```bash
node server.js
```

Jika berhasil, server akan berjalan di:

```text
http://localhost:3000
```

Database dan tabel akan diinisialisasi ketika server dijalankan, sesuai konfigurasi `database.js`.

## Database

Tabel `products` dibuat menggunakan file `sql_scripts/init.sql`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INTEGER | Primary key, bertambah otomatis |
| `name` | TEXT | Nama produk, wajib diisi |
| `price` | REAL | Harga produk, wajib diisi |
| `stock` | INTEGER | Jumlah stok, default `0` |
| `category` | TEXT | Kategori produk |
| `description` | TEXT | Deskripsi produk |
| `is_available` | INTEGER | Status ketersediaan, default `1` |
| `created_at` | DATETIME | Waktu data dibuat |
| `updated_at` | DATETIME | Waktu data diperbarui |

Database tidak harus berisi data awal. Produk dapat ditambahkan melalui endpoint API.

## API Endpoints

Base URL:

```text
http://localhost:3000/api/products
```

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/products` | Mengambil semua produk |
| GET | `/api/products/:id` | Mengambil produk berdasarkan ID |
| POST | `/api/products` | Menambahkan satu produk |
| POST | `/api/products/bulk` | Menambahkan banyak produk sekaligus |
| PUT | `/api/products/:id` | Memperbarui produk |
| DELETE | `/api/products/:id` | Menghapus produk |

### 1. Mengambil semua produk

**Request**

```http
GET /api/products
```

### 2. Mengambil produk berdasarkan ID

**Request**

```http
GET /api/products/1
```

### 3. Menambahkan satu produk

**Request**

```http
POST /api/products
Content-Type: application/json
```

**Body**

```json
{
  "name": "Kopi Susu Gula Aren",
  "price": 22000,
  "stock": 50,
  "category": "Minuman",
  "description": "Kopi susu dengan gula aren asli",
  "is_available": 1
}
```

### 4. Menambahkan banyak produk sekaligus

Endpoint bulk insert memungkinkan beberapa produk ditambahkan dalam satu request.

**Request**

```http
POST /api/products/bulk
Content-Type: application/json
```

**Body**

```json
{
  "products": [
    {
      "name": "Kopi Susu Gula Aren",
      "price": 22000,
      "stock": 50,
      "category": "Minuman",
      "description": "Kopi susu dengan gula aren asli",
      "is_available": 1
    },
    {
      "name": "Croissant Butter",
      "price": 18000,
      "stock": 30,
      "category": "Makanan",
      "description": "Croissant mentega homemade",
      "is_available": 1
    },
    {
      "name": "Air Mineral 600ml",
      "price": 5000,
      "stock": 100,
      "category": "Minuman",
      "description": "Air mineral botol",
      "is_available": 1
    }
  ]
}
```

Properti `products` harus berupa array yang tidak kosong. Setiap produk harus memiliki `name` dan `price` yang valid.

Jika implementasi model menggunakan transaksi database, seluruh proses bulk insert akan di-*commit* ketika berhasil dan di-*rollback* ketika terjadi kegagalan.

### 5. Memperbarui produk

**Request**

```http
PUT /api/products/1
Content-Type: application/json
```

**Body**

```json
{
  "name": "Kopi Susu Gula Aren Large",
  "price": 25000,
  "stock": 40
}
```

### 6. Menghapus produk

**Request**

```http
DELETE /api/products/1
```

## Contoh Respons API

Format respons mengikuti implementasi controller yang digunakan.

**Respons berhasil**

```json
{
  "success": true,
  "message": "Produk berhasil dibuat",
  "data": {
    "id": 1,
    "name": "Kopi Susu Gula Aren",
    "price": 22000
  }
}
```

**Respons gagal**

```json
{
  "success": false,
  "message": "Validasi gagal",
  "error": "Nama produk wajib diisi"
}
```

Data di atas hanya contoh format; isi respons aktual bergantung pada endpoint dan implementasi controller.

## Alur Kerja Aplikasi

```text
Client
  |
  v
Routes
  |
  v
Controllers
  |
  v
Models
  |
  v
SQLite Helpers
  |
  v
SQLite Database
```

Penjelasan singkat:

- **Routes:** menentukan endpoint dan menghubungkannya ke controller.
- **Controllers:** menangani request, validasi input, dan response.
- **Models:** berisi operasi database untuk data produk.
- **SQLite Helpers:** menyediakan fungsi reusable seperti `dbRun`, `dbGet`, dan `dbAll`.
- **Database:** menyimpan data produk di SQLite.

## Catatan Pengembangan

- Gunakan parameter SQL (`?`) untuk menghindari penyusunan query dari input pengguna secara langsung.
- Validasi input sebelum menyimpan data ke database.
- Hindari mengunggah file `.env` atau database yang berisi data sensitif ke repository publik.
- Pastikan file `sql_scripts/init.sql` dibaca dari lokasi yang benar oleh `database.js`.

## Lisensi

Project ini dibuat untuk keperluan pembelajaran dan dapat dikembangkan lebih lanjut sesuai kebutuhan.

# STOCKIFY
## Sistem Manajemen Inventaris dan Stok Barang Toko

### 1. Deskripsi Proyek

Stockify merupakan aplikasi berbasis web yang dirancang untuk membantu pengelolaan inventaris dan stok barang pada toko.

Aplikasi ini memungkinkan pengguna untuk menambahkan, melihat, mengubah, dan menghapus data barang. Stockify juga menyediakan dashboard statistik, pencarian barang, filter kategori, serta informasi status stok.

### 2. Latar Belakang

Pengelolaan inventaris merupakan salah satu kegiatan penting dalam operasional toko. Pencatatan barang secara manual dapat menyebabkan kesalahan pencatatan, kesulitan mencari data, dan keterlambatan mengetahui kondisi stok.

Oleh karena itu, dikembangkan Stockify sebagai sistem manajemen inventaris berbasis web untuk membantu proses pencatatan dan pemantauan stok barang secara lebih mudah dan terstruktur.

### 3. Tujuan Proyek

1. Mempermudah pengelolaan data barang.
2. Mempermudah pemantauan jumlah stok.
3. Menyediakan pencarian dan filter data barang.
4. Mengimplementasikan API Server yang terintegrasi dengan aplikasi web.
5. Menerapkan operasi CRUD dalam pengelolaan inventaris.

### 4. Teknologi yang Digunakan

| Teknologi | Kegunaan |
|---|---|
| HTML | Membuat struktur halaman web |
| CSS | Mengatur tampilan aplikasi |
| JavaScript | Menambahkan interaksi pada frontend |
| Node.js | Menjalankan server |
| Express.js | Mengelola API dan routing |
| SQLite | Menyimpan data inventaris |
| Visual Studio Code | Editor kode program |

### 5. Fitur Aplikasi

- **Create:** Menambahkan barang baru.
- **Read:** Menampilkan daftar barang.
- **Update:** Mengubah informasi barang.
- **Delete:** Menghapus barang.
- **Dashboard:** Menampilkan statistik inventaris.
- **Pencarian:** Mencari barang berdasarkan nama atau kategori.
- **Filter kategori:** Menampilkan barang berdasarkan kategori.
- **Filter status stok:** Menampilkan barang berdasarkan kondisi stok.
- **Status stok otomatis:** Menentukan status Tersedia, Menipis, atau Habis.

### 6. Arsitektur Sistem

Stockify menggunakan arsitektur Client-Server.

Frontend dibuat menggunakan HTML, CSS, dan JavaScript. Frontend mengirimkan permintaan HTTP menggunakan Fetch API ke backend.

Backend menggunakan Node.js dan Express.js untuk memproses permintaan API. Data inventaris disimpan menggunakan database SQLite.

Alur sistem:

Browser (Frontend) → API Server (Express.js) → Database (SQLite)

### 7. Pengembang

Proyek ini dikembangkan secara berkelompok sebagai bagian dari tugas Ujian Tengah Semester (UTS).

### 8. Dokumentasi API

API Stockify digunakan sebagai penghubung antara frontend dan database SQLite.

Base URL:

`http://localhost:3000/api/products`

#### A. GET  Menampilkan Semua Barang

Endpoint:

`GET /api/products`

Fungsi: Mengambil seluruh data barang yang tersimpan di database.

#### B. GET  Menampilkan Barang Berdasarkan ID

Endpoint:

`GET /api/products/:id`

Fungsi: Mengambil informasi satu barang berdasarkan ID.

#### C. POST  Menambahkan Barang

Endpoint:

`POST /api/products`

Fungsi: Menambahkan data barang baru ke database.

Contoh request body:

```json
{
  "name": "Pulpen",
  "price": 3000,
  "stock": 20,
  "category": "Alat Tulis",
  "description": "Pulpen warna hitam"
}
```

#### D. PUT  Mengubah Data Barang

Endpoint:

`PUT /api/products/:id`

Fungsi: Memperbarui informasi barang berdasarkan ID.

#### E. DELETE  Menghapus Barang

Endpoint:

`DELETE /api/products/:id`

Fungsi: Menghapus data barang berdasarkan ID.

#### F. Integrasi Frontend dengan API

Frontend menggunakan JavaScript Fetch API untuk berkomunikasi dengan backend.

Metode HTTP yang digunakan:

- GET untuk membaca data.
- POST untuk menambahkan data.
- PUT untuk memperbarui data.
- DELETE untuk menghapus data.
#### G. POST Menambahkan Banyak Barang Sekaligus (Bulk Create)
##### Contoh Request Body

```json
{
  "products": [
    {
      "name": "Buku Tulis",
      "price": 5000,
      "stock": 20,
      "category": "Alat Tulis",
      "description": "Buku tulis 38 lembar"
    },
    {
      "name": "Pulpen",
      "price": 3000,
      "stock": 15,
      "category": "Alat Tulis",
      "description": "Pulpen tinta hitam"
    }
  ]
}
```

##### Validasi

- `products` harus berupa array dan tidak boleh kosong.
- Setiap barang wajib memiliki `name` berupa teks yang tidak kosong.
- Setiap barang wajib memiliki `price` berupa angka yang lebih besar atau sama dengan nol.

##### Respons Berhasil

HTTP Status: `201 Created`

Contoh format respons:

```json
{
  "success": true,
  "message": "2 produk berhasil dibuat",
  "data": []
}
```


Endpoint:

`POST /api/products/bulk`

Fungsi: Menambahkan beberapa data barang sekaligus ke database dalam satu permintaan API.

Endpoint ini menggunakan fungsi `bulkCreateProducts` pada product controller.
### 9. Database
#### Pengelolaan Data Barang

Model bertugas menjalankan perintah SQL untuk mengelola data barang pada database SQLite.

Operasi database yang digunakan:

- `SELECT`: Mengambil seluruh data barang.
- `SELECT WHERE`: Mengambil barang berdasarkan ID.
- `INSERT`: Menambahkan barang baru.
- `UPDATE`: Mengubah informasi barang.
- `DELETE`: Menghapus barang.

#### Pengelolaan Banyak Data (Bulk Create)

Fitur Bulk Create menggunakan SQLite Transaction agar proses penyimpanan beberapa barang dapat dikelola sebagai satu kesatuan.

Tahapan proses:

1. `BEGIN TRANSACTION`: Memulai transaksi.
2. `INSERT`: Menambahkan data barang satu per satu.
3. `COMMIT`: Menyimpan seluruh perubahan jika berhasil.
4. `ROLLBACK`: Membatalkan perubahan jika terjadi kesalahan.

Dengan mekanisme ini, proses Bulk Create lebih terjaga konsistensinya.

Stockify menggunakan SQLite sebagai sistem penyimpanan data.

Tabel utama yang digunakan adalah `products`, dengan informasi:

| Kolom | Keterangan |
|---|---|
| id | ID unik barang |
| name | Nama barang |
| price | Harga barang |
| stock | Jumlah stok |
| category | Kategori barang |
| description | Deskripsi barang |
| is_available | Status ketersediaan |
| created_at | Waktu data dibuat |
| updated_at | Waktu data diperbarui |

### 10. Cara Menjalankan Aplikasi

1. Pastikan Node.js sudah terpasang.
2. Buka folder Stockify melalui Visual Studio Code.
3. Buka terminal CMD.
4. Jalankan perintah `npm install` jika dependencies belum terpasang.
5. Jalankan perintah `npm start`.
6. Buka browser.
7. Akses `http://localhost:3000`.

### 11. Kesimpulan

Stockify merupakan aplikasi manajemen inventaris berbasis web yang mengimplementasikan operasi CRUD dengan integrasi API Server dan database SQLite.

Aplikasi ini membantu pengguna mengelola data barang, memantau kondisi stok, melakukan pencarian, serta menyaring barang berdasarkan kategori dan status stok.

### 12. Pengujian Sistem

Pengujian dilakukan untuk memastikan setiap fitur pada aplikasi Stockify dapat berjalan sesuai fungsinya.

#### A. Pengujian CRUD

| No. | Fitur | Hasil yang Diharapkan | Status |
|---|---|---|---|
| 1 | Create | Data barang berhasil ditambahkan | Berhasil |
| 2 | Read | Data barang berhasil ditampilkan | Berhasil |
| 3 | Update | Data barang berhasil diperbarui | Berhasil |
| 4 | Delete | Data barang berhasil dihapus | Berhasil |

#### B. Pengujian Fitur Tambahan

| No. | Fitur | Hasil yang Diharapkan | Status |
|---|---|---|---|
| 1 | Pencarian | Barang dapat dicari berdasarkan nama | Berhasil |
| 2 | Filter Kategori | Barang dapat disaring berdasarkan kategori | Berhasil |
| 3 | Filter Status Stok | Barang dapat disaring berdasarkan kondisi stok | Berhasil |
| 4 | Dashboard | Statistik inventaris ditampilkan | Berhasil |

#### C. Pengujian API

API diuji menggunakan permintaan HTTP dengan metode GET, POST, PUT, dan DELETE.

Hasil pengujian menunjukkan bahwa frontend dapat berkomunikasi dengan backend melalui API dan data dapat dikelola menggunakan database SQLite.

### 13. Dokumentasi Tampilan Aplikasi

Bagian ini berisi screenshot aplikasi Stockify sebagai bukti implementasi fitur.

Screenshot yang disarankan:

1. Tampilan utama dashboard Stockify.
2. Form tambah barang.
3. Tabel daftar barang.
4. Fitur pencarian dan filter.
5. Tampilan setelah data barang berhasil ditambahkan.