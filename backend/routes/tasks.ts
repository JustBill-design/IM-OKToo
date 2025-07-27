import express from 'express'
import getConnection from '../src/db'
import { ResultSetHeader } from 'mysql2'

interface Task {
    task_id: number;
    task_description: string;
    username: string;
    completed: boolean;
    created_at: string;
  }
  
const router = express.Router()

router.get('/', async (req, res) => {
  const { username } = req.query
  if (!username) {
    return res.status(400).json({ error: 'Missing username in query' })
  }

  try {
    const db = await getConnection()
    const [tasks] = await db.execute(
      'SELECT * FROM Tasks WHERE username = ? ORDER BY created_at DESC',
      [username]
    )
    res.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// ========================================
// POST /api/tasks
// Create a new task for a user
// Body: { task_description: string, user_id: number }
// ========================================
router.post('/', async (req, res) => {
  const { task_description, username } = req.body

  if (!task_description || !username) {
    return res.status(400).json({ error: 'task_description and username are required' })
  }

  try {
    const db = await getConnection()
    const [result] = await db.execute(
      'INSERT INTO Tasks (task_description, username) VALUES (?, ?)',
      [task_description, username]
    )

    const insertId = (result as ResultSetHeader).insertId

    const [newTaskRows] = await db.execute('SELECT * FROM Tasks WHERE task_id = ?', [insertId])
    const newTask = (newTaskRows as Task[])[0]
    res.status(201).json(newTask)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// ========================================
// PATCH /api/tasks/:id
// Toggle or update task completion
// Body: { completed: boolean }
// ========================================
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { completed } = req.body

  if (completed === undefined) {
    return res.status(400).json({ error: 'completed status required in body' })
  }

  try {
    const db = await getConnection()
    await db.execute('UPDATE Tasks SET completed = ? WHERE task_id = ?', [completed, id])

    const [updatedTaskRows] = await db.execute('SELECT * FROM Tasks WHERE task_id = ?', [id])
    const updatedTask = (updatedTaskRows as Task[])[0]
    res.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// ========================================
// DELETE /api/tasks/:id
// Delete a task by ID
// ========================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const db = await getConnection()
    await db.execute('DELETE FROM Tasks WHERE task_id = ?', [id])
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

export default router
