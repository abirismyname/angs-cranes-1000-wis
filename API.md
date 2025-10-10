# Admin API Documentation

This document describes the API endpoints available for administrative tasks on Ang's Cranes.

## Authentication

All admin endpoints require authentication via the Spark runtime. The API validates that the requesting user is the owner of the application using `spark.user().isOwner`.

## Endpoints

### Update Total Received Cranes

Updates the count of physical cranes that have been received in the mail.

**Method**: Can be called via browser console or external tools

**Authentication**: Requires owner access

**Example Usage (Browser Console)**:

```javascript
// Update total received cranes to a specific count
await spark.kv.set('total-received', 150)
```

**Example Usage (Fetch API)**:

```javascript
// Get current count
const currentCount = await spark.kv.get('total-received')
console.log('Current count:', currentCount)

// Update to new count
await spark.kv.set('total-received', 250)
console.log('Updated count to 250')
```

**Parameters**:
- `count` (number): The total number of cranes received. Must be a non-negative integer.

**Returns**: None (updates KV store directly)

**Effect**: 
- Updates the "Cranes Received" progress bar on the main page
- Triggers confetti animation if crossing the 1000 crane milestone
- All users see the update in real-time

---

### View All Pledges

Retrieve all pledges from the system.

**Example Usage (Browser Console)**:

```javascript
// Get all pledges
const pledges = await spark.kv.get('pledges')
console.log('All pledges:', pledges)
```

**Returns**: Array of pledge objects, each containing:
- `id` (string): Unique identifier
- `name` (string): Pledger's name
- `craneCount` (number): Number of cranes pledged
- `timestamp` (number): Unix timestamp of when pledge was made

---

### Get Total Received Count

Retrieve the current count of received cranes.

**Example Usage (Browser Console)**:

```javascript
const totalReceived = await spark.kv.get('total-received')
console.log('Total received:', totalReceived)
```

**Returns**: Number representing total cranes received

---

### Get All KV Keys

View all available data keys in the system.

**Example Usage (Browser Console)**:

```javascript
const keys = await spark.kv.keys()
console.log('All KV keys:', keys)
```

**Returns**: Array of all key names in the KV store

---

## Quick Reference

Common administrative tasks:

```javascript
// Check current status
const pledges = await spark.kv.get('pledges')
const received = await spark.kv.get('total-received')
const totalPledged = pledges.reduce((sum, p) => sum + p.craneCount, 0)

console.log(`Pledged: ${totalPledged} | Received: ${received} | Goal: 1000`)

// Update received count as cranes arrive
await spark.kv.set('total-received', 425)
```

## Notes

- All data persists in the Spark KV store
- Changes to 'total-received' are immediately reflected for all users
- No UI-based admin panel exists - all admin operations are API-only
- The owner can verify their status by checking: `(await spark.user()).isOwner`
