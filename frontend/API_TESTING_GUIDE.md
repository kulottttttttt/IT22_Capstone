# API Integration Testing Guide

## 🧪 Step-by-Step Testing Instructions

---

## ✅ Pre-Testing Checklist

**Required Services:**
- [ ] Backend running at: http://localhost:5257
- [ ] Frontend running at: http://localhost:5174
- [ ] Database populated with seed data
- [ ] No console errors in either terminal

**To Start Backend:**
```bash
cd backend/src/SmartParking.Presentation
dotnet run
```

**Frontend Should Already Be Running:**
- URL: http://localhost:5174
- Hot Module Replacement active

---

## 🔐 Test 1: Initial Data Load

### **Steps:**
1. Navigate to: http://localhost:5174/login
2. Login with: `superadmin` / `Admin@123`
3. Observe dashboard loading

### **Expected Results:**
- ✅ Brief loading skeletons appear (gray animated boxes)
- ✅ Stats cards load with real numbers (not 240, 87, 142, 11)
- ✅ Zone overview shows real zone names
- ✅ Zone data shows real occupancy numbers
- ✅ Predictions section loads (or shows empty state)
- ✅ No error messages
- ✅ "Refresh Data" button appears at top

### **Check Browser Console:**
- ✅ No red errors
- ✅ Network tab shows successful API calls:
  - GET /api/parking-areas (200)
  - GET /api/zones (200)
  - GET /api/parking-slots (200)
  - GET /api/predictions/dashboard (200 or 404)

---

## 🔄 Test 2: Refresh Button

### **Steps:**
1. From SuperAdmin dashboard
2. Click "Refresh Data" button (top right)

### **Expected Results:**
- ✅ Button changes to "Refreshing..." with spinner icon
- ✅ Button becomes disabled (gray)
- ✅ Loading skeletons appear briefly
- ✅ Data reloads
- ✅ Button returns to "Refresh Data" with normal icon
- ✅ Stats may change if data changed in backend

### **Browser Console:**
- ✅ New API calls in Network tab
- ✅ All calls return 200 OK

---

## ⚠️ Test 3: Error Handling (Backend Down)

### **Steps:**
1. Stop the backend (Ctrl+C in backend terminal)
2. In browser, click "Refresh Data"

### **Expected Results:**
- ✅ Red error message appears:
  ```
  ⚠️ Error Loading Data
  Failed to load dashboard data. Please try again.
  [Try Again] button
  ```
- ✅ Previous data remains visible (if any)
- ✅ User can still navigate

### **Browser Console:**
- ✅ API calls fail with network errors
- ✅ Error is caught and displayed to user

### **Recovery:**
1. Restart backend
2. Click "Try Again" button
3. ✅ Data should load successfully

---

## 📭 Test 4: Empty State (No Zones)

### **This requires database with no zones:**

**If your database has zones, skip this test.**

### **Expected Result:**
If zones table is empty:
```
┌─────────────────────────────┐
│        🗺️                  │
│   No Zones Found            │
│   No parking zones have     │
│   been configured yet.      │
└─────────────────────────────┘
```

---

## 🔮 Test 5: Predictions State

### **Case A: Predictions Available**

**If database has historical data:**
- ✅ Shows 3 prediction cards
- ✅ Each shows:
  - Forecast time (e.g., "2:30 PM")
  - Occupancy percentage (e.g., "68.5%")
  - Confidence level (High/Medium/Low)
- ✅ Gradient backgrounds
- ✅ Color-coded confidence badges

### **Case B: No Predictions**

**If database is new or no historical data:**
```
┌─────────────────────────────┐
│        🔮                   │
│   No Predictions Available  │
│   Prediction data will be   │
│   available once historical │
│   data is collected.        │
└─────────────────────────────┘
```

---

## 📊 Test 6: Stats Accuracy

### **Verify Calculations:**

1. **Note the numbers:**
   - Total Slots: _____
   - Available: _____
   - Occupied: _____
   - Maintenance: _____

2. **Verify math:**
   - Total = Available + Occupied + Maintenance
   - ✅ Numbers should add up correctly

3. **Check backend data:**
   - Go to: http://localhost:5257/swagger
   - Test GET /api/parking-slots
   - Count statuses manually
   - ✅ Frontend numbers should match backend

---

## 🗺️ Test 7: Zone Display

### **For Each Zone Displayed:**

**Check:**
- ✅ Zone name is real (not "Zone A", "Zone B", "Zone C")
- ✅ Floor level is correct (1, 2, 3, etc.)
- ✅ Total slots matches database
- ✅ Available + Occupied + Maintenance = Total
- ✅ Numbers update when you refresh

**Hover Effects:**
- ✅ Zone row highlights on hover (gray background)

---

## 👥 Test 8: Role-Based Data

### **Admin Dashboard:**
1. Logout from SuperAdmin
2. Login as Admin (if you have admin credentials)
3. ✅ Should see same stats
4. ✅ Different dashboard layout
5. ✅ Same refresh button
6. ✅ Same loading/error states

### **Staff Dashboard:**
1. Login as Staff (if you have staff credentials)
2. ✅ Should see same stats
3. ✅ Different dashboard layout
4. ✅ Same refresh button
5. ✅ Same loading/error states

---

## 🚀 Test 9: Performance

