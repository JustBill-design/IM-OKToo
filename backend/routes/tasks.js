"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../src/db"));
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.query;
    if (!username) {
        return res.status(400).json({ error: 'Missing username in query' });
    }
    try {
        const db = yield (0, db_1.default)();
        const [tasks] = yield db.execute('SELECT * FROM Tasks WHERE username = ? ORDER BY created_at DESC', [username]);
        res.json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
}));
// POST /api/tasks
// Create a new task for a user
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task_description, username } = req.body;
    if (!task_description || !username) {
        return res.status(400).json({ error: 'task_description and username are required' });
    }
    try {
        const db = yield (0, db_1.default)();
        const [result] = yield db.execute('INSERT INTO Tasks (task_description, username) VALUES (?, ?)', [task_description, username]);
        const insertId = result.insertId;
        const [newTaskRows] = yield db.execute('SELECT * FROM Tasks WHERE task_id = ?', [insertId]);
        const newTask = newTaskRows[0];
        res.status(201).json(newTask);
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
}));
// PATCH /api/tasks/:id
// Toggle or update task completion
router.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { completed } = req.body;
    if (completed === undefined) {
        return res.status(400).json({ error: 'completed status required in body' });
    }
    try {
        const db = yield (0, db_1.default)();
        yield db.execute('UPDATE Tasks SET completed = ? WHERE task_id = ?', [completed, id]);
        const [updatedTaskRows] = yield db.execute('SELECT * FROM Tasks WHERE task_id = ?', [id]);
        const updatedTask = updatedTaskRows[0];
        res.json(updatedTask);
    }
    catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
}));
// DELETE /api/tasks/:id
// Delete a task by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const db = yield (0, db_1.default)();
        yield db.execute('DELETE FROM Tasks WHERE task_id = ?', [id]);
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
}));
exports.default = router;
