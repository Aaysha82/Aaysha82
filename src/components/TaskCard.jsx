import { useState } from 'react'
import { Edit2, Trash2, Calendar, Flag } from 'lucide-react'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800'
}

const priorityColors = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600'
}

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed'
}

export function TaskCard({ task, onEdit, onDelete, onUpdateStatus }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true)
      try {
        await onDelete(task.id)
      } catch (error) {
        console.error('Error deleting task:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await onUpdateStatus(task.id, { status: newStatus })
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-3">
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded"
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-4 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Status:</span>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`text-xs px-2 py-1 rounded-full font-medium border-0 ${statusColors[task.status]}`}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <Flag size={14} className={priorityColors[task.priority]} />
          <span className={`text-sm font-medium ${priorityColors[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>Created: {formatDate(task.created_at)}</span>
        </div>
        {task.updated_at !== task.created_at && (
          <div className="flex items-center gap-1">
            <span>Updated: {formatDate(task.updated_at)}</span>
          </div>
        )}
      </div>
    </div>
  )
}