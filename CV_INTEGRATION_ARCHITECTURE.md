# Computer Vision Integration Architecture

## System Overview

This document outlines the complete architecture for integrating AWS-hosted Computer Vision services with the HyperDooh digital signage CMS, including Android APK integration.

## Architecture Diagram

```
┌─────────────────┐
│  Android APK    │
│  (Player App)   │
└────────┬────────┘
         │
         │ 1. Login & Auth
         ▼
┌─────────────────┐
│   Supabase      │
│   Auth          │
└────────┬────────┘
         │
         │ 2. Get Screen Config
         ▼
┌─────────────────────────────────────────────────┐
│           Supabase Backend                      │
│  ┌──────────────────────────────────────────┐  │
│  │  Edge Functions                          │  │
│  │  - audience_profiles_ingest            │  │
│  │  - get_scheduled_content                │  │
│  │  - cv_config_api (NEW)                  │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │  Database Tables                         │  │
│  │  - screens, cameras, cv_configs         │  │
│  │  - rules, triggers, audience_profiles   │  │
│  └──────────────────────────────────────────┘  │
└────────┬────────────────────────────────────────┘
         │
         │ 3. CV Data & Config API Calls
         ▼
┌─────────────────────────────────────────────────┐
│         AWS Computer Vision Service             │
│  ┌──────────────────────────────────────────┐  │
│  │  API Gateway / Lambda                    │  │
│  │  - /analyze (POST) - Process video      │  │
│  │  - /config (GET/POST) - Get/Set config   │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │  EC2/ECS with CV Models                  │  │
│  │  - Age detection model                   │  │
│  │  - Gender detection model                 │  │
│  │  - Face recognition (unique ID)           │  │
│  │  - People counting                        │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Data Flow

### 1. Initial Setup Flow
```
Android APK → Login → Get Screen ID → Get Camera Configs → Connect to AWS CV Service
```

### 2. Real-time CV Processing Flow
```
Camera Feed → AWS CV Service → Analyze Frame → Extract Data → 
POST to Supabase Edge Function → Evaluate Rules → Create Trigger → 
Android APK Polls Content → Display Creative (<2s)
```

### 3. Configuration Flow
```
Dashboard → Create/Update Rules → Save to Database → 
Android APK Syncs Config → Apply to CV Service
```

## API Endpoints

### Public CV Data API (for Android APK)

#### 1. Ingest CV Data
**Endpoint:** `POST /functions/v1/audience_profiles_ingest`

**Request:**
```json
{
  "screen_id": 123,
  "camera_id": 456,
  "people_count": 3,
  "male_count": 2,
  "female_count": 1,
  "avg_age": 32.5,
  "min_age": 25,
  "max_age": 45,
  "dwell_time_sec": 15,
  "faces": [
    {
      "face_id": "unique_face_hash_123",
      "age": 28,
      "gender": "Male",
      "dwell_time_sec": 15,
      "is_new": true
    },
    {
      "face_id": "unique_face_hash_456",
      "age": 35,
      "gender": "Female",
      "dwell_time_sec": 8,
      "is_new": false
    }
  ],
  "raw_payload": { /* optional full payload */ }
}
```

**Response:**
```json
{
  "ok": true,
  "matchedRule": {
    "id": 789,
    "name": "Multiple Women Rule",
    "output_media_id": 101
  },
  "triggerCreated": true
}
```

#### 2. Get CV Configuration
**Endpoint:** `GET /functions/v1/cv_config_api?screen_id={id}`

**Response:**
```json
{
  "cameras": [
    {
      "id": 456,
      "name": "Front Camera",
      "location": "Entrance",
      "aws_camera_identifier": "cam-001",
      "is_active": true,
      "config": {
        "frame_interval_ms": 2000,
        "enable_age": true,
        "enable_gender": true,
        "min_people_for_detection": 1,
        "min_dwell_to_trigger_sec": 5,
        "rearm_cooldown_sec": 600
      }
    }
  ],
  "rules": [
    {
      "id": 789,
      "name": "Women's Ad",
      "priority": 100,
      "min_females": 1,
      "output_media_id": 101,
      "is_active": true
    }
  ]
}
```

#### 3. Get Active Content
**Endpoint:** `GET /functions/v1/get_scheduled_content?screen_id={id}`

**Response:**
```json
{
  "mode": "trigger",
  "media_id": 101,
  "expires_at": "2025-01-15T10:30:00Z"
}
```

### AWS CV Service API

#### 1. Analyze Frame
**Endpoint:** `POST https://your-aws-api.execute-api.region.amazonaws.com/v1/analyze`

**Request:**
```json
{
  "camera_id": "cam-001",
  "screen_id": 123,
  "frame_data": "base64_encoded_image",
  "timestamp": "2025-01-15T10:25:00Z"
}
```

**Response:**
```json
{
  "people_count": 3,
  "male_count": 2,
  "female_count": 1,
  "avg_age": 32.5,
  "min_age": 25,
  "max_age": 45,
  "faces": [
    {
      "face_id": "unique_face_hash_123",
      "age": 28,
      "gender": "Male",
      "dwell_time_sec": 15,
      "is_new": true
    }
  ],
  "processing_time_ms": 150
}
```

## Unique Face Tracking Implementation

### Problem
A person spending >1 minute near signage should not create multiple triggers. Each unique face should trigger only once per cooldown period.

### Solution
1. **Face ID Generation**: AWS CV service generates unique hash for each face
2. **Cooldown Tracking**: Store last trigger time per face_id in database
3. **Re-arm Logic**: Only trigger if face hasn't triggered in last `rearm_cooldown_sec` seconds

### Database Enhancement
Add tracking table for face triggers:

