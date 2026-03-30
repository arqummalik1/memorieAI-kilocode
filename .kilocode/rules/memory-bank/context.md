# Active Context: MemorAI

## Current State

**Project Status**: Core app built, typecheck passes, lint passes, build succeeds

MemorAI is a full-stack AI-powered personal memory assistant built on Next.js 16. The entire application is implemented with all major features.

## Recently Completed

- [x] Full project setup with Next.js 16, TypeScript, Tailwind CSS 4
- [x] All dependencies installed (Supabase, Zustand, @dnd-kit, react-big-calendar, etc.)
- [x] Supabase client with lazy initialization
- [x] Gemini API integration (chat, vision, embeddings)
- [x] Groq Whisper voice transcription
- [x] Google Calendar and Gmail API helpers
- [x] Resend email helper
- [x] Web Push notification helper
- [x] Vector search with pgvector
- [x] Zustand stores (auth, chat, reminders, lists, memories, settings)
- [x] Custom hooks (useVoiceInput, useNotifications)
- [x] Shared UI components (Button, Modal, Badge, Skeleton, EmptyState, ConfirmDialog)
- [x] Layout components (AppLayout, Sidebar, MobileNav)
- [x] Chat components (ChatWindow, ChatMessage, ChatInput, TypingIndicator, ActionCard)
- [x] Reminder components (ReminderCard, ReminderForm, ReminderList)
- [x] List components (ListCard, ListItemRow, DraggableList, ListManager)
- [x] Calendar components (CalendarView with dark theme, EventModal)
- [x] Memory components (SemanticSearchBar, FileUploader, FileCard)
- [x] Email components (EmailList placeholder)
- [x] Onboarding components (StepName, StepTimezone, StepBriefing, StepNotifications)
- [x] Landing page with full marketing content
- [x] Auth page with email/password + Google OAuth
- [x] Onboarding page (4-step wizard)
- [x] Dashboard page with stats widgets
- [x] Chat page with AI intent pipeline (server-side API route)
- [x] Reminders page with filtering
- [x] Lists page with grid view
- [x] List detail page with drag-and-drop
- [x] Calendar page with empty state
- [x] Memory vault page with file upload and search
- [x] Email page placeholder
- [x] Settings page (profile, notifications, integrations, AI memory, privacy)
- [x] 404 page
- [x] Service worker for PWA + push notifications
- [x] PWA manifest
- [x] Database schema SQL file
- [x] TypeScript type checking passes
- [x] ESLint passes with zero errors
- [x] Production build succeeds
- [x] Fixed signup "Failed to fetch" error - Proxy-based lazy Supabase client prevents SSR prerender crashes
- [x] Comprehensive error handling across all auth store functions (try/catch, error return types)
- [x] Created /auth/callback route for Google OAuth PKCE code exchange with structured error logging
- [x] Added middleware.ts for Supabase session refresh, route protection, and env var guard
- [x] Created supabaseServer.ts for server-side Supabase client with cookie handling
- [x] Installed @supabase/ssr package
- [x] Auth page surfaces Google sign-in errors, disables button during loading

## File Structure

```
src/
├── app/
│   ├── layout.tsx, page.tsx, providers.tsx, globals.css
│   ├── api/chat/route.ts (Gemini intent pipeline)
│   ├── auth/, auth/callback/ (OAuth callback route)
│   ├── onboarding/, dashboard/, chat/, reminders/
│   ├── lists/, lists/[id]/, calendar/, memory/, email/
│   └── settings/, 404/
├── middleware.ts (Supabase session refresh + route protection)
├── lib/ (supabaseClient, supabaseServer, gemini, groqClient, googleCalendar, gmailClient, resend, webPush, vectorSearch)
├── store/ (useAuthStore, useChatStore, useReminderStore, useListStore, useMemoryStore, useSettingsStore)
├── hooks/ (useVoiceInput, useNotifications)
└── components/ (layout, chat, reminders, lists, calendar, memory, email, shared, onboarding)
```

## Next Steps

1. Set up Supabase project and run `supabase-schema.sql`
2. Configure environment variables in `.env.local`
3. Set up Google OAuth provider in Supabase
4. Enable pgvector extension in Supabase
5. Deploy to Vercel

## Session History

| Date | Changes |
|------|---------|
| Initial | Built complete MemorAI application from PRD |
| 2026-03-30 | Fixed signup "Failed to fetch" and Google OAuth login issues |
| 2026-03-30 | Production-grade auth: lazy client, comprehensive error handling, OAuth callback |
