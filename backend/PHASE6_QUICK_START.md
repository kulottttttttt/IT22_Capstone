# Phase 6 Quick Start: Predictive Occupancy Analytics Engine

## Overview

Phase 6 implements a **rule-based predictive occupancy analytics engine** that generates parking occupancy forecasts using historical data analysis.

---

## Quick Test

### 1. Start the API

```bash
cd backend/src/SmartParking.Presentation
dotnet run
```

### 2. Open Swagger UI

Navigate to: `https://localhost:7000/swagger`

### 3. Test Prediction Endpoints

#### A. Get Dashboard Predictions

**Endpoint:** `GET /api/predictions/dashboard`

Click "Try it out" → "Execute"

**Response:**
```json
{
  "totalSlots": 40,
  "currentOccupiedSlots": 0,
  "currentOccupancyPercentage": 0.00,
  "historicalAverageOccupancy": 0.00,
  "predictions": [
    {
      "forecastTime": "2026-06-13T14:30:00Z",
      "predictedOccupiedSlots": 0,
      "predictedAvailableSlots": 40,
      "predictedOccupancyPercentage": 0.00,
      "confidenceLevel": "Low",
      "confidenceScore": 0.00
    }
  ],
  "parkingAreaBreakdowns": [...],
  "generatedAt": "2026-06-13T14:00:00Z"
}
```

#### B. Get Zone Predictions

1. Get a zone ID: `GET /api/zones`
2. Copy the zone ID
3. Test: `GET /api/predictions/zones/{zoneId}`

#### C. Get Parking Area Predictions

1. Get an area ID: `GET /api/parking-areas`
2. Copy the parking area ID
3. Test: `GET /api/predictions/parking-areas/{parkingAreaId}`

---

## Generate Historical Data for Better Predictions

### Step 1: Get Slot IDs

```http
GET /api/parking-slots
```

Copy a few slot IDs.

### Step 2: Login as Staff

```http
POST /api/auth/login
{
  "username": "superadmin",
  "password": "Admin@123"
}
```

Copy the `token` from response.

### Step 3: Authorize in Swagger

Click the "Authorize" button (lock icon) and paste:
```
Bearer your_token_here
```

### Step 4: Update Slot Status Multiple Times

```http
POST /api/parking-slots/{slotId}/status
{
  "status": "Occupied",
  "reason": "Vehicle entered"
}
```

Wait a few seconds, then:

```http
POST /api/parking-slots/{slotId}/status
{
  "status": "Available",
  "reason": "Vehicle exited"
}
```

Repeat for multiple slots to build history.

### Step 5: Check Predictions Again

```http
GET /api/predictions/dashboard
```

**You should now see:**
- Higher confidence scores
- Predictions based on patterns
- Better confidence levels (Medium/High)

---

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/predictions/zones/{zoneId}` | None | Zone predictions |
| GET | `/api/predictions/parking-areas/{parkingAreaId}` | None | Parking area predictions |
| GET | `/api/predictions/dashboard` | None | Dashboard-wide predictions |

**Note:** All prediction endpoints are public (AllowAnonymous).

---

## Prediction Algorithm

### Rule-Based Formula

```
Predicted Occupancy = 
  (Current Occupancy × 30%) +
  (Hourly Average × 25%) +
  (Day of Week Average × 15%) +
  (Historical Average × 15%) +
  (Peak Hour Reference × 15%) +
  (Recent Trend Adjustment × 30%)
```

### Data Sources

1. **Current Occupancy** - Real-time slot statuses
2. **Historical Average** - 30-day occupancy average
3. **Hourly Average** - Average occupancy at specific hour
4. **Day of Week Average** - Average occupancy for day (Mon-Sun)
5. **Peak Hour** - Highest occupancy hour
6. **Recent Trend** - Last 24 hours trend (increasing/decreasing)

### Prediction Windows

- **30 minutes** - Short-term forecast
- **1 hour** - Medium-term forecast
- **2 hours** - Long-term forecast

### Confidence Levels

| Level | Score | Meaning |
|-------|-------|---------|
| High | 70-100 | Sufficient historical data, stable patterns |
| Medium | 40-69 | Moderate historical data |
| Low | 0-39 | Insufficient data, high uncertainty |

---

## Response Structure

### Zone Prediction Response

```json
{
  "zoneId": "guid",
  "zoneName": "Zone A",
  "parkingAreaName": "Abreeza Mall Parking",
  "totalSlots": 20,
  "currentOccupiedSlots": 5,
  "currentOccupancyPercentage": 25.00,
  "historicalAverageOccupancy": 35.50,
  "peakHourOccupancy": 65.00,
  "predictions": [
    {
      "forecastTime": "2026-06-13T14:30:00Z",
      "predictedOccupiedSlots": 7,
      "predictedAvailableSlots": 13,
      "predictedOccupancyPercentage": 35.00,
      "confidenceLevel": "Medium",
      "confidenceScore": 55.00
    },
    {
      "forecastTime": "2026-06-13T15:00:00Z",
      "predictedOccupiedSlots": 9,
      "predictedAvailableSlots": 11,
      "predictedOccupancyPercentage": 45.00,
      "confidenceLevel": "Medium",
      "confidenceScore": 52.00
    },
    {
      "forecastTime": "2026-06-13T16:00:00Z",
      "predictedOccupiedSlots": 12,
      "predictedAvailableSlots": 8,
      "predictedOccupancyPercentage": 60.00,
      "confidenceLevel": "Low",
      "confidenceScore": 38.00
    }
  ],
  "generatedAt": "2026-06-13T14:00:00Z"
}
```

### Parking Area Prediction Response

Includes:
- Parking area summary
- Aggregated predictions
- **Zone breakdowns** (array of zone predictions)

### Dashboard Prediction Response

Includes:
- Overall system summary
- Aggregated predictions
- **Parking area breakdowns** (array of parking area predictions)
  - Each includes zone breakdowns

---

## Architecture

```
┌─────────────────────────────────────────┐
│     PredictionsController               │
│  (GET /api/predictions/...)             │
└──────────────┬──────────────────────────┘
               │ MediatR
