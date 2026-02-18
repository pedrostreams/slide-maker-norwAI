# Deploying to Vercel with Supabase

## Prerequisites
- Vercel account
- Supabase account (free tier works great!)
- GitHub repository with your code
- Gemini API key

## Step 1: Set up Supabase Database

### 1.1 Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Click **New Project**
3. Fill in:
   - **Name**: slide-maker
   - **Database Password**: (save this!)
   - **Region**: Choose closest to your users
4. Wait for project to finish setting up (~2 minutes)

### 1.2 Run Database Schema
1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

### 1.3 Get Your API Keys
1. Go to **Project Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 2: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these three variables:

| Name | Value | Environments |
|------|-------|--------------|
| `GEMINI_API_KEY` | Your Gemini API key from https://aistudio.google.com/apikey | All |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key | All |

4. Click **Save** for each

## Step 3: Deploy

### Push to GitHub
```bash
git add .
git commit -m "Migrate to Supabase"
git push
```

Vercel will automatically deploy!

## Step 4: Test Your Deployment

Visit your deployed app and test:
- ✅ Creating a new presentation
- ✅ Viewing the dashboard
- ✅ Generating slides with AI
- ✅ Review mode with comments
- ✅ Sharing presentations

## Local Development

### Option 1: Use Your Production Database
Add to `.env.local`:
```bash
GEMINI_API_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx
```

### Option 2: Create a Separate Dev Database
1. Create another Supabase project for development
2. Run the schema SQL again
3. Use those credentials in `.env.local`

## Troubleshooting

### "Failed to create deck"
- Check that you ran the SQL schema in Supabase
- Verify environment variables are set correctly
- Check Supabase dashboard → **Table Editor** to see if tables exist

### "Gemini API key not configured"
- Verify `GEMINI_API_KEY` is set in Vercel
- Make sure it's enabled for Production environment

### "No decks showing up"
- Check Supabase → **Table Editor** → **decks** table
- Verify your app can connect (check Vercel function logs)

## Database Management

### View Your Data
Go to Supabase → **Table Editor** to see:
- **decks** - All your slide decks
- **slides** - Individual slide HTML
- **comments** - Review comments
- **deck_configs** - Theme settings per deck
- **share_tokens** - Share links
- **global_settings** - Default design settings

### Backup Your Database
Supabase automatically backs up your database daily. You can also manually export:
1. Go to **Database** → **Backups**
2. Click **Create Backup**

## Why Supabase?

- ✅ **Free tier**: 500MB database, 2GB bandwidth
- ✅ **Proper database**: PostgreSQL with relations
- ✅ **Scalable**: Grows with your app
- ✅ **Fast**: Edge-cached, worldwide CDN
- ✅ **Built-in Auth**: Easy to add user authentication later
- ✅ **Real-time**: Can add live collaboration features

Perfect for serverless deployments! 🚀
