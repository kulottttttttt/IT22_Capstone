# Phase 5: SignalR Real-Time Monitoring - Quick Start Guide

## 🚀 What's New

**Real-Time Updates via SignalR:**
- WebSocket connection to `/hubs/parking`
- Instant notifications when slot status changes
- Live zone occupancy updates
- Live parking area statistics
- Group subscriptions for targeted updates
- No polling required!

---

## 📡 SignalR Hub Endpoint

**WebSocket URL:** `wss://localhost:7001/hubs/parking?access_token=<JWT>`  
**Negotiation URL:** `https://localhost:7001/hubs/parking`

**Authentication:** Required (JWT token)

---

## 🔌 Client Methods (Call from Client)

### Subscribe to Zone Updates
```javascript
await connection.invoke("JoinZoneGroup", "zone-id");
```

### Unsubscribe from Zone
```javascript
await connection.invoke("LeaveZoneGroup", "zone-id");
```

### Subscribe to Parking Area Updates
```javascript
await connection.invoke("JoinParkingAreaGroup", "area-id");
```

### Unsubscribe from Parking Area
```javascript
await connection.invoke("LeaveParkingAreaGroup", "area-id");
```

---

## 📨 Server Events (Received by Client)

### SlotStatusChanged
Triggered when any slot status changes.

```javascript
connection.on("SlotStatusChanged", (event) => {
    // event = {
    //   slotId, slotNumber, zoneId,
    //   previousStatus, newStatus,
    //   changedAt, changedBy
    // }
});
```

### ZoneOccupancyUpdated
Triggered when zone occupancy changes.

```javascript
connection.on("ZoneOccupancyUpdated", (event) => {
    // event = {
    //   zoneId, totalSlots, availableSlots,
    //   occupiedSlots, maintenanceSlots,
    //   occupancyPercentage
    // }
});
```

### ParkingAreaUpdated
Triggered when parking area stats change.

```javascript
connection.on("ParkingAreaUpdated", (event) => {
    // event = {
    //   parkingAreaId, totalSlots, availableSlots,
    //   occupiedSlots, maintenanceSlots
    // }
});
```

---

## 💻 JavaScript Example

```javascript
import * as signalR from "@microsoft/signalr";

// 1. Get JWT token from login
const token = "your-jwt-token-here";

// 2. Create connection
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7001/hubs/parking", {
        accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .build();

// 3. Register event handlers
connection.on("SlotStatusChanged", (event) => {
    console.log(`${event.slotNumber}: ${event.previousStatus} → ${event.newStatus}`);
    console.log(`Changed by ${event.changedBy} at ${event.changedAt}`);
});

connection.on("ZoneOccupancyUpdated", (event) => {
    console.log(`Zone ${event.zoneId}: ${event.availableSlots}/${event.totalSlots} available`);
    console.log(`Occupancy: ${event.occupancyPercentage}%`);
});

connection.on("ParkingAreaUpdated", (event) => {
    console.log(`Area: ${event.availableSlots} available, ${event.occupiedSlots} occupied`);
});

// 4. Connect
await connection.start();
console.log("✅ Connected!");

// 5. Subscribe to updates
await connection.invoke("JoinZoneGroup", "your-zone-id");
console.log("✅ Subscribed to zone updates");

// 6. Receive real-time updates!
// When anyone updates a slot, you'll receive events instantly
```

---

## 🧪 Quick Testing

### Step 1: Start API
```bash
cd backend
dotnet run --project src/SmartParking.Presentation
```

### Step 2: Create Test Client (Node.js)

**test-signalr.js:**
```javascript
const signalR = require("@microsoft/signalr");

const token = "paste-your-jwt-token-here";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7001/hubs/parking", {
        accessTokenFactory: () => token,
        skipNegotiation: false
    })
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

connection.on("SlotStatusChanged", (event) => {
    console.log("🔔 Slot Status Changed:");
    console.log(JSON.stringify(event, null, 2));
});

connection.on("ZoneOccupancyUpdated", (event) => {
    console.log("📊 Zone Occupancy Updated:");
    console.log(JSON.stringify(event, null, 2));
});

connection.on("ParkingAreaUpdated", (event) => {
    console.log("🏢 Parking Area Updated:");
    console.log(JSON.stringify(event, null, 2));
});

async function start() {
    try {
        await connection.start();
        console.log("✅ Connected to SignalR hub");
        
        // Join a zone group (use actual zone ID from your database)
        await connection.invoke("JoinZoneGroup", "zone-id-here");
        console.log("✅ Joined zone group");
        
        console.log("\n🎧 Listening for updates...\n");
    } catch (err) {
        console.error("❌ Connection error:", err);
    }
}

start();
```