```sql
CREATE TABLE face_trigger_history (
  id BIGSERIAL PRIMARY KEY,
  face_external_id TEXT NOT NULL,
  screen_id BIGINT NOT NULL,
  rule_id BIGINT,
  media_id BIGINT,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(face_external_id, screen_id, rule_id)
);

CREATE INDEX idx_face_trigger_history_lookup 
ON face_trigger_history(face_external_id, screen_id, triggered_at);
```

## Rule Engine Enhancements

### Current Rule Fields
- `min_people`, `max_people`
- `min_males`, `max_males`
- `min_females`, `max_females`
- `min_avg_age`, `max_avg_age`
- `min_dwell_sec`, `max_dwell_sec`

### Enhanced Rule Logic
Support complex conditions:
- "If 2+ women AND 0 men → play women's ad"
- "If 1 woman AND 1 man → play men's ad"
- "If avg_age < 30 AND people_count >= 3 → play youth ad"

### Rule Priority System
- Higher priority rules evaluated first
- First match wins
- Global rules (screen_id = null) apply to all screens

## Performance Requirements

### <2 Second Response Time
1. **CV Processing**: <500ms (AWS Lambda/EC2)
2. **API Call**: <200ms (Supabase Edge Function)
3. **Rule Evaluation**: <100ms (Database query + logic)
4. **Trigger Creation**: <100ms (Database insert)
5. **Content Polling**: <100ms (Android APK polls every 1s)
6. **Media Loading**: <1000ms (Cached/preloaded)

**Total**: ~2 seconds end-to-end

### Optimization Strategies
1. **Preload Media**: Android APK preloads all possible creatives
2. **Edge Caching**: Cache rules and configs at edge
3. **Batch Processing**: Process multiple frames in parallel
4. **Connection Pooling**: Reuse database connections

## Android APK Integration

### 1. Authentication Flow
```kotlin
// Login to Supabase
val session = supabase.auth.signInWith(Email) {
    email = userEmail
    password = userPassword
}

// Get screen pairing code
val screenCode = getScreenPairingCode()
val screen = supabase.rpc("pair_screen", screenCode)
```

### 2. CV Configuration Sync
```kotlin
// Fetch CV config on startup
val config = supabase.functions.invoke("cv_config_api") {
    body = mapOf("screen_id" to screenId)
}

// Connect to AWS CV service
val awsCvClient = AWSComputerVisionClient(
    endpoint = config.awsEndpoint,
    apiKey = config.apiKey
)
```

### 3. Real-time CV Processing
```kotlin
// Capture frame from camera
val frame = camera.captureFrame()

// Send to AWS CV service
val analysis = awsCvClient.analyze(frame)

// Send to Supabase
supabase.functions.invoke("audience_profiles_ingest") {
    body = analysis.toJson()
}

// Poll for content updates
lifecycleScope.launch {
    while (true) {
        val content = supabase.functions.invoke("get_scheduled_content") {
            body = mapOf("screen_id" to screenId)
        }
        if (content.mediaId != currentMediaId) {
            displayMedia(content.mediaId)
        }
        delay(1000) // Poll every 1 second
    }
}
```

### 4. Media Display
```kotlin
// Preload all media on startup
val mediaList = supabase.from("screens_media")
    .select("media(*)")
    .eq("screen_id", screenId)
    .decodeList<MediaItem>()

// Cache media locally
mediaList.forEach { media ->
    downloadAndCache(media.file_path)
}

// Display triggered media
fun displayMedia(mediaId: Long) {
    val cachedPath = getCachedMediaPath(mediaId)
    if (cachedPath != null) {
        mediaPlayer.load(cachedPath)
        mediaPlayer.start()
    }
}
```

## AWS CV Service Architecture

### Option 1: Lambda + API Gateway (Recommended for Start)
```
API Gateway → Lambda Function → Rekognition/OpenCV → Response
```

**Pros:**
- Serverless, auto-scaling
- Pay per request
- Easy deployment

**Cons:**
- 15-minute timeout limit
- Cold start latency

### Option 2: ECS/Fargate with EC2 (Recommended for Scale)
```
API Gateway → ALB → ECS Task (OpenCV + Models) → Response
```

**Pros:**
- Always warm
- Better for real-time processing
- Can handle multiple cameras

**Cons:**
- Higher cost
- More complex setup

### CV Model Options

#### 1. AWS Rekognition
- Pre-built age/gender detection
- Face recognition
- Easy integration
- Pay per API call

#### 2. OpenCV + Custom Models
- Age: DeepFace or custom CNN
- Gender: Gender classification model
- Face ID: FaceNet or ArcFace
- People counting: YOLO or OpenPose

#### 3. Hybrid Approach
- Use Rekognition for face detection
- Custom models for age/gender
- Redis for face ID caching

## Security Considerations

### API Authentication
1. **Supabase JWT**: All Supabase endpoints require valid JWT
2. **AWS API Keys**: AWS CV service uses API keys per screen
3. **Rate Limiting**: Limit requests per screen/camera

### Data Privacy
1. **No Face Storage**: Only store face hashes, not images
2. **GDPR Compliance**: Anonymize all personal data
3. **Data Retention**: Auto-delete old audience profiles

## Monitoring & Logging

### Metrics to Track
1. CV processing latency
2. Rule match rate
3. Trigger creation time
4. Media switch time
5. API error rates

### Logging
- All CV data ingestion
- Rule evaluations
- Trigger creations
- Media switches

## Testing Strategy

### Unit Tests
- Rule evaluation logic
- Face tracking cooldown
- API endpoint handlers

### Integration Tests
- End-to-end CV flow
- Android APK integration
- AWS service communication

### Load Tests
- Multiple cameras simultaneously
- High frame rate processing
- Concurrent rule evaluations

