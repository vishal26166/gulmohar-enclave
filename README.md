# Gulmohar Enclave – Resident, Gate & PG Management System

A web-based Resident, Gate Security, and 22 PG Management System for **Gulmohar Enclave, Dehradun, Uttarakhand**.

Built with **React**, **TypeScript**, **Tailwind CSS v4**, **Lucide React**, and **Vite**.

---

## 🌟 Key Features

### 🛡️ 1. Gate Guard Terminal
- **Instant Resident Search**: Search residents by Name, Phone Number, Room (e.g. `101-A`), or PG Name in under 5 seconds.
- **One-Tap Entry/Exit**: Tap **Mark ENTRY** or **Mark EXIT** with automatic timestamping and status synchronization.
- **Late Entry Detection**: Automatic curfew violation flagging for entries past curfew (default 10:30 PM) with notifications sent to the PG Warden.
- **QR Code / RFID Scanner**: Integrated simulated barcode/QR scanner modal for rapid gate entry processing.
- **Live Activity Feed**: Real-time society-wide gate movement activity feed.

### 🏢 2. PG Warden Dashboard (22 PGs Integrated)
- **Multi-PG Switcher**: Select any of the 22 PGs to view PG-specific residents, room numbers, and inside/outside counts.
- **Visitor Approval Requests (F12)**: Review, Approve, or Reject guest requests from residents.
- **Inline Warden Setup**: Edit Warden Name, Phone Number, and Night Curfew timings.
- **Curfew Violation Log**: Dedicated log tracking all late entries for the selected PG.

### 👑 3. Society Admin & Committee Console
- **Resident Directory (F1)**: Complete master directory across all 22 PGs with **Register Resident** and **Edit Resident** modals.
- **22 PGs Setup (F2)**: Overview of all 22 PGs, capacities, and active wardens.
- **Emergency Headcount Safety Matrix (F15)**: Live per-PG occupant breakup with one-click **Download Emergency Manifest (CSV)** for fire and medical evacuation.
- **Immutable Audit Trail (F9)**: Chronological history of all admin edits, warden updates, and security actions.
- **CSV Data Export (F10)**: Export Resident Database and Gate Logs to standard CSV.

### 👤 4. Resident Portal
- **Digital Gate Pass**: Resident profile card with a scannable QR code for main gate access.
- **Personal Movement History**: View individual gate entry/exit logs.
- **Pre-Register Visitors**: Submit guest pre-registration requests to the PG Warden.

---

## 💻 Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Persistence**: LocalStorage with rich mock dataset for all 22 PGs

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📤 Pushing to GitHub

To push this repository to your GitHub account:

1. **Create a new repository on GitHub**:
   - Go to [GitHub New Repository](https://github.com/new).
   - Name it `gulmohar-enclave-management`.
   - Do **NOT** initialize with a README, .gitignore, or license (they are already included).

2. **Link local repository and push**:
   Run the following commands in your terminal:

   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/gulmohar-enclave-management.git
   git branch -M main
   git push -u origin main
   ```
