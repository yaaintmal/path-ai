# User Interaction Tracking & Analytics System

## Overview

A comprehensive, full-stack system for tracking user interactions, detecting suspicious behavior patterns, and identifying potential cheating/gaming. The system logs all essential user actions to MongoDB for later analysis and provides real-time cheating risk assessment.

## Architecture

### Backend (Node.js/Express)

#### Models

- **UserInteraction** (`src/models/UserInteraction.ts`)
  - Stores all user interactions with comprehensive metadata
  - Fields: userId, actionType, context, metadata (IP, userAgent, suspiciousFlags)
  - Indexed for efficient querying by userId and createdAt
  - Collection: `user_interactions`

#### Controllers

- **InteractionController** (`src/controllers/interactionController.ts`)
  - `trackInteraction()` - POST /api/interactions/track
  - `getUserInteractionStats()` - GET /api/interactions/stats?days=7
  - `getCheatingRiskAssessment()` - GET /api/interactions/risk-assessment
  - `getUserInteractionHistory()` - GET /api/interactions/user/:userId
  - `getSuspiciousActivityReport()` - GET /api/interactions/report/suspicious (admin)

#### Utilities

- **Analytics** (`src/utils/analytics.ts`)
  - `detectSuspiciousBehavior()` - Real-time cheating detection
  - `logUserInteraction()` - Log interactions with automatic flag detection
  - `getUserStats()` - Aggregate statistics for time period
  - `assessCheatingRisk()` - Comprehensive risk assessment with evidence

#### Routes

- **InteractionRouter** (`src/routers/interactionRouter.ts`)
  - All routes require authentication
  - Public endpoints: /track, /stats, /risk-assessment, /user/:userId
  - Admin endpoints: /report/suspicious

### Frontend (React/TypeScript)

#### Services

- **AnalyticsTracker** (`src/utils/analytics.ts`)
  - Singleton service for tracking user interactions
  - Automatic batching: flushes every 30s or when queue reaches 50 items
  - Graceful degradation: doesn't break app if backend unavailable
  - Methods: `track()`, `flush()`, `enable()`, `disable()`, `destroy()`

#### Helper Functions

```typescript
trackTopicCompletion(topicTitle, learningPath?, duration?)
trackBookmarkAction(actionType, topicTitle)
trackTopicClick(topicTitle, learningPath?)
trackLearningStart(topicTitle, goal?, learningPath?)
trackLearningComplete(topicTitle, duration, learningPath?)
trackThemeGeneration(topicTitle?)
trackTimerAction(actionType, goal?, duration?, sessionId?)
```

## Tracked Interaction Types

### 1. `learning_start`

- When user begins a learning session
- Context: topic, goal, learning path
- Use: Measure engagement start points

### 2. `learning_complete`

- When user finishes a learning session
- Context: topic, duration (seconds), learning path
- Use: Measure learning time and completion rates

### 3. `topic_click`

- When user clicks on a topic/subtopic
- Context: topic title, learning path
- Use: Detect click spam and browsing behavior

### 4. `topic_complete`

- When user marks a topic as learned/completed
- Context: topic title, learning path
- Use: Track learning progress and detect rapid completions

## Critical Logs

Certain critical events are written to a dedicated daily critical log file for quick inspection. Files are created under `./logs/` with the name `path-ai-critical-YYYY-MM-DD.log`.

Examples of entries written to the critical log:

- `LOGIN:FAIL` — failed login attempts (email + IP)
- `SUSPICIOUS` — suspicious activity flags detected when logging interactions
- `RISK:HIGH` — high risk assessments returned by the cheating detection engine

Use these for quick triage and manual review. Example grep:

```bash
# Failed logins
grep "LOGIN:FAIL" logs/path-ai-critical-$(date +%F).log

# Suspicious activity
grep "SUSPICIOUS" logs/path-ai-critical-$(date +%F).log

# High risk assessments
grep "RISK:HIGH" logs/path-ai-critical-$(date +%F).log
```

### Admin Log Download

Admins can download logs via the admin endpoint (`GET /api/admin/logs`). Prefer using an `Authorization: Bearer <ACCESS_TOKEN>` header. A cookie fallback is supported (`refreshToken` cookie) when an Authorization header is not available.

