# Technical Context: MemorAI

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.9.x | Type-safe JavaScript |
| Tailwind CSS | 4.x | Utility-first CSS |
| Bun | Latest | Package manager & runtime |
| Supabase | 2.x | DB, Auth, Storage, pgvector |
| Zustand | 5.x | Client state management |
| @dnd-kit | 6.x | Drag and drop |
| react-big-calendar | 1.x | Calendar UI |
| lucide-react | 1.x | Icons |
| react-hot-toast | 2.x | Toast notifications |

## Development Commands

```bash
bun install        # Install dependencies
bun dev            # Start dev server (http://localhost:3000)
bun build          # Production build
bun start          # Start production server
bun lint           # Run ESLint
bun typecheck      # Run TypeScript type checking
```

## Environment Variables

```bash
# Required for the app to function
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Required for AI features
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-key
NEXT_PUBLIC_GROQ_API_KEY=your-groq-key

# Required for Google integrations
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional
NEXT_PUBLIC_RESEND_API_KEY=your-resend-key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

## Database Schema

Run `supabase-schema.sql` in the Supabase SQL Editor. Key tables:
- `profiles` - User preferences, timezone, briefing settings
- `reminders` - All reminders with recurrence, snooze, friend reminders
- `lists` + `list_items` - Smart lists with drag-and-drop ordering
- `memories` - Long-term memory with vector embeddings (pgvector)
- `files` - File vault with AI summaries and embeddings
- `chat_messages` - Chat history for context
- `calendar_connections` + `email_connections` - OAuth tokens
- `friend_reminders` - Reminders sent to others via email
- `daily_briefings` - Log of generated daily briefings

## Deployment

- Frontend: Vercel (free tier)
- Backend: Supabase (free tier)
- Edge Functions: Supabase Edge Functions for cron jobs
- Push: Web Push API with VAPID keys
