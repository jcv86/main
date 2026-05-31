# QUICK START GUIDE - Multimodal Analysis

## 1-Minute Setup

### Environment Variables
```bash
# Add to .env.local
OPENAI_API_KEY=sk_xxx
REDIS_HOST=xxx.redis.upstash.com
REDIS_PORT=6379
REDIS_PASSWORD=xxx
ENCRYPTION_MASTER_KEY=your_random_key_here
```

### Install Dependencies
```bash
pnpm add bull redis openai uuid jspdf html2canvas
brew install ffmpeg  # macOS
```

### Test Locally
```bash
# Start dev server
pnpm dev

# Visit
open http://localhost:3000/despega/a3/analisis-multimodal

# Record and analyze a video
# Full analysis takes 2-5 minutes
```

---

## Features at a Glance

| Feature | Status | Access |
|---------|--------|--------|
| Video Recording | ✅ Live | `/analisis-multimodal` → Capturar |
| Real-time Feedback | ✅ Live | During recording |
| Visual Analysis | ✅ Live | Resultados tab |
| Audio Analysis | ✅ Live | Resultados tab |
| Coherence Score | ✅ Live | Resultados tab |
| Basic Analytics | ✅ Live | Resumen tab |
| Advanced Analytics | ✅ Live | Avanzado tab |
| PDF Reports | ✅ Live | Export buttons |
| Benchmarking | ✅ Live | Avanzado tab |
| Achievements | ✅ Live | Avanzado tab |

---

## File Structure

```
/lib/multimodal/
├─ video-processor.ts        # FFmpeg + frame extraction
├─ openai-multimodal.ts      # GPT-4o + Whisper integration
├─ analysis-queue.ts         # Bull Queue + Redis
└─ encryption.ts             # AES-256-GCM crypto

/components/multimodal/
├─ video-recorder.tsx        # WebRTC capture
├─ analysis-results.tsx      # Results display
├─ analytics-dashboard.tsx   # Basic metrics
├─ advanced-analytics.tsx    # Advanced dashboard
└─ realtime-feedback-engine.tsx  # Live feedback

/app/api/multimodal/
├─ upload/route.ts           # Upload + queue
├─ status/route.ts           # Job tracking
├─ analytics/route.ts        # Basic analytics
├─ advanced-analytics/route.ts   # Advanced metrics
├─ realtime-feedback/route.ts    # Live coaching
├─ export-report/route.ts    # PDF generation
└─ export-analytics/route.ts # Analytics PDF

/app/despega/a3/
└─ analisis-multimodal/page.tsx   # Main hub
```

---

## Key API Endpoints

```bash
# Upload video
POST /api/multimodal/upload
Body: FormData { video, entrenamiento_type }
Returns: { sessionId, jobId, status }

# Get results
GET /api/multimodal/status?sessionId=xxx
Returns: { status, analysis, jobStatus, completedAt }

# Basic analytics
GET /api/multimodal/analytics?period=month
Returns: { total_sessions, average_score, by_type, ... }

# Advanced analytics
GET /api/multimodal/advanced-analytics?period=month
Returns: { improvement_trend, consistency_score, achievements, ... }

# Export PDF report
POST /api/multimodal/export-report
Body: { sessionId }
Returns: { reportUrl, fileName }

# Real-time feedback
POST /api/multimodal/realtime-feedback
Body: { frameData: base64 }
Returns: { feedback: [{type, severity, message, suggestion}] }
```

---

## Cost Calculator

| Scenario | Videos | Cost/Month |
|----------|--------|-----------|
| Casual | 50 | ~$7 |
| Regular | 500 | ~$70 |
| Heavy | 2,500 | ~$350 |
| Production | 5,000+ | ~$700+ |

---

## Common Issues & Solutions

### "FFmpeg not found"
```bash
brew install ffmpeg  # macOS
sudo apt-get install ffmpeg  # Ubuntu
# Windows: https://ffmpeg.org/download.html
```

### "Redis connection failed"
```bash
# Check credentials
redis-cli -h {host} -p {port} -a {password} ping
# Should return: PONG
```

### "OpenAI API rate limit"
- Queue automatically retries (3 attempts)
- Check usage: https://platform.openai.com/usage
- Spread uploads across different times

### "Video upload timeout"
- Check file size < 500MB
- Verify network connection
- Try again (retry logic built-in)

---

## Testing Checklist

```bash
# 1. Test environment variables
echo $OPENAI_API_KEY

# 2. Test Redis connection
redis-cli -h {host} -p {port} -a {password} ping

# 3. Test FFmpeg
ffmpeg -version

# 4. Start dev server
pnpm dev

# 5. Upload test video (1-2 min)
# Visit: http://localhost:3000/despega/a3/analisis-multimodal

# 6. Monitor logs
# Check Vercel dashboard or terminal output

# 7. Verify results appear after 2-5 minutes
```

---

## Deployment Steps

```bash
# 1. Push to GitHub
git add .
git commit -m "Add multimodal analysis"
git push origin main

# 2. Verify in Vercel
# Go to Vercel dashboard → Deployments

# 3. Add environment variables
# Settings → Environment Variables
# Add: OPENAI_API_KEY, REDIS_*, ENCRYPTION_MASTER_KEY

# 4. Trigger redeploy
# Click "Redeploy" or push new commit

# 5. Test in production
# Visit: https://despega.com/despega/a3/analisis-multimodal
```

---

## Performance Tips

- Videos under 5 minutes process fastest
- Process off-peak hours for better rates
- Batch similar types for better insights
- Clear old videos (30-day retention)

---

## Support Resources

- Docs: `/MULTIMODAL_ENTERPRISE_COMPLETE.md`
- API Docs: `/MULTIMODAL_SETUP_GUIDE.md`
- Issues: Check Vercel dashboard logs
- Contact: support@despega.com

---

Happy analyzing! 🚀
