# Android APK API Integration Guide

## Overview

This guide explains how to integrate the Android APK with the HyperDooh CV system via REST APIs.

## Base URLs

- **Supabase API**: `https://your-project.supabase.co`
- **AWS CV Service**: `https://your-api.execute-api.region.amazonaws.com/v1`

## Authentication

### 1. Login to Supabase

```kotlin
val supabase = SupabaseClient(
    supabaseUrl = "https://your-project.supabase.co",
    supabaseKey = "your-anon-key"
)

// Login
val session = supabase.auth.signInWith(Email) {
    email = "user@example.com"
    password = "password"
}

// Store session token
val accessToken = session.accessToken
```

### 2. Get Screen Configuration

After login, get the screen pairing code and pair the screen:

```kotlin
// Pair screen with code
val pairingCode = "ABC123" // From user input or stored
val result = supabase.rpc("pair_screen", mapOf("code_to_check" to pairingCode))

val screenId = result.first()["id"] as Long
```

## CV Configuration API

### Get CV Configuration

**Endpoint:** `GET /functions/v1/cv_config_api?screen_id={screen_id}`

**Headers:**
```
Authorization: Bearer {access_token}
apikey: {supabase_anon_key}
```

**Kotlin Example:**
```kotlin
suspend fun getCVConfig(screenId: Long): CVConfig {
    val response = supabase.functions.invoke("cv_config_api") {
        body = mapOf("screen_id" to screenId)
    }
    
    return json.decodeFromString<CVConfig>(response)
}

data class CVConfig(
    val screen_id: Long,
    val cameras: List<Camera>,
    val rules: List<Rule>
)

data class Camera(
    val id: Long,
    val name: String,
    val location: String,
    val aws_camera_identifier: String,
    val is_active: Boolean,
    val config: CameraConfig
)

data class CameraConfig(
    val frame_interval_ms: Int,
    val enable_age: Boolean,
    val enable_gender: Boolean,
    val min_people_for_detection: Int,
    val min_dwell_to_trigger_sec: Int,
    val rearm_cooldown_sec: Int
)
```

## AWS CV Service Integration

### Initialize AWS CV Client

```kotlin
class AWSComputerVisionClient(
    private val endpoint: String,
    private val apiKey: String
) {
    private val client = OkHttpClient()
    
    suspend fun analyzeFrame(
        cameraId: String,
        screenId: Long,
        frameData: ByteArray
    ): CVAnalysisResult {
        val base64Image = Base64.encodeToString(frameData, Base64.NO_WRAP)
        
        val requestBody = json.encodeToString(
            AnalyzeRequest(
                camera_id = cameraId,
                screen_id = screenId,
                frame_data = base64Image,
                timestamp = Instant.now().toString()
            )
        )
        
        val request = Request.Builder()
            .url("$endpoint/analyze")
            .post(requestBody.toRequestBody("application/json".toMediaType()))
            .addHeader("x-api-key", apiKey)
            .build()
        
        val response = client.newCall(request).execute()
        return json.decodeFromString<CVAnalysisResult>(response.body?.string() ?: "")
    }
}

data class AnalyzeRequest(
    val camera_id: String,
    val screen_id: Long,
    val frame_data: String,
    val timestamp: String
)

data class CVAnalysisResult(
    val people_count: Int,
    val male_count: Int,
    val female_count: Int,
    val avg_age: Double,
    val min_age: Int,
    val max_age: Int,
    val faces: List<FaceData>,
    val processing_time_ms: Int
)

data class FaceData(
    val face_id: String,
    val age: Int,
    val gender: String,
    val dwell_time_sec: Int,
    val is_new: Boolean
)
```

## CV Data Ingestion

### Send CV Data to Supabase

**Endpoint:** `POST /functions/v1/audience_profiles_ingest`

