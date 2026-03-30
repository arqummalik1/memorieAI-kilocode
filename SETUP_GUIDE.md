# MemorAI — Complete Free Setup Guide

A step-by-step guide to get MemorAI running with **$0 spent**. Every service used has a free tier sufficient for personal use.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Set Up Supabase (Database + Auth)](#step-1-set-up-supabase)
4. [Step 2: Set Up Google Cloud OAuth](#step-2-set-up-google-cloud-oauth)
5. [Step 3: Configure Google OAuth in Supabase](#step-3-configure-google-oauth-in-supabase)
6. [Step 4: Set Up Google Gemini API (AI)](#step-4-set-up-google-gemini-api)
7. [Step 5: Set Up Groq (Voice Transcription)](#step-5-set-up-groq)
8. [Step 6: Set Up Resend (Email — Optional)](#step-6-set-up-resend)
9. [Step 7: Generate VAPID Keys (Push Notifications — Optional)](#step-7-generate-vapid-keys)
10. [Step 8: Create Environment Variables File](#step-8-create-env-file)
11. [Step 9: Run the Database Schema](#step-9-run-database-schema)
12. [Step 10: Run the App Locally](#step-10-run-locally)
13. [Step 11: Deploy to Vercel (Free)](#step-11-deploy-to-vercel)
14. [Troubleshooting](#troubleshooting)

---

## Overview

| Service | What It Does | Free Tier | Required |
|---------|-------------|-----------|----------|
| **Supabase** | Database, Auth, File Storage | 2 projects, 500MB DB, 50K users | Yes |
| **Google Gemini** | AI chat, vision, embeddings | 60 req/min (free) | Yes |
| **Groq** | Voice transcription | Free tier available | Yes |
| **Google Cloud** | OAuth for Google sign-in, Calendar, Gmail | Free (config only) | Yes |
| **Resend** | Email delivery | 100 emails/day | Optional |
| **Vercel** | Hosting | Unlimited projects | For deployment |

### What You Get for Free

- Full email/password + Google OAuth authentication
- AI-powered chat with Gemini 2.0 Flash
- Voice input transcription
- Google Calendar sync
- Gmail integration
- Semantic search with pgvector
- 1GB file storage
- Push notifications
- Email reminders to friends

---

## Prerequisites

- A Google account (for Gemini, Cloud Console, and Google sign-in)
- A GitHub account (for Vercel deployment)
- [Node.js 18+](https://nodejs.org) and [Bun](https://bun.sh) installed
- A terminal/command line

---

## Step 1: Set Up Supabase

Supabase provides your database, authentication, file storage, and the pgvector extension for semantic search.

### 1.1 Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** and sign in with GitHub
3. No credit card required on the free plan

### 1.2 Create a New Project

1. Click **"New Project"** on the dashboard
2. Fill in:
   - **Name**: `memorai` (or any name)
   - **Database Password**: Generate a strong password — save it somewhere safe
   - **Region**: Pick the one closest to you
3. Click **"Create new project"**
4. Wait 1-2 minutes for provisioning

### 1.3 Get Your API Keys

1. In your project dashboard, go to **Settings → API**
2. Copy these two values — you'll need them later:

```
Project URL:    https://xxxxxxxxxxxx.supabase.co
anon / public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> These map to `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 1.4 Enable the pgvector Extension

1. Go to **Database → Extensions** in the sidebar
2. Search for `vector`
3. Click to enable it (toggle on)
4. This powers the semantic memory search feature

### 1.5 Create the Storage Bucket

1. Go to **Storage** in the sidebar
2. Click **"Create a new bucket"**
3. Set:
   - **Name**: `files`
   - **Public bucket**: ✅ Enable (so uploaded files can be accessed via URL)
4. Click **"Create bucket"**

---

## Step 2: Set Up Google Cloud OAuth

This enables Google sign-in and access to Google Calendar and Gmail APIs. Google Cloud has a generous free tier — no credit card needed for OAuth setup.

### 2.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top → **"New Project"**
3. Name it `memorai` → **"Create"**
4. Select the new project from the dropdown

### 2.2 Configure the OAuth Consent Screen

1. Go to **APIs & Services → OAuth consent screen**
2. Select **"External"** → **"Create"**
3. Fill in the required fields:
   - **App name**: `MemorAI`
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **"Save and Continue"**
5. On the **Scopes** page, click **"Add or Remove Scopes"** and add:
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/gmail.modify`
6. Click **"Save and Continue"**
7. On **Test users**, add your email (since you're in testing mode)
8. Click **"Save and Continue"** → **"Back to Dashboard"**

### 2.3 Create OAuth 2.0 Credentials

1. Go to **APIs & Services → Credentials**
2. Click **"+ Create Credentials" → "OAuth client ID"**
3. Set:
   - **Application type**: `Web application`
   - **Name**: `memorai-web`
4. Under **Authorized redirect URIs**, add **BOTH** of these:

```
https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

> Replace `YOUR_SUPABASE_PROJECT_ID` with your actual Supabase project ID (the subdomain part of your Supabase URL).

5. Click **"Create"**
6. Copy both values:

```
Client ID:     xxxxxxxxxx.apps.googleusercontent.com
Client Secret:  GOCSPX-xxxxxxxxxxxx
```

> These map to `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### 2.4 Enable Required APIs

1. Go to **APIs & Services → Library**
2. Search for and enable each of these:
   - **Google Calendar API** — for calendar sync
   - **Gmail API** — for email integration
3. Click **"Enable"** on each

---

## Step 3: Configure Google OAuth in Supabase

Connect your Google Cloud credentials to Supabase so `signInWithOAuth` works.

1. In your Supabase dashboard, go to **Authentication → Providers**
2. Find **Google** in the list and click to expand it
3. Toggle **"Enable Sign in with Google"** ON
4. Fill in:
   - **Client ID**: Your Google Cloud Client ID from Step 2.3
   - **Client Secret**: Your Google Cloud Client Secret from Step 2.3
5. Click **"Save"**

### Verify the Callback URL

While still in the Google provider settings, you'll see the **Callback URL (for OAuth)** displayed. It should look like:

```
https://xxxxxxxxxxxx.supabase.co/auth/v1/callback
```

Make sure this matches what you added in Google Cloud Console (Step 2.3).

---

## Step 4: Set Up Google Gemini API (AI)

Gemini powers the AI chat, image understanding, and embedding generation. It's free up to 60 requests per minute.

### 4.1 Get Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select your Google Cloud project (the one from Step 2)
5. Copy the API key

```
AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> This maps to `NEXT_PUBLIC_GEMINI_API_KEY`.

---

## Step 5: Set Up Groq (Voice Transcription)

Groq provides ultra-fast Whisper-based voice transcription. Free tier includes a generous rate limit.

### 5.1 Create a Groq Account

1. Go to [console.groq.com](https://console.groq.com/)
2. Sign up (free, no credit card)
3. Go to **API Keys**
4. Click **"Create API Key"**
5. Name it `memorai` and copy the key

```
gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> This maps to `NEXT_PUBLIC_GROQ_API_KEY`.

---

## Step 6: Set Up Resend (Email — Optional)

Resend sends reminder emails to friends and daily briefing emails. Skip this if you don't need email features.

### 6.1 Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up (free: 100 emails/day, 3K/month)
3. Go to **API Keys**
4. Click **"Create API Key"**
5. Name it `memorai` and copy the key

```
re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> This maps to `NEXT_PUBLIC_RESEND_API_KEY`.

### 6.2 Verify a Domain (Optional)

For production, verify your sending domain in Resend. For development, Resend lets you send from `onboarding@resend.dev` without domain verification.

---

## Step 7: Generate VAPID Keys (Push Notifications — Optional)

VAPID keys enable browser push notifications. This is free and requires no external service.

### 7.1 Generate Keys

Run this command in your terminal:

```bash
npx web-push generate-vapid-keys
```

You'll get output like:

```
=======================================
Public Key:
BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U

Private Key:
UUxw4j8bVbLylkMXYZTqBqZ5qWxP8dMNYlY_4lBzGBs
=======================================
```

Copy both values:

- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` = Public Key
- `VAPID_PRIVATE_KEY` = Private Key

---

## Step 8: Create Environment Variables File

### 8.1 Create `.env.local`

In the root of the project, create a file called `.env.local`:

```bash
cp .env.example .env.local  # if one exists
# or create it manually:
touch .env.local
```

### 8.2 Fill In Your Values

Paste this template and replace the placeholder values with your actual keys:

```env
# ===== REQUIRED =====

# Supabase (Step 1.3)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Gemini AI (Step 4.1)
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key

# Groq Voice Transcription (Step 5.1)
NEXT_PUBLIC_GROQ_API_KEY=your-groq-api-key

# Google OAuth (Step 2.3) — Client ID only; Client Secret goes in Supabase dashboard
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# ===== OPTIONAL =====

# Resend Email (Step 6.1) — leave blank to disable email features
NEXT_PUBLIC_RESEND_API_KEY=

# Web Push Notifications (Step 7.1) — leave blank to disable push notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

> **Note**: `GOOGLE_CLIENT_SECRET` is NOT in this file. It was already entered in the Supabase dashboard in Step 3.

### 8.3 Verify

Your `.env.local` should have **at minimum** 5 values filled in. The app will not start without them:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `NEXT_PUBLIC_GEMINI_API_KEY`
4. `NEXT_PUBLIC_GROQ_API_KEY`
5. `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

---

## Step 9: Run the Database Schema

The app needs specific tables, functions, and policies in your Supabase database.

### 9.1 Open the SQL Editor

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**

### 9.2 Run the Schema

Copy the entire contents of `supabase-schema.sql` from the project root and paste it into the SQL editor. Click **"Run"**.

This creates:
- 11 tables (profiles, reminders, lists, list_items, memories, files, chat_messages, calendar_connections, email_connections, friend_reminders, daily_briefings)
- Row Level Security policies on all tables
- The `match_memories` function for vector search
- The `files` storage bucket

### 9.3 Verify

Go to **Database → Tables** and confirm you see all 11 tables listed.

---

## Step 10: Run the App Locally

### 10.1 Install Dependencies

```bash
bun install
```

### 10.2 Start the Development Server

```bash
bun dev
```

> **Important**: The development server is automatically started by the sandbox. Do NOT run `bun dev` manually in production.

### 10.3 Open the App

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 10.4 Test the Auth Flow

1. Click **"Sign Up"** and create an account with email/password
2. You should be redirected to the onboarding wizard
3. Complete onboarding and verify the dashboard loads
4. Sign out and test **"Continue with Google"**
5. You should see Google's consent screen and be redirected back

### 10.5 Test the Core Features

| Feature | How to Test |
|---------|------------|
| Chat | Go to `/chat`, type a message — Gemini should respond |
| Voice Input | Click the mic icon in chat — speak and verify transcription |
| Reminders | Go to `/reminders`, create a reminder |
| Lists | Go to `/lists`, create a list, add items |
| Calendar | Go to `/calendar` — if Google OAuth is set up, events should sync |
| Memory | Go to `/memory`, upload a file, try semantic search |

---

## Step 11: Deploy to Vercel (Free)

Vercel's free tier includes unlimited personal deployments and 100GB bandwidth per month.

### 11.1 Push to GitHub

```bash
git add -A
git commit -m "Initial commit"
git push origin main
```

### 11.2 Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import your MemorAI repository
5. Vercel auto-detects Next.js — click **"Deploy"** (don't deploy yet)

### 11.3 Add Environment Variables

Before deploying, click **"Environment Variables"** and add all the variables from your `.env.local`:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` |
| `NEXT_PUBLIC_GEMINI_API_KEY` | `AIzaSy...` |
| `NEXT_PUBLIC_GROQ_API_KEY` | `gsk_...` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `xxxxx.apps.googleusercontent.com` |
| `NEXT_PUBLIC_RESEND_API_KEY` | (leave blank if not using) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | (leave blank if not using) |
| `VAPID_PRIVATE_KEY` | (leave blank if not using) |

### 11.4 Update Google Cloud OAuth Redirect URI

1. Go back to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 client
3. Add your Vercel domain as an authorized redirect URI:

```
https://your-app.vercel.app/auth/callback
```

4. Also add the Supabase callback (if not already there):
```
https://your-project-id.supabase.co/auth/v1/callback
```

5. Click **"Save"**

### 11.5 Deploy

Click **"Deploy"** in Vercel. The build takes ~30 seconds.

---

## Troubleshooting

### "Failed to fetch" on signup/login

**Cause**: Supabase environment variables are missing or incorrect.

**Fix**:
1. Check `.env.local` has valid `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Restart the dev server after changing `.env.local`
3. Verify the Supabase project is not paused (free projects pause after 1 week of inactivity)

### Google OAuth fails with "Could not authenticate user"

**Causes & Fixes**:

1. **Missing redirect URI**: In Google Cloud Console → Credentials, ensure `https://YOUR_PROJECT.supabase.co/auth/v1/callback` is added as an authorized redirect URI
2. **Missing client credentials in Supabase**: In Supabase → Authentication → Providers → Google, verify Client ID and Client Secret are correct
3. **Consent screen not configured**: Complete the OAuth consent screen setup in Google Cloud Console
4. **Test user not added**: In the OAuth consent screen, add your email as a test user

### Chat returns no response

**Cause**: Gemini API key is invalid or has exceeded the free quota.

**Fix**:
1. Verify `NEXT_PUBLIC_GEMINI_API_KEY` is correct
2. Check [Google AI Studio](https://aistudio.google.com/apikey) for quota limits
3. Ensure the API key has access to the Generative Language API

### Voice input doesn't work

**Cause**: Groq API key is missing or browser doesn't support microphone access.

**Fix**:
1. Verify `NEXT_PUBLIC_GROQ_API_KEY` starts with `gsk_`
2. Allow microphone access in the browser when prompted
3. Use HTTPS in production (microphone requires secure context)

### Build fails with "supabaseUrl is required"

**Cause**: Environment variables not set during build.

**Fix**: Ensure all required env vars are in `.env.local` (local) or Vercel dashboard (deployed). The app uses lazy initialization so this shouldn't happen unless the env vars are truly missing at runtime.

### Database errors after fresh setup

**Cause**: The database schema hasn't been run.

**Fix**: Run `supabase-schema.sql` in the Supabase SQL Editor (Step 9).

### Free Supabase project paused

Supabase pauses free projects after 7 days of inactivity. Go to your Supabase dashboard and click **"Restore project"** to unpause it.

---

## Free Tier Limits Summary

| Service | Free Limit | Resets |
|---------|-----------|--------|
| Supabase | 500MB database, 1GB storage, 50K users | Monthly |
| Gemini | 60 requests/minute | Per minute |
| Groq | Rate-limited but generous | Per minute |
| Resend | 100 emails/day, 3K/month | Daily/Monthly |
| Vercel | 100GB bandwidth, unlimited deploys | Monthly |
| Google Cloud OAuth | Unlimited (config only) | N/A |
| pgvector | Included in Supabase free tier | N/A |

These limits are more than sufficient for personal use. For production with many users, you would need to upgrade to paid tiers.
