import { useState } from 'react'
import { Database, CheckCircle, AlertCircle } from 'lucide-react'

export function DatabaseSetup() {
  const [isSetup, setIsSetup] = useState(false)

  const sqlScript = `-- Create the tasks table
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

-- Create policy to allow all operations (adjust as needed for your auth requirements)
CREATE POLICY "Allow all operations on tasks" ON tasks
    FOR ALL USING (true);`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript)
      setIsSetup(true)
      setTimeout(() => setIsSetup(false), 3000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  return (
    <div className="card bg-blue-50 border border-blue-200">
      <div className="flex items-start gap-3">
        <Database className="text-blue-600 mt-1" size={24} />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Database Setup Required
          </h3>
          <p className="text-blue-800 mb-4">
            To use this CRUD application, you need to set up the database table in your Supabase project.
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Steps to set up:</h4>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Go to your Supabase project dashboard</li>
              <li>Navigate to the SQL Editor</li>
              <li>Copy the SQL script below and paste it into the editor</li>
              <li>Click "Run" to execute the script</li>
              <li>Set up your environment variables (.env file)</li>
            </ol>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">SQL Script</span>
              <button
                onClick={copyToClipboard}
                className={`text-xs px-3 py-1 rounded ${
                  isSetup 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSetup ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle size={12} />
                    Copied!
                  </span>
                ) : (
                  'Copy SQL'
                )}
              </button>
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{sqlScript}</code>
            </pre>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
              <div>
                <h5 className="font-medium text-yellow-800">Environment Variables</h5>
                <p className="text-sm text-yellow-700 mt-1">
                  Don't forget to create a <code className="bg-yellow-100 px-1 rounded">.env</code> file 
                  with your Supabase URL and anon key. Use <code className="bg-yellow-100 px-1 rounded">.env.example</code> as a template.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}