**Kotlin Example:**
```kotlin
suspend fun sendCVData(
    screenId: Long,
    cameraId: Long,
    analysis: CVAnalysisResult
): IngestionResponse {
    val requestBody = mapOf(
        "screen_id" to screenId,
        "camera_id" to cameraId,
        "people_count" to analysis.people_count,
        "male_count" to analysis.male_count,
        "female_count" to analysis.female_count,
        "avg_age" to analysis.avg_age,
        "min_age" to analysis.min_age,
        "max_age" to analysis.max_age,
        "dwell_time_sec" to analysis.faces.maxOfOrNull { it.dwell_time_sec } ?: 0,
        "faces" to analysis.faces.map { face ->
            mapOf(
                "face_id" to face.face_id,
                "age" to face.age,
                "gender" to face.gender,
                "dwell_time_sec" to face.dwell_time_sec,
                "is_new" to face.is_new
            )
        }
    )
    
    val response = supabase.functions.invoke("audience_profiles_ingest") {
        body = requestBody
    }
    
    return json.decodeFromString<IngestionResponse>(response)
}

data class IngestionResponse(
    val ok: Boolean,
    val matchedRule: MatchedRule?,
    val triggerCreated: Boolean
)

data class MatchedRule(
    val id: Long,
    val name: String,
    val output_media_id: Long
)
```

## Content Polling

### Get Active Content

**Endpoint:** `GET /functions/v1/get_scheduled_content?screen_id={screen_id}`

**Kotlin Example:**
```kotlin
suspend fun getActiveContent(screenId: Long): ContentResponse {
    val response = supabase.functions.invoke("get_scheduled_content") {
        body = mapOf("screen_id" to screenId)
    }
    
    return json.decodeFromString<ContentResponse>(response)
}

data class ContentResponse(
    val mode: String, // "trigger", "scheduled", or "fallback"
    val media_id: Long?,
    val expires_at: String?,
    val playlist: List<PlaylistItem>?
)

data class PlaylistItem(
    val media_id: Long,
    val duration: Int,
    val display_order: Int
)
```

### Continuous Polling

```kotlin
class ContentPoller(
    private val screenId: Long,
    private val onContentChange: (Long?) -> Unit
) {
    private var currentMediaId: Long? = null
    private var isPolling = false
    
    fun start() {
        isPolling = true
        CoroutineScope(Dispatchers.IO).launch {
            while (isPolling) {
                try {
                    val content = getActiveContent(screenId)
                    
                    when (content.mode) {
                        "trigger" -> {
                            content.media_id?.let { mediaId ->
                                if (mediaId != currentMediaId) {
                                    currentMediaId = mediaId
                                    onContentChange(mediaId)
                                }
                            }
                        }
                        "scheduled", "fallback" -> {
                            // Handle playlist
                            content.playlist?.firstOrNull()?.let { item ->
                                if (item.media_id != currentMediaId) {
                                    currentMediaId = item.media_id
                                    onContentChange(item.media_id)
                                }
                            }
                        }
                    }
                } catch (e: Exception) {
                    Log.e("ContentPoller", "Error polling content", e)
                }
                
                delay(1000) // Poll every 1 second
            }
        }
    }
    
    fun stop() {
        isPolling = false
    }
}
```

## Complete Integration Flow

