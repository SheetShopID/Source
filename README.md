# Github - Next.js + vercel + Firebase + Dynamic Subdomain

## 🚀 Features
- Dynamic shop pages via /[shop]
- Firebase Realtime Database
- Wildcard subdomain compatible for Vercel
- Google Sheet CSV product source

## 📦 Install
```
npm install
```

## ▶ Run
```
npm run dev
```

## 📊 flow utama

```mermaid
flowchart TD
    A[User buka website] --> B{Domain utama?}
    B -- Ya --> C[Tampilkan Form Register]
    C --> D[Submit Data]
    D --> E{Subdomain tersedia?}
    E -- Tidak --> F[Error Subdomain]
    E -- Ya --> G[Simpan ke Firebase]
    G --> H[Redirect ke Subdomain]

    B -- Tidak --> I[Tampilkan Halaman Toko]
    I --> J[Ambil Data Firebase]
    J --> K[Ambil Produk Google Sheet]
    K --> L[Tampilkan Produk]

```

## 📊 Alur Register Toko (domain utama)

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextJS as Next.js App
    participant API as API register-shop
    participant Firebase as Firebase RTDB

    User ->> Browser: Buka tokoinstan.online
    Browser ->> NextJS: Request /
    NextJS ->> Browser: Tampilkan halaman Register

    User ->> Browser: Isi form & submit
    Browser ->> API: POST /api/register-shop
    API ->> Firebase: Cek subdomain
    Firebase -->> API: Subdomain tersedia

    API ->> Firebase: Simpan data toko
    Firebase -->> API: OK

    API -->> Browser: Success
    Browser ->> User: Redirect ke subdomain toko
```

## 🚀 Alur Akses Toko (Subdomain)
```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Middleware
    participant Page as ShopPage
    participant API as API get-shop
    participant Firebase as Firebase RTDB
    participant Sheet as Google Sheet

    User ->> Browser: Buka tokoku.tokoinstan.online
    Browser ->> Middleware: Request
    Middleware ->> Browser: Set header x-shop-id

    Browser ->> Page: Render halaman toko
    Page ->> API: GET /api/get-shop?shop=tokoku
    API ->> Firebase: Ambil data toko
    Firebase -->> API: Data toko

    API -->> Page: JSON toko
    Page ->> Sheet: Fetch CSV produk
    Sheet -->> Page: Data CSV

    Page ->> Browser: Tampilkan toko & produk

