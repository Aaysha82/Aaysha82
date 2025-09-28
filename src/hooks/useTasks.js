import { useState, useEffect } from 'react'
import { taskService } from '../lib/supabase'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await taskService.getTasks()
      setTasks(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create a new task
  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData)
      setTasks(prev => [newTask, ...prev])
      return newTask
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Update an existing task
  const updateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates)
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ))
      return updatedTask
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id)
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  }
}