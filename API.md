# Admin API Documentation

This document describes the API endpoints available for administrative tasks on Ang's Cranes.

## Authentication

All admin endpoints require authentication. The API validates administrative access before allowing updates.

## Endpoints

### Update Total Received Cranes

Updates the count of physical cranes that have been received in the mail.

**Method**: PUT `/api/pledges`

**Authentication**: Requires admin access

**Example Usage (Fetch API)**:

```javascript
// Update total received cranes to a specific count
await fetch('/api/pledges', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ totalReceived: 150 })
})
```

**Parameters**:
- `totalReceived` (number): The total number of cranes received. Must be a non-negative integer.

**Returns**: JSON object with success status

**Effect**: 
- Updates the "Cranes Received" progress bar on the main page
- Triggers confetti animation if crossing the 1000 crane milestone
- All users see the update in real-time

---

### View All Pledges

Retrieve all pledges from the system.

**Method**: GET `/api/pledges`

**Example Usage (Fetch API)**:

```javascript
// Get all pledges
const response = await fetch('/api/pledges')
const data = await response.json()
console.log('All pledges:', data.pledges)
```

**Returns**: JSON object containing:
- `pledges`: Array of pledge objects, each containing:
  - `id` (string): Unique identifier
  - `name` (string): Pledger's name
  - `craneCount` (number): Number of cranes pledged
  - `timestamp` (number): Unix timestamp of when pledge was made
- `totalReceived` (number): Total cranes received
- `totalPledged` (number): Total cranes pledged
- `stats`: Statistics object with progress information

---

### Get Total Received Count

Retrieve the current count of received cranes.

**Example Usage (Fetch API)**:

```javascript
const response = await fetch('/api/pledges')
const data = await response.json()
console.log('Total received:', data.totalReceived)
```

**Returns**: Number representing total cranes received (included in the pledges response)

---

## Quick Reference

Common administrative tasks:

```javascript
// Check current status
const response = await fetch('/api/pledges')
const data = await response.json()

console.log(`Pledged: ${data.totalPledged} | Received: ${data.totalReceived} | Goal: 1000`)

// Update received count as cranes arrive
await fetch('/api/pledges', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ totalReceived: 425 })
})
```

## Notes

- All data persists in Cloudflare KV store
- Changes to 'total-received' are immediately reflected for all users
- No UI-based admin panel exists - all admin operations are API-only
