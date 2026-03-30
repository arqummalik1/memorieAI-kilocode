# Project Brief: MemorAI

## Purpose

MemorAI is an AI-powered personal memory assistant — a full-featured productivity app that lets users manage reminders, lists, calendar events, files, and memories through a single chat-based interface. It's a clone of Memorae.ai built on a 100% free tech stack.

## Target Users

- Busy individuals who want to manage tasks, reminders, and memory without switching apps
- People who prefer natural language interaction over traditional UI
- Users who want AI-powered organization and retrieval

## Core Use Case

Users interact with MemorAI primarily through a chat interface:
1. Type or speak naturally ("Remind me to call mom tomorrow at 6pm")
2. AI parses intent and extracts entities
3. Actions are executed (reminders set, lists created, calendar updated)
4. Everything is searchable via semantic vector search

## Key Requirements

### Must Have
- Chat-based natural language UI (core interaction model)
- AI intent parsing via Google Gemini 2.0 Flash
- Reminders with recurrence, snooze, friend reminders
- Smart lists with drag-and-drop reordering
- Google Calendar integration
- Gmail integration with AI classification
- File vault with AI-powered semantic search
- Voice input via Groq Whisper
- Image analysis via Gemini Vision
- Push notifications via Web Push API
- Daily briefing generation
- PWA support for mobile

### Tech Stack
- Next.js 16 + React 19 + TypeScript (strict mode)
- Tailwind CSS 4 for styling
- Supabase (DB, Auth, Storage, pgvector)
- Google Gemini 2.0 Flash for AI
- Groq Whisper for voice transcription
- Zustand for state management
- @dnd-kit for drag and drop
- react-big-calendar for calendar UI
- lucide-react for icons

## Constraints

- Entire stack must be free tier
- Dark theme with violet/purple accents
- Mobile-first responsive design
- PWA-capable (installable on mobile)