### **Timing:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh dashboard
4. Check "Time" column

**Expected:**
- ✅ All API calls < 500ms
- ✅ Total load time < 2 seconds
- ✅ Parallel API calls (4 requests at once)

---

## 🔄 Test 10: Data Consistency

### **Test:**
1. Note the "Available Slots" number
2. Open Swagger: http://localhost:5257/swagger
3. Update a slot status:
   - PUT /api/parking-slots/{id}/status
   - Change status to "Occupied"
4. Return to frontend
5. Click "Refresh Data"

**Expected:**
- ✅ Available count decreases by 1
- ✅ Occupied count increases by 1
- ✅ Total stays the same

---

## 🌐 Test 11: Network Errors

### **Simulate Slow Network:**
1. Open DevTools (F12)
2. Go to Network tab
3. Select "Slow 3G" throttling
4. Click "Refresh Data"

**Expected:**
- ✅ Loading state appears longer
- ✅ Eventually loads
- ✅ No errors

### **Simulate Failed Request:**
1. In Network tab, block /api/zones
2. Click "Refresh Data"

**Expected:**
- ✅ Error message appears
- ✅ Can retry

---

## 📱 Test 12: Browser Compatibility

### **Test in Multiple Browsers:**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

**All browsers should:**
- ✅ Load data correctly
- ✅ Show loading states
- ✅ Handle errors
- ✅ Refresh works

---

## 🔍 Test 13: Console Verification

### **Open Browser Console (F12):**

**Should NOT see:**
- ❌ Red errors
- ❌ 404 errors (except predictions if not available)
- ❌ CORS errors
- ❌ TypeScript errors
- ❌ React errors

**Should see:**
- ✅ Clean console
- ✅ Or only warnings (if any)
- ✅ Successful API responses

---

## 📊 Test 14: Data Comparison

### **Backend vs Frontend:**

1. **Check Backend:**
   - Go to: http://localhost:5257/swagger
   - GET /api/parking-slots/history
   - Count total records

2. **Check Frontend:**
   - Note "Total Slots" number
   - ✅ Should match backend count

3. **Check Zone Count:**
   - Swagger: GET /api/zones
   - Frontend: Count zones in Zone Overview
   - ✅ Should match (up to 5 shown on dashboard)

---

## ✅ Success Criteria

**The API integration is successful if:**

### **Data Display:**
- ✅ Stats show real numbers from backend
- ✅ Zones show real names and data
- ✅ Predictions load (or show empty state)
- ✅ Numbers are accurate

### **Loading States:**
- ✅ Skeletons appear during load
- ✅ Smooth transition to data
- ✅ Loading text on refresh button

### **Error States:**
- ✅ Error message when backend down
- ✅ Retry button works
- ✅ User-friendly error messages

### **Empty States:**
- ✅ Shows when no zones
- ✅ Shows when no predictions
- ✅ Professional appearance

### **Functionality:**
- ✅ Refresh button works
- ✅ Data updates on refresh
- ✅ Navigation still works
- ✅ No crashes or freezes

---

## 🐛 Common Issues & Solutions

### **Issue: "Failed to load dashboard data"**
**Solution:**
- Check backend is running
- Check backend URL is correct
- Check CORS is configured
- Check authentication token is valid

### **Issue: Stats show 0 for everything**
**Solution:**
- Check database has data
- Check seed data was applied
- Run migrations if needed

### **Issue: Infinite loading**
**Solution:**
- Check browser console for errors
- Check Network tab for failed requests
- Verify API endpoints are correct

### **Issue: Predictions always empty**
**Solution:**
- This is normal for new database
- Predictions require historical data
- Empty state is correct behavior

### **Issue: "Loading..." never ends**
**Solution:**
- Check for JavaScript errors
- Check API responses in Network tab
- Check if data structure matches TypeScript types

---

## 📸 Screenshot Checklist

For documentation:
1. [ ] Dashboard with loading skeletons
2. [ ] Dashboard with real data loaded
3. [ ] Stats cards with real numbers
4. [ ] Zone overview with real zones
5. [ ] Predictions section (with data or empty)
6. [ ] Error state when backend down
7. [ ] Empty state for zones
8. [ ] Refresh button in action
9. [ ] Browser console (no errors)
10. [ ] Network tab showing API calls

---

## 🎯 Final Verification

### **Complete Checklist:**
- [ ] Backend running
- [ ] Frontend running
- [ ] Can login successfully
- [ ] Dashboard loads with real data
- [ ] Stats are accurate (not 240, 87, 142, 11)
- [ ] Zone names are real (not "Zone A", "Zone B")
- [ ] Refresh button works
- [ ] Error handling works (test by stopping backend)
- [ ] Loading states appear
- [ ] No console errors
- [ ] All API calls return 200 OK
- [ ] Data matches between frontend and Swagger
- [ ] Admin dashboard works
- [ ] Staff dashboard works

---

## 🎉 If All Tests Pass

**Congratulations!** 🚀

The API integration is complete and working perfectly. The dashboard now displays:
- Real-time data from the backend
- Live statistics
- Actual zone information
- Prediction forecasts
- Professional loading, error, and empty states

---

**Test Now:**
- URL: http://localhost:5174/login
- Username: `superadmin`
- Password: `Admin@123`

**Happy Testing!** ✨