┌──────────────▼──────────────────────────┐
│  Query Handlers (CQRS)                  │
│  - GetZonePredictionHandler             │
│  - GetParkingAreaPredictionHandler      │
│  - GetDashboardPredictionHandler        │
└──────────────┬──────────────────────────┘
               │ DI
┌──────────────▼──────────────────────────┐
│  PredictionService                      │
│  - PredictZoneOccupancyAsync            │
│  - PredictParkingAreaOccupancyAsync     │
│  - PredictDashboardOccupancyAsync       │
└──────────────┬──────────────────────────┘
               │ DI
┌──────────────▼──────────────────────────┐
│  AnalyticsService                       │
│  - GetHistoricalAverageOccupancyAsync   │
│  - GetPeakHourOccupancyAsync            │
│  - GetAverageOccupancyByHourAsync       │
│  - GetAverageOccupancyByDayOfWeekAsync  │
│  - GetRecentTrendAsync                  │
└──────────────┬──────────────────────────┘
               │ EF Core
┌──────────────▼──────────────────────────┐
│  Database                               │
│  - SlotStatusHistory (history data)     │
│  - ParkingSlots (current status)        │
│  - Zones, ParkingAreas                  │
└─────────────────────────────────────────┘
```

---

## Integration with Existing Features

### Phase 4 (Slot Status Management)

Every status change creates a `SlotStatusHistory` record, which is used by:
- Analytics service for historical analysis
- Prediction service for pattern recognition

### Phase 5 (SignalR)

Predictions can be integrated with SignalR:
- Broadcast prediction updates
- Notify clients of forecast changes
- Real-time analytics dashboard

**Future Enhancement:**
```csharp
// In PredictionService
await _hubService.BroadcastPredictionUpdated(new PredictionUpdatedEvent
{
    ZoneId = zoneId,
    Predictions = predictions
});
```

---

## Performance Notes

### Current Implementation
- **Real-time calculation** - No caching
- **Complex aggregations** - Multiple DB queries
- **Read-heavy** - Minimal writes

### Expected Performance
- Zone prediction: 100-300ms
- Parking area prediction: 200-500ms (aggregates zones)
- Dashboard prediction: 500-1000ms (aggregates all areas)

### Optimization Opportunities

1. **Add Caching:**
   ```csharp
   services.AddMemoryCache();
   // Cache predictions for 10 minutes
   ```

2. **Background Generation:**
   - Use Hangfire/Quartz
   - Pre-calculate predictions every 10 minutes
   - Store in `PredictionSnapshot` table
   - API reads from cache

3. **Database Indexing:**
   ```sql
   CREATE INDEX IX_SlotStatusHistory_ChangedAt 
   ON SlotStatusHistory (ChangedAt);
   
   CREATE INDEX IX_SlotStatusHistory_SlotId_ChangedAt 
   ON SlotStatusHistory (SlotId, ChangedAt);
   ```

---

## Troubleshooting

### "Low confidence" predictions

**Cause:** Insufficient historical data

**Solution:**
- Generate more slot status changes
- Wait for actual usage to build history
- Low confidence is expected with < 7 days of data

### Predictions always return current occupancy

**Cause:** No `SlotStatusHistory` records exist

**Solution:**
- Update slot statuses via API to create history
- Ensure Phase 4 is working correctly

### "Zone not found" error

**Cause:** Invalid zone ID

**Solution:**
- Get valid zone IDs from `GET /api/zones`
- Ensure zone is not deleted (IsDeleted = false)

---

## What's Next?

### Phase 7 Ideas

1. **Prediction Accuracy Tracking**
   - Store predictions in `PredictionSnapshot`
   - Compare predictions vs. actual
   - Calculate accuracy metrics

2. **ML Model Integration**
   - Train on historical data
   - LSTM for time series forecasting
   - Feature engineering (weather, events)

3. **Advanced Analytics**
   - Revenue forecasting
   - Capacity planning
   - Trend analysis

4. **React Dashboard**
   - Real-time prediction display
   - Charts and graphs
   - Historical accuracy visualization

---

## Summary

✅ **3 Public API Endpoints** - Zone, Area, Dashboard predictions  
✅ **Rule-Based Algorithm** - Weighted combination of 6 factors  
✅ **3 Prediction Windows** - 30min, 1hr, 2hr forecasts  
✅ **Confidence Scoring** - High/Medium/Low with numeric score  
✅ **Hierarchical Breakdowns** - Dashboard → Areas → Zones  
✅ **Zero Configuration** - Works out of the box  

Phase 6 is complete! 🎉
