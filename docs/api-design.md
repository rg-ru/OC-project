# Liturgical Calendar API Design

The production API should be implemented with Firebase Cloud Functions and protected by Firebase App Check, API keys, and rate limits.

## Authentication

- Public read endpoints support anonymous access with rate limits.
- User-specific endpoints require Firebase Authentication.
- Admin endpoints require custom role claims.

## Rate Limits

- Public anonymous: 60 requests per minute per IP.
- Authenticated user: 600 requests per minute per user.
- Admin: scoped by role and endpoint.

## Endpoints

### `GET /v1/readings/daily`

Query parameters:

- `date`: ISO date, defaults to today.
- `jurisdiction`: `antiochian|greek|oca|romanian|russian|serbian`.
- `language`: `en|de|ru|el|sr|ro`.

Response:

```json
{
  "date": "2026-06-04",
  "tone": "string",
  "feasts": [],
  "saints": [],
  "readings": [
    {
      "type": "epistle",
      "citation": "Romans 2:14-29",
      "text": "string",
      "audioUrl": "string"
    }
  ]
}
```

### `GET /v1/fasting`

Returns the fasting rule and allowed foods for a date and jurisdiction.

```json
{
  "date": "2026-06-04",
  "jurisdiction": "antiochian",
  "rule": "wineOil",
  "allowedFoods": ["Vegetables", "Fruit", "Bread", "Legumes", "Wine", "Oil"],
  "period": "Weekly Fast",
  "notes": "string"
}
```

### `GET /v1/feasts`

Supports fixed and movable feast lookup.

Query parameters:

- `from`
- `to`
- `rank`
- `language`

### `GET /v1/saints`

Search saints by name, feast date, century, region, or tag.

### `GET /v1/churches`

Search churches by geolocation, jurisdiction, service language, and service schedule.

### `POST /v1/prayer-requests`

Creates a moderated prayer request.

### `POST /v1/assistant/ask`

Requires authentication. The request includes the question, language, jurisdiction, and conversation id. The response must include answer text, citations, retrieved source ids, and a confidence status.

### `POST /v1/admin/assistant-sources`

Requires an `admin` or `editor` Firebase custom claim. Creates an assistant education source draft from approved Orthodox material.

```json
{
  "title": "Holy Icons and Veneration",
  "topic": "Catechism",
  "language": "en",
  "citation": "Seventh Ecumenical Council; approved catechism notes",
  "summary": "string",
  "status": "draft"
}
```

### `PATCH /v1/admin/assistant-sources/{sourceId}`

Requires an `admin` custom claim. Updates review status, approval metadata, archive state, and source text. Approved sources become eligible for RAG retrieval.

### `GET /v1/admin/moderation`

Requires an `admin` custom claim. Returns pending prayer requests, content reports, assistant source review items, and audit metadata.

## Error Model

```json
{
  "error": {
    "code": "rate_limited",
    "message": "Too many requests.",
    "requestId": "string"
  }
}
```
