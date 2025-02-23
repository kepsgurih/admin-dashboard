# Kepsgurih ERP
## Overview
ERP System adalah solusi manajemen bisnis berbasis web yang dirancang untuk mengelola berbagai aspek operasional perusahaan, seperti penjualan, inventaris, keuangan, dan sumber daya manusia. Aplikasi ini dikembangkan menggunakan Next.js 15, Clerk untuk autentikasi, serta Prisma dengan PostgreSQL sebagai database utama.

### Features

#### Sales & Order Management
Leads Management: Mengelola calon pelanggan dan mengubah mereka menjadi pelanggan tetap.
Quotation: Pembuatan penawaran harga untuk pelanggan atau prospek.
Sales Order: Konversi dari quotation menjadi pesanan penjualan.
Invoice: Pembuatan tagihan berdasarkan pesanan yang telah dikonfirmasi.
Payment: Pemrosesan dan pencatatan pembayaran dari pelanggan.

#### Inventory Management
Product Management: Mengelola daftar produk dan stok.
Stock Control: Melacak pergerakan stok masuk dan keluar.
Supplier Management: Mengelola pemasok dan pembelian barang.
Warehouse Management: Mengatur penyimpanan barang di berbagai lokasi gudang.

#### Customer Relationship Management (CRM)
Leads & Prospects: Mengelola data prospek bisnis dan peluang penjualan.
Customer Management: Penyimpanan dan pengelolaan informasi pelanggan.
Support & Ticketing: Sistem bantuan pelanggan untuk menangani keluhan dan pertanyaan.

#### Human Resources (HRIS)

Employee Management: Mengelola data karyawan.
Attendance & Payroll: Pemantauan kehadiran dan penggajian.
Leave & Time-off Requests: Manajemen cuti karyawan.

#### Finance & Accounting

Accounts Payable & Receivable: Mengelola hutang dan piutang.
Expense Tracking: Pencatatan pengeluaran perusahaan.
Financial Reports: Pembuatan laporan keuangan.

## Tech Stack

- Framework: Next.js 15
- UI: Shadcn
- Authentication: Clerk
- Database ORM: Prisma
- Database: PostgreSQL
- API Layer: Next.js API Routes

## Installation

Prerequisites
Node.js & npm/yarn
PostgreSQL database

## Setup

1. Clone Repository
```bash
git clone git@github.com:kepsgurih/admin-dashboard.git
cd admin-dashboard
```
2. Install Dependencies
```bash
bun install
```
3. Setup Environment Variables
4. Buat file .env dan tambahkan:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/erp_db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_api_key"
CLERK_SECRET_KEY="your_clerk_backend_key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/apps
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/apps
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```
5. Migrate Database
```bash
bunx prisma migrate dev --name init
```
6. Run Development Server
```bash
bun run dev
```
## Contribution

Jika ingin berkontribusi, silakan buat pull request atau diskusikan ide Anda melalui issues di repository GitHub.

## License

Proyek ini menggunakan lisensi MIT.


## Todo
#### Core
- [x] AUTH
- [x] UI
- [x] DATABASE  
- [ ] RBAC  
- [ ] CUSTOM MENU  
- [ ] OVERVIEW
- [ ] ANALYSTICTS
- [ ] REPORT
#### Sales & Order Module
- [x] Quotation
- [x] Sales Order 
- [x] Invoice 
- [x] Payment 
#### CRM
- [x] Customer
- [x] Leads 
- [ ] Ticketing
#### INVENTORY
- [ ] PRODUCT
- [ ] CATEGORIES 
- [ ] STOCK MANAGEMENT
- [ ] SUPPLIER
- [ ] CONNECT TO SO
#### PROCUREMENT
- [ ] PO
- [ ] VENDOR MANAGEMENT 
- [ ] RECEIVING
- [ ] BILLS
- [ ] CONNECT TO INVENTORY AND SO
#### PROCUREMENT
- [ ] EMPLOYEES
- [ ] ATTENDANCE
- [ ] PAYROLL
- [ ] LEAVES
- [ ] RECRUITMENT
#### SETTING
- [ ] GENERAL
- [ ] TEAMS
- [ ] BILLING
- [ ] LIMIT