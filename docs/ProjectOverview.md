# Smart Parking Abreeza — Project Overview
## System Documentation | Real-Time Parking & Predictive Analytics

---

# 1. Executive Summary

**Smart Parking Abreeza** is a high-performance, web-based management ecosystem designed for Ayala Malls Abreeza. The system addresses urban parking congestion by providing real-time visibility and "forward-looking" predictive analytics for shoppers and mall management.

Unlike traditional systems that only show current status, this platform uses historical data and trend analysis to forecast availability for the next 30, 60, and 120 minutes, allowing users to plan their trips effectively.

---

# 2. Business Scope

The system manages the ground-floor parking operations of Ayala Malls Abreeza, organized into distinct geographic zones.

### Core Operational Areas:
- **Real-Time Monitoring:** Live visualization of every car and motorcycle slot.
- **Predictive Analytics:** Rule-based engine forecasting near-future occupancy.
- **Zone Management:** Categorization of parking areas (Zone A, B, C, D).
- **Slot Management:** Manual and simulated state control for testing and operations.
- **Reporting & Insights:** Analysis of peak hours, average stay duration, and zone popularity.
- **Audit & Security:** Full tracking of system changes and administrative actions.

---

# 3. User Roles

The system is accessed via a web interface with four distinct levels of permission:

| Role | Description |
|---|---|
| **Super Admin** | Platform owner; manages system configurations, global settings, and audit logs. |
| **Admin** | Mall management; configures zones/slots and accesses high-level business reports. |
| **Staff** | On-ground operations; monitors live status and manually updates slot occupancy. |
| **Guest (Public)** | Shoppers/Visitors; view-only access to live maps and forecasts (No login required). |

---

# 4. Tech Stack

The architecture is built for high availability and real-time data throughput.

### Backend (Core Engine)
- **Framework:** ASP.NET Core 9 (Clean Architecture)
- **Real-Time:** SignalR (WebSockets) for instant UI updates
- **Database:** SQL Server
- **ORM:** Entity Framework Core (Code-First)
- **Security:** JWT Authentication & Role-Based Access Control (RBAC)

### Frontend (User Interface)
- **Framework:** React 18 + Vite
- **Styling:** TailwindCSS
- **State Management:** Zustand / React Context
- **Charts:** Recharts for analytics visualization

---

# 5. Parking Infrastructure Layout

The system is modeled after the Abreeza Ground Floor layout:
- **Zones:** A, B, C, D, etc.
- **Vehicle Types:** Dedicated Car slots and Motorcycle slots.
- **Points of Interest:** Entrances, Exits, and major mall access points are visualized to provide context to the user.

---

# 6. Prediction Engine (v1.0)

The system employs a **Rule-Based Analytics Engine** designed to be **ML-Ready**. It calculates forecasts based on:
1. **Historical Baseline:** Average occupancy for the specific Day of Week/Hour of Day.
2. **Current Trend:** Momentum of arrivals/departures in the last 15 minutes.
3. **Event Modifiers:** Adjustments for weekends or peak mall hours.

**Forecast Windows:** 30 Minutes | 1 Hour | 2 Hours.