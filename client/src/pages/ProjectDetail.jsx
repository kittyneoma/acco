import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import TaskModal from '../components/TaskModal';
import calendarIcon from '../icons/calendar-icon.png';
import './ProjectDetail.css';

const STATUS_LABELS = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'review': 'Review',
  'completed': 'Completed',
  'blocked': 'Blocked'
};

const PROJECT_STATUSES = ['active', 'on-hold', 'completed', 'archived'];
const TASK_STATUSES = ['todo', 'in-progress', 'review', 'completed', 'blocked'];

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectService.getProject(id),
        taskService.getTasks(id)
      ]);
      setProject(projectRes.data.project);
      setTasks(tasksRes.data.tasks);
    } catch (err) {
      setError(err.message || 'Error loading project data');
    } finally {
      setLoading(false);
    }
  };

  // actualiza el status del proyecto
  const handleProjectStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await projectService.updateProject(id, { status: newStatus });
      setProject(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error('Failed to update project status', err);
    }
  };

  // actualiza el status de una tarea
  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  // agrega la nueva tarea a la lista sin recargar
  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  // estados de carga y error
  if (loading) {
    return (
      <div className="project-detail-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail-container">
        <div className="alert alert-error">{error || 'Project not found'}</div>
        <Link to="/dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="project-detail-container">

      {/* header del proyecto */}
      <div className="project-detail-header">
        <Link to="/dashboard" className="back-button">↩ Go Back</Link>
        <div className="project-title-row">
          <div
            className="project-color-dot"
            style={{ background: project.color }}
          />
          <h1>{project.name}</h1>

          {/* status edtable del proyecto */}
          <select
            className={`status-select status-${project.status}`}
            value={project.status}
            onChange={handleProjectStatusChange}
          >
            {PROJECT_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}

          </select>
        </div>

        {project.description && (
          <p className="project-detail-desc">{project.description}</p>
        )}
      </div>

      {/* stats */}
      <div className="project-stats-grid">
        <div className="stat-card card">
          <span className="stat-label">Total Tasks</span>
          <p className="stat-number">{project.stats?.total || 0}</p>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Completed</span>
          <p className="stat-number">{project.stats?.completed || 0}</p>
        </div>
        <div className="stat-card card">
          <span className="stat-label">In Progress</span>
          <p className="stat-number">{project.stats?.['in-progress'] || 0}</p>
        </div>
        <div className="stat-card card">
          <span className="stat-label">Progress</span>
          <p className="stat-number">{project.progress || 0}%</p>
        </div>
      </div>

      {/* barra de progreso */}
      <div className="detail-progress-bar">
        <div
          className="detail-progress-fill"
          style={{
            width: `${project.progress || 0}%`,
            background: project.color
          }}
        />
      </div>

      {/* seccion de tareas */}
      <div className="tasks-section">
        <div className="tasks-header">
          <h2>Tasks</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowTaskModal(true)}
          >
            + New Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state card">
            <p>No tasks in this project yet</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowTaskModal(true)}
            >
              Create First Task
            </button>
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map(task => (
              <div key={task._id} className="task-item card">
                <div className="task-item-header">
                  <h4 className="task-title">{task.title}</h4>
                  <div className="task-badges">

                    {/* status editable de la tarea */}
                    <select
                      className={`status-select status-${task.status}`}
                      value={task.status}
                      onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                    >
                      {TASK_STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>
                      ))}
                    </select>

                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>

                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}

                {task.dueDate && (
                  <p className={`task-due ${task.isOverdue ? 'overdue' : ''}`}>
                    <span className="task-due-content">
                      <img src={calendarIcon} alt="Calendar" className="task-due-icon" />
                      {new Date(task.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                      {task.isOverdue && ' — Overdue'}
                    </span>
                  </p>
                )}
              </div>
            ))} 
          </div>
        )}
      </div>

      {/* modal de nueva tarea */}
      {showTaskModal && (
        <TaskModal
          projectId={id}
          onClose={() => setShowTaskModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

    </div>
  );
};

export default ProjectDetail;