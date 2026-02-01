# Tenant Inventory Management System

A full-stack multi-tenant inventory management system
supporting products, suppliers, purchase orders, stock tracking,
and role-based access.

## 1. Setup 

### Backend
cd server
npm install
npm run seed
npm start

### Frontend
cd client
npm install
npm run dev

### Login Credentials
Tenant: Alpha Traders
1. OWNER   → owner@alpha.com / owner123
2. MANAGER → manager@alpha.com / manager123
3. STAFF   → staff@alpha.com / staff123

Tenant: Beta Stores
1. OWNER   → owner@beta.com / owner123
2. MANAGER → manager@beta.com / manager123
3. STAFF   → staff@beta.com / staff123


### UI Flow (OWNER & MANAGER)
1. Register/Login
2. Dashboard Opened
3. Create Product/See existing product (view/edit/delete)
4. Create Supplier/ See exisiting suppliers
5. Purchase Order (Draft -> Send put quantity in pending followed by Confirmed & Receive Stock(clickable))
6. Can check stock ledger & low stock 
7. Inventory Order placing (realtime update)
8. Check stock shortage if available
9. Cancel Order will regain stock (realtime update)
10. Repeat if want
11. Logout (will disconnect socket.io)

### Team Management
1. Owner can create managers & staffs
2. Manager can create staffs

### Staff Limitations
1. Dashboard
2. View Product
3. Create Order (Main task) [Owner/manager can cancel]
4. View stock ledger

### More Things to do
1. Dashboard Improvement
2. Sweetalert Popups
3. Validations
4. Order per staff etc...