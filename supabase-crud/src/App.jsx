import React, { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

function useSupabaseClient() {
	const url = import.meta.env.VITE_SUPABASE_URL
	const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
	return useMemo(() => {
		if (!url || !anonKey) return null
		return createClient(url, anonKey)
	}, [url, anonKey])
}

export default function App() {
	const supabase = useSupabaseClient()
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [form, setForm] = useState({ id: null, title: '', details: '' })

	const isEditing = form.id !== null

	async function loadItems() {
		if (!supabase) return
		setLoading(true)
		setError('')
		const { data, error: err } = await supabase
			.from('todos')
			.select('*')
			.order('id', { ascending: true })
		setLoading(false)
		if (err) return setError(err.message)
		setItems(data ?? [])
	}

	useEffect(() => {
		loadItems()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supabase])

	function handleChange(e) {
		const { name, value } = e.target
		setForm(prev => ({ ...prev, [name]: value }))
	}

	async function handleSubmit(e) {
		e.preventDefault()
		if (!supabase) return
		setError('')
		if (!form.title.trim()) {
			setError('Title is required')
			return
		}
		if (isEditing) {
			const { error: err } = await supabase
				.from('todos')
				.update({ title: form.title, details: form.details })
				.eq('id', form.id)
			if (err) return setError(err.message)
		} else {
			const { error: err } = await supabase
				.from('todos')
				.insert({ title: form.title, details: form.details })
			if (err) return setError(err.message)
		}
		setForm({ id: null, title: '', details: '' })
		await loadItems()
	}

	async function handleEdit(item) {
		setForm({ id: item.id, title: item.title ?? '', details: item.details ?? '' })
	}

	async function handleDelete(id) {
		if (!supabase) return
		setError('')
		const { error: err } = await supabase.from('todos').delete().eq('id', id)
		if (err) return setError(err.message)
		await loadItems()
	}

	return (
		<div style={{ width: 'min(880px, 100%)', padding: 24 }}>
			<h1>Supabase CRUD</h1>
			<p>Basic create, read, update, delete on table <code>todos</code>.</p>

			{!supabase && (
				<div style={{ padding: 12, border: '1px solid #f00', borderRadius: 8, marginBottom: 16 }}>
					<strong>Missing env:</strong> Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code>.
				</div>
			)}

			<form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
				<input
					name="title"
					placeholder="Title"
					value={form.title}
					onChange={handleChange}
					style={{ padding: 10, borderRadius: 8, border: '1px solid #888' }}
				/>
				<textarea
					name="details"
					placeholder="Details"
					value={form.details}
					onChange={handleChange}
					rows={3}
					style={{ padding: 10, borderRadius: 8, border: '1px solid #888' }}
				/>
				<div style={{ display: 'flex', gap: 8 }}>
					<button type="submit" style={{ padding: '10px 14px', borderRadius: 8 }}>
						{isEditing ? 'Update' : 'Add'}
					</button>
					{isEditing && (
						<button
							type="button"
							onClick={() => setForm({ id: null, title: '', details: '' })}
							style={{ padding: '10px 14px', borderRadius: 8 }}
						>
							Cancel
						</button>
					)}
				</div>
			</form>

			{error && (
				<div style={{ color: 'tomato', marginBottom: 12 }}>
					{error}
				</div>
			)}

			<div style={{ display: 'grid', gap: 8 }}>
				{loading && <div>Loading…</div>}
				{!loading && items.length === 0 && <div>No items yet.</div>}
				{items.map(item => (
					<div key={item.id} style={{ padding: 12, border: '1px solid #555', borderRadius: 8 }}>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<div>
								<div style={{ fontWeight: 600 }}>{item.title}</div>
								<div style={{ opacity: 0.8 }}>{item.details}</div>
							</div>
							<div style={{ display: 'flex', gap: 8 }}>
								<button onClick={() => handleEdit(item)} style={{ padding: '6px 10px', borderRadius: 6 }}>Edit</button>
								<button onClick={() => handleDelete(item.id)} style={{ padding: '6px 10px', borderRadius: 6 }}>Delete</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
