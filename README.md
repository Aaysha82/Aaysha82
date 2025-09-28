# Supabase CRUD Application

A modern, full-featured CRUD (Create, Read, Update, Delete) application built with React, Vite, Tailwind CSS, and Supabase. This application demonstrates all fundamental database operations with a clean, responsive user interface.

## 🚀 Features

### CRUD Operations
- **Create**: Add new tasks with title, description, status, and priority
- **Read**: View all tasks with search and filtering capabilities
- **Update**: Edit existing tasks and update their status
- **Delete**: Remove tasks with confirmation

### UI/UX Features
- Modern, responsive design with Tailwind CSS
- Real-time search and filtering
- Task status management (Pending, In Progress, Completed)
- Priority levels (Low, Medium, High)
- Loading states and error handling
- Confirmation dialogs for destructive actions

### Technical Features
- React hooks for state management
- Supabase integration for backend services
- Real-time database operations
- Environment variable configuration
- Component-based architecture

## 🛠 Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL)
- **Database**: PostgreSQL with Row Level Security

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (version 16 or higher)
- npm or yarn
- A Supabase account and project

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd supabase-crud-app

# Install dependencies
npm install
```

### 2. Supabase Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to be set up

2. **Set up Environment Variables**:
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env with your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Create the Database Table**:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Copy and run this SQL script:

```sql
-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on tasks" ON tasks
    FOR ALL USING (true);
```

### 3. Run the Application

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:5173
```

## 📱 Usage

### Creating Tasks
1. Click the "New Task" button
2. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Status (Pending, In Progress, Completed)
   - Priority (Low, Medium, High)
3. Click "Create Task"

### Viewing Tasks
- All tasks are displayed in a responsive grid layout
- Use the search bar to find specific tasks
- Filter by status or priority using the dropdown filters
- Click "Clear filters" to reset all filters

### Updating Tasks
- Click the edit icon (pencil) on any task card
- Modify the task details in the form
- Click "Update Task" to save changes
- You can also quickly change status using the dropdown in the task card

### Deleting Tasks
- Click the delete icon (trash) on any task card
- Confirm the deletion in the popup dialog
- The task will be permanently removed

## 🏗 Project Structure

```
src/
├── components/
│   ├── TaskForm.jsx       # Form for creating/editing tasks
│   ├── TaskCard.jsx       # Individual task display
│   ├── TaskList.jsx       # List view with search/filter
│   └── DatabaseSetup.jsx  # Setup guide component
├── hooks/
│   └── useTasks.js        # Custom hook for task operations
├── lib/
│   └── supabase.js        # Supabase client and API functions
├── App.jsx                # Main application component
├── main.jsx              # Application entry point
└── index.css             # Global styles and Tailwind
```

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔐 Security Considerations

The current setup uses a basic RLS policy that allows all operations. For production use, consider:

1. **Authentication**: Implement user authentication
2. **Row Level Security**: Create policies based on user ownership
3. **API Keys**: Use service role keys for server-side operations only
4. **Environment Variables**: Never commit real credentials to version control

Example RLS policy for authenticated users:
```sql
-- Only allow users to manage their own tasks
CREATE POLICY "Users can manage own tasks" ON tasks
    FOR ALL USING (auth.uid() = user_id);
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

**"Missing Supabase environment variables"**
- Make sure you've created a `.env` file with the correct variables
- Restart the development server after adding environment variables

**"Error fetching tasks"**
- Check that your Supabase project is active
- Verify the database table was created correctly
- Ensure RLS policies allow the operations

**"Build errors"**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for any missing dependencies

### Getting Help

- Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- React documentation: [react.dev](https://react.dev)
- Tailwind CSS documentation: [tailwindcss.com](https://tailwindcss.com)

## ✨ Demo

The application includes:
- ✅ Create new tasks with form validation
- ✅ Read/view all tasks with search and filtering
- ✅ Update existing tasks inline or via edit form
- ✅ Delete tasks with confirmation
- ✅ Real-time database synchronization
- ✅ Responsive design for all devices
- ✅ Loading states and error handling
- ✅ Modern UI with Tailwind CSS

Perfect for learning CRUD operations, React hooks, and Supabase integration!