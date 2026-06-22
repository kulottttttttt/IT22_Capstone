# Live Monitoring - Quick Testing Guide

## ✅ Pre-Testing Checklist

**Required:**
- [ ] Backend running: http://localhost:5257
- [ ] Frontend running: http://localhost:5174
- [ ] Database has zones and slots
- [ ] No console errors

---

## 🚀 Quick Test (5 Minutes)

### **Step 1: Access Live Monitoring**
1. Open: http://localhost:5174/login
2. Login: `superadmin` / `Admin@123`
3. Click "📡 Live Monitoring" in sidebar

**Expected:**
- ✅ Page loads with zones
- ✅ Slots displayed in grid
- ✅ Stats cards show real numbers
- ✅ Green pulse indicator shows "Live Updates Active"

---

### **Step 2: Verify Slot Display**

**Check one slot:**
- ✅ Slot number visible (e.g., "A-123")
- ✅ Status icon visible (✓ = green, 🚗 = red, 🔧 = yellow)
- ✅ Status text visible ("Available", "Occupied", or "Maintenance")
- ✅ Vehicle type visible ("Car", "Motorcycle", etc.)
- ✅ Color matches status

---

### **Step 3: Update Slot Status**

1. Click any **green** slot (Available)
2. ✅ Modal opens
3. ✅ Current status shows "Available"
4. Select **"Occupied"** radio button
5. Enter reason: **"Test vehicle parked"**
6. Click "Update Status"

**Expected:**
- ✅ Modal shows "Updating..."
- ✅ Modal closes
- ✅ Slot turns **red**
- ✅ "Available" counter decreases by 1
- ✅ "Occupied" counter increases by 1

---

### **Step 4: Test Real-Time Updates**

**Option A: Two Browsers**
1. Open Live Monitoring in Chrome
2. Open Live Monitoring in Edge
3. Update a slot in Chrome
4. ✅ Edge should update automatically (no refresh needed)

**Option B: Swagger + Frontend**
1. Open: http://localhost:5257/swagger
2. Use POST `/api/parking-slots/{id}/status` to update a slot
3. ✅ Frontend should update automatically

---

### **Step 5: Verify SignalR Connection**

**Check indicator:**
- ✅ Green pulse dot at top = Connected
- ✅ "Live Updates Active" text visible

**Test reconnection:**
1. Stop backend (Ctrl+C)
2. ✅ Indicator turns red ("Offline")
3. Start backend again
4. ✅ Indicator turns green automatically (auto-reconnect)

---

## 🐛 Troubleshooting

### **Issue: "Live Updates Active" not showing**
**Solution:**
- Check backend is running
- Check browser console for SignalR errors
- Verify token is valid (login again)

### **Issue: Slots not displaying**
**Solution:**
- Check database has zones and slots
- Run seed data if needed
- Check browser console for API errors

### **Issue: Update fails**
**Solution:**
- Ensure reason is provided
- Check user has Staff/Admin/SuperAdmin role
- Verify backend is running

### **Issue: Real-time updates not working**
**Solution:**
- Check SignalR connection (green pulse)
- Check browser console for WebSocket errors
- Verify backend SignalR hub is running

---

## 📊 What to Verify

### **Stats Cards:**
- [ ] Total Slots = sum of all slots
- [ ] Available = green slots count
- [ ] Occupied = red slots count
- [ ] Maintenance = yellow slots count

### **Zone Display:**
- [ ] Each zone has a section
- [ ] Zone name and floor level visible
- [ ] Zone counters match slot colors
- [ ] Slots arranged in grid

### **Slot Cards:**
- [ ] Available = Green with ✓
- [ ] Occupied = Red with 🚗
- [ ] Maintenance = Yellow with 🔧
- [ ] Hover effect works (cursor changes)

### **Status Update:**
- [ ] Modal opens on click
- [ ] Can select new status
- [ ] Reason input required
- [ ] Validation works
- [ ] Update succeeds
- [ ] UI updates immediately

### **Real-Time:**
- [ ] SignalR connects automatically
- [ ] Green pulse when connected
- [ ] Updates appear without refresh
- [ ] Multiple clients stay synced

---

## 🎯 Success Criteria

**All tests pass if:**
- ✅ Page loads with real data
- ✅ Slots display with correct colors
- ✅ Can update slot status
- ✅ SignalR connection indicator shows green
- ✅ Real-time updates work
- ✅ No console errors
- ✅ Counters update after changes
- ✅ Navigation works

---

## 📱 Quick Commands

```bash
# Start Backend
cd backend/src/SmartParking.Presentation
dotnet run

# Frontend already running
# URL: http://localhost:5174

# Test Login
Username: superadmin
Password: Admin@123

# Navigate to
Live Monitoring (in sidebar)
```

---

## ✨ Expected Behavior Summary

1. **On Load:**
   - Zones load with slots
   - Stats show real numbers
   - SignalR connects (green pulse)

2. **On Click Slot:**
   - Modal opens
   - Current status shown
   - Can select new status

3. **On Update:**
   - Slot color changes instantly
   - Counters update
   - SignalR broadcasts to other clients

4. **On SignalR Event:**
   - Slot updates automatically
   - No page refresh needed
   - Stays in sync with other users

---

**Test URL:** http://localhost:5174/live-monitoring

**All features working = ✅ Live Monitoring Complete!**