**Run:**
```bash
npm install @microsoft/signalr
node test-signalr.js
```

### Step 3: Trigger Update
Use Swagger or curl to update a slot status:
```http
POST /api/parking-slots/{id}/status
Authorization: Bearer <token>
{
  "status": "Occupied",
  "reason": "Testing SignalR"
}
```

### Step 4: Observe
Watch your Node.js console - you'll see 3 events arrive immediately:
1. SlotStatusChanged
2. ZoneOccupancyUpdated  
3. ParkingAreaUpdated

---

## 🎯 Use Cases

### Live Dashboard
```javascript
// Subscribe to all zones
for (const zone of zones) {
    await connection.invoke("JoinZoneGroup", zone.id);
}

// Update UI on events
connection.on("ZoneOccupancyUpdated", (event) => {
    updateZoneCard(event.zoneId, event);
});
```

### Specific Zone Monitor
```javascript
// Subscribe to one zone
await connection.invoke("JoinZoneGroup", currentZoneId);

// Update slot UI in real-time
connection.on("SlotStatusChanged", (event) => {
    if (event.zoneId === currentZoneId) {
        updateSlotDisplay(event.slotId, event.newStatus);
    }
});
```

### Parking Area Overview
```javascript
// Subscribe to parking area
await connection.invoke("JoinParkingAreaGroup", parkingAreaId);

// Update stats display
connection.on("ParkingAreaUpdated", (event) => {
    document.getElementById("available").textContent = event.availableSlots;
    document.getElementById("occupied").textContent = event.occupiedSlots;
});
```

---

## 🔐 Authentication

**Token in Query String:**
```javascript
.withUrl("https://localhost:7001/hubs/parking?access_token=" + token)
```

**Token via Factory (Recommended):**
```javascript
.withUrl("https://localhost:7001/hubs/parking", {
    accessTokenFactory: () => token
})
```

**Without Token:**
- Connection rejected with 401 Unauthorized

---

## 📊 What Gets Broadcast

### On Every Slot Status Change:

**1. SlotStatusChanged**
- Which slot changed
- Previous and new status
- Who changed it and when
- Sent to: Zone group + AllClients

**2. ZoneOccupancyUpdated**
- Total, available, occupied, maintenance counts
- Occupancy percentage
- Sent to: Zone group + AllClients

**3. ParkingAreaUpdated**
- Total, available, occupied, maintenance counts
- Sent to: ParkingArea group + AllClients

---

## 🎨 Event Data Structures

### SlotStatusChangedEvent
```json
{
  "slotId": "guid",
  "slotNumber": "A-001",
  "zoneId": "guid",
  "previousStatus": "Available",
  "newStatus": "Occupied",
  "changedAt": "2025-01-16T22:00:00Z",
  "changedBy": "superadmin"
}
```

### ZoneOccupancyUpdatedEvent
```json
{
  "zoneId": "guid",
  "totalSlots": 20,
  "availableSlots": 15,
  "occupiedSlots": 4,
  "maintenanceSlots": 1,
  "occupancyPercentage": 20.00
}
```

### ParkingAreaUpdatedEvent
```json
{
  "parkingAreaId": "guid",
  "totalSlots": 40,
  "availableSlots": 30,
  "occupiedSlots": 8,
  "maintenanceSlots": 2
}
```

---

## ✅ Benefits

**No Polling:**
- Server pushes updates instantly
- Reduced HTTP requests
- Lower latency

**Synchronized Clients:**
- All clients see same data
- Perfect synchronization
- No stale data

**Efficient:**
- WebSocket protocol
- Binary message framing
- Automatic compression

**Resilient:**
- Automatic reconnection
- Connection state management
- Built-in error handling

---

## 🔧 Troubleshooting

### "Failed to start connection"
- Check JWT token is valid
- Verify HTTPS certificate
- Check CORS configuration

### "Connection closed"
- Token may have expired
- Server may have restarted
- Network issue

### "Not receiving events"
- Verify you joined the correct group
- Check if status actually changed
- Confirm connection is still active

### "401 Unauthorized"
- JWT token missing or invalid
- Token expired (15 min lifetime)
- Get new token via /api/auth/login

---

## 📚 Full Documentation

See `PHASE5_COMPLETION.md` for:
- Complete architecture details
- All implementation details
- Security configuration
- Testing procedures
- Use case examples

---

## 🎉 Phase 5 Complete!

✅ Real-time WebSocket communication  
✅ Instant slot status updates  
✅ Live occupancy statistics  
✅ Group-based subscriptions  
✅ JWT authentication  
✅ Automatic broadcasting  

**Ready for:** React frontend integration (Phase 6)
