# Firebase Database Schema

This schema is the planned Firestore model for the Flutter and Firebase phase.

## Collections

### `users/{userId}`

```json
{
  "displayName": "string",
  "email": "string",
  "language": "en|de|ru|el|sr|ro",
  "jurisdiction": "antiochian|greek|oca|romanian|russian|serbian",
  "roles": ["user"],
  "createdAt": "timestamp",
  "lastActiveAt": "timestamp",
  "gdprConsentVersion": "string"
}
```

### `users/{userId}/favorites/{favoriteId}`

```json
{
  "type": "quote|icon|sermon|chant|verse|church",
  "targetId": "string",
  "createdAt": "timestamp"
}
```

### `users/{userId}/readingProgress/{planId}`

```json
{
  "planId": "string",
  "completedDays": 0,
  "totalDays": 90,
  "lastCompletedDate": "date",
  "notes": "string"
}
```

### `calendarDays/{yyyy-mm-dd}`

```json
{
  "date": "date",
  "tone": "string",
  "fastingRules": {
    "antiochian": {
      "rule": "none|strict|wineOil|fish|dairy",
      "allowedFoods": ["string"],
      "notes": "string"
    }
  },
  "feasts": ["feastId"],
  "saints": ["saintId"],
  "readings": ["readingId"]
}
```

### `feasts/{feastId}`

```json
{
  "name": {"en": "string"},
  "rank": "major|local|commemoration",
  "dateRule": "fixed|pascha-relative",
  "description": {"en": "string"},
  "iconAssetPath": "string",
  "historicalNotes": {"en": "string"},
  "approved": true
}
```

### `readings/{readingId}`

```json
{
  "type": "epistle|gospel|old-testament|apostol",
  "citation": "string",
  "text": {"en": "string"},
  "audioAssetPath": "string",
  "source": "string",
  "approved": true
}
```

### `icons/{iconId}`

```json
{
  "title": {"en": "string"},
  "category": "christ|theotokos|saint|feast|history",
  "imagePath": "string",
  "summary": {"en": "string"},
  "biography": {"en": "string"},
  "feastIds": ["string"],
  "sourceIds": ["string"],
  "approved": true
}
```

### `prayerRequests/{requestId}`

```json
{
  "authorId": "string|null",
  "displayName": "Anonymous",
  "body": "string",
  "anonymous": true,
  "status": "pending|approved|rejected|flagged",
  "prayerCount": 0,
  "createdAt": "timestamp",
  "moderatedAt": "timestamp|null"
}
```

### `assistantSources/{sourceId}`

```json
{
  "title": "string",
  "language": "en",
  "tradition": "canonical|patristic|liturgical|catechism",
  "storagePath": "string",
  "approvedBy": "userId",
  "approvedAt": "timestamp",
  "citation": "string"
}
```

### `assistantSourceChunks/{chunkId}`

```json
{
  "sourceId": "string",
  "text": "string",
  "language": "en",
  "embeddingRef": "string",
  "citation": "string",
  "approved": true
}
```

## Security Rules Summary

- Public approved content can be read without authentication.
- User-private notes, bookmarks, profile, and progress are readable only by that user.
- Prayer requests can be created by authenticated or anonymous users but are not public until approved.
- Admin and editor writes require role claims.
- Assistant source ingestion requires an editor or clergy reviewer role.
