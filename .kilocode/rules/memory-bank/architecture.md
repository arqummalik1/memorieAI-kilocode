# System Patterns: MemorAI

## Architecture Overview

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout + providers
│   ├── providers.tsx             # Auth provider + toast + layout wrapper
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Global styles
│   ├── api/chat/route.ts         # Chat API (Gemini intent pipeline)
│   ├── auth/page.tsx             # Login/Signup
│   ├── onboarding/page.tsx       # Setup wizard
│   ├── dashboard/page.tsx        # Home dashboard
│   ├── chat/page.tsx             # AI chat
│   ├── reminders/page.tsx        # Reminders management
│   ├── lists/page.tsx            # Lists grid
│   ├── lists/[id]/page.tsx       # List detail
│   ├── calendar/page.tsx         # Calendar view
│   ├── memory/page.tsx           # File vault
│   ├── email/page.tsx            # Gmail integration
│   ├── settings/page.tsx         # Settings
│   └── 404/page.tsx              # 404 page
├── lib/                          # Utility libraries
│   ├── supabaseClient.ts         # Supabase init (lazy)
│   ├── gemini.ts                 # Gemini API wrapper
│   ├── groqClient.ts             # Groq Whisper wrapper
│   ├── googleCalendar.ts         # Google Calendar helpers
│   ├── gmailClient.ts            # Gmail API helpers
│   ├── resend.ts                 # Resend email helper
│   ├── webPush.ts                # Push notification helper
│   └── vectorSearch.ts           # pgvector semantic search
├── store/                        # Zustand stores
│   ├── useAuthStore.ts           # Auth + profile state
│   ├── useChatStore.ts           # Chat messages + realtime
│   ├── useReminderStore.ts       # Reminders CRUD
│   ├── useListStore.ts           # Lists + items CRUD
│   ├── useMemoryStore.ts         # Memories + files
│   └── useSettingsStore.ts       # UI settings (sidebar)
├── hooks/                        # Custom hooks
│   ├── useVoiceInput.ts          # Mic + transcription
│   └── useNotifications.ts       # Push subscription
├── components/                   # React components
│   ├── layout/                   # AppLayout, Sidebar, MobileNav
│   ├── chat/                     # ChatWindow, ChatMessage, ChatInput, etc.
│   ├── reminders/                # ReminderCard, ReminderForm, ReminderList
│   ├── lists/                    # ListCard, ListItemRow, DraggableList, ListManager
│   ├── calendar/                 # CalendarView, EventModal
│   ├── memory/                   # FileCard, FileUploader, SemanticSearchBar
│   ├── email/                    # EmailList
│   ├── onboarding/               # StepName, StepTimezone, etc.
│   └── shared/                   # Button, Modal, Badge, Skeleton, etc.
```

## Key Design Patterns

### 1. Client Components by Default
Most components use `"use client"` since the app is heavily interactive. Server Components are used only for the root layout and the API route.

### 2. Zustand for State
All state management uses Zustand stores. Each domain (auth, chat, reminders, lists, memories) has its own store with CRUD operations that call Supabase directly.

### 3. AI Intent Pipeline
The chat page sends messages to `/api/chat` which:
1. Calls Gemini 2.0 Flash with a system prompt defining the JSON schema
2. Parses the JSON response for intent + entities + reply
3. Executes the action (DB insert/update/delete via Supabase)
4. Returns the AI reply to the client

### 4. Protected Routes Pattern
Each page checks `useAuthStore` and redirects to `/auth` if not logged in. The `AppLayout` component conditionally renders sidebar/nav based on auth state.

### 5. Dark Theme
Consistent dark theme with violet-600 as primary accent. Gray-950 background, gray-800/50 for cards, gray-700 for borders.

## Styling Conventions

- Tailwind CSS utility classes
- Component-level styling (no CSS modules)
- Responsive: `sm:`, `md:`, `lg:` breakpoints
- Color palette: violet-600 (primary), gray-800/900/950 (dark), white/gray-300 (text)
