# Smart Parking Abreeza — UI/UX Design System
## Web Interface for Public Viewers and Administrative Dashboards

---

# 1. Design Language

- **Theme:** Modern, High-Contrast, Clean.
- **Colors:**
    - **Primary:** Abreeza Red/Orange (#E31B23).
    - **Background:** Light Gray (#F3F4F6).
    - **Status - Available:** Emerald Green (#10B981).
    - **Status - Occupied:** Rose Red (#F43F5E).
    - **Status - Maintenance:** Amber (#F59E0B).

---

# 2. Page Breakdowns

### A. Public Live View (Home)
- **Interactive Map:** A vector-based (SVG) layout of Abreeza Ground Floor.
- **Real-Time Counters:** Large widgets showing "Total Available" (Cars vs. Motorcycles).
- **Zone Selector:** Quick jump to Zone A, B, C, or D.
- **Forecast Slider:** A time-scrubbing bar allowing users to see predicted map states for +30m, +60m, and +120m.

### B. Staff Dashboard
- **Management View:** A grid-list version of all slots for rapid manual status toggling.
- **Incident Logger:** Simple form to mark a slot as "Maintenance" or "Reserved."
- **Activity Feed:** Small sidebar showing real-time changes as they happen via SignalR.

### C. Admin Analytics
- **Occupancy Trends:** Line charts showing daily/weekly peak hours.
- **Zone Performance:** Heatmap showing which areas fill up fastest.
- **Report Generator:** Exporting occupancy data to PDF/Excel for mall management.

### D. Super Admin Settings
- **User Management:** Table with "Invite User" and "Role Edit" functions.
- **Map Configurator:** Interface to drag-and-drop slots to define their X/Y coordinates on the SVG map.

---

# 3. Key UI Components

- **Slot Badge:** Small circular/rectangular icon on the map.
    - Clickable for Staff (opens status menu).
    - Tooltip for Guest (shows Slot ID and Type).
- **The "Predictive Indicator":** A glowing border around slots that are *likely to become available* within the next 30 minutes based on historical stay duration.
- **Responsive Sidebar:** Collapsible menu for navigation between Monitoring, Analytics, and Settings.

---

# 4. UX Workflow: Guest

1. **Visit Site:** Guest lands on the live map.
2. **Check Current:** Sees Zone A is 90% full.
3. **Use Forecast:** Slides the bar to "+1 Hour."
4. **Decision:** System predicts Zone B will have 20 free slots by the time the Guest arrives at the mall.
5. **Arrival:** Guest drives directly to Zone B.

---

# 5. UX Workflow: Staff

1. **Login:** Staff enters credentials.
2. **Monitor:** Sees a car leaving Slot A-12.
3. **Manual Update:** If the sensor (future) or manual check shows a slot is blocked, Staff clicks the slot and selects "Maintenance."
4. **Instant Update:** SignalR pushes this change to all active Guest maps instantly.