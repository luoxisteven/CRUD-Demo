import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Task, TaskStatus } from '../types/Task';

const Home = () => {
  const { tasks, error, createTask, updateTask, deleteTask } = useTasks();
  const [editingId, setEditingId] = useState<number | null>(null);
  // For Create and Updating task
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Done'>('To Do');

  const [openList, setOpenList] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title, description, status };
    
    try {
      if (editingId) {
        await updateTask(editingId, data);
        setEditingId(null);
      } else {
        await createTask(data);
      }
      resetForm();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id!);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setStatus('To Do');
  };

  const toggleList = () => {
    setOpenList(!openList);
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>
      
      {error && <div className="error-message">{error}</div>}

      {/* Simple Form */}
      <div className="card">
        <h2>{editingId ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <textarea
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <select
              value={status}
              onChange={e => setStatus(e.target.value as TaskStatus)} // Default String
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          
          <div className="button-group">
            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
            <button type="submit">
              {editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      {/* Task List */}
      <button className="toggle-list" onClick={toggleList}>
        {openList ? 'Hide Task List' : 'Show Task List'}
      </button>
      {openList && (
      <div className="card">
        <h2>Task List</h2>
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="task-row">
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>
                  <button onClick={() => startEdit(task)}>Edit</button>
                  <button onClick={() => deleteTask(task.id!)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>    
  );
};

export default Home;