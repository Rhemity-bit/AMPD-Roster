# APD Roster — Vercel Deployment Guide

## What this is
A Next.js app with:
- Public read-only roster view
- Admin login (password protected) to add/edit/delete officers
- All data stored in Vercel KV (persists across all visitors and devices)

---

## Step 1 — Push to GitHub

1. Create a new repository on github.com (call it `apd-roster`)
2. In your terminal, from this folder:

```bash
git init
git add .
git commit -m "Initial APD roster"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/apd-roster.git
git push -u origin main
```

---

## Step 2 — Deploy to Vercel

1. Go to **vercel.com** and sign in (use your GitHub account)
2. Click **"Add New Project"**
3. Import your `apd-roster` GitHub repository
4. Click **Deploy** — Vercel auto-detects Next.js, no config needed

---

## Step 3 — Add Vercel KV (the database)

1. In your Vercel project dashboard, go to the **Storage** tab
2. Click **"Create Database"** → choose **KV**
3. Name it `apd-roster-kv` → click **Create**
4. Click **"Connect Project"** → select your `apd-roster` project
5. Vercel automatically adds the KV environment variables to your project ✅

---

## Step 4 — Set your admin password

1. In Vercel project dashboard → **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `ADMIN_PASSWORD`
   - **Value:** `your-chosen-password` (make it strong!)
   - **Environment:** Production + Preview + Development
3. Click **Save**

---

## Step 5 — Redeploy

After adding the environment variable, trigger a redeploy:
1. Go to the **Deployments** tab
2. Click the three dots on the latest deployment → **Redeploy**

---

## Done! 🎉

Your roster is live. Share the Vercel URL with your server.

- **Public visitors** can view the roster but cannot edit
- **Admins** click "Admin Login" in the top right and enter the password
- All changes save instantly to Vercel KV and are visible to everyone

---

## Updating the roster in future

Any changes you make through the admin panel are saved to the database immediately.
If you want to change the default officer slots or add features, edit the code and push to GitHub — Vercel auto-deploys on every push.

## Changing the admin password

Go to Vercel → Settings → Environment Variables → update `ADMIN_PASSWORD` → Redeploy.
