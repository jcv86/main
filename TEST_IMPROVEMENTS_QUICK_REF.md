# Test Flow Improvements - Quick Reference

## Feature Quick Access

### 1. Retry Logic
**Import**: `import { TestRetrySystem } from '@/lib/test-retry-system'`
**Main Function**: `saveTestResultWithRetry(email, testType, results, duration)`
**Table**: `test_save_retries`

### 2. Test Export
**Component**: `<TestExportComponent userEmail={...} testType={...} />`
**Formats**: CSV, PDF, JSON
**Endpoint**: `POST /api/export-test-result`
**Table**: `test_export_logs`

### 3. Completion Monitoring
**Component**: `<TestCompletionMonitor testType={...} />`
**Metrics**: Average, Median, Min, Max, P95
**Tables**: `test_completion_metrics`, `test_analytics_summary`
**API**: `GET /api/test-metrics/[testType]`

### 4. Progress Snapshots
**Component**: `<TestResumePrompt userEmail={...} testType={...} />`
**Import**: `import { TestProgressSystem } from '@/lib/test-progress-system'`
**Function**: `saveProgressSnapshot(...)`
**Table**: `test_progress_snapshots`
**Expiry**: 7 days

### 5. A/B Testing
**Import**: `import { ABTestSystem } from '@/lib/ab-test-system'`
**Create Variant**: `createABVariant(testType, questionId, variantName, text)`
**Get Variant**: `getABVariant(testType, questionId, userEmail)`
**Log Result**: `logABTestResult(...)`
**Tables**: `ab_test_question_variants`, `ab_test_results_tracking`

### 6. Analytics Dashboard
**Component**: `<AdminAnalyticsDashboard />`
**APIs**: 
  - `GET /api/admin/test-analytics`
  - `GET /api/admin/retry-metrics`
  - `GET /api/admin/export-metrics`

---

## Database Tables Reference

| Table | Purpose | Key Columns | TTL |
|-------|---------|------------|-----|
| `test_save_retries` | Retry tracking | user_email, test_type, status | N/A |
| `test_completion_metrics` | Duration data | duration_minutes, completed_at | N/A |
| `test_progress_snapshots` | Progress recovery | current_question, answers_so_far | 7 days |
| `ab_test_question_variants` | A/B test variants | test_type, variant_name, traffic_percentage | N/A |
| `ab_test_results_tracking` | A/B results | response_time_ms, response_quality | N/A |
| `test_analytics_summary` | Aggregated metrics | avg_duration_minutes, completion_rate | N/A |
| `test_export_logs` | Export tracking | export_format, file_size_bytes | 7 days |

---

## Common Tasks

### Log Test Completion
```typescript
import { TestMetricsSystem } from '@/lib/test-metrics-system'
await TestMetricsSystem.logTestCompletion(email, 'MBTI', 15.5, 25)
```

### Get Completion Stats
```typescript
const stats = await TestMetricsSystem.getCompletionTimeStats('MBTI')
// Returns: { average, median, min, max, p95, sampleSize }
```

### Save Progress on Close
```typescript
import { TestProgressSystem } from '@/lib/test-progress-system'
await TestProgressSystem.saveProgressSnapshot(
  email, testType, sessionId, currentQuestion, total, answers, duration
)
```

### Load Progress for Resume
```typescript
const snapshot = await TestProgressSystem.loadProgressSnapshot(email, testType)
```

### Create A/B Variant
```typescript
await ABTestSystem.createABVariant('MBTI', 1, 'new_wording', 'text...', {}, 50)
```

### Get User Variant
```typescript
const variant = await ABTestSystem.getABVariant('MBTI', 1, email)
// variant.variantName, variant.variantText
```

---

## API Endpoints Summary

### Exports
- `POST /api/export-test-result` - Download test results

### Metrics
- `GET /api/test-metrics/[testType]` - Completion statistics

### Progress
- `GET /api/test-progress/[testType]?userEmail=X` - Load snapshot
- `POST /api/test-progress/[testType]` - Save snapshot
- `DELETE /api/test-progress/[testType]?sessionId=X` - Clear snapshot

### Admin
- `GET /api/admin/test-analytics` - Test metrics
- `GET /api/admin/retry-metrics` - Retry statistics
- `GET /api/admin/export-metrics` - Export counts

### Background
- `POST /api/schedule-test-retry` - Schedule retry

---

## Important Notes

### Retry System
- Max 3 attempts with exponential backoff (1s, 2s, 4s)
- Jitter prevents thundering herd
- Fallback to localStorage
- Background retry available

### Progress Snapshots
- Auto-expire after 7 days
- Cleanup runs on load
- One active snapshot per test per user
- Hash-based deterministic (can resume from any device)

### A/B Testing
- User assignment is deterministic (same user = same variant always)
- Based on email hash
- Traffic splitting is configurable
- Results tracked with response metrics

### Analytics
- Dashboard auto-refreshes every 5 minutes
- P95 is 95th percentile (when 95% complete)
- Data aggregated in summary table
- Manual refresh available

### Export Files
- All formats available: CSV, PDF, JSON
- 7-day expiration
- File size tracked
- Download count logged

---

## Monitoring Alerts

Set up alerts for:
1. **Retry Success Rate < 90%** - Something wrong with saves
2. **Completion Rate < 70%** - Test too difficult/long
3. **Average Duration > 30min** - Consider optimization
4. **No snapshots cleaned up** - Check cleanup process
5. **Export errors > 5/day** - Verify service health

---

## Performance Targets

- Retry API: <100ms
- Export generation: <2s
- Metrics query: <500ms
- Progress save: <100ms
- Dashboard load: <1s
- A/B assignment: <10ms (cached)

---

## Troubleshooting Commands

```typescript
// Check retry history
SELECT * FROM test_save_retries WHERE user_email = 'user@test.com'

// View active snapshots
SELECT * FROM test_progress_snapshots 
WHERE expires_at > NOW() AND user_email = 'user@test.com'

// Check exports
SELECT export_format, COUNT(*) FROM test_export_logs GROUP BY export_format

// Review A/B results
SELECT variant_name, AVG(response_time_ms), AVG(response_quality) 
FROM ab_test_results_tracking GROUP BY variant_name

// Get latest analytics
SELECT * FROM test_analytics_summary ORDER BY last_updated DESC
```

---

## Deployment Checklist

- [ ] Database migration executed
- [ ] All 7 new tables created
- [ ] API routes deployed
- [ ] Components imported in pages
- [ ] Environment variables set
- [ ] Admin dashboard accessible
- [ ] Retry logic tested (kill network)
- [ ] Export all 3 formats working
- [ ] Dashboard metrics visible
- [ ] Progress snapshots resuming

---

For more details, see:
- `TEST_IMPROVEMENTS_GUIDE.md` - Detailed documentation
- `TEST_IMPROVEMENTS_SUMMARY.md` - Project overview
