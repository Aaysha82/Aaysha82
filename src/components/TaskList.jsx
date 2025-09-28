import { useState } from 'react'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import { Search, Filter } from 'lucide-react'

export function TaskList({ tasks, onUpdate, onDelete, loading, error }) {
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const handleEdit = (task) => {
    setEditingTask(task)
  }

  const handleUpdate = async (updatedData) => {
    await onUpdate(editingTask.id, updatedData)
    setEditingTask(null)
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  // Filter tasks based on search term and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading tasks...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card bg-red-50 border border-red-200">
        <div className="text-red-800">
          <h3 className="font-semibold mb-2">Error loading tasks</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field min-w-0"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field min-w-0"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Edit Task Form */}
      {editingTask && (
        <TaskForm
          initialData={editingTask}
          onSubmit={handleUpdate}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Task Count */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Tasks ({filteredTasks.length})
        </h2>
        {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setPriorityFilter('all')
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-500">
            {tasks.length === 0 ? (
              <>
                <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                <p>Create your first task to get started!</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">No tasks match your filters</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={onDelete}
              onUpdateStatus={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}