```kotlin
class HyperDoohPlayer {
    private lateinit var supabase: SupabaseClient
    private lateinit var awsCVClient: AWSComputerVisionClient
    private lateinit var contentPoller: ContentPoller
    private var screenId: Long = 0
    private var cameras: List<Camera> = emptyList()
    
    suspend fun initialize(email: String, password: String, pairingCode: String) {
        // 1. Login
        supabase = createSupabaseClient()
        val session = supabase.auth.signInWith(Email) {
            this.email = email
            this.password = password
        }
        
        // 2. Pair screen
        val pairResult = supabase.rpc("pair_screen", mapOf("code_to_check" to pairingCode))
        screenId = pairResult.first()["id"] as Long
        
        // 3. Get CV config
        val cvConfig = getCVConfig(screenId)
        cameras = cvConfig.cameras
        
        // 4. Initialize AWS CV client
        val firstCamera = cameras.firstOrNull()
        if (firstCamera != null) {
            awsCVClient = AWSComputerVisionClient(
                endpoint = "https://your-api.execute-api.region.amazonaws.com/v1",
                apiKey = "your-aws-api-key"
            )
        }
        
        // 5. Start content polling
        contentPoller = ContentPoller(screenId) { mediaId ->
            displayMedia(mediaId)
        }
        contentPoller.start()
        
        // 6. Start CV processing
        startCVProcessing()
    }
    
    private fun startCVProcessing() {
        cameras.forEach { camera ->
            CoroutineScope(Dispatchers.IO).launch {
                val camera = Camera2.open(camera.id.toInt())
                val frameInterval = camera.config.frame_interval_ms
                
                while (true) {
                    try {
                        // Capture frame
                        val frame = captureFrame(camera)
                        
                        // Analyze with AWS CV
                        val analysis = awsCVClient.analyzeFrame(
                            cameraId = camera.aws_camera_identifier,
                            screenId = screenId,
                            frameData = frame
                        )
                        
                        // Send to Supabase
                        sendCVData(screenId, camera.id, analysis)
                        
                    } catch (e: Exception) {
                        Log.e("CVProcessing", "Error processing frame", e)
                    }
                    
                    delay(frameInterval.toLong())
                }
            }
        }
    }
    
    private fun displayMedia(mediaId: Long) {
        // Preload and display media
        // Implementation depends on your media player
    }
}
```

## Error Handling

```kotlin
sealed class APIError {
    object NetworkError : APIError()
    object AuthenticationError : APIError()
    data class ServerError(val message: String) : APIError()
    data class UnknownError(val exception: Exception) : APIError()
}

suspend fun <T> safeApiCall(block: suspend () -> T): Result<T> {
    return try {
        Result.success(block())
    } catch (e: IOException) {
        Result.failure(APIError.NetworkError)
    } catch (e: HttpException) {
        when (e.code()) {
            401 -> Result.failure(APIError.AuthenticationError)
            else -> Result.failure(APIError.ServerError(e.message()))
        }
    } catch (e: Exception) {
        Result.failure(APIError.UnknownError(e))
    }
}
```

## Media Preloading

```kotlin
class MediaCache {
    private val cacheDir = File(context.cacheDir, "media")
    
    suspend fun preloadMedia(screenId: Long) {
        // Get all media for this screen
        val mediaList = supabase
            .from("screens_media")
            .select("media(*)")
            .eq("screen_id", screenId)
            .decodeList<MediaItem>()
        
        // Download and cache
        mediaList.forEach { media ->
            downloadAndCache(media.file_path, media.id)
        }
    }
    
    private suspend fun downloadAndCache(url: String, mediaId: Long) {
        val file = File(cacheDir, "$mediaId")
        if (!file.exists()) {
            // Download file
            val response = httpClient.get(url)
            response.bodyAsBytes().writeTo(file)
        }
    }
    
    fun getCachedPath(mediaId: Long): String? {
        val file = File(cacheDir, "$mediaId")
        return if (file.exists()) file.absolutePath else null
    }
}
```

## Testing

### Test CV Data Ingestion

```kotlin
@Test
fun testCVIngestion() {
    runBlocking {
        val analysis = CVAnalysisResult(
            people_count = 2,
            male_count = 1,
            female_count = 1,
            avg_age = 30.0,
            min_age = 25,
            max_age = 35,
            faces = listOf(
                FaceData("face_123", 28, "Male", 10, true),
                FaceData("face_456", 32, "Female", 8, true)
            ),
            processing_time_ms = 150
        )
        
        val result = sendCVData(screenId = 1, cameraId = 1, analysis)
        assertTrue(result.ok)
        assertNotNull(result.matchedRule)
    }
}
```

## Performance Optimization

1. **Batch Frame Processing**: Process multiple frames in parallel
2. **Connection Pooling**: Reuse HTTP connections
3. **Media Caching**: Preload all possible creatives
4. **Background Processing**: Use background threads for CV processing
5. **Exponential Backoff**: Retry failed requests with backoff

## Security Best Practices

1. **Store Credentials Securely**: Use Android Keystore
2. **Validate API Responses**: Always validate response data
3. **Handle Timeouts**: Set appropriate timeout values
4. **Encrypt Communications**: Use HTTPS only
5. **Token Refresh**: Implement token refresh logic

