# Product Context: MemorAI

## Why This Exists

People have too many apps for productivity — separate apps for reminders, lists, notes, calendar, and files. MemorAI consolidates everything into a single AI-powered chat interface. Instead of navigating complex UIs, users just type what they want in natural language.

## How It Should Work (User Flow)

1. User lands on the marketing page, signs up
2. Goes through onboarding (name, timezone, briefing time, notifications)
3. Arrives at dashboard — overview of reminders, lists, events, files
4. Opens AI Chat — the core interaction point
5. Types naturally: "Remind me to buy groceries tomorrow", "Add milk to shopping list", "What did I save about the project?"
6. AI parses intent, executes actions, shows confirmation cards
7. Can also use dedicated pages: Reminders, Lists, Calendar, Memory Vault, Email, Settings

## Key User Experience Goals

- **Chat-First**: The chat interface is the primary way to interact. Everything else is secondary.
- **Instant Understanding**: AI should correctly parse ~95% of natural language requests
- **Visual Feedback**: Action cards in chat confirm what was done
- **Dark Theme**: Purple/violet accents on dark gray backgrounds
- **Mobile Responsive**: Bottom nav on mobile, sidebar on desktop
- **Fast**: Real-time subscriptions, optimistic updates, smooth animations

## Pages

| Page | Purpose |
|------|---------|
| Landing (`/`) | Marketing page for new visitors |
| Auth (`/auth`) | Login/Signup with Google OAuth |
| Onboarding (`/onboarding`) | First-time setup wizard (4 steps) |
| Dashboard (`/dashboard`) | Home — stats, upcoming reminders, quick chat |
| Chat (`/chat`) | AI chat interface (core feature) |
| Reminders (`/reminders`) | Full reminder management |
| Lists (`/lists`) | Smart lists grid |
| List Detail (`/lists/[id]`) | Individual list with drag-and-drop |
| Calendar (`/calendar`) | Calendar view (month/week/day) |
| Memory (`/memory`) | File vault with semantic search |
| Email (`/email`) | Gmail integration with AI classification |
| Settings (`/settings`) | Profile, notifications, integrations, privacy |
