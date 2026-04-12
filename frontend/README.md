# Ration Distribution System - Frontend
This is the React-based frontend for the Ration Distribution System. It's built using **Vite** for fast development and **Axios** for API communication with the Spring Boot backend.
## Key Features

I've implemented a full role-based access control (RBAC) system to ensure security and proper workflow:
### 1. Admin Dashboard (Master Control)
- **User Management**: Add new users (Admin/Manager/Beneficiary) and manage login credentials.
- **Ration Card Issuance**: Create digital ration cards with family size and category (APL, BPL, AAY).
- **Auto-Allocation Engine**: A smart system that calculates monthly ration based on family size and card status.
- **Eligibility Guard**: Prevents APL users from selecting subsidized goods like Sugar or Kerosene.
- **Reports**: View all allocations and transactions in real-time.
### 2. Shop Manager Dashboard
- **Inventory Control**: Update physical stock received at the ration shop.
- **Distribution Processing**: Hand over ration to beneficiaries after validating their allocation.
- **Stock Depletion**: Automatically reduces the shop's inventory when a distribution is completed.

### 3. Beneficiary Dashboard
- **Personal Card View**: Users can check their card type and status.
- **Allocation Status**: Check what items are ready for pickup this month.
- **Transaction History**: View all previous ration receipts and reference IDs.

## 🛠️ Tech Stack
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Standard CSS (Custom cards and layout)
- **State Management**: React Hooks (useState, useEffect)
- **Navigation**: Conditional rendering based on user session roles

## 📂 Folder Structure
- `/src/components`: All UI modules (Dashboards, Tables, Forms)
- `/src/services`: API configuration and Axios calls
- `/src/App.jsx`: Main entry point with session persistence and role-routing