Examples:

```bash
# Download critical log using Authorization header
curl -H "Authorization: Bearer <ACCESS_TOKEN>" "http://localhost:3000/api/admin/logs?type=critical&date=$(date +%F)" -o path-ai-critical-$(date +%F).log

# Download critical log using refreshToken cookie fallback
curl --cookie "refreshToken=<REFRESH_TOKEN>" "http://localhost:3000/api/admin/logs?type=critical&date=$(date +%F)" -o path-ai-critical-$(date +%F).log
```

### 5. `bookmark_add` / `bookmark_remove`

- When user bookmarks or removes a bookmark
- Context: topic title
- Use: Track resource bookmarking behavior

### 6. `theme_generate`

- When user generates a learning theme via LLM
- Context: topic title (optional)
- Use: Track LLM feature usage

### 7. `timer_start` / `timer_stop`

- When user starts/stops a learning timer session
- Context: goal, duration (for stop), session ID
- Use: Track focus mode usage and session patterns

## Cheating Detection System

### Detection Flags

#### 1. **RAPID_TOPIC_CLICKS**

- **Trigger**: >15 topic clicks within 60 seconds
- **Reason**: Indicates rapid clicking without actual engagement
- **Risk Score**: +2

#### 2. **COMPLETION_WITHOUT_START**

- **Trigger**: topic_complete recorded without prior learning_start
- **Reason**: Possible direct point farming without learning
- **Risk Score**: +3

#### 3. **RAPID_BATCH_COMPLETION**

- **Trigger**: >5 topic completions with <2s between each
- **Reason**: Automating completions or gaming system
- **Risk Score**: +3

#### 4. **UNREALISTIC_SESSION_DURATION**

- **Trigger**: Timer session longer than 12 hours
- **Reason**: Indicates AFk or system gaming
- **Risk Score**: +2

#### 5. **TIMESTAMP_DRIFT**

- **Trigger**: Client timestamp differs from server by >5 minutes
- **Reason**: Clock manipulation or client tampering
- **Risk Score**: +2

### Risk Assessment Levels

| Risk Level | Score | Status     | Recommendation                                       |
| ---------- | ----- | ---------- | ---------------------------------------------------- |
| **Low**    | 0-2   | ✅ OK      | No action needed                                     |
| **Medium** | 3-5   | ⚠️ Monitor | Track account, pattern suggests gaming               |
| **High**   | 6+    | 🚨 Alert   | Manual review recommended, consider point adjustment |

### Risk Evidence Examples

- "High topic completion rate (25) with low learning time (45m)"
- "Excessive topic clicks (150)"
- "Multiple interactions with no learning sessions"
- "Multiple suspicious interactions detected (8)"

## API Endpoints

### Public Endpoints (Authenticated)

#### POST /api/interactions/track

Track a user interaction

```json
{
  "actionType": "topic_complete",
  "context": {
    "topicTitle": "Advanced Algorithms",
    "learningPath": "Computer Science",
    "duration": 1200,
    "timestamp": 1702569600000
  }
}
```

Response: `{ message: "Interaction tracked" }`

#### GET /api/interactions/stats?days=7

Get user statistics for past N days

```json
{
  "totalInteractions": 142,
  "actionBreakdown": {
    "topic_click": 45,
    "learning_start": 12,
    "topic_complete": 8,
    "bookmark_add": 3
  },
  "topicsCompleted": 8,
  "learningTime": 240,
  "suspiciousCount": 0
}
```

#### GET /api/interactions/risk-assessment

Get cheating risk assessment for current user

```json
{
  "riskLevel": "low",
  "evidence": [],
  "recommendation": "No concerns detected."
}
```

#### GET /api/interactions/user/:userId?limit=50&skip=0

Get interaction history (users can only view their own)

```json
{
  "interactions": [...],
  "total": 500,
  "limit": 50,
  "skip": 0
}
```

#### GET /api/interactions/report/suspicious?days=7

Get suspicious activity report (admin endpoint)

```json
{
  "totalSuspiciousInteractions": 12,
  "affectedUsers": 3,
  "report": {
    "userId1": {
      "flagCount": 5,
      "flags": ["RAPID_TOPIC_CLICKS", "RAPID_BATCH_COMPLETION"]
    }
  }
}
```

