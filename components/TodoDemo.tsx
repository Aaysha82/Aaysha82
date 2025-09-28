import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Todo } from '../lib/supabase'

interface TodoDemoProps {
  user: any
}

export default function TodoDemo({ user }: TodoDemoProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTodos()
  }, [user])

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error: any) {
      console.error('Error fetching todos:', error.message)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            title: newTodo,
            user_id: user.id,
            completed: false
          }
        ])
        .select()

      if (error) throw error
      if (data) {
        setTodos([data[0], ...todos])
        setNewTodo('')
      }
    } catch (error: any) {
      console.error('Error adding todo:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id)

      if (error) throw error
      
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ))
    } catch (error: any) {
      console.error('Error updating todo:', error.message)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error: any) {
      console.error('Error deleting todo:', error.message)
    }
  }

  return (
    <div className="demo-section">
      <h2>📝 Todo Demo</h2>
      <p>Create, read, update, and delete todos with Row Level Security (RLS).</p>
      
      <form onSubmit={addTodo} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Add a new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="input"
            style={{ margin: 0, flex: 1 }}
          />
          <button
            type="submit"
            className="button"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>

      {todos.length === 0 ? (
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
          No todos yet. Add one above!
        </p>
      ) : (
        <div>
          {todos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <span>{todo.title}</span>
              <div className="todo-actions">
                <button
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className="button"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  {todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="button secondary"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="code-block">
        <pre>{`// CRUD operations with Row Level Security
const { data, error } = await supabase
  .from('todos')
  .select('*')
  .eq('user_id', user.id)  // RLS ensures users only see their own todos

const { data, error } = await supabase
  .from('todos')
  .insert([{ title: 'New todo', user_id: user.id }])

const { error } = await supabase
  .from('todos')
  .update({ completed: true })
  .eq('id', todoId)`}</pre>
      </div>
    </div>
  )
}