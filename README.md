# 🚀 Supabase Demo

A comprehensive Next.js demo showcasing Supabase features including authentication, database operations, real-time subscriptions, and **SERVICE_ROLE** usage.

## 🌟 Features

- **🔐 Authentication**: Email/password and OAuth (Google) authentication
- **📊 Database**: PostgreSQL with Row Level Security (RLS)
- **⚡ Real-time**: Live updates using WebSocket subscriptions
- **🔑 SERVICE_ROLE**: Admin operations that bypass RLS (server-side only)
- **📱 Modern UI**: Clean, responsive interface with TypeScript

## 🚨 Important: SERVICE_ROLE Security

The `SERVICE_ROLE` key is a **powerful administrative key** that:

- ✅ **Bypasses ALL Row Level Security (RLS) policies**
- ✅ **Can read, insert, update, delete ANY data in your database**
- ❌ **Should NEVER be exposed to client-side code**
- ❌ **Should NEVER be stored in public environment variables**
- ✅ **Should ONLY be used in server-side API routes or backend services**

### Safe Usage Examples:
```typescript
// ✅ GOOD - Server-side API route
// pages/api/admin/stats.ts
import { supabaseAdmin } from '../../../lib/supabase'

export default async function handler(req, res) {
  // This runs on the server and is safe
  const { data } = await supabaseAdmin.from('users').select('*')
  res.json(data)
}

// ❌ BAD - Client-side component
// components/UserList.tsx
import { supabaseAdmin } from '../lib/supabase'

export default function UserList() {
  // This exposes SERVICE_ROLE to the browser - NEVER DO THIS!
  const { data } = await supabaseAdmin.from('users').select('*')
  return <div>{data}</div>
}
```

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd supabase-demo
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be set up

### 3. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL to create tables, RLS policies, and triggers

### 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Find these values in your Supabase dashboard:
   - **Project URL**: Settings → API → Project URL
   - **Anon Key**: Settings → API → Project API keys → anon public
   - **Service Role Key**: Settings → API → Project API keys → service_role

### 5. Enable Authentication Providers (Optional)

For Google OAuth:
1. Go to Authentication → Providers in your Supabase dashboard
2. Enable Google provider
3. Add your Google OAuth credentials

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## 📁 Project Structure

```
supabase-demo/
├── components/
│   ├── AuthDemo.tsx          # Authentication demo
│   ├── TodoDemo.tsx          # CRUD operations with RLS
│   ├── RealtimeDemo.tsx      # Real-time subscriptions
│   └── ServiceRoleDemo.tsx   # SERVICE_ROLE admin operations
├── lib/
│   ├── supabase.ts           # Supabase client configuration
│   └── database.types.ts     # TypeScript database types
├── pages/
│   ├── api/
│   │   └── admin/
│   │       ├── stats.ts      # Admin statistics (SERVICE_ROLE)
│   │       └── cleanup.ts    # Admin cleanup (SERVICE_ROLE)
│   ├── _app.tsx              # Next.js app wrapper
│   └── index.tsx             # Main demo page
├── styles/
│   └── globals.css           # Global styles
├── supabase/
│   └── schema.sql            # Database schema and RLS policies
├── .env.local.example        # Environment variables template
└── README.md                 # This file
```

## 🔧 Key Components

### Authentication (`AuthDemo.tsx`)
- Email/password authentication
- Google OAuth integration
- User session management

### Database Operations (`TodoDemo.tsx`)
- Create, read, update, delete todos
- Row Level Security ensures users only see their own data
- Real-time updates when todos change

### Real-time Features (`RealtimeDemo.tsx`)
- WebSocket subscriptions to database changes
- Live message updates across all connected clients
- Automatic UI updates when data changes

### Admin Operations (`ServiceRoleDemo.tsx`)
- **⚠️ SERVER-SIDE ONLY** operations using SERVICE_ROLE
- Admin statistics that bypass RLS
- Bulk operations across all user data
- Security warnings and best practices

## 🛡️ Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Users can only access their own todos
- Users can only modify their own profile
- Messages are visible to all authenticated users

### Authentication
- Secure JWT tokens
- Session management
- OAuth integration
- Protected API routes

### SERVICE_ROLE Best Practices
- Never exposed to client-side code
- Only used in server-side API routes
- Proper error handling and logging
- Clear security warnings in UI

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially SERVICE_ROLE security)
5. Submit a pull request

## 📚 Learn More

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## ⚠️ Security Reminder

**Never commit your `.env.local` file or expose your SERVICE_ROLE key!**

Add to `.gitignore`:
```
.env.local
.env.*.local
```

---

Created by @Aaysha82 | Powered by Supabase + Next.js
