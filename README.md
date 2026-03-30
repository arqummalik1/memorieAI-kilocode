<div align="center">

# MemorAI

### The memory layer above all your apps

An AI-powered personal memory assistant that lets you manage reminders, lists, calendar events, files, and memories through a single chat-based interface.

[Next.js](https://nextjs.org) &bull; [Supabase](https://supabase.com) &bull; [Google Gemini](https://ai.google.dev) &bull; [TypeScript](https://typescriptlang.org)

[Features](#features) &bull; [Quick Start](#quick-start) &bull; [Setup Guide](#setup-guide) &bull; [Architecture](#architecture) &bull; [Deployment](#deploy)

</div>

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Chat** | Natural language interface powered by Gemini 2.0 Flash. Type or speak to manage everything. |
| **Reminders** | Set reminders by chatting naturally. Supports recurrence, snooze, and friend reminders. |
| **Smart Lists** | Create, manage, and share lists with drag-and-drop reordering. |
| **Calendar Sync** | Connect Google Calendar. View events and create new ones from chat. |
| **Gmail Integration** | AI-classified email inbox with priority detection. |
| **Memory Vault** | Upload files, photos, and notes. Semantic search finds anything instantly. |
| **Voice Input** | Speak to MemorAI using Groq Whisper transcription. |
| **Image Analysis** | Upload images for AI-powered understanding via Gemini Vision. |
| **Push Notifications** | Browser push notifications for reminders and daily briefings. |
| **Daily Briefings** | AI-generated morning summary of your day. |
| **PWA Support** | Installable on mobile. Works like a native app. |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Server-rendered React with API routes |
| **Language** | TypeScript 5.9 (strict) | Type safety across the entire codebase |
| **UI** | React 19 + Tailwind CSS 4 | Component library with utility-first styling |
| **State** | Zustand 5 | Lightweight global state management |
| **Database** | Supabase (PostgreSQL) | Auth, database, file storage, pgvector |
| **AI** | Google Gemini 2.0 Flash | Chat, intent parsing, vision, embeddings |
| **Voice** | Groq Whisper Large v3 | Fast, accurate voice transcription |
| **DnD** | @dnd-kit | Drag-and-drop for lists |
| **Calendar** | react-big-calendar | Calendar UI with dark theme |
| **Icons** | lucide-react | Consistent, tree-shakeable icon set |
| **Email** | Resend | Transactional email delivery |
| **Push** | Web Push API (VAPID) | Browser push notifications |

---

## Quick Start

### Prerequisites

- **Node.js** 18+ — [install](https://nodejs.org)
- **Bun** — [install](https://bun.sh)
- Accounts on [Supabase](https://supabase.com), [Google AI Studio](https://aistudio.google.com), and [Groq](https://groq.com) (all free)

### Install & Run

```bash
# Clone the repository
git clone https://github.com/arqummalik1/memorieAI-kilocode.git
cd memorieAI-kilocode

# Install dependencies
bun install

# Copy the env template and fill in your keys (see Setup Guide below)
cp .env.example .env.local

# Start the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Setup Guide

All services below have **free tiers** — total cost is **$0** for personal use.

### 1. Supabase (Database + Auth)

Supabase provides your database, authentication, file storage, and pgvector for semantic search.

1. Create a project at [supabase.com](https://supabase.com) (no credit card)
2. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon / public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to **Database → Extensions** and enable `vector` (pgvector)
4. Go to **Storage**, create a bucket named `files` with **Public** enabled
5. Open **SQL Editor**, paste and run the contents of `supabase-schema.sql`

### 2. Google Cloud OAuth

Required for Google sign-in, Calendar, and Gmail integration.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project named `memorai`
3. Go to **APIs & Services → OAuth consent screen**:
   - Select **External** and fill in the app name and email
   - Add scopes: `email`, `profile`, `calendar`, `gmail.modify`
   - Add your email as a test user
4. Go to **APIs & Services → Credentials**:
   - Create **OAuth client ID** (Web application)
   - Add redirect URIs:
     ```
     https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
   - Copy `Client ID` → `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - Copy `Client Secret` → (used in Step 3)
5. Go to **APIs & Services → Library** and enable:
   - Google Calendar API
   - Gmail API

### 3. Configure Google Provider in Supabase

1. In Supabase, go to **Authentication → Providers → Google**
2. Toggle **Enable** and enter:
   - Client ID from Step 2
   - Client Secret from Step 2
3. Click **Save**

### 4. Google Gemini (AI)

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **Create API Key**
3. Copy the key → `NEXT_PUBLIC_GEMINI_API_KEY`

### 5. Groq (Voice Transcription)

1. Go to [console.groq.com](https://console.groq.com/)
2. Create an API key
3. Copy the key → `NEXT_PUBLIC_GROQ_API_KEY`

### 6. Resend (Optional — Email)

For friend reminders and daily briefing emails.

1. Go to [resend.com](https://resend.com) (free: 100 emails/day)
2. Create an API key
3. Copy the key → `NEXT_PUBLIC_RESEND_API_KEY`

### 7. VAPID Keys (Optional — Push Notifications)

```bash
npx web-push generate-vapid-keys
```

- Public Key → `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- Private Key → `VAPID_PRIVATE_KEY`

### 8. Environment Variables

Your `.env.local` should look like this (values filled in):

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...
NEXT_PUBLIC_GROQ_API_KEY=gsk_...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com

# Optional
NEXT_PUBLIC_RESEND_API_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

> See [SETUP_GUIDE.md](SETUP_GUIDE.md) for the detailed step-by-step walkthrough.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server with hot reload |
| `bun run build` | Create production build |
| `bun start` | Start production server |
| `bun lint` | Run ESLint |
| `bun typecheck` | Run TypeScript type checking |

---

## Architecture

### Project Structure

```
src/
├── app/
│   ├── layout.tsx              Root layout (providers, fonts)
│   ├── page.tsx                Landing page
│   ├── providers.tsx           Auth provider + toaster
│   ├── globals.css             Tailwind + custom styles
│   ├── api/
│   │   └── chat/route.ts       AI intent pipeline (Gemini)
│   ├── auth/
│   │   ├── page.tsx            Login/signup with email + Google
│   │   └── callback/route.ts   OAuth callback handler
│   ├── dashboard/              Stats overview
│   ├── chat/                   AI chat interface
│   ├── reminders/              Reminder management
│   ├── lists/                  Smart lists
│   │   └── [id]/               List detail with drag-and-drop
│   ├── calendar/               Google Calendar view
│   ├── memory/                 File vault + semantic search
│   ├── email/                  Gmail inbox
│   ├── settings/               User settings
│   ├── onboarding/             First-time setup wizard
│   └── 404/                    Not found page
├── proxy.ts                    Auth middleware (session refresh)
├── lib/
│   ├── supabaseClient.ts       Browser Supabase client (lazy)
│   ├── supabaseServer.ts       Server Supabase client (cookies)
│   ├── gemini.ts               Gemini AI integration
│   ├── groqClient.ts           Whisper voice transcription
│   ├── googleCalendar.ts       Calendar API helper
│   ├── gmailClient.ts          Gmail API helper
│   ├── resend.ts               Email delivery
│   ├── webPush.ts              Push notifications
│   └── vectorSearch.ts         pgvector similarity search
├── store/
│   ├── useAuthStore.ts         Authentication state
│   ├── useChatStore.ts         Chat messages + AI responses
│   ├── useReminderStore.ts     Reminder CRUD
│   ├── useListStore.ts         Lists + items
│   ├── useMemoryStore.ts       File upload + search
│   └── useSettingsStore.ts     User preferences
├── hooks/
│   ├── useVoiceInput.ts        Microphone + transcription
│   └── useNotifications.ts     Push notification subscription
└── components/
    ├── layout/                 AppLayout, Sidebar, MobileNav
    ├── chat/                   ChatWindow, ChatMessage, ChatInput
    ├── reminders/              ReminderCard, ReminderForm
    ├── lists/                  ListCard, DraggableList
    ├── calendar/               CalendarView, EventModal
    ├── memory/                 SemanticSearchBar, FileUploader
    ├── email/                  EmailList
    ├── shared/                 Button, Modal, Badge, Skeleton
    └── onboarding/             Step components
```

### Database Schema

11 tables with Row Level Security on all of them:

| Table | Purpose |
|-------|---------|
| `profiles` | User settings, timezone, briefing preferences |
| `reminders` | Reminders with recurrence, snooze, friend reminders |
| `lists` | Named lists with colors and icons |
| `list_items` | Items within lists, with position ordering |
| `memories` | Long-term memory with vector embeddings |
| `files` | File vault with AI summaries and embeddings |
| `chat_messages` | Chat history with intent tracking |
| `calendar_connections` | Google Calendar OAuth tokens |
| `email_connections` | Gmail OAuth tokens |
| `friend_reminders` | Reminders sent to other people |
| `daily_briefings` | Generated briefing log |

Run `supabase-schema.sql` in the Supabase SQL Editor to create everything.

### AI Intent Pipeline

The chat API route (`/api/chat`) processes messages through a multi-step pipeline:

```
User message
    ↓
Gemini 2.0 Flash (intent classification)
    ↓
Action routing (reminder | list | calendar | memory | chat)
    ↓
Entity extraction (dates, titles, emails, etc.)
    ↓
Database operation via Supabase
    ↓
Response generation (Gemini)
    ↓
Streaming response to client
```

---

## Deploy

### Vercel (Recommended — Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add all environment variables in the Vercel dashboard
4. Deploy

After deploying, update your Google Cloud OAuth redirect URIs to include your Vercel domain:

```
https://your-app.vercel.app/auth/callback
```

### Other Platforms

The app is a standard Next.js application and can be deployed anywhere that supports Node.js:

- **Railway** — free tier available
- **Render** — free tier available
- **Self-hosted** — `bun run build && bun start`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Failed to fetch` on signup | Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` |
| Google OAuth fails | Verify redirect URIs in Google Cloud Console match Supabase callback URL |
| Chat returns empty | Verify `NEXT_PUBLIC_GEMINI_API_KEY` is valid |
| Voice input silent | Allow microphone access; ensure HTTPS in production |
| Build fails | Run `bun typecheck` and `bun lint` to find errors |
| Supabase project paused | Free projects pause after 7 days — restore from dashboard |

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for the complete troubleshooting section.

---

## Free Tier Limits

| Service | Free Limit |
|---------|-----------|
| Supabase | 500MB database, 1GB storage, 50K users |
| Gemini | 60 requests/minute |
| Groq | Generous rate limit |
| Resend | 100 emails/day, 3K/month |
| Vercel | 100GB bandwidth, unlimited deploys |

More than sufficient for personal use.

---

## License

MIT
