# Multimodal Analysis Implementation Guide

## Opción C - Enterprise Implementation Complete

### ✅ Completed Components

1. **Database Schema** (/scripts/001_create_multimodal_analysis_schema.sql)
   - 9 tables for video storage, analyses, and metrics
   - Row-Level Security (RLS) for privacy
   - Automatic timestamps and cascading deletes

2. **Video Processing** (lib/multimodal/video-processor.ts)
   - Frame extraction at 1fps (configurable)
   - Audio extraction to MP3
   - Resolution and FPS detection
   - Parallel processing for performance

3. **OpenAI Integration** (lib/multimodal/openai-multimodal.ts)
   - GPT-4o Vision for visual analysis (posture, eye contact, gestures)
   - Whisper API for transcription
   - Coherence analysis between visual and audio
   - Personalized recommendations generation
   - 4 concurrent API calls optimized for cost

4. **Processing Queue** (lib/multimodal/analysis-queue.ts)
   - Bull Queue for reliable job processing
   - Redis-backed (production ready)
   - Automatic retries (3 attempts with exponential backoff)
   - Job status tracking
   - Complete error handling

5. **API Endpoints**
   - POST /api/multimodal/upload - Video upload and queue
   - GET /api/multimodal/status - Job status and results
   - GET /api/multimodal/analytics - Analytics and trends

6. **Frontend Components**
   - VideoRecorder: Video recording with WebRTC
   - AnalysisResults: Real-time results display
   - MultimodalAnalyticsDashboard: Historical analytics
   - Main page at /despega/a3/analisis-multimodal

---

## 🔧 Setup Instructions

### 1. Environment Variables

Add these to `.env.local` and Vercel project settings:

```
# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Redis (for Bull Queue)
REDIS_HOST=your-redis-host.redis.upstash.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Vercel Blob (already configured)
BLOB_READ_WRITE_TOKEN=your-token

# Optional: Cost tracking
MULTIMODAL_DAILY_BUDGET=100  # USD per day
```

### 2. Install Dependencies

```bash
pnpm add bull redis openai uuid
pnpm add -D @types/bull @types/redis
```

For FFmpeg (system dependency):
- **macOS**: `brew install ffmpeg`
- **Ubuntu/Debian**: `apt-get install ffmpeg`
- **Windows**: Download from https://ffmpeg.org/download.html

### 3. Initialize Bull Redis

The Bull Queue will automatically connect to Redis. Ensure Redis is running:

```bash
# Using Upstash Redis (recommended for production)
# Already configured via REDIS_* environment variables
```

### 4. Enable Multimodal Analysis in A3

Add to A3 navigation menu (app/despega/a3/page.tsx):

```tsx
{
  href: '/despega/a3/analisis-multimodal',
  icon: <Video className="w-5 h-5" />,
  label: 'Análisis Multimodal',
  description: 'Feedback visual, audio y lenguaje corporal'
}
```

---

## 📊 Features Breakdown

### Visual Analysis
- **Postura Quality** (0-100): Professional stance assessment
- **Eye Contact** (0-100): Camera engagement level
- **Facial Expressions**: Emotion detection and naturalness
- **Gestures**: Frequency, appropriateness, naturalness rating
- **Microexpressions**: Stress/discomfort indicators

### Audio Analysis
- **Tone Quality** (0-100): Professionalism and warmth
- **Speech Pace** (WPM): Typical 120-150, flags too fast/slow
- **Clarity** (0-100): Pronunciation and articulation
- **Filler Words**: Count of "um", "uh", "este", "pues"
- **Confidence Level** (0-100): Vocal projection and certainty

### Coherence Analysis
- **Visual-Audio Alignment** (0-100): Body matches words
- **Message Consistency**: Narrative coherence check
- **Emotional Congruence** (0-100): Feelings match expression
- **Contradictions**: Identified between verbal and non-verbal

---

## 💰 Cost Estimation

| Component | Cost | Notes |
|-----------|------|-------|
| GPT-4o Vision (10 frames) | $0.05 | ~$0.01/frame |
| Whisper Transcription | $0.02/min | Average 5 min = $0.10 |
| GPT-4o Analysis & Recommendations | $0.05 | Text tokens |
| **Per Video** | **~$0.17** | |
| **100 Videos/month** | **$17** | |
| **1000 Videos/month** | **$170** | |

**Production Budget Recommendation**: $500/month for 2,500+ analyses

---

## 🚀 Deployment Checklist

- [ ] Add environment variables to Vercel project
- [ ] Install FFmpeg on deployment server (if self-hosted)
- [ ] Test Bull Queue connection to Redis
- [ ] Verify OpenAI API key and rate limits
- [ ] Test video upload to Vercel Blob
- [ ] Verify Supabase RLS policies
- [ ] Load test with 10 concurrent uploads
- [ ] Enable monitoring/alerts for API usage
- [ ] Set up daily budget alerts
- [ ] Configure backup retention policy (30 days default)
- [ ] Test error scenarios and recovery
- [ ] Document API rate limits for users

---

## 📈 Performance Optimization

### Currently Implemented:
- ✅ Parallel frame extraction + audio extraction
- ✅ Batch image processing for GPT-4o
- ✅ Queue-based async processing
- ✅ Result caching in database
- ✅ Automatic cleanup of temp files

### Future Optimizations:
- [ ] Add Redis caching for analysis results
- [ ] Implement video compression before processing
- [ ] Add watermarking for security
- [ ] Batch multiple analyses for bulk processing
- [ ] Implement cost prediction before processing

---

## 🔐 Security Features

### Implemented:
- ✅ Row-Level Security (RLS) on all tables
- ✅ Private Blob storage (encrypted)
- ✅ User authentication required
- ✅ API rate limiting via Bull Queue
- ✅ Automatic data retention (30 days)
- ✅ No personal data in logs

### Compliance:
- GDPR compliant (can delete all user data)
- Video data encrypted at rest (Vercel Blob)
- No third-party data sharing
- Audit logs for all API calls

---

## 🐛 Troubleshooting

### "Failed to extract frames"
- Ensure FFmpeg is installed: `which ffmpeg`
- Check video file permissions
- Verify temp directory has write access

### "OpenAI API rate limit exceeded"
- Queue jobs automatically retry with exponential backoff
- Increase REDIS_QUEUE_CONCURRENCY if needed
- Consider batch processing off-peak hours

### "Redis connection failed"
- Verify REDIS_* environment variables
- Check Redis server status
- Test connection: `redis-cli ping`

### "Video upload timeout"
- Increase request timeout in API (currently 30s)
- Check file size limits
- Test upload speed to Blob storage

---

## 📚 API Reference

### Upload Video
```bash
curl -X POST http://localhost:3000/api/multimodal/upload \
  -F "video=@interview.webm" \
  -F "entrenamiento_type=entrevista-basica"
```

Response:
```json
{
  "sessionId": "uuid",
  "jobId": "uuid",
  "status": "queued"
}
```

### Check Status
```bash
curl http://localhost:3000/api/multimodal/status?sessionId=uuid
```

### Get Analytics
```bash
curl http://localhost:3000/api/multimodal/analytics?period=month
```

---

## 📞 Support

For issues or questions:
1. Check logs in Vercel dashboard
2. Review Bull Queue status in Redis CLI
3. Test OpenAI API directly
4. Check Blob storage quotas
