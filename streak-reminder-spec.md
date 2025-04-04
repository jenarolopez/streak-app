## 🔔 Streak Reminder Notification System — Technical Specification

### 🌟 Goal

Notify users via push notification when they are **at risk of losing a streak**, i.e., **24 hours after their last activity** and no new activity has been recorded.

---

### 🧱 Architecture Overview

#### Components

1. **Next.js App (API Routes)**

   - Manages user activity records and computes streaks.
   - Exposes endpoints and logic for checking "at risk" state.

2. **GCP Cloud Scheduler**

   - Runs every hour to trigger streak-checking logic.

3. **GCP Cloud Function (or Pub/Sub)**

   - Entry point for the scheduler; triggers the Next.js API route.

4. **Firebase Cloud Messaging (FCM)**

   - Sends push notifications to mobile/web clients.

---

### 📦 Technologies

| Component       | Tool                       |
| --------------- | -------------------------- |
| Scheduler       | GCP Cloud Scheduler        |
| Notifications   | Firebase Cloud Messaging   |
| Hosting Backend | Vercel / GCP Cloud Run     |
| DB              | Firestore / Postgres / any |
| Auth            | Firebase Auth / JWT        |

---

### 🗂 Folder Structure (Next.js)

```bash
streaks-app/
├── public/
├── src/
│   ├── pages/
│   │   ├── api/
│   │   │   ├── streaks/
│   │   │   │   └── check.ts              # API route triggered by GCP Scheduler
│   │   │   └── notifications/
│   │   │       └── send.ts              # Firebase push logic
│   ├── lib/
│   │   ├── firebase-admin.ts            # Firebase Admin SDK
│   │   ├── streak-utils.ts              # Streak checking logic
│   │   └── db.ts                        # Database connection layer
│   └── components/
│       └── StreakCard.tsx
├── prisma/
│   └── schema.prisma                    # If using Prisma
├── scripts/
│   └── schedule.js                      # GCP Scheduler integration script
├── .env.local
├── package.json
└── tsconfig.json
```

---

### 🧮 Logic Flow

1. **User logs activity**: Store in DB with timestamp.
2. **Cloud Scheduler triggers** hourly.
3. **API Route** (`/api/streaks/check`) checks each user’s last activity.
4. If a user has been **inactive for exactly 24h**, check if:
   - They had an active streak before
   - They're in the `AT_RISK` state
5. If at risk, send push via Firebase.
6. Store notification log to prevent duplicate alerts.

---

### 🧠 Streak Risk Criteria

| Condition                                   | Result        |
| ------------------------------------------- | ------------- |
| No activity in last 24h                     | Check streak  |
| Last streak state was `COMPLETED`           | Streak active |
| Current date - last activity = 1 day        | `AT_RISK`     |
| More than 1 day of inactivity → no reminder | User failed   |

---

### 📬 Firebase Push Example

```ts
const payload = {
  notification: {
    title: "You're at risk of losing your streak!",
    body: "Keep your streak alive. Complete an activity today!",
  },
  token: user.fcmToken,
};
await admin.messaging().send(payload);
```

---

### ⏰ GCP Scheduler Setup

- **Frequency**: Every hour
- **Target**: Cloud Function
- **Payload**: `{ action: "CHECK_STREAKS" }`
- **Function** calls `/api/streaks/check` to trigger logic

---

### ⚙️ Edge Cases & Handling

| Case                        | Handling                         |
| --------------------------- | -------------------------------- |
| User already notified today | Log `notifications_sent` to skip |
| No activity ever            | Do not notify                    |
| Streak already broken       | Do not notify                    |
| Timezones                   | Store all times in UTC           |
| FCM token missing           | Log error, skip notification     |

---

### 🔐 Security

- Cloud Function endpoints protected via API key or IAM
- Firebase Admin credentials stored securely in GCP Secret Manager
- Rate-limit notifications (e.g., one per user per 24h)
