import { useState } from 'react'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { DatabaseSetup } from './components/DatabaseSetup'
import { useTasks } from './hooks/useTasks'
import { Database, Plus, RefreshCw } from 'lucide-react'

function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask, refetch } = useTasks()
  const [showForm, setShowForm] = useState(false)
  const [showSetup, setShowSetup] = useState(false)

  const handleCreateTask = async (taskData) => {
    await createTask(taskData)
    setShowForm(false)
  }

  const handleRefresh = () => {
    refetch()
  }

  // Check if we have environment variables configured
  const isConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Database className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Supabase CRUD App
                </h1>
                <p className="text-gray-600">
                  Complete task management with Create, Read, Update, Delete operations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSetup(!showSetup)}
                className="btn-secondary flex items-center gap-2"
              >
                <Database size={16} />
                Setup Guide
              </button>
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>

              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={16} />
                New Task
              </button>
            </div>
          </div>

          {/* Configuration Status */}
          <div className="mt-4">
            {isConfigured ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Supabase connected
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Supabase not configured - check your environment variables
              </div>
            )}
          </div>
        </div>

        {/* Database Setup Guide */}
        {showSetup && (
          <div className="mb-8">
            <DatabaseSetup />
          </div>
        )}

        {/* Create Task Form */}
        {showForm && (
          <div className="mb-8">
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* CRUD Operations Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">C</div>
            <div className="text-sm text-gray-600 mt-1">Create</div>
            <div className="text-xs text-gray-500">Add new tasks</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">R</div>
            <div className="text-sm text-gray-600 mt-1">Read</div>
            <div className="text-xs text-gray-500">View all tasks</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">U</div>
            <div className="text-sm text-gray-600 mt-1">Update</div>
            <div className="text-xs text-gray-500">Edit existing tasks</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600">D</div>
            <div className="text-sm text-gray-600 mt-1">Delete</div>
            <div className="text-xs text-gray-500">Remove tasks</div>
          </div>
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
          loading={loading}
          error={error}
        />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-500 text-sm">
            <p>Built with React, Vite, Tailwind CSS, and Supabase</p>
            <p className="mt-1">Demonstrating full CRUD operations with real-time database integration</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App