# DevXtra Team Management Dashboard

A modern admin dashboard for managing team members and projects built with Next.js, Supabase, and TypeScript.

## Quick Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   Create `.env` file:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Run database migrations**

   - Go to Supabase Dashboard → SQL Editor
   - Run `supabase/schema.sql` (database tables)
   - Run `supabase/storage-setup.sql` (file upload buckets)

4. **Start development server**
   ```bash
   pnpm dev
   ```

## Features

- ✅ Team member management (CRUD)
- ✅ Project management with team assignments
- ✅ Real-time dashboard with analytics
- ✅ Supabase authentication
- ✅ Admin user management
- ✅ Responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **UI**: Shadcn UI + Tailwind CSS
- **Language**: TypeScript

## Project Structure

```
app/admin/
├── page.tsx           # Dashboard
├── team/              # Team management
│   ├── page.tsx       # List view
│   ├── new/page.tsx   # Create page
│   └── [id]/page.tsx  # Edit page
├── projects/          # Project management
│   └── page.tsx       # Projects with team assignment
└── settings/          # Admin settings
```

## Default Login

After setting up, create your first admin user via Supabase Authentication dashboard.

---

Built with ❤️ by DevXtra Team
