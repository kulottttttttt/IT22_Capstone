# Quick Reference Guide

## 🚀 One-Page Cheat Sheet

---

## 📍 URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5174/ |
| **Backend API** | http://localhost:5257 |
| **Swagger Docs** | http://localhost:5257/swagger |
| **SignalR Hub** | http://localhost:5257/hubs/parking |

---

## 🔑 Login Credentials

| Role | Username | Password |
|------|----------|----------|
| **SuperAdmin** | `superadmin` | `Admin@123` |

---

## 📂 Key Files

### **New Components**
- `src/components/Layout/Sidebar.tsx`
- `src/components/Layout/DashboardHeader.tsx`
- `src/components/Layout/DashboardLayout.tsx`
- `src/components/Dashboard/StatCard.tsx`

### **Updated Pages**
- `src/pages/SuperAdminDashboard.tsx`
- `src/pages/AdminDashboard.tsx`
- `src/pages/StaffDashboard.tsx`
- `src/pages/PublicParkingView.tsx`

### **Routing**
- `src/App.tsx`

---

## 🎨 Layout Structure

```
┌──────────┬─────────────────────────────────────┐
│          │  HEADER (white)                     │
│ SIDEBAR  ├─────────────────────────────────────┤
│ (dark)   │                                     │
│          │  CONTENT (light gray)               │
│          │  - Stats Cards                      │
│          │  - Parking Overview                 │
│          │  - System Health                    │
│          │  - Predictions                      │
│          │  - Quick Actions                    │
│          │  - Recent Activity                  │
└──────────┴─────────────────────────────────────┘
```

---

## 🎯 SuperAdmin Dashboard Sections

1. **Stats Cards** (Top row - 4 cards)
   - Total Slots: 240
   - Available: 87 (+12% trend)
   - Occupied: 142 (-8% trend)
   - Maintenance: 11

2. **Parking Area Overview** (Left column)
   - Zone A, B, C with metrics
   - Floor information
   - Real-time counts

3. **System Health** (Right column)
   - Database status
   - API Server status
   - SignalR Hub status
   - IoT Sensors status
   - System Uptime: 99.8%

4. **Occupancy Predictions** (Bottom left)
   - Next 30 min: 68% (Medium)
   - Next 1 hour: 75% (High)
   - Next 2 hours: 82% (High)

5. **Quick Actions** (Bottom right)
   - 👥 Manage Users
   - 🅿️ Add Parking Area
   - 📊 View Reports
   - ⚙️ Settings

6. **Recent Activity** (Full width bottom)
   - Latest system events
   - User attribution
   - Timestamps

---

## 🎨 Color Reference

| Element | Color | Hex |
|---------|-------|-----|
| **Sidebar BG** | Dark Gray Gradient | #111827 → #1f2937 |
| **Active Nav** | Blue | #2563eb |
| **Content BG** | Light Gray | #f9fafb |
| **Cards** | White | #ffffff |
| **Success** | Green | #10b981 |
| **Warning** | Yellow | #f59e0b |
| **Danger** | Red | #ef4444 |
| **Primary** | Blue | #2563eb |

---

## 📐 Component Props

### **StatCard**
```typescript
<StatCard
  title="Total Slots"
  value="240"
  icon="🅿️"
  color="blue"
  trend={{ value: 5, isPositive: true }}
/>
```

### **DashboardHeader**
```typescript
<DashboardHeader 
  title="SuperAdmin Dashboard" 
  subtitle="Complete system overview"
/>
```

---

## 🧭 Navigation Routes

| Role | Path | Component |
|------|------|-----------|
| **Public** | `/` | PublicParkingView |
| **Auth** | `/login` | Login |
| **SuperAdmin** | `/superadmin` | SuperAdminDashboard |
| **Admin** | `/admin` | AdminDashboard |
| **Staff** | `/staff` | StaffDashboard |

---

## 🔧 Commands

### **Start Frontend**
```bash
cd frontend
npm run dev
```

