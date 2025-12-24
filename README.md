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

## 📊 Alur Register Toko (Sequence Diagram)

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