## Integration Guide

### Backend Integration

1. **Interactions are automatically logged** via `logUserInteraction()` utility
2. **Suspicious patterns detected automatically** before storing
3. **No manual instrumentation needed** - just call the tracking function

Example:

```typescript
import { logUserInteraction } from '#utils/analytics';

await logUserInteraction({
  actionType: 'topic_complete',
  userId: 'user123',
  context: { topicTitle: 'Algorithms' },
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
});
```

### Frontend Integration

1. **Import the tracker**

```typescript
import { tracker, trackTopicCompletion, trackBookmarkAction } from '@/utils/analytics';
```

2. **Use helper functions in components**

```typescript
// When topic is marked complete
trackTopicCompletion('React Hooks', 'Web Development', 600);

// When bookmark is added
trackBookmarkAction('bookmark_add', 'TypeScript Basics');

// When timer starts
trackTimerAction('timer_start', 'Study Goal', undefined, sessionId);
```

3. **Manual tracking for custom actions**

```typescript
tracker.track('custom_action', {
  topicTitle: 'My Topic',
  duration: 300,
});
```

4. **Force flush if needed**

```typescript
// Flush all queued interactions immediately
await tracker.flush();
```

## Data Privacy & Security

- ✅ **Automatic validation** via Zod schemas - prevents injection/overflow
- ✅ **IP address logged** for geographic analysis (optional, can be anonymized)
- ✅ **User agent logged** for device/browser analysis
- ✅ **Timestamps validated** for clock drift detection
- ✅ **String length limits** enforced (max 255 chars for titles)
- ✅ **Duration limits** enforced (max 86400 seconds = 24 hours)

## Performance Considerations

### Frontend

- **Batching**: Interactions queued and sent in batches every 30s
- **Queue limit**: Flushes when queue reaches 50 items
- **Non-blocking**: Tracking uses async/await with error handling
- **Memory**: Gracefully degrades if no auth token (clears queue)

### Backend

- **Indexing**: Compound index on (userId, createdAt) for fast queries
- **No blocking**: Tracking errors don't break main functionality
- **Async processing**: All operations non-blocking

## Monitoring & Analytics

### Dashboard Metrics to Display

```
Weekly Stats:
- Total learning time
- Topics completed
- Learning streak days
- Most common learning time
- Activity heatmap by day/hour

Risk Indicators:
- Risk assessment level
- Recent suspicious flags
- Completion rate vs learning time ratio
- Average session duration
```

### Recommended Checks

```
Daily:
- Review users with HIGH risk level
- Check for >50 interactions with flags
- Monitor for new cheating patterns

Weekly:
- Generate suspicious activity report
- Analyze completion vs learning time correlation
- Update detection thresholds if needed
```

## Future Enhancements

1. **Machine Learning Detection**
   - Pattern clustering for new cheating methods
   - Anomaly detection using user baseline behavior

2. **Behavioral Analysis**
   - Reward adjustment based on risk assessment
   - Temporary account restrictions for high-risk users

3. **Advanced Analytics**
   - Learning effectiveness measurement
   - Topic difficulty estimation
   - Personalized recommendation engine

4. **Admin Dashboard**
   - Real-time suspicious activity alerts
   - User interaction replay/timeline
   - Batch actions (points adjustment, warnings)

5. **GDPR Compliance**
   - Data retention policies (auto-delete after 90 days)
   - Export user data functionality
   - Opt-out tracking option

## Troubleshooting

### Interactions Not Being Tracked

1. Check if user is authenticated (`authToken` in localStorage)
2. Verify backend is running (`/api/interactions/track` accessible)
3. Check browser console for errors
4. Ensure component is calling tracker functions

### High False Positives

1. Review detection thresholds in `analytics.ts`
2. Adjust time windows (currently 60s for rapid actions)
3. Increase flag threshold for risk assessment
4. Add whitelist for bulk operations (batch imports, etc.)

### MongoDB Collection Growing Too Large

1. Implement data retention policy (archive after 90 days)
2. Add TTL index: `db.user_interactions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 })`
3. Consider separate analytics database

---

**Version**: 0.5.3.4  
**Last Updated**: 2025-12-14  
**Status**: Production Ready ✅