### **Start Backend**
```bash
cd backend/src/SmartParking.Presentation
dotnet run
```

### **Build Frontend**
```bash
cd frontend
npm run build
```

### **Type Check**
```bash
cd frontend
npm run type-check
```

---

## 🐛 Troubleshooting

### **Frontend won't start**
- Check if port 5174 is in use
- Delete `node_modules` and run `npm install`
- Check for syntax errors in files

### **Backend won't start**
- Check if port 5257 is in use
- Verify SQL Server is running
- Run `dotnet restore`

### **Login fails**
- Verify backend is running
- Check browser console for errors
- Verify CORS is configured
- Check Network tab for API response

### **Styles look broken**
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Check TailwindCSS is loading
- Verify `postcss.config.js` is correct

---

## ✅ Testing Checklist

- [ ] Frontend starts without errors
- [ ] Backend starts without errors
- [ ] Login page loads
- [ ] Can login with superadmin
- [ ] Sidebar appears (dark)
- [ ] Header appears (white)
- [ ] Dashboard loads all sections
- [ ] Navigation works
- [ ] Logout works
- [ ] No console errors

---

## 📊 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Language** | TypeScript 6 |
| **Styling** | TailwindCSS v4 |
| **Routing** | React Router v7 |
| **State** | Zustand |
| **HTTP** | Axios |
| **Real-time** | SignalR |
| **Backend** | ASP.NET Core 9 |
| **Database** | SQL Server |
| **ORM** | Entity Framework Core 9 |

---

## 📝 Next Steps

### **Immediate**
1. Test the UI in browser
2. Verify all sections render correctly
3. Test navigation and logout
4. Take screenshots for documentation

### **Short Term**
1. Connect real API data
2. Replace placeholder values
3. Implement chart components
4. Add loading states
5. Add error handling

### **Long Term**
1. Build CRUD pages
2. Implement live monitoring
3. Add parking map visualization
4. Create reports section
5. Add user management
6. Implement audit logs

---

## 🎓 Learning Resources

### **TailwindCSS**
- Official Docs: https://tailwindcss.com/docs
- Cheat Sheet: https://nerdcave.com/tailwind-cheat-sheet

### **React Router**
- Official Docs: https://reactrouter.com/

### **Zustand**
- GitHub: https://github.com/pmndrs/zustand

### **TypeScript**
- Official Docs: https://www.typescriptlang.org/docs/

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check terminal output
3. Verify backend is running
4. Review documentation files
5. Check Network tab for API errors

---

## 📄 Documentation Files

| File | Purpose |
|------|---------|
| `UI_REDESIGN_COMPLETION.md` | Full completion report |
| `TESTING_GUIDE.md` | Step-by-step testing instructions |
| `FILES_CHANGED_SUMMARY.md` | List of all changed files |
| `VISUAL_DESIGN_SPEC.md` | Complete visual design description |
| `QUICK_REFERENCE.md` | This file - quick reference |

---

## ⚡ Quick Commands

```bash
# Start everything
cd backend/src/SmartParking.Presentation && dotnet run
cd frontend && npm run dev

# Test login
# URL: http://localhost:5174/login
# Username: superadmin
# Password: Admin@123

# Check status
# Frontend: http://localhost:5174/
# Backend: http://localhost:5257/swagger
```

---

## 🎯 Success Indicators

✅ **Frontend Running:** Terminal shows "ready in Xms" with URL
✅ **Backend Running:** Terminal shows "Now listening on: http://localhost:5257"
✅ **No Errors:** Browser console is clean (no red errors)
✅ **Sidebar Visible:** Dark left panel with navigation
✅ **Header Visible:** White top bar with title and user info
✅ **Dashboard Loaded:** All sections render with data
✅ **Navigation Works:** Can click sidebar items and navigate
✅ **Logout Works:** Redirects to login page

---

**Quick Reference v1.0 - Smart Parking Management System**
**Last Updated: June 13, 2026